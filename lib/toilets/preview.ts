import type { NearbyToilet } from "./nearby";

export const WALKING_ROUTE_MULTIPLIER = 1.1;
export const WALKING_METRES_PER_MINUTE = 90;

export function approximateWalkingMinutes(distanceMeters: number): number {
  if (!Number.isFinite(distanceMeters) || distanceMeters < 0) {
    throw new Error("distanceMeters must be a non-negative finite number");
  }
  return Math.max(
    1,
    Math.ceil((distanceMeters * WALKING_ROUTE_MULTIPLIER) / WALKING_METRES_PER_MINUTE),
  );
}

export function formatDistance(distanceMeters: number): string {
  if (distanceMeters < 1_000) return `${distanceMeters} M`;
  return `${(distanceMeters / 1_000).toFixed(1).replace(".", ",")} KM`;
}

export function pricePreviewLabel(priceState: NearbyToilet["priceState"]): string {
  if (priceState === "free") return "ZA DARMO";
  if (priceState === "paid") return "PŁATNY";
  return "CENA NIEZNANA";
}

export const UNKNOWN_OPENING_STATUS_LABEL = "STATUS NIEZNANY";
