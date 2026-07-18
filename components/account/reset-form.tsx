"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-zinc-900/40 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-white/25 focus:outline-none";

/**
 * Landing page for the password-recovery email link. Supabase signs the
 * user in via the link's token; here they set the new password.
 */
export function ResetForm() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    // The recovery link logs the user in; confirm we have a session.
    supabase.auth.getUser().then(({ data }) => setReady(!!data.user));
  }, [supabase]);

  if (!supabase) {
    return (
      <p className="text-sm text-zinc-500">
        Accounts aren&apos;t configured on this deployment yet.
      </p>
    );
  }

  if (done) {
    return (
      <div className="rounded-3xl border border-white/[0.08] bg-zinc-900/20 p-8 text-center">
        <h2 className="text-lg font-semibold text-white">Password updated.</h2>
        <Link
          href="/gear/submit"
          className="mt-4 inline-block text-sm text-zinc-300 underline underline-offset-4 hover:text-white"
        >
          Back to adding guitars →
        </Link>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-3xl border border-white/[0.08] bg-zinc-900/20 p-6 sm:p-8"
    >
      <h2 className="text-lg font-semibold text-white">Set a new password</h2>
      {!ready && (
        <p className="mt-2 text-sm text-amber-400">
          Open this page from the link in your reset email — otherwise the
          change can&apos;t be verified.
        </p>
      )}
      <div className="mt-6 flex flex-col gap-4">
        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
          placeholder="New password (min. 8 characters)"
        />
        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className={inputClass}
          placeholder="Repeat new password"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button type="submit" disabled={busy || !ready}>
          {busy ? "Saving..." : "Save new password"}
        </Button>
      </div>
    </form>
  );
}
