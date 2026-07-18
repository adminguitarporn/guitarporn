/**
 * Lightning guitar — an electric guitar sketched from thunderbolt segments.
 * The stroke draws itself on load, glows electric blue, and flickers like
 * a storm. Pure SVG + CSS (see .electric-path / .electric-strings in globals).
 */
export function ElectricGuitar({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 260"
      fill="none"
      className={className}
      aria-hidden
      style={{ filter: "drop-shadow(0 0 14px rgba(59,130,246,0.45))" }}
    >
      <defs>
        <linearGradient id="boltStroke" x1="0" y1="0" x2="640" y2="260">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.45" stopColor="#93c5fd" />
          <stop offset="1" stopColor="#3b82f6" />
        </linearGradient>
      </defs>

      {/* Headstock — jagged */}
      <path
        className="electric-path"
        d="M28 96 62 74l14 10-8 14 20 4"
        stroke="url(#boltStroke)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Neck — twin bolt rails */}
      <path
        className="electric-path"
        d="M88 102 300 122M86 116 298 136"
        stroke="url(#boltStroke)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Strings inside the neck */}
      <g className="electric-strings" stroke="#93c5fd" strokeWidth="0.7" opacity="0.7">
        <line x1="90" y1="105" x2="299" y2="125" />
        <line x1="89" y1="109" x2="299" y2="129" />
        <line x1="88" y1="113" x2="298" y2="133" />
      </g>

      {/* Body — one continuous thunderbolt outline */}
      <path
        className="electric-path"
        d="M300 122
           l64-52 -18 44 88-30 -34 52 76-16 -46 50 64-2 -66 44 30 18 -84-6 12 30 -52-32 -26 24 -8-40 -26-16 26-24Z"
        stroke="url(#boltStroke)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Pickup + bridge hints */}
      <path
        className="electric-path"
        d="M356 128l30 4M348 150l34 4"
        stroke="#93c5fd"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
}
