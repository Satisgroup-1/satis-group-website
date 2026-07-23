"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type GalleryImage = {
  src: string;
  alt: string;
};

type GalleryLightboxProps = {
  images: GalleryImage[];
  /** "cover" for photography grids, "contain" for floor plans */
  fit?: "cover" | "contain";
  columnsClass?: string;
  aspectClass?: string;
  captions?: boolean;
};

export function GalleryLightbox({
  images,
  fit = "cover",
  columnsClass = "grid-cols-2 lg:grid-cols-3",
  aspectClass = "aspect-[4/3]",
  captions = false,
}: GalleryLightboxProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (direction: 1 | -1) => {
      setOpenIndex((current) => {
        if (current === null) return current;
        return (current + direction + images.length) % images.length;
      });
    },
    [images.length]
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIndex, close, step]);

  return (
    <>
      <div className={`grid gap-4 ${columnsClass}`}>
        {images.map((image, index) => (
          <figure key={image.src} className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              aria-label={`Enlarge: ${image.alt}`}
              className={`group relative ${aspectClass} w-full cursor-zoom-in overflow-hidden bg-surface ${
                fit === "contain" ? "border border-border bg-white" : ""
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 33vw, 50vw"
                className={`transition-transform duration-700 ease-out group-hover:scale-[1.04] ${
                  fit === "contain" ? "object-contain p-4" : "object-cover"
                }`}
              />
              <span className="absolute inset-0 flex items-end justify-end p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="bg-background/90 px-2.5 py-1.5 text-[0.6rem] tracking-[0.2em] uppercase">
                  View
                </span>
              </span>
            </button>
            {captions && (
              <figcaption className="text-xs tracking-[0.2em] uppercase text-muted">
                {image.alt}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[70] flex flex-col bg-black/90 backdrop-blur-sm"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={images[openIndex].alt}
          >
            <div className="flex items-center justify-between px-6 py-4 text-white">
              <span className="text-xs tracking-[0.25em] uppercase text-white/70">
                {openIndex + 1} / {images.length}
              </span>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="text-xs tracking-[0.25em] uppercase transition-colors hover:text-accent"
              >
                Close ✕
              </button>
            </div>
            <motion.div
              key={openIndex}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`relative mx-6 mb-6 flex-1 ${
                fit === "contain" ? "rounded-sm bg-white p-6" : ""
              }`}
              onClick={(event) => event.stopPropagation()}
            >
              <Image
                src={images[openIndex].src}
                alt={images[openIndex].alt}
                fill
                sizes="100vw"
                className={`object-contain ${fit === "contain" ? "p-8" : ""}`}
              />
            </motion.div>
            <div className="flex items-center justify-between px-6 pb-6">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  step(-1);
                }}
                aria-label="Previous image"
                className="px-4 py-2 text-sm tracking-[0.2em] uppercase text-white transition-colors hover:text-accent"
              >
                ← Prev
              </button>
              <span className="hidden text-xs tracking-[0.1em] text-white/60 sm:block">
                {images[openIndex].alt}
              </span>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  step(1);
                }}
                aria-label="Next image"
                className="px-4 py-2 text-sm tracking-[0.2em] uppercase text-white transition-colors hover:text-accent"
              >
                Next →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
