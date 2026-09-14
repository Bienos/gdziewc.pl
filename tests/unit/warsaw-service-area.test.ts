import { describe, expect, it } from "vitest";
import { isWithinWarsawSupportedArea } from "../../lib/location/warsaw-service-area";

describe("Warsaw supported area", () => {
  it("accepts central Warsaw and generous edge locations", () => {
    expect(isWithinWarsawSupportedArea({ latitude: 52.2297, longitude: 21.0122 })).toBe(true);
    expect(isWithinWarsawSupportedArea({ latitude: 52.44, longitude: 21.39 })).toBe(true);
  });

  it("rejects clearly outside locations", () => {
    expect(isWithinWarsawSupportedArea({ latitude: 50.0647, longitude: 19.945 })).toBe(false);
  });
});
