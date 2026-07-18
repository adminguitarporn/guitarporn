export type CommunityVideo = {
  id: string;
  title: string;
  /** YouTube watch URL id segment, e.g. `dQw4w9WgXcQ` */
  youtubeId: string;
  description: string;
  /** ISO date string from the channel feed. */
  publishedAt?: string;
  /** Thumbnail URL; defaults to the YouTube hqdefault for the id. */
  thumbnail?: string;
};
