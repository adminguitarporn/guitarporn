import { mockVideos } from "@/lib/repositories/mock-videos";
import { fetchLiveChannelVideos, isYoutubeId } from "@/lib/youtube";
import type { CommunityVideo } from "@/types/video";

/**
 * Video listing — live uploads from the GuitarPorn YouTube channel
 * (Data API, then RSS, then the channel /videos page; cached 1h).
 * Curated mocks are only used when every live source fails, and only
 * entries with a valid YouTube id are returned.
 */
export async function getVideoList(): Promise<CommunityVideo[]> {
  const videos = await fetchLiveChannelVideos();
  const live = videos.filter((video) => isYoutubeId(video.youtubeId));
  if (live.length > 0) return live;
  return mockVideos.filter((video) => isYoutubeId(video.youtubeId));
}
