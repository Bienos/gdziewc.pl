import { afterEach, describe, expect, it } from "vitest";
import { POST } from "../../app/api/toilet-reports/route";
import { toiletReportRequestSchema } from "../../lib/toilets/reports";
import { resetReportRateLimitsForTest } from "../../lib/toilets/report-rate-limit";

describe("toilet report contract", () => {
  const originalDatabaseUrl = process.env.DATABASE_URL;
  afterEach(() => { if (originalDatabaseUrl === undefined) delete process.env.DATABASE_URL; else process.env.DATABASE_URL = originalDatabaseUrl; });
  afterEach(resetReportRateLimitsForTest);

  it("accepts only a canonical ID, known issue, and short optional note", () => {
    expect(toiletReportRequestSchema.parse({ toiletId: "4c42ec75-e2f9-49b2-b31e-6e55162ab079", issueType: "hours", note: "Zamknięte po 20" })).toMatchObject({ issueType: "hours" });
    expect(() => toiletReportRequestSchema.parse({ toiletId: "not-an-id", issueType: "spam", note: "x".repeat(501), location: {} })).toThrow();
  });

  it("returns a safe 400 for malformed input and no-store errors", async () => {
    const response = await POST(new Request("http://localhost/api/toilet-reports", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ toiletId: "bad" }) }));
    expect(response.status).toBe(400);
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("fails safely without a configured database", async () => {
    delete process.env.DATABASE_URL;
    const response = await POST(new Request("http://localhost/api/toilet-reports", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ toiletId: "4c42ec75-e2f9-49b2-b31e-6e55162ab079", issueType: "closed" }) }));
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain("DATABASE_URL");
  });

  it("returns no-store 429 after the short-lived anonymous limit", async () => {
    delete process.env.DATABASE_URL;
    const request = () => new Request("http://localhost/api/toilet-reports", {
      method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": "test-client" },
      body: JSON.stringify({ toiletId: "4c42ec75-e2f9-49b2-b31e-6e55162ab079", issueType: "closed" }),
    });
    for (let index = 0; index < 5; index += 1) expect((await POST(request())).status).toBe(503);
    const limited = await POST(request());
    expect(limited.status).toBe(429);
    expect(limited.headers.get("cache-control")).toBe("no-store");
    expect(limited.headers.get("retry-after")).toBeTruthy();
  });

  it("rejects cross-site-compatible and oversized bodies before database work", async () => {
    const textPlain = await POST(new Request("http://localhost/api/toilet-reports", {
      method: "POST",
      headers: { "content-type": "text/plain" },
      body: JSON.stringify({ toiletId: "4c42ec75-e2f9-49b2-b31e-6e55162ab079", issueType: "closed" }),
    }));
    expect(textPlain.status).toBe(415);

    const oversized = await POST(new Request("http://localhost/api/toilet-reports", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ toiletId: "4c42ec75-e2f9-49b2-b31e-6e55162ab079", issueType: "other", note: "x".repeat(3_000) }),
    }));
    expect(oversized.status).toBe(413);
  });
});
