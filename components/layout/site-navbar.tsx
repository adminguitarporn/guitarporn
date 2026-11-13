"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { GuitarPornText } from "@/components/brand/guitar-porn-text";
import { Container } from "@/components/layout/container";
import { memberDisplayName } from "@/lib/member-name";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

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

function AccountControls({
  user,
  pathname,
  onNavigate,
  onSignOut,
  mobile = false,
}: {
  user: User | null;
  pathname: string;
  onNavigate?: () => void;
  onSignOut: () => void;
  mobile?: boolean;
}) {
  const itemClass = mobile ? "rounded-lg px-3 py-2 text-left" : "";

  if (user) {
    const name = memberDisplayName(user);
    return (
      <>
        <span
          className={`max-w-[12rem] truncate text-sm font-medium text-zinc-300 ${
            mobile ? "px-3 py-2" : ""
          }`}
          title={name}
        >
          <span className="sr-only">Signed in as </span>
          {name}
        </span>
        <button
          type="button"
          onClick={onSignOut}
          className={`text-sm font-medium ${itemClass} ${navClass(false)}`}
        >
          Sign out
        </button>
      </>
    );
  }

  return (
    <Link
      href="/gear/submit"
      className={`text-sm font-medium ${itemClass} ${navClass(
        pathname.startsWith("/gear/submit"),
      )}`}
      onClick={onNavigate}
    >
      Sign in
    </Link>
  );
}

export function SiteNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(() => supabase === null);

  useEffect(() => {
    if (!supabase) return;

    let active = true;
    supabase.auth.getUser().then(
      ({ data }) => {
        if (!active) return;
        setUser(data.user ?? null);
        setAuthReady(true);
      },
      () => {
        if (active) setAuthReady(true);
      },
    );

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthReady(true);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  function signOut() {
    void supabase?.auth.signOut().then(() => {
      setUser(null);
      setOpen(false);
    });
  }

  function closeMenu() {
    setOpen(false);
  }

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
          {authReady ? (
            <>
              <span className="h-4 w-px bg-white/15" aria-hidden />
              <AccountControls
                user={user}
                pathname={pathname}
                onSignOut={signOut}
              />
            </>
          ) : null}
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
                onClick={closeMenu}
              >
                {l.label}
              </Link>
            ))}
            {authReady ? (
              <div className="mt-2 flex flex-col gap-1 border-t border-white/10 pt-2">
                <AccountControls
                  user={user}
                  pathname={pathname}
                  onNavigate={closeMenu}
                  onSignOut={signOut}
                  mobile
                />
              </div>
            ) : null}
          </Container>
        </div>
      ) : null}
    </header>
  );
}
