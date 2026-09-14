import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/staging",
  timeout: 30_000,
  use: {
    baseURL: process.env.STAGING_BASE_URL,
    trace: "on-first-retry",
    ...devices["iPhone 13"],
  },
  projects: [{ name: "staging-mobile-chromium", use: { browserName: "chromium" } }],
});
