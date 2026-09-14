import { describe, expect, it } from "vitest";
import { parseExplicitPlnCharge, priceDisplayLabel } from "../../lib/toilets/price";

describe("qualified PLN price parsing", () => {
  it.each([
    ["2 PLN", null, { amountMinor: 200, currency: "PLN" }],
    ["2,50 zł", null, { amountMinor: 250, currency: "PLN" }],
    ["4.5", "PLN", { amountMinor: 450, currency: "PLN" }],
  ])("parses safe explicit PLN charge %s", (charge, currency, expected) => {
    expect(parseExplicitPlnCharge(charge, currency)).toEqual(expected);
  });

  it.each([
    ["2", null],
    ["2 EUR", null],
    ["2-4 PLN", null],
    ["2 PLN; children free", null],
  ])("refuses ambiguous charge %s", (charge, currency) => {
    expect(parseExplicitPlnCharge(charge, currency)).toBeNull();
  });

  it("uses exact amount only when it is known PLN", () => {
    expect(priceDisplayLabel("free", null, null)).toBe("ZA DARMO");
    expect(priceDisplayLabel("paid", 450, "PLN")).toBe("4,50 PLN");
    expect(priceDisplayLabel("paid", null, null)).toBe("PŁATNY");
    expect(priceDisplayLabel("unknown", null, null)).toBe("CENA NIEZNANA");
  });
});
