import { Container } from "@/components/layout/container";
import { CategoryCards } from "@/components/home/category-cards";
import { FeaturedShop } from "@/components/home/featured-shop";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { ButtonLink } from "@/components/ui/button";
import { ScrollGuitarProgress } from "@/components/home/scroll-guitar-progress";
import { ScrollReveal } from "@/components/home/scroll-reveal";
import { getHeroImages } from "@/lib/hero-images";
import { getFeaturedProducts } from "@/lib/shopify";

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

export async function HomePage() {
  const heroImages = getHeroImages();
  const featuredProducts = await getFeaturedProducts();

  return (
    <main>
      <ScrollGuitarProgress />

      <HeroCarousel images={heroImages}>
        <Container className="pb-16 pt-32 sm:pb-24 sm:pt-40">
          <p className="lux-in text-xs font-medium tracking-[0.28em] text-zinc-400 uppercase mb-6">
            The GuitarPorn Database
          </p>
          <h1 className="lux-in max-w-4xl text-balance text-4xl font-semibold tracking-[-0.04em] text-white sm:text-6xl sm:leading-[1.05] lg:text-7xl">
            Built for people obsessed with guitars.
          </h1>
          <p className="lux-in lux-in-2 mt-7 max-w-2xl text-lg leading-relaxed text-zinc-300 sm:text-xl">
            Every guitar. Every player. The world&apos;s database for gear collectors and guitar addicts. Discover iconic guitars, legendary rigs, hidden gems and the stories behind them. One database. One community.
          </p>

          <div className="lux-in lux-in-3 mt-10 flex flex-wrap items-center gap-3">
            <ButtonLink href="/gear" variant="primary">
              Explore the Database
            </ButtonLink>
            <ButtonLink href="/videos" variant="secondary">
              Watch & Learn
            </ButtonLink>
            <ButtonLink href="/shop" variant="ghost">
              Shop the Collection →
            </ButtonLink>
          </div>
        </Container>
      </HeroCarousel>

      <section id="follow-our-channels" className="py-16 sm:py-20">
        <Container>
          <ScrollReveal className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="What are you waiting for? Follow us"
              title="The fun is inside."
              subtitle="Yes, inside."
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
              eyebrow="What’s here"
              title="Everything a guitarist needs."
              subtitle="Browse the gear database, watch curated videos, or grab what you need from the shop. Built by players, for players."
            />
          </ScrollReveal>

          <ScrollReveal className="mt-10" delay={150}>
            <CategoryCards />
          </ScrollReveal>
        </Container>
      </section>

      <FeaturedShop products={featuredProducts} />
    </main>
  );
}
