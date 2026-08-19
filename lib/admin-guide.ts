// The operations guide content. Every chapter of /admin/guide is data in
// this file; the pages render it. Screenshots live in public/admin-guide/
// and are regenerated with scripts/capture-guide-screenshots.mjs whenever
// the admin screens change.

export type GuideMarker = { n: number; text: string };

export type GuideScreenshot = {
  src: string;
  alt: string;
  /** Intrinsic pixel size — captured at 2× so display size is half. */
  width: number;
  height: number;
  caption?: string;
  markers?: GuideMarker[];
};

export type GuideCallout = {
  tone: "tip" | "warning" | "check" | "term";
  title: string;
  body: string[];
};

export type GuideStep = {
  title: string;
  body?: string[];
  /** Short indented sub-steps rendered as a lettered list. */
  substeps?: string[];
  screenshot?: GuideScreenshot;
  callouts?: GuideCallout[];
};

export type GuideFaq = { q: string; a: string[] };

export type GuideChapter = {
  slug: string;
  group: string;
  title: string;
  /** Short line for the hub card. */
  summary: string;
  /** Opening paragraphs on the chapter page. */
  lede: string[];
  time?: string;
  youNeed?: string[];
  steps: GuideStep[];
  faqs?: GuideFaq[];
  faqsTitle?: string;
};

const shot = (
  src: string,
  alt: string,
  width: number,
  height: number,
  markers?: GuideMarker[],
  caption?: string
): GuideScreenshot => ({ src: `/admin-guide/${src}`, alt, width, height, markers, caption });

const tip = (title: string, ...body: string[]): GuideCallout => ({ tone: "tip", title, body });
const warn = (title: string, ...body: string[]): GuideCallout => ({ tone: "warning", title, body });
const check = (...body: string[]): GuideCallout => ({
  tone: "check",
  title: "What you should see",
  body,
});
const term = (title: string, ...body: string[]): GuideCallout => ({ tone: "term", title, body });

export const GUIDE_GROUPS = [
  "Getting started",
  "Publishing",
  "Investor platform",
  "Website & hosting",
  "Reference",
] as const;

export const GUIDE_CHAPTERS: GuideChapter[] = [
  // ──────────────────────────────── Getting started ─────────────────────────
  {
    slug: "signing-in",
    group: "Getting started",
    title: "Signing in and finding your way around",
    summary:
      "How to open the admin area, sign in safely, understand the four sections, and sign out.",
    lede: [
      "Everything you can manage — news, investor accounts, project figures, reports — lives behind one private admin area. This chapter shows you how to get in and what each part does. No technical knowledge is needed; if you can use online banking, you can use this.",
      "You can never break the public website by looking around. Nothing changes until you press a Save or Publish button, and this guide flags every button that does.",
    ],
    time: "About 5 minutes",
    youNeed: ["Your admin username and password", "A web browser on a computer (the admin screens work best on a laptop or desktop)"],
    steps: [
      {
        title: "Open the admin area",
        body: [
          "In your web browser's address bar (the long box at the very top of the window), type the website address followed by /admin — for example www.satisgroup.co.uk/admin — and press Enter.",
          "You will see the Satis Group page with two boxes: Username and Password. Search engines cannot find this page, and nothing on the public website links to it, so it helps to bookmark it now: press Ctrl+D on Windows or Cmd+D on a Mac.",
        ],
        screenshot: shot("signin.png", "The admin sign-in form with the username box, password box and sign-in button highlighted", 1048, 604, [
          { n: 1, text: "Type your admin username here." },
          { n: 2, text: "Type your password here. The letters show as dots — that is normal." },
          { n: 3, text: "Click Sign in (or just press Enter)." },
        ]),
        callouts: [
          warn(
            "Five wrong tries locks you out for 15 minutes",
            "If you mistype the password five times, the site stops accepting attempts from your connection for 15 minutes. This is deliberate — it stops strangers guessing the password. Wait 15 minutes and try again; nothing is broken."
          ),
        ],
      },
      {
        title: "Get your bearings on the control room page",
        body: [
          "After signing in you land on the control room — the front door to everything. It shows four cards; each one opens a different tool. Click anywhere on a card to open it, and use your browser's Back button (the ← arrow at the top left of the browser) to return here at any time.",
        ],
        screenshot: shot("home.png", "The admin control room with its four section cards and the sign-out button highlighted", 2720, 2964, [
          { n: 1, text: "Newsletter — write and publish news stories for the public News page." },
          { n: 2, text: "Investors — the investor platform studio: accounts, developments, cap tables, reports and raises." },
          { n: 3, text: "Instructions — this guide." },
          { n: 4, text: "Appraisal agent download — install the Satis Appraisal desktop app, with its own step-by-step instructions on the page." },
          { n: 5, text: "Sign out when you are finished, especially on a shared computer." },
        ]),
        callouts: [
          check(
            "The heading reads “Satis Group control room.” and four numbered cards are visible. If you still see the sign-in boxes, the username or password was not accepted — try again slowly."
          ),
        ],
      },
      {
        title: "Know when your session ends",
        body: [
          "Once signed in, you stay signed in for 24 hours on that browser, even if you close the tab. After 24 hours the site quietly signs you out; the next time you open an admin page you will simply see the sign-in boxes again. Sign in again and carry on — nothing you saved is lost.",
          "When you finish a session on a shared or public computer, always press Sign out (bottom of the control room page) so the next person at the keyboard cannot reach the admin area.",
        ],
      },
    ],
    faqsTitle: "If something goes wrong",
    faqs: [
      {
        q: "It says “Incorrect username or password.”",
        a: [
          "Check for Caps Lock (passwords care about capital letters), and make sure there is no space before or after what you typed. If you use a password manager, let it fill the boxes for you.",
        ],
      },
      {
        q: "It says “Too many attempts. Please try again later.”",
        a: [
          "You (or someone on your internet connection) got the password wrong five times. Wait 15 minutes, then try again carefully. If you have genuinely forgotten the password, ask whoever manages the hosting to reset it.",
        ],
      },
      {
        q: "I see a note about a “demo signing secret” or test/test.",
        a: [
          "The site starts life with demonstration credentials (username test, password test) so it can be tried safely. That yellow-flagged note on the control room is a reminder to the development team to set real credentials before real investor data goes in. If you can see it, mention it to whoever looks after the website.",
        ],
      },
    ],
  },

  // ─────────────────────────────────── Publishing ───────────────────────────
  {
    slug: "publish-news",
    group: "Publishing",
    title: "Publishing a news story",
    summary:
      "Write a story in the newsletter studio and see it appear on the public News page — with the simple formatting rules explained.",
    lede: [
      "News stories (the site calls them “issues”) are written in the newsletter studio and appear on the public News page the moment you press Publish. This chapter walks through writing one from scratch, checking it, and fixing a mistake afterwards.",
    ],
    time: "10–15 minutes for a typical story",
    youNeed: [
      "To be signed in (see “Signing in and finding your way around”)",
      "The story you want to tell — a title, the date, and a few paragraphs",
    ],
    steps: [
      {
        title: "Open the newsletter studio",
        body: [
          "From the control room, click the Newsletter card. You will see a form on the left headed “New issue” and, on the right, the list of everything already published — newest first. That right-hand list is also the quickest way to re-read a live story: click any title to open it exactly as visitors see it.",
        ],
      },
      {
        title: "Fill in the four boxes",
        body: [
          "Work top to bottom. Every box must be filled in before Publish will work.",
        ],
        substeps: [
          "Title — the headline, e.g. “The Courthouse launches in Macclesfield”. Keep it short and factual; it becomes the story's web address too.",
          "Date — today's date is already filled in. Click it to pick a different day from the little calendar if you are publishing something backdated.",
          "Summary — one plain sentence shown under the headline in the news list. Think of it as the story in fifteen words.",
          "Body — the story itself. Type normal paragraphs and press Enter twice (leaving one empty line) between them.",
        ],
        screenshot: shot("newsletter.png", "The newsletter studio with the title, date, summary and body boxes, the publish button, and the published issues list highlighted", 2720, 3834, [
          { n: 1, text: "Title — the headline." },
          { n: 2, text: "Date — pre-filled with today; click to change." },
          { n: 3, text: "Summary — the one-liner for the news list." },
          { n: 4, text: "Body — the story, in plain paragraphs." },
          { n: 5, text: "Publish issue — the story goes live the moment you click this." },
          { n: 6, text: "Published issues — click any title to read it as visitors do." },
        ]),
        callouts: [
          tip(
            "Two formatting tricks (both optional)",
            "Section heading: start a line with ## followed by a space — e.g. “## What happens next” becomes a bold sub-heading.",
            "Bullet list: start each line with a dash and a space — e.g. “- Planning approved in May”. Consecutive dash lines become one bulleted list.",
            "Everything else is just normal typing. There is no bold/italic toolbar — the site styles the story for you so every story matches the house look."
          ),
        ],
      },
      {
        title: "Publish and check your work",
        body: [
          "Click Publish issue. Two things confirm it worked: a message appears under the form saying “Issue published.” with a link, and the story appears at the top of the Published issues list on the right.",
          "Click the link in the confirmation message to read the live story. Check the headline, the date and a quick skim of the text — it is much easier to spot a typo on the finished page than in the typing box.",
        ],
        screenshot: shot("news-public.png", "The public news page's past-updates list where published issues appear to visitors", 2720, 3874, undefined, "The “What we've been up to” list on the public News page — your story appears here immediately, newest first."),
        callouts: [
          check(
            "The confirmation message shows a link like /news/2026-08-19-your-headline, the story is top of the Published issues list, and opening the public News page shows it at the top."
          ),
          warn(
            "Publishing is immediate and public",
            "There is no draft mode. The moment you press Publish issue, anyone on the internet can read the story. If you want a second pair of eyes first, write the text in an email or document, get it agreed, then paste it in and publish."
          ),
        ],
      },
      {
        title: "Fix a mistake in a published story",
        body: [
          "The studio deliberately refuses to overwrite an existing issue — if you publish again with the same title and date it will say “An issue named … already exists.” That protects you from accidentally replacing a story. To correct one:",
        ],
        substeps: [
          "For a small typo, the simplest route is to ask Claude in a session on the website repository: “In the news issue titled X, change … to …” — see the chapter “Making changes with Claude”.",
          "To replace a story yourself, ask Claude (or the development team) to remove the original file from content/newsletters/ first, then publish the corrected version with the same title and date.",
          "If the story went out with the wrong date or headline, publish the corrected story fresh (new date or headline), then have the old one removed.",
        ],
      },
    ],
    faqsTitle: "If something goes wrong",
    faqs: [
      {
        q: "It says “Could not write the newsletter file” on the live site.",
        a: [
          "The live hosting keeps its files read-only — a safety feature of the platform, not a fault. Stories published there need to go through the repository instead: copy your text, then follow the chapter “Making changes stick on live hosting”. In a writable environment (a Claude session, or the site running locally) the same form saves instantly.",
        ],
      },
      {
        q: "It says “That date doesn't exist”.",
        a: ["The date must be a real calendar day in year-month-day order (e.g. 2026-08-19). Check the day and month are not swapped."],
      },
      {
        q: "My paragraphs ran together into one block.",
        a: ["There must be a completely empty line between paragraphs — press Enter twice at the end of each paragraph, not once."],
      },
    ],
  },
  {
    slug: "monthly-reports",
    group: "Publishing",
    title: "Publishing a monthly report to investors",
    summary:
      "Send invested clients their monthly project report — summary, task list, and an optional downloadable PDF.",
    lede: [
      "Every month, invested clients expect a report on each project: what happened, what is on track, what comes next. Reports are published from the Monthly reports tab of the platform studio and appear in each invested client's portal immediately.",
      "Only invested accounts see monthly reports. Prospective investors do not — so you never need to worry about a prospect reading construction detail meant for committed investors.",
    ],
    time: "About 15 minutes per report",
    youNeed: [
      "The month's progress notes for the development",
      "Optionally, the full report as a PDF if you want investors to download it",
    ],
    steps: [
      {
        title: "Open the Monthly reports tab",
        body: [
          "From the control room click Investors, then click the Monthly reports tab in the bar across the top of the studio. The left side lists every report already published; the right side is the “Publish monthly report” form.",
        ],
      },
      {
        title: "Fill in the report form",
        substeps: [
          "Development — pick which project this report is about from the drop-down list.",
          "Date — the publish date, written year-month-day, e.g. 2026-08-31.",
          "Category — one word for the kind of update, e.g. Construction, Planning or Lettings. It shows as a small label on the report.",
          "Period — the month the report covers, written out, e.g. “August 2026”. This is the headline investors see.",
          "Report file — leave empty for now; step 3 explains how to attach the PDF.",
          "Title — a one-line headline for the month, e.g. “Frame complete to level three”.",
          "Summary — a paragraph or two on the month: progress, issues, next steps.",
          "Tasks — one line per work item, each written as three parts separated by spaced dashes: Title — detail — status. For example: “Superstructure — Frame at level three — On programme”.",
        ],
        screenshot: shot("report-form.png", "The publish monthly report form with its fields highlighted", 1288, 1724, [
          { n: 1, text: "Development — which project the report covers." },
          { n: 2, text: "Period — e.g. “August 2026”; the headline investors see." },
          { n: 3, text: "Report file — the path to an uploaded PDF, if there is one." },
          { n: 4, text: "Title — the month's one-line headline." },
          { n: 5, text: "Summary — the narrative for the month." },
          { n: 6, text: "Tasks — one per line: Title — detail — status." },
          { n: 7, text: "Publish report — sends it to every invested client on this project." },
        ]),
        callouts: [
          tip(
            "Why the task list matters",
            "Each task line becomes its own item in the investor's portal, and investors can ask a question about any single task directly from the report. Specific, honest task lines (“Roof — weathertight — two weeks behind, recovery plan agreed”) generate fewer worried phone calls than vague ones."
          ),
        ],
      },
      {
        title: "Attach the full PDF (optional)",
        body: [
          "The Report file box does not upload the PDF itself — it records where the PDF lives on the website. Getting the file there is a one-off step per report:",
        ],
        substeps: [
          "Ask Claude in a session on the website repository: “Add this PDF as public/investor-reports/august-2026.pdf” and attach the file — or ask the development team to do the same.",
          "Back in the form, type the matching path into Report file, starting with a slash: /investor-reports/august-2026.pdf",
          "If you skip this, the report still publishes fine — the download button in the portal just stays an inactive placeholder until a file is added.",
        ],
      },
      {
        title: "Publish and verify",
        body: [
          "Click Publish report. The new report appears at the top of the list on the left, showing its period, how many tasks it carries, and whether a report file is attached (“report uploaded” or “no report file yet”).",
          "To see exactly what investors see, sign in to the investor portal with an invested test account and open Monthly reports — see the chapter “Helping investors sign in” for how.",
        ],
        callouts: [
          check(
            "The report is top of the left-hand list with the right period and task count. If a task line looks wrong in the portal, check every task line has its two “ — ” separators."
          ),
        ],
      },
    ],
  },
  {
    slug: "insights",
    group: "Publishing",
    title: "Writing an insight article",
    summary:
      "Publish research and market commentary into the investor portal, with headings, bullets and pull quotes.",
    lede: [
      "Insights are the research and market-commentary articles investors read inside the portal — both invested and prospective accounts see them. They are written on the Insights tab of the platform studio, in the same plain-typing style as news stories, with one extra trick: pull quotes.",
    ],
    time: "Publishing itself: 5 minutes",
    steps: [
      {
        title: "Open the Insights tab",
        body: [
          "From the control room click Investors, then the Insights tab. Published articles are listed on the left; the “Compose insight article” form is on the right.",
        ],
      },
      {
        title: "Fill in the article details",
        substeps: [
          "Title — the article headline.",
          "Category — one or two words shown on the article card, e.g. “Market note” or “Research”.",
          "Date — year-month-day, e.g. 2026-08-19.",
          "Read time — how long it takes to read, e.g. “6 min”. A rough guess is fine: about one minute per 200 words.",
          "Card colour — which of the three house colours the article's card uses in the portal. Pick whichever balances the page; it is purely cosmetic.",
          "Slug — leave empty. It is the article's web address and is worked out from the title automatically.",
          "Summary — one or two sentences shown on the card.",
          "Article body — the article itself, using the formatting rules below.",
        ],
        screenshot: shot("insight-form.png", "The compose insight article form with its fields highlighted", 1454, 1984, [
          { n: 1, text: "Title — the headline." },
          { n: 2, text: "Category — the label on the card, e.g. “Market note”." },
          { n: 3, text: "Date — year-month-day." },
          { n: 4, text: "Summary — the one-liner on the card." },
          { n: 5, text: "Article body — plain paragraphs plus the formatting tricks." },
          { n: 6, text: "Publish insight — the article appears in the portal immediately." },
        ]),
        callouts: [
          tip(
            "Formatting inside the body",
            "Paragraphs: leave one empty line between them (press Enter twice).",
            "Section heading: start the line with ## and a space.",
            "Bullet list: start each line with - and a space.",
            "Pull quote: start the line with > and a space — e.g. “> Manchester rents rose 9% year on year”. To credit someone, make the next line a dash and their name: “— Savills Research, 2026”.",
            "Richer blocks (statistic rows, tables, coloured callouts) exist too, but are added through the JSON importer — ask Claude to add one, or see “Bulk import and export”."
          ),
        ],
      },
      {
        title: "Publish and review",
        body: [
          "Click Publish insight. The article appears at the top of the left-hand list with its slug shown — that slug is its address in the portal.",
          "To update a published article, type its exact slug into the Slug box and publish again — reusing a slug deliberately replaces that article. This is the opposite of news stories (which refuse to overwrite), so double-check the slug box is empty when you mean to publish something new.",
        ],
        callouts: [
          check("The article is top of the Published insights list, and its category, date and read time look right."),
        ],
      },
    ],
  },

  // ─────────────────────────────── Investor platform ────────────────────────
  {
    slug: "platform-tour",
    group: "Investor platform",
    title: "How the investor platform fits together",
    summary:
      "The five-minute mental model: seven tabs, two kinds of investor, and the one golden rule about where figures come from.",
    lede: [
      "Before touching the platform studio it is worth five minutes to understand how it thinks. Everything an investor sees in their portal — their portfolio value, their positions, the reports, the raises — is generated from a handful of datasets you edit in one place: the platform studio at Investors on the control room.",
    ],
    time: "5 minutes of reading — no clicking required",
    steps: [
      {
        title: "The seven tabs",
        body: [
          "The studio is organised as seven tabs along the top. Each tab edits one kind of information, and the small number on a tab shows how many records it currently holds.",
        ],
        screenshot: shot("platform-tabs.png", "The platform studio's seven tabs", 2492, 314, [
          { n: 1, text: "Investors — the accounts investors sign in with, plus their quarterly valuations." },
          { n: 2, text: "Developments & SPVs — each project: progress, phase, key dates, and the company (SPV) that owns it." },
          { n: 3, text: "Cap tables & returns — who owns what share of each SPV, and the money flowing in and out." },
          { n: 4, text: "Monthly reports — the monthly project updates investors read." },
          { n: 5, text: "Insights — research and market commentary articles." },
          { n: 6, text: "Opportunities — upcoming raises shown to investors as deal flow." },
          { n: 7, text: "Import / export — download everything as one file, or load a prepared file in bulk." },
        ]),
        callouts: [
          term(
            "Plain English: SPV and cap table",
            "SPV (special purpose vehicle) — the limited company set up to own one development. Investors buy shares in the SPV, not the building directly.",
            "Cap table (capitalisation table) — the list of who owns what percentage of an SPV. If the cap table says an investor holds 10%, they own 10% of that company."
          ),
        ],
      },
      {
        title: "The golden rule: portfolio values are worked out, not typed in",
        body: [
          "You never type an investor's portfolio value anywhere. The platform works it out: an investor's stake in a project = their share % (from the cap table) × the SPV's current equity value (from the Developments & SPVs tab). Their portfolio value is the sum of those stakes.",
          "This has a very useful consequence: when a project is revalued, you update one number — the SPV's equity value — and every investor's figures update themselves, correctly, at the same moment. It also means that if a figure in a portal looks wrong, the cause is always one of two numbers: that investor's share %, or the SPV's equity value.",
        ],
      },
      {
        title: "Two kinds of investor account",
        body: [
          "Every account is either prospective or invested, and the portal shows each kind a different experience:",
        ],
        substeps: [
          "Prospective — someone considering investing. They see the data room, the current raises, the track record and the research — but no cap tables, no financials, no monthly reports.",
          "Invested — someone with money in. They see everything: their positions and values, cash-flow history, monthly reports, plus all the prospective material.",
        ],
        screenshot: shot("investor-portal.png", "The investor portal as an invested client sees it", 2720, 1800, undefined, "What an invested client sees after signing in at /investors — every figure on this screen traces back to something you edit in the studio."),
        callouts: [
          tip(
            "You rarely need to set the type by hand",
            "The platform derives the type automatically: an account holding a cap-table position counts as invested, one without counts as prospective. The Account type drop-down on the investor form exists for the rare case where you need to override that."
          ),
        ],
      },
      {
        title: "Where changes take effect — and the one big caveat",
        body: [
          "In a writable environment (the site running locally, or a Claude Code session), every Save button in the studio takes effect immediately. On the live Vercel hosting, the deployed files are read-only and Save buttons will politely refuse, telling you why.",
          "This is not a fault — it is how the hosting keeps the site safe and fast. The chapter “Making changes stick on live hosting” walks through the routine that works everywhere: export, edit, commit.",
        ],
      },
    ],
  },
  {
    slug: "add-investor",
    group: "Investor platform",
    title: "Creating an investor account",
    summary:
      "Set up a new investor's login, choose what they can see, and hand over their credentials safely.",
    lede: [
      "A new investor needs an account before they can sign in to the portal at /investors. Creating one takes about five minutes. If they have committed money, you will also record their holding afterwards — that part is the next chapter.",
    ],
    time: "About 5 minutes",
    youNeed: [
      "The investor's (or their company's) name",
      "The email address they will sign in with",
      "A first name for greetings in the portal",
    ],
    steps: [
      {
        title: "Open the Investors tab",
        body: [
          "From the control room click Investors. The studio opens on the Investors tab: existing accounts on the left (each showing its portfolio value and number of positions), and two forms on the right. You want the top one, “Add or update investor”.",
        ],
      },
      {
        title: "Fill in the account form",
        substeps: [
          "Account / entity name — the investor's name as it should appear in their portal, e.g. “Hartwell Family Office”.",
          "Contact first name — the person's first name, used for greetings (“Good morning, James”).",
          "Account ID — leave empty. The platform derives a short internal ID from the name. You only ever type one here to update an existing account (see step 5).",
          "Login email — the address they will type to sign in. Double-check the spelling: a typo here means they cannot get in.",
          "Account type — leave as it is unless you have a reason not to. The platform works the type out from whether they hold a position (see the platform tour chapter).",
          "Password — type a starting password for them. It is scrambled (“hashed”) the instant you save, so it is never stored or visible anywhere afterwards — make a note of it now.",
        ],
        screenshot: shot("investor-form.png", "The add or update investor form with each field highlighted", 1288, 1330, [
          { n: 1, text: "Account / entity name — shown in their portal." },
          { n: 2, text: "Contact first name — used for greetings." },
          { n: 3, text: "Account ID — leave empty for a new account." },
          { n: 4, text: "Login email — what they sign in with. Check the spelling." },
          { n: 5, text: "Account type — usually leave as is; the platform derives it." },
          { n: 6, text: "Password — noted down now, because it is unreadable after saving." },
          { n: 7, text: "Save investor — creates the account." },
        ]),
        callouts: [
          term(
            "Plain English: hashed",
            "Hashing is one-way scrambling. The site can check a typed password is right, but nobody — including you — can read it back. That is why you note the starting password before saving, and why “remind me of my password” is impossible: you can only set a new one."
          ),
        ],
      },
      {
        title: "Save and check",
        body: [
          "Click Save investor. A green confirmation appears under the form, and the new account appears in the list on the left showing “Prospective investor”, £0 portfolio value and 0 positions — exactly right for an account with no holdings yet.",
        ],
        callouts: [
          check(
            "The account is in the left-hand list with the right name and email. Its ID (shown as “ID …” on the card) is worth noting — you use it to update the account later."
          ),
        ],
      },
      {
        title: "Hand over their credentials — safely",
        body: [
          "Tell the investor their login email and starting password over a trusted channel: ideally by phone, or split across two channels (email address by email, password by text message). Never send both together in one email — if that email is ever compromised, so is their portal.",
          "Encourage them to sign in promptly at the website's Investors page. If they have trouble, the chapter “Helping investors sign in” covers every common case.",
        ],
      },
      {
        title: "Updating an existing account",
        body: [
          "The same form edits accounts: type the account's exact ID (shown on its card in the left-hand list) into the Account ID box, fill in the fields, and save. Whatever you type replaces what was there — and a blank Password box keeps their current password, so you never accidentally reset one.",
          "The Remove link on an account card deletes it. The platform will refuse to remove an account that still holds cap-table positions — clear those first (next chapter). Removal cannot be undone, so when in doubt, don't.",
        ],
      },
      {
        title: "If they have invested: record their holding",
        body: [
          "An account only shows figures once it holds a position in an SPV. Go straight to the next chapter, “Cap tables, holdings and cash events”, to record their committed capital and share percentage.",
        ],
      },
    ],
  },
  {
    slug: "captables",
    group: "Investor platform",
    title: "Cap tables, holdings and cash events",
    summary:
      "Record who owns what share of each project, and log the capital calls, distributions and interest that flow to investors.",
    lede: [
      "This is the money chapter. The Cap tables & returns tab records two things: positions (who owns what percentage of which SPV, and what they paid for it) and cash events (money moving — capital calls, distributions, interest). Between them they drive every financial figure an invested client sees.",
      "Take these edits slowly and check each one after saving. The forms validate what they can — a cap table can never exceed 100% — but only you know whether the numbers themselves are right.",
    ],
    time: "5 minutes per position or event",
    youNeed: [
      "The development the money relates to",
      "The investor's committed amount and agreed share percentage (for a position)",
      "The amount, date and type of any cash movement (for an event)",
    ],
    steps: [
      {
        title: "Open the Cap tables & returns tab",
        body: [
          "From the control room click Investors, then the Cap tables & returns tab. The tab has two halves stacked vertically: SPV cap tables (positions) at the top, and Project returns & cash events below.",
        ],
      },
      {
        title: "Record a position (a holding in an SPV)",
        substeps: [
          "Development / SPV — pick which project the holding is in.",
          "Platform investor — pick the investor's account. (Only use the External holder box instead when recording a shareholder who has no portal account — for example the Satis Group's own stake. Fill one or the other, not both.)",
          "Committed — the money they put in, e.g. £250,000. Type it with the pound sign, e.g. £250k or £250,000 — the form understands both.",
          "Share % — their agreed percentage of the SPV, e.g. 12.5.",
          "Status — Active for a live holding. Realised or Exited mark holdings that have concluded.",
        ],
        screenshot: shot("captable-form.png", "The add or update cap-table position form with each field highlighted", 1288, 1148, [
          { n: 1, text: "Development / SPV — which project the holding is in." },
          { n: 2, text: "Platform investor — the account that holds it…" },
          { n: 3, text: "…or an external holder with no portal account. One or the other." },
          { n: 4, text: "Committed — what they put in (their cost basis)." },
          { n: 5, text: "Share % — their percentage of the SPV." },
          { n: 6, text: "Save position — the investor's figures update instantly." },
        ]),
        callouts: [
          warn(
            "The 100% guard",
            "The positions in any one SPV cannot add up to more than 100% — the form will refuse and tell you the total it would have reached. If that surprises you, look at the existing positions for that SPV in the list: something already on the table holds the share you were about to allocate."
          ),
          check(
            "After saving, switch to the Investors tab: the investor's card now shows the position and a portfolio value equal to share % × the SPV's equity value. If the account was prospective, it now reads “Invested” automatically."
          ),
        ],
      },
      {
        title: "Record a cash event",
        body: [
          "Cash events are the money-movement history: what has been paid and what is forecast. Paid distributions and interest feed the investor's “distributions to date” figure; forecast events appear in their portal as upcoming cash events.",
        ],
        substeps: [
          "Investor — whose money is moving.",
          "Type — Distribution (profit paid out), Forecast distribution (planned pay-out), Capital call (asking investors to pay in), or Interest payment.",
          "Status — Paid if it has happened, Forecast if it is expected.",
          "Date — year-month-day, e.g. 2026-09-30. Forecast events use the expected date.",
          "Amount — e.g. £125,000.",
          "Related development — optional, but linking the event to its project keeps the investor's history tidy.",
        ],
        screenshot: shot("cash-event-form.png", "The record cash event form with each field highlighted", 1288, 1104, [
          { n: 1, text: "Investor — whose event this is." },
          { n: 2, text: "Type — distribution, forecast distribution, capital call or interest." },
          { n: 3, text: "Status — Paid feeds “distributions to date”; Forecast shows as upcoming." },
          { n: 4, text: "Date — year-month-day." },
          { n: 5, text: "Amount — with the pound sign." },
          { n: 6, text: "Record event — adds it to the investor's history." },
        ]),
        callouts: [
          tip(
            "When a forecast becomes real",
            "When a forecast distribution is actually paid, record a new event with status Paid, then use the Remove link on the old forecast entry in the list. Leaving both would double-count it in the investor's history."
          ),
        ],
      },
      {
        title: "Correcting a mistake",
        body: [
          "Saving a position for the same investor and SPV again replaces that position — so to fix a wrong share % or committed amount, just re-save it with the right numbers. Cash events do not replace: remove the wrong entry with its Remove link, then record it correctly.",
        ],
      },
    ],
  },
  {
    slug: "keep-figures-current",
    group: "Investor platform",
    title: "Keeping project figures current",
    summary:
      "The regular rhythm: update each development's progress and SPV equity value, and record quarterly valuations per investor.",
    lede: [
      "Investor confidence lives and dies on figures being current. Two routines keep them so: updating each development after a valuation cycle or a month of progress, and recording each investor's quarterly valuation so their value-progression chart keeps growing.",
    ],
    time: "About 10 minutes per development, quarterly or monthly",
    steps: [
      {
        title: "Update a development's progress and value",
        body: [
          "From the control room click Investors, then the Developments & SPVs tab. Every project is listed on the left; the form on the right both creates and updates them.",
          "To update an existing development, first find its ID on its card in the list (shown as “ID …”, e.g. ID court-house), and type that exact ID into the form's ID box. Then fill in the fields — everything you enter replaces what was there, so fill in the whole form, not just the field you are changing.",
        ],
        substeps: [
          "Progress % — how complete the project is, 0 to 100. This drives the progress bar investors see.",
          "Phase and Status — e.g. Construction / On programme. Short and honest.",
          "Next report date — when investors should expect the next monthly report, year-month-day.",
          "Current equity value (in the SPV section) — the one number that moves every investor's portfolio value. Update it after each valuation cycle.",
        ],
        screenshot: shot("development-form.png", "The add or update development form with the key fields highlighted", 1398, 2420, [
          { n: 1, text: "Name — and remember the ID box beside the area label when updating." },
          { n: 2, text: "Progress % — the completion figure investors see." },
          { n: 3, text: "Next report date — sets expectations in the portal." },
          { n: 4, text: "Current equity value — THE number: every linked investor's value follows it." },
          { n: 5, text: "Save development — applies the update." },
        ]),
        callouts: [
          warn(
            "Fill in the whole form when updating",
            "Saving with an existing ID replaces that development's details with what is in the form. If you fill in only the progress box, the other fields would be saved empty. Copy the current values from the card on the left into the form first, change what needs changing, then save."
          ),
          check(
            "After saving, the card on the left shows the new figures — and on the Investors tab, every investor holding that SPV shows a portfolio value that has moved with the equity value."
          ),
        ],
      },
      {
        title: "Record quarterly valuations per investor",
        body: [
          "Each investor's portal shows a value-progression chart (with 1-year, 3-year, 5-year and maximum views). It grows one point at a time: once a quarter, record each investor's portfolio value on the Investors tab using the “Record quarterly valuation” form (below the account form).",
        ],
        substeps: [
          "Investor — pick the account.",
          "Period label — the quarter, e.g. “Q3 2026”.",
          "Portfolio value — their total value that quarter, e.g. £4.82m. The Investors tab shows each account's current computed value — that figure is normally exactly what you record.",
        ],
        screenshot: shot("valuation-form.png", "The record quarterly valuation form with each field highlighted", 1288, 780, [
          { n: 1, text: "Investor — whose chart gains a point." },
          { n: 2, text: "Period label — e.g. “Q3 2026”." },
          { n: 3, text: "Portfolio value — usually the computed value shown on their card." },
          { n: 4, text: "Record valuation — adds the point to their chart." },
        ]),
        callouts: [
          tip(
            "A quarterly routine that never slips",
            "Do all three together at each quarter end: 1) update every SPV's equity value from the valuation cycle, 2) record each investor's quarterly valuation, 3) publish the monthly reports. Fifteen minutes of routine keeps every portal current at once."
          ),
        ],
      },
    ],
  },
  {
    slug: "opportunities",
    group: "Investor platform",
    title: "Advertising an upcoming raise",
    summary:
      "Show investors the deal flow: create an opportunity with its target, minimum ticket and progress bar.",
    lede: [
      "The Opportunities tab controls the deal-flow page investors see — upcoming and open raises, each with a target, progress bar and closing date. Both prospective and invested accounts see these, so this is also the shop window for prospects.",
    ],
    time: "About 10 minutes",
    steps: [
      {
        title: "Open the Opportunities tab and fill in the deal",
        body: [
          "From the control room click Investors, then Opportunities. Existing raises are listed on the left; the form is on the right.",
        ],
        substeps: [
          "Name and Location — e.g. “QUBE, Stockport” / “Stockport”.",
          "Status — Coming soon (visible but not yet open), Open (accepting commitments), or Fully subscribed (closed, shown as complete).",
          "Closes on — the deadline, year-month-day.",
          "Target raise and Raised to date — the progress bar is worked out from these two, e.g. £3.2m target with £2.1m raised shows 66%.",
          "Min commitment, Target IRR %, Target multiple, Horizon — the headline terms investors compare deals on.",
          "Structure — what investors actually buy, e.g. “Ordinary shares in Satis (QUBE) Ltd”.",
          "Summary and Highlights — the pitch. Highlights are one per line and appear as a bulleted list.",
        ],
        screenshot: shot("opportunity-form.png", "The add or update opportunity form with the key fields highlighted", 1454, 2280, [
          { n: 1, text: "Name — how the deal is headlined." },
          { n: 2, text: "Status — Coming soon, Open, or Fully subscribed." },
          { n: 3, text: "Target raise — with Raised to date, drives the progress bar." },
          { n: 4, text: "Raised to date — update it as commitments land." },
          { n: 5, text: "Summary — the pitch paragraph." },
          { n: 6, text: "Save opportunity — publishes to the deal-flow page." },
        ]),
        callouts: [
          term(
            "Plain English: IRR and multiple",
            "Target IRR — the annualised return the deal aims for, as a percentage per year.",
            "Target multiple — total money back per pound in: 1.6x means £1.60 returned for every £1 invested over the deal's life."
          ),
        ],
      },
      {
        title: "Keep it current while the raise runs",
        body: [
          "As commitments arrive, update Raised to date so the progress bar moves — a moving bar does more for momentum than any covering email. To update, type the opportunity's ID (shown on its card) into the ID box and re-save the form, the same fill-in-everything rule as developments.",
          "When the raise completes, set Status to Fully subscribed. Once the SPV is formed and allocations are final, record each investor's position on the Cap tables & returns tab — that is the moment prospects become invested clients.",
        ],
        callouts: [
          check("The deal-flow page in the portal shows the raise with the right status, terms and progress percentage."),
        ],
      },
    ],
  },
  {
    slug: "documents",
    group: "Investor platform",
    title: "Data-room documents",
    summary:
      "Share memorandums, appraisals and private documents with the right investors — everyone prospective, or one account only.",
    lede: [
      "The portal's data room holds the documents investors can read: investment memorandums, appraisals, legal packs. Unlike everything else in this guide, documents are not yet managed by a form — they live in a small file (content/investors/documents.json) that is easiest to change by asking Claude. This chapter shows exactly what to ask for.",
    ],
    time: "A few minutes per document",
    steps: [
      {
        title: "Decide who should see the document",
        body: [
          "Every document has an audience, and getting it right matters more than anything else in this chapter:",
        ],
        substeps: [
          "Every prospective (and invested) investor — marketing material like a raise memorandum or an appraisal summary.",
          "One investor only — a private document such as their subscription agreement, visible to that single account.",
        ],
      },
      {
        title: "Ask Claude to add it",
        body: [
          "Start a Claude session on the website repository (see “Making changes with Claude”), attach the file if there is one, and describe the document in plain English. Two examples that contain everything Claude needs:",
        ],
        substeps: [
          "“Add this PDF to the investor data room for all prospective investors: title ‘QUBE Stockport — Investment Memorandum’, dated 2026-08-19.”",
          "“Add a private data-room document for the Hartwell account only, titled ‘Subscription agreement — signed’, using this PDF.”",
        ],
        callouts: [
          tip(
            "How it works underneath (nothing you need to do)",
            "Claude sets investorId to a specific account for a private document, or to “all” with audience “prospective” for general material, and stores the PDF under public/ with a file path so the document is downloadable. Documents without a file still appear as listed items — useful for “available on request” material."
          ),
          warn(
            "Check private really means private",
            "After a private document is added, sign in to the portal as a different test account and confirm the document is NOT visible, then as the right account to confirm it is. Thirty seconds of checking beats a confidentiality slip."
          ),
        ],
      },
    ],
  },
  {
    slug: "login-support",
    group: "Investor platform",
    title: "Helping investors sign in",
    summary:
      "The support playbook: forgotten passwords, lock-outs, expired sessions, and checking the portal as an investor sees it.",
    lede: [
      "Sooner or later an investor will call because they cannot get in. Every case comes down to one of the situations below, and all of them are fixable in a couple of minutes.",
    ],
    time: "2–5 minutes per case",
    steps: [
      {
        title: "Reset a forgotten password",
        body: [
          "Passwords are stored scrambled, so nobody can look one up — you always set a new one:",
        ],
        substeps: [
          "Open the Investors tab of the platform studio and find the account in the left-hand list; note its ID (shown as “ID …”).",
          "In the “Add or update investor” form, type that ID into the Account ID box and re-enter their name, contact first name and login email exactly as shown on their card (the form replaces what is stored, so copy these across).",
          "Type a new password into the Password box and click Save investor.",
          "Tell the investor the new password by phone or another trusted channel — not in the same email thread that says what it is for — and suggest they sign in straight away.",
        ],
        callouts: [
          warn(
            "The blank-password rule works in your favour",
            "Leaving the Password box empty when updating keeps the investor's current password. You only change a password when you type something into that box — so routine detail updates can never accidentally lock anyone out."
          ),
        ],
      },
      {
        title: "“Too many attempts” lock-outs",
        body: [
          "After five failed sign-ins from one internet connection, the portal pauses that connection for 15 minutes. Tell the investor to wait 15 minutes and try again — and if they are unsure of the password, reset it (step 1) while they wait, so their next attempt succeeds.",
        ],
      },
      {
        title: "“It signed me out by itself”",
        body: [
          "Portal sessions last 24 hours, then quietly expire. This is normal and protects investors on shared devices. They just sign in again — nothing is wrong with their account.",
        ],
      },
      {
        title: "See exactly what an investor sees",
        body: [
          "When an investor reports something odd (“my valuation looks wrong”, “I can't find the report”), the fastest diagnosis is to look at the portal yourself. Sign in at the website's Investors page with a test account of the right kind — an invested test account to check figures and reports, a prospective one to check the data room and raises.",
          "If a figure genuinely is wrong, remember the golden rule: it is always the share % on the cap table or the SPV's equity value. Check both and the culprit will be one of them.",
        ],
      },
      {
        title: "Locked-out admin (you)",
        body: [
          "The admin sign-in throttles the same way: five wrong tries, 15-minute pause. If the admin password itself is lost, it cannot be recovered from the site — whoever manages the hosting sets a new one in the hosting platform's settings (the SATIS_ADMIN_SECRET environment variable). Ask the development team or Claude to walk through it.",
        ],
      },
    ],
  },

  // ─────────────────────────────── Website & hosting ────────────────────────
  {
    slug: "live-hosting",
    group: "Website & hosting",
    title: "Making changes stick on live hosting",
    summary:
      "Why Save buttons refuse on the live site, and the export → edit → commit routine that works everywhere.",
    lede: [
      "This is the most important technical idea in the whole guide, and it is genuinely simple once seen. The live website runs on Vercel, a hosting platform that treats the deployed site as read-only — like a printed brochure. You cannot scribble on a printed brochure; you change the master copy and print a new one.",
      "The master copy of this website lives in a GitHub repository (a shared, version-tracked folder of all the site's files). Changing the master and letting the site republish itself is the routine below — and Claude does the technical parts for you.",
    ],
    time: "About 10 minutes once you've done it twice",
    steps: [
      {
        title: "Recognise the moment",
        body: [
          "You press Save or Publish on the live site's admin and it refuses, with a message about read-only hosting or not being able to write a file. Nothing is broken and nothing was lost — the site is telling you this change needs to go through the master copy.",
        ],
      },
      {
        title: "Export the current dataset",
        body: [
          "For investor-platform changes, start by downloading what the live site is currently serving, so you edit reality rather than a stale copy:",
        ],
        substeps: [
          "Open the platform studio and click the Import / export tab.",
          "Click “Export current dataset”. One file (a .json file) downloads — it contains every investor, development, cap table, report, insight and opportunity, exactly as live.",
          "Keep that file — it is also a perfect backup. Exporting before any big editing session is a habit worth having.",
        ],
        screenshot: shot("data-tab.png", "The import/export tab with the export button, file upload and paste box highlighted", 2720, 3708, [
          { n: 1, text: "Export current dataset — downloads everything as one JSON file." },
          { n: 2, text: "JSON file — choose a prepared file to import…" },
          { n: 3, text: "…or paste its text here instead." },
          { n: 4, text: "Validate & import — checks everything (including the 100% rule) before replacing anything." },
        ]),
        callouts: [
          term(
            "Plain English: JSON",
            "JSON is just structured text — data written with brackets and quotes so computers can read it reliably. You never need to write it by hand: Claude reads and edits it for you."
          ),
        ],
      },
      {
        title: "Ask Claude to make the change and commit it",
        body: [
          "Start a Claude Code session on the website repository (from claude.ai/code, choose the satis-group-website repository — the development team can set up your access the first time). Then describe the change in plain English and attach the exported file if the change concerns investor data. For example:",
        ],
        substeps: [
          "“Using the attached export, update the Court House SPV equity value to £5.4m and add a Q3 2026 valuation of £4.9m for the Hartwell account, then commit the changes.”",
          "“Publish this news story: [paste your title, date, summary and text].”",
          "“Set the QUBE opportunity's raised-to-date to £2.6m.”",
        ],
        callouts: [
          tip(
            "What “commit” means",
            "A commit is a saved, dated snapshot of the master copy with a note of what changed and why. Commits are what make the repository an audit trail: every change to investor data is traceable, and any mistake can be rolled back to the snapshot before it."
          ),
        ],
      },
      {
        title: "Wait for the site to republish, then verify",
        body: [
          "When the change is committed (and merged, if the team reviews changes first), Vercel notices and republishes the site automatically — typically within a few minutes. There is nothing to press.",
          "Then verify on the live site: open the relevant page or portal and confirm the change is showing. For investor data, the Import / export tab's export always reflects exactly what the deployment is serving — download it again if you want certain proof.",
        ],
        callouts: [
          check(
            "The live page shows your change. If it hasn't after ten minutes, ask in the Claude session whether the commit was pushed and the deployment succeeded — Claude can check both."
          ),
        ],
      },
      {
        title: "The same routine, other direction: bulk import",
        body: [
          "The Import / export tab also accepts a prepared file: choose it in the JSON file box (or paste its text) and click Validate & import. Only the datasets present in the file are replaced, everything is validated first (including the 100% cap-table rule), and investor records may include a plain password which is scrambled on the way in.",
          "On the live site the import button hits the same read-only wall — so in practice imports are for writable environments, and the commit routine above is how prepared data reaches the live site.",
        ],
      },
    ],
  },
  {
    slug: "website-content",
    group: "Website & hosting",
    title: "Making changes with Claude",
    summary:
      "Updating pages, photos and portfolio entries — and the one-request recipe for adding a whole new development.",
    lede: [
      "The public website — portfolio cards, property pages, photography, the about page — is all data-driven: every page is generated from structured files in the repository. The practical upshot: you never edit a page's design, you describe a change to Claude and it edits the data. This chapter is a set of proven requests to copy.",
    ],
    time: "Most changes: minutes. A new development: under an hour.",
    steps: [
      {
        title: "Start a session and just ask",
        body: [
          "Open a Claude Code session on the satis-group-website repository and describe the change as you would to a colleague. Real examples that work verbatim:",
        ],
        substeps: [
          "“Change the status of 22 St John Street to ‘Fully let’ on its portfolio card and property page.”",
          "“Replace the hero photo on the Courthouse page with the attached image.”",
          "“Add this award to the About page: RESI Awards Rising Star 2026.”",
          "“Fix a typo on the contact page: ‘recieve’ should be ‘receive’.”",
        ],
        callouts: [
          tip(
            "Always end with the magic words",
            "Finish requests with “…then commit and push the change.” That is what sends the change to the master copy so the live site republishes. Claude will tell you when it is done."
          ),
        ],
      },
      {
        title: "Adding a whole new development",
        body: [
          "A new development touches the portfolio grid, its own property page, the map, and the investor platform. Claude follows a set checklist (portfolio entry → property page → optimised images → SPV record → cap-table positions) — you just need to supply the ingredients in one request:",
        ],
        substeps: [
          "The name and brand (e.g. “The Foundry, Altrincham”) and full address.",
          "The status and phase (e.g. Acquired / Pre-construction).",
          "A hero photograph, plus any gallery photos and the project logo if branded.",
          "Any brochure PDF.",
          "For the investor platform: the SPV name, equity value, total committed, senior debt and forecast IRR.",
        ],
        callouts: [
          check(
            "Afterwards, check four places: the portfolio grid shows the new card, its property page opens, the map shows its pin, and the Developments & SPVs tab lists its SPV."
          ),
        ],
      },
      {
        title: "Where things live (for the curious)",
        body: [
          "You never need this to make changes, but it demystifies what Claude is editing: portfolio cards live in lib/portfolio-data.ts, property pages in lib/property-pages.ts, photography in public/images/, news stories in content/newsletters/, and all investor-platform data in content/investors/.",
        ],
      },
    ],
  },

  // ───────────────────────────────── Reference ──────────────────────────────
  {
    slug: "claude-skills",
    group: "Reference",
    title: "Claude agents & skills",
    summary:
      "The specialist playbooks vendored into the repository, and how to put them to work in plain English.",
    lede: [
      "The repository carries a catalogue of 100+ specialist “skills” in .claude/skills/ — professional playbooks Claude loads to work to a set standard: SEO audits, accessibility reviews, design QA, copywriting in the house voice, and more. You never install anything; in any Claude session on this repository they are simply available.",
    ],
    steps: [
      {
        title: "Use them by asking for the outcome",
        body: [
          "You do not need to know a skill's name — ask for the result and the right playbook loads. Typing a skill name with a slash also works if you know it:",
        ],
        substeps: [
          "“Run an accessibility audit and fix what it finds.” (accessibility-audit)",
          "“/design-standards review the contact page.” (design QA against the site's tokens, spacing and contrast rules)",
          "“Audit the site's SEO and implement the quick wins.” (seo-audit-orchestration and friends)",
          "“Review my last change for bugs and security issues.” (code-review-web)",
          "“Rewrite this paragraph in the house voice.” (brand-voice, content-and-copy)",
        ],
      },
      {
        title: "The ones worth knowing by name",
        substeps: [
          "design-standards — UI quality review: tokens, contrast, hierarchy, spacing, mobile, consistency. Used for the property-page polish and for this guide.",
          "seo-audit-orchestration, seo-onpage, seo-technical — full SEO audits and fixes.",
          "accessibility-audit — WCAG accessibility review.",
          "code-review-web — bug and security review of changes.",
          "content-and-copy, brand-voice — writing and editing in the house voice.",
          "cro-optimization — conversion review of enquiry paths.",
        ],
      },
      {
        title: "Bigger sweeps",
        body: [
          "For site-wide work, ask Claude to run several skill-armed agents in parallel and implement what they find — e.g. “Run SEO, accessibility and code-review agents across the site in parallel and fix the findings.” That is how the current site standards were set.",
        ],
      },
    ],
  },
  {
    slug: "seo",
    group: "Reference",
    title: "SEO & Google presence",
    summary:
      "What the site already does for search, the one-time Google checklist, and the domain go-live steps.",
    lede: [
      "The site ships with the on-page fundamentals built in: per-page titles and descriptions, canonical addresses on satisgroup.co.uk, social-sharing images, structured data for the organisation and properties, and an automatically generated sitemap and robots file. What remains is off-site housekeeping — one-time jobs, mostly outside the website itself.",
    ],
    steps: [
      {
        title: "When satisgroup.co.uk points at this site",
        substeps: [
          "In Vercel, add satisgroup.co.uk and www.satisgroup.co.uk as domains and follow its DNS instructions (the development team or Claude can talk you through the DNS records).",
          "Keep the site address setting (NEXT_PUBLIC_SITE_URL) at https://www.satisgroup.co.uk — already the default.",
          "If any addresses from the old site differ, ask Claude to add permanent redirects so existing Google results and bookmarked links keep working.",
        ],
      },
      {
        title: "The one-time Google checklist",
        substeps: [
          "Google Search Console: verify the domain, submit https://www.satisgroup.co.uk/sitemap.xml, and glance at the coverage report weekly for the first fortnight.",
          "Google Business Profile: claim or update the Satis Group listing — name, office address, phone, website, photography. This controls the map panel when people search the company name.",
          "Consistency: use exactly the same company name, address and phone on the website footer, the Business Profile, LinkedIn, and portal listings (Rightmove/Zoopla agent pages). Consistency itself is a local-ranking signal.",
        ],
      },
      {
        title: "Ongoing habits that cost nothing",
        substeps: [
          "Publish news regularly — fresh, dated content is the simplest ranking signal this site can send.",
          "Ask Claude for a quarterly SEO audit (“run an SEO audit and implement the quick wins”).",
          "When a development completes or rebrands, update its property page rather than deleting it — accumulated page history is worth keeping.",
        ],
      },
    ],
  },
  {
    slug: "glossary",
    group: "Reference",
    title: "Plain-English glossary",
    summary: "Every technical term used in this guide, in one place.",
    lede: [
      "Terms are explained where they first appear, but this page collects them for quick reference.",
    ],
    steps: [],
    faqsTitle: "Terms",
    faqs: [
      { q: "SPV (special purpose vehicle)", a: ["A limited company created to own one development. Investors buy shares in the SPV rather than the building directly, which keeps each project's finances self-contained."] },
      { q: "Cap table (capitalisation table)", a: ["The list of who owns what percentage of an SPV. The platform enforces that one SPV's positions never total more than 100%."] },
      { q: "Equity value", a: ["What the SPV's shares are worth in total right now. An investor's stake = their share % × this value. Updated on the Developments & SPVs tab after each valuation."] },
      { q: "Committed capital", a: ["The money an investor actually put in — their cost basis. Shown alongside the current value so gains are visible."] },
      { q: "GDV (gross development value)", a: ["What the finished development is expected to be worth in total. A project-scale figure, distinct from the SPV's equity value."] },
      { q: "IRR (internal rate of return)", a: ["The annualised return of an investment, as a percentage per year, accounting for when money goes in and comes out."] },
      { q: "Multiple", a: ["Total money back per pound invested: 1.6x means £1.60 returned per £1 in, over the deal's life."] },
      { q: "Distribution", a: ["Profit paid out to investors. A capital call is the opposite — asking investors to pay money in."] },
      { q: "Hashed (password)", a: ["One-way scrambled. The site can verify a password but nobody can read it back — which is why passwords are reset, never recovered."] },
      { q: "JSON", a: ["Structured text — data written with brackets and quotes so computers can read it reliably. The import/export format of the platform studio."] },
      { q: "Repository (repo)", a: ["The shared, version-tracked folder on GitHub holding the master copy of the website's files."] },
      { q: "Commit", a: ["A saved snapshot of the repository with a note of what changed. The site's audit trail, and the unit of change that triggers republishing."] },
      { q: "Deploy / republish", a: ["Vercel (the hosting platform) rebuilding the live site from the latest master copy. Automatic after each merged commit; takes a few minutes."] },
      { q: "Slug", a: ["The address-friendly version of a title, e.g. “2026-08-19-courthouse-launches”. Used in web addresses for news stories and insight articles."] },
      { q: "Data room", a: ["The document library inside the investor portal — memorandums, appraisals and private documents, each with an audience."] },
    ],
  },
];

export function getGuideChapter(slug: string): GuideChapter | undefined {
  return GUIDE_CHAPTERS.find((c) => c.slug === slug);
}

/** Chapters in hub/reading order with their 1-based numbers. */
export function orderedChapters(): { chapter: GuideChapter; number: number }[] {
  const ordered = GUIDE_GROUPS.flatMap((g) =>
    GUIDE_CHAPTERS.filter((c) => c.group === g)
  );
  return ordered.map((chapter, i) => ({ chapter, number: i + 1 }));
}
