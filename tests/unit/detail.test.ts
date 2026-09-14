import { describe, expect, it } from "vitest";
import {
  accessDetailLabel,
  babyChangingDetailLabel,
  confidenceDetailLabel,
  lowConfidenceCaution,
  unisexDetailLabel,
  wheelchairDetailLabel,
} from "../../lib/toilets/detail";

describe("toilet detail labels", () => {
  it("keeps access qualified", () => {
    expect(accessDetailLabel("public")).toBe("PUBLICZNY");
    expect(accessDetailLabel("restricted")).toBe("DOSTĘP OGRANICZONY");
    expect(accessDetailLabel("unknown")).toBe("DOSTĘP NIEZNANY");
  });

  it("shows every facility unknown explicitly", () => {
    expect(wheelchairDetailLabel("unknown")).toBe("NIEZNANE");
    expect(babyChangingDetailLabel("unknown")).toBe("NIEZNANE");
    expect(unisexDetailLabel("unknown")).toBe("NIEZNANE");
  });

  it("renders known facility/confidence states literally", () => {
    expect(wheelchairDetailLabel("accessible")).toBe("DOSTĘPNY");
    expect(wheelchairDetailLabel("not_accessible")).toBe("NIEDOSTĘPNY");
    expect(babyChangingDetailLabel("available")).toBe("JEST");
    expect(unisexDetailLabel("no")).toBe("NIE");
    expect(confidenceDetailLabel("low")).toBe("NISKA PEWNOŚĆ");
    expect(lowConfidenceCaution("low")).toBe("DANE DO POTWIERDZENIA");
    expect(lowConfidenceCaution("medium")).toBeNull();
  });
});
