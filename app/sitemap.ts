import type { MetadataRoute } from "next";
import { getGearList } from "@/lib/repositories/gear";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

const STATIC_ROUTES: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/gear", changeFrequency: "daily", priority: 0.9 },
  { path: "/videos", changeFrequency: "daily", priority: 0.8 },
  { path: "/shop", changeFrequency: "weekly", priority: 0.7 },
  { path: "/gear/submit", changeFrequency: "monthly", priority: 0.6 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
];

function modified(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const gear = await getGearList();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const gearEntries: MetadataRoute.Sitemap = gear.map((item) => ({
    url: absoluteUrl(`/gear/${item.id}`),
    lastModified: modified(item.createdAt),
    changeFrequency: "monthly",
    priority: 0.6,
    images: item.imageUrl.startsWith("https://") ? [item.imageUrl] : undefined,
  }));

  return [...staticEntries, ...gearEntries];
}
