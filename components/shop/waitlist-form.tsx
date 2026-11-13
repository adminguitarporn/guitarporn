"use client";

import { useState, type FormEvent } from "react";

const CONTACT = "contact@guitarporn.club";

type Status = "idle" | "sending" | "joined" | "mailto" | "error";

/**
 * Shop waitlist. Posts to /api/shop/waitlist, which emails the club when
 * RESEND_API_KEY is set and otherwise returns a mailto link. Never throws
 * the page if those env vars are missing.
 */
export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [mailto, setMailto] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setStatus("sending");
    setMessage(null);
    setMailto(null);

    try {
      const res = await fetch("/api/shop/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json().catch(() => null)) as {
        delivered?: boolean;
        mailto?: string;
        error?: string;
      } | null;

      if (!res.ok) {
        setStatus("error");
        setMessage(data?.error ?? "The waitlist didn't respond. Try again.");
        return;
      }

      if (data?.delivered) {
        setStatus("joined");
        setMessage("You're on the list. We'll email you when the drop opens.");
        setEmail("");
        return;
      }

      setStatus("mailto");
      setMailto(typeof data?.mailto === "string" ? data.mailto : null);
      setMessage(
        "This server isn't sending waitlist mail yet. Send the note from your inbox and we'll add you.",
      );
    } catch {
      setStatus("error");
      setMessage("Couldn't reach the waitlist. Try again in a moment.");
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 max-w-xl">
      <label
        htmlFor="waitlist-email"
        className="text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase"
      >
        Waitlist
      </label>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <input
          id="waitlist-email"
          type="email"
          required
          autoComplete="email"
          maxLength={254}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-full border border-white/10 bg-zinc-900/40 px-5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-white/25 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 px-6 py-2.5 text-sm font-bold tracking-wide text-white transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 disabled:opacity-50"
        >
          {status === "sending" ? "One sec..." : "Join the waitlist"}
        </button>
      </div>
      {message && (
        <p className="mt-3 text-sm text-zinc-400" role="status">
          {message}{" "}
          {status === "mailto" && mailto && (
            <a
              href={mailto}
              className="text-zinc-200 underline underline-offset-4 hover:text-white"
            >
              Email {CONTACT}
            </a>
          )}
        </p>
      )}
      <noscript>
        <p className="mt-3 text-sm text-zinc-400">
          Email{" "}
          <a
            href={`mailto:${CONTACT}?subject=Shop%20waitlist`}
            className="text-zinc-200 underline underline-offset-4"
          >
            {CONTACT}
          </a>{" "}
          to join the waitlist.
        </p>
      </noscript>
    </form>
  );
}
