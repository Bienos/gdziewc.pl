import { expect, test } from "@playwright/test";
import { mockMapProvider } from "../helpers/mock-map-provider";

test("production app completes the core journey with real PostGIS data", async ({ page }) => {
  await mockMapProvider(page);
  await page.addInitScript(() => {
    navigator.geolocation.getCurrentPosition = (success) => success({
      coords: { latitude: 52.2297, longitude: 21.0122, accuracy: 20, altitude: null, altitudeAccuracy: null, heading: null, speed: null, toJSON: () => ({}) },
      timestamp: Date.now(), toJSON: () => ({}),
    });
  });

  await page.goto("/");
  await page.getByRole("button", { name: "GDZIE JESTEM" }).click();
  await expect(page.getByTestId("toilet-marker").first()).toBeVisible();
  await expect(page.getByTestId("nearest-preview")).toBeVisible();

  await page.getByRole("button", { name: "LISTA" }).click();
  const firstResult = page.getByTestId("nearby-toilet-list-item").first();
  await expect(firstResult).toBeVisible();
  await firstResult.click();
  const detail = page.getByTestId("toilet-detail-sheet");
  await expect(detail).toBeVisible();
  await expect(page.getByTestId("walking-navigation-link")).toHaveAttribute("href", /destination=/);

  await page.getByRole("button", { name: "ZGŁOŚ BŁĘDNE DANE" }).click();
  await page.getByLabel("CO SIĘ NIE ZGADZA?").selectOption("other");
  await page.getByLabel("KRÓTKA UWAGA (OPCJONALNIE)").fill("Automatyczny test integracyjny");
  await page.getByRole("button", { name: "WYŚLIJ ZGŁOSZENIE" }).click();
  await expect(detail).toContainText("DZIĘKI — SPRAWDZIMY TO.");
});
