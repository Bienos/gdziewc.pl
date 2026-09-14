import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/performance",
  use: {
    baseURL: "http://127.0.0.1:3200",
    ...devices["iPhone 13"],
  },
  webServer: {
    command: "npm run start -- --hostname 127.0.0.1 --port 3200",
    url: "http://127.0.0.1:3200",
    reuseExistingServer: false,
  },
  projects: [{ name: "mobile-chromium", use: { browserName: "chromium" } }],
});
