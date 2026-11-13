import Link from "next/link";
import { Container } from "@/components/layout/container";
import { YOUTUBE_CHANNEL_URL } from "@/lib/youtube";

const CONTACT_EMAIL = "contact@guitarporn.club";
const INSTAGRAM_URL = "https://www.instagram.com/guitarporn/";

const linkClass = "transition-colors hover:text-zinc-300";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-zinc-950/80 py-10 text-sm text-zinc-500">
      <Container className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-3">
          <p>© {new Date().getFullYear()} GuitarPorn. Built for players.</p>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-4 gap-y-2">
            <Link href="/privacy" className={linkClass}>
              Privacy
            </Link>
            <Link href="/terms" className={linkClass}>
              Terms
            </Link>
            <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
              {CONTACT_EMAIL}
            </a>
          </nav>
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          <nav aria-label="Social" className="flex flex-wrap gap-x-4 gap-y-2">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              Instagram
            </a>
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              YouTube
            </a>
          </nav>
          <p className="text-zinc-600">Loud &amp; clear.</p>
        </div>
      </Container>
    </footer>
  );
}
