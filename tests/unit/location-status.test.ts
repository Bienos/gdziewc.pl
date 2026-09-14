import { describe, expect, it } from "vitest";
import {
  messageForLocationStatus,
  statusFromGeolocationError,
} from "../../lib/location/status";

describe("location status", () => {
  it.each([
    [1, "denied"],
    [2, "unavailable"],
    [3, "timeout"],
    [99, "error"],
  ])("maps browser error code %s to %s", (code, status) => {
    expect(statusFromGeolocationError(code)).toBe(status);
  });

  it("provides literal recovery copy for every failure state", () => {
    for (const state of ["denied", "unavailable", "timeout", "unsupported", "error"] as const) {
      const message = messageForLocationStatus(state);
      expect(message.headline.length).toBeGreaterThan(0);
      expect(message.body.length).toBeGreaterThan(0);
      expect(message.action).toMatch(/PONOWNIE/);
    }
  });
});
