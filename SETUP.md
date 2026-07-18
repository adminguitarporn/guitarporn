# GuitarPorn — Setup & Operations Guide

## Run locally

```bash
npm run dev        # → http://localhost:3000
```

Everything works without any keys except: member guitar uploads (needs
Supabase) and live shop products (needs Shopify). Both show graceful
placeholders until connected.

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
   account and upload a guitar. It appears in the Gear DB under its brand.

How images work: when a member submits, the photo is checked (JPG/PNG/WebP,
max 5 MB), automatically downscaled in their browser to max 1600px, and
stored in Supabase Storage under their user ID. The Gear DB reads photos
straight from there. Nothing for you to manage.

**Before going live:** Supabase dashboard → **Authentication → URL
Configuration** → set Site URL to `https://guitarporn.club` (so confirmation
emails link to the real site).

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

The Shop page's product cards are previews right now; once the Storefront
token is set we can switch them to live products in one small change.

---

## Hero photos (monthly, 2 min)

Drop images in `public/hero/` (landscape, ~2400px wide, compressed under
1 MB — [squoosh.app](https://squoosh.app)). Number prefixes control order:
`01-x.jpg`, `02-y.jpg`. Delete old ones, commit, push.

## Videos (nothing to do)

New YouTube uploads appear on `/videos` within the hour automatically.

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
