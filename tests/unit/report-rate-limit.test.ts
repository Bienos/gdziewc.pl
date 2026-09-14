import { afterEach, describe, expect, it } from "vitest";
import { consumeReportRateLimit, resetReportRateLimitsForTest } from "../../lib/toilets/report-rate-limit";

describe("anonymous report rate limit", () => {
  afterEach(resetReportRateLimitsForTest);
  it("allows five reports, limits the sixth, then expires", () => {
    const now = 1_000;
    for (let index = 0; index < 5; index += 1) expect(consumeReportRateLimit("hashed", now).allowed).toBe(true);
    expect(consumeReportRateLimit("hashed", now)).toMatchObject({ allowed: false, retryAfterSeconds: 900 });
    expect(consumeReportRateLimit("hashed", now + 900_000).allowed).toBe(true);
  });
});
