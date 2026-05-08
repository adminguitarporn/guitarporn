/**
 * Minimal B&W electric guitar silhouette — soft drift animation (see globals.css).
 */
export function AnimatedGuitarSilhouette() {
  return (
    <div
      className="home-guitar-silhouette pointer-events-none flex justify-center py-6 sm:py-10"
      aria-hidden
    >
      <svg
        viewBox="0 0 200 480"
        className="h-[min(40vh,300px)] w-auto max-w-[min(50vw,190px)] text-white/55"
        fill="currentColor"
      >
        <title>Guitar silhouette</title>
        {/* Headstock + tuners hint */}
        <path d="M88 12h24l4 8-2 36-6 8h-16l-6-8-2-36 4-8z" />
        {/* Neck */}
        <path d="M94 68h12v118H94V68z" />
        {/* Body: double-cut electric */}
        <path d="M78 186h44c36 4 62 32 70 68 4 20 2 44-8 64-14 28-40 48-72 52-6 1-12 1-18 0-32-4-58-24-72-52-10-20-12-44-8-64 8-36 34-64 70-68h-6z" />
      </svg>
    </div>
  );
}
