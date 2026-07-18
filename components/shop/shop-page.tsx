"use client";

import { useState } from "react";
import { Container } from "@/components/layout/container";

type Category = "All" | "Men" | "Women" | "Accessories" | "Gear";

type Badge = "New" | "Limited" | "Exclusive" | "Coming Soon";

interface ShopItem {
  id: number;
  category: Exclude<Category, "All">;
  name: string;
  subtitle: string;
  price: string;
  badges: Badge[];
  icon: "shirt" | "cap" | "pick" | "strap" | "print" | "pedal";
}

/**
 * Placeholder catalog — replaced by live Shopify products once the store
 * is connected (same pattern as the homepage FeaturedShop block).
 */
const ITEMS: ShopItem[] = [
  { id: 1, category: "Men", name: "GP Club Tee", subtitle: "Heavyweight cotton, backstage black", price: "€35", badges: ["New"], icon: "shirt" },
  { id: 2, category: "Men", name: "Tone Chaser Longsleeve", subtitle: "For late-night rig sessions", price: "€45", badges: ["Limited"], icon: "shirt" },
  { id: 3, category: "Men", name: "GP Snapback", subtitle: "One size fits all heads", price: "€28", badges: [], icon: "cap" },
  { id: 4, category: "Women", name: "GP Club Tee", subtitle: "Fitted cut, backstage black", price: "€35", badges: ["New"], icon: "shirt" },
  { id: 5, category: "Women", name: "Sunburst Crop Tee", subtitle: "Cherry burst gradient print", price: "€38", badges: ["Limited", "Exclusive"], icon: "shirt" },
  { id: 6, category: "Accessories", name: "GP Pick Tin", subtitle: "12 celluloid picks, club logo", price: "€12", badges: ["New"], icon: "pick" },
  { id: 7, category: "Accessories", name: "Leather Strap", subtitle: "Full-grain, embossed logo", price: "€59", badges: ["Exclusive"], icon: "strap" },
  { id: 8, category: "Gear", name: "The Body — Print", subtitle: "A2 archival print, numbered", price: "€49", badges: ["Limited"], icon: "print" },
  { id: 9, category: "Gear", name: "GP Guitars", subtitle: "Yes. Real ones. Stay tuned.", price: "TBA", badges: ["Coming Soon"], icon: "pedal" },
];

const CATEGORIES: Category[] = ["All", "Men", "Women", "Accessories", "Gear"];

const BADGE_COLORS: Record<Badge, string> = {
  New: "text-emerald-400",
  Limited: "text-amber-400",
  Exclusive: "text-sky-400",
  "Coming Soon": "text-zinc-400",
};

function ItemIcon({ icon }: { icon: ShopItem["icon"] }) {
  const cls = "h-16 w-16 sm:h-20 sm:w-20";
  const common = {
    className: cls,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    viewBox: "0 0 48 48",
    "aria-hidden": true,
  };
  switch (icon) {
    case "shirt":
      return (
        <svg {...common}>
          <path d="M17 8 8 14l4 8 4-2v20h16V20l4 2 4-8-9-6a7 7 0 0 1-14 0Z" />
        </svg>
      );
    case "cap":
      return (
        <svg {...common}>
          <path d="M8 26a16 16 0 0 1 32 0v4H8v-4Z" />
          <path d="M40 30l4 6-14 2" />
          <path d="M24 10v-3" />
        </svg>
      );
    case "pick":
      return (
        <svg {...common}>
          <path d="M24 42C15 34 10 26 10 17a14 8 0 0 1 28 0c0 9-5 17-14 25Z" />
        </svg>
      );
    case "strap":
      return (
        <svg {...common}>
          <path d="M10 40 38 8M14 44 42 12" />
          <path d="M10 40c-2-2-2-5 0-7l3 3M42 12c2-2 2-5 0-7l-4 3" />
        </svg>
      );
    case "print":
      return (
        <svg {...common}>
          <rect x="10" y="8" width="28" height="32" rx="1.5" />
          <path d="m14 32 8-8 6 6 4-4 6 6" />
          <circle cx="19" cy="18" r="2.5" />
        </svg>
      );
    case "pedal":
      return (
        <svg {...common}>
          <path d="M29 5.5 33 9.5m-2-5.5 4 4M33 2.5l4 4M29 9.5 19.5 19" />
          <path d="M19.5 19c-2.5-1-5.5-.4-7.4 1.5-1.4 1.4-2 3.2-1.9 5-2.7.6-5 2-6.4 4.4-2.3 3.8-.9 8.9 3 11.3 3.9 2.4 9 1.4 11.4-2.3 1.5-2.3 1.6-5 .7-7.4 1.8-.1 3.5-.8 4.9-2.2 1.9-1.9 2.5-4.9 1.5-7.4L19.5 19Z" />
        </svg>
      );
  }
}

function ProductCard({ item }: { item: ShopItem }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-zinc-900/20 transition-all duration-[450ms] ease-[cubic-bezier(.22,.61,.36,1)] hover:-translate-y-1 hover:border-white/25 hover:bg-zinc-900/40 hover:shadow-[0_14px_36px_rgba(0,0,0,0.5),0_0_20px_rgba(147,197,253,0.05)] motion-reduce:transform-none">
      {/* Product image stage — swapped for real photos via Shopify */}
      <div className="relative flex aspect-square items-center justify-center bg-zinc-900/60">
        <div
          className="pointer-events-none absolute inset-0 opacity-50 transition-opacity duration-500 group-hover:opacity-80"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(ellipse 60% 55% at 50% 40%, rgba(255,255,255,0.07), transparent)",
          }}
        />
        <span className="text-zinc-600 transition duration-500 group-hover:scale-105 group-hover:text-zinc-300">
          <ItemIcon icon={item.icon} />
        </span>
      </div>

      {/* Caption — Gibson "Featured Products" style */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {item.badges.length > 0 && (
          <p className="mb-2 flex flex-wrap items-center gap-x-2 text-[11px] font-medium">
            {item.badges.map((b, i) => (
              <span key={b} className={BADGE_COLORS[b]}>
                {i > 0 && <span className="mr-2 text-zinc-700">|</span>}
                {b}
              </span>
            ))}
          </p>
        )}
        <h3 className="text-sm font-semibold leading-snug text-white sm:text-base">
          {item.name}
        </h3>
        <p className="mt-1 text-xs text-zinc-500 sm:text-sm">{item.subtitle}</p>
        <p className="mt-4 text-base font-semibold text-white">{item.price}</p>
      </div>
    </div>
  );
}

export function ShopPage({ shopUrl = "" }: { shopUrl?: string }) {
  const [active, setActive] = useState<Category>("All");

  const filtered =
    active === "All" ? ITEMS : ITEMS.filter((i) => i.category === active);

  return (
    <main>
      {/* Header */}
      <section className="border-b border-white/[0.08] pb-12 pt-16 sm:pt-20">
        <Container>
          <p className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">
            GuitarPorn Shop!
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-3xl font-semibold tracking-tight text-white sm:text-5xl sm:leading-[1.1]">
            Premium creamy quality. Follow for collections, limited editions
            and soon... guitars!
          </h1>

          {/* Official store link — activates when NEXT_PUBLIC_SHOPIFY_STORE_URL is set */}
          {shopUrl ? (
            <a
              href={shopUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 flex max-w-2xl items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/[0.06] px-6 py-5 transition hover:border-white/30 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
            >
              <div>
                <p className="text-sm font-bold text-white">
                  The official GuitarPorn store is open.
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  Merch, prints, and club exclusives.
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-white/20 px-4 py-2 text-xs font-medium text-white">
                Enter store →
              </span>
            </a>
          ) : null}
        </Container>
      </section>

      {/* Featured Products */}
      <section className="py-10 sm:py-14">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Featured Products
            </h2>
          </div>

          {/* Category pills */}
          <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`shrink-0 rounded-full px-5 py-2 text-sm font-medium transition ${
                  active === c
                    ? "bg-white text-zinc-950"
                    : "border border-white/10 text-zinc-400 hover:border-white/25 hover:text-white"
                }`}
              >
                {c}
              </button>
            ))}
            <span className="ml-auto hidden shrink-0 text-xs text-zinc-600 sm:block">
              {filtered.length} products
            </span>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {filtered.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>

          <p className="mt-12 text-center text-xs text-zinc-700">
            Product photos and checkout go live with the Shopify store —
            these are previews of the first collection.
          </p>
        </Container>
      </section>
    </main>
  );
}
