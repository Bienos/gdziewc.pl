import { describe, expect, it } from "vitest";
import { analyticsEventSchema } from "../../lib/analytics/events";

describe("anonymous analytics contract", () => {
  it("accepts only allowlisted event metadata", () => {
    expect(analyticsEventSchema.parse({ name: "nearby_loaded", result: "success" })).toEqual({ name: "nearby_loaded", result: "success" });
  });

  it("rejects locations, names, notes and unknown fields", () => {
    expect(() => analyticsEventSchema.parse({ name: "detail_opened", location: { lat: 52.2, lng: 21 } })).toThrow();
    expect(() => analyticsEventSchema.parse({ name: "report_submitted", note: "private text" })).toThrow();
  });
});
