import { ImageResponse } from "next/og";

export const alt = "GdzieKibel.pl — znajdź kibel szybko, zanim się zesrasz!";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, background: "#0b0b0b", color: "#f5f2ea", border: "24px solid #f53275" }}>
      <div style={{ display: "flex", fontSize: 58, fontWeight: 900, letterSpacing: -2 }}><span style={{ color: "#f53275" }}>GDZIE</span>KIBEL.PL</div>
      <div style={{ display: "flex", flexDirection: "column", fontSize: 118, fontWeight: 900, letterSpacing: -5, lineHeight: 0.84 }}><span>ZNAJDŹ KIBEL.</span><span style={{ color: "#f53275" }}>SZYBKO!</span></div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 34, fontWeight: 800 }}><span>ZANIM SIĘ ZESRASZ.</span><span style={{ background: "#ffe31a", padding: "16px 24px", border: "5px solid #f5f2ea", color: "#0b0b0b" }}>WARSZAWA</span></div>
    </div>,
    size,
  );
}
