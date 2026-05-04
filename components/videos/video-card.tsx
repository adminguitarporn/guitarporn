import type { CommunityVideo } from "@/types/video";
import { YoutubeEmbed } from "@/components/videos/youtube-embed";

type Props = {
  video: CommunityVideo;
};

export function VideoCard({ video }: Props) {
  return (
    <article
      id={video.id}
      className="scroll-mt-28 flex flex-col gap-4 rounded-2xl border border-white/10 bg-zinc-900/50 p-4 sm:p-5"
    >
      <YoutubeEmbed youtubeId={video.youtubeId} title={video.title} />
      <div>
        <h2 className="text-lg font-semibold text-white">{video.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          {video.description}
        </p>
      </div>
    </article>
  );
}
