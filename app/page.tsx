import { WarsawMapArtwork } from "@/components/map/warsaw-map-artwork";
import { LocationExperience } from "@/components/location/location-experience";

export default function Home() {
  return (
    <main className="map-shell" data-testid="map-shell" id="mapa-warszawy">
      <WarsawMapArtwork />

      <header className="map-header">
        <a className="map-header__brand" href="#start" aria-label="GdzieKibel.pl — strona główna">
          <span>GDZIE</span>KIBEL.PL
        </a>
        <span className="map-header__city">WARSZAWA</span>
      </header>

      <div className="map-label map-label--centre" aria-hidden="true">ŚRÓDMIEŚCIE</div>
      <div className="map-label map-label--river" aria-hidden="true">WISŁA</div>

      <LocationExperience />

      <p className="map-shell__caption">TY W POTRZEBIE. MY SZUKAMY.</p>
      <p className="map-shell__attribution">Dane: <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap contributors</a></p>
    </main>
  );
}
