import { createClient } from "@supabase/supabase-js";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from "@/lib/supabase/config";

/**
 * Server Supabase client for public reads (gear gallery).
 * Anonymous key + RLS keep this safe; no cookies needed for read-only use.
 */
export function getSupabaseServerClient() {
  if (!isSupabaseConfigured()) return null;
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
}
