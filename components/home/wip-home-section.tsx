import { Container } from "@/components/layout/container";

/**
 * Home-only notice while Videos / Gear / Shop routes show the hold page.
 */
export function WipHomeSection() {
  return (
    <section
      id="site-status"
      className="border-t border-white/[0.06] py-16 sm:py-20"
      aria-labelledby="wip-heading"
    >
      <Container>
        <div className="mx-auto max-w-2xl rounded-3xl border border-white/[0.08] bg-zinc-900/25 px-6 py-12 text-center sm:px-10 sm:py-14">
          <p className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">
            Work in progress
          </p>
          <h2
            id="wip-heading"
            className="mt-5 text-2xl font-semibold tracking-tight text-white sm:text-3xl"
          >
            This whole corner of the site is still in sketch mode.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-zinc-400 sm:text-lg">
            No featured drops yet—no video wall, no gear grid, no shop link
            worth clicking. We&apos;re stacking the real stuff first; when it
            ships, it&apos;ll show up here first.
          </p>
          <p className="mt-8 text-sm text-zinc-500">
            For now, poke the nav if you want—you&apos;ll just see our
            &quot;working on it&quot; note. Same vibe, same patience.{" "}
            <span className="text-zinc-400">;)</span>
          </p>
        </div>
      </Container>
    </section>
  );
}
