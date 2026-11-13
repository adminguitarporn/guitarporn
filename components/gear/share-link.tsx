"use client";

import { useState } from "react";

type Props = {
  title: string;
};

/** Copies the current gear URL, and uses the device share sheet when it exists. */
export function ShareGearLink({ title }: Props) {
  const [notice, setNotice] = useState<string | null>(null);
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);

  async function copy() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setFallbackUrl(null);
      setNotice("Link copied");
    } catch {
      setFallbackUrl(url);
      setNotice("Copy this link");
    }
  }

  async function share() {
    const url = window.location.href;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
        setNotice(null);
        setFallbackUrl(null);
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    }
    await copy();
  }

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            void copy();
          }}
          className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-bold tracking-wide text-white transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
        >
          Copy link
        </button>
        <button
          type="button"
          onClick={() => {
            void share();
          }}
          className="inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-white/25 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
        >
          Share
        </button>
        {notice && <p className="text-sm text-zinc-400">{notice}</p>}
      </div>
      {fallbackUrl && (
        <input
          readOnly
          value={fallbackUrl}
          onFocus={(event) => event.currentTarget.select()}
          aria-label="Gear page link"
          className="mt-4 w-full rounded-xl border border-white/10 bg-zinc-900/40 px-4 py-2.5 text-sm text-zinc-300 focus:border-white/25 focus:outline-none"
        />
      )}
    </div>
  );
}
