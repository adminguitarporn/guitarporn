import Link from "next/link";
import { Container } from "@/components/layout/container";

export default function NotFound() {
  return (
    <main>
      <section className="pb-24 pt-16 sm:pt-20">
        <Container>
          <p className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">
            404
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            This page isn&apos;t in the club.
          </h1>
          <p className="mt-4 max-w-xl text-base text-zinc-400">
            The link doesn&apos;t match a page or a member guitar.
          </p>
          <Link
            href="/gear"
            className="mt-8 inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-6 py-2.5 text-sm font-bold tracking-wide text-white transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
          >
            Back to the Gear DB
          </Link>
        </Container>
      </section>
    </main>
  );
}
