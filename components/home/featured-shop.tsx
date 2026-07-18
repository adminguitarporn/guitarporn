import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { ScrollReveal } from "@/components/home/scroll-reveal";
import type { ShopProduct } from "@/lib/shopify";

/**
 * "From the shop" — 5 random products pulled from Shopify, re-shuffled
 * hourly. Falls back to a shop CTA until the store is connected.
 */
export function FeaturedShop({ products }: { products: ShopProduct[] | null }) {
  return (
    <section className="border-t border-white/[0.06] py-16 sm:py-20">
      <Container>
        <ScrollReveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">
                From the shop
              </p>
              <h2 className="mt-5 text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Fresh from the store.
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-sm font-medium text-zinc-400 underline underline-offset-4 transition hover:text-white"
            >
              See everything →
            </Link>
          </div>

          {products && products.length > 0 ? (
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {products.map((p) => (
                <a
                  key={p.id}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-zinc-900/20 transition-all duration-[450ms] ease-[cubic-bezier(.22,.61,.36,1)] hover:-translate-y-1 hover:border-white/25 hover:bg-zinc-900/40 hover:shadow-[0_14px_36px_rgba(0,0,0,0.5),0_0_20px_rgba(147,197,253,0.05)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 motion-reduce:transform-none"
                >
                  <div className="relative aspect-square overflow-hidden bg-zinc-900">
                    {p.imageUrl ? (
                      <Image
                        src={p.imageUrl}
                        alt={p.title}
                        fill
                        sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                        className="object-cover transition duration-500 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-zinc-700">
                        <svg
                          viewBox="0 0 48 48"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className="h-10 w-10"
                          aria-hidden
                        >
                          <path d="M10 15h28l-2.5 26h-23L10 15Z" />
                          <path d="M17 20v-6a7 7 0 0 1 14 0v6" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="line-clamp-2 text-sm font-medium text-white">
                      {p.title}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">{p.price}</p>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-3xl border border-white/[0.08] bg-zinc-900/20 px-6 py-12 text-center sm:px-10">
              <p className="text-base text-zinc-400">
                The store shelves are being stocked. Collections, limited
                editions and soon... guitars.
              </p>
              <Link
                href="/shop"
                className="mt-6 inline-flex items-center rounded-full border border-white/15 bg-white/10 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-white/15"
              >
                Visit the shop →
              </Link>
            </div>
          )}
        </ScrollReveal>
      </Container>
    </section>
  );
}
