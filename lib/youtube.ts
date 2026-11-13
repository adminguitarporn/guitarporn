import type { CommunityVideo } from "@/types/video";
import { isYoutubeId } from "@/lib/youtube-id";

export { isYoutubeId } from "@/lib/youtube-id";

/** GuitarPorn YouTube channel — https://www.youtube.com/@guitarporn-club */
export const YOUTUBE_CHANNEL_ID = "UC5vYif_qR8a-u_4ROY84yrw";
export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@guitarporn-club";

const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;
const CHANNEL_VIDEOS_URL = `https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}/videos`;
const HANDLE_VIDEOS_URL = `${YOUTUBE_CHANNEL_URL}/videos`;
const DATA_API_URL = "https://www.googleapis.com/youtube/v3/playlistItems";
const REVALIDATE_SECONDS = 3600;

/**
 * Browser-like headers. YouTube's channel HTML (and the tab title "Videos")
 * follows Accept-Language; a bare bot UA is more likely to get a consent wall.
 */
const FETCH_HEADERS = {
  "user-agent":
    "Mozilla/5.0 (compatible; guitarporn.club/1.0; +https://guitarporn.club)",
  "accept-language": "en-US,en;q=0.9",
};

type Json =
  | null
  | boolean
  | number
  | string
  | Json[]
  | { [key: string]: Json };

function decodeEntities(value: string): string {
  const named = value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'");
  return named
    .replace(/&#(\d+);/g, (all, digits: string) =>
      codePointOr(Number(digits), all),
    )
    .replace(/&#x([0-9a-f]+);/gi, (all, hex: string) =>
      codePointOr(parseInt(hex, 16), all),
    );
}

function codePointOr(code: number, fallback: string): string {
  if (!Number.isFinite(code) || code < 1 || code > 0x10ffff) return fallback;
  try {
    return String.fromCodePoint(code);
  } catch {
    return fallback;
  }
}

function tag(block: string, name: string): string {
  const match = block.match(
    new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`),
  );
  if (!match) return "";
  let value = match[1].trim();
  const cdata = value.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
  if (cdata) value = cdata[1].trim();
  return decodeEntities(value);
}

function isoOrUndefined(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return undefined;
  if (Number.isNaN(Date.parse(trimmed))) return undefined;
  return trimmed;
}

function toVideo(
  youtubeId: string,
  title: string,
  description: string,
  publishedAt?: string,
): CommunityVideo | null {
  if (!isYoutubeId(youtubeId)) return null;
  const cleanTitle = decodeEntities(title).replace(/\s+/g, " ").trim();
  if (
    !cleanTitle ||
    cleanTitle === "Private video" ||
    cleanTitle === "Deleted video"
  ) {
    return null;
  }
  return {
    id: `yt-${youtubeId}`,
    youtubeId,
    title: cleanTitle,
    description: decodeEntities(description).split("\n")[0]?.trim() ?? "",
    publishedAt: isoOrUndefined(publishedAt),
    thumbnail: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
  };
}

function dedupe(videos: CommunityVideo[]): CommunityVideo[] {
  const seen = new Set<string>();
  const unique: CommunityVideo[] = [];
  for (const video of videos) {
    if (seen.has(video.youtubeId)) continue;
    seen.add(video.youtubeId);
    unique.push(video);
  }
  return unique;
}

/** Uploads playlist id is the channel id with the `UC` prefix swapped for `UU`. */
function uploadsPlaylistId(channelId: string): string | null {
  if (!channelId.startsWith("UC") || channelId.length < 3) return null;
  return `UU${channelId.slice(2)}`;
}

type PlaylistResponse = {
  items?: Array<{
    snippet?: {
      title?: string;
      description?: string;
      publishedAt?: string;
      resourceId?: { videoId?: string };
    };
  }>;
};

/**
 * YouTube Data API v3 uploads playlist. Used only when `YOUTUBE_API_KEY`
 * is set. A missing or rejected key returns an empty list so callers can
 * try the RSS feed and the channel page next.
 */
async function fetchVideosFromDataApi(): Promise<CommunityVideo[]> {
  const key = process.env.YOUTUBE_API_KEY?.trim();
  const playlistId = uploadsPlaylistId(YOUTUBE_CHANNEL_ID);
  if (!key || !playlistId) return [];

  const url = new URL(DATA_API_URL);
  url.searchParams.set("part", "snippet");
  url.searchParams.set("playlistId", playlistId);
  url.searchParams.set("maxResults", "50");
  url.searchParams.set("key", key);

  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: { accept: "application/json" },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as PlaylistResponse;
    const videos: CommunityVideo[] = [];
    for (const item of data.items ?? []) {
      const snippet = item.snippet;
      const video = toVideo(
        snippet?.resourceId?.videoId ?? "",
        snippet?.title ?? "",
        snippet?.description ?? "",
        snippet?.publishedAt,
      );
      if (video) videos.push(video);
    }
    return dedupe(videos);
  } catch {
    return [];
  }
}

/**
 * Channel RSS feed (latest ~15 uploads). YouTube sometimes answers 404
 * even when the channel page lists videos; an empty result is not fatal.
 */
export async function fetchChannelVideos(): Promise<CommunityVideo[]> {
  try {
    const res = await fetch(FEED_URL, {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: {
        ...FETCH_HEADERS,
        accept: "application/atom+xml,application/xml,text/xml",
      },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];
    const videos: CommunityVideo[] = [];
    for (const entry of entries) {
      const video = toVideo(
        tag(entry, "yt:videoId"),
        tag(entry, "title"),
        tag(entry, "media:description"),
        tag(entry, "published"),
      );
      if (video) videos.push(video);
    }
    return dedupe(videos);
  } catch {
    return [];
  }
}

function isRecord(
  value: Json | undefined,
): value is { [key: string]: Json } {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function textContent(node: Json | undefined): string {
  if (typeof node === "string") return node;
  if (!isRecord(node)) return "";
  if (typeof node.simpleText === "string") return node.simpleText;
  if (typeof node.content === "string") return node.content;
  if (!Array.isArray(node.runs)) return "";
  return node.runs
    .map((run) => (isRecord(run) && typeof run.text === "string" ? run.text : ""))
    .join("");
}

function extractBalancedJson(html: string, marker: string): Json | null {
  const markerAt = html.indexOf(marker);
  if (markerAt === -1) return null;
  const start = html.indexOf("{", markerAt);
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = start; i < html.length; i++) {
    const char = html[i];
    if (inString) {
      if (escape) escape = false;
      else if (char === "\\") escape = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') inString = true;
    else if (char === "{") depth++;
    else if (char === "}") {
      depth--;
      if (depth === 0) {
        try {
          return JSON.parse(html.slice(start, i + 1)) as Json;
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

function tabUrl(tab: { [key: string]: Json }): string {
  const endpoint = tab.endpoint;
  if (!isRecord(endpoint)) return "";
  const meta = endpoint.commandMetadata;
  if (!isRecord(meta)) return "";
  const web = meta.webCommandMetadata;
  if (!isRecord(web) || typeof web.url !== "string") return "";
  return web.url;
}

/** The Videos tab, matched by title or by a `/videos` endpoint URL. */
function videosTabContent(data: Json): Json | null {
  if (!isRecord(data)) return null;
  const contents = data.contents;
  if (!isRecord(contents)) return null;
  const browse = contents.twoColumnBrowseResultsRenderer;
  if (!isRecord(browse) || !Array.isArray(browse.tabs)) return null;

  const tabs = browse.tabs.filter(isRecord);
  const renderers = tabs
    .map((tab) => tab.tabRenderer)
    .filter(isRecord);

  const match = renderers.find((tab) => {
    const title = textContent(tab.title).trim().toLowerCase();
    return title === "videos" || tabUrl(tab).endsWith("/videos");
  });
  if (match?.content) return match.content;

  const selected = renderers.find((tab) => tab.selected === true && tab.content);
  return selected?.content ?? null;
}

function pushVideo(
  out: CommunityVideo[],
  seen: Set<string>,
  youtubeId: string,
  title: string,
  description: string,
  publishedAt?: string,
) {
  if (seen.has(youtubeId)) return;
  const video = toVideo(youtubeId, title, description, publishedAt);
  if (!video) return;
  seen.add(youtubeId);
  out.push(video);
}

function collectVideos(node: Json, out: CommunityVideo[], seen: Set<string>) {
  if (Array.isArray(node)) {
    for (const item of node) collectVideos(item, out, seen);
    return;
  }
  if (!isRecord(node)) return;

  const renderer = isRecord(node.videoRenderer)
    ? node.videoRenderer
    : isRecord(node.gridVideoRenderer)
      ? node.gridVideoRenderer
      : null;
  if (renderer && typeof renderer.videoId === "string") {
    pushVideo(
      out,
      seen,
      renderer.videoId,
      textContent(renderer.title),
      textContent(renderer.descriptionSnippet),
      typeof renderer.publishedAt === "string" ? renderer.publishedAt : undefined,
    );
  }

  if (isRecord(node.lockupViewModel)) {
    const lockup = node.lockupViewModel;
    const contentId = lockup.contentId;
    if (
      lockup.contentType === "LOCKUP_CONTENT_TYPE_VIDEO" &&
      typeof contentId === "string"
    ) {
      const metadata = isRecord(lockup.metadata) ? lockup.metadata : null;
      const view = metadata && isRecord(metadata.lockupMetadataViewModel)
        ? metadata.lockupMetadataViewModel
        : null;
      pushVideo(out, seen, contentId, textContent(view?.title), "");
    }
  }

  for (const value of Object.values(node)) {
    if (value && typeof value === "object") collectVideos(value, out, seen);
  }
}

async function fetchVideosFromPage(url: string): Promise<CommunityVideo[]> {
  const res = await fetch(url, {
    next: { revalidate: REVALIDATE_SECONDS },
    headers: { ...FETCH_HEADERS, accept: "text/html" },
  });
  if (!res.ok) return [];
  const html = await res.text();
  const data = extractBalancedJson(html, "ytInitialData");
  if (!data) return [];
  const tab = videosTabContent(data);
  if (!tab) return [];
  const videos: CommunityVideo[] = [];
  collectVideos(tab, videos, new Set());
  return dedupe(videos);
}

/**
 * Server-side read of the channel `/videos` page. YouTube embeds the grid in
 * `ytInitialData` (legacy `videoRenderer` or current `lockupViewModel`).
 */
export async function fetchVideosFromChannelPage(): Promise<CommunityVideo[]> {
  try {
    const fromChannel = await fetchVideosFromPage(CHANNEL_VIDEOS_URL);
    if (fromChannel.length > 0) return fromChannel;
    return await fetchVideosFromPage(HANDLE_VIDEOS_URL);
  } catch {
    return [];
  }
}

/**
 * Live uploads, newest first.
 * 1. Data API v3 when `YOUTUBE_API_KEY` is set
 * 2. Channel RSS feed
 * 3. Channel `/videos` page (`ytInitialData`)
 * Returns [] when every source fails so the caller can use curated mocks.
 */
export async function fetchLiveChannelVideos(): Promise<CommunityVideo[]> {
  const fromApi = await fetchVideosFromDataApi();
  if (fromApi.length > 0) return fromApi;
  const fromRss = await fetchChannelVideos();
  if (fromRss.length > 0) return fromRss;
  return fetchVideosFromChannelPage();
}
