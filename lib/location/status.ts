export type LocationStatus =
  | "idle"
  | "loading"
  | "success"
  | "denied"
  | "unavailable"
  | "timeout"
  | "unsupported"
  | "outside_warsaw"
  | "error";

export interface LocationMessage {
  kicker: string;
  headline: string;
  body: string;
  action: string;
}

export function statusFromGeolocationError(code: number): LocationStatus {
  if (code === 1) return "denied";
  if (code === 2) return "unavailable";
  if (code === 3) return "timeout";
  return "error";
}

export function messageForLocationStatus(status: LocationStatus): LocationMessage {
  switch (status) {
    case "loading":
      return {
        kicker: "CHWILA MOMENT",
        headline: "SZUKAM CIĘ…",
        body: "Sprawdzamy Twoją lokalizację. Niczego nie zapisujemy.",
        action: "SZUKAM…",
      };
    case "success":
      return {
        kicker: "MAMY CIĘ",
        headline: "TU JESTEŚ.",
        body: "Lokalizacja znaleziona. Następny krok: najbliższe kible.",
        action: "ODŚWIEŻ LOKALIZACJĘ",
      };
    case "denied":
      return {
        kicker: "BRAK ZGODY",
        headline: "NIE WIEMY, GDZIE JESTEŚ.",
        body: "Zezwól przeglądarce na lokalizację albo zostań na mapie Warszawy.",
        action: "SPRÓBUJ PONOWNIE",
      };
    case "unavailable":
      return {
        kicker: "BRAK SYGNAŁU",
        headline: "LOKALIZACJA NIE DZIAŁA.",
        body: "Telefon nie mógł ustalić pozycji. Sprawdź GPS i spróbuj ponownie.",
        action: "SPRÓBUJ PONOWNIE",
      };
    case "timeout":
      return {
        kicker: "ZA DŁUGO",
        headline: "GPS SIĘ GUZDRA.",
        body: "Nie dostaliśmy pozycji na czas. Spróbuj jeszcze raz.",
        action: "SPRÓBUJ PONOWNIE",
      };
    case "unsupported":
      return {
        kicker: "STARA PRZEGLĄDARKA",
        headline: "BRAK LOKALIZACJI.",
        body: "Ta przeglądarka nie udostępnia lokalizacji. Możesz zostać na mapie Warszawy.",
        action: "SPRAWDŹ PONOWNIE",
      };
    case "outside_warsaw":
      return {
        kicker: "TYLKO WARSZAWA",
        headline: "JESZCZE TU NIE DZIAŁAMY.",
        body: "Szukamy kibli na terenie Warszawy. Możesz otworzyć mapę miasta albo spróbować ponownie.",
        action: "SPRÓBUJ PONOWNIE",
      };
    case "error":
      return {
        kicker: "COŚ POSZŁO NIE TAK",
        headline: "NIE UDAŁO SIĘ.",
        body: "Nie mogliśmy pobrać lokalizacji. Spróbuj ponownie.",
        action: "SPRÓBUJ PONOWNIE",
      };
    default:
      return {
        kicker: "POTRZEBA PILNA?",
        headline: "CHCE CI SIĘ SRAĆ?",
        body: "Znajdziemy Ci kibel. Szybko.",
        action: "GDZIE JESTEM",
      };
  }
}
