import type { Metadata } from "next";
import { ContentInProgress } from "@/components/wip/content-in-progress";

export const metadata: Metadata = {
  title: "Gear",
  description: "Coming soon.",
};

export default function GearPage() {
  return <ContentInProgress />;
}
