export interface NavigationDestination {
  lat: number;
  lng: number;
}

export function googleMapsWalkingUrl(destination: NavigationDestination): string | null {
  if (
    !Number.isFinite(destination.lat)
    || !Number.isFinite(destination.lng)
    || destination.lat < -90
    || destination.lat > 90
    || destination.lng < -180
    || destination.lng > 180
  ) {
    return null;
  }

  const url = new URL("https://www.google.com/maps/dir/");
  url.searchParams.set("api", "1");
  url.searchParams.set("destination", `${destination.lat},${destination.lng}`);
  url.searchParams.set("travelmode", "walking");
  return url.toString();
}
