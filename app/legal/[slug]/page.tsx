import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { LEGAL_PAGES, getLegalPage } from "@/lib/legal-pages";

export function generateStaticParams() {
  return LEGAL_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/legal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = getLegalPage(slug);
  if (!page) return {};
  return {
    title: `${page.title} | Satis Group`,
    description: `${page.title} for RA Developments (NW) Limited, trading as SATIS Group.`,
  };
}

export default async function LegalPage({
  params,
}: PageProps<"/legal/[slug]">) {
  const { slug } = await params;
  const page = getLegalPage(slug);
  if (!page) notFound();

  return (
    <section>
      <div className="mx-auto max-w-3xl px-6 py-20 lg:py-28">
        <Reveal>
          <span className="text-xs tracking-[0.35em] uppercase text-accent">
            Legal
          </span>
          <h1 className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl">
            {page.title}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {page.intro}
          </p>
        </Reveal>
        <div className="mt-12 flex flex-col gap-5 border-t border-border pt-10">
          {page.blocks.map((block, index) => {
            if (block.kind === "heading") {
              return (
                <h2
                  key={index}
                  className="mt-6 text-lg font-medium tracking-tight first:mt-0"
                >
                  {block.text}
                </h2>
              );
            }
            if (block.kind === "list") {
              return (
                <ul key={index} className="flex flex-col gap-2 pl-5">
                  {block.items.map((item) => (
                    <li
                      key={item.slice(0, 40)}
                      className="list-disc text-sm leading-relaxed text-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={index} className="text-sm leading-relaxed text-muted">
                {block.text}
              </p>
            );
          })}
        </div>
      </div>
    </section>
  );
}
