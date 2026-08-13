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
};

export function PageHero({
  eyebrow,
  title,
  description,
  backdrop,
  compact = false,
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
        className={`relative z-10 mx-auto flex max-w-7xl flex-col gap-6 px-6 lg:px-10 ${
          compact ? "py-16 lg:py-20" : "py-24 lg:py-32"
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
      </div>
    </section>
  );
}
