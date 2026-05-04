import { mockVideos } from "@/lib/repositories/mock-videos";
import type { CommunityVideo } from "@/types/video";

/**
 * Video listing — static for now; later swap for Supabase `videos` or CMS.
 */
export async function getVideoList(): Promise<CommunityVideo[]> {
  return mockVideos;
}
