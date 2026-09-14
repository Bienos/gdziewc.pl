import { describe, expect, it } from "vitest";
import { readBoundedJson } from "../../lib/http/request-security";

function request(body: string, headers: Record<string, string> = { "content-type": "application/json" }) {
  return new Request("https://gdziekibel.pl/api/test", { method: "POST", headers, body });
}

describe("bounded JSON request reader", () => {
  it("accepts a small same-origin JSON body", async () => {
    await expect(readBoundedJson(request('{"ok":true}', {
      "content-type": "application/json; charset=utf-8",
      origin: "https://gdziekibel.pl",
      "sec-fetch-site": "same-origin",
    }), 64)).resolves.toEqual({ ok: true, value: { ok: true } });
  });

  it("rejects non-JSON media types and foreign browser origins", async () => {
    await expect(readBoundedJson(request('{"ok":true}', { "content-type": "text/plain" }), 64))
      .resolves.toMatchObject({ ok: false, status: 415 });
    await expect(readBoundedJson(request('{"ok":true}', {
      "content-type": "application/json",
      origin: "https://attacker.example",
    }), 64)).resolves.toMatchObject({ ok: false, status: 403 });
  });

  it("rejects declared and actual bytes above the route budget", async () => {
    await expect(readBoundedJson(request("{}", {
      "content-type": "application/json",
      "content-length": "1000",
    }), 64)).resolves.toMatchObject({ ok: false, status: 413 });
    await expect(readBoundedJson(request(JSON.stringify({ value: "x".repeat(100) })), 64))
      .resolves.toMatchObject({ ok: false, status: 413 });
  });
});
