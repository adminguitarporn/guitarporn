import type { Metadata } from "next";

export const SITE_URL = "https://guitarporn.club";
export const SITE_NAME = "GuitarPorn";

const HOME_TITLE = "GuitarPorn — Guitar community";
const HOME_DESCRIPTION =
  "Built for people obsessed with guitars. The member gear database, channel videos, and the club shop.";

type PageMetaArgs = {
  title: string;
  description: string;
  path: string;
  /** Keep this title whole. Otherwise the layout template appends " · GuitarPorn". */
  absoluteTitle?: boolean;
  /**
   * Root and `/gear/[id]` already attach a file image (`opengraph-image.tsx`).
   * Other routes need the club card declared here, because that file does not
   * inherit onto child segments.
   */
  shareImage?: boolean;
};

export function absoluteUrl(path: string): string {
  if (path === "/") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Route metadata with a canonical URL plus Open Graph and Twitter cards. */
const CLUB_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "GuitarPorn Club — built for people obsessed with guitars.",
} as const;

export function pageMeta({
  title,
  description,
  path,
  absoluteTitle = false,
  shareImage = true,
}: PageMetaArgs): Metadata {
  const url = absoluteUrl(path);
  const socialTitle = title.includes(SITE_NAME)
    ? title
    : `${title} · ${SITE_NAME}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: socialTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
      ...(shareImage ? { images: [CLUB_IMAGE] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      ...(shareImage
        ? {
            images: [
              {
                url: "/twitter-image",
                width: 1200,
                height: 630,
                alt: CLUB_IMAGE.alt,
              },
            ],
          }
        : {}),
    },
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: `%s · ${SITE_NAME}`,
  },
  description: HOME_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export function gearShareCopy(gear: {
  brand: string;
  model: string;
  color: string;
  year?: number | null;
  ownerName?: string | null;
}): { title: string; description: string } {
  const title = `${gear.brand} ${gear.model}`.trim();
  const detail = [gear.color.trim(), gear.year ? String(gear.year) : ""]
    .filter((part) => part.length > 0)
    .join(" · ");
  const owner = gear.ownerName?.trim();
  const who = owner
    ? `Added by ${owner}.`
    : "Added by a GuitarPorn Club member.";
  const description = detail ? `${detail}. ${who}` : who;
  return { title, description };
}
