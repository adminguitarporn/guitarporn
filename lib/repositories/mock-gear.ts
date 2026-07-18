import type { Gear } from "@/types/gear";

/**
 * Sample gallery shown until Supabase is configured and members start
 * uploading. Images are local placeholders in `public/gear-samples/`.
 * Safe to delete once the real database has entries.
 */
export const mockGear: Gear[] = [
  {
    id: "g-001",
    brand: "Gibson",
    model: "Les Paul Standard",
    color: "Cherry Sunburst",
    year: 1959,
    imageUrl: "/gear-samples/lespaul.jpg",
  },
  {
    id: "g-002",
    brand: "Fender",
    model: "Stratocaster HSS",
    color: "Olympic White",
    year: 2021,
    imageUrl: "/gear-samples/strat.jpg",
  },
  {
    id: "g-003",
    brand: "PRS",
    model: "Custom 24",
    color: "Trampas Green",
    year: 2023,
    imageUrl: "/gear-samples/prs.jpg",
  },
  {
    id: "g-004",
    brand: "ESP",
    model: "Eclipse II",
    color: "Black Satin",
    year: 2019,
    imageUrl: "/gear-samples/esp.jpg",
  },
  {
    id: "g-005",
    brand: "Ibanez",
    model: "RG550",
    color: "Desert Sun Yellow",
    year: 1989,
    imageUrl: "/gear-samples/ibanez.jpg",
  },
  {
    id: "g-006",
    brand: "Boutique",
    model: "Novo Serus J",
    color: "Bull Black",
    imageUrl: "/gear-samples/boutique.jpg",
  },
];
