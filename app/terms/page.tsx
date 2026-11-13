import Link from "next/link";
import { Container } from "@/components/layout/container";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Terms",
  description:
    "Terms of use for GuitarPorn Club: accounts, guitar photo ownership and display license, takedown, email, the shop waitlist, and essential session cookies.",
  path: "/terms",
});

const CONTACT_EMAIL = "contact@guitarporn.club";

export default function TermsPage() {
  return (
    <main>
      <section className="border-b border-white/[0.08] pb-12 pt-16 sm:pt-20">
        <Container>
          <p className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">
            GuitarPorn Club
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Terms of use
          </h1>
          <p className="mt-4 max-w-2xl text-base text-zinc-400">
            These terms cover guitarporn.club, operated by GuitarPorn Club
            from Spain in the European Union. Using the site, creating an
            account, or uploading a guitar means you accept them.
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
              <h2 className="text-lg font-semibold text-white">The operator</h2>
              <p className="mt-3">
                GuitarPorn Club operates this site from Spain. These terms do
                not state a corporate registration number or a personal legal
                name. Contact{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-zinc-200 underline underline-offset-4 hover:text-white"
                >
                  {CONTACT_EMAIL}
                </a>{" "}
                for anything in this document. How we handle personal data is
                described in the{" "}
                <Link
                  href="/privacy"
                  className="text-zinc-200 underline underline-offset-4 hover:text-white"
                >
                  privacy policy
                </Link>
                .
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white">Accounts</h2>
              <p className="mt-3">
                Accounts use Supabase Auth. You register with an email address
                and a display name (<span className="text-zinc-300">display_name</span>
                ). You must give an email you can access and a display name you
                are willing to show next to your guitars. Keep your password
                to yourself. You are responsible for activity under your
                account until you sign out or tell us the account is
                compromised.
              </p>
              <p className="mt-3">
                We may close an account that breaks these terms, including by
                removing its guitars from the gallery. You may stop using the
                site at any time and ask us to delete the account.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white">
                Photos you upload
              </h2>
              <p className="mt-3">
                You keep ownership of every guitar photo you upload. Uploading
                a photo grants GuitarPorn Club a non-exclusive, worldwide,
                royalty-free license to host, reproduce, and publicly display
                that photo, with the brand, model, color, year, and display
                name you submit, on guitarporn.club and in the Gear gallery.
              </p>
              <p className="mt-3">
                You confirm that the photo is yours to share: you took it, or
                you have permission from the person who did, and it does not
                infringe anyone else&apos;s rights. Do not upload photos of
                people who have not agreed to appear, or anything you are not
                allowed to publish.
              </p>
              <p className="mt-3">
                The license lasts while the photo is on the site. It ends when
                the photo is removed. It does not transfer ownership to
                GuitarPorn Club, and it does not let us sell your photo as a
                standalone product.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white">
                Taking a photo down
              </h2>
              <p className="mt-3">
                You can remove a guitar yourself while signed in: deleting the
                entry removes it from the gallery. You can also email a
                removal request to{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=Gear%20DB%20removal%20request`}
                  className="text-zinc-200 underline underline-offset-4 hover:text-white"
                >
                  {CONTACT_EMAIL}
                </a>
                . We take the photo and its listing down within 30 days. The
                same address is where a third party can report a photo they
                believe infringes their rights; include the page it appears on
                and why it should be removed.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white">
                Acceptable use
              </h2>
              <p className="mt-3">
                Do not use the site to break the law, upload malware, attempt
                to access another member&apos;s account, scrape the site in a
                way that degrades it, or post content that is unlawful,
                hateful, or sexually exploitative. Guitar listings should be
                real instruments you are sharing with the club.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white">
                Email and cookies
              </h2>
              <p className="mt-3">
                Account confirmation and password-reset messages are
                transactional email sent through Resend from
                noreply@guitarporn.club. Please do not reply to that address;
                write to {CONTACT_EMAIL} instead.
              </p>
              <p className="mt-3">
                The site sets essential session cookies so Supabase Auth can
                keep you signed in. They are not advertising cookies. Joining
                the shop waitlist means you agree we may email you when the
                store opens, as described in the{" "}
                <Link
                  href="/privacy"
                  className="text-zinc-200 underline underline-offset-4 hover:text-white"
                >
                  privacy policy
                </Link>
                . That policy also describes cookieless page-view counts on
                the Vercel deployment.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white">
                Other people&apos;s content
              </h2>
              <p className="mt-3">
                Guitars in the gallery are submitted by members. The gallery
                does not fill itself with sample instruments. Video pages
                embed public uploads from the GuitarPorn YouTube channel.
                GuitarPorn Club does not promise that member listings are
                complete or error-free. Shop links may leave this site for a
                store we do not operate. Until that store is connected, shop
                cards are previews without prices.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white">Liability</h2>
              <p className="mt-3">
                The site is a community project provided as available.
                Nothing on it is professional instrument, purchase, or legal
                advice. To the extent EU and Spanish law allow, GuitarPorn Club
                is not liable for indirect or consequential loss arising from
                use of the site or from member-uploaded photos. This does not
                limit liability that cannot legally be limited, including
                liability for death or personal injury caused by negligence,
                or for fraud. Mandatory consumer rights in your country of
                residence stay in force.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white">
                Law and changes
              </h2>
              <p className="mt-3">
                These terms are governed by the laws of Spain, without
                prejudice to mandatory protections you have as a consumer in
                your EU country of residence. If a provision is unenforceable,
                the rest still applies.
              </p>
              <p className="mt-3">
                We may update these terms as the site changes. The date at the
                top of this page is the latest version. Continuing to use the
                site after an update means you accept the new terms. If you do
                not accept them, stop using the site and ask us to delete your
                account.
              </p>
            </section>
          </div>
        </Container>
      </section>
    </main>
  );
}
