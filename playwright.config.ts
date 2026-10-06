import { defineConfig, devices } from "@playwright/test";
import { spawnSync } from "node:child_process";

// Replit/NixOS needs the Nix-wrapped browser and its shared libraries.
// Other platforms use Playwright's downloaded, matching Chromium.
const systemChromium = spawnSync("which", ["chromium"], { encoding: "utf8" }).stdout?.trim();
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
  (systemChromium?.startsWith("/nix/store/") ? systemChromium : undefined);

// This server serves only the frontend: it cannot forward leads even if a mock
// is accidentally removed. Do not reuse the Express app or a deployed URL.
export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  workers: 2,
  retries: 0,
  timeout: 30_000,
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:4173",
    serviceWorkers: "block",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], launchOptions: { executablePath } },
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"], launchOptions: { executablePath } },
    },
    // Only Chromium may use the Nix executable override. The other engines
    // need Playwright's matching, patched runtimes on a supported host.
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    // Mobile Safari emulation, NOT a physical iPhone or installed Safari.
    { name: "iphone-webkit", use: { ...devices["iPhone 13"] } },
  ],
  webServer: {
    command: "npx vite --config vite.browser.config.ts --host 127.0.0.1 --port 4173 --strictPort",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: false,
  },
});
