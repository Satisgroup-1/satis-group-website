import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ContactFormFromQuery } from "@/components/ContactFormFromQuery";

export const metadata: Metadata = {
  title: "Contact | Satis Group",
  description:
    "Get in touch with Satis Group about a property, a project, or a partnership.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk about a property."
        description="Whether you have a site in mind, a project to discuss, or a general enquiry, we'd like to hear from you."
      />
      <section>
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 py-20 lg:grid-cols-3 lg:px-10">
          <div className="lg:col-span-2">
            <ContactFormFromQuery />
          </div>
          <div className="flex flex-col gap-8">
            <div>
              <span className="text-xs tracking-[0.2em] uppercase text-accent">
                Email
              </span>
              <a
                href="mailto:info@satisgroup.co.uk"
                className="mt-2 block text-sm tracking-[0.05em] transition-colors hover:text-accent"
              >
                info@satisgroup.co.uk
              </a>
            </div>
            <div>
              <span className="text-xs tracking-[0.2em] uppercase text-accent">
                Office
              </span>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Satis Group
                <br />
                Cheshire, United Kingdom
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
