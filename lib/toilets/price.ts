export interface ParsedPlnCharge {
  amountMinor: number;
  currency: "PLN";
}

export function parseExplicitPlnCharge(
  chargeRaw: string | null,
  currencyRaw: string | null,
): ParsedPlnCharge | null {
  if (!chargeRaw) return null;
  const currency = currencyRaw?.trim().toUpperCase();
  const explicitPln = /^(\d+)(?:[.,](\d{1,2}))?\s*(PLN|zł)$/i.exec(chargeRaw.trim());
  const numericWithCurrency = /^(\d+)(?:[.,](\d{1,2}))?$/.exec(chargeRaw.trim());
  const match = explicitPln ?? (currency === "PLN" ? numericWithCurrency : null);
  if (!match) return null;
  const whole = Number(match[1]);
  const fraction = (match[2] ?? "").padEnd(2, "0");
  const minor = whole * 100 + Number(fraction || "0");
  return Number.isSafeInteger(minor) ? { amountMinor: minor, currency: "PLN" } : null;
}

export function priceDisplayLabel(
  priceState: "free" | "paid" | "unknown",
  amountMinor: number | null,
  currency: string | null,
): string {
  if (priceState === "free") return "ZA DARMO";
  if (priceState !== "paid") return "CENA NIEZNANA";
  if (amountMinor !== null && currency === "PLN") {
    return `${(amountMinor / 100).toFixed(2).replace(".", ",")} PLN`;
  }
  return "PŁATNY";
}
