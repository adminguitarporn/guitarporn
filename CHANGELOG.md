# Changelog

## 2026-11-13 — Phase 1 (`cursor/phase-1-legal-youtube-headers-1e2b`)

Pull request against `main` at `230da96a84d3f339a7df9ce7d84f5ef72f4417f5`.
Home and effect visuals (`components/fx/*`, `components/home/*`) are unchanged.
No `/vision` route was added.

### Created

- `CHANGELOG.md` — Starts a strict record of what changed, why, and which
  environment variables a deploy needs.
- `app/privacy/page.tsx` — Privacy policy in the existing dark layout
  (zinc page, tracking eyebrow, Geist headings). Covers GuitarPorn Club as
  operator from Spain/EU, Supabase Auth `email` and `display_name`, Resend
  mail from `noreply@guitarporn.club`, member ownership of uploaded guitar
  photos plus a display license, self-delete or 30-day removal via
  `contact@guitarporn.club`, GDPR rights, and essential session cookies.
  No corporate registration number or personal legal name is stated.
- `app/terms/page.tsx` — Terms of use in the same layout, covering the same
  account, photo-license, takedown, email, and cookie points, plus acceptable
  use and Spanish law with EU consumer protections left in place.
- `lib/member-name.ts` — Single helper for the public member name
  (`display_name`, then the email local-part, then `member`) so the navbar
  and the gear form show the same name.
- `lib/youtube-id.ts` — `isYoutubeId` check (11-character YouTube id) shared
  by the server feed and the embed. Kept in its own module so the client
  player does not import code that reads `YOUTUBE_API_KEY`.

### Modified

- `components/layout/site-footer.tsx` — Adds Privacy (`/privacy`), Terms
  (`/terms`), `mailto:contact@guitarporn.club`, Instagram
  (`https://www.instagram.com/guitarporn/`), and YouTube. The YouTube href
  is the existing `YOUTUBE_CHANNEL_URL` export from `lib/youtube.ts`. The
  copyright line and “Loud & clear.” tagline stay.
- `components/layout/site-navbar.tsx` — Desktop and mobile menus show
  Sign in (links to `/gear/submit` for now) or, when a Supabase session
  exists, the member display name from `lib/member-name.ts` and Sign out.
- `components/gear/submit-form.tsx` — Uses `memberDisplayName` instead of a
  private copy of the same rule, so the form and the navbar cannot drift.
- `components/gear/gear-gallery.tsx` — Community-terms copy now matches the
  terms page: the member keeps the photo, grants a display license, and can
  self-delete or request removal within 30 days. Layout and styles are
  unchanged.
- `lib/youtube.ts` — Live channel fetch in three steps: YouTube Data API v3
  `playlistItems` when `YOUTUBE_API_KEY` is set (uploads playlist
  `UU5vYif_qR8a-u_4ROY84yrw`), then the channel RSS feed, then a server-side
  parse of `ytInitialData` on the channel `/videos` page (legacy
  `videoRenderer` / `gridVideoRenderer` and current `lockupViewModel`).
  Every id passes `isYoutubeId`. `YOUTUBE_CHANNEL_URL` is unchanged.
- `lib/repositories/videos.ts` — `/videos` uses that live list again.
  `mockVideos` is only the last resort when every live source returns
  nothing, and mock ids are still filtered with `isYoutubeId`.
- `components/videos/youtube-embed.tsx` — Refuses to build an embed URL
  unless `isYoutubeId` accepts the id.
- `next.config.ts` — Adds `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, and
  `X-Frame-Options: SAMEORIGIN` on `/` and `/:path*`. Existing
  `images.remotePatterns` (Unsplash, YouTube thumbnails, Supabase Storage,
  Shopify CDN) are unchanged.
- `SETUP.md` — Documents the optional `YOUTUBE_API_KEY` and states that
  `YOUTUBE_CHANNEL_URL` is a code constant, not an environment variable.

### Environment and deploy

- `YOUTUBE_API_KEY` (optional). Server-only. YouTube Data API v3 key. When
  it is set, `/videos` prefers the uploads playlist (up to 50 items) and
  still falls through to RSS, then the channel page, then the curated mock
  if that call fails. Set it in the host’s environment (Vercel project
  settings, or `.env.local` for local runs) and redeploy. Do not prefix it
  with `NEXT_PUBLIC_`.
- `YOUTUBE_CHANNEL_URL` is **not** an environment variable. It is exported
  from `lib/youtube.ts` as `https://www.youtube.com/@guitarporn-club` for
  channel id `UC5vYif_qR8a-u_4ROY84yrw`. The footer and `/videos` both
  import that constant. Changing the channel means editing the constant
  (and the matching channel id) in that file.
- No new Supabase or Resend variables. Accounts still use
  `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
  Transactional mail remains Resend from `noreply@guitarporn.club`,
  configured in the Supabase SMTP settings described in `SETUP.md`.
