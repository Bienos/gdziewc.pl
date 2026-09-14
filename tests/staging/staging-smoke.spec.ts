import { expect, test } from "@playwright/test";

test("staging has the public shell and security-header baseline", async ({ page, request }) => {
  const response = await request.get("/");

  expect(response.ok()).toBeTruthy();
  expect(response.headers()["content-security-policy"]).toContain("default-src 'self'");
  expect(response.headers()["permissions-policy"]).toContain("geolocation=(self)");
  expect(response.headers()["x-content-type-options"]).toBe("nosniff");

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("button", { name: "GDZIE JESTEM" })).toBeVisible();
});

test("staging loads nearby data and the geographic manual map without report writes", async ({ page }) => {
  await page.route("**/api/analytics", (route) => route.fulfill({ status: 204 }));
  await page.route("**/api/errors", (route) => route.fulfill({ status: 204 }));
  await page.addInitScript(() => {
    navigator.geolocation.getCurrentPosition = (_success, error) => error?.({ code: 1, message: "blocked" } as GeolocationPositionError);
  });

  await page.goto("/");
  await page.getByRole("button", { name: "OTWÓRZ MAPĘ WARSZAWY" }).click();

  await expect(page.getByTestId("geographic-map")).toBeVisible();
  await expect(page.getByTestId("toilet-marker").first()).toBeVisible();
  await page.getByRole("button", { name: "LISTA" }).click();
  await expect(page.getByTestId("nearby-toilet-list-item").first()).toBeVisible();
});
