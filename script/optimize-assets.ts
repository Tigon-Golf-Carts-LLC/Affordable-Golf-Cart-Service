/**
 * Image + static asset optimisation.
 *
 * Reads originals from `assets/source/` (never shipped) and writes only
 * optimised derivatives into `client/public/img/`, plus a manifest at
 * `client/src/data/image-manifest.json` that `<Img>` reads to build
 * srcset/sizes/width/height.
 *
 * For every source photo:
 *   - downscaled to at most MAX_WIDTH (nothing needs to be 4000px on a page)
 *   - responsive widths 400/800/1200/1600 (never upscaled past the original)
 *   - AVIF (q 55) + WebP (q 80) + a crushed PNG/JPEG fallback
 *   - all EXIF/ICC/metadata stripped
 * SVGs run through SVGO. Standalone PNGs that must stay PNG are crushed in place.
 *
 * Run: `npm run optimize-assets`
 */
import { mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { optimize as svgo } from "svgo";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_DIR = path.join(ROOT, "assets", "source");
const OUT_DIR = path.join(ROOT, "client", "public", "img");
const MANIFEST = path.join(ROOT, "client", "src", "data", "image-manifest.json");

/** Default ladder for photographic content. */
const RESPONSIVE_WIDTHS = [400, 800, 1200, 1600];
/** Hard cap for any source image. Gallery/zoom images would raise this. */
const MAX_WIDTH = 2000;

/**
 * Per-image overrides. The logo is an 800x800 square rendered at 48-64 CSS px,
 * so a 400px ladder would ship ~30x more pixels than any screen can use.
 */
const PROFILES: Record<string, { widths: number[] }> = {
  logo: { widths: [96, 192, 384] },
};
const WEBP_QUALITY = 80;
const AVIF_QUALITY = 55;

interface ManifestEntry {
  width: number;
  height: number;
  widths: number[];
  formats: { avif?: string; webp?: string; fallback: string };
}

interface SizeRow {
  file: string;
  before: number;
  after: number;
}

const rows: SizeRow[] = [];

function fmt(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

/** Photographic derivatives for one source image. */
async function processRaster(name: string, file: string): Promise<ManifestEntry> {
  const original = sharp(file, { failOn: "none" });
  const meta = await original.metadata();
  const srcWidth = meta.width ?? MAX_WIDTH;
  const srcHeight = meta.height ?? MAX_WIDTH;

  const cappedWidth = Math.min(srcWidth, MAX_WIDTH);
  const aspect = srcHeight / srcWidth;

  // Never upscale: keep only widths the original can actually satisfy. For the
  // default ladder we also append the capped native width so large screens stay
  // sharp; a profile with an explicit ladder is taken at its word.
  const profile = PROFILES[name];
  const ladder = profile?.widths ?? RESPONSIVE_WIDTHS;
  const widths = Array.from(
    new Set(
      profile
        ? ladder.filter((w) => w <= cappedWidth)
        : [...ladder.filter((w) => w < cappedWidth), cappedWidth],
    ),
  ).sort((a, b) => a - b);

  const isPngSource = (meta.format ?? "") === "png";
  const fallbackExt = isPngSource ? "png" : "jpg";

  for (const w of widths) {
    // `.rotate()` bakes in EXIF orientation; the pipeline then drops all
    // metadata, so nothing (GPS included) survives into the shipped file.
    const base = sharp(file, { failOn: "none" }).rotate().resize({ width: w, withoutEnlargement: true });

    await base
      .clone()
      .avif({ quality: AVIF_QUALITY, effort: 6 })
      .toFile(path.join(OUT_DIR, `${name}-${w}.avif`));

    await base
      .clone()
      .webp({ quality: WEBP_QUALITY, effort: 6 })
      .toFile(path.join(OUT_DIR, `${name}-${w}.webp`));

    const fallbackPath = path.join(OUT_DIR, `${name}-${w}.${fallbackExt}`);
    if (isPngSource) {
      await base.clone().png({ compressionLevel: 9, effort: 10, palette: true }).toFile(fallbackPath);
    } else {
      await base.clone().jpeg({ quality: 80, mozjpeg: true }).toFile(fallbackPath);
    }
  }

  const widest = widths[widths.length - 1];
  const before = (await stat(file)).size;
  const after = (await stat(path.join(OUT_DIR, `${name}-${widest}.webp`))).size;
  rows.push({ file: `img/${name}-${widest}.webp (from ${path.basename(file)})`, before, after });

  return {
    width: widest,
    height: Math.round(widest * aspect),
    widths,
    formats: {
      avif: `/img/${name}-{w}.avif`,
      webp: `/img/${name}-{w}.webp`,
      fallback: `/img/${name}-{w}.${fallbackExt}`,
    },
  };
}

/**
 * Fixed-size derivatives that are not part of a srcset: the favicon and the
 * Open Graph card. OG scrapers are unreliable with WebP/AVIF, so the card stays
 * a crushed PNG at the canonical 1200x630.
 */
async function processFixed(file: string) {
  const publicDir = path.join(ROOT, "client", "public");
  const before = (await stat(file)).size;

  await sharp(file)
    .rotate()
    .resize({ width: 512, height: 512, fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png({ compressionLevel: 9, effort: 10, palette: true })
    .toFile(path.join(publicDir, "favicon.png"));

  await sharp(file)
    .rotate()
    .resize({ width: 180, height: 180, fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png({ compressionLevel: 9, effort: 10, palette: true })
    .toFile(path.join(publicDir, "apple-touch-icon.png"));

  await sharp(file)
    .rotate()
    .resize({ width: 1200, height: 630, fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png({ compressionLevel: 9, effort: 10, palette: true })
    .toFile(path.join(publicDir, "og-image.png"));

  for (const name of ["favicon.png", "apple-touch-icon.png", "og-image.png"]) {
    rows.push({ file: name, before, after: (await stat(path.join(publicDir, name))).size });
  }
}

/** Run every SVG in client/public through SVGO, in place. */
async function processSvgs(dir: string) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await processSvgs(full);
    } else if (entry.name.endsWith(".svg")) {
      const raw = await readFile(full, "utf8");
      const out = svgo(raw, { multipass: true, path: full }).data;
      await writeFile(full, out, "utf8");
      rows.push({ file: path.relative(path.join(ROOT, "client", "public"), full), before: raw.length, after: out.length });
    }
  }
}

async function main() {
  console.log("→ optimize-assets: generating image derivatives");

  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(path.dirname(MANIFEST), { recursive: true });

  const manifest: Record<string, ManifestEntry> = {};

  const sources = (await readdir(SOURCE_DIR, { withFileTypes: true }))
    .filter((e) => e.isFile() && /\.(png|jpe?g|webp|tiff?)$/i.test(e.name))
    .map((e) => path.join(SOURCE_DIR, e.name));

  for (const file of sources) {
    const name = path.basename(file).replace(/\.[^.]+$/, "");
    manifest[name] = await processRaster(name, file);
    console.log(`  ${name}: widths ${manifest[name].widths.join("/")} in avif+webp+fallback`);
  }

  const logoSource = path.join(SOURCE_DIR, "logo.png");
  await processFixed(logoSource);
  console.log("  favicon.png / apple-touch-icon.png / og-image.png");

  await processSvgs(path.join(ROOT, "client", "public"));

  await writeFile(MANIFEST, JSON.stringify(manifest) + "\n", "utf8");

  const before = rows.reduce((n, r) => n + r.before, 0);
  const after = rows.reduce((n, r) => n + r.after, 0);
  console.log("\n  asset                                   before      after");
  console.log("  " + "-".repeat(60));
  for (const r of rows.sort((a, b) => b.after - a.after)) {
    console.log(`  ${r.file.slice(0, 38).padEnd(38)} ${fmt(r.before).padStart(9)} ${fmt(r.after).padStart(10)}`);
  }
  console.log("  " + "-".repeat(60));
  console.log(`  ${"TOTAL".padEnd(38)} ${fmt(before).padStart(9)} ${fmt(after).padStart(10)}`);
  console.log(`✓ optimize-assets: ${rows.length} derivatives written`);
}

main().catch((err) => {
  console.error("✗ optimize-assets failed:", err);
  process.exit(1);
});
