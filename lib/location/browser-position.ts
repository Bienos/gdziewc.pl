export interface BrowserPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
}

const EARTH_RADIUS_METERS = 6_371_000;

export function browserPositionFromCoordinates(coords: GeolocationCoordinates): BrowserPosition {
  return {
    latitude: coords.latitude,
    longitude: coords.longitude,
    accuracy: Math.max(1, coords.accuracy),
  };
}

export function distanceBetweenPositionsMeters(first: BrowserPosition, second: BrowserPosition): number {
  const latitudeDelta = ((second.latitude - first.latitude) * Math.PI) / 180;
  const longitudeDelta = ((second.longitude - first.longitude) * Math.PI) / 180;
  const firstLatitude = (first.latitude * Math.PI) / 180;
  const secondLatitude = (second.latitude * Math.PI) / 180;
  const haversine = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(firstLatitude) * Math.cos(secondLatitude) * Math.sin(longitudeDelta / 2) ** 2;
  return 2 * EARTH_RADIUS_METERS * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

export function shouldAcceptWatchedPosition(previous: BrowserPosition, candidate: BrowserPosition): boolean {
  const accuracyImproved = candidate.accuracy + 5 < previous.accuracy;
  const positionChangedBeyondAccuracy = distanceBetweenPositionsMeters(previous, candidate)
    > Math.max(25, previous.accuracy + candidate.accuracy);
  return accuracyImproved || positionChangedBeyondAccuracy;
}

export function shouldRefreshNearbyForPosition(previous: BrowserPosition, candidate: BrowserPosition): boolean {
  return distanceBetweenPositionsMeters(previous, candidate) > Math.max(60, previous.accuracy + candidate.accuracy);
}
