import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { SubmitForm } from "@/components/gear/submit-form";

export const metadata: Metadata = {
  title: "Add your guitar",
  description:
    "Join the club and add your guitar to the community collection. One front-view photo, brand, model, color.",
};

export default function SubmitPage() {
  return (
    <main>
      <section className="border-b border-white/[0.08] pb-12 pt-16 sm:pt-20">
        <Container>
          <p className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">
            Join the collection
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Add your guitar.
          </h1>
          <p className="mt-4 max-w-xl text-base text-zinc-400">
            One clean front-view photo, the brand, model, and color — year if
            you know it. That&apos;s it. Your guitar becomes part of the
            club&apos;s database.
          </p>
        </Container>
      </section>

      <section className="py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-xl">
            <SubmitForm />
          </div>
        </Container>
      </section>
    </main>
  );
}
