import Image from "next/image";
import { Reveal } from "./Reveal";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  /** Single paragraph, or an array of paragraphs rendered in sequence. */
  description?: string | string[];
  /** Optional background element (e.g. skyline SVG) rendered behind text. */
  backdrop?: React.ReactNode;
  /** Tighter vertical rhythm, for pages whose content should surface sooner. */
  compact?: boolean;
  /**
   * Lead photograph shown beside the copy on large screens, beneath it on
   * small ones. Loaded eagerly: it is above the fold.
   */
  image?: { src: string; alt: string; position?: string };
};

export function PageHero({
  eyebrow,
  title,
  description,
  backdrop,
  compact = false,
  image,
}: PageHeroProps) {
  const paragraphs =
    typeof description === "string"
      ? [description]
      : (description ?? []);

  return (
    <section className="relative overflow-hidden border-b border-border">
      {backdrop && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
        >
          {backdrop}
        </div>
      )}
      <div
        className={`relative z-10 mx-auto max-w-7xl px-6 lg:px-10 ${
          compact ? "py-16 lg:py-20" : "py-24 lg:py-32"
        } ${
          image
            ? "grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-16"
            : "flex flex-col gap-6"
        }`}
      >
        <Reveal>
          {eyebrow && (
            <span className="text-xs tracking-[0.35em] uppercase text-accent-text">
              {eyebrow}
            </span>
          )}
          <h1 className="mt-4 max-w-3xl text-4xl font-medium tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {paragraphs.length > 0 && (
            <div className="mt-6 flex max-w-xl flex-col gap-4">
              {paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-base leading-relaxed text-muted lg:text-lg"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </Reveal>
        {image && (
          <Reveal delay={0.15}>
            <div className="relative aspect-[3/2] overflow-hidden bg-surface">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                preload
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
                style={
                  image.position
                    ? { objectPosition: image.position }
                    : undefined
                }
              />
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
