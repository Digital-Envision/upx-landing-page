"use client";

import { useState } from "react";
import Image from "next/image";
import { SHOWCASE_VIDEO } from "@/lib/landing/content";

/**
 * Click-to-load YouTube facade. Nothing from youtube.com is requested until the
 * visitor presses play, which keeps the ~700KB player and its third-party
 * requests out of the initial page load.
 */
export function VideoThumbnail({ poster }: { poster: string }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="relative aspect-[472/266] w-full overflow-hidden rounded-2xl">
        <iframe
          className="absolute inset-0 size-full"
          src={`https://www.youtube-nocookie.com/embed/${SHOWCASE_VIDEO.id}?autoplay=1&rel=0`}
          title={SHOWCASE_VIDEO.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group relative block aspect-[472/266] w-full overflow-hidden rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lp-cyan"
    >
      <Image
        src={poster}
        alt=""
        fill
        sizes="(min-width: 1024px) 476px, 95vw"
        className="object-cover"
      />
      <span className="absolute inset-0 bg-[rgba(18,18,18,0.2)] transition-colors group-hover:bg-[rgba(18,18,18,0.35)]" />
      <span className="absolute left-1/2 top-1/2 inline-flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform group-hover:scale-110">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M8 5.14v13.72a1 1 0 0 0 1.53.85l10.8-6.86a1 1 0 0 0 0-1.7L9.53 4.29A1 1 0 0 0 8 5.14Z" fill="#fff" />
        </svg>
      </span>
      <span className="sr-only">Play video: {SHOWCASE_VIDEO.title}</span>
    </button>
  );
}
