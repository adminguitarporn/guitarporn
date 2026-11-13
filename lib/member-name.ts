import type { User } from "@supabase/supabase-js";

/**
 * Public name shown in the navbar and next to a member's guitars.
 * Prefers the `display_name` saved on the Supabase Auth user, then the
 * email local-part, then a generic fallback.
 */
export function memberDisplayName(user: User): string {
  const meta = user.user_metadata as { display_name?: unknown } | null;
  const raw = meta?.display_name;
  const fromMeta = typeof raw === "string" ? raw.trim() : "";
  if (fromMeta) return fromMeta;
  const local = user.email?.split("@")[0]?.trim();
  return local || "member";
}
