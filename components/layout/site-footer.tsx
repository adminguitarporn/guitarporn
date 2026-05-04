import { Container } from "@/components/layout/container";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-zinc-950/80 py-10 text-sm text-zinc-500">
      <Container className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} GuitarPorn. Built for players.</p>
        <p className="text-zinc-600">
          Community content — verify listings before purchase elsewhere.
        </p>
      </Container>
    </footer>
  );
}
