import { expect, test } from "@playwright/test";

test("public landing metadata and crawler routes are complete", async ({ page, request }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("GdzieKibel.pl — znajdź publiczną toaletę w Warszawie");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /publiczną toaletę w Warszawie/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /^https:\/\/gdziekibel\.pl\/?$/);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /opengraph-image/);
  await expect(page.getByRole("link", { name: "© OpenStreetMap contributors" })).toHaveAttribute("href", "https://www.openstreetmap.org/copyright");

  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("Disallow: /api/");
  const sitemap = await request.get("/sitemap.xml");
  expect(await sitemap.text()).toContain("https://gdziekibel.pl");
  const image = await request.get("/opengraph-image");
  expect(image.ok()).toBe(true);
  expect(image.headers()["content-type"]).toContain("image/png");
});
