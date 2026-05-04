import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-crimson text-white hover:brightness-110 focus-visible:ring-crimson/50",
  secondary:
    "border border-white/15 bg-white/5 text-zinc-50 hover:bg-white/10 focus-visible:ring-white/20",
  ghost:
    "text-zinc-300 hover:text-white hover:bg-white/5 focus-visible:ring-white/15",
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
