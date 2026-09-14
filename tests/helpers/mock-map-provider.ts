import type { Page } from "@playwright/test";

export async function mockMapProvider(page: Page) {
  await page.route("https://tiles.openfreemap.org/**", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
      version: 8,
      sources: {},
      layers: [{ id: "paper", type: "background", paint: { "background-color": "#f5f2ea" } }],
    }),
  }));
}
