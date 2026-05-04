/**
 * Domain model for community gear posts.
 * Aligns with a future `gear` table in Supabase (see `lib/repositories/gear.ts`).
 */
export type GearImage = {
  url: string;
  alt: string;
};

export type Gear = {
  id: string;
  brand: string;
  model: string;
  description: string;
  /** Up to two images per guitar (enforced in UI + at insert time later). */
  images: readonly [GearImage] | readonly [GearImage, GearImage];
  // Supabase-ready fields (optional until wired):
  // owner_id?: string | null;
  // created_at?: string;
  // updated_at?: string;
};
