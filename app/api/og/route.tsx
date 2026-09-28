import { ImageResponse } from "next/og";
import { promises as fs } from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

let logo: string | null = null;
async function logoData() {
  if (!logo) {
    const buf = await fs.readFile(path.join(process.cwd(), "public", "brand", "logo.png"));
    logo = `data:image/png;base64,${buf.toString("base64")}`;
  }
  return logo;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") || "Renovatie & verbouw").slice(0, 110);
  const eyebrow = (searchParams.get("eyebrow") || "").slice(0, 60);
  const src = await logoData();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#ffffff",
          color: "#15120f",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -160,
            bottom: -160,
            width: 560,
            height: 560,
            borderRadius: 9999,
            border: "90px solid #FC5000",
            display: "flex",
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={400} height={80} alt="" />
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 900 }}>
          {eyebrow && (
            <div style={{ fontSize: 26, color: "#FC5000", textTransform: "uppercase", letterSpacing: 4, marginBottom: 20, display: "flex" }}>
              {eyebrow}
            </div>
          )}
          <div style={{ fontSize: 68, fontWeight: 800, color: "#15120f", lineHeight: 1.05, letterSpacing: -1.5, display: "flex" }}>{title}</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800" },
    },
  );
}
