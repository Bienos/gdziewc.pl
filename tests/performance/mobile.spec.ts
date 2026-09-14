import { expect, test } from "@playwright/test";

test("production mobile landing route stays within performance budgets", async ({ page }) => {
  await page.addInitScript(() => {
    (window as typeof window & { __layoutShiftScore: number }).__layoutShiftScore = 0;
    new PerformanceObserver((entries) => {
      for (const entry of entries.getEntries()) {
        const shift = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };
        if (!shift.hadRecentInput) (window as typeof window & { __layoutShiftScore: number }).__layoutShiftScore += shift.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
  });
  await page.goto("/", { waitUntil: "networkidle" });

  const metrics = await page.evaluate(() => {
    const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    return {
      firstContentfulPaint: performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? Infinity,
      domContentLoaded: navigation.domContentLoadedEventEnd,
      scriptTransferBytes: resources.filter((entry) => entry.initiatorType === "script").reduce((sum, entry) => sum + entry.transferSize, 0),
      externalResources: resources.filter((entry) => ![location.hostname, "127.0.0.1", "localhost"].includes(new URL(entry.name).hostname)).map((entry) => entry.name),
      layoutShift: (window as typeof window & { __layoutShiftScore: number }).__layoutShiftScore,
      width: { viewport: innerWidth, document: document.documentElement.scrollWidth },
    };
  });

  expect(metrics.firstContentfulPaint).toBeLessThan(2_500);
  expect(metrics.domContentLoaded).toBeLessThan(2_500);
  expect(metrics.scriptTransferBytes).toBeLessThanOrEqual(160_000);
  expect(metrics.externalResources).toEqual([]);
  expect(metrics.layoutShift).toBeLessThanOrEqual(0.1);
  expect(metrics.width.document).toBeLessThanOrEqual(metrics.width.viewport);
});
