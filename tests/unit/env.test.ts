import { describe, expect, it } from "vitest";
import { getDatabaseUrl, validateEnvironment } from "../../lib/env/server";

describe("environment validation", () => {
  it("accepts an empty database configuration for the web shell", () => {
    expect(validateEnvironment({})).toEqual({});
  });

  it("requires a database URL when a database command is used", () => {
    expect(() => getDatabaseUrl({})).toThrow("DATABASE_URL is required");
  });
});
