import { describe, expect, it } from "vitest";
import { scrubErrorRecord } from "../../lib/observability/errors";

describe("error privacy scrubber", () => {
  it("retains only allowlisted code and surface", () => {
    expect(scrubErrorRecord({ code: "nearby_failed", surface: "location" })).toEqual({ code: "nearby_failed", surface: "location" });
  });
  it("rejects coordinates, URL, body, notes and raw errors", () => {
    expect(scrubErrorRecord({ code: "nearby_failed", surface: "location", lat: 52.2 })).toBeNull();
    expect(scrubErrorRecord({ code: "report_failed", surface: "report", note: "private" })).toBeNull();
    expect(scrubErrorRecord({ message: "DATABASE_URL=secret", url: "?lat=52" })).toBeNull();
  });
});
