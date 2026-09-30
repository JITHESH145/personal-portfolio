import { ImageResponse } from "next/og";

export const alt = "Jithesh Shaju P — Data Science & Machine Learning Specialist";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const tick = {
  position: "absolute",
  width: 44,
  height: 44,
  borderColor: "#c9f24b",
  borderStyle: "solid",
  borderWidth: 0,
} as const;

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 88,
          background: "#080b12",
          color: "#e8ecf4",
          position: "relative",
        }}
      >
        <div style={{ ...tick, top: 48, left: 48, borderTopWidth: 3, borderLeftWidth: 3 }} />
        <div style={{ ...tick, top: 48, right: 48, borderTopWidth: 3, borderRightWidth: 3 }} />
        <div style={{ ...tick, bottom: 48, left: 48, borderBottomWidth: 3, borderLeftWidth: 3 }} />
        <div style={{ ...tick, bottom: 48, right: 48, borderBottomWidth: 3, borderRightWidth: 3 }} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 112,
            fontWeight: 700,
            lineHeight: 0.95,
            letterSpacing: -3,
          }}
        >
          <span>JITHESH</span>
          <span>SHAJU P</span>
        </div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 38, color: "#9aa5ba" }}>
          Data Science &amp; Machine Learning Specialist
        </div>
      </div>
    ),
    size,
  );
}
