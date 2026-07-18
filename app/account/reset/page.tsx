import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { ResetForm } from "@/components/account/reset-form";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Set a new password for your GuitarPorn account.",
};

export default function ResetPage() {
  return (
    <main>
      <section className="py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-md">
            <ResetForm />
          </div>
        </Container>
      </section>
    </main>
  );
}
