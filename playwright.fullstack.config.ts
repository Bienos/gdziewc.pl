import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/fullstack",
  timeout: 30_000,
  use: { baseURL: "http://127.0.0.1:3300", ...devices["Desktop Chrome"] },
  webServer: {
    command: "npm run start -- --hostname 127.0.0.1 --port 3300",
    url: "http://127.0.0.1:3300",
    reuseExistingServer: false,
    env: { DATABASE_URL: process.env.DATABASE_URL ?? "" },
  },
  projects: [{ name: "fullstack-chromium", use: { browserName: "chromium" } }],
});
