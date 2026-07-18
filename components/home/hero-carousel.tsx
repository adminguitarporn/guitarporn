"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { HeroImage } from "@/lib/hero-images";

const INTERVAL_MS = 6000;

type Props = {
  images: HeroImage[];
  children?: React.ReactNode;
};

/**
 * Gibson-style full-bleed hero: photos crossfade with a slow Ken Burns zoom,
 * content overlays on top. Images come from `public/hero/` via getHeroImages().
 */
export function HeroCarousel({ images, children }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(
    () => setIndex((i) => (i + 1) % Math.max(images.length, 1)),
    [images.length],
  );

  useEffect(() => {
    if (images.length < 2 || paused) return;
    timer.current = setInterval(next, INTERVAL_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [images.length, paused, next]);

  return (
    <section
      className="relative flex min-h-[82svh] items-end overflow-hidden border-b border-white/[0.08] bg-zinc-950"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      {images.map((img, i) => (
        <div
          key={img.src}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className={`object-cover ${
              i === index ? "animate-hero-zoom" : ""
            }`}
          />
        </div>
      ))}

      {/* Legibility gradients */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-zinc-950/10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-zinc-950/70 via-transparent to-transparent"
        aria-hidden
      />

      {/* Overlaid content */}
      <div className="relative z-10 w-full">{children}</div>

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-6 right-6 z-20 flex gap-2 sm:right-10">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index
                  ? "w-8 bg-white"
                  : "w-3 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
