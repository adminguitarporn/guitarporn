type Props = {
  youtubeId: string;
  title: string;
};

export function YoutubeEmbed({ youtubeId, title }: Props) {
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
