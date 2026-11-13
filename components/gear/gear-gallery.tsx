"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Container } from "@/components/layout/container";
import { GEAR_BRAND_GROUPS, GEAR_BRANDS, type Gear } from "@/types/gear";

function GuitarCard({ gear }: { gear: Gear }) {
  return (
    <Link
      href={`/gear/${gear.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-zinc-900/20 transition-all duration-[450ms] ease-[cubic-bezier(.22,.61,.36,1)] hover:-translate-y-1 hover:border-white/25 hover:bg-zinc-900/30 hover:shadow-[0_14px_36px_rgba(0,0,0,0.5),0_0_20px_rgba(147,197,253,0.05)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 motion-reduce:transform-none"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900">
        <Image
          src={gear.imageUrl}
          alt={`${gear.brand} ${gear.model} in ${gear.color}`}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="p-4">
        <p className="text-[10px] font-medium tracking-[0.22em] text-zinc-600 uppercase">
          {gear.brand}
        </p>
        <h3 className="mt-1 text-sm font-semibold text-white">{gear.model}</h3>
        <p className="mt-0.5 text-xs text-zinc-500">
          {gear.color}
          {gear.year ? ` · ${gear.year}` : ""}
        </p>
        {gear.ownerName && (
          <p className="mt-2 text-[11px] text-zinc-600">
            Added by <span className="text-zinc-500">{gear.ownerName}</span>
          </p>
        )}
      </div>
    </Link>
  );
}

const CONTACT_EMAIL = "contact@guitarporn.club";

/** Dropdown next to "+ Add your guitar" — community ownership + removal terms. */
function CommunityDisclaimer() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="community-disclaimer"
        className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm font-medium tracking-wide text-zinc-300 transition hover:border-white/25 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
      >
        Community terms
        <svg
          className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden
        >
          <path d="M2 4.5l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          id="community-disclaimer"
          className="absolute right-0 top-full z-40 mt-3 w-[min(22rem,calc(100vw-3rem))] rounded-2xl border border-white/10 bg-zinc-950/95 p-5 text-left shadow-[0_14px_36px_rgba(0,0,0,0.6)] backdrop-blur-md"
        >
          <p className="text-xs font-medium tracking-[0.22em] text-zinc-500 uppercase">
            Community terms
          </p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            You keep ownership of the photos you upload. Adding a guitar grants
            GuitarPorn Club a license to display it in the Gear DB. You confirm
            the photo is yours to share.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            Want it taken down? Delete it from your account, or email{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Gear%20DB%20removal%20request`}
              className="text-zinc-200 underline underline-offset-4 hover:text-white"
            >
              {CONTACT_EMAIL}
            </a>
            . We process removal requests within 30 days.
          </p>
        </div>
      )}
    </div>
  );
}

/** Layer 1 — brand grid, grouped so the longer list still scans. */
function BrandIndex({
  counts,
  onSelect,
}: {
  counts: Record<string, number>;
  onSelect: (brand: string) => void;
}) {
  const known = new Set<string>(GEAR_BRANDS);
  const extras = Object.keys(counts)
    .filter((brand) => !known.has(brand) && (counts[brand] ?? 0) > 0)
    .sort((a, b) => a.localeCompare(b));

  const groups = [
    ...GEAR_BRAND_GROUPS.map((group) => ({
      label: group.label,
      brands: [...group.brands],
    })),
    ...(extras.length > 0
      ? [{ label: "From the database", brands: extras }]
      : []),
  ];

  return (
    <div className="flex flex-col gap-10">
      {groups.map((group) => (
        <div key={group.label}>
          <h2 className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">
            {group.label}
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {group.brands.map((brand) => {
              const count = counts[brand] ?? 0;
              return (
                <button
                  key={brand}
                  type="button"
                  onClick={() => onSelect(brand)}
                  className="group flex min-h-24 flex-col items-start justify-between rounded-2xl border border-white/[0.08] bg-zinc-900/20 px-4 py-4 text-left transition-all duration-[450ms] ease-[cubic-bezier(.22,.61,.36,1)] hover:-translate-y-1 hover:border-white/25 hover:bg-zinc-900/40 hover:shadow-[0_14px_36px_rgba(0,0,0,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 motion-reduce:transform-none"
                >
                  <span className="text-base font-semibold tracking-tight text-zinc-200 transition group-hover:text-white sm:text-lg">
                    {brand}
                  </span>
                  <span className="text-xs text-zinc-600 transition group-hover:text-zinc-400">
                    {count} {count === 1 ? "guitar" : "guitars"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export function GearGallery({ gear }: { gear: Gear[] }) {
  const [activeBrand, setActiveBrand] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const empty = gear.length === 0;

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const b of GEAR_BRANDS) c[b] = 0;
    for (const g of gear) c[g.brand] = (c[g.brand] ?? 0) + 1;
    return c;
  }, [gear]);

  const filtered = useMemo(() => {
    if (!activeBrand) return [];
    const q = search.trim().toLowerCase();
    return gear.filter((g) => {
      if (g.brand !== activeBrand) return false;
      return (
        q === "" ||
        g.model.toLowerCase().includes(q) ||
        g.color.toLowerCase().includes(q) ||
        String(g.year ?? "").includes(q)
      );
    });
  }, [gear, activeBrand, search]);

  return (
    <main>
      {/* Header */}
      <section className="border-b border-white/[0.08] pb-10 pt-16 sm:pt-20">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">
                The community collection
              </p>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                The Gear DB
              </h1>
              <p className="mt-4 max-w-xl text-base text-zinc-400">
                {empty
                  ? "Nothing in here yet is a stand-in. The first guitars will be real member rigs — pick a brand, or submit yours."
                  : "Every guitar in here belongs to a member of the club. Pick a brand to browse — or add yours to the collection."}
              </p>
            </div>
            <div className="relative flex shrink-0 flex-wrap items-center gap-3">
              <Link
                href="/gear/submit"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-6 py-2.5 text-sm font-bold tracking-wide text-white transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
              >
                + Add your guitar
              </Link>
              <CommunityDisclaimer />
            </div>
          </div>
        </Container>
      </section>

      {empty && activeBrand === null && (
        <section className="border-b border-white/[0.08] py-10 sm:py-14">
          <Container>
            <div className="rounded-3xl border border-white/[0.08] bg-zinc-900/20 px-6 py-12 text-center sm:px-12">
              <p className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">
                Empty club floor
              </p>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                No member rigs yet.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-zinc-400">
                The Gear DB only lists guitars members actually upload. Submit
                the first rig and it will live here, under its brand, with your
                name on it.
              </p>
              <Link
                href="/gear/submit"
                className="mt-8 inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-6 py-2.5 text-sm font-bold tracking-wide text-white transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
              >
                Submit the first rig
              </Link>
            </div>
          </Container>
        </section>
      )}

      {activeBrand === null ? (
        /* ---------- Layer 1: brand index ---------- */
        <section className="py-10 sm:py-14">
          <Container>
            <BrandIndex counts={counts} onSelect={setActiveBrand} />
          </Container>
        </section>
      ) : (
        /* ---------- Layer 2: brand collection ---------- */
        <>
          <div className="sticky top-16 z-30 border-b border-white/[0.06] bg-zinc-950/90 backdrop-blur-md">
            <Container>
              <div className="flex flex-wrap items-center gap-4 py-4">
                <button
                  type="button"
                  onClick={() => {
                    setActiveBrand(null);
                    setSearch("");
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-white/25 hover:text-white"
                >
                  ← All brands
                </button>
                <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
                  {activeBrand}
                </h2>

                <div className="ml-auto flex items-center gap-4">
                  <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-zinc-900/40 px-4 py-2 focus-within:border-white/20">
                    <svg
                      className="h-4 w-4 text-zinc-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 3 10.5a7.5 7.5 0 0 0 13.15 6.15Z"
                      />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search model, color, year..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-40 bg-transparent text-sm text-white placeholder:text-zinc-600 focus:outline-none sm:w-56"
                    />
                  </div>
                  <span className="hidden shrink-0 text-xs text-zinc-600 sm:block">
                    {filtered.length}{" "}
                    {filtered.length === 1 ? "guitar" : "guitars"}
                  </span>
                </div>
              </div>
            </Container>
          </div>

          <section className="py-10">
            <Container>
              {filtered.length === 0 ? (
                <div className="py-24 text-center">
                  <p className="text-zinc-500">
                    No guitars in{" "}
                    <span className="text-zinc-300">{activeBrand}</span>{" "}
                    {search ? "matching that search" : "yet"}.
                  </p>
                  <Link
                    href="/gear/submit"
                    className="mt-4 inline-block text-sm text-zinc-400 underline underline-offset-4 hover:text-white"
                  >
                    Be the first to add one →
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {filtered.map((g) => (
                    <GuitarCard key={g.id} gear={g} />
                  ))}
                </div>
              )}
            </Container>
          </section>
        </>
      )}
    </main>
  );
}
