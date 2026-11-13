# GuitarPorn — Setup & Operations Guide

## Run locally

```bash
npm run dev        # → http://localhost:3000
```

Everything works without any keys except: member guitar uploads (needs
Supabase) and live shop products (needs Shopify). Until then the Gear DB
shows an empty club state (no sample guitars), and the shop shows an
upcoming-drop preview plus a waitlist.

---

## What `.env` files are

The site needs a few secrets and settings (database keys, store URLs). Those
never go into the code — they live in a file called `.env.local` in the repo
root, which git ignores so keys never end up on GitHub.

`.env.example` is the **template**: it lists every variable the site
understands, with instructions, but no real values. Your one-time job:

```bash
cp .env.example .env.local
```

...then open `.env.local` in any text editor and paste real values as you
get them (from Supabase and Shopify, below). Restart `npm run dev` after
changing it. When you deploy, you enter these same variables in the hosting
dashboard instead.

---

## Supabase — member accounts + guitar uploads (once, ~15 min)

1. Go to [supabase.com](https://supabase.com) → Start your project → sign up
   (GitHub login is easiest). Create a **New project**, name it `guitarporn`,
   pick the EU region closest to you, set a strong database password
   (save it, but you won't need it day-to-day). Free tier is fine.
2. Wait ~2 min while it provisions.
3. Left sidebar → **SQL Editor** → **New query** → open `supabase/schema.sql`
   from this repo, copy ALL of it, paste, hit **Run**. This creates:
   the `guitars` table (brand/model/color/year/photo per entry), security
   rules (anyone can browse, only signed-in members can add, only to their
   own account), and the photo storage bucket with a 5 MB per-image cap.
4. Left sidebar → **Project Settings → API**. Copy two values into
   `.env.local`:
   - *Project URL* → `NEXT_PUBLIC_SUPABASE_URL`
   - *anon public* key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Restart `npm run dev`. Go to `/gear/submit` — you can now create an
   account and upload a guitar. It appears in the Gear DB under its brand,
   on its own page at `/gear/[id]`.

The Gear DB does not show sample guitars. With no rows (or no Supabase
keys) `/gear` says the club floor is empty and asks for the first rig.

**Brand list:** `types/gear.ts` and the `guitars_brand_check` constraint in
`supabase/schema.sql` list the same names. On `/gear` the first group is
Most famous (Gibson, Fender, PRS, Ibanez, Custom Made, Boutique), then
major brands, iconic boutique, and Miscellaneous. If the project was created from an
older schema, re-run `supabase/schema.sql` in the SQL Editor before members
submit a brand that was not in the original eight. The script drops the old
brand check and recreates it. Existing rows stay valid.

How images work: when a member submits, the photo is checked (JPG/PNG/WebP,
max 5 MB), automatically downscaled in their browser to max 1600px, and
stored in Supabase Storage under their user ID. The Gear DB reads photos
straight from there. Nothing for you to manage.

What members can do: register with a public display name, sign in, upload
guitars, and — on the same page — edit any entry (including replacing the
photo) or delete it. Every gallery card shows "Added by {name}". Forgot
password is built in (`/account/reset`).

**Before going live:** Supabase dashboard → **Authentication → URL
Configuration** → set Site URL to `https://guitarporn.club` (so confirmation
emails link to the real site).

### Auth checklist (done once — recorded for reference)

- **Redirect URLs** (Authentication → URL Configuration → Redirect URLs):
  `http://localhost:3000/**`, `https://guitarporn.club/**`, and your
  `https://*.vercel.app/**` address. Password-reset links only redirect to
  addresses on this list.
- **Custom email sender — Resend** (done): Supabase's built-in mailer caps at
  ~2–4 emails/hour. Resend (free, 3,000/mo) is wired in at **Project
  Settings → Authentication → SMTP Settings** — host `smtp.resend.com`,
  port 465, user `resend`, password = Resend API key, sender
  `noreply@guitarporn.club`.
- **Confirm email** (Authentication → Sign In / Providers → Email): keep ON
  in production; toggle OFF only for rapid local testing.

### Moderating member content (you, as owner)

A guitar entry lives in two places in the Supabase dashboard:

1. **Table Editor → guitars** — the entry. Deleting the row removes it from
   the site immediately.
2. **Storage → guitars → {member-id}/** — the photo file. Delete it after
   the row so the image stops being reachable.

Repeat offender: **Authentication → Users → ⋯ → Delete user** — removes all
their entries automatically (their storage folder needs manual cleanup).

---

## Shopify — the store (~30 min, needs a paid plan when you launch)

I can't create the account for you (it needs your email, payment method, and
business details), but it's simple:

1. [shopify.com](https://www.shopify.com) → Start free trial → follow the
   wizard. Pick the **Basic** plan when the trial ends (~€36/mo... only pay
   once you're ready to sell).
2. Add your first products (Products → Add product): photo, price, and
   assign each to a **Collection** named `Men`, `Women`, `Accessories`, or
   `Gear` — matching the site's categories.
3. Get the two values the site needs, in `.env.local`:
   - `NEXT_PUBLIC_SHOPIFY_STORE_URL` — your storefront address (e.g.
     `https://your-store.myshopify.com` or a custom domain like
     `shop.guitarporn.club`). This activates the "Enter store" banner.
   - Product feed (powers the homepage "From the shop" — 5 random products,
     reshuffled hourly): Shopify admin → **Settings → Apps and sales
     channels → Develop apps → Create an app** (name it `guitarporn-site`) →
     **Configure Storefront API scopes** → tick
     `unauthenticated_read_product_listings` → Save → **API credentials** →
     copy the *Storefront API access token*. Then set
     `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` (e.g. `your-store.myshopify.com`)
     and `SHOPIFY_STOREFRONT_TOKEN`.

The shop page reads that token itself. When both Storefront values are set
and the API answers, `/shop` lists those products with their real prices and
links. Until then the cards are an upcoming-drop preview: no prices, and no
Limited or Exclusive badges. Members can join a waitlist on the page.

`RESEND_API_KEY` is optional and server-only (do not prefix it with
`NEXT_PUBLIC_`). When it is set, the waitlist emails `contact@guitarporn.club`
through Resend from `noreply@guitarporn.club`. When it is missing, or Resend
rejects the send, the form does not crash: it hands the member a mailto link
to that same address. This key is separate from the Resend SMTP password
already stored in Supabase. There is no waitlist table.

---

## Hero photos (monthly, 2 min)

Drop images in `public/hero/` (landscape, ~2400px wide, compressed under
1 MB — [squoosh.app](https://squoosh.app)). Number prefixes control order:
`01-x.jpg`, `02-y.jpg`. Delete old ones, commit, push.

## Videos

New uploads on the GuitarPorn YouTube channel appear on `/videos`
automatically. The page refreshes at most once an hour and tries, in order:

1. YouTube Data API v3, only if `YOUTUBE_API_KEY` is set (up to 50 uploads).
2. The channel RSS feed.
3. The public channel `/videos` page (`ytInitialData`).
4. One curated fallback video if every live source fails.

`YOUTUBE_CHANNEL_URL` is not an environment variable. The footer and the
videos page use the `YOUTUBE_CHANNEL_URL` constant in `lib/youtube.ts`
(`https://www.youtube.com/@guitarporn-club`, channel id
`UC5vYif_qR8a-u_4ROY84yrw`).

The API key is optional. Without it, RSS and the channel page still update
`/videos`. To add it: Google Cloud → enable YouTube Data API v3 → create an
API key → set `YOUTUBE_API_KEY` in `.env.local` and in the hosting
dashboard, then redeploy.

---

## Sharing, search, and page views

Canonical URLs and share cards use `https://guitarporn.club` (`metadataBase`
in code). `NEXT_PUBLIC_SITE_URL` is not read.

`/robots.txt` and `/sitemap.xml` are generated by the app. The sitemap lists
the main pages and, when Supabase has rows, each `/gear/[id]`. Sharing a
gear page uses that guitar's photo, brand, model, and member name in the
Open Graph and Twitter card. Other pages use the dark GuitarPorn card at
`/opengraph-image`.

Page views on the Vercel deployment use `@vercel/analytics` (no cookie).
Turn on **Web Analytics** in the Vercel project settings; there is no env
var. The script is included only when `VERCEL=1` (set by Vercel at build).
Query strings are stripped before a view is sent, and `/account` is not
sent. A local `next start` does not load the script.

---

## Going live: GitHub → production

**1. Push to GitHub** (from the project folder):

```bash
git checkout -b redesign-2026-07
git add -A
git commit -m "Hero carousel, YouTube feed, Gear DB with Supabase, shop redesign"
git push -u origin redesign-2026-07
```

Open the link GitHub prints to create a Pull Request, review, and merge to
`main`. (Or push straight to `main` if you're solo: `git checkout main`,
`git merge redesign-2026-07`, `git push`.)

**2. Host on Vercel** (made by the Next.js team — free Hobby tier is enough
to start):

1. [vercel.com](https://vercel.com) → sign up with GitHub → **Add New →
   Project** → import the guitarporn repo → Deploy. Two minutes later you
   have a live URL like `guitarporn.vercel.app`.
2. Project → **Settings → Environment Variables** → add every variable from
   your `.env.local`. Redeploy.
3. Project → **Settings → Domains** → add `guitarporn.club` → Vercel shows
   you two DNS records → add them wherever your domain is registered.
   Within an hour, guitarporn.club serves the new site with HTTPS.

From then on: every push to `main` deploys automatically.
