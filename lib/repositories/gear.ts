import { mockGear } from "@/lib/repositories/mock-gear";
import type { Gear } from "@/types/gear";

/**
 * Gear listing — today backed by static mocks.
 *
 * Supabase migration path:
 * 1. Add `gear` table (id uuid, owner_id uuid references auth.users, brand text, model text,
 *    description text, image_urls text[] check array_length <= 2, created_at timestamptz).
 * 2. Create `lib/supabase/server.ts` using `@supabase/ssr` and service role / anon as needed.
 * 3. Replace the body below with `const supabase = await createServerClient()` then
 *    `supabase.from('gear').select('*').order('created_at', { ascending: false })`.
 * 4. Map rows → `Gear` (validate max two images in a small mapper).
 */
export async function getGearList(): Promise<Gear[]> {
  return mockGear;
}

export async function getGearById(id: string): Promise<Gear | undefined> {
  const list = await getGearList();
  return list.find((g) => g.id === id);
}
