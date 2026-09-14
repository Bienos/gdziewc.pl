import { expect, test } from "@playwright/test";

test("public landing metadata and crawler routes are complete", async ({ page, request }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("GDZIEWC.PL — znajdź WC szybko, zanim się zesrasz!");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /GDZIEWC\.PL szybko znajdzie Ci pobliskie WC/);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "GDZIEWC.PL — znajdź WC szybko, zanim się zesrasz!");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /^https:\/\/gdziewc\.pl\/?$/);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /\/share\/gdziekibel-poster-share\.png/);

  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("Disallow: /api/");
  const sitemap = await request.get("/sitemap.xml");
  expect(await sitemap.text()).toContain("https://gdziewc.pl");
  const image = await request.get("/share/gdziekibel-poster-share.png");
  expect(image.ok()).toBe(true);
  expect(image.headers()["content-type"]).toContain("image/png");
});
