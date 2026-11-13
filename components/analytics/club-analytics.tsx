"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";
import { SITE_URL } from "@/lib/seo";

/**
 * Cookieless Vercel Web Analytics.
 * Query strings are stripped, and /account (password reset) is never sent.
 */
function redact(event: BeforeSendEvent): BeforeSendEvent | null {
  try {
    const absolute = /^https?:\/\//i.test(event.url);
    const url = new URL(event.url, SITE_URL);
    if (url.pathname.startsWith("/account")) return null;
    url.search = "";
    url.hash = "";
    return { ...event, url: absolute ? url.toString() : url.pathname };
  } catch {
    return null;
  }
}

export function ClubAnalytics() {
  return <Analytics beforeSend={redact} />;
}
