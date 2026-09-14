import { expect, test } from "@playwright/test";
import { mockMapProvider } from "../helpers/mock-map-provider";

test.beforeEach(async ({ page }) => mockMapProvider(page));

declare global {
  interface Window {
    __geoCalls: number;
  }
}

test("location is requested only after the action and success stays private", async ({ page }) => {
  const externalRequests: string[] = [];
  let nearbyBody = "";
  let nearbyRequests = 0;
  let reportBody = "";
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (!["localhost", "127.0.0.1"].includes(url.hostname)) externalRequests.push(request.url());
  });
  await page.route("**/api/toilets/nearby", async (route) => {
    nearbyRequests += 1;
    nearbyBody = route.request().postData() ?? "";
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        results: [
          {
            id: "4c42ec75-e2f9-49b2-b31e-6e55162ab079",
            name: "Toaleta przy Marszałkowskiej",
            address: "Marszałkowska 1",
            lat: 52.2302,
            lng: 21.013,
            distanceMeters: 92,
            accessState: "public",
            priceState: "free",
            priceAmountMinor: null,
            currency: null,
            open24h: null,
            openingHoursRaw: null,
            openingStatus: "unknown",
            wheelchairState: "accessible",
            babyChangingState: "unknown",
            unisexState: "unknown",
            confidenceLevel: "low",
            recommendationRank: 1,
            recommendationScore: 92,
            isRecommended: true,
          },
          {
            id: "2ccedcee-72da-4a77-a0bc-cd6dcb98d760",
            name: "Toaleta w kawiarni",
            address: null,
            lat: 52.2289,
            lng: 21.011,
            distanceMeters: 148,
            accessState: "restricted",
            priceState: "unknown",
            priceAmountMinor: null,
            currency: null,
            open24h: null,
            openingHoursRaw: null,
            openingStatus: "unknown",
            wheelchairState: "unknown",
            babyChangingState: "unknown",
            unisexState: "unknown",
            confidenceLevel: "low",
            recommendationRank: 2,
            recommendationScore: 398,
            isRecommended: false,
          },
        ],
      }),
    });
  });
  await page.route("**/api/toilet-reports", async (route) => {
    reportBody = route.request().postData() ?? "";
    await route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ status: "pending" }) });
  });
  await page.addInitScript(() => {
    Object.defineProperty(window, "__geoCalls", { value: 0, writable: true });
    navigator.geolocation.getCurrentPosition = (success) => {
      window.__geoCalls += 1;
      success({
        coords: {
          latitude: 52.22971234,
          longitude: 21.01221234,
          accuracy: 24,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
          toJSON: () => ({}),
        },
        timestamp: Date.now(),
        toJSON: () => ({}),
      });
    };
  });

  await page.goto("/");
  await expect(page).toHaveTitle(/GdzieKibel\.pl/);
  await expect(page.getByTestId("map-shell")).toBeVisible();
  const brandReset = page.getByLabel("GdzieKibel.pl — wróć do strony startowej");
  await expect(brandReset).toBeVisible();
  await expect(brandReset).toHaveAttribute("href", "/");
  await expect(page.getByRole("heading", { name: "CHCE CI SIĘ SRAĆ?" })).toBeVisible();
  await expect(page.getByRole("list", { name: "Jak to działa" })).toContainText("DAJ LOKALIZACJĘ");
  await expect(page.getByRole("list", { name: "Jak to działa" })).toContainText("KLIKNIJ „PROWADŹ MNIE”");
  expect(await page.evaluate(() => window.__geoCalls)).toBe(0);
  expect(externalRequests).toEqual([]);

  const locationAction = page.getByRole("button", { name: "GDZIE JESTEM" });
  await locationAction.focus();
  await expect(locationAction).toBeFocused();
  await locationAction.click();

  expect(await page.evaluate(() => window.__geoCalls)).toBe(1);
  await expect(page.getByTestId("user-location")).toBeVisible();
  await expect(page.getByTestId("geographic-map")).toBeVisible();
  await expect(page.getByRole("region", { name: "Interaktywna mapa Warszawy. Użyj strzałek, aby przesuwać mapę, oraz przycisków powiększenia." })).toBeVisible();
  await expect(page.getByRole("button", { name: "Powiększ mapę" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Pomniejsz mapę" })).toBeVisible();
  const recenterLocation = page.getByRole("button", { name: "Pokaż moją lokalizację na mapie" });
  await expect(recenterLocation).toBeVisible();
  await recenterLocation.click();
  expect(await page.evaluate(() => window.__geoCalls)).toBe(1);
  expect(nearbyRequests).toBe(1);
  await expect(page.getByRole("button", { name: "ODŚWIEŻ LOKALIZACJĘ" })).toBeVisible();
  const preview = page.getByTestId("nearest-preview");
  await expect(preview).toContainText("Toaleta przy Marszałkowskiej");
  await expect(preview).toContainText("92 M");
  await expect(preview).toContainText("~2 MIN PIESZO");
  await expect(preview).toContainText("STATUS NIEZNANY");
  await expect(preview).toContainText("ZA DARMO");
  await expect(preview).toContainText("DANE DO POTWIERDZENIA");
  await expect(page.getByTestId("toilet-marker")).toHaveCount(2);
  await expect(page.getByTestId("toilet-marker").first()).toHaveAttribute("data-recommended", "true");
  await expect(page.getByTestId("toilet-marker").first()).toHaveAccessibleName(/polecany/);
  await page.getByRole("button", { name: "FILTRY" }).click();
  await page.getByRole("button", { name: "ZA DARMO" }).click();
  await expect(page.getByText("1 WYNIK", { exact: true })).toBeVisible();
  await expect(page.getByTestId("toilet-marker")).toHaveCount(1);
  await page.getByRole("button", { name: "WYCZYŚĆ" }).click();
  await expect(page.getByTestId("toilet-marker")).toHaveCount(2);
  await page.getByRole("button", { name: "24H" }).click();
  await expect(page.getByText("BRAK PASUJĄCYCH KIBLI.")).toBeVisible();
  await page.getByRole("button", { name: "POKAŻ WSZYSTKIE" }).click();
  await expect(page.getByTestId("toilet-marker")).toHaveCount(2);
  const secondMarker = page.getByTestId("toilet-marker").nth(1);
  await secondMarker.click();
  await expect(secondMarker).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("toilet-marker").first()).toHaveAttribute("aria-pressed", "false");
  const detailSheet = page.getByTestId("toilet-detail-sheet");
  await expect(detailSheet).toContainText("Toaleta w kawiarni");
  const closeDetail = page.getByRole("button", { name: "Zamknij szczegóły toalety" });
  await expect(closeDetail).toBeFocused();
  await expect(detailSheet).toContainText("DOSTĘP OGRANICZONY");
  await expect(detailSheet).toContainText("CENA NIEZNANA");
  await expect(detailSheet).toContainText("NIEZNANE");
  await page.getByRole("button", { name: "ZGŁOŚ BŁĘDNE DANE" }).click();
  await page.getByLabel("CO SIĘ NIE ZGADZA?").selectOption("hours");
  await page.getByLabel("KRÓTKA UWAGA (OPCJONALNIE)").fill("Godziny są nieaktualne");
  await page.getByRole("button", { name: "WYŚLIJ ZGŁOSZENIE" }).click();
  await expect(detailSheet).toContainText("DZIĘKI — SPRAWDZIMY TO.");
  expect(JSON.parse(reportBody)).toEqual({ toiletId: "2ccedcee-72da-4a77-a0bc-cd6dcb98d760", issueType: "hours", note: "Godziny są nieaktualne" });
  const navigationLink = page.getByTestId("walking-navigation-link");
  await expect(navigationLink).toHaveText("PROWADŹ MNIE");
  await expect(navigationLink).toHaveAttribute("target", "_blank");
  await expect(navigationLink).toHaveAttribute("rel", "noopener noreferrer");
  const destination = new URL(await navigationLink.getAttribute("href") ?? "");
  expect(destination.searchParams.get("travelmode")).toBe("walking");
  expect(destination.searchParams.get("destination")).toBe("52.2289,21.011");
  expect(destination.searchParams.has("origin")).toBe(false);
  await closeDetail.click();
  await expect(detailSheet).toHaveCount(0);
  await expect(secondMarker).toHaveAttribute("aria-pressed", "false");
  await secondMarker.click();
  await expect(detailSheet).toContainText("Toaleta w kawiarni");
  await expect(preview).toContainText("Toaleta przy Marszałkowskiej");
  await page.getByRole("button", { name: "Zamknij szczegóły toalety" }).click();
  await page.getByRole("button", { name: "LISTA" }).click();
  await expect(page.getByTestId("toilet-marker")).toHaveCount(0);
  const list = page.getByTestId("nearby-toilet-list");
  await expect(list).toBeVisible();
  const listItems = page.getByTestId("nearby-toilet-list-item");
  await expect(listItems).toHaveCount(2);
  await expect(listItems.nth(0)).toContainText("Toaleta przy Marszałkowskiej");
  await expect(listItems.nth(0)).toContainText("92 M");
  await expect(listItems.nth(0)).toContainText("~2 MIN PIESZO");
  await expect(listItems.nth(0)).toContainText("STATUS NIEZNANY");
  await expect(listItems.nth(0)).toContainText("ZA DARMO");
  await expect(listItems.nth(0)).toContainText("DANE DO POTWIERDZENIA");
  await listItems.nth(0).click();
  await expect(detailSheet).toContainText("Toaleta przy Marszałkowskiej");
  await expect(listItems.nth(0)).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "MAPA" }).dispatchEvent("click");
  await expect(page.getByTestId("toilet-marker").first()).toHaveAttribute("aria-pressed", "true");
  expect(JSON.parse(nearbyBody)).toEqual({
    location: { lat: 52.22971234, lng: 21.01221234 },
  });

  const privacy = await page.evaluate(() => ({
    body: document.body.textContent ?? "",
    url: location.href,
    local: JSON.stringify(localStorage),
    session: JSON.stringify(sessionStorage),
  }));
  expect(JSON.stringify(privacy)).not.toContain("52.22971234");
  expect(JSON.stringify(privacy)).not.toContain("21.01221234");
  expect(externalRequests.length).toBeGreaterThan(0);
  expect(externalRequests.every((url) => new URL(url).hostname === "tiles.openfreemap.org")).toBe(true);
  expect(externalRequests.join(" ")).not.toContain("52.22971234");
  expect(externalRequests.join(" ")).not.toContain("21.01221234");
});

test("empty and service-error nearby states stay recoverable", async ({ page }) => {
  let requests = 0;
  const requestBodies: unknown[] = [];
  await page.route("**/api/toilets/nearby", async (route) => {
    requests += 1;
    requestBodies.push(JSON.parse(route.request().postData() ?? "{}"));
    if (requests <= 2) {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ results: [] }) });
    } else {
      await route.fulfill({ status: 503, contentType: "application/json", body: "{}" });
    }
  });
  await page.addInitScript(() => {
    navigator.geolocation.getCurrentPosition = (success) => success({
      coords: {
        latitude: 52.2297,
        longitude: 21.0122,
        accuracy: 20,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
        toJSON: () => ({}),
      },
      timestamp: Date.now(),
      toJSON: () => ({}),
    });
  });

  await page.goto("/");
  await page.getByRole("button", { name: "GDZIE JESTEM" }).click();
  await expect(page.getByText("NIE MA NIC W PROMIENIU 2 KM.")).toBeVisible();
  await expect(page.getByRole("button", { name: "SZUKAJ W PROMIENIU 5 KM" })).toBeVisible();
  await expect(page.getByTestId("nearest-preview")).toHaveCount(0);

  await page.getByRole("button", { name: "SZUKAJ W PROMIENIU 5 KM" }).click();
  await expect(page.getByText("NIE MA NIC W PROMIENIU 5 KM.")).toBeVisible();
  await page.getByRole("button", { name: "SZUKAJ W PROMIENIU 10 KM" }).click();
  await expect(page.getByText("NIE UDAŁO SIĘ POBRAĆ KIBLI.")).toBeVisible();
  await expect(page.getByTestId("nearest-preview")).toHaveCount(0);
  await page.getByRole("button", { name: "SPRÓBUJ JESZCZE RAZ" }).click();
  expect(requests).toBe(4);
  expect(requestBodies).toEqual([
    { location: { lat: 52.2297, lng: 21.0122 } },
    { location: { lat: 52.2297, lng: 21.0122 }, radiusMeters: 5000 },
    { location: { lat: 52.2297, lng: 21.0122 }, radiusMeters: 10000 },
    { location: { lat: 52.2297, lng: 21.0122 }, radiusMeters: 10000 },
  ]);
});

test("permission denial gives retry and manual Warsaw fallback", async ({ page }) => {
  let nearbyBody = "";
  await page.route("**/api/toilets/nearby", (route) => {
    nearbyBody = route.request().postData() ?? "";
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ results: [{
        id: "4c42ec75-e2f9-49b2-b31e-6e55162ab079", name: "Toaleta w centrum", address: null,
        lat: 52.2302, lng: 21.013, distanceMeters: 92, accessState: "public", priceState: "free",
        priceAmountMinor: null, currency: null, open24h: true, openingHoursRaw: "24/7", openingStatus: "open",
        wheelchairState: "accessible", babyChangingState: "unknown", unisexState: "unknown", confidenceLevel: "high",
        recommendationRank: 1, recommendationScore: 12, isRecommended: true,
      }] }),
    });
  });
  await page.addInitScript(() => {
    Object.defineProperty(window, "__geoCalls", { value: 0, writable: true });
    navigator.geolocation.getCurrentPosition = (_success, error) => {
      window.__geoCalls += 1;
      error?.({
        code: 1,
        message: "Permission denied",
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3,
      });
    };
  });

  await page.goto("/");
  await page.getByRole("button", { name: "GDZIE JESTEM" }).click();
  await expect(page.getByRole("heading", { name: "NIE WIEMY, GDZIE JESTEŚ." })).toBeVisible();
  await expect(page.getByRole("button", { name: "SPRÓBUJ PONOWNIE" })).toBeVisible();
  const manualMap = page.getByRole("button", { name: "OTWÓRZ MAPĘ WARSZAWY" });
  await expect(manualMap).toBeVisible();
  expect(await page.evaluate(() => window.__geoCalls)).toBe(1);
  await manualMap.click();
  await expect(page.getByTestId("geographic-map")).toBeVisible();
  await expect(page.getByText(/TRYB RĘCZNY/)).toBeVisible();
  await expect(page.getByTestId("toilet-marker")).toHaveCount(1);
  await expect(page.getByTestId("user-location")).toHaveCount(0);
  expect(JSON.parse(nearbyBody)).toEqual({ location: { lat: 52.2297, lng: 21.0122 }, radiusMeters: 10000 });
});

test("outside Warsaw is explained without a nearby request", async ({ page }) => {
  let nearbyRequests = 0;
  await page.route("**/api/toilets/nearby", (route) => {
    nearbyRequests += 1;
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ results: [] }) });
  });
  await page.addInitScript(() => {
    navigator.geolocation.getCurrentPosition = (success) => success({
      coords: {
        latitude: 50.0647,
        longitude: 19.945,
        accuracy: 20,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
        toJSON: () => ({}),
      },
      timestamp: Date.now(),
      toJSON: () => ({}),
    });
  });

  await page.goto("/");
  await page.getByRole("button", { name: "GDZIE JESTEM" }).click();
  await expect(page.getByRole("heading", { name: "JESZCZE TU NIE DZIAŁAMY." })).toBeVisible();
  await expect(page.getByRole("button", { name: "OTWÓRZ MAPĘ WARSZAWY" })).toBeVisible();
  expect(nearbyRequests).toBe(0);
  const privacy = await page.evaluate(() => document.body.textContent ?? "");
  expect(privacy).not.toContain("50.0647");
  expect(privacy).not.toContain("19.945");
});

test("map provider failure leaves the result list usable", async ({ page }) => {
  await page.route("https://tiles.openfreemap.org/**", (route) => route.fulfill({ status: 503, body: "unavailable" }));
  await page.route("**/api/toilets/nearby", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ results: [{
      id: "4c42ec75-e2f9-49b2-b31e-6e55162ab079", name: "Toaleta miejska", address: null,
      lat: 52.2302, lng: 21.013, distanceMeters: 92, accessState: "public", priceState: "free",
      priceAmountMinor: null, currency: null, open24h: true, openingHoursRaw: "24/7", openingStatus: "open",
      wheelchairState: "accessible", babyChangingState: "unknown", unisexState: "unknown", confidenceLevel: "high",
      recommendationRank: 1, recommendationScore: 12, isRecommended: true,
    }] }),
  }));
  await page.addInitScript(() => {
    navigator.geolocation.getCurrentPosition = (success) => success({
      coords: { latitude: 52.2297, longitude: 21.0122, accuracy: 20, altitude: null, altitudeAccuracy: null, heading: null, speed: null, toJSON: () => ({}) },
      timestamp: Date.now(), toJSON: () => ({}),
    });
  });

  await page.goto("/");
  await page.getByRole("button", { name: "GDZIE JESTEM" }).click();
  await expect(page.getByText("MAPA ULIC JEST CHWILOWO NIEDOSTĘPNA. UŻYJ LISTY.")).toBeVisible();
  await page.getByRole("button", { name: "LISTA" }).click();
  await expect(page.getByTestId("nearby-toilet-list-item")).toContainText("Toaleta miejska");
});

test("location flow fits a 320px-wide mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/");
  const sizes = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
  }));
  expect(sizes.document).toBeLessThanOrEqual(sizes.viewport);
  await expect(page.getByRole("button", { name: "GDZIE JESTEM" })).toBeInViewport();
});

test("detail sheet fits a 320px-wide mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.route("**/api/toilets/nearby", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
      results: [{
        id: "4c42ec75-e2f9-49b2-b31e-6e55162ab079",
        name: "Toaleta miejska",
        address: null,
        lat: 52.2302,
        lng: 21.013,
        distanceMeters: 240,
        accessState: "public",
        priceState: "free",
        priceAmountMinor: null,
        currency: null,
        open24h: null,
        openingHoursRaw: null,
        openingStatus: "unknown",
        wheelchairState: "unknown",
        babyChangingState: "unknown",
        unisexState: "unknown",
        confidenceLevel: "low",
        recommendationRank: 1,
        recommendationScore: 240,
        isRecommended: true,
      }],
    }),
  }));
  await page.addInitScript(() => {
    navigator.geolocation.getCurrentPosition = (success) => success({
      coords: {
        latitude: 52.2297,
        longitude: 21.0122,
        accuracy: 20,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
        toJSON: () => ({}),
      },
      timestamp: Date.now(),
      toJSON: () => ({}),
    });
  });

  await page.goto("/");
  await page.getByRole("button", { name: "GDZIE JESTEM" }).click();
  await page.getByTestId("toilet-marker").dispatchEvent("click");
  await expect(page.getByTestId("toilet-detail-sheet")).toBeVisible();
  await page.getByRole("button", { name: "Zamknij szczegóły toalety" }).click();
  await page.getByRole("button", { name: "LISTA" }).click();
  await expect(page.getByTestId("nearby-toilet-list")).toBeVisible();
  const sizes = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
  }));
  expect(sizes.document).toBeLessThanOrEqual(sizes.viewport);
});
