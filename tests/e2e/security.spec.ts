import { expect, test } from "@playwright/test";

test("serves the shared browser security-header baseline", async ({ request }) => {
  const response = await request.get("/");
  expect(response.headers()["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(response.headers()["content-security-policy"]).toContain("connect-src 'self' https://tiles.openfreemap.org");
  expect(response.headers()["content-security-policy"]).toContain("worker-src 'self'");
  expect(response.headers()["x-frame-options"]).toBe("DENY");
  expect(response.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response.headers()["permissions-policy"]).toContain("geolocation=(self)");
  expect(response.headers()["strict-transport-security"]).toBe("max-age=31536000");
  expect(response.headers()["x-powered-by"]).toBeUndefined();
});
