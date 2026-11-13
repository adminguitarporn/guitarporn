import { GearGallery } from "@/components/gear/gear-gallery";
import { getGearList } from "@/lib/repositories/gear";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Gear DB",
  description:
    "The member guitar database. Real submissions only — browse by brand, or add the first rig.",
  path: "/gear",
});

export const revalidate = 60;

export default async function GearPage() {
  const gear = await getGearList();
  return <GearGallery gear={gear} />;
}
