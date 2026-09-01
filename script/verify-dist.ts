/**
 * Post-build gate. Fails loudly rather than shipping a broken Pages deploy.
 *
 * Checks: required files exist, no oversized files, no same-origin API calls or
 * localhost references or leaked secret names in the bundle, images are served
 * as WebP/AVIF with a srcset. Prints total size and the 20 largest files.
 *
 * Run: `npm run verify`
 */
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");

/** Fail the build past these. */
const HARD_FILE_LIMIT = 100 * 1024 * 1024; // GitHub Pages rejects any file above this
const FILE_LIMIT = 25 * 1024 * 1024;
const TOTAL_LIMIT = 500 * 1024 * 1024;
const WARN_FILE = 1024 * 1024;

/** Env var names that must never appear in shipped output. */
const SECRET_NAMES = ["DATA_API_KEY", "DATABASE_URL", "SESSION_SECRET", "GITHUB_TOKEN", "NPM_TOKEN"];

const REQUIRED = [
  "index.html",
  "404.html",
  ".nojekyll",
  "sitemap.xml",
  "robots.txt",
  "data/services.json",
  "data/locations.json",
  "data/states.json",
  path.join("contact", "index.html"),
  path.join("locations", "index.html"),
];

interface Entry {
  rel: string;
  size: number;
}

const problems: string[] = [];
const warnings: string[] = [];

function fmt(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

async function walk(dir: string, base = DIST): Promise<Entry[]> {
  const out: Entry[] = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(full, base)));
    else out.push({ rel: path.relative(base, full), size: (await stat(full)).size });
  }
  return out;
}

async function main() {
  console.log("→ verify-dist");

  const files = await walk(DIST);
  const byPath = new Map(files.map((f) => [f.rel, f]));

  /* ----------------------------------------------------- required files */
  for (const req of REQUIRED) {
    if (!byPath.has(req)) problems.push(`missing required file: dist/${req}`);
  }

  const routeDirs = files.filter((f) => f.rel.endsWith(path.join("index.html")) && f.rel.includes(path.sep)).length;
  if (routeDirs < 5) problems.push(`only ${routeDirs} prerendered route folders — expected many more`);

  /* -------------------------------------------------------------- sizes */
  const total = files.reduce((n, f) => n + f.size, 0);
  for (const f of files) {
    if (f.size > HARD_FILE_LIMIT) problems.push(`dist/${f.rel} is ${fmt(f.size)} — over the 100 MB GitHub Pages hard cap`);
    else if (f.size > FILE_LIMIT) problems.push(`dist/${f.rel} is ${fmt(f.size)} — over the 25 MB limit`);
    else if (f.size > WARN_FILE) warnings.push(`dist/${f.rel} is ${fmt(f.size)} — over 1 MB`);
  }
  if (total > TOTAL_LIMIT) problems.push(`dist/ total is ${fmt(total)} — over the 500 MB limit`);

  /* ------------------------------------------------ bundle string audit */
  const scanned = files.filter((f) => /\.(js|css|html|json)$/.test(f.rel));
  const hits: string[] = [];
  for (const f of scanned) {
    const text = await readFile(path.join(DIST, f.rel), "utf8");
    // Google Tag Manager legitimately ships in the HTML; only same-origin API
    // calls and localhost references are failures.
    for (const needle of ['"/api/', "'/api/", "`/api/", "fetch(\"/api", "localhost", "127.0.0.1"]) {
      if (text.includes(needle)) hits.push(`dist/${f.rel}: contains ${JSON.stringify(needle)}`);
    }
    for (const secret of SECRET_NAMES) {
      if (text.includes(secret)) hits.push(`dist/${f.rel}: contains secret name ${secret}`);
    }
  }
  if (hits.length) problems.push(...hits);

  /* -------------------------------------------------- image format check */
  const home = await readFile(path.join(DIST, "index.html"), "utf8");
  const hasWebp = /\.webp/.test(home);
  const hasAvif = /\.avif/.test(home);
  const hasSrcset = /srcset=/.test(home);
  if (!hasWebp) problems.push("home page serves no .webp image");
  if (!hasAvif) warnings.push("home page serves no .avif image");
  if (!hasSrcset) problems.push("home page has no srcset — responsive images are not wired up");
  const rawImages = files.filter((f) => /\.(png|jpe?g)$/.test(f.rel) && !/^img\//.test(f.rel) && !/favicon|apple-touch-icon|og-image/.test(f.rel));
  if (rawImages.length) warnings.push(`unoptimised source images in dist/: ${rawImages.map((f) => f.rel).join(", ")}`);

  /* ------------------------------------------------------------ report */
  console.log(`\n  total dist/ size: ${fmt(total)} across ${files.length} files`);
  console.log(`  prerendered route folders: ${routeDirs}`);
  console.log(`  images: webp=${hasWebp} avif=${hasAvif} srcset=${hasSrcset}`);
  console.log("\n  20 largest files");
  console.log("  " + "-".repeat(58));
  for (const f of [...files].sort((a, b) => b.size - a.size).slice(0, 20)) {
    console.log(`  ${fmt(f.size).padStart(10)}  ${f.rel}`);
  }
  console.log("  " + "-".repeat(58));

  if (warnings.length) {
    console.log("\n  warnings");
    for (const w of warnings) console.log(`  ! ${w}`);
  }

  if (problems.length) {
    console.error("\n✗ verify-dist FAILED");
    for (const p of problems) console.error(`  ✗ ${p}`);
    process.exit(1);
  }

  console.log("\n✓ verify-dist passed");
}

main().catch((err) => {
  console.error("✗ verify-dist failed:", err);
  process.exit(1);
});
