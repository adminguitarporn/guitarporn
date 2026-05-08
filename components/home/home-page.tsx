import Link from "next/link";
import { Container } from "@/components/layout/container";
import { AnimatedGuitarSilhouette } from "@/components/home/animated-guitar-silhouette";
import { ButtonLink } from "@/components/ui/button";
import { ScrollGuitarProgress } from "@/components/home/scroll-guitar-progress";
import { ScrollReveal } from "@/components/home/scroll-reveal";

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">
        {eyebrow}
      </p>
      <h2 className="mt-5 text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        {title}
      </h2>
      <p className="mt-5 text-base leading-relaxed text-zinc-400 sm:text-lg">
        {subtitle}
      </p>
    </div>
  );
}

function MinimalCard({
  title,
  body,
  href,
}: {
  title: string;
  body: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-3xl border border-white/[0.08] bg-zinc-900/20 p-6 transition hover:border-white/20 hover:bg-zinc-900/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
    >
      <p className="text-sm font-semibold tracking-tight text-white">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{body}</p>
      <p className="mt-4 text-xs font-medium tracking-[0.22em] text-zinc-500 uppercase group-hover:text-zinc-300">
        Explore →
      </p>
    </Link>
  );
}

function IconYouTube({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M22 12s0-5-2.2-7.2C17.8 3 12 3 12 3s-5.8 0-7.8 1.8C2 7 2 12 2 12s0 5 2.2 7.2C6.2 21 12 21 12 21s5.8 0 7.8-1.8C22 17 22 12 22 12Z" />
      <path d="M10 15V9l6 3-6 3Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconInstagram({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </svg>
  );
}

export function HomePage() {
  return (
    <main>
      <ScrollGuitarProgress />

      <section className="relative overflow-hidden border-b border-white/[0.08] bg-zinc-950 pb-20 pt-20 sm:pb-28 sm:pt-28">
        <div
          className="pointer-events-none absolute inset-0 opacity-35"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(255,255,255,0.10), transparent), radial-gradient(ellipse 50% 30% at 15% 90%, rgba(255,255,255,0.05), transparent)",
          }}
        />

        <Container className="relative">
          <ScrollReveal>
            <h1 className="max-w-4xl text-balance text-4xl font-semibold tracking-[-0.04em] text-white sm:text-6xl sm:leading-[1.05] lg:text-7xl">
              loud &amp; clear
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
              thank you for coming ;)
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <ButtonLink href="/videos" variant="primary">
                Go to our Videos
              </ButtonLink>
              <ButtonLink href="/gear" variant="secondary">
                Go to Gear
              </ButtonLink>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      <section id="follow-our-channels" className="py-16 sm:py-20">
        <Container>
          <ScrollReveal className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="follow our channels"
              title="Hang out where we actually post."
              subtitle="Quick takes, rigs, and the odd rabbit hole—no feeds stuffed with noise."
            />

            <div className="flex w-full max-w-md flex-wrap items-stretch gap-4 sm:justify-end">
              <a
                href="https://www.instagram.com/guitarporn/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[88px] min-w-[120px] flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-white/[0.08] bg-zinc-900/20 px-6 py-5 text-zinc-300 transition hover:border-white/20 hover:bg-zinc-900/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 sm:flex-initial"
                aria-label="GuitarPorn on Instagram"
              >
                <IconInstagram className="h-8 w-8" />
                <span className="text-xs font-medium tracking-[0.2em] text-zinc-500 uppercase">
                  Instagram
                </span>
              </a>
              <a
                href="https://www.youtube.com/@guitarporn-club"
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[88px] min-w-[120px] flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-white/[0.08] bg-zinc-900/20 px-6 py-5 text-zinc-300 transition hover:border-white/20 hover:bg-zinc-900/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 sm:flex-initial"
                aria-label="GuitarPorn on YouTube"
              >
                <IconYouTube className="h-8 w-8" />
                <span className="text-xs font-medium tracking-[0.2em] text-zinc-500 uppercase">
                  YouTube
                </span>
              </a>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      <section className="border-t border-white/[0.06] py-16 sm:py-20">
        <Container>
          <ScrollReveal>
            <SectionHeading
              eyebrow="Three routes"
              title="Pick a lane."
              subtitle="Three doors, same vibe: watch, browse, or shop when you’re ready. Some rooms are still getting furniture—that’s OK."
            />
          </ScrollReveal>

          <AnimatedGuitarSilhouette />

          <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <ScrollReveal>
              <MinimalCard
                title="Videos"
                body="A clean wall of hand-picked performances, rigs, and techniques."
                href="/videos"
              />
            </ScrollReveal>
            <ScrollReveal>
              <MinimalCard
                title="Gear"
                body="A gallery you can browse fast—brands up top, details below."
                href="/gear"
              />
            </ScrollReveal>
            <ScrollReveal>
              <MinimalCard
                title="Shop"
                body="A short list of links we’d actually recommend."
                href="/shop"
              />
            </ScrollReveal>
          </div>
        </Container>
      </section>

      <section className="border-t border-white/[0.06] py-16 sm:py-20">
        <Container>
          <ScrollReveal className="mx-auto max-w-2xl rounded-3xl border border-white/[0.08] bg-zinc-900/20 px-6 py-12 text-center sm:px-10 sm:py-14">
            <p className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">
              Still opening the cases
            </p>
            <h2 className="mt-5 text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              We’re glad you’re here early.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-zinc-400 sm:text-lg">
              The site is growing with us—some pages are placeholders, some are
              half-built, and that’s on purpose. Pull up a chair; we’ll keep
              stacking the good stuff where you can find it.
            </p>
            <div className="mt-9 flex justify-center">
              <ButtonLink href="/videos" variant="secondary">
                See what’s up
              </ButtonLink>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </main>
  );
}
