"use client";

import { useEffect, useRef } from "react";

/**
 * Minimal custom cursor — a small white dot, desktop only, slightly
 * magnetic around interactive elements. Disabled on touch devices and
 * for prefers-reduced-motion; native cursor is hidden only while the
 * dot is active (body.has-cursor-dot).
 */
export function CursorDot() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!fine || reduced) return;

    const dot = dotRef.current;
    if (!dot) return;

    document.body.classList.add("has-cursor-dot");
    let mx = -100;
    let my = -100;
    let x = -100;
    let y = -100;
    let target: HTMLElement | null = null;
    let raf = 0;

    function onMove(e: MouseEvent) {
      mx = e.clientX;
      my = e.clientY;
      const el = (e.target as HTMLElement | null)?.closest?.(
        "a, button, [role='button'], input, select, textarea, label",
      );
      target = (el as HTMLElement) ?? null;
    }

    function onLeave() {
      mx = -100;
      my = -100;
    }

    function tick() {
      let tx = mx;
      let ty = my;
      let size = 6;
      if (target) {
        const r = target.getBoundingClientRect();
        // Gentle magnetism: drift 22% toward the element's center
        tx = mx + (r.left + r.width / 2 - mx) * 0.22;
        ty = my + (r.top + r.height / 2 - my) * 0.22;
        size = 12;
      }
      // Smooth follow
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      if (dot) {
        dot.style.transform = `translate3d(${x - size / 2}px, ${y - size / 2}px, 0)`;
        dot.style.width = `${size}px`;
        dot.style.height = `${size}px`;
        dot.style.opacity = target ? "0.55" : "0.85";
      }
      raf = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      document.body.classList.remove("has-cursor-dot");
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full bg-white mix-blend-difference transition-[width,height,opacity] duration-150"
      style={{ width: 6, height: 6, opacity: 0 }}
    />
  );
}
