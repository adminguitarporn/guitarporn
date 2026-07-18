import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost";

const INTERACTION =
  "transition-all duration-[250ms] ease-[cubic-bezier(.22,.61,.36,1)] hover:-translate-y-px hover:brightness-110 active:translate-y-[1px] active:brightness-95 active:duration-[120ms] motion-reduce:transform-none";

const variants: Record<Variant, string> = {
  primary: `border border-white/15 bg-white/10 text-white font-bold hover:bg-white/15 hover:border-white/30 hover:shadow-[0_0_22px_rgba(147,197,253,0.14)] focus-visible:ring-white/20 ${INTERACTION}`,
  secondary: `border border-white/15 bg-white/5 text-zinc-50 hover:bg-white/10 hover:border-white/25 hover:shadow-[0_0_16px_rgba(147,197,253,0.1)] focus-visible:ring-white/20 ${INTERACTION}`,
  ghost: `text-zinc-300 hover:text-white hover:bg-white/5 focus-visible:ring-white/15 ${INTERACTION}`,
};

type ButtonProps = ComponentProps<"button"> & {
  variant?: Variant;
  className?: string;
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium tracking-wide transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: Variant;
  className?: string;
};

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium tracking-wide transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
