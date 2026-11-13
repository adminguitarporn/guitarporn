import { clubOgImage, ogContentType, ogSize } from "@/lib/og-image";

export const alt = "GuitarPorn Club — built for people obsessed with guitars.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return clubOgImage();
}
