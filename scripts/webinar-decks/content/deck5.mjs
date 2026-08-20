// Deck 05 — The Satis Appraisal agent (desktop app)
import { C, MX, CW } from "../theme.mjs";

export const deck = {
  no: 5,
  file: "05-the-satis-appraisal-agent.pptx",
  name: "The Satis Appraisal agent",
  title: "The Satis Appraisal agent.",
  subtitle: "Downloading, installing and getting value from the desktop app that turns floorplans into full development appraisals.",
  cover: "cover-appraisal.jpg",
  coverNotes:
    "This session is about the Satis Appraisal agent, the desktop application, not the website. We'll cover what it does, where to download it, installing on Windows and Mac including the security prompts, connecting the AI features, and how the pricing research works.",
  slides: [
    {
      type: "agenda",
      title: "What this session covers.",
      sub: "A desktop application for Windows and Mac, downloaded from the admin area. Distributed privately by Satis Group.",
      items: [
        { title: "What it is and does", sub: "Floorplans in, appraised conversion options out." },
        { title: "Where to download", sub: "The admin's Appraisal page. Always the newest version." },
        { title: "Installing", sub: "Windows and Mac, including the one-time security prompts." },
        { title: "Connecting the AI features", sub: "A Claude account or API key, and what works without." },
        { title: "The Pricing step", sub: "Live market evidence with sources, applied only when you choose." },
        { title: "Staying current", sub: "Updates, versions, and where the app lives." },
      ],
      notes: "Position the app in the toolchain: the website presents developments; this app appraises potential ones. It mirrors the Satis Appraisal Model workbook, so numbers land in a familiar shape.",
    },
    {
      type: "steps",
      label: "What it does",
      title: "From a floorplan to an appraised scheme.",
      intro: "The app works through a building the way the team does, mirroring the Satis Appraisal Model workbook:",
      steps: [
        { n: 1, title: "Import floorplans of an existing building", body: "From PDFs and photos (with AI connected), from DXF files, or by entering floors manually." },
        { n: 2, title: "Generate conversion options", body: "The ways the building could be converted: layouts generated and compared." },
        { n: 3, title: "Check every layout against UK minimum-space rules", body: "Non-compliant layouts are flagged before they waste appraisal time." },
        { n: 4, title: "Run a full development appraisal of each option", body: "Costs, values, finance and returns per option. Stamp duty calculates itself from HMRC bands." },
      ],
      aside: {
        tone: "tip",
        title: "Why it exists",
        body: ["Appraising three conversion options of one building used to be three workbooks. Here it is one import and a comparison."],
        h: 1.85,
      },
      stepsW: 7.9,
      notes: "The fourth step is the point: this isn't a drawing tool, it's an appraisal tool. Everything upstream exists to feed the numbers.",
    },
    {
      type: "imageFocus",
      label: "Downloading",
      title: "One page, always the newest version.",
      textW: 4.3,
      image: "appraisal-top.png",
      caption: "The Appraisal agent download page at /admin/appraisal, with the current version shown.",
      body: [
        { text: "From the control room, open the Appraisal agent download card. Two buttons (Windows and Mac) always give you the newest version; there is nothing to configure.", size: 11 },
        { text: "Windows: Satis-Appraisal-Setup.exe · Windows 10 or newer.", size: 10.5 },
        { text: "Mac: Satis-Appraisal.dmg · Apple silicon & Intel.", size: 10.5 },
        { text: "The page shows the latest version number, and the same buttons reinstall or update. Just download and run again.", size: 11 },
      ],
      panel: {
        tone: "tip",
        title: "Signed in required",
        body: "The download page is part of the admin area. Sign in at /admin first.",
        y: 5.55, h: 1.15,
      },
      notes: "The page always resolves “latest”, so never circulate saved installers. Send colleagues to the page instead. Earlier versions remain available via the releases link at the bottom of the page.",
    },
    {
      type: "twoCol",
      label: "Installing",
      title: "Installing, and the one-time security prompt.",
      intro: "The app is distributed privately by Satis Group rather than through the Microsoft Store or App Store, so each system asks once for confirmation. This is expected. Here is exactly what to click:",
      left: {
        heading: "Windows",
        numbered: true,
        items: [
          "Click the Windows button. Satis-Appraisal-Setup.exe saves to Downloads.",
          "Double-click the file in Downloads.",
          "If a blue “Windows protected your PC” message appears: click “More info”, then “Run anyway”.",
          "Follow the installer: Next, choose the suggested folder, Install.",
          "Satis Appraisal appears in the Start menu like any other program.",
        ],
      },
      right: {
        heading: "Mac",
        numbered: true,
        items: [
          "Click the Mac button. Satis-Appraisal.dmg saves to Downloads.",
          "Double-click the file, then drag Satis Appraisal into the Applications folder shown next to it.",
          "First launch only: hold Control, click Satis Appraisal, choose “Open”, and confirm.",
          "After that it opens normally from Launchpad or Applications.",
        ],
      },
      panel: {
        tone: "tip",
        title: "The same steps are printed on the download page",
        body: "No need to memorise. /admin/appraisal carries this walkthrough, so installers always have it to hand.",
        h: 0.95,
      },
      notes: "Rehearse the security prompts out loud (“More info → Run anyway” on Windows, Control-click → Open on Mac) because that's the moment people stall and call for help.",
    },
    {
      type: "panels",
      label: "First run",
      title: "Connecting the AI features.",
      intro: "The AI features (reading floorplans from PDFs and photos, and pricing research) need a Claude connection, set up once inside the app:",
      cols: 3,
      panels: [
        {
          tone: "plain", title: "Option A: sign in with Claude",
          body: ["Open Settings inside the app and connect a Claude account through your browser. The app then fetches everything it needs by itself. Recommended."],
        },
        {
          tone: "plain", title: "Option B: paste an API key",
          body: ["If you have an Anthropic API key, paste it in Settings instead. Settings shows which connection is in use and can test it."],
        },
        {
          tone: "plain", title: "No connection? Still useful",
          body: ["DXF floorplan files and manual floor entry work without any AI connection. Only PDF/photo reading and pricing research need one."],
        },
      ],
      panelH: 2.55,
      notes: "Most of the team should use Option A: no keys to manage. Make clear the app degrades gracefully. No connection just means importing floorplans via DXF or typing floors in.",
    },
    {
      type: "steps",
      label: "The Pricing step",
      title: "Live market evidence: suggested, sourced, never imposed.",
      intro: "With AI connected, the Pricing step can research live market evidence for a project:",
      steps: [
        { n: 1, title: "It gathers the evidence", body: "Local sale and rent comparables, build cost benchmarks and current finance rates, with a progress bar showing each web search as it happens." },
        { n: 2, title: "Every figure arrives as a suggestion", body: "With its range, reasoning and sources. Nothing is applied until you choose to apply it." },
        { n: 3, title: "Your own evidence anchors it", body: "Record tender results and lender term sheets in Settings; the estimates then anchor to your real numbers." },
        { n: 4, title: "Stamp duty needs no research", body: "It calculates itself from HMRC bands." },
      ],
      aside: {
        tone: "warn",
        title: "Judgement stays with you",
        body: ["Research accelerates an appraisal; it does not sign one off. Check the sources on any figure that drives a decision."],
        h: 1.95,
      },
      stepsW: 7.9,
      notes: "The design principle to voice: the app shows its working (range, reasoning, sources) precisely so a human can disagree. Encourage recording tender results; anchored estimates beat generic benchmarks.",
    },
    {
      type: "panels",
      label: "Staying current",
      title: "Updates, versions, and where the app lives.",
      cols: 3,
      panels: [
        {
          tone: "plain", title: "Updating",
          body: ["Download and run the installer again from /admin/appraisal. Same buttons, newest version, settings kept."],
        },
        {
          tone: "plain", title: "Version in use",
          body: ["The download page shows the latest version number. Comparing it with Help/About in the app tells you if someone is behind."],
        },
        {
          tone: "plain", title: "Where it lives",
          body: ["The app is built from its own repository, Satisgroup-1/Appraisalapplication on GitHub, separate from the website. Earlier versions stay available on its releases page."],
        },
      ],
      panelH: 2.5,
      notes: "Improvement requests for the app go to the Appraisalapplication repository. A Claude session works there exactly as it does on the website repo. That's the bridge to webinar 01's workflow.",
    },
  ],
  takeaways: [
    "Floorplans in → compliant conversion options → a full appraisal of each. Mirrors the Appraisal Model workbook.",
    "Always download from /admin/appraisal. The buttons always give the newest version.",
    "The security prompts are expected: “More info → Run anyway” / Control-click → Open, once.",
    "AI features need a Claude account or API key, set in the app's Settings; DXF and manual entry work without.",
    "Pricing research is suggested and sourced, applied only when you choose.",
  ],
  help: [
    "Install steps are printed on the download page itself.",
    "App questions or ideas: a Claude session on Satisgroup-1/Appraisalapplication.",
    "Connection problems: Settings inside the app can test the Claude link.",
  ],
};
