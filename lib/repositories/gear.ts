import { mockGear } from "@/lib/repositories/mock-gear";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Gear, GearBrand } from "@/types/gear";

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

function mapRow(row: GuitarRow): Gear {
  return {
    id: row.id,
    brand: row.brand as GearBrand,
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
 * Community guitar list — Supabase-backed once env vars are set;
 * sample data until then so the page never looks empty.
 */
export async function getGearList(): Promise<Gear[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return mockGear;

  const { data, error } = await supabase
    .from("guitars")
    .select(
      "id, brand, model, color, year, image_url, owner_id, owner_name, created_at",
    )
    .order("created_at", { ascending: false });

  if (error || !data) return mockGear;
  return data.length > 0 ? (data as GuitarRow[]).map(mapRow) : mockGear;
}
