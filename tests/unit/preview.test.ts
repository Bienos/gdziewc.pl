import { describe, expect, it } from "vitest";
import {
  approximateWalkingMinutes,
  formatDistance,
  pricePreviewLabel,
  UNKNOWN_OPENING_STATUS_LABEL,
  WALKING_METRES_PER_MINUTE,
  WALKING_ROUTE_MULTIPLIER,
} from "../../lib/toilets/preview";

describe("nearest toilet preview helpers", () => {
  it("uses the documented conservative straight-line walking estimate", () => {
    expect(WALKING_ROUTE_MULTIPLIER).toBe(1.1);
    expect(WALKING_METRES_PER_MINUTE).toBe(90);
    expect(approximateWalkingMinutes(0)).toBe(1);
    expect(approximateWalkingMinutes(240)).toBe(3);
    expect(approximateWalkingMinutes(241)).toBe(3);
    expect(approximateWalkingMinutes(250)).toBe(4);
  });

  it("rejects invalid distances and formats user-facing metric distance", () => {
    expect(() => approximateWalkingMinutes(-1)).toThrow();
    expect(() => approximateWalkingMinutes(Number.NaN)).toThrow();
    expect(formatDistance(240)).toBe("240 M");
    expect(formatDistance(1_250)).toBe("1,3 KM");
  });

  it("uses qualified price labels and never fabricates opening state", () => {
    expect(pricePreviewLabel("free")).toBe("ZA DARMO");
    expect(pricePreviewLabel("paid")).toBe("PŁATNY");
    expect(pricePreviewLabel("unknown")).toBe("CENA NIEZNANA");
    expect(UNKNOWN_OPENING_STATUS_LABEL).toBe("STATUS NIEZNANY");
  });
});
