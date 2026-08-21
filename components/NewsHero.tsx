import { ImageStreamHero } from "@/components/ui/image-stream-hero";

/**
 * News hero: a corridor of Satis Group photography rushing toward the
 * viewer, with the page title held still on top. Both rails run the same
 * sequence, so the order below reads outward from the vanishing point —
 * alternate buildings and interiors so no two neighbouring cards look alike.
 */
const IMAGES = [
  { src: "/images/22stjohn/building.jpg", alt: "22 St John, Manchester" },
  { src: "/images/courthouse/kitchen.jpg", alt: "A kitchen at The Courthouse" },
  { src: "/images/hazelgate/exterior-v4.jpg", alt: "Hazelgate, Hazel Grove" },
  { src: "/images/barrington/two-bed.jpg", alt: "A two-bed at Barrington House" },
  { src: "/images/qube/hero.jpg", alt: "QUBE, Stockport town centre" },
  { src: "/images/meyer/living.jpg", alt: "Living space at Meyer" },
  { src: "/images/courthouse/hero-v2.jpg", alt: "The Courthouse, Macclesfield" },
  { src: "/images/hazelgate/living-kitchen.jpg", alt: "Living space at Hazelgate" },
  { src: "/images/barrington/exterior-dusk.jpg", alt: "Barrington House at dusk" },
  { src: "/images/22stjohn/offices.jpg", alt: "Private offices at 22 St John" },
  { src: "/images/stjohnscorner/hero.jpg", alt: "St John's Corner, Manchester" },
  { src: "/images/meyer/exterior-detail.jpg", alt: "Exterior detail at Meyer" },
];

type NewsHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  /** Calls to action rendered beneath the copy. */
  actions?: React.ReactNode;
};

export function NewsHero({ eyebrow, title, description, actions }: NewsHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      {/* The corridor is sized in cqw, so it keeps its proportions at any
          width: on a wide frame the near cards overflow the top and bottom,
          on a narrow one it settles into a band behind the copy. The copy
          sits outside it, in normal flow, and sets the section height. */}
      <ImageStreamHero
        images={IMAGES}
        speed={22}
        axis={50}
        className="absolute inset-0"
      />

      {/* Scrims: the corridor is busiest at the frame edges, so the copy sits
          in a pool of near-solid background with the motion showing past it.
          Both layers are token-driven, so they invert with the theme. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,var(--background)_18%,color-mix(in_srgb,var(--background)_72%,transparent)_46%,transparent_78%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-32 bg-gradient-to-t from-background to-transparent"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 text-center sm:py-24 lg:px-10 lg:py-32">
        <span className="text-xs tracking-[0.35em] uppercase text-accent-text">
          {eyebrow}
        </span>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-medium tracking-tight text-balance sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-balance text-muted lg:text-lg">
          {description}
        </p>
        {actions && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {actions}
          </div>
        )}
      </div>
    </section>
  );
}
