"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const STILL = "/videos/hero-skyline-poster.jpg";

/**
 * Phones get the still on its own. The hero box is portrait at that width, so
 * object-cover throws away about two thirds of the frame and the footage reads
 * as a magnified sliver; it also spares them the download. Keep this in step
 * with the `max-sm:hidden` on the video below — `sm` is 640px.
 */
const WIDE_ENOUGH = "(min-width: 640px)";

/**
 * Looping city footage behind the homepage hero copy, over a still of its own
 * first frame. The still carries the hero on its own whenever the video should
 * not or cannot play: on phones, under reduced motion, while it downloads, if
 * autoplay is refused (iOS Low Power Mode, data saver), and in browsers
 * without the codec.
 */
export function HeroVideoBackdrop() {
  const ref = useRef<HTMLVideoElement>(null);
  // The video is only revealed once it is actually playing, so the still is
  // what shows in every other case rather than an empty video element, whose
  // painting is left to the browser.
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const wide = window.matchMedia(WIDE_ENOUGH);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Playback is driven from here rather than through the `autoplay`
    // attribute so both preferences hold on the very first frame and when
    // they change: `autoplay` is only read while the video loads, so
    // flipping it afterwards cannot pause footage that has already started.
    // Together with `preload="none"` this means a visitor who should not see
    // the video never downloads it.
    const sync = () => {
      if (reduced.matches || !wide.matches) {
        video.pause();
        video.currentTime = 0;
        setPlaying(false);
        return;
      }
      // Rejects when the browser refuses autoplay, which leaves the still on
      // screen — the result we want anyway.
      video.play().then(
        () => setPlaying(true),
        () => setPlaying(false),
      );
    };

    sync();
    wide.addEventListener("change", sync);
    reduced.addEventListener("change", sync);
    return () => {
      wide.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
    };
  }, []);

  return (
    <div className="absolute inset-0">
      <Image
        src={STILL}
        alt=""
        fill
        preload
        sizes="100vw"
        className="object-cover"
      />
      <video
        ref={ref}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 max-sm:hidden ${
          playing ? "opacity-100" : "opacity-0"
        }`}
        src="/videos/hero-skyline.mp4"
        loop
        muted
        playsInline
        preload="none"
        onError={() => setPlaying(false)}
      />
      <div className="absolute inset-0 bg-background/70" />
    </div>
  );
}
