/**
 * Domain model for community guitar entries.
 * Mirrors the `guitars` table in Supabase (see `supabase/schema.sql`).
 */

export const GEAR_BRANDS = [
  "Gibson",
  "Fender",
  "PRS",
  "ESP",
  "Ibanez",
  "Miscellaneous",
  "Boutique",
  "Custom Made",
] as const;

export type GearBrand = (typeof GEAR_BRANDS)[number];

export type Gear = {
  id: string;
  brand: GearBrand;
  /** Required: e.g. "Les Paul Standard" */
  model: string;
  /** Required: e.g. "Cherry Sunburst" */
  color: string;
  /** Optional */
  year?: number | null;
  /** Single front-view photo per guitar. */
  imageUrl: string;
  ownerId?: string | null;
  /** Public display name of the member who added it. */
  ownerName?: string | null;
  createdAt?: string;
};
