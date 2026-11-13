# Changelog

## 2026-11-13 — Phase 2 (`cursor/phase-2-gear-shop-seo-563a`)

Pull request against `main` at `9a205c723409d5ca9e724baefa1fd19d6638a9d7`
(includes Phase 1). Home and effect visuals (`components/fx/*`,
`components/home/*`) are unchanged. No `/vision` route was added.

The Gear DB no longer pretends the six sample photos are member rigs. The
shop no longer shows invented prices or Limited / Exclusive badges. Share
cards, `robots.txt`, `sitemap.xml`, and cookieless Vercel page views are in
place.

### Created

- `app/gear/[id]/page.tsx` — Shareable page for one member guitar: photo,
  brand, model, color, year, and who added it. Unknown ids call `notFound()`
  (HTTP 404). `dynamicParams` stays on so a guitar added after deploy still
  gets a page. Revalidates every 60 seconds, same as `/gear`.
- `app/gear/[id]/opengraph-image.tsx` and `app/gear/[id]/twitter-image.tsx` —
  1200×630 dark card with the guitar photo (only from a public Supabase
  Storage URL or `guitarporn.club`), brand, model, color, year, and member
  name. A bad id 404s. The photo fetch does not follow redirects.
- `app/opengraph-image.tsx` and `app/twitter-image.tsx` — Default club card
  (zinc-950, Geist, “GuitarPorn”, guitarporn.club) for pages that are not a
  single guitar.
- `app/robots.ts` — `/robots.txt`. Allows `/`, disallows `/account/` and
  `/api/`, points at the sitemap.
- `app/sitemap.ts` — `/sitemap.xml` for `/`, `/gear`, `/videos`, `/shop`,
  `/gear/submit`, `/privacy`, `/terms`, plus each real `/gear/[id]` when
  Supabase returns rows. Revalidates hourly.
- `app/not-found.tsx` — Dark 404 in the same layout, used for a missing
  guitar as well as any other unknown path.
- `app/api/shop/waitlist/route.ts` — POST `{ email }`. With `RESEND_API_KEY`,
  notifies `contact@guitarporn.club` via Resend from
  `noreply@guitarporn.club`. Without that key, or if Resend rejects the
  send, returns a mailto link. No database write, so missing Supabase or
  Resend env vars do not crash the route.
- `components/gear/share-link.tsx` — Copy link, and the device share sheet
  when the browser has one.
- `components/shop/waitlist-form.tsx` — Waitlist field on `/shop` while the
  store is not live. Handles the mailto fallback.
- `components/analytics/club-analytics.tsx` — `@vercel/analytics`. Strips
  query strings and drops `/account` before a page view is sent.
- `lib/seo.ts` — `https://guitarporn.club` as `metadataBase`, plus Open
  Graph and Twitter helpers. Child routes set the club image themselves;
  the root image file does not inherit onto them.
- `lib/og-image.tsx` — Shared ImageResponse layout for the club card and
  the per-guitar card.

### Modified

- `lib/repositories/gear.ts` — Supabase is the only source. No mock fallback.
  An empty list, a missing client, or a failed query returns `[]`. Adds
  `getGearById` (UUID only).
- `types/gear.ts` — Brand list expanded and grouped: major brands, iconic
  boutique, and Other (Boutique, Custom Made, Miscellaneous). The original
  eight names are still in the list.
- `supabase/schema.sql` — Recreates `guitars_brand_check` to match
  `GEAR_BRANDS`. Safe to re-run. Existing rows stay valid.
- `components/gear/gear-gallery.tsx` — Empty club state when there are no
  submissions. Brand grid uses the grouped list. Each real guitar links to
  `/gear/[id]`.
- `components/gear/submit-form.tsx` and `components/gear/my-guitars.tsx` —
  Brand `<select>` uses the same groups as the gallery.
- `lib/shopify.ts` — `getShopCatalog()` returns `unconfigured`,
  `unavailable`, or `ready` (including an empty product list). Homepage
  `getFeaturedProducts()` still returns five real products or null.
- `components/shop/shop-page.tsx` and `app/shop/page.tsx` — Live Shopify
  products keep real prices and outbound links. Otherwise the lookbook has
  no prices and no Limited or Exclusive badges, and the waitlist is shown.
  The existing shop headline stays.
- `app/layout.tsx` — `metadataBase` is `https://guitarporn.club` (no
  `NEXT_PUBLIC_SITE_URL`). Analytics mounts only when `VERCEL=1`.
- `app/page.tsx`, `app/videos/page.tsx`, `app/gear/page.tsx`,
  `app/gear/submit/page.tsx`, `app/privacy/page.tsx`, `app/terms/page.tsx` —
  Canonical URL, Open Graph, and Twitter card per route.
- `app/account/reset/page.tsx` — `noindex`. Password-reset URLs are also
  disallowed in `robots.txt` and omitted from analytics.
- `app/privacy/page.tsx` and `app/terms/page.tsx` — Privacy now describes
  the shop waitlist and cookieless Vercel page views (daily request hash,
  discarded after 24 hours, no analytics cookie). Terms point at that.
- `lib/supabase/config.ts` — Comment no longer says the gallery renders
  samples.
- `package.json` / `package-lock.json` — Adds `@vercel/analytics`.
- `SETUP.md` — Brand-constraint re-run, shop waitlist, optional
  `RESEND_API_KEY`, and Web Analytics.

### Removed

- `lib/repositories/mock-gear.ts` — The six fake member guitars.
- `public/gear-samples/*.jpg` — Photos that existed only for that mock list.
  They are not shown as a studio archive.

### Environment and deploy

- Re-run `supabase/schema.sql` in the Supabase SQL Editor after deploy if
  the project already exists, so new brand names pass `guitars_brand_check`.
- `RESEND_API_KEY` (optional, server-only). Waitlist delivery. Without it,
  the form offers a mailto to `contact@guitarporn.club`. Not the same value
  as the Resend SMTP password in Supabase, though it can be a Resend API
  key from the same account. Sender must be allowed to use
  `noreply@guitarporn.club`.
- Shopify variables are unchanged. When
  `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_TOKEN` are both
  set and the Storefront API answers, `/shop` shows those products. The
  public store link is still `NEXT_PUBLIC_SHOPIFY_STORE_URL`.
- Vercel → project → Analytics → enable Web Analytics. No new env var. The
  package is inert unless the build sees `VERCEL=1`.
- `NEXT_PUBLIC_SITE_URL` is unused. Share URLs are always
  `https://guitarporn.club`.

### Verification

`npm run lint` and `npm run build` succeeded. `next start` on port 3456:

| Path | Result |
| --- | --- |
| `/`, `/videos`, `/gear`, `/shop`, `/privacy`, `/terms`, `/robots.txt`, `/sitemap.xml`, `/opengraph-image`, `/twitter-image` | HTTP 200 |
| `/gear/not-a-real-id` and a nil UUID | HTTP 404, no server error |
| `/gear/{uuid}/opengraph-image` for an unknown id | HTTP 404 |
| `POST /api/shop/waitlist` with a valid email and no Resend key | HTTP 200, `delivered: false`, mailto link |
| Invalid waitlist email | HTTP 400 |

HTML on `/`, `/videos`, `/gear`, `/shop`, `/privacy`, and `/terms` includes
`og:title`, `og:description`, `og:image`, `og:url`, `twitter:card`, and
`twitter:image`. `/gear` renders “No member rigs yet.” and does not contain
the old sample names. `/shop` has no `€` prices and no Limited or Exclusive
badges. The server log stayed quiet. There is no live member guitar in this
environment, so a populated `/gear/[id]` page was not returned as HTTP 200;
unknown ids 404 as specified.

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
