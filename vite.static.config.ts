import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { LEAD_RELAY_ORIGIN, LEAD_RELAY_PATH, INQUIRY_RELAY_PATH } from "./shared/lead-relay";

export default defineConfig({
  define: {
    "import.meta.env.VITE_LEAD_RELAY_URL": JSON.stringify(`${LEAD_RELAY_ORIGIN}${LEAD_RELAY_PATH}`),
    "import.meta.env.VITE_INQUIRY_RELAY_URL": JSON.stringify(`${LEAD_RELAY_ORIGIN}${INQUIRY_RELAY_PATH}`),
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  base: "/",
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['wouter'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-navigation-menu'],
        },
      },
    },
  },
});
