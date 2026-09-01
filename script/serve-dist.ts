/**
 * Serve dist/ exactly the way GitHub Pages does: static files only, directory
 * index.html, and 404.html for anything unmatched. No API, no rewrites.
 *
 * Run: `npm run preview` (PORT and BASE_PATH are honoured).
 */
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const PORT = Number(process.env.PORT || 4173);
const BASE_PATH = (() => {
  const raw = process.env.BASE_PATH || "/";
  return raw === "/" ? "/" : `/${raw.replace(/^\/+|\/+$/g, "")}/`;
})();

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".pdf": "application/pdf",
  ".ico": "image/x-icon",
};

function resolveFile(urlPath: string): string | null {
  let rel = decodeURIComponent(urlPath.split("?")[0]);
  if (BASE_PATH !== "/" && rel.startsWith(BASE_PATH)) rel = "/" + rel.slice(BASE_PATH.length);
  const candidate = path.join(DIST, rel);
  // Refuse to serve outside dist/.
  if (!candidate.startsWith(DIST)) return null;

  if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  const asIndex = path.join(candidate, "index.html");
  if (existsSync(asIndex)) return asIndex;
  return null;
}

createServer((req, res) => {
  const file = resolveFile(req.url || "/");
  if (file) {
    res.writeHead(200, { "Content-Type": MIME[path.extname(file)] ?? "application/octet-stream" });
    createReadStream(file).pipe(res);
    return;
  }
  const notFound = path.join(DIST, "404.html");
  res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
  if (existsSync(notFound)) createReadStream(notFound).pipe(res);
  else res.end("404");
}).listen(PORT, () => {
  console.log(`serving dist/ at http://localhost:${PORT}${BASE_PATH}`);
});
