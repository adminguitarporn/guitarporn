"use client";

import Image from "next/image";
import { useState } from "react";
import { Container } from "@/components/layout/container";
import { WaitlistForm } from "@/components/shop/waitlist-form";
import type { ShopCatalog, ShopProduct } from "@/lib/shopify";

type Category = "All" | "Men" | "Women" | "Accessories" | "Gear";

type Badge = "Coming Soon";

interface ShopItem {
  id: number;
  category: Exclude<Category, "All">;
  name: string;
  subtitle: string;
  badges: Badge[];
  icon: "shirt" | "cap" | "pick" | "strap" | "print" | "pedal";
}

/**
 * Upcoming-drop lookbook. Shown only until the Shopify Storefront API
 * answers with real products. No prices and no scarcity badges.
 */
const ITEMS: ShopItem[] = [
  { id: 1, category: "Men", name: "GP Club Tee", subtitle: "Heavyweight cotton, backstage black", badges: [], icon: "shirt" },
  { id: 2, category: "Men", name: "Tone Chaser Longsleeve", subtitle: "For late-night rig sessions", badges: [], icon: "shirt" },
  { id: 3, category: "Men", name: "GP Snapback", subtitle: "One size fits all heads", badges: [], icon: "cap" },
  { id: 4, category: "Women", name: "GP Club Tee", subtitle: "Fitted cut, backstage black", badges: [], icon: "shirt" },
  { id: 5, category: "Women", name: "Sunburst Crop Tee", subtitle: "Cherry burst gradient print", badges: [], icon: "shirt" },
  { id: 6, category: "Accessories", name: "GP Pick Tin", subtitle: "12 celluloid picks, club logo", badges: [], icon: "pick" },
  { id: 7, category: "Accessories", name: "Leather Strap", subtitle: "Full-grain, embossed logo", badges: [], icon: "strap" },
  { id: 8, category: "Gear", name: "The Body — Print", subtitle: "A2 archival print", badges: [], icon: "print" },
  { id: 9, category: "Gear", name: "GP Guitars", subtitle: "Yes. Real ones. Stay tuned.", badges: ["Coming Soon"], icon: "pedal" },
];

const CATEGORIES: Category[] = ["All", "Men", "Women", "Accessories", "Gear"];

const BADGE_COLORS: Record<Badge, string> = {
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
        <p className="mt-4 text-xs tracking-wide text-zinc-600 uppercase">
          Preview
        </p>
      </div>
    </div>
  );
}

function LiveCard({ product }: { product: ShopProduct }) {
  return (
    <a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-zinc-900/20 transition-all duration-[450ms] ease-[cubic-bezier(.22,.61,.36,1)] hover:-translate-y-1 hover:border-white/25 hover:bg-zinc-900/40 hover:shadow-[0_14px_36px_rgba(0,0,0,0.5),0_0_20px_rgba(147,197,253,0.05)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 motion-reduce:transform-none"
    >
      <div className="relative aspect-square overflow-hidden bg-zinc-900/60">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-600">
            <svg
              viewBox="0 0 48 48"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-16 w-16"
              aria-hidden
            >
              <path d="M10 15h28l-2.5 26h-23L10 15Z" />
              <path d="M17 20v-6a7 7 0 0 1 14 0v6" />
            </svg>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="text-sm font-semibold leading-snug text-white sm:text-base">
          {product.title}
        </h3>
        <p className="mt-4 text-base font-semibold text-white">{product.price}</p>
      </div>
    </a>
  );
}

export function ShopPage({
  shopUrl = "",
  catalog,
}: {
  shopUrl?: string;
  catalog: ShopCatalog;
}) {
  const [active, setActive] = useState<Category>("All");
  const live = catalog.status === "ready" && catalog.products.length > 0;
  const liveProducts = catalog.status === "ready" ? catalog.products : [];
  const liveCategories = CATEGORIES.filter(
    (category) =>
      category === "All" ||
      liveProducts.some((product) => product.category === category),
  );
  const showLiveCategories = liveCategories.length > 2;

  const filtered =
    active === "All" ? ITEMS : ITEMS.filter((item) => item.category === active);
  const filteredLive =
    !showLiveCategories || active === "All"
      ? liveProducts
      : liveProducts.filter((product) => product.category === active);

  const previewNote =
    catalog.status === "unavailable"
      ? "The store feed didn't load. These cards are still the upcoming drop — not live stock, and not priced."
      : catalog.status === "ready"
        ? "The store is connected and there is nothing on the shelf yet."
        : "Upcoming drop. These pieces are previews — not for sale, and not priced — until the Shopify store is connected.";

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

          <p className="mt-4 max-w-2xl text-base text-zinc-400">
            {live
              ? "Live from the GuitarPorn store."
              : previewNote}
          </p>

          {!live && <WaitlistForm />}

          {shopUrl ? (
            <a
              href={shopUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 flex max-w-2xl items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/[0.06] px-6 py-5 transition hover:border-white/30 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
            >
              <div>
                <p className="text-sm font-bold text-white">
                  {live || catalog.status === "ready"
                    ? "The official GuitarPorn store is open."
                    : "Storefront link"}
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  {live || catalog.status === "ready"
                    ? "Merch, prints, and club pieces from the connected store."
                    : "The public store link is set. This page stays a preview until the Storefront API answers."}
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-white/20 px-4 py-2 text-xs font-medium text-white">
                Enter store →
              </span>
            </a>
          ) : null}
        </Container>
      </section>

      {catalog.status === "ready" && !live ? null : (
      <section className="py-10 sm:py-14">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {live ? "Featured Products" : "Upcoming drop"}
            </h2>
          </div>

          {live ? (
            <>
              {showLiveCategories && (
                <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {liveCategories.map((c) => (
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
                    {filteredLive.length} products
                  </span>
                </div>
              )}

              <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {filteredLive.map((product) => (
                  <LiveCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : catalog.status === "ready" ? null : (
            <>
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
                  {filtered.length} previews
                </span>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {filtered.map((item) => (
                  <ProductCard key={item.id} item={item} />
                ))}
              </div>

              <p className="mt-12 text-center text-xs text-zinc-700">
                Photos and checkout arrive with the Shopify store. Nothing
                above has a price, a stock count, or a limited-edition badge.
              </p>
            </>
          )}
        </Container>
      </section>
      )}
    </main>
  );
}
