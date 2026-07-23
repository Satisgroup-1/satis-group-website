"use client";

import Image from "next/image";
import { useState } from "react";

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  image: string;
};

function TeamCard({ member }: { member: TeamMember }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setIsOpen((open) => !open)}
      aria-expanded={isOpen}
      aria-label={`${member.name}, ${member.role}. ${isOpen ? "Hide" : "Show"} bio`}
      className="group relative block w-full overflow-hidden bg-surface text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
    >
      <div className="relative aspect-[5/6] w-full overflow-hidden">
        <Image
          src={member.image}
          alt={`Headshot of ${member.name}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </div>

      {/* Always-visible name strip */}
      <div
        className={`absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-5 pb-4 pt-12 transition-opacity duration-300 ${
          isOpen ? "opacity-0" : "opacity-100"
        }`}
      >
        <div>
          <span className="block text-base font-medium tracking-tight text-white">
            {member.name}
          </span>
          <span className="mt-0.5 block text-[0.65rem] tracking-[0.25em] uppercase text-white/75">
            {member.role}
          </span>
        </div>
        <span
          aria-hidden="true"
          className="mb-1 text-white/80 transition-transform duration-300 group-hover:-translate-y-1"
        >
          ↑
        </span>
      </div>

      {/* Slide-up description panel: hover on desktop, tap toggles everywhere */}
      <div
        className={`absolute inset-x-0 bottom-0 flex max-h-full flex-col gap-2 bg-ink/95 px-5 py-5 text-ink-foreground backdrop-blur-sm transition-transform duration-500 ease-[cubic-bezier(0.21,0.47,0.32,0.98)] ${
          isOpen ? "translate-y-0" : "translate-y-full group-hover:translate-y-0"
        }`}
      >
        <span className="text-base font-medium tracking-tight">
          {member.name}
        </span>
        <span className="text-[0.65rem] tracking-[0.25em] uppercase text-accent">
          {member.role}
        </span>
        <p className="text-sm leading-relaxed text-ink-foreground/85">
          {member.bio}
        </p>
      </div>
    </button>
  );
}

export function TeamGrid({ members }: { members: TeamMember[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((member) => (
        <TeamCard key={member.name} member={member} />
      ))}
    </div>
  );
}
