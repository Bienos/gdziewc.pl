import { ImageResponse } from "next/og";

export const alt = "GdzieKibel.pl — znajdź kibel szybko, zanim się zesrasz!";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#080808", color: "#ff3d8d", overflow: "hidden" }}>
      <div style={{ width: 34, height: "100%", display: "flex", background: "#f5f2ea", transform: "rotate(1deg) scale(1.08)" }} />
      <div style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "32px 64px 42px", borderTop: "10px solid #1f1f24", borderBottom: "10px solid #1f1f24" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", width: 176, height: 18, background: "#ffd800", transform: "rotate(-2deg)" }} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "#ff3d8d", fontSize: 34, fontWeight: 900, lineHeight: 0.68, transform: "rotate(-5deg)" }}><span>W</span><span style={{ width: 56, borderTop: "6px solid #ff3d8d", marginTop: 8 }} /></div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", fontSize: 88, fontWeight: 900, letterSpacing: -5, lineHeight: 0.8, textTransform: "uppercase" }}>
          <span style={{ transform: "rotate(-2deg)" }}>LEPIEJ ZNALEŹĆ</span>
          <span style={{ transform: "rotate(1deg)", marginLeft: 74 }}>KIBEL</span>
          <span style={{ transform: "rotate(-3deg)", marginLeft: 18 }}>NIŻ SIĘ</span>
          <span style={{ transform: "rotate(2deg)", marginLeft: 116 }}>ZESRAĆ!</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", background: "#ffd800", color: "#0b0b0b", padding: "18px 34px", border: "5px solid #0b0b0b", boxShadow: "6px 6px 0 #ff3d8d", fontSize: 42, fontWeight: 900, letterSpacing: -2, transform: "rotate(-4deg)" }}>GDZIEKIBEL.PL</div>
          <div style={{ display: "flex", color: "#f5f2ea", fontSize: 22, fontWeight: 800, letterSpacing: 2 }}>WARSZAWA</div>
        </div>
      </div>
      <div style={{ width: 22, height: "100%", display: "flex", background: "#f5f2ea", transform: "rotate(-1deg) scale(1.08)" }} />
    </div>,
    size,
  );
}
