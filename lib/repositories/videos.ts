import { mockVideos } from "@/lib/repositories/mock-videos";
import type { CommunityVideo } from "@/types/video";

/**
 * Video listing — curated episodes only (see mock-videos.ts).
 * The live channel feed (`fetchChannelVideos` in lib/youtube.ts) is switched off
 * so no generic uploads appear. To re-enable it, return the feed result here.
 */
export async function getVideoList(): Promise<CommunityVideo[]> {
  return mockVideos;
}
