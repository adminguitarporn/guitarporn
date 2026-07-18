"use client";

import Image from "next/image";
import { useState } from "react";
import { YoutubeEmbed } from "@/components/videos/youtube-embed";
import type { CommunityVideo } from "@/types/video";

function formatDate(iso?: string) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return null;
  }
}

export function VideoRow({ video }: { video: CommunityVideo }) {
  const [playing, setPlaying] = useState(false);
  const date = formatDate(video.publishedAt);
  const thumb =
    video.thumbnail ?? `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`;

  if (playing) {
    return (
      <article className="rounded-2xl border border-white/10 bg-zinc-900/40 p-4 sm:p-5">
        <YoutubeEmbed youtubeId={video.youtubeId} title={video.title} />
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-white sm:text-lg">
              {video.title}
            </h2>
            {video.description && (
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {video.description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setPlaying(false)}
            className="shrink-0 rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-400 transition hover:border-white/20 hover:text-white"
          >
            Close
          </button>
        </div>
      </article>
    );
  }

  return (
    <article>
      <button
        type="button"
        onClick={() => setPlaying(true)}
        className="group flex w-full items-stretch gap-4 rounded-2xl border border-white/[0.07] bg-zinc-900/20 p-3 text-left transition-all duration-[450ms] ease-[cubic-bezier(.22,.61,.36,1)] hover:-translate-y-0.5 hover:border-white/25 hover:bg-zinc-900/40 hover:shadow-[0_12px_32px_rgba(0,0,0,0.5),0_0_18px_rgba(147,197,253,0.05)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 sm:gap-6 sm:p-4 motion-reduce:transform-none"
      >
        {/* Thumbnail — left */}
        <div className="relative aspect-video w-36 shrink-0 overflow-hidden rounded-xl bg-zinc-900 sm:w-64">
          <Image
            src={thumb}
            alt={video.title}
            fill
            sizes="(min-width: 640px) 16rem, 9rem"
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-950/70 text-white backdrop-blur-sm transition group-hover:bg-zinc-950/90 sm:h-12 sm:w-12">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="ml-0.5 h-4 w-4 sm:h-5 sm:w-5"
                aria-hidden
              >
                <path d="M8 5.14v13.72L19 12 8 5.14Z" />
              </svg>
            </span>
          </span>
        </div>

        {/* Title + description — right */}
        <div className="flex min-w-0 flex-1 flex-col justify-center py-1">
          <h2 className="text-sm font-semibold leading-snug text-white sm:text-lg">
            {video.title}
          </h2>
          {video.description && (
            <p className="mt-2 hidden text-sm leading-relaxed text-zinc-400 sm:line-clamp-2 sm:block">
              {video.description}
            </p>
          )}
          {date && (
            <p className="mt-2 text-[11px] font-medium tracking-[0.18em] text-zinc-600 uppercase sm:mt-3">
              {date}
            </p>
          )}
        </div>
      </button>
    </article>
  );
}
