import type { Metadata } from "next";
import "maplibre-gl/dist/maplibre-gl.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://gdziekibel.pl"),
  title: "GdzieKibel.pl — znajdź kibel szybko, zanim się zesrasz",
  description: "GdzieKibel.pl szybko znajdzie Ci pobliski kibel w Warszawie — bez zapisywania Twojej lokalizacji.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "/",
    siteName: "GdzieKibel.pl",
    title: "GdzieKibel.pl — znajdź kibel szybko, zanim się zesrasz",
    description: "GdzieKibel.pl szybko znajdzie Ci pobliski kibel w Warszawie — bez zapisywania Twojej lokalizacji.",
  },
  twitter: {
    card: "summary_large_image",
    title: "GdzieKibel.pl — znajdź kibel szybko, zanim się zesrasz",
    description: "GdzieKibel.pl szybko znajdzie Ci pobliski kibel w Warszawie — bez zapisywania Twojej lokalizacji.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
