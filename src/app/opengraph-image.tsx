import { ImageResponse } from "next/og";

export const alt = "Føyka Fysioterapi og Osteopati – Asker sentrum";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 90,
          background: "#023535",
          color: "#fff",
        }}
      >
        <div style={{ fontSize: 34, color: "#0caba8", letterSpacing: 6, textTransform: "uppercase" }}>
          Asker sentrum · Erteløkka 1
        </div>
        <div style={{ fontSize: 110, fontWeight: 900, marginTop: 20 }}>FØYKA</div>
        <div style={{ fontSize: 56, marginTop: 4 }}>Fysioterapi & Osteopati</div>
        <div style={{ fontSize: 32, marginTop: 40, color: "#c2ebea" }}>
          Fysikalsk institutt med driftsavtale med Asker kommune
        </div>
      </div>
    ),
    size,
  );
}
