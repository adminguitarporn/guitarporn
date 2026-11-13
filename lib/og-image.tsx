import { ImageResponse } from "next/og";
import type { ReactNode } from "react";
import { SITE_URL } from "@/lib/seo";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const ALLOWED_IMAGE_HOST =
  /(^|\.)supabase\.co$|(^|\.)guitarporn\.club$|^guitarporn\.club$/;

function clip(value: string, max: number): string {
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1)}...`;
}

/** Public member photos only. Refuses other hosts so share cards cannot fetch arbitrary URLs. */
export function allowedGearImageUrl(imageUrl: string): string | null {
  let url: URL;
  try {
    url = new URL(imageUrl);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  if (url.username || url.password) return null;
  if (!ALLOWED_IMAGE_HOST.test(url.hostname)) return null;
  if (
    url.hostname.endsWith(".supabase.co") &&
    !url.pathname.startsWith("/storage/v1/object/public/")
  ) {
    return null;
  }
  return url.toString();
}

async function photoDataUrl(imageUrl: string): Promise<string | null> {
  const safe = allowedGearImageUrl(imageUrl);
  if (!safe) return null;

  try {
    const res = await fetch(safe, {
      redirect: "error",
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const type = res.headers.get("content-type")?.split(";")[0]?.trim() ?? "";
    if (!type.startsWith("image/")) return null;
    const bytes = Buffer.from(await res.arrayBuffer());
    if (bytes.byteLength === 0 || bytes.byteLength > 4_000_000) return null;
    return `data:${type};base64,${bytes.toString("base64")}`;
  } catch {
    return null;
  }
}

function frame(children: ReactNode) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#09090b",
          backgroundImage:
            "radial-gradient(ellipse 80% 70% at 0% 0%, rgba(255,255,255,0.08), transparent 55%)",
          color: "#fafafa",
          fontFamily: "geist",
        }}
      >
        {children}
      </div>
    ),
    { ...ogSize },
  );
}

/** Default share card for the club. Uses the Geist face bundled with next/og. */
export function clubOgImage(subtitle?: string) {
  return frame(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: "72px",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 22,
          letterSpacing: 8,
          color: "#71717a",
          textTransform: "uppercase",
        }}
      >
        GuitarPorn Club
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontSize: 92, letterSpacing: -2 }}>
          GuitarPorn
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 18,
            fontSize: 34,
            color: "#a1a1aa",
          }}
        >
          {subtitle ?? "Built for people obsessed with guitars."}
        </div>
      </div>
      <div style={{ display: "flex", fontSize: 24, color: "#52525b" }}>
        guitarporn.club
      </div>
    </div>,
  );
}

export async function gearOgImage(gear: {
  brand: string;
  model: string;
  color: string;
  year?: number | null;
  ownerName?: string | null;
  imageUrl: string;
}) {
  const photo = await photoDataUrl(gear.imageUrl);
  const detail = [gear.color, gear.year ? String(gear.year) : ""]
    .filter((part) => part.trim().length > 0)
    .join("  ·  ");
  const owner = gear.ownerName?.trim();
  const who = owner ? `Added by ${clip(owner, 48)}` : "Added by a member";

  return frame(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        padding: "48px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
          paddingRight: photo ? 36 : 0,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 20,
            letterSpacing: 6,
            color: "#71717a",
            textTransform: "uppercase",
          }}
        >
          GuitarPorn Club
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              letterSpacing: 4,
              color: "#a1a1aa",
              textTransform: "uppercase",
            }}
          >
            {clip(gear.brand, 32)}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 14,
              fontSize: 58,
              lineHeight: 1.05,
              letterSpacing: -1,
            }}
          >
            {clip(gear.model, 42)}
          </div>
          {detail ? (
            <div
              style={{
                display: "flex",
                marginTop: 22,
                fontSize: 28,
                color: "#a1a1aa",
              }}
            >
              {clip(detail, 60)}
            </div>
          ) : null}
          <div
            style={{
              display: "flex",
              marginTop: 14,
              fontSize: 26,
              color: "#e4e4e7",
            }}
          >
            {who}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#52525b" }}>
          {SITE_URL.replace("https://", "")}
        </div>
      </div>
      {photo ? (
        <div
          style={{
            display: "flex",
            width: 420,
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo}
            alt=""
            width={400}
            height={534}
            style={{
              width: 400,
              height: 534,
              objectFit: "cover",
              borderRadius: 28,
            }}
          />
        </div>
      ) : null}
    </div>,
  );
}
