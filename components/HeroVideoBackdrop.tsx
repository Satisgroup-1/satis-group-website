"use client";

import { useEffect, useRef } from "react";

const POSTER = "/videos/hero-skyline-poster.jpg";

/**
 * Looping city footage behind the homepage hero copy.
 *
 * The poster is the video's own first frame, so the hero is painted straight
 * away and still looks right in every case the footage cannot play: while it
 * downloads, when autoplay is refused (iOS Low Power Mode, data saver), when
 * the browser lacks the codec, and under reduced motion.
 */
export function HeroVideoBackdrop() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Playback is driven here rather than through the `autoplay` attribute so
    // the preference is honoured on the very first frame and whenever it
    // changes: `autoplay` is only read as the video loads, so flipping it
    // afterwards cannot pause footage that has already started. Paired with
    // `preload="none"`, reduced-motion visitors fetch the poster and nothing
    // else.
    const sync = () => {
      if (motion.matches) {
        video.pause();
        video.currentTime = 0;
        return;
      }
      // Rejects when the browser refuses autoplay, which leaves the poster
      // on screen — the same result we want.
      void video.play().catch(() => {});
    };

    sync();
    motion.addEventListener("change", sync);
    return () => motion.removeEventListener("change", sync);
  }, []);

  return (
    <div className="absolute inset-0">
      <video
        ref={ref}
        className="h-full w-full object-cover"
        src="/videos/hero-skyline.mp4"
        poster={POSTER}
        loop
        muted
        playsInline
        preload="none"
      />
      <div className="absolute inset-0 bg-background/70" />
    </div>
  );
}
