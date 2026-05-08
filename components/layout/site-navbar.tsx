"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { GuitarPornText } from "@/components/brand/guitar-porn-text";
import { Container } from "@/components/layout/container";

const links = [
  { href: "/", label: "Home" },
  { href: "/videos", label: "Videos" },
  { href: "/gear", label: "Gear" },
  { href: "/shop", label: "Shop" },
] as const;

function navClass(active: boolean) {
  return active
    ? "text-white"
    : "text-zinc-400 hover:text-white transition-colors";
}

export function SiteNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
        >
          <GuitarPornText />
        </Link>

        <nav
          className="hidden items-center gap-8 text-sm font-medium md:flex"
          aria-label="Main"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={navClass(
                l.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(l.href),
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg border border-white/15 p-2 text-zinc-200 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Toggle menu</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </Container>

      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-white/10 bg-zinc-950 md:hidden"
        >
          <Container className="flex flex-col gap-1 py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${navClass(
                  l.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(l.href),
                )}`}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
          </Container>
        </div>
      ) : null}
    </header>
  );
}
