import { GuitarPornText } from "@/components/brand/guitar-porn-text";
import { Container } from "@/components/layout/container";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.08] bg-zinc-950 pb-24 pt-20 sm:pb-32 sm:pt-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(255,255,255,0.08), transparent), radial-gradient(ellipse 60% 40% at 100% 100%, rgba(255,255,255,0.04), transparent)",
        }}
      />
      <Container className="relative">
        <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl sm:leading-[1.08] md:text-6xl md:leading-[1.05] lg:text-7xl">
          Thank you for coming{" "}
          <span className="font-normal text-zinc-400" aria-hidden="true">
            ;)
          </span>
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
          Seriously—we&apos;re glad you&apos;re here.{" "}
          <GuitarPornText className="font-medium" /> is still a work-in-progress
          backstage; thanks for peeking in while we get the amp warmed up.
        </p>
      </Container>
    </section>
  );
}
