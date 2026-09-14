import { describe, expect, it } from "vitest";
import { DEFAULT_MAP_STYLE_URL, resolveMapStyleUrl, WARSAW_MAP_CENTER } from "../../lib/map/config";

describe("map provider configuration", () => {
  it("uses the documented OpenFreeMap style by default", () => {
    expect(resolveMapStyleUrl()).toBe(DEFAULT_MAP_STYLE_URL);
    expect(WARSAW_MAP_CENTER).toEqual({ lat: 52.2297, lng: 21.0122 });
  });

  it("accepts a configurable HTTPS MapLibre style", () => {
    expect(resolveMapStyleUrl(" https://api.maptiler.com/maps/streets-v4/style.json?key=test "))
      .toBe("https://api.maptiler.com/maps/streets-v4/style.json?key=test");
  });

  it("rejects insecure and public OSM tile endpoints", () => {
    expect(() => resolveMapStyleUrl("http://tiles.example.test/style.json")).toThrow(/HTTPS/);
    expect(() => resolveMapStyleUrl("https://tile.openstreetmap.org/style.json")).toThrow(/not an approved/);
  });
});
