/**
 * Domain model for community guitar entries.
 * Mirrors the `guitars` table in Supabase (see `supabase/schema.sql`).
 * Brand names here and the `guitars_brand_check` constraint must stay identical.
 */

const MAJOR_BRANDS = [
  "BC Rich",
  "Charvel",
  "D'Angelico",
  "Danelectro",
  "Dean",
  "Duesenberg",
  "ESP",
  "EVH",
  "Epiphone",
  "Fender",
  "G&L",
  "Gibson",
  "Godin",
  "Gretsch",
  "Guild",
  "Harmony",
  "Höfner",
  "Ibanez",
  "Jackson",
  "Kramer",
  "Martin",
  "Music Man",
  "PRS",
  "Reverend",
  "Rickenbacker",
  "Schecter",
  "Squier",
  "Supro",
  "Takamine",
  "Taylor",
  "Yamaha",
] as const;

const BOUTIQUE_BRANDS = [
  "Collings",
  "Eastman",
  "Fano",
  "Heritage",
  "James Tyler",
  "Kiesel",
  "Knaggs",
  "Lowden",
  "Mayones",
  "Nik Huber",
  "Novo",
  "Patrick James Eggle",
  "Santa Cruz",
  "Strandberg",
  "Suhr",
  "Tom Anderson",
] as const;

const OTHER_BRANDS = ["Boutique", "Custom Made", "Miscellaneous"] as const;

export const GEAR_BRAND_GROUPS = [
  { label: "Major brands", brands: MAJOR_BRANDS },
  { label: "Iconic boutique", brands: BOUTIQUE_BRANDS },
  { label: "Other", brands: OTHER_BRANDS },
] as const;

export const GEAR_BRANDS = [
  ...MAJOR_BRANDS,
  ...BOUTIQUE_BRANDS,
  ...OTHER_BRANDS,
] as const;

export type GearBrand = (typeof GEAR_BRANDS)[number];

const BRAND_SET: ReadonlySet<string> = new Set(GEAR_BRANDS);

export function isGearBrand(value: string): value is GearBrand {
  return BRAND_SET.has(value);
}

export type Gear = {
  id: string;
  /** Stored brand. Submission UI only offers `GearBrand`. */
  brand: string;
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
