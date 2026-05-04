import type { CommunityVideo } from "@/types/video";

/**
 * Curated embeds — IDs verified via YouTube oEmbed. Replace with your channel playlist.
 * Order is newest-first: the home “Featured this week” strip uses the first three entries.
 */
export const mockVideos: CommunityVideo[] = [
  {
    id: "v-001",
    title: "Come As You Are — pocket & clean grit",
    youtubeId: "vabnZ9-ex7o",
    description:
      "Study the right-hand patterning and how the chorus widens before you add more drive.",
  },
  {
    id: "v-002",
    title: "Sweet Child O' Mine — definition vs sustain",
    youtubeId: "1w7OgIMMRc4",
    description:
      "That opening hook: note separation on a bright bridge pickup with tasteful delay throws.",
  },
  {
    id: "v-003",
    title: "Get Lucky — disco pick and mute discipline",
    youtubeId: "5NV6Rdv1a3I",
    description:
      "Sixteenth-note pocket on loop — tighten the picking hand before you stack verbs.",
  },
  {
    id: "v-004",
    title: "See You Again — melodic bends at tempo",
    youtubeId: "RgKAFK5djSk",
    description:
      "Long bends in a pop frame: control release so intonation stays believable at full stage volume.",
  },
  {
    id: "v-005",
    title: "Bohemian Rhapsody — dynamics and doubles",
    youtubeId: "fJ9rUzIMcZQ",
    description:
      "Stacked guitars through the operatic arc — panning, EQ, and when to pull back the gain.",
  },
  {
    id: "v-006",
    title: "All Star — radio-ready rhythm hooks",
    youtubeId: "L_jWHffIx5E",
    description:
      "Chorus voicings and call-response fills worth stealing for your next writing session.",
  },
];
