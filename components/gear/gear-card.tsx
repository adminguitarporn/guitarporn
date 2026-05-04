import Image from "next/image";
import type { Gear } from "@/types/gear";

type Props = {
  gear: Gear;
};

export function GearCard({ gear }: Props) {
  const [primary, secondary] = gear.images;

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-white/[0.07] bg-zinc-900/30 ring-1 ring-white/[0.03] transition hover:border-crimson/25 hover:ring-crimson/10">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-950 sm:aspect-[3/4]">
        <Image
          src={primary.url}
          alt={primary.alt}
          fill
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
          sizes="(min-width: 1280px) 360px, (min-width: 640px) 45vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

        {secondary ? (
          <div className="absolute bottom-4 left-4 z-10 h-20 w-[4.5rem] overflow-hidden rounded-lg border border-white/15 shadow-2xl shadow-black/60 sm:bottom-5 sm:left-5 sm:h-24 sm:w-28">
            <Image
              src={secondary.url}
              alt={secondary.alt}
              fill
              className="object-cover"
              sizes="112px"
            />
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 border-t border-white/[0.06] px-6 pb-6 pt-5 sm:px-7 sm:pb-7 sm:pt-6">
        <div>
          <p className="text-[0.65rem] font-semibold tracking-[0.2em] text-crimson uppercase">
            {gear.brand}
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-[1.65rem]">
            {gear.model}
          </h2>
        </div>
        <p className="line-clamp-3 text-sm leading-relaxed text-zinc-500">
          {gear.description}
        </p>
      </div>
    </article>
  );
}
