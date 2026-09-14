import { describe, expect, it, vi } from "vitest";
import { storeSafeError } from "../../lib/observability/error-store";

describe("safe error storage", () => {
  it("stores only parsed code/surface and prunes after 30 days", async () => {
    const query = vi.fn().mockResolvedValue({ rows: [] });
    await expect(storeSafeError({ query } as never, { code: "report_failed", surface: "report" })).resolves.toBe(true);
    expect(query).toHaveBeenCalledWith(expect.stringContaining("interval '30 days'"), ["report_failed", "report"]);
  });

  it("does not query for sensitive or unknown input", async () => {
    const query = vi.fn();
    await expect(storeSafeError({ query } as never, { code: "nearby_failed", surface: "location", lat: 52.2 })).resolves.toBe(false);
    expect(query).not.toHaveBeenCalled();
  });
});
