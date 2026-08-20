// Deck 03 — Admin accounts & access
import { C, MX, CW } from "../theme.mjs";

export const deck = {
  no: 3,
  file: "03-admin-accounts-and-access.pptx",
  name: "Admin accounts & access",
  title: "Admin accounts & access.",
  subtitle: "Who can sign in to the admin area, adding a colleague in ten minutes, and the support playbook for passwords and lock-outs.",
  cover: "cover-accounts.jpg",
  coverNotes:
    "This session covers admin accounts: where they live, how to add one (a two-step job: generate here, paste into the hosting), resets, removals, and what to do when someone is locked out. Ten minutes of process, then questions.",
  slides: [
    {
      type: "agenda",
      title: "What this session covers.",
      sub: "You need the new admin's email address, and access to the Vercel project settings, or someone who has it.",
      items: [
        { title: "Two kinds of account", sub: "Admin accounts vs investor accounts: different doors, different keys." },
        { title: "Where admin accounts live", sub: "In the hosting platform, not on the website, and why." },
        { title: "Adding an admin", sub: "Generate the entry, paste into Vercel, redeploy." },
        { title: "Resets and removals", sub: "Passwords are replaced, never recovered." },
        { title: "Lock-outs and sessions", sub: "Five tries, fifteen minutes, 24-hour sessions." },
      ],
      aside: {
        tone: "tip",
        title: "Ten minutes, start to finish",
        body: "Adding an account takes about ten minutes including the hosting step, and the page does the fiddly part for you.",
        h: 1.9,
      },
      notes: "Small audience session usually: whoever runs operations. Clarify scope up front: investor logins are a different system, covered in the investor-platform webinar.",
    },
    {
      type: "panels",
      label: "Orientation",
      title: "Two doors, two sets of keys.",
      intro: "The website has two private areas, and their accounts are completely separate:",
      cols: 2,
      panels: [
        {
          tone: "plain", title: "Admin accounts: the back office",
          body: [
            "Sign in at /admin with a username and password.",
            "Can publish news, run the investor platform, manage accounts, download the appraisal app.",
            "Stored in the hosting platform (Vercel) as a setting called SATIS_ADMIN_USERS.",
            "Every admin has identical access. There are no roles or permission levels.",
          ],
        },
        {
          tone: "plain", title: "Investor accounts: the portal",
          body: [
            "Investors sign in at /investors with email and password.",
            "See their own portfolio, reports and documents, never the admin area.",
            "Created and managed on the Investors tab of the platform studio.",
            "Covered in webinar 04, The investor platform.",
          ],
        },
      ],
      panelH: 3.3,
      notes: "The distinction prevents the most common support confusion: resetting the wrong kind of account. If someone says “I can't get in”, first ask: which door, /admin or /investors?",
    },
    {
      type: "diagram",
      label: "Where accounts live",
      title: "Admin accounts live with the hosting. Deliberately.",
      intro: "For safety, the list of who can sign in is stored in the hosting platform rather than on the website itself. The Admin accounts page does the fiddly part: it shows who can sign in, and generates the setting value you paste into Vercel.",
      draw: (s, T) => {
        const y = 3.45, h = 1.15, w = 3.3, gap = 1.0;
        const x1 = MX + 0.35, x2 = x1 + w + gap, x3 = x2 + w + gap;
        T.node(s, { x: x1, y, w, h, label: "Admin accounts page", sub: "shows accounts · generates the entry" });
        T.node(s, { x: x2, y, w, h, label: "Vercel: Environment Variables", sub: "SATIS_ADMIN_USERS holds every account", fillDark: true });
        T.node(s, { x: x3, y, w, h, label: "Sign-in at /admin", sub: "checked on every request" });
        T.arrow(s, x1 + w, y + h / 2, x2, y + h / 2);
        T.arrowLabel(s, "YOU PASTE THE VALUE", x1 + w - 0.35, y + h / 2 + 0.14, gap + 0.7);
        T.arrow(s, x2 + w, y + h / 2, x3, y + h / 2);
        T.arrowLabel(s, "AFTER A REDEPLOY", x2 + w - 0.35, y + h / 2 + 0.14, gap + 0.7);
        s.addText([
          { text: "Passwords are stored “hashed”: one-way scrambled.  ", options: { fontSize: 11.5, bold: true, color: C.ink } },
          { text: "The site can check a typed password is right, but nobody can read one back. That is why passwords are replaced, never recovered.", options: { fontSize: 11.5, color: C.muted } },
        ], { x: MX, y: 5.5, w: CW - 1, h: 0.65, fontFace: "Work Sans", margin: 0, lineSpacing: 17 });
      },
      notes: "Two ideas here: the hosting is the source of truth (so a compromised website can't mint accounts), and hashing (so nobody, including us, can read a password). Both come up in support conversations.",
    },
    {
      type: "steps",
      label: "Adding an admin · step 1 of 2",
      title: "Generate the credential entry.",
      intro: "From the control room, open the Admin accounts card. The page lists every account that can currently sign in; the “Add an account” form is below.",
      image: "accounts-form.png",
      imageW: 5.5,
      caption: "The Add an account form on /admin/accounts.",
      steps: [
        { n: 1, title: "Email", body: "The address the person will sign in with." },
        { n: 2, title: "Password: leave it blank", body: "A strong password is generated for you (recommended). Or type one of at least 12 characters." },
        { n: 3, title: "Click Generate credential entry", body: "Nothing changes yet. This only prepares the value for Vercel." },
      ],
      panel: {
        tone: "warn",
        title: "The generated password is shown once",
        body: "Record it before leaving the page. It is stored only as a one-way hash and can never be read back, only replaced.",
        h: 1.15,
      },
      notes: "The result box shows the password a single time. Have a password manager or a secure note ready before clicking. If the page instead says the site is running on demo credentials (test/test), creating this first real account is exactly how you fix that.",
    },
    {
      type: "steps",
      label: "Adding an admin · step 2 of 2",
      title: "Paste the value into Vercel and redeploy.",
      intro: "The result box shows the complete new SATIS_ADMIN_USERS value. It includes every existing account as well, so pasting it wholesale keeps everyone working. The box lists the exact clicks:",
      steps: [
        { n: 1, title: "Open the variable", body: "In Vercel: open the project → Settings → Environment Variables → edit SATIS_ADMIN_USERS (create it if it does not exist)." },
        { n: 2, title: "Replace its value", body: "Paste the full value from the result box over what is there." },
        { n: 3, title: "Redeploy the site", body: "Environment changes only apply to new deployments. Unfamiliar? Hand the value to the development team, or ask Claude to talk you through the Vercel screens." },
      ],
      aside: {
        tone: "check",
        title: "After the redeploy",
        body: [
          "The new admin signs in at /admin, and the Admin accounts page lists them.",
          "Tell them their password over a trusted channel: phone, or split across two channels. Never both credentials in one email.",
        ],
        h: 2.5,
      },
      stepsW: 7.9,
      notes: "The redeploy is the step people forget. The new account simply won't work until it happens. The handover rule matters: if one email thread carries both the address and the password, one compromised inbox is a compromised admin.",
    },
    {
      type: "twoCol",
      label: "Changes",
      title: "Resetting a password, removing an account.",
      left: {
        heading: "Reset a password",
        numbered: true,
        items: [
          "Generate a new entry for the same email. Re-using an existing email produces a replacement entry.",
          "Paste the new SATIS_ADMIN_USERS value into Vercel, exactly as before.",
          "Redeploy. The old password stops working; the new one starts.",
        ],
      },
      right: {
        heading: "Remove an account",
        numbered: true,
        items: [
          "Edit SATIS_ADMIN_USERS in Vercel.",
          "Delete that account's email=… entry from the value.",
          "Redeploy. Removal takes effect on the next request. No waiting for their session to expire.",
        ],
      },
      panel: {
        tone: "tip",
        title: "Never truly locked out",
        body: "A forgotten admin password is replaced by another admin. If nobody can sign in at all, the development team can edit SATIS_ADMIN_USERS directly in Vercel.",
        h: 0.95,
      },
      notes: "Same mechanics in both columns: the env var is the account list, and a redeploy applies it. Point out the immediacy of removal. Useful when someone leaves the business.",
    },
    {
      type: "panels",
      label: "Support playbook",
      title: "Lock-outs, sessions and error messages.",
      cols: 3,
      panels: [
        {
          tone: "plain", title: "“Incorrect username or password.”",
          body: ["Check Caps Lock, and for a stray space before or after. Using a password manager? Let it fill the boxes."],
        },
        {
          tone: "plain", title: "“Too many attempts …”",
          body: ["Five wrong tries pauses that internet connection for 15 minutes. Deliberate, to stop password guessing. Wait it out; nothing is broken. Genuinely forgotten? Reset it meanwhile."],
        },
        {
          tone: "plain", title: "“It signed me out by itself.”",
          body: ["Sessions last 24 hours, then quietly expire. Normal, and protective on shared devices. Sign in again; nothing saved is lost. On shared computers, always press Sign out when done."],
        },
      ],
      panelH: 2.6,
      notes: "These three cover essentially every admin sign-in complaint. The 15-minute throttle applies per internet connection. An office may share one, so one person's typos can pause everyone briefly.",
    },
    {
      type: "steps",
      label: "First-time setup",
      title: "If the site still shows demo credentials.",
      intro: "Until real accounts are configured, the admin accepts the public demonstration pair test/test and shows a reminder note. The moment real accounts exist, the demo pair stops working.",
      steps: [
        { n: 1, title: "See the note? Create the first real account", body: "Follow the two-step add flow from this session. That is the fix, not a separate procedure." },
        { n: 2, title: "Also set the signing secret", body: "SATIS_ADMIN_SECRET in the same Vercel settings makes sign-in sessions unforgeable. The development team can generate one." },
        { n: 3, title: "Confirm the note is gone", body: "After the redeploy, the admin home shows no demo warning, and test/test no longer signs in." },
      ],
      aside: {
        tone: "warn",
        title: "Demo mode is public knowledge",
        body: ["test/test is printed in the public repository. Treat the demo note as a to-do, not a decoration."],
        h: 1.9,
      },
      stepsW: 7.9,
      notes: "Only relevant until first-time setup is done, but worth one slide because the warning banner is the first thing anyone sees on a fresh deployment, and the fix is exactly the session's main flow.",
    },
  ],
  takeaways: [
    "Admin and investor accounts are separate systems. Check which door before helping anyone.",
    "Accounts live in SATIS_ADMIN_USERS in Vercel; the admin page generates the value for you.",
    "Adding = generate entry → paste into Vercel → redeploy. Ten minutes.",
    "Passwords are shown once and stored scrambled: replaced, never recovered.",
    "Five wrong tries pauses sign-in for 15 minutes; sessions last 24 hours.",
  ],
  help: [
    "Written walkthrough: /admin/guide → “Managing admin accounts”.",
    "Locked out entirely? The development team can edit the Vercel setting directly.",
    "Unsure in Vercel? Ask Claude to talk you through the screens.",
  ],
};
