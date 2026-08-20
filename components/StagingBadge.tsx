import { DEPLOY_ENV, IS_LIVE_SITE } from "@/lib/site";

// A quiet marker so a staging tab is never mistaken for the live site. Not
// rendered on production, and never over the top of anything clickable.
export function StagingBadge() {
  if (IS_LIVE_SITE) return null;
  const label = DEPLOY_ENV === "preview" ? "Staging" : "Local";
  return (
    <div className="pointer-events-none fixed bottom-3 left-3 z-[90] select-none rounded-full border border-accent/40 bg-background/80 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-accent-text backdrop-blur">
      {label}
    </div>
  );
}
