"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms — use 0/150/250/450 for sibling reveals. */
  delay?: number;
};

export function ScrollReveal({ children, className = "", delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            obs.disconnect();
            break;
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(.22,.61,.36,1)",
      }}
      className={`transition-[opacity,transform,filter] duration-[800ms] will-change-transform motion-reduce:transition-none ${
        visible
          ? "opacity-100 translate-y-0 blur-0"
          : "opacity-0 translate-y-3 blur-[6px] motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:blur-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

