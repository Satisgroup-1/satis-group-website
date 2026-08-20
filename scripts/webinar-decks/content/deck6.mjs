// Deck 06 — The systems behind the website
import { C, MX, CW } from "../theme.mjs";

export const deck = {
  no: 6,
  file: "06-the-systems-behind-the-website.pptx",
  name: "The systems behind the website",
  title: "The systems behind the website.",
  subtitle: "GitHub, Vercel, 123 Reg and the moving parts: what each one does, how a change travels, and what to check when something misbehaves.",
  cover: "cover-systems.jpg",
  coverNotes:
    "The explainer session: no routines to learn, just the mental model of the machine. GitHub holds the master copy, Vercel prints and serves it, 123 Reg owns the address and the mailboxes, and a handful of settings tie it together. By the end, 'is it the site, the hosting or the domain?' becomes an answerable question.",
  slides: [
    {
      type: "agenda",
      title: "What this session covers.",
      sub: "Nothing here needs doing day to day. This is the map that makes every other webinar make sense.",
      items: [
        { title: "The machine, on one slide", sub: "Five parts and the arrows between them." },
        { title: "GitHub: the master copy", sub: "Also the database, and the audit trail." },
        { title: "Vercel: the printing press", sub: "Builds, hosting, settings and domains." },
        { title: "123 Reg: the address book", sub: "The domain name, DNS and the mailboxes." },
        { title: "The settings that matter", sub: "The values in Vercel and what each does." },
        { title: "When something misbehaves", sub: "Symptom → which system → first move." },
      ],
      notes: "Pitch: this is the 'how it all hangs together' session people asked for. Keep it conversational. Every slide here answers a 'but where does X actually live?' question.",
    },
    {
      type: "diagram",
      label: "The map",
      title: "Five parts, one direction of travel.",
      draw: (s, T) => {
        const y = 2.55, h = 1.08, w = 2.15, gap = 0.335, step = w + gap;
        const xs = [0, 1, 2, 3, 4].map((i) => MX + i * step);
        T.node(s, { x: xs[0], y, w, h, label: "You + Claude", sub: "plain-English changes" });
        T.node(s, { x: xs[1], y, w, h, label: "GitHub", sub: "master copy · repository", fillDark: true });
        T.node(s, { x: xs[2], y, w, h, label: "Vercel", sub: "builds & hosts the site", fillDark: true });
        T.node(s, { x: xs[3], y, w, h, label: "satisgroup.co.uk", sub: "the live site" });
        T.node(s, { x: xs[4], y, w, h, label: "Visitors & investors", sub: "browsers, phones" });
        for (let i = 0; i < 4; i++) T.arrow(s, xs[i] + w, y + h / 2, xs[i + 1], y + h / 2);
        // lower row: supporting systems, each under the box it feeds
        const y2 = 4.65, h2 = 0.95, w2 = 2.26;
        const under = (i) => xs[i] + w / 2 - w2 / 2;
        T.node(s, { x: under(1), y: y2, w: w2, h: h2, label: "Platform studio saves", sub: "commit straight into GitHub" });
        T.arrow(s, xs[1] + w / 2, y2, xs[1] + w / 2, y + h + 0.07);
        T.node(s, { x: under(2), y: y2, w: w2, h: h2, label: "HM Land Registry", sub: "live market data feed" });
        T.arrow(s, xs[2] + w / 2, y2, xs[2] + w / 2, y + h + 0.07, { dash: "dash" });
        T.node(s, { x: under(3), y: y2, w: w2, h: h2, label: "123 Reg", sub: "domain, DNS & mailboxes" });
        T.arrow(s, xs[3] + w / 2, y2, xs[3] + w / 2, y + h + 0.07);
        s.addText("Changes only ever flow left to right: nothing edits the live site directly.", {
          x: MX, y: 6.15, w: CW, h: 0.35, fontFace: "Work Sans", fontSize: 11.5, color: C.muted, margin: 0,
        });
      },
      notes: "Orient the room left to right: people describe changes, GitHub records them, Vercel rebuilds, the domain serves it. The three feeder boxes below: studio saves commit into GitHub; the Land Registry feeds market data into the site automatically; 123 Reg points the name at Vercel and hosts the mailboxes.",
    },
    {
      type: "panels",
      label: "GitHub",
      title: "GitHub: the master copy, and the database.",
      intro: "The repository (satis-group-website, under the Satisgroup-1 GitHub account) is a shared, version-tracked folder holding every file the site is built from.",
      cols: 3,
      panels: [
        {
          tone: "plain", title: "The master copy",
          body: ["Pages, design, photography, code. The brochure master. Claude sessions edit here; the live site reprints from here."],
        },
        {
          tone: "plain", title: "Also the database",
          body: ["There is no separate database. News stories and every investor-platform dataset are files in the repository, which is why exports, backups and Claude edits all work the same way."],
        },
        {
          tone: "plain", title: "Also the audit trail",
          body: ["Every change is a commit: dated, described, attributed, reversible. “What changed this month?” is a question Claude can answer from the history."],
        },
      ],
      panelH: 2.6,
      notes: "The no-separate-database point surprises technical guests. It is deliberate: one system of record, one backup story, one audit trail. And it makes the whole platform portable.",
    },
    {
      type: "panels",
      label: "Vercel",
      title: "Vercel: the printing press.",
      intro: "Vercel watches the repository and turns the master copy into the fast, public website, automatically.",
      cols: 3,
      panels: [
        {
          tone: "plain", title: "Builds & hosting",
          body: ["Each merged commit triggers a rebuild: the “reprint”. A few minutes later the new version is what visitors get, worldwide."],
        },
        {
          tone: "plain", title: "Environment settings",
          body: ["Vercel also holds the site's private settings: admin accounts, signing secrets, the repository token, the email key. Changing one requires a redeploy to take effect."],
        },
        {
          tone: "plain", title: "Domains",
          body: ["satisgroup.co.uk and www.satisgroup.co.uk are attached to the project in Vercel's domain settings, which tell 123 Reg's DNS where to point."],
        },
      ],
      panelH: 2.6,
      notes: "The redeploy rule is the recurring gotcha across sessions: settings changes only apply to new deployments. The live site's files are read-only by design. The printed brochure again.",
    },
    {
      type: "diagram",
      label: "The journey",
      title: "How a change travels, and how long it takes.",
      draw: (s, T) => {
        const y = 3.15, h = 1.05, w = 2.62, gap = 0.55;
        const xs = [MX + 0.15, MX + 0.15 + (w + gap), MX + 0.15 + 2 * (w + gap), MX + 0.15 + 3 * (w + gap)];
        T.node(s, { x: xs[0], y, w, h, label: "1 · Change is made", sub: "Claude session, or a studio Save" });
        T.node(s, { x: xs[1], y, w, h, label: "2 · Commit lands in GitHub", sub: "recorded in the history", fillDark: true });
        T.node(s, { x: xs[2], y, w, h, label: "3 · Vercel rebuilds", sub: "automatic; nothing to press" });
        T.node(s, { x: xs[3], y, w, h, label: "4 · Live", sub: "verify on the page itself" });
        for (let i = 0; i < 3; i++) T.arrow(s, xs[i] + w, y + h / 2, xs[i + 1], y + h / 2);
        T.arrowLabel(s, "SECONDS", xs[0] + w - 0.2, y - 0.35, gap + 0.4);
        T.arrowLabel(s, "STARTS ITSELF", xs[1] + w - 0.2, y - 0.35, gap + 0.4);
        T.arrowLabel(s, "A FEW MINUTES", xs[2] + w - 0.2, y - 0.35, gap + 0.4);
        s.addText([
          { text: "The practical rule: ", options: { fontSize: 11.5, bold: true, color: C.ink } },
          { text: "give any change a minute or two, then refresh the page. Not there after ten minutes? Ask Claude whether the commit pushed and the deployment succeeded; it can check both.", options: { fontSize: 11.5, color: C.muted } },
        ], { x: MX, y: 5.15, w: CW - 0.8, h: 0.7, fontFace: "Work Sans", margin: 0, lineSpacing: 17 });
      },
      notes: "This timeline is why saves 'take a minute to show' in the studio and why news stories appear after a short delay when published through Claude. Teams that internalise step 3 stop reporting false alarms.",
    },
    {
      type: "panels",
      label: "123 Reg",
      title: "123 Reg: where the name and the mailboxes live.",
      intro: "123 Reg is the domain registrar: the company the satisgroup.co.uk name is registered with. It plays two roles:",
      cols: 2,
      panels: [
        {
          tone: "plain", title: "The address book (DNS)",
          body: [
            "DNS records at 123 Reg point satisgroup.co.uk (and www) at Vercel, so the name reaches the website.",
            "Touched rarely: at go-live, or if hosting ever moves. Vercel's domain settings state exactly what the records must say.",
          ],
        },
        {
          tone: "plain", title: "The mailboxes",
          body: [
            "The @satisgroup.co.uk email addresses are mailboxes managed alongside the domain, including the enquiries inbox (noreply.ai@satisgroup.co.uk) that the website's forms and email links feed. Webinar 07 covers it.",
            "Website and mailboxes are independent: a site deploy can never break email, and vice versa.",
          ],
        },
      ],
      panelH: 2.75,
      notes: "Keep this practical: 123 Reg is logged into rarely and carefully. Its two jobs are pointing the name at Vercel and hosting the mailboxes. The independence point matters during incidents: broken email is never caused by a website deploy.",
    },
    {
      type: "table",
      label: "Settings",
      title: "The settings that matter.",
      intro: "All live in Vercel → project → Settings → Environment Variables. Every change needs a redeploy to take effect.",
      headers: ["Setting", "What it does", "When you touch it"],
      colW: [3.2, 5.3, 3.6],
      rows: [
        ["SATIS_ADMIN_USERS", "The list of admin accounts: who can sign in at /admin.", "Adding, resetting or removing an admin (webinar 03)."],
        ["SATIS_ADMIN_SECRET", "Signs admin sessions so they cannot be forged.", "Set once at setup; rotate if ever exposed."],
        ["SATIS_INVESTOR_SECRET", "The same, for investor portal sessions.", "Optional; falls back to the admin secret."],
        ["SATIS_GITHUB_TOKEN", "Lets platform-studio saves commit to the repository from the live site.", "Set once; renew when it expires (next slide)."],
        ["SATIS_RESEND_API_KEY", "Lets the contact and investor forms send enquiry email (via Resend).", "Set once; check first if forms report send failures."],
        ["SATIS_ENQUIRY_TO", "Where form enquiries land (SATIS_CONTACT_TO can split contact-form traffic).", "Only to change the destination inbox."],
        ["NEXT_PUBLIC_SITE_URL", "The site's official address for links and search engines.", "Already https://www.satisgroup.co.uk; leave it."],
      ],
      notes: "Nobody needs to memorise these. The table exists so the names aren't scary when they appear in error messages or guides. The three that come up in practice: SATIS_ADMIN_USERS (webinar 03), SATIS_GITHUB_TOKEN (next slide), and SATIS_RESEND_API_KEY (webinar 07).",
    },
    {
      type: "steps",
      label: "The repository token",
      title: "The token that lets Saves stick on the live site.",
      intro: "On the live site, every platform-studio Save quietly becomes a commit to the repository, powered by one credential: SATIS_GITHUB_TOKEN. When it is missing or expired, the studio warns that changes will not save. Renewal:",
      steps: [
        { n: 1, title: "Generate a fine-grained token in GitHub", body: "Satis Group GitHub account → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token." },
        { n: 2, title: "Scope it tightly", body: "Access to only the satis-group-website repository, with “Contents: Read and write” permission. Nothing more." },
        { n: 3, title: "Store it in Vercel and redeploy", body: "Add it as the SATIS_GITHUB_TOKEN environment variable, redeploy, and the studio's warning disappears." },
      ],
      aside: {
        tone: "tip",
        title: "Tokens expire on purpose",
        body: ["GitHub gives every token an expiry date. When the studio starts warning again, that is all it is: generate a new token and update the variable. Ask Claude to walk through it the first time."],
        h: 2.15,
      },
      stepsW: 7.9,
      notes: "This is the one piece of periodic maintenance the platform has. Symptoms of an expired token: studio warns on load, or Saves refuse. News stories are unaffected either way; they always go the Claude route on live hosting.",
    },
    {
      type: "panels",
      label: "Protections",
      title: "The protections already in place.",
      intro: "Plain-English versions of the security measures the site ships with:",
      cols: 3,
      panels: [
        {
          tone: "plain", title: "Getting in",
          body: ["Passwords stored one-way scrambled (never readable). Five wrong tries pauses a connection for 15 minutes. Sessions expire after 24 hours."],
        },
        {
          tone: "plain", title: "The private areas",
          body: ["/admin and the portal are hidden from search engines and linked from nowhere public. Investor data is assembled per account: one investor's browser never receives another's figures."],
        },
        {
          tone: "plain", title: "The transport",
          body: ["Everything is served over HTTPS with strict browser protections (no framing by other sites, no content-type games). The site sends security headers on every response."],
        },
      ],
      panelH: 2.6,
      notes: "Aimed at giving the room confident answers to investor questions. The per-account assembly point is worth repeating: it isn't that other data is hidden. It is never sent.",
    },
    {
      type: "panels",
      label: "Outside feeds",
      title: "Where the site talks to the outside world.",
      cols: 3,
      panels: [
        {
          tone: "plain", title: "HM Land Registry: market data in",
          body: [
            "The portal's Market intelligence section pulls the UK House Price Index for the local area, refreshed roughly twice a day.",
            "If the feed is slow or down, the site quietly falls back to a stored snapshot. Data either way, never an error.",
          ],
        },
        {
          tone: "plain", title: "GitHub releases: version lookup",
          body: [
            "The appraisal download page asks GitHub which app version is newest, so the page names it without anyone editing.",
            "If the lookup fails, the download buttons still work; only the version line hides.",
          ],
        },
        {
          tone: "plain", title: "Resend: enquiry email out",
          body: [
            "Form submissions are handed to Resend for delivery to the enquiries inbox.",
            "If sending fails, the visitor is shown the team's address to write directly. An enquiry is never dropped silently.",
          ],
        },
      ],
      panelH: 2.5,
      notes: "All three fail soft. The design habit across the site: an outside dependency going down degrades a detail, never a page, and never silently. Good answer material for 'what happens if X is down?'.",
    },
    {
      type: "table",
      label: "Troubleshooting",
      title: "When something misbehaves: symptom → first move.",
      headers: ["Symptom", "What it usually is", "First move"],
      colW: [4.0, 4.1, 4.0],
      rows: [
        ["A change isn't showing on the live site", "The rebuild hasn't finished, or the commit never pushed", "Wait two minutes and refresh; then ask Claude to check commit and deployment"],
        ["Studio warns “changes will not save”", "The repository token is missing or expired", "Renew SATIS_GITHUB_TOKEN (this session), redeploy"],
        ["“Could not write the newsletter file”", "Normal on live hosting: stories go through the repository", "Publish via a Claude session (webinar 02)"],
        ["Admin or investor can't sign in", "Wrong door, throttle, or expired session", "Webinars 03 / 04 playbooks; which door first"],
        ["A form says “We could not send that just now”", "The email key (SATIS_RESEND_API_KEY) is missing or invalid", "Check the key in Vercel, redeploy; the visitor was shown the direct address meanwhile"],
        ["Whole site unreachable", "Hosting or DNS, not content", "Check Vercel status; then the domain's DNS at 123 Reg; call the development team"],
      ],
      notes: "The point of the table: route the panic. Content problems are Claude sessions; save problems are the token; sign-in problems are the playbooks; reachability is Vercel/123 Reg. Nothing on this list is fixed by editing the live site. There is no such lever.",
    },
    {
      type: "panels",
      label: "Honest state",
      title: "What the machine deliberately doesn't have (yet).",
      intro: "Worth knowing so nothing on this map is assumed:",
      cols: 3,
      panels: [
        {
          tone: "plain", title: "No separate database",
          body: ["By design: the repository is the system of record. Everything in webinars 02 and 04 relies on exactly this."],
        },
        {
          tone: "plain", title: "No newsletter mailing yet",
          body: ["Publishing a story emails nobody automatically, and the subscriber list is mid-rollout. The sending rail (Resend) is in place; connecting the two is a small job once the list lands."],
        },
        {
          tone: "plain", title: "No visitor analytics yet",
          body: ["No tracking scripts run on the site today. If usage numbers become a need, adding a privacy-friendly analytics tool is a small, one-session job."],
        },
      ],
      panelH: 2.5,
      notes: "Transparency slide. It prevents wrong assumptions downstream. Each gap has a clear, small path to close when the business wants it.",
    },
  ],
  takeaways: [
    "One direction of travel: you → GitHub (master copy) → Vercel (rebuild) → the live site.",
    "GitHub is also the database and the audit trail. There is no separate database.",
    "Vercel holds the settings; every settings change needs a redeploy.",
    "123 Reg owns the name and the mailboxes; website and email are independent.",
    "One periodic job: renew SATIS_GITHUB_TOKEN when the studio starts warning.",
  ],
  help: [
    "Written chapters: /admin/guide → “Making changes stick on live hosting” and the glossary.",
    "Deployment questions: ask Claude. It can check commits and deploys.",
    "Vercel or 123 Reg access: the development team holds the keys.",
  ],
};
