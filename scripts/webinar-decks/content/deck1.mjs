// Deck 01 — Editing the website with Claude
import { C, MX, CW, W, TOP } from "../theme.mjs";

const D = (fn) => fn; // diagram draw helper passthrough

export const deck = {
  no: 1,
  file: "01-editing-the-website-with-claude.pptx",
  name: "Editing the website with Claude",
  title: "Editing the website with Claude.",
  subtitle: "How anyone on the team changes pages, photos and copy — by describing the change in plain English.",
  cover: "cover-claude.jpg",
  coverNotes:
    "Welcome everyone. This session shows how we make changes to satisgroup.co.uk without a developer on call: we describe the change to Claude in plain English, and it edits the website's master copy for us. By the end you'll be able to request any content change yourself. No technical background needed.",
  slides: [
    {
      type: "agenda",
      title: "What this session covers.",
      sub: "Forty minutes, no technical background needed. By the end, you can request any website change yourself.",
      items: [
        { title: "The one idea behind everything", sub: "The live site is a printed brochure — you change the master copy, not the print." },
        { title: "Starting a Claude session", sub: "Where to go, what to click, what you need access to." },
        { title: "How to ask for changes", sub: "Proven plain-English requests you can copy verbatim." },
        { title: "The magic words", sub: "“…then commit and push the change” — and what happens next." },
        { title: "Bigger jobs", sub: "Adding a whole new development in one request." },
        { title: "Skills and safety nets", sub: "The 100+ playbooks in the repository, and how nothing is ever lost." },
      ],
      notes: "Run through the agenda quickly. Emphasise the promise: by the end of the session everyone here can change the website themselves — safely.",
    },
    {
      type: "diagram",
      label: "The big idea",
      title: "The live site is a printed brochure.",
      intro: "You cannot scribble on a printed brochure — you change the master copy and print a new one. The master copy of this website lives in a shared, version-tracked folder called the repository, and the live site reprints itself automatically whenever the master changes.",
      draw: (s, T) => {
        const y = 3.5, h = 1.05, w = 2.55, gap = 0.62;
        const xs = [MX + 0.2, MX + 0.2 + (w + gap), MX + 0.2 + 2 * (w + gap), MX + 0.2 + 3 * (w + gap)];
        T.node(s, { x: xs[0], y, w, h, label: "You describe a change", sub: "in plain English, to Claude" });
        T.node(s, { x: xs[1], y, w, h, label: "Claude edits the master copy", sub: "the GitHub repository", fillDark: true });
        T.node(s, { x: xs[2], y, w, h, label: "The site reprints itself", sub: "Vercel rebuilds automatically" });
        T.node(s, { x: xs[3], y, w, h, label: "Change is live", sub: "www.satisgroup.co.uk" });
        for (let i = 0; i < 3; i++) T.arrow(s, xs[i] + w, y + h / 2, xs[i + 1], y + h / 2);
        T.arrowLabel(s, "MINUTES, NOT DAYS", xs[1] + w - 0.3, y + h + 0.35, w + gap + 0.6);
        s.addText([
          { text: "Two rules cover everything: ", options: { fontSize: 11.5, color: C.ink, bold: true } },
          { text: "nothing changes until it reaches the master copy, and every change to the master is recorded — so nothing is ever lost.", options: { fontSize: 11.5, color: C.muted } },
        ], { x: MX, y: 5.55, w: CW - 1, h: 0.6, fontFace: "Work Sans", margin: 0, lineSpacing: 17 });
      },
      notes: "This mental model comes from the operations guide and explains every behaviour they'll meet: why changes take a minute to appear, why nothing can be broken by browsing, and why every change is traceable. Repeat the brochure line — it lands.",
    },
    {
      type: "steps",
      label: "Getting started",
      title: "Starting a Claude session on the website.",
      intro: "Claude Code is Claude working directly on the website's repository. You reach it from a web browser — nothing to install.",
      image: "guide-claude-chapter.png",
      imageW: 5.3,
      caption: "The written version of this walkthrough lives at /admin/guide — chapter “Making changes with Claude”.",
      steps: [
        { n: 1, title: "Open claude.ai/code in your browser", body: "Sign in with your work Claude account. The development team sets up your access the first time — ask once, use forever." },
        { n: 2, title: "Choose the website repository", body: "Select satis-group-website from the repository list. That connects the session to the site's master copy." },
        { n: 3, title: "Describe your change and send", body: "Type what you want changed as if briefing a colleague. Claude reads the site's files, makes the edit, and shows you what it did." },
      ],
      panel: {
        tone: "tip", title: "You cannot break anything by asking",
        body: "Claude works on a copy until the change is committed and merged. Asking questions, exploring, or changing your mind costs nothing.",
        h: 1.05,
      },
      notes: "Reassure the room: a Claude session is a conversation, not a control panel. Nothing they type goes live by itself — there's a deliberate step (commit, then the automatic republish) between conversation and the public site.",
    },
    {
      type: "panels",
      label: "How to ask",
      title: "Proven requests — copy these word for word.",
      intro: "Describe the outcome, not the mechanics. These real examples all work verbatim:",
      cols: 2,
      panels: [
        { tone: "plainquote", title: "“Change the status of 22 St John Street to ‘Fully let’ on its portfolio card and property page.”", body: "Content edits — statuses, copy, dates, figures." },
        { tone: "plainquote", title: "“Replace the hero photo on the Courthouse page with the attached image.”", body: "Photography — attach the image to your message." },
        { tone: "plainquote", title: "“Add this award to the About page: RESI Awards Rising Star 2026.”", body: "Additions — awards, team members, accolades." },
        { tone: "plainquote", title: "“Fix a typo on the contact page: ‘recieve’ should be ‘receive’.”", body: "Small fixes — describe what's wrong and what right looks like." },
      ],
      notes: "These four examples come straight from the operations guide and cover 90% of day-to-day requests. Encourage people to include the page name and exact wording they want — precision in, precision out.",
    },
    {
      type: "diagram",
      label: "The magic words",
      title: "End every request with: “…then commit and push the change.”",
      intro: "A commit is a saved, dated snapshot of the master copy with a note of what changed and why. Committing and pushing is what sends your change to the master — and the master is what the live site reprints from.",
      draw: (s, T) => {
        const y = 3.35;
        s.addShape("rect", { x: MX, y: y - 0.2, w: 7.6, h: 1.5, fill: { color: C.stoneTint }, line: { type: "none" } });
        s.addText([
          { text: "“Replace the hero photo on the Courthouse page with the attached image, ", options: { fontSize: 13, color: C.ink, italic: true } },
          { text: "then commit and push the change.”", options: { fontSize: 13, color: C.ink, italic: true, bold: true } },
        ], { x: MX + 0.3, y: y - 0.2, w: 7.0, h: 1.5, fontFace: "Work Sans", margin: 0, valign: "middle", lineSpacing: 19 });
        T.panel(s, {
          tone: "tip", title: "Why it matters",
          body: "Without the magic words the edit stays in the session — reviewed but not sent. With them, Claude commits, pushes, and tells you when it is done.",
          x: 8.9, y: y - 0.2, w: 3.82, h: 1.9,
        });
        s.addText([
          { text: "Commits are the audit trail.  ", options: { fontSize: 11.5, bold: true, color: C.ink } },
          { text: "Every change is dated, described and attributed — and any mistake can be rolled back to the snapshot before it. Ask Claude “what changed this month?” and it can tell you.", options: { fontSize: 11.5, color: C.muted } },
        ], { x: MX, y: 5.35, w: 11.6, h: 0.75, fontFace: "Work Sans", margin: 0, lineSpacing: 17 });
      },
      notes: "“Commit and push” is the one phrase worth memorising. Explain the audit trail: this is why the repository approach is safer than editing a live site — every version of every page, forever.",
    },
    {
      type: "steps",
      label: "After you ask",
      title: "What happens next — and how to check.",
      steps: [
        { n: 1, title: "Claude confirms the commit", body: "It tells you what it changed and that the change is pushed. If the team reviews changes first, it opens a pull request — a change waiting for approval — instead." },
        { n: 2, title: "The site republishes itself", body: "Vercel, the hosting platform, notices the new master copy and reprints the site automatically. Typically a few minutes. There is nothing to press." },
        { n: 3, title: "Verify on the live page", body: "Open the page and check your change is showing. Not there after ten minutes? Ask in the same Claude session: “Was the commit pushed, and did the deployment succeed?” — Claude can check both." },
      ],
      aside: {
        tone: "check",
        title: "A good session ends with",
        body: ["A confirmation naming what changed, and the live page showing it. Keep the session open until you have seen both."],
        h: 2.0,
      },
      stepsW: 8.1,
      notes: "Set the expectation of a few minutes' delay — it prevents the “it didn't work” moment when a change hasn't propagated yet. The verification habit (always look at the live page) catches misunderstandings early.",
    },
    {
      type: "steps",
      label: "Bigger jobs",
      title: "Adding a whole new development — one request.",
      intro: "A new development touches the portfolio grid, its own property page, the map and the investor platform. Claude follows a set checklist — you just supply the ingredients:",
      steps: [
        { n: 1, title: "Name, brand and address", body: "e.g. “The Foundry, Altrincham” and the full address." },
        { n: 2, title: "Status and phase", body: "e.g. Acquired / Pre-construction." },
        { n: 3, title: "Photography", body: "A hero photograph, any gallery photos, and the project logo if the scheme is branded. Attach them to the message." },
        { n: 4, title: "Brochure PDF, if there is one", body: "It becomes a download on the property page." },
        { n: 5, title: "Investor-platform figures", body: "SPV name, equity value, total committed, senior debt and forecast IRR." },
      ],
      panel: {
        tone: "check", title: "Afterwards, check four places",
        body: "The portfolio grid shows the new card · its property page opens · the map shows its pin · the Developments & SPVs tab lists its SPV.",
        h: 1.0,
      },
      stepsW: 8.6,
      bodySize: 10,
      notes: "This is the guide's own recipe. The point to land: gather the five ingredients before starting, then it's one message and under an hour — most of which is Claude working, not you.",
    },
    {
      type: "imageFocus",
      label: "Where things live",
      title: "What Claude is actually editing.",
      textW: 4.5,
      image: "portfolio-top.png",
      caption: "Every card on the portfolio grid is generated from a data file — no page is edited by hand.",
      body: [
        { text: "The public website is data-driven: every page is generated from structured files in the repository. You never edit a page's design — you change the data and the design applies itself.", size: 11 },
        { text: "For the curious:", bold: true, mutedText: false, size: 11 },
        "Portfolio cards — lib/portfolio-data.ts",
        "Property pages — lib/property-pages.ts",
        "Photography — public/images/",
        "News stories — content/newsletters/",
        "Investor data — content/investors/",
      ],
      panel: {
        tone: "tip", title: "You never need these paths",
        body: "Claude finds the right file from your description. They are here to demystify, not to memorise.",
        y: 5.5, h: 1.3,
      },
      notes: "One slide of gentle demystification. The takeaway isn't the file names — it's that the site is structured data plus a design system, which is why plain-English requests work so reliably.",
    },
    {
      type: "panels",
      label: "Skills",
      title: "100+ specialist playbooks, already installed.",
      intro: "The repository carries a catalogue of professional “skills” Claude loads to work to a set standard. You never install anything — ask for the outcome and the right playbook loads:",
      cols: 3,
      panels: [
        { tone: "tip", title: "“Run an accessibility audit and fix what it finds.”", body: "WCAG accessibility review of the whole site." },
        { tone: "tip", title: "“Audit the site's SEO and implement the quick wins.”", body: "Search-ranking audit and fixes." },
        { tone: "tip", title: "“Review my last change for bugs and security issues.”", body: "A second pair of expert eyes on any change." },
        { tone: "tip", title: "“Rewrite this paragraph in the house voice.”", body: "Writing and editing to the Satis tone." },
        { tone: "tip", title: "“/design-standards review the contact page.”", body: "Design QA against the site's spacing, contrast and type rules." },
        { tone: "tip", title: "“Run SEO, accessibility and code-review agents in parallel and fix the findings.”", body: "Site-wide sweeps — how the current standards were set." },
      ],
      panelH: 1.55,
      notes: "The examples are verbatim from the guide's Claude agents & skills chapter. Quarterly habit worth suggesting: an SEO audit and an accessibility audit cost one sentence each.",
    },
    {
      type: "statement",
      label: "Safety",
      title: "",
      big: "Nothing is ever lost, and nothing goes live unseen.",
      sub: "Every change is a dated snapshot that can be rolled back. Claude explains what it changed before it commits, and the live site only ever reprints from the master copy. If anything ever looks wrong: ask Claude to undo the last change — that is a one-sentence request too.",
      dark: true,
      notes: "Close the loop on fear. The three safety properties: visibility before commit, audit trail after, rollback always. Invite the room to try one small real request this week — a typo fix or a status change.",
    },
  ],
  takeaways: [
    "The live site reprints from a master copy — Claude is how you edit the master.",
    "Describe outcomes in plain English; include the page and exact wording you want.",
    "End with “…then commit and push the change”, then verify on the live page.",
    "New development = one request with five ingredients.",
    "Ask for outcomes and the specialist skills load themselves.",
  ],
  help: [
    "The written walkthrough: /admin/guide → “Making changes with Claude”.",
    "Stuck mid-session? Ask Claude itself — “explain what just happened” works.",
    "Access to claude.ai/code: ask the development team once.",
  ],
};
