import { cache } from "react";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Gear } from "@/types/gear";

type GuitarRow = {
  id: string;
  brand: string;
  model: string;
  color: string;
  year: number | null;
  image_url: string;
  owner_id: string | null;
  owner_name: string | null;
  created_at: string;
};

const GEAR_COLUMNS =
  "id, brand, model, color, year, image_url, owner_id, owner_name, created_at";

/** Supabase `guitars.id` values are UUIDs. Anything else is not a member guitar. */
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function mapRow(row: GuitarRow): Gear {
  return {
    id: row.id,
    brand: row.brand,
    model: row.model,
    color: row.color,
    year: row.year,
    imageUrl: row.image_url,
    ownerId: row.owner_id,
    ownerName: row.owner_name,
    createdAt: row.created_at,
  };
}

/**
 * Member guitars only. Sample rigs are not returned — an empty list means
 * nobody has submitted yet (or Supabase is not configured).
 */
export const getGearList = cache(async (): Promise<Gear[]> => {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("guitars")
      .select(GEAR_COLUMNS)
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return (data as GuitarRow[]).map(mapRow);
  } catch {
    return [];
  }
});

export const getGearById = cache(async (id: string): Promise<Gear | null> => {
  if (!UUID_RE.test(id)) return null;

  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("guitars")
      .select(GEAR_COLUMNS)
      .eq("id", id)
      .maybeSingle();

    if (error || !data) return null;
    return mapRow(data as GuitarRow);
  } catch {
    return null;
  }
});
