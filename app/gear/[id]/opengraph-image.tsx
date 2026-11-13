import { notFound } from "next/navigation";
import { gearOgImage, ogContentType, ogSize } from "@/lib/og-image";
import { getGearById } from "@/lib/repositories/gear";

export const alt = "Member guitar on GuitarPorn Club";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const gear = await getGearById(id);
  if (!gear) notFound();
  return gearOgImage(gear);
}
