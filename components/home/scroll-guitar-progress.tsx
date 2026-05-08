"use client";

import { useEffect, useMemo, useState } from "react";

function clamp01(v: number) {
  if (v < 0) return 0;
  if (v > 1) return 1;
  return v;
}

function GuitarIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M14.5 5.2l3.2-3.2" />
      <path d="M17.7 3.9l2.4 2.4" />
      <path d="M13.9 5.8l4.3 4.3" />
      <path d="M10.4 9.3c-1.1-1.1-3.1-1.1-4.3.1-1.2 1.2-1.2 3.2-.1 4.3 1.1 1.1 3 1.1 4.3-.1l.7-.7 1.8 1.8c1.1 1.1 2.9 1.1 4 0 1.1-1.1 1.1-2.9 0-4l-1.8-1.8.7-.7c1.2-1.2 1.2-3.2.1-4.3-1.2-1.2-3.2-1.2-4.3-.1l-.8.8-1.3 1.3" />
    </svg>
  );
}

export function ScrollGuitarProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      setProgress(clamp01(window.scrollY / max));
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const topPct = useMemo(() => `${progress * 100}%`, [progress]);

  return (
    <div
      className="pointer-events-none fixed left-4 top-24 z-40 hidden h-[70vh] w-10 sm:block"
      aria-hidden
    >
      <div className="relative mx-auto h-full w-[2px] overflow-hidden rounded-full bg-white/10">
        <div
          className="absolute left-0 top-0 w-full bg-white/35"
          style={{ height: topPct }}
        />

        <div
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/80"
          style={{ top: topPct }}
        >
          <div className="rounded-full border border-white/15 bg-zinc-950/80 p-1.5 backdrop-blur">
            <GuitarIcon />
          </div>
        </div>
      </div>
    </div>
  );
}

