"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { MyGuitars } from "@/components/gear/my-guitars";
import {
  ACCEPTED_TYPES,
  MAX_FILE_MB,
  processImage,
  validateImage,
} from "@/lib/gear-image";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { GEAR_BRANDS, type GearBrand } from "@/types/gear";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-zinc-900/40 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-white/25 focus:outline-none";
const labelClass =
  "block text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase";

/** Public name shown next to a member's guitars. */
function displayNameOf(user: User): string {
  const meta = user.user_metadata as { display_name?: string } | null;
  return meta?.display_name?.trim() || user.email?.split("@")[0] || "member";
}

function AuthPanel({ onAuthed }: { onAuthed: (user: User) => void }) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!supabase) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setMessage(null);
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/account/reset`,
        });
        if (error) throw error;
        setMessage(
          "Reset link sent — check your inbox and follow the link to set a new password.",
        );
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: displayName.trim() } },
        });
        if (error) throw error;
        if (data.user && !data.session) {
          setMessage("Check your inbox — confirm your email, then sign in here.");
        } else if (data.user) {
          onAuthed(data.user);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.user) onAuthed(data.user);
      }
    } catch (err) {
      const raw = err instanceof Error ? err.message : String(err ?? "");
      const useless = raw === "" || raw === "{}" || raw === "[object Object]";
      setMessage(
        useless
          ? "The email couldn't be sent. This usually means the email service (SMTP/Resend) in Supabase isn't configured correctly — check the API key and that the domain is verified."
          : raw,
      );
    } finally {
      setBusy(false);
    }
  }

  const heading =
    mode === "signin"
      ? "Sign in to the club"
      : mode === "signup"
        ? "Join the club"
        : "Reset your password";
  const sub =
    mode === "signin"
      ? "Your guitars are tied to your account."
      : mode === "signup"
        ? "Free forever. One account, all your guitars."
        : "Enter your email and we'll send you a reset link.";

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-zinc-900/20 p-6 sm:p-8">
      <h2 className="text-lg font-semibold text-white">{heading}</h2>
      <p className="mt-2 text-sm text-zinc-400">{sub}</p>

      <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
        {mode === "signup" && (
          <div>
            <label htmlFor="displayName" className={labelClass}>
              Display name <span className="normal-case text-zinc-600">(shown next to your guitars)</span>
            </label>
            <input
              id="displayName"
              required
              maxLength={40}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className={`mt-2 ${inputClass}`}
              placeholder="e.g. Raf"
            />
          </div>
        )}
        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`mt-2 ${inputClass}`}
            placeholder="you@example.com"
          />
        </div>
        {mode !== "forgot" && (
          <div>
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-2 ${inputClass}`}
              placeholder="Min. 8 characters"
            />
          </div>
        )}

        {message && <p className="text-sm text-amber-400">{message}</p>}

        <Button type="submit" disabled={busy} className="mt-2">
          {busy
            ? "One sec..."
            : mode === "signin"
              ? "Sign in"
              : mode === "signup"
                ? "Create account"
                : "Send reset link"}
        </Button>
      </form>

      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
        <button
          type="button"
          onClick={() => {
            setMessage(null);
            setMode((m) => (m === "signin" ? "signup" : "signin"));
          }}
          className="text-sm text-zinc-400 underline underline-offset-4 hover:text-white"
        >
          {mode === "signin"
            ? "New here? Create an account"
            : "Already a member? Sign in"}
        </button>
        {mode === "signin" && (
          <button
            type="button"
            onClick={() => {
              setMessage(null);
              setMode("forgot");
            }}
            className="text-sm text-zinc-500 underline underline-offset-4 hover:text-white"
          >
            Forgot password?
          </button>
        )}
      </div>
    </div>
  );
}

export function SubmitForm() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [user, setUser] = useState<User | null>(null);
  // No Supabase configured → nothing to check; render the notice immediately.
  const [checked, setChecked] = useState(() => supabase === null);

  const [brand, setBrand] = useState<GearBrand | "">("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [year, setYear] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setChecked(true);
    });
  }, [supabase]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Supabase not configured yet — friendly notice instead of a broken form.
  if (!supabase) {
    return (
      <div className="rounded-3xl border border-white/[0.08] bg-zinc-900/20 p-8 text-center">
        <h2 className="text-lg font-semibold text-white">Almost ready</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-400">
          Member uploads switch on once the database keys are configured. In
          the meantime, browse the collection or send us your guitar on
          Instagram.
        </p>
        <Link
          href="/gear"
          className="mt-6 inline-block text-sm text-zinc-300 underline underline-offset-4 hover:text-white"
        >
          ← Back to the Gear DB
        </Link>
      </div>
    );
  }

  if (!checked) {
    return <p className="py-16 text-center text-sm text-zinc-600">Loading...</p>;
  }

  if (!user) {
    return <AuthPanel onAuthed={setUser} />;
  }

  function pickFile(f: File | undefined) {
    setFileError(null);
    if (!f) return;
    const problem = validateImage(f);
    if (problem) {
      setFileError(problem);
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase || !user || !file || !brand) return;
    setBusy(true);
    setError(null);
    try {
      const blob = await processImage(file);
      const path = `${user.id}/${Date.now()}.webp`;
      const { error: upErr } = await supabase.storage
        .from("guitars")
        .upload(path, blob, { contentType: "image/webp" });
      if (upErr) throw upErr;

      const { data: pub } = supabase.storage.from("guitars").getPublicUrl(path);

      const { error: insErr } = await supabase.from("guitars").insert({
        owner_id: user.id,
        owner_name: displayNameOf(user),
        brand,
        model: model.trim(),
        color: color.trim(),
        year: year.trim() === "" ? null : Number(year),
        image_url: pub.publicUrl,
      });
      if (insErr) throw insErr;

      setDone(true);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      const msg =
        (err as { message?: string })?.message ??
        (typeof err === "string" ? err : "Upload failed — try again.");
      // Friendlier hint for the most common setup miss
      setError(
        /bucket/i.test(msg)
          ? `${msg} — run supabase/schema.sql in the Supabase SQL Editor to create the storage bucket.`
          : msg,
      );
    } finally {
      setBusy(false);
    }
  }

  const card = done ? (
    <div className="rounded-3xl border border-white/[0.08] bg-zinc-900/20 p-8 text-center">
      <h2 className="text-lg font-semibold text-white">She&apos;s in. 🎸</h2>
      <p className="mt-3 text-sm text-zinc-400">
        Your guitar just joined the collection.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link
          href="/gear"
          className="rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/15"
        >
          See it in the DB
        </Link>
        <button
          type="button"
          onClick={() => {
            setDone(false);
            setBrand("");
            setModel("");
            setColor("");
            setYear("");
            setFile(null);
            setPreview(null);
          }}
          className="rounded-full border border-white/10 px-5 py-2 text-sm text-zinc-300 transition hover:border-white/20 hover:text-white"
        >
          Add another
        </button>
      </div>
    </div>
  ) : (
    <form
      onSubmit={submit}
      className="rounded-3xl border border-white/[0.08] bg-zinc-900/20 p-6 sm:p-8"
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-zinc-400">
          Signed in as{" "}
          <span className="text-zinc-200">{displayNameOf(user)}</span> (
          {user.email})
        </p>
        <button
          type="button"
          onClick={async () => {
            await supabase.auth.signOut();
            setUser(null);
          }}
          className="text-xs text-zinc-500 underline underline-offset-4 hover:text-zinc-300"
        >
          Sign out
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-5">
        {/* Brand */}
        <div>
          <label htmlFor="brand" className={labelClass}>
            Brand *
          </label>
          <select
            id="brand"
            required
            value={brand}
            onChange={(e) => setBrand(e.target.value as GearBrand)}
            className={`mt-2 ${inputClass} appearance-none`}
          >
            <option value="" disabled>
              Select a brand
            </option>
            {GEAR_BRANDS.map((b) => (
              <option key={b} value={b} className="bg-zinc-900">
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Photo */}
        <div>
          <label className={labelClass}>Front-view photo * (1 per guitar)</label>
          <input
            ref={fileInput}
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            className="hidden"
            onChange={(e) => pickFile(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="mt-2 flex w-full items-center justify-center gap-3 rounded-xl border border-dashed border-white/15 bg-zinc-900/30 px-4 py-6 text-sm text-zinc-400 transition hover:border-white/30 hover:text-white"
          >
            {preview ? (
              <span className="relative h-40 w-32 overflow-hidden rounded-lg">
                <Image
                  src={preview}
                  alt="Preview of your guitar"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </span>
            ) : (
              <>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                  />
                </svg>
                Upload photo — JPG/PNG/WebP, max {MAX_FILE_MB} MB
              </>
            )}
          </button>
          {fileError && <p className="mt-2 text-sm text-red-400">{fileError}</p>}
        </div>

        {/* Model */}
        <div>
          <label htmlFor="model" className={labelClass}>
            Model *
          </label>
          <input
            id="model"
            required
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className={`mt-2 ${inputClass}`}
            placeholder="e.g. Les Paul Standard"
          />
        </div>

        {/* Color */}
        <div>
          <label htmlFor="color" className={labelClass}>
            Color *
          </label>
          <input
            id="color"
            required
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className={`mt-2 ${inputClass}`}
            placeholder="e.g. Cherry Sunburst"
          />
        </div>

        {/* Year (optional) */}
        <div>
          <label htmlFor="year" className={labelClass}>
            Year <span className="normal-case text-zinc-600">(optional)</span>
          </label>
          <input
            id="year"
            type="number"
            min={1900}
            max={2100}
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className={`mt-2 ${inputClass}`}
            placeholder="e.g. 1996"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <Button type="submit" disabled={busy || !file || !brand} className="mt-1">
          {busy ? "Uploading..." : "Add to the collection"}
        </Button>
      </div>
    </form>
  );

  return (
    <>
      {card}
      <MyGuitars supabase={supabase} user={user} refreshKey={refreshKey} />
    </>
  );
}
