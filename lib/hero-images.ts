import fs from "node:fs";
import path from "node:path";

export type HeroImage = {
  src: string;
  alt: string;
};

const HERO_DIR = path.join(process.cwd(), "public", "hero");
const ALLOWED = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

/**
 * Monthly-rotating hero photos.
 *
 * HOW TO SWAP THEM (takes ~2 minutes):
 * 1. Drop your guitar photos into `public/hero/` (jpg/png/webp, landscape,
 *    ideally 2400px wide, < 1 MB each after compression).
 * 2. Name them with a number prefix to control order: `01-lespaul.jpg`,
 *    `02-strat.jpg`, ...
 * 3. Delete last month's files, commit, push. The deploy picks them up.
 *
 * The alt text is derived from the filename: `01-les-paul.jpg` → "les paul".
 */
export function getHeroImages(): HeroImage[] {
  let files: string[] = [];
  try {
    files = fs.readdirSync(HERO_DIR);
  } catch {
    return [];
  }
  return files
    .filter((f) => ALLOWED.has(path.extname(f).toLowerCase()))
    .sort()
    .map((f) => ({
      src: `/hero/${f}`,
      alt: path
        .basename(f, path.extname(f))
        .replace(/^\d+[-_ ]*/, "")
        .replace(/[-_]+/g, " ")
        .trim() || "Guitar",
    }));
}
