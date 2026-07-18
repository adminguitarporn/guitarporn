/** Client-side photo rules + processing shared by submit and edit forms. */

export const MAX_FILE_MB = 5;
export const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;
export const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
/** Photos are downscaled client-side to this max edge before upload. */
export const MAX_EDGE_PX = 1600;

/** Validate a picked file; returns an error message or null if OK. */
export function validateImage(f: File): string | null {
  if (!ACCEPTED_TYPES.includes(f.type)) return "JPG, PNG, or WebP only.";
  if (f.size > MAX_FILE_BYTES)
    return `Max ${MAX_FILE_MB} MB — this one is ${(f.size / 1024 / 1024).toFixed(1)} MB.`;
  return null;
}

/** Downscale + re-encode the photo in the browser so storage stays light. */
export async function processImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE_PX / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size < 1024 * 1024) return file;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  return new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b ?? file), "image/webp", 0.85),
  );
}

/** Extract the storage path ("uid/123.webp") from a public bucket URL. */
export function storagePathFromUrl(url: string): string | null {
  const marker = "/object/public/guitars/";
  const i = url.indexOf(marker);
  if (i === -1) return null;
  return decodeURIComponent(url.slice(i + marker.length));
}

/** Friendly error extraction for Supabase errors. */
export function errorMessage(err: unknown, fallback: string): string {
  return (
    (err as { message?: string })?.message ??
    (typeof err === "string" ? err : fallback)
  );
}
