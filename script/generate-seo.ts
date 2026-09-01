/**
 * Emits the base-path-aware metadata files into client/public/ so Vite copies
 * them into dist/: sitemap.xml, robots.txt, manifest.json, browserconfig.xml
 * and opensearch.xml.
 *
 * These are generated rather than committed because every URL inside them has
 * to honour BASE_PATH and SITE_DOMAIN — a committed "/favicon.png" silently
 * 404s the moment the site is deployed as a project page.
 *
 * Run: `npm run generate-seo`
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { allRoutes } from "./routes.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DIR = path.join(ROOT, "client", "public");

const SITE_ORIGIN = (process.env.SITE_DOMAIN || "https://affordablegolfcartservice.com").replace(/\/$/, "");
const BASE_PATH = normaliseBase(process.env.BASE_PATH || "/");

function normaliseBase(raw: string): string {
  if (!raw || raw === "/") return "/";
  return `/${raw.replace(/^\/+|\/+$/g, "")}/`;
}

/** Site-relative route path -> absolute URL, honouring BASE_PATH. */
function absolute(routePath: string): string {
  if (routePath === "/") return SITE_ORIGIN + BASE_PATH;
  return SITE_ORIGIN + BASE_PATH + routePath.replace(/^\/+/, "");
}

function xmlEscape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

async function main() {
  console.log("→ generate-seo: sitemap.xml + robots.txt");

  const routes = allRoutes();
  const lastmod = new Date().toISOString().slice(0, 10);

  const urls = routes
    .map((r) => {
      const loc = absolute(r.path);
      return (
        `  <url>\n` +
        `    <loc>${xmlEscape(loc)}</loc>\n` +
        `    <lastmod>${lastmod}</lastmod>\n` +
        `    <changefreq>${r.changefreq}</changefreq>\n` +
        `    <priority>${r.priority.toFixed(1)}</priority>\n` +
        `  </url>`
      );
    })
    .join("\n");

  const sitemap =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  await writeFile(path.join(PUBLIC_DIR, "sitemap.xml"), sitemap, "utf8");

  const robots =
    `# Affordable Golf Cart Service\n` +
    `User-agent: *\n` +
    `Allow: /\n\n` +
    `# AI / LLM crawlers are welcome; see llms.txt for a plain-text summary.\n` +
    `User-agent: GPTBot\nAllow: /\n\n` +
    `User-agent: ClaudeBot\nAllow: /\n\n` +
    `User-agent: PerplexityBot\nAllow: /\n\n` +
    `Sitemap: ${SITE_ORIGIN}${BASE_PATH}sitemap.xml\n`;

  await writeFile(path.join(PUBLIC_DIR, "robots.txt"), robots, "utf8");

  /* ------------------------------------------------------------ manifest */
  const shortcut = (name: string, url: string, description: string) => ({
    name,
    short_name: name,
    description,
    url: BASE_PATH + url,
    icons: [{ src: BASE_PATH + "favicon.png", sizes: "192x192" }],
  });

  const manifest = {
    name: "Affordable Golf Cart Service",
    short_name: "Golf Cart Service",
    description:
      "Professional golf cart service, repair, and maintenance. Over 100 services including tune-ups, battery replacement, brake service, and custom upgrades.",
    start_url: BASE_PATH,
    scope: BASE_PATH,
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#e7682e",
    orientation: "portrait-primary",
    lang: "en-US",
    dir: "ltr",
    categories: ["business", "automotive", "services"],
    icons: [
      { src: BASE_PATH + "apple-touch-icon.png", sizes: "180x180", type: "image/png", purpose: "any" },
      { src: BASE_PATH + "favicon.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
    ],
    shortcuts: [
      shortcut("Services", "services", "View all golf cart services"),
      shortcut("Locations", "locations", "Find a service location"),
      shortcut("Contact", "contact", "Contact us"),
    ],
    prefer_related_applications: false,
  };
  await writeFile(path.join(PUBLIC_DIR, "manifest.json"), JSON.stringify(manifest), "utf8");

  /* ------------------------------------------------------- browserconfig */
  await writeFile(
    path.join(PUBLIC_DIR, "browserconfig.xml"),
    `<?xml version="1.0" encoding="utf-8"?>\n<browserconfig><msapplication><tile>` +
      `<square150x150logo src="${BASE_PATH}favicon.png"/><TileColor>#e7682e</TileColor>` +
      `</tile></msapplication></browserconfig>\n`,
    "utf8",
  );

  /* ---------------------------------------------------------- opensearch */
  await writeFile(
    path.join(PUBLIC_DIR, "opensearch.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">\n` +
      `  <ShortName>Affordable Golf Cart Service</ShortName>\n` +
      `  <Description>Search Affordable Golf Cart Service for golf cart repair and maintenance services</Description>\n` +
      `  <InputEncoding>UTF-8</InputEncoding>\n` +
      `  <Image width="16" height="16" type="image/png">${SITE_ORIGIN}${BASE_PATH}favicon.png</Image>\n` +
      `  <Url type="text/html" template="${SITE_ORIGIN}${BASE_PATH}services?q={searchTerms}"/>\n` +
      `  <Contact>info@affordablegolfcartservice.com</Contact>\n` +
      `  <LongName>Affordable Golf Cart Service - Golf Cart Repair and Maintenance</LongName>\n` +
      `  <Developer>Affordable Golf Cart Service</Developer>\n` +
      `  <Language>en-US</Language>\n` +
      `</OpenSearchDescription>\n`,
    "utf8",
  );

  console.log(
    `✓ generate-seo: ${routes.length} URLs in sitemap.xml; robots.txt, manifest.json, ` +
      `browserconfig.xml, opensearch.xml written for base "${BASE_PATH}"`,
  );
}

main().catch((err) => {
  console.error("✗ generate-seo failed:", err);
  process.exit(1);
});
