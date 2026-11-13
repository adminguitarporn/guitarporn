import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShareGearLink } from "@/components/gear/share-link";
import { Container } from "@/components/layout/container";
import { getGearById, getGearList } from "@/lib/repositories/gear";
import { absoluteUrl, gearShareCopy, pageMeta } from "@/lib/seo";

export const revalidate = 60;
export const dynamicParams = true;

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const gear = await getGearList();
  return gear.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const gear = await getGearById(id);
  if (!gear) {
    return { title: "Guitar not found" };
  }

  const share = gearShareCopy(gear);
  const path = `/gear/${gear.id}`;
  const meta = pageMeta({
    title: share.title,
    description: share.description,
    path,
    shareImage: false,
  });
  const image = {
    url: `/gear/${gear.id}/opengraph-image`,
    width: 1200,
    height: 630,
    alt: `${share.title}. ${share.description}`,
  };
  return {
    ...meta,
    openGraph: { ...meta.openGraph, images: [image] },
    twitter: {
      ...meta.twitter,
      images: [`/gear/${gear.id}/twitter-image`],
    },
  };
}

export default async function GearDetailPage({ params }: Props) {
  const { id } = await params;
  const gear = await getGearById(id);
  if (!gear) notFound();

  const share = gearShareCopy(gear);
  const owner = gear.ownerName?.trim();

  return (
    <main>
      <section className="border-b border-white/[0.08] pb-12 pt-16 sm:pt-20">
        <Container>
          <Link
            href="/gear"
            className="text-sm text-zinc-400 underline underline-offset-4 transition hover:text-white"
          >
            ← Gear DB
          </Link>
          <p className="mt-8 text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">
            {gear.brand}
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            {gear.model}
          </h1>
          <p className="mt-4 text-base text-zinc-400">
            {gear.color}
            {gear.year ? ` · ${gear.year}` : ""}
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            {owner ? (
              <>
                Added by <span className="text-zinc-300">{owner}</span>
              </>
            ) : (
              "Added by a GuitarPorn Club member."
            )}
          </p>
          <ShareGearLink title={share.title} />
        </Container>
      </section>

      <section className="py-10 sm:py-14">
        <Container>
          <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-3xl border border-white/[0.08] bg-zinc-900">
            <Image
              src={gear.imageUrl}
              alt={`${gear.brand} ${gear.model} in ${gear.color}`}
              fill
              priority
              sizes="(min-width: 768px) 28rem, 100vw"
              className="object-cover"
            />
          </div>
          <p className="mx-auto mt-6 max-w-md text-center text-xs text-zinc-600">
            {absoluteUrl(`/gear/${gear.id}`)}
          </p>
        </Container>
      </section>
    </main>
  );
}
