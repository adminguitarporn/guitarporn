import type { Gear } from "@/types/gear";

function unsplash(id: string) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;
}

/**
 * Static mock gallery. Replace with Supabase queries in `getGearList`.
 */
export const mockGear: Gear[] = [
  {
    id: "g-001",
    brand: "Gibson",
    model: "Les Paul Standard '59",
    description:
      "Burst finish, lightweight mahogany body, custom-wound humbuckers. Daily driver for studio sessions.",
    images: [
      {
        url: unsplash("photo-1550985543-b8ae5369d28b"),
        alt: "Electric guitar on amplifier",
      },
      {
        url: unsplash("photo-1516922611327-aa84353a7738"),
        alt: "Les Paul style guitar on stand",
      },
    ],
  },
  {
    id: "g-002",
    brand: "Fender",
    model: "Stratocaster HSS",
    description:
      "Noiseless pickups, roasted maple neck, satin nitro. Built for edge-of-breakup cleans.",
    images: [
      {
        url: unsplash("photo-1511379938547-c1a694022164"),
        alt: "Stratocaster style guitar",
      },
    ],
  },
  {
    id: "g-003",
    brand: "PRS",
    model: "Custom 24",
    description:
      "Pattern Thin neck, 85/15 pickups, hybrid trem. Covers modern rock and fusion lines.",
    images: [
      {
        url: unsplash("photo-1525201548942-d873fcd661f0"),
        alt: "Acoustic guitar in hands",
      },
      {
        url: unsplash("photo-1493225457124-a1f403e15476"),
        alt: "Studio headphones and guitar",
      },
    ],
  },
  {
    id: "g-004",
    brand: "Martin",
    model: "D-28",
    description:
      "Sitka spruce, East Indian rosewood. Room-filling low end for fingerstyle and vocal accompaniment.",
    images: [
      {
        url: unsplash("photo-1456926631375-92c8ce872def"),
        alt: "Acoustic guitar leaning",
      },
    ],
  },
  {
    id: "g-005",
    brand: "Ibanez",
    model: "RG550",
    description:
      "Floyd Rose, maple wizard neck, neon finish throwback. Shred machine with tight low strings.",
    images: [
      {
        url: unsplash("photo-1556449899-260c6e8fdb6e"),
        alt: "Electric guitar performance",
      },
      {
        url: unsplash("photo-1460036522529-4aaf10bf89d2"),
        alt: "Guitar neck close-up",
      },
    ],
  },
  {
    id: "g-006",
    brand: "Gretsch",
    model: "White Falcon",
    description:
      "Bigsby shimmer, Filter'Tron snap, gold hardware. Stage presence without touching a pedal.",
    images: [
      {
        url: unsplash("photo-1571330735063-f22a047f9399"),
        alt: "Hollow body guitar",
      },
    ],
  },
];
