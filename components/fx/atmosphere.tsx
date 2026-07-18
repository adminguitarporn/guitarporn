"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient atmosphere — cinematic, almost invisible.
 *
 * CSS layers: slow-drifting gradient wash, a light leak, a breathing
 * vignette (see globals.css).
 *
 * Canvas: floating dust motes + the signature effect — every 12–30s a
 * single hand-drawn white line travels across the screen, its path
 * procedurally built from guitar-contour vocabulary (horns, waists,
 * bouts, neck lines). It never fully draws a guitar, never repeats,
 * and reads like a photographic flash: white, ≤18% opacity, 1.5px blur,
 * 600–900ms, gone.
 *
 * Clicking summons one near the cursor. Honors prefers-reduced-motion.
 */

type Dust = {
  x: number;
  y: number;
  r: number;
  alpha: number;
  vy: number;
  sway: number;
  phase: number;
};

type Pt = { x: number; y: number };

type Flash = {
  points: Pt[];
  extraLines: Pt[][]; // string hints for neck archetype
  start: number;
  duration: number;
  peak: number; // max alpha
};

const EASE = (t: number) => 1 - Math.pow(1 - t, 3);

/** Sample a cubic bezier into points. */
function cubic(p0: Pt, c1: Pt, c2: Pt, p1: Pt, steps = 22): Pt[] {
  const out: Pt[] = [];
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const u = 1 - t;
    out.push({
      x:
        u * u * u * p0.x +
        3 * u * u * t * c1.x +
        3 * u * t * t * c2.x +
        t * t * t * p1.x,
      y:
        u * u * u * p0.y +
        3 * u * u * t * c1.y +
        3 * u * t * t * c2.y +
        t * t * t * p1.y,
    });
  }
  return out;
}

/** Normalized guitar-contour vocabularies (x grows rightward). */
const CONTOURS: number[][][] = [
  // Strat-ish: horn → waist dip → lower bout → bottom curl
  [
    [0, 0, 0.05, -0.22, 0.18, -0.3, 0.3, -0.22],
    [0.3, -0.22, 0.36, -0.16, 0.42, -0.05, 0.5, -0.08],
    [0.5, -0.08, 0.62, -0.14, 0.78, -0.1, 0.86, 0.06],
    [0.86, 0.06, 0.9, 0.2, 0.78, 0.34, 0.6, 0.32],
  ],
  // Les Paul-ish: single soft cut → waist → round bout
  [
    [0, 0, 0.1, -0.28, 0.3, -0.34, 0.42, -0.2],
    [0.42, -0.2, 0.5, -0.1, 0.55, -0.02, 0.62, -0.06],
    [0.62, -0.06, 0.8, -0.16, 0.95, 0.02, 0.9, 0.24],
    [0.9, 0.24, 0.82, 0.42, 0.55, 0.44, 0.42, 0.3],
  ],
];

function jitter(v: number, amt: number) {
  return v + (Math.random() - 0.5) * amt;
}

function makeFlash(w: number, h: number, now: number, anchor?: Pt): Flash {
  const neck = Math.random() < 0.3;
  const scale = neck
    ? w * (0.35 + Math.random() * 0.35)
    : Math.min(w, h) * (0.35 + Math.random() * 0.4);
  const mirror = Math.random() < 0.5 ? -1 : 1;
  const flipY = Math.random() < 0.5 ? -1 : 1;
  const rot = (Math.random() - 0.5) * 0.5;
  const cos = Math.cos(rot);
  const sin = Math.sin(rot);
  const ox = anchor
    ? anchor.x
    : w * (Math.random() * 1.2 - 0.1); // sometimes off-screen
  const oy = anchor ? anchor.y : h * (0.15 + Math.random() * 0.7);

  const map = (p: Pt): Pt => {
    const x = p.x * mirror * scale;
    const y = p.y * flipY * scale;
    return { x: ox + x * cos - y * sin, y: oy + x * sin + y * cos };
  };

  let points: Pt[] = [];
  const extraLines: Pt[][] = [];

  if (neck) {
    // Long neck line + faint parallel string hints
    const len = 1;
    points = [map({ x: 0, y: 0 }), map({ x: len, y: jitter(0, 0.06) })];
    const lines = 1 + Math.floor(Math.random() * 2);
    for (let i = 1; i <= lines; i++) {
      const off = (i * 5) / scale;
      extraLines.push([
        map({ x: 0.06, y: off }),
        map({ x: len * (0.55 + Math.random() * 0.3), y: off + jitter(0, 0.04) }),
      ]);
    }
  } else {
    const vocab = CONTOURS[Math.floor(Math.random() * CONTOURS.length)];
    // Draw a random 55–90% portion — never the full guitar
    const segs = Math.max(2, Math.round(vocab.length * (0.55 + Math.random() * 0.35)));
    const startSeg = Math.random() < 0.3 ? 1 : 0;
    for (let s = startSeg; s < Math.min(vocab.length, startSeg + segs); s++) {
      const [x0, y0, cx1, cy1, cx2, cy2, x1, y1] = vocab[s];
      const j = 0.05;
      points.push(
        ...cubic(
          map({ x: jitter(x0, j), y: jitter(y0, j) }),
          map({ x: jitter(cx1, j), y: jitter(cy1, j) }),
          map({ x: jitter(cx2, j), y: jitter(cy2, j) }),
          map({ x: jitter(x1, j), y: jitter(y1, j) }),
        ),
      );
    }
  }

  return {
    points,
    extraLines,
    start: now,
    duration: 600 + Math.random() * 300,
    peak: 0.1 + Math.random() * 0.08, // ≤ 0.18
  };
}

function drawPartialLine(
  ctx: CanvasRenderingContext2D,
  pts: Pt[],
  fraction: number,
  alpha: number,
  width: number,
) {
  if (pts.length < 2 || fraction <= 0) return;
  const count = Math.max(2, Math.floor(pts.length * fraction));
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < count; i++) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke();
}

export function Atmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let dust: Dust[] = [];
    let flashes: Flash[] = [];
    let raf = 0;
    let nextFlash = performance.now() + 6000 + Math.random() * 8000;
    let w = 0;
    let h = 0;

    function resize() {
      if (!canvas || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(70, Math.round((w * h) / 26000));
      dust = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.4 + Math.random(),
        alpha: 0.04 + Math.random() * 0.12,
        vy: -(0.03 + Math.random() * 0.09),
        sway: 0.15 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
      }));
    }

    function draw(t: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      // Dust motes — drift up, gentle sway
      ctx.filter = "none";
      for (const d of dust) {
        if (!reduced) {
          d.y += d.vy;
          d.x += Math.sin(d.phase + t / 4000) * d.sway * 0.15;
          if (d.y < -4) {
            d.y = h + 4;
            d.x = Math.random() * w;
          }
        }
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${d.alpha})`;
        ctx.fill();
      }

      if (!reduced) {
        // Ghost guitar flash — every 12–30s
        if (t > nextFlash && flashes.length === 0) {
          flashes.push(makeFlash(w, h, t));
          nextFlash = t + 12000 + Math.random() * 18000;
        }
        flashes = flashes.filter((f) => t - f.start < f.duration + 260);
        for (const f of flashes) {
          const p = Math.min(1, (t - f.start) / f.duration);
          const fraction = EASE(p);
          // Envelope: instant on, hold, fast fade after complete
          const post = Math.max(0, t - f.start - f.duration) / 260;
          const alpha = f.peak * (1 - post);
          ctx.filter = "blur(1.5px)";
          drawPartialLine(ctx, f.points, fraction, alpha, 1.3);
          for (const line of f.extraLines) {
            drawPartialLine(ctx, line, fraction, alpha * 0.5, 0.8);
          }
          ctx.filter = "none";
        }
      }

      if (!reduced) raf = requestAnimationFrame(draw);
    }

    // A click invites a flash near the cursor — same restraint
    function onClick(e: MouseEvent) {
      if (reduced || flashes.length > 1) return;
      flashes.push(
        makeFlash(w, h, performance.now(), { x: e.clientX, y: e.clientY }),
      );
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("click", onClick);

    if (reduced) {
      draw(0);
    } else {
      raf = requestAnimationFrame(draw);
    }

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else if (!reduced) {
        raf = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", onClick);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      {/* Slow gradient wash */}
      <div className="ambient-wash absolute inset-[-20%]" />
      {/* Light leak */}
      <div className="ambient-leak absolute inset-[-30%]" />
      {/* Breathing vignette */}
      <div className="ambient-vignette absolute inset-0" />
      {/* Dust + ghost guitar flashes */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
