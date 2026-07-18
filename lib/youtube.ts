import type { CommunityVideo } from "@/types/video";

/** GuitarPorn YouTube channel — https://www.youtube.com/@guitarporn-club */
export const YOUTUBE_CHANNEL_ID = "UC5vYif_qR8a-u_4ROY84yrw";
export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@guitarporn-club";

const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'");
}

function tag(block: string, name: string): string {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return m ? decodeEntities(m[1].trim()) : "";
}

/**
 * Every new upload on the channel appears here automatically — the page
 * re-fetches the feed at most once per hour (see `revalidate` below).
 *
 * Note: YouTube's RSS feed returns the latest ~15 uploads. If you want the
 * full archive listed once the channel grows past that, we add a YouTube
 * Data API key (free) — one env var, no other changes.
 */
export async function fetchChannelVideos(): Promise<CommunityVideo[]> {
  try {
    const res = await fetch(FEED_URL, {
      next: { revalidate: 3600 },
      headers: { "user-agent": "guitarporn.club site" },
    });
    if (!res.ok) return [];
    const xml = await res.text();

    const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];
    const videos: CommunityVideo[] = [];
    for (const entry of entries) {
      const youtubeId = tag(entry, "yt:videoId");
      if (!youtubeId) continue;
      videos.push({
        id: `yt-${youtubeId}`,
        youtubeId,
        title: tag(entry, "title"),
        description: tag(entry, "media:description").split("\n")[0] ?? "",
        publishedAt: tag(entry, "published") || undefined,
        thumbnail: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
      });
    }
    return videos;
  } catch {
    return [];
  }
}
