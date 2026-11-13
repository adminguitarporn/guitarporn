import { HomePage } from "@/components/home/home-page";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "GuitarPorn — Guitar community",
  description:
    "Built for people obsessed with guitars. The member gear database, channel videos, and the club shop.",
  path: "/",
  absoluteTitle: true,
  shareImage: false,
});

export default function Page() {
  return <HomePage />;
}
