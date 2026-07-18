import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { VideoRow } from "@/components/videos/video-row";
import { getVideoList } from "@/lib/repositories/videos";
import { YOUTUBE_CHANNEL_URL } from "@/lib/youtube";

export const metadata: Metadata = {
  title: "Videos",
  description:
    "Every GuitarPorn upload — rigs, rare builds, and instruments up close. Straight from the channel.",
};

export const revalidate = 3600;

export default async function VideosPage() {
  const videos = await getVideoList();

  return (
    <main>
      <section className="border-b border-white/[0.08] pb-12 pt-16 sm:pt-20">
        <Container>
          <p className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">
            From the channel
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Take a look at our adventures and content!
          </h1>
          <p className="mt-4 max-w-xl text-base text-zinc-400">
            Every upload from the GuitarPorn channel, newest first.
          </p>
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-medium tracking-wide text-zinc-300 transition hover:border-white/25 hover:text-white"
          >
            Subscribe on YouTube →
          </a>
        </Container>
      </section>

      <section className="py-10 sm:py-14">
        <Container>
          {videos.length === 0 ? (
            <p className="py-24 text-center text-zinc-600">
              Videos are loading from the channel — check back in a minute.
            </p>
          ) : (
            <div className="mx-auto flex max-w-3xl flex-col gap-4">
              {videos.map((v) => (
                <VideoRow key={v.id} video={v} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}
