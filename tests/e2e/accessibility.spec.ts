import { expect, test } from "@playwright/test";
import { mockMapProvider } from "../helpers/mock-map-provider";

test.beforeEach(async ({ page }) => mockMapProvider(page));

test("critical journey works by keyboard with named controls and touch targets", async ({ page }) => {
  await page.route("**/api/toilets/nearby", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ results: [{
      id: "4c42ec75-e2f9-49b2-b31e-6e55162ab079", name: "Toaleta miejska", address: null,
      lat: 52.2302, lng: 21.013, distanceMeters: 92, accessState: "public", priceState: "free",
      priceAmountMinor: null, currency: null, open24h: true, openingHoursRaw: "24/7", openingStatus: "open",
      wheelchairState: "accessible", babyChangingState: "available", unisexState: "yes", confidenceLevel: "high",
      recommendationRank: 1, recommendationScore: 12, isRecommended: true,
    }] }),
  }));
  await page.route("**/api/analytics", (route) => route.fulfill({ status: 202, body: "{}" }));
  await page.addInitScript(() => {
    navigator.geolocation.getCurrentPosition = (success) => success({
      coords: { latitude: 52.2297, longitude: 21.0122, accuracy: 20, altitude: null, altitudeAccuracy: null, heading: null, speed: null, toJSON: () => ({}) },
      timestamp: Date.now(), toJSON: () => ({}),
    });
  });

  await page.goto("/");
  const location = page.getByRole("button", { name: "GDZIE JESTEM" });
  await location.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("img", { name: "Twoja przybliżona lokalizacja" })).toBeVisible();

  const list = page.getByRole("button", { name: "LISTA" });
  await list.focus();
  await page.keyboard.press("Enter");
  const result = page.getByTestId("nearby-toilet-list-item");
  await result.focus();
  await page.keyboard.press("Enter");
  const close = page.getByRole("button", { name: "Zamknij szczegóły toalety" });
  await expect(close).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("toilet-detail-sheet")).toHaveCount(0);

  const filter = page.getByRole("button", { name: "DLA WÓZKA" });
  await filter.focus();
  await page.keyboard.press("Space");
  await expect(filter).toHaveAttribute("aria-pressed", "true");

  const undersized = await page.locator("main button, main a, main select, main textarea").evaluateAll((elements) => elements.filter((element) => {
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44);
  }).map((element) => ({ text: element.textContent?.trim(), tag: element.tagName })));
  expect(undersized).toEqual([]);
});

test("reduced-motion preference suppresses meaningful animation durations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const duration = await page.getByRole("button", { name: "GDZIE JESTEM" }).evaluate((element) => getComputedStyle(element).transitionDuration);
  expect(Number.parseFloat(duration)).toBeLessThanOrEqual(0.00001);
});
