import Link from "next/link";

/**
 * Gibson-style category tiles for the three content sections,
 * each with a minimalist line icon.
 */

function IconPlay({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="24" cy="24" r="19" />
      <path d="M20 17.5v13l11-6.5-11-6.5Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconGuitar({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {/* headstock + neck */}
      <path d="M29 5.5 33 9.5" />
      <path d="m31 4 4 4M33 2.5l4 4" />
      <path d="M29 9.5 19.5 19" />
      {/* body */}
      <path d="M19.5 19c-2.5-1-5.5-.4-7.4 1.5-1.4 1.4-2 3.2-1.9 5-2.7.6-5 2-6.4 4.4-2.3 3.8-.9 8.9 3 11.3 3.9 2.4 9 1.4 11.4-2.3 1.5-2.3 1.6-5 .7-7.4 1.8-.1 3.5-.8 4.9-2.2 1.9-1.9 2.5-4.9 1.5-7.4L19.5 19Z" />
      <circle cx="13" cy="33" r="3.5" />
    </svg>
  );
}

function IconBag({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M10 15h28l-2.5 26h-23L10 15Z" />
      <path d="M17 20v-6a7 7 0 0 1 14 0v6" />
    </svg>
  );
}

const CATEGORIES = [
  {
    href: "/videos",
    label: "Videos",
    cta: "Watch now",
    Icon: IconPlay,
  },
  {
    href: "/gear",
    label: "Gear Database",
    cta: "Explore the DB",
    Icon: IconGuitar,
  },
  {
    href: "/shop",
    label: "Shop",
    cta: "Shop now",
    Icon: IconBag,
  },
] as const;

export function CategoryCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {CATEGORIES.map(({ href, label, cta, Icon }) => (
        <Link
          key={href}
          href={href}
          className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-zinc-900/20 transition-all duration-[450ms] ease-[cubic-bezier(.22,.61,.36,1)] hover:-translate-y-1 hover:border-white/25 hover:bg-zinc-900/40 hover:shadow-[0_16px_44px_rgba(0,0,0,0.5),0_0_24px_rgba(147,197,253,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 motion-reduce:transform-none"
        >
          {/* Icon stage */}
          <div className="relative flex aspect-[4/3] items-center justify-center sm:aspect-square">
            <div
              className="pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-500 group-hover:opacity-70"
              aria-hidden
              style={{
                backgroundImage:
                  "radial-gradient(ellipse 60% 50% at 50% 45%, rgba(255,255,255,0.09), transparent)",
              }}
            />
            <Icon className="h-20 w-20 text-zinc-500 transition duration-500 group-hover:scale-105 group-hover:text-white sm:h-24 sm:w-24" />
          </div>

          {/* Caption */}
          <div className="flex items-center justify-between gap-4 border-t border-white/[0.06] p-6">
            <p className="text-base font-semibold tracking-tight text-white">
              {label}
            </p>
            <span className="inline-flex w-fit shrink-0 items-center rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-xs font-medium text-zinc-200 transition group-hover:border-white/30 group-hover:bg-white/10 group-hover:text-white">
              {cta} →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
