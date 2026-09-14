import type { NearbyToilet } from "./nearby";

export function accessDetailLabel(accessState: NearbyToilet["accessState"]): string {
  if (accessState === "public") return "PUBLICZNY";
  if (accessState === "restricted") return "DOSTĘP OGRANICZONY";
  return "DOSTĘP NIEZNANY";
}

export function wheelchairDetailLabel(value: NearbyToilet["wheelchairState"]): string {
  if (value === "accessible") return "DOSTĘPNY";
  if (value === "limited") return "OGRANICZONY";
  if (value === "not_accessible") return "NIEDOSTĘPNY";
  return "NIEZNANE";
}

export function babyChangingDetailLabel(value: NearbyToilet["babyChangingState"]): string {
  if (value === "available") return "JEST";
  if (value === "limited") return "OGRANICZONY";
  if (value === "unavailable") return "BRAK";
  return "NIEZNANE";
}

export function unisexDetailLabel(value: NearbyToilet["unisexState"]): string {
  if (value === "yes") return "TAK";
  if (value === "no") return "NIE";
  return "NIEZNANE";
}

export function confidenceDetailLabel(value: NearbyToilet["confidenceLevel"]): string {
  if (value === "high") return "WYSOKA PEWNOŚĆ";
  if (value === "medium") return "ŚREDNIA PEWNOŚĆ";
  return "NISKA PEWNOŚĆ";
}

export function lowConfidenceCaution(value: NearbyToilet["confidenceLevel"]): string | null {
  return value === "low" ? "DANE DO POTWIERDZENIA" : null;
}
