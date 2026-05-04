import type { Metadata } from "next";
import { ContentInProgress } from "@/components/wip/content-in-progress";

export const metadata: Metadata = {
  title: "Shop",
  description: "Coming soon.",
};

export default function ShopPage() {
  return <ContentInProgress />;
}
