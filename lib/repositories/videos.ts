import { fetchChannelVideos } from "@/lib/youtube";
import { mockVideos } from "@/lib/repositories/mock-videos";
import type { CommunityVideo } from "@/types/video";

/**
 * Video listing — pulled live from the GuitarPorn YouTube channel feed
 * (cached 1h). Falls back to the curated mocks if the feed is unreachable.
 */
export async function getVideoList(): Promise<CommunityVideo[]> {
  const videos = await fetchChannelVideos();
  return videos.length > 0 ? videos : mockVideos;
}
