import Link from "next/link";
import { WarsawMapArtwork } from "@/components/map/warsaw-map-artwork";
import { LocationExperience } from "@/components/location/location-experience";

export default function Home() {
  return (
    <main className="map-shell" data-testid="map-shell" id="mapa-warszawy">
      <WarsawMapArtwork />

      <header className="map-header">
        <Link className="map-header__brand" href="/" aria-label="GdzieKibel.pl — wróć do strony startowej">
          <span>GDZIE</span>KIBEL.PL
        </Link>
        <span className="map-header__city">WARSZAWA</span>
      </header>

      <div className="map-label map-label--centre" aria-hidden="true">ŚRÓDMIEŚCIE</div>
      <div className="map-label map-label--river" aria-hidden="true">WISŁA</div>

      <LocationExperience />

      <p className="map-shell__caption">TY W POTRZEBIE. MY SZUKAMY.</p>
    </main>
  );
}
