import type { Metadata } from "next";
import { ContentInProgress } from "@/components/wip/content-in-progress";

export const metadata: Metadata = {
  title: "Videos",
  description: "Coming soon.",
};

export default function VideosPage() {
  return <ContentInProgress />;
}
