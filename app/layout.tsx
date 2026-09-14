import type { Metadata } from "next";
import "maplibre-gl/dist/maplibre-gl.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://gdziewc.pl"),
  title: "GDZIEWC.PL — znajdź WC szybko, zanim się zesrasz!",
  description: "GDZIEWC.PL szybko znajdzie Ci pobliskie WC w Warszawie — bez zapisywania Twojej lokalizacji.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "/",
    siteName: "GDZIEWC.PL",
    title: "GDZIEWC.PL — znajdź WC szybko, zanim się zesrasz!",
    description: "GDZIEWC.PL szybko znajdzie Ci pobliskie WC w Warszawie — bez zapisywania Twojej lokalizacji.",
    images: [{
      url: "/share/gdziekibel-poster-share.png",
      width: 1731,
      height: 909,
      alt: "Lepiej znaleźć WC niż się zesrać! — GDZIEWC.PL",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GDZIEWC.PL — znajdź WC szybko, zanim się zesrasz!",
    description: "GDZIEWC.PL szybko znajdzie Ci pobliskie WC w Warszawie — bez zapisywania Twojej lokalizacji.",
    images: ["/share/gdziekibel-poster-share.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
