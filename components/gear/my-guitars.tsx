"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  errorMessage,
  processImage,
  storagePathFromUrl,
  validateImage,
} from "@/lib/gear-image";
import { GEAR_BRANDS, type GearBrand } from "@/types/gear";

type Row = {
  id: string;
  brand: GearBrand;
  model: string;
  color: string;
  year: number | null;
  image_url: string;
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-zinc-900/40 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-white/25 focus:outline-none";

/**
 * "Your guitars" — every entry the signed-in member owns, with edit
 * (fields + optional photo replacement) and delete. Rendered on the
 * submit page; `refreshKey` bumps after each new submission.
 */
export function MyGuitars({
  supabase,
  user,
  refreshKey,
}: {
  supabase: SupabaseClient;
  user: User;
  refreshKey: number;
}) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [editing, setEditing] = useState<Row | null>(null);
  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const [busy, setBusy] = useState<string | null>(null); // id being worked on
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("guitars")
      .select("id, brand, model, color, year, image_url")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });
    setRows((data as Row[]) ?? []);
  }, [supabase, user.id]);

  useEffect(() => {
    // Async data fetch — state is set after the request resolves, not synchronously.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load, refreshKey]);

  async function remove(row: Row) {
    if (!window.confirm(`Delete your ${row.brand} ${row.model}? This can't be undone.`)) {
      return;
    }
    setBusy(row.id);
    setError(null);
    try {
      const { error: delErr } = await supabase
        .from("guitars")
        .delete()
        .eq("id", row.id);
      if (delErr) throw delErr;
      // Best-effort: remove the photo from storage too
      const path = storagePathFromUrl(row.image_url);
      if (path) await supabase.storage.from("guitars").remove([path]);
      setRows((r) => (r ? r.filter((g) => g.id !== row.id) : r));
    } catch (err) {
      setError(errorMessage(err, "Delete failed — try again."));
    } finally {
      setBusy(null);
    }
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setBusy(editing.id);
    setError(null);
    try {
      let imageUrl = editing.image_url;
      const oldPath = storagePathFromUrl(editing.image_url);

      if (newPhoto) {
        const blob = await processImage(newPhoto);
        const path = `${user.id}/${Date.now()}.webp`;
        const { error: upErr } = await supabase.storage
          .from("guitars")
          .upload(path, blob, { contentType: "image/webp" });
        if (upErr) throw upErr;
        imageUrl = supabase.storage.from("guitars").getPublicUrl(path).data
          .publicUrl;
      }

      const { error: updErr } = await supabase
        .from("guitars")
        .update({
          brand: editing.brand,
          model: editing.model.trim(),
          color: editing.color.trim(),
          year: editing.year,
          image_url: imageUrl,
        })
        .eq("id", editing.id);
      if (updErr) throw updErr;

      if (newPhoto && oldPath) {
        await supabase.storage.from("guitars").remove([oldPath]);
      }
      setEditing(null);
      setNewPhoto(null);
      await load();
    } catch (err) {
      setError(errorMessage(err, "Update failed — try again."));
    } finally {
      setBusy(null);
    }
  }

  if (rows === null) {
    return (
      <p className="mt-10 text-center text-sm text-zinc-600">
        Loading your guitars...
      </p>
    );
  }
  if (rows.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-lg font-semibold text-white">
        Your guitars ({rows.length})
      </h2>
      <p className="mt-1 text-sm text-zinc-500">
        Only you can edit or remove these.
      </p>
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      <div className="mt-5 flex flex-col gap-3">
        {rows.map((row) =>
          editing?.id === row.id ? (
            /* ---------- Edit mode ---------- */
            <form
              key={row.id}
              onSubmit={saveEdit}
              className="rounded-2xl border border-white/15 bg-zinc-900/40 p-4"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <select
                  value={editing.brand}
                  onChange={(e) =>
                    setEditing({ ...editing, brand: e.target.value as GearBrand })
                  }
                  className={`${inputClass} appearance-none`}
                >
                  {GEAR_BRANDS.map((b) => (
                    <option key={b} value={b} className="bg-zinc-900">
                      {b}
                    </option>
                  ))}
                </select>
                <input
                  required
                  value={editing.model}
                  onChange={(e) =>
                    setEditing({ ...editing, model: e.target.value })
                  }
                  className={inputClass}
                  placeholder="Model"
                />
                <input
                  required
                  value={editing.color}
                  onChange={(e) =>
                    setEditing({ ...editing, color: e.target.value })
                  }
                  className={inputClass}
                  placeholder="Color"
                />
                <input
                  type="number"
                  min={1900}
                  max={2100}
                  value={editing.year ?? ""}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      year: e.target.value === "" ? null : Number(e.target.value),
                    })
                  }
                  className={inputClass}
                  placeholder="Year (optional)"
                />
              </div>

              <input
                ref={fileInput}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const problem = validateImage(f);
                  if (problem) {
                    setError(problem);
                    return;
                  }
                  setError(null);
                  setNewPhoto(f);
                }}
              />
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="mt-3 text-sm text-zinc-400 underline underline-offset-4 hover:text-white"
              >
                {newPhoto ? `New photo: ${newPhoto.name}` : "Replace photo (optional)"}
              </button>

              <div className="mt-4 flex gap-3">
                <Button type="submit" disabled={busy === row.id}>
                  {busy === row.id ? "Saving..." : "Save changes"}
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setNewPhoto(null);
                    setError(null);
                  }}
                  className="rounded-full border border-white/10 px-5 py-2 text-sm text-zinc-300 transition hover:border-white/20 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            /* ---------- Display mode ---------- */
            <div
              key={row.id}
              className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-zinc-900/20 p-3"
            >
              <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-zinc-900">
                <Image
                  src={row.image_url}
                  alt={`${row.brand} ${row.model}`}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                  {row.brand} {row.model}
                </p>
                <p className="text-xs text-zinc-500">
                  {row.color}
                  {row.year ? ` · ${row.year}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditing(row);
                  setNewPhoto(null);
                  setError(null);
                }}
                className="shrink-0 rounded-full border border-white/10 px-4 py-1.5 text-xs text-zinc-300 transition hover:border-white/25 hover:text-white"
              >
                Edit
              </button>
              <button
                type="button"
                disabled={busy === row.id}
                onClick={() => remove(row)}
                className="shrink-0 rounded-full border border-red-500/20 px-4 py-1.5 text-xs text-red-400 transition hover:border-red-500/50 hover:text-red-300 disabled:opacity-50"
              >
                {busy === row.id ? "..." : "Delete"}
              </button>
            </div>
          ),
        )}
      </div>
    </section>
  );
}
