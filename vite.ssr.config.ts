import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BASE_PATH, SITE_ORIGIN, alias } from "./vite.config";

const ROOT = path.dirname(fileURLToPath(import.meta.url));

/**
 * Server build of the app, consumed only by `script/prerender.ts`.
 * Output lands in `.ssr/` and is never copied into `dist/`.
 */
export default defineConfig({
  plugins: [react()],
  root: path.resolve(ROOT, "client"),
  base: BASE_PATH,
  resolve: { alias },
  define: {
    "import.meta.env.VITE_SITE_ORIGIN": JSON.stringify(SITE_ORIGIN),
  },
  build: {
    outDir: path.resolve(ROOT, ".ssr"),
    emptyOutDir: true,
    ssr: path.resolve(ROOT, "client", "src", "entry-server.tsx"),
    minify: false,
    sourcemap: false,
    rollupOptions: {
      output: { entryFileNames: "entry-server.js", format: "es" },
    },
  },
});
