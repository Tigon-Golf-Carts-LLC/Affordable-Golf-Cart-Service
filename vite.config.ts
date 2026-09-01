import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));

/**
 * Deploy base path. "/" for a custom domain or <user>.github.io;
 * "/<repo-name>/" for a project site. Always normalised to a leading and
 * trailing slash so `import.meta.env.BASE_URL` behaves.
 */
function normaliseBase(raw: string): string {
  if (!raw || raw === "/") return "/";
  return `/${raw.replace(/^\/+|\/+$/g, "")}/`;
}

export const BASE_PATH = normaliseBase(process.env.BASE_PATH || "/");
export const SITE_ORIGIN = (process.env.SITE_DOMAIN || "https://affordablegolfcartservice.com").replace(
  /\/$/,
  "",
);

export const alias = {
  "@": path.resolve(ROOT, "client", "src"),
  "@shared": path.resolve(ROOT, "shared"),
};

export default defineConfig({
  plugins: [react()],
  root: path.resolve(ROOT, "client"),
  base: BASE_PATH,
  resolve: { alias },
  define: {
    "import.meta.env.VITE_SITE_ORIGIN": JSON.stringify(SITE_ORIGIN),
  },
  build: {
    outDir: path.resolve(ROOT, "dist"),
    emptyOutDir: true,
    minify: "terser",
    cssMinify: true,
    sourcemap: false,
    assetsInlineLimit: 4096,
    terserOptions: {
      compress: { drop_console: true, drop_debugger: true, passes: 2 },
      format: { comments: false },
    },
    rollupOptions: {
      output: {
        // Route-level splitting comes from the dynamic imports in
        // client/src/pages/registry.tsx — one chunk per page. Vendor chunking is
        // left to Rollup: hand-splitting React out of the shared vendor chunk
        // reorders the CommonJS interop wrappers and breaks at runtime.
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
  server: {
    fs: { strict: true, deny: ["**/.*"] },
  },
});
