import Link from "next/link";
import { Container } from "@/components/layout/container";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Privacy",
  description:
    "How GuitarPorn Club, operated from Spain in the European Union, handles accounts, guitar photos, email, the shop waitlist, cookieless page views, and essential session cookies.",
  path: "/privacy",
});

const CONTACT_EMAIL = "contact@guitarporn.club";

export default function PrivacyPage() {
  return (
    <main>
      <section className="border-b border-white/[0.08] pb-12 pt-16 sm:pt-20">
        <Container>
          <p className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">
            GuitarPorn Club
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Privacy policy
          </h1>
          <p className="mt-4 max-w-2xl text-base text-zinc-400">
            GuitarPorn Club is operated from Spain, in the European Union.
            This page explains what we collect, why, and the rights you have
            under the GDPR.
          </p>
          <p className="mt-3 text-sm text-zinc-500">
            Last updated 13 November 2026.
          </p>
        </Container>
      </section>

      <section className="py-10 sm:py-14">
        <Container>
          <div className="mx-auto flex max-w-3xl flex-col gap-10 text-sm leading-relaxed text-zinc-400">
            <section>
              <h2 className="text-lg font-semibold text-white">Who we are</h2>
              <p className="mt-3">
                The site at guitarporn.club is operated by GuitarPorn Club
                from Spain. GuitarPorn Club is the controller of the personal
                data described here. We do not publish a company registration
                number on this page. Questions and requests go to{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-zinc-200 underline underline-offset-4 hover:text-white"
                >
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white">Accounts</h2>
              <p className="mt-3">
                Member accounts are provided by Supabase Auth. When you create
                an account we store the email address you enter and the{" "}
                <span className="text-zinc-300">display_name</span> you choose.
                That display name is shown in the site header while you are
                signed in and next to guitars you add. Your password is handled
                by Supabase Auth; the GuitarPorn Club application does not keep
                its own copy of the password.
              </p>
              <p className="mt-3">
                The legal basis is performance of the contract for your
                account (GDPR Article 6(1)(b)): we need the email to sign you
                in and the display name to attribute your guitars.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white">
                Guitar photos
              </h2>
              <p className="mt-3">
                If you add a guitar, we store the photo you upload together
                with the brand, model, color, and year you enter, in Supabase
                Storage and the Gear database. The photo is shown in the
                public Gear gallery with your display name.
              </p>
              <p className="mt-3">
                You keep ownership of your photos. You grant GuitarPorn Club a
                non-exclusive, royalty-free license to host and publicly
                display them on guitarporn.club for as long as they remain on
                the site. You can end that license by deleting the guitar
                yourself while signed in, or by emailing a removal request to{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=Photo%20removal%20request`}
                  className="text-zinc-200 underline underline-offset-4 hover:text-white"
                >
                  {CONTACT_EMAIL}
                </a>
                . We remove the photo within 30 days of that request.
              </p>
              <p className="mt-3">
                The legal basis for storing and showing the listing is the
                account contract and the license you grant when you upload.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white">Email</h2>
              <p className="mt-3">
                Transactional email — account confirmation and password reset
                — is sent through Resend from{" "}
                <span className="text-zinc-300">noreply@guitarporn.club</span>.
                We use your email address only to deliver those messages and
                to sign you in. We do not send marketing mail from that
                address. The legal basis is the account contract and our
                legitimate interest in keeping accounts recoverable (GDPR
                Article 6(1)(f)).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white">
                Shop waitlist
              </h2>
              <p className="mt-3">
                The shop is a preview until a Shopify store is connected. If
                you join the waitlist, you give us an email address so we can
                tell you when the drop opens. That is consent (GDPR Article
                6(1)(a)). You can withdraw it by emailing{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=Shop%20waitlist%20removal`}
                  className="text-zinc-200 underline underline-offset-4 hover:text-white"
                >
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
              <p className="mt-3">
                When waitlist mail is configured, the site sends that address
                to {CONTACT_EMAIL} through Resend and does not keep a separate
                copy in the guitar database. When it is not configured, the
                site does not store the address: it gives you a mailto link so
                you can send the request from your own inbox.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white">
                Essential session cookies
              </h2>
              <p className="mt-3">
                Signing in sets essential session cookies so Supabase Auth can
                keep you signed in as you move around the site. They are
                required for the account to work. We do not use them for
                advertising, and this site does not set analytics or marketing
                cookies. Because these cookies are strictly necessary, they do
                not wait for a consent banner. The legal basis is the account
                contract and the exemption for strictly necessary cookies.
              </p>
              <p className="mt-3">
                If you press play on a video, the player loads from
                YouTube&apos;s privacy-enhanced domain
                (youtube-nocookie.com). YouTube may then process data under
                its own policy. Links to Instagram and YouTube leave this site.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white">
                Page views
              </h2>
              <p className="mt-3">
                On the Vercel deployment, the site loads Vercel Web Analytics.
                It does not set a cookie. Vercel records a page view with the
                time, the page path, the referrer, the browser, the operating
                system, the device type, and a coarse location (country,
                region, and city). Visitors are separated for a single day by
                a hash of the request, which Vercel discards after 24 hours.
                That hash is not used to follow someone across websites or
                across days.
              </p>
              <p className="mt-3">
                Before a page view is sent, query strings are removed, and
                visits to account pages (including password reset) are not
                sent. We do not send custom events. The legal basis is
                legitimate interest in seeing which public pages are used
                (GDPR Article 6(1)(f)), limited to this cookieless data. It is
                not used for advertising. The script is included only on the
                Vercel deployment, not in a local build.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white">
                How long we keep data
              </h2>
              <p className="mt-3">
                Account data stays until you delete the account or ask us to
                delete it. Guitar photos and listing details stay until you
                delete them or we finish a removal request (within 30 days).
                Session cookies last for the Supabase Auth session and are
                cleared when you sign out or when they expire. Password-reset
                and confirmation messages are kept only as long as Resend and
                Supabase need them to deliver the mail. A waitlist email sent
                through Resend stays in the club inbox until we delete it or
                you ask us to. Vercel discards the daily visitor hash after
                24 hours.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white">
                Who processes data for us
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  Supabase — authentication, the guitar database, and photo
                  storage.
                </li>
                <li>
                  Resend — delivery of transactional email from
                  noreply@guitarporn.club, and waitlist notes to{" "}
                  {CONTACT_EMAIL} when that mail is configured.
                </li>
                <li>
                  Vercel — hosting, and cookieless page-view analytics on the
                  deployed site.
                </li>
              </ul>
              <p className="mt-3">
                A link to the Shopify store leaves this site. We do not send
                your account or waitlist email to Shopify. If the store is
                connected, the server reads the public product catalog with
                the Storefront API.
              </p>
              <p className="mt-3">
                These providers act on our instructions for the purposes above.
                Some of their infrastructure may be outside the EU; where that
                happens, they rely on the transfer tools required by the GDPR
                (such as standard contractual clauses). We do not sell personal
                data.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white">
                Your rights under the GDPR
              </h2>
              <p className="mt-3">
                If you are in the EU or UK, you can ask us to:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>access the personal data we hold about you;</li>
                <li>correct inaccurate data, including your display name;</li>
                <li>erase your account, email, and uploaded photos;</li>
                <li>restrict or object to processing, where the law allows;</li>
                <li>
                  receive a portable copy of the account data you gave us;
                </li>
                <li>
                  withdraw the display license for a photo (by self-delete or
                  a removal request), without affecting processing that was
                  already lawful.
                </li>
              </ul>
              <p className="mt-3">
                Email{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=Privacy%20request`}
                  className="text-zinc-200 underline underline-offset-4 hover:text-white"
                >
                  {CONTACT_EMAIL}
                </a>{" "}
                and we will respond within one month. You can also lodge a
                complaint with the Spanish supervisory authority, the Agencia
                Española de Protección de Datos (AEPD), or with the authority
                where you live.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white">
                Related terms
              </h2>
              <p className="mt-3">
                The rules for using the site, including the photo license, are
                in the{" "}
                <Link
                  href="/terms"
                  className="text-zinc-200 underline underline-offset-4 hover:text-white"
                >
                  terms of use
                </Link>
                .
              </p>
            </section>
          </div>
        </Container>
      </section>
    </main>
  );
}
