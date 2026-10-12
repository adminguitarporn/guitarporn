import type { CommunityVideo } from "@/types/video";

/**
 * Curated GuitarPorn episodes, newest first.
 * To add an episode: copy an entry, paste the YouTube id (the part after `v=`).
 */
export const mockVideos: CommunityVideo[] = [
  {
    id: "gp-s01e01",
    title:
      "GP S01E01 : Gibson ES-333 TD - Don’t Look Back in Anger (Live in Paris) by Noel Gallagher",
    youtubeId: "akem_tONmGg",
    description: "Season 1, Episode 1 — the Gibson ES-333 TD up close.",
    thumbnail: "https://i.ytimg.com/vi/akem_tONmGg/hqdefault.jpg",
  },
];
