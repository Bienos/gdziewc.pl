import { afterEach, describe, expect, it } from "vitest";
import {
  consumeRequestRateLimit,
  privacySafeClientKey,
  resetRequestRateLimitsForTest,
} from "../../lib/http/rate-limit";

const originalVercel = process.env.VERCEL;

afterEach(() => {
  resetRequestRateLimitsForTest();
  if (originalVercel === undefined) delete process.env.VERCEL;
  else process.env.VERCEL = originalVercel;
});

describe("shared anonymous request limiter", () => {
  it("limits a scope and expires it without retaining stale state", () => {
    const policy = { maxRequests: 2, windowMs: 1_000 };
    expect(consumeRequestRateLimit("write", "client", policy, 100).allowed).toBe(true);
    expect(consumeRequestRateLimit("write", "client", policy, 100).allowed).toBe(true);
    expect(consumeRequestRateLimit("write", "client", policy, 100)).toMatchObject({ allowed: false, retryAfterSeconds: 1 });
    expect(consumeRequestRateLimit("write", "client", policy, 1_100).allowed).toBe(true);
  });

  it("ignores spoofable forwarding headers outside Vercel", () => {
    delete process.env.VERCEL;
    const first = privacySafeClientKey(new Request("http://localhost", { headers: { "x-forwarded-for": "1.1.1.1" } }));
    const second = privacySafeClientKey(new Request("http://localhost", { headers: { "x-forwarded-for": "2.2.2.2" } }));
    expect(first).toBe(second);
  });

  it("uses Vercel's overwritten client header on the intended host", () => {
    process.env.VERCEL = "1";
    const first = privacySafeClientKey(new Request("https://gdziekibel.pl", { headers: { "x-vercel-forwarded-for": "1.1.1.1" } }));
    const second = privacySafeClientKey(new Request("https://gdziekibel.pl", { headers: { "x-vercel-forwarded-for": "2.2.2.2" } }));
    expect(first).not.toBe(second);
  });
});
