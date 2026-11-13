import { isYoutubeId } from "@/lib/youtube-id";

type Props = {
  youtubeId: string;
  title: string;
};

export function YoutubeEmbed({ youtubeId, title }: Props) {
  if (!isYoutubeId(youtubeId)) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-2xl border border-white/10 bg-black px-6 text-center text-sm text-zinc-500">
        This video can’t be embedded.
      </div>
    );
  }

  const src = `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
      <iframe
        src={src}
        title={title}
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
