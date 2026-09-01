/** Remove build output so every build starts from a known-empty dist/. */
import { rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

for (const dir of ["dist", ".ssr"]) {
  await rm(path.join(ROOT, dir), { recursive: true, force: true });
}
console.log("✓ clean: removed dist/ and .ssr/");
