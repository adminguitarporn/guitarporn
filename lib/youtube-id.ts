/** YouTube watch ids are 11 characters from this alphabet. */
const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

/** True when `value` is a single YouTube video id, safe to embed. */
export function isYoutubeId(value: string): boolean {
  return YOUTUBE_ID_PATTERN.test(value);
}
