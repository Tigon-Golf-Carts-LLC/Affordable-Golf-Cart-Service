/**
 * Prerender every known route into a real index.html.
 *
 * Runs the SSR build of the app (`.ssr/entry-server.js`) once per route and
 * writes the markup into the Vite-built `dist/index.html` shell, along with
 * per-page title / description / canonical / OG / Twitter tags. The result is
 * a directly linkable, crawlable HTML file for every URL — `/contact/index.html`,
 * `/locations/dover-de/index.html`, and so on — that still boots the SPA and
 * hydrates on top of the served markup.
 *
 * Also emits the three files GitHub Pages needs: 404.html (deep links resolve
 * even before JS runs), .nojekyll (serve _-prefixed paths), and CNAME (Pages
 * wipes it on every deploy, so it is rewritten on every build).
 *
 * Run: `npm run prerender`
 */
import { cp, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { minify } from "html-minifier-terser";
import { allRoutes, type RouteMeta } from "./routes.ts";
import { NOT_FOUND_SEO } from "../shared/seo.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const SSR_ENTRY = path.join(ROOT, ".ssr", "entry-server.js");

const SITE_ORIGIN = (process.env.SITE_DOMAIN || "https://affordablegolfcartservice.com").replace(/\/$/, "");
const CUSTOM_DOMAIN = process.env.CUSTOM_DOMAIN ?? SITE_ORIGIN.replace(/^https?:\/\//, "");
const BASE_PATH = normaliseBase(process.env.BASE_PATH || "/");

function normaliseBase(raw: string): string {
  if (!raw || raw === "/") return "/";
  return `/${raw.replace(/^\/+|\/+$/g, "")}/`;
}

function absolute(routePath: string): string {
  if (routePath === "/") return SITE_ORIGIN + BASE_PATH;
  return SITE_ORIGIN + BASE_PATH + routePath.replace(/^\/+/, "");
}

function htmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** The full <head> SEO block for one route. */
function seoBlock(route: RouteMeta): string {
  const canonical = absolute(route.path);
  const ogImage = SITE_ORIGIN + BASE_PATH + "og-image.png";
  const title = htmlEscape(route.title);
  const description = htmlEscape(route.description);

  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Affordable Golf Cart Service" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${ogImage}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="article:publisher" content="https://www.facebook.com/AffordableGolfCartService/" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${ogImage}" />`,
    `<meta name="twitter:site" content="@AffordableGolfCartService" />`,
  ].join("\n    ");
}

/** The origin baked into the committed public text files. */
const DEFAULT_ORIGIN = "https://affordablegolfcartservice.com";
const REWRITABLE = /\.(txt|xml|json)$/;

/**
 * Point the hand-written public files (llms.txt, feed.xml, schema.json, ...) at
 * whatever SITE_DOMAIN and BASE_PATH this build is for. Only dist/ is touched,
 * so the sources stay canonical and repeated builds stay idempotent.
 */
async function rewriteSiteUrls(dir: string): Promise<number> {
  const target = SITE_ORIGIN + BASE_PATH.replace(/\/$/, "");
  if (target === DEFAULT_ORIGIN) return 0;

  let count = 0;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "data" || entry.name === "assets" || entry.name === "img") continue;
      count += await rewriteSiteUrls(full);
    } else if (REWRITABLE.test(entry.name)) {
      const raw = await readFile(full, "utf8");
      if (!raw.includes(DEFAULT_ORIGIN)) continue;
      await writeFile(full, raw.split(DEFAULT_ORIGIN).join(target), "utf8");
      count++;
    }
  }
  return count;
}

const SEO_MARKER = /<!--seo:start-->[\s\S]*?<!--seo:end-->/;

/**
 * Minification has to stay hydration-safe.
 *
 * `conservativeCollapse` reduces runs of whitespace to a single space but never
 * deletes one: React emits a real space between `</a>` and the following text,
 * and dropping it changes the text node, which fails hydration on every page.
 *
 * `removeComments` is off for the same reason — `renderToString` writes
 * `<!-- -->` markers to separate adjacent text nodes, and they are load-bearing.
 */
const MINIFY_OPTIONS = {
  collapseWhitespace: true,
  conservativeCollapse: true,
  removeComments: false,
  minifyCSS: true,
  minifyJS: true,
  removeRedundantAttributes: false,
  keepClosingSlash: true,
} as const;

async function main() {
  console.log("→ prerender: writing one HTML file per route");

  const template = await readFile(path.join(DIST, "index.html"), "utf8");
  if (!SEO_MARKER.test(template)) {
    throw new Error("dist/index.html is missing the <!--seo:start--> marker");
  }
  if (!template.includes("<!--app-html-->")) {
    throw new Error("dist/index.html is missing the <!--app-html--> placeholder");
  }

  const { prepare, render } = (await import(pathToFileURL(SSR_ENTRY).href)) as {
    prepare: () => Promise<void>;
    render: (url: string) => string;
  };
  // Warm every route chunk so renderToString never suspends.
  await prepare();

  const routes = allRoutes();
  let written = 0;

  for (const route of routes) {
    // wouter's ssrPath is matched against `base`, so feed it the full path.
    const ssrPath = BASE_PATH.replace(/\/$/, "") + route.path;
    const appHtml = render(ssrPath);

    let html = template
      .replace(SEO_MARKER, seoBlock(route))
      .replace('<div id="root"><!--app-html--></div>', `<div id="root" data-prerendered="true">${appHtml}</div>`);

    html = await minify(html, MINIFY_OPTIONS);

    const outFile =
      route.path === "/" ? path.join(DIST, "index.html") : path.join(DIST, route.path.replace(/^\//, ""), "index.html");

    await mkdir(path.dirname(outFile), { recursive: true });
    await writeFile(outFile, html, "utf8");
    written++;
  }

  // 404.html: GitHub Pages serves this for any unmatched path. Rendering the
  // NotFound route (rather than copying the home page) means a mistyped URL
  // shows a real 404 page, and the SPA still takes over on hydration.
  const notFoundHtml = await minify(
    template
      .replace(
        SEO_MARKER,
        seoBlock({ path: "/404", ...NOT_FOUND_SEO, priority: 0.1, changefreq: "yearly" }),
      )
      .replace(
        '<div id="root"><!--app-html--></div>',
        `<div id="root" data-prerendered="true">${render(BASE_PATH.replace(/\/$/, "") + "/404")}</div>`,
      ),
    MINIFY_OPTIONS,
  );
  await writeFile(path.join(DIST, "404.html"), notFoundHtml, "utf8");

  // Serve paths and files that begin with an underscore.
  await writeFile(path.join(DIST, ".nojekyll"), "", "utf8");

  // Pages wipes CNAME on every deploy, so write it on every build.
  if (CUSTOM_DOMAIN && BASE_PATH === "/") {
    await writeFile(path.join(DIST, "CNAME"), CUSTOM_DOMAIN + "\n", "utf8");
    console.log(`  CNAME -> ${CUSTOM_DOMAIN}`);
  } else if (CUSTOM_DOMAIN) {
    console.log(`  CNAME skipped: BASE_PATH is "${BASE_PATH}" (project site, not a custom domain)`);
  }

  const rewritten = await rewriteSiteUrls(DIST);
  if (rewritten) console.log(`  rewrote the site origin in ${rewritten} static text file(s)`);

  // Publish the data snapshot alongside the site so it is addressable and
  // reviewable, not just baked into the bundle.
  await cp(path.join(ROOT, "client", "src", "data"), path.join(DIST, "data"), { recursive: true });

  console.log(`✓ prerender: ${written} routes + 404.html, .nojekyll, data/ snapshot`);
}

main().catch((err) => {
  console.error("✗ prerender failed:", err);
  process.exit(1);
});
