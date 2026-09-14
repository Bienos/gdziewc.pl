import type { Metadata } from "next";
import "maplibre-gl/dist/maplibre-gl.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://gdziekibel.pl"),
  title: "GdzieKibel.pl — znajdź publiczną toaletę w Warszawie",
  description: "Znajdź najbliższą publiczną toaletę w Warszawie. Sprawdź odległość, godziny, cenę i dostępność bez zapisywania swojej lokalizacji.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "/",
    siteName: "GdzieKibel.pl",
    title: "GdzieKibel.pl — toalety publiczne w Warszawie",
    description: "Warszawa nie trzyma. Znajdź najbliższą publiczną toaletę szybko i bez zapisywania lokalizacji.",
  },
  twitter: {
    card: "summary_large_image",
    title: "GdzieKibel.pl — toalety publiczne w Warszawie",
    description: "Znajdź najbliższy kibel w Warszawie — szybko i prywatnie.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
