import Link from "next/link";
import { GuitarPornText } from "@/components/brand/guitar-porn-text";
import { Container } from "@/components/layout/container";

/**
 * Temporary hold page while Videos / Gear / Shop are stubbed out.
 */
export function ContentInProgress() {
  return (
    <main className="flex flex-1 flex-col justify-center py-20 sm:py-28">
      <Container className="max-w-2xl text-center">
        <p className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">
          <GuitarPornText />
        </p>
        <h1 className="mt-8 text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl md:leading-snug">
          WORKING ON THIS
          <br />
          WITH CONTENT FOR YOUR DELIGHT
        </h1>
        <p className="mt-10">
          <Link
            href="/"
            className="text-sm font-bold text-white underline-offset-4 hover:underline"
          >
            ← Back home
          </Link>
        </p>
      </Container>
    </main>
  );
}
