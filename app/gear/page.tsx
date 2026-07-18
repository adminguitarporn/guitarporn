import type { Metadata } from "next";
import { GearGallery } from "@/components/gear/gear-gallery";
import { getGearList } from "@/lib/repositories/gear";

export const metadata: Metadata = {
  title: "Gear DB",
  description:
    "The community guitar database. Every instrument uploaded by a member of the club — browse by brand, add yours.",
};

export const revalidate = 60;

export default async function GearPage() {
  const gear = await getGearList();
  return <GearGallery gear={gear} />;
}
