import { ImageResponse } from "next/og";

export const alt = "Satis Group — property redevelopment in the North West";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Colours mirror the site's ink/accent tokens in app/globals.css.
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#000000",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: 14,
            textTransform: "uppercase",
            color: "#c9a05c",
          }}
        >
          Satis Group
        </div>
        <div style={{ fontSize: 62, marginTop: 28, lineHeight: 1.15 }}>
          We turn overlooked buildings into places people want to be.
        </div>
        <div style={{ fontSize: 24, marginTop: 32, color: "#c9a05c" }}>
          Reviving the past. Building the future.
        </div>
      </div>
    ),
    size
  );
}
