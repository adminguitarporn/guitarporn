"use client";

import { useEffect, useRef } from "react";

/**
 * Night-sky backdrop — black, white, and electric blue.
 *
 * Tiny twinkling stars, occasional blue-tailed comets, and rare lightning
 * bolts that crack down the sky. Clicking anywhere summons a bolt at the
 * cursor. Honors prefers-reduced-motion (static stars only).
 */

type Star = {
  x: number;
  y: number;
  r: number;
  base: number;
  phase: number;
  speed: number;
  bright: boolean;
};

type Comet = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
};

type Bolt = {
  points: { x: number; y: number }[];
  branches: { x: number; y: number }[][];
  life: number;
  maxLife: number;
};

const BLUE = "59, 130, 246";
const BLUE_BRIGHT = "147, 197, 253";

/** Jagged path from (x0,y0) to (x1,y1) via midpoint displacement. */
function makeBoltPath(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  jitter: number,
): { x: number; y: number }[] {
  let points = [
    { x: x0, y: y0 },
    { x: x1, y: y1 },
  ];
  for (let iter = 0; iter < 5; iter++) {
    const next: { x: number; y: number }[] = [];
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i];
      const b = points[i + 1];
      const mx = (a.x + b.x) / 2 + (Math.random() - 0.5) * jitter;
      const my = (a.y + b.y) / 2 + (Math.random() - 0.5) * jitter * 0.5;
      next.push(a, { x: mx, y: my });
    }
    next.push(points[points.length - 1]);
    points = next;
    jitter *= 0.55;
  }
  return points;
}

function makeBolt(targetX: number, targetY: number): Bolt {
  const startX = targetX + (Math.random() - 0.5) * 160;
  const points = makeBoltPath(startX, -20, targetX, targetY, 120);
  // 1–2 side branches off random points of the main bolt
  const branches: { x: number; y: number }[][] = [];
  const branchCount = 1 + Math.floor(Math.random() * 2);
  for (let b = 0; b < branchCount; b++) {
    const from = points[8 + Math.floor(Math.random() * (points.length - 16))];
    const bx = from.x + (Math.random() - 0.5) * 180;
    const by = from.y + 60 + Math.random() * 120;
    branches.push(makeBoltPath(from.x, from.y, bx, by, 60));
  }
  return { points, branches, life: 0, maxLife: 22 };
}

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let stars: Star[] = [];
    let comets: Comet[] = [];
    let bolts: Bolt[] = [];
    let raf = 0;
    let nextComet = performance.now() + 3000 + Math.random() * 4000;
    let nextBolt = performance.now() + 9000 + Math.random() * 9000;
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

      const count = Math.min(160, Math.round((w * h) / 14000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.1 + 0.3,
        base: Math.random() * 0.35 + 0.12,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.9 + 0.35,
        bright: Math.random() < 0.08,
      }));
    }

    function spawnComet() {
      const fromLeft = Math.random() < 0.5;
      const speed = 6 + Math.random() * 5;
      const angle = (fromLeft ? 1 : Math.PI - 1) + (Math.random() - 0.5) * 0.35;
      comets.push({
        x: fromLeft ? -40 : w + 40,
        y: Math.random() * h * 0.45,
        vx: Math.cos(angle) * speed,
        vy: Math.abs(Math.sin(angle)) * speed * 0.45 + 1.2,
        life: 0,
        maxLife: 90 + Math.random() * 50,
      });
    }

    function strokeBolt(
      pts: { x: number; y: number }[],
      alpha: number,
      width: number,
    ) {
      if (!ctx || pts.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      // Outer glow
      ctx.strokeStyle = `rgba(${BLUE}, ${alpha * 0.35})`;
      ctx.lineWidth = width * 4;
      ctx.stroke();
      // Mid glow
      ctx.strokeStyle = `rgba(${BLUE_BRIGHT}, ${alpha * 0.6})`;
      ctx.lineWidth = width * 1.8;
      ctx.stroke();
      // White core
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.lineWidth = width * 0.7;
      ctx.stroke();
    }

    function draw(t: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      // Stars
      for (const s of stars) {
        const tw = reduced
          ? 1
          : 0.55 + 0.45 * Math.sin(s.phase + (t / 1000) * s.speed);
        const alpha = s.base * tw;
        if (s.bright) {
          const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 7);
          g.addColorStop(0, `rgba(255,255,255,${alpha})`);
          g.addColorStop(0.4, `rgba(${BLUE}, ${alpha * 0.3})`);
          g.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = g;
          ctx.fillRect(s.x - s.r * 7, s.y - s.r * 7, s.r * 14, s.r * 14);
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      }

      if (!reduced) {
        // Comets
        if (t > nextComet && comets.length < 2) {
          spawnComet();
          nextComet = t + 5000 + Math.random() * 7000;
        }
        comets = comets.filter((c) => c.life < c.maxLife);
        for (const c of comets) {
          c.x += c.vx;
          c.y += c.vy;
          c.life++;
          const fade =
            c.life < 15
              ? c.life / 15
              : c.life > c.maxLife - 25
                ? (c.maxLife - c.life) / 25
                : 1;
          const tailX = c.x - c.vx * 9;
          const tailY = c.y - c.vy * 9;
          const grad = ctx.createLinearGradient(c.x, c.y, tailX, tailY);
          grad.addColorStop(0, `rgba(255,255,255,${0.85 * fade})`);
          grad.addColorStop(0.35, `rgba(${BLUE}, ${0.4 * fade})`);
          grad.addColorStop(1, "rgba(0,0,0,0)");
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.4;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(c.x, c.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();
          const hg = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, 6);
          hg.addColorStop(0, `rgba(255,255,255,${0.9 * fade})`);
          hg.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = hg;
          ctx.fillRect(c.x - 6, c.y - 6, 12, 12);
        }

        // Ambient lightning — a bolt cracks somewhere every ~9–18s
        if (t > nextBolt && bolts.length === 0) {
          bolts.push(
            makeBolt(Math.random() * w, h * 0.3 + Math.random() * h * 0.5),
          );
          nextBolt = t + 9000 + Math.random() * 9000;
        }
        bolts = bolts.filter((b) => b.life < b.maxLife);
        for (const b of bolts) {
          b.life++;
          // Sharp attack, quick flickery decay
          const p = b.life / b.maxLife;
          const flicker = p < 0.15 ? 1 : Math.random() * 0.5 + 0.2;
          const alpha = (1 - p) * flicker;
          strokeBolt(b.points, alpha, 1.6);
          for (const br of b.branches) strokeBolt(br, alpha * 0.6, 1);
          // Sky flash at strike start
          if (b.life < 4) {
            ctx.fillStyle = `rgba(${BLUE}, ${0.05 * (4 - b.life)})`;
            ctx.fillRect(0, 0, w, h);
          }
        }
      }

      if (!reduced) raf = requestAnimationFrame(draw);
    }

    // Click anywhere → lightning strikes the cursor
    function onClick(e: MouseEvent) {
      if (reduced) return;
      if (bolts.length < 3) bolts.push(makeBolt(e.clientX, e.clientY));
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
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden
    />
  );
}
