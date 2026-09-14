export interface GeographicPoint {
  latitude: number;
  longitude: number;
}

// Deliberately wider than Warsaw's administrative outline to avoid rejecting edge locations.
export const WARSAW_SUPPORTED_BOUNDS = {
  minLatitude: 51.95,
  maxLatitude: 52.45,
  minLongitude: 20.65,
  maxLongitude: 21.4,
} as const;

export function isWithinWarsawSupportedArea(point: GeographicPoint): boolean {
  return point.latitude >= WARSAW_SUPPORTED_BOUNDS.minLatitude
    && point.latitude <= WARSAW_SUPPORTED_BOUNDS.maxLatitude
    && point.longitude >= WARSAW_SUPPORTED_BOUNDS.minLongitude
    && point.longitude <= WARSAW_SUPPORTED_BOUNDS.maxLongitude;
}
