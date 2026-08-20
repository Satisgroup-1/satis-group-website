// Deck 07 — Contact & email
import { C, MX, CW } from "../theme.mjs";

export const deck = {
  no: 7,
  file: "07-contact-and-email.pptx",
  name: "Contact & email",
  title: "Contact & email.",
  subtitle: "How enquiries reach the team: the forms, the email links, the enquiries inbox, and the daily habits that turn them into replies.",
  cover: "cover-email.jpg",
  coverNotes:
    "This session is about every route a message can take from the website to the team: the two forms (which deliver by email), the email links all over the site, the enquiries inbox they all land in, the daily habits, and the newsletter signups that are rolling out.",
  slides: [
    {
      type: "agenda",
      title: "What this session covers.",
      sub: "Every route from a visitor's screen to a Satis inbox: how each one delivers, and the habits that turn enquiries into replies.",
      items: [
        { title: "The two forms", sub: "The contact page, and the investor enquiry form." },
        { title: "How submissions deliver", sub: "Straight to the enquiries inbox, reply-ready." },
        { title: "The email links", sub: "One click to a pre-addressed email, everywhere." },
        { title: "The clever links", sub: "Pre-filled enquiries all over the investor portal." },
        { title: "Daily habits", sub: "Monitoring the inbox and answering well." },
        { title: "What's next", sub: "The subscriber list, and how the sending works." },
      ],
      notes: "Two channels, one inbox: form submissions arrive by email, and every email link is pre-addressed to the same place. The session's goal is that everyone knows which inbox to watch and how to reply well.",
    },
    {
      type: "imageFocus",
      label: "The forms",
      title: "The contact page: three topics, four boxes.",
      textW: 4.3,
      image: "contact-form.png",
      caption: "The form on /contact: name, email, topic, message.",
      body: [
        { text: "The public contact page carries a form with a topic selector (General enquiry, Property enquiry, or Investment) plus name, email and message.", size: 11 },
        { text: "Choosing Investment offers a link across to the investor enquiry form, so prospective investors land in the right flow.", size: 11 },
        { text: "The page also shows the team's email address directly, for people who prefer their own mail app.", size: 11 },
      ],
      notes: "The topics matter for routing: they arrive in the email's subject line, so the inbox can be sorted at a glance. The address shown beside the form is noreply.ai@satisgroup.co.uk, the same inbox the form delivers to.",
    },
    {
      type: "imageFocus",
      label: "The forms",
      title: "The investor enquiry form: /investors/enquire.",
      textW: 4.3,
      image: "investor-enquire.png",
      caption: "“Become an investor” now leads here, matching the platform's black and gold.",
      body: [
        { text: "New: prospective investors get their own short form (name, email, company, and an optional note), styled like the investor platform they have just been reading.", size: 11 },
        { text: "Every “Become an investor” button on the investor pages points here.", size: 11 },
        { text: "It asks for who they represent: the question the general form never asked.", size: 11 },
      ],
      notes: "This form landed in the same release wave as this training, and like the contact form it delivers by email. Next slide.",
    },
    {
      type: "statement",
      label: "How submissions deliver",
      big: "Form submissions arrive as email, reply-ready.",
      sub: "Both forms email the enquiry to the enquiries inbox the moment the visitor presses send: the topic rides in the subject line, and the sender's address is set as Reply-To, so answering is one click of Reply. If sending ever fails, the visitor is shown the team's email address and asked to write directly. An enquiry is never dropped silently.",
      dark: true,
      subY: 4.35,
      notes: "The operational takeaway: form submissions and email-link messages land in the same inbox, and both are answered the same way: hit Reply. The failure mode is honest by design. No key or a provider outage means the visitor is told to email noreply.ai@satisgroup.co.uk directly.",
    },
    {
      type: "diagram",
      label: "The email links",
      title: "Email links: click → mail app → the enquiries inbox.",
      intro: "Alongside the forms, everywhere the site says “email us” the link opens the visitor's own mail app with the address, and often the subject, already filled in:",
      draw: (s, T) => {
        const y = 3.3, h = 1.1, w = 2.85, gap = 0.72;
        const xs = [MX + 0.25, MX + 0.25 + (w + gap), MX + 0.25 + 2 * (w + gap)];
        T.node(s, { x: xs[0], y, w, h, label: "Visitor clicks an email link", sub: "footer, contact page, portal buttons" });
        T.node(s, { x: xs[1], y, w, h, label: "Their own mail app opens", sub: "pre-addressed, subject pre-filled" });
        T.node(s, { x: xs[2], y, w, h, label: "Lands in the enquiries inbox", sub: "noreply.ai@satisgroup.co.uk", fillDark: true });
        T.arrow(s, xs[0] + w, y + h / 2, xs[1], y + h / 2);
        T.arrow(s, xs[1] + w, y + h / 2, xs[2], y + h / 2);
        s.addText([
          { text: "Why this is dependable: ", options: { fontSize: 11.5, bold: true, color: C.ink } },
          { text: "it is ordinary email, end to end. Nothing on the website has to run, store or forward anything. The message travels from the visitor's own mail account to the Satis mailbox at 123 Reg.", options: { fontSize: 11.5, color: C.muted } },
        ], { x: MX, y: 5.2, w: CW - 0.8, h: 0.75, fontFace: "Work Sans", margin: 0, lineSpacing: 17 });
      },
      notes: "Every email link on the site is addressed to noreply.ai@satisgroup.co.uk, and form submissions land in the same place, so there is exactly one inbox to run. If the team ever wants the address changed, it is a one-sentence Claude request.",
    },
    {
      type: "table",
      label: "The email links",
      title: "Where the email links live.",
      intro: "A visitor is never more than one click from a pre-addressed email:",
      headers: ["Where", "The link", "Pre-filled subject"],
      colW: [3.6, 4.6, 3.9],
      rows: [
        ["Footer · every page", "The contact email address", "none"],
        ["Contact page", "The address beside the form", "none"],
        ["Property pages", "“Register interest” actions", "The development's name"],
        ["Investor sign-in", "“Need help?”", "Sign-in help"],
        ["Portal · opportunities", "“Register interest” on a raise", "Investor interest: deal, location"],
        ["Portal · insights", "“Discuss with the team”", "Insight discussion: article title"],
        ["Portal · report tasks", "Ask about a specific task", "The report and task in question"],
      ],
      notes: "The portal rows are the clever ones: an investor asking about one task in one monthly report sends an email whose subject already names it. No 'which report do you mean?' round-trip. Treat subjects as routing signals in the inbox.",
    },
    {
      type: "steps",
      label: "Daily habits",
      title: "Running the enquiries inbox well.",
      steps: [
        { n: 1, title: "Watch noreply.ai@satisgroup.co.uk", body: "That is where form submissions and the site's email links deliver. Put it on whoever owns enquiries that week, phones included, since investor questions deserve same-day replies." },
        { n: 2, title: "Reply from a named colleague", body: "Answers should come from a person, not a no-reply address. Move the thread to your own mailbox with the enquiry quoted." },
        { n: 3, title: "Let the pre-filled subjects route", body: "“Investor interest: QUBE, Stockport” goes to whoever runs the raise; report-task questions go to the project lead. The subject already tells you." },
        { n: 4, title: "Log investment enquiries", body: "Anything that could become a cheque deserves a row in the pipeline sheet the same day. Enquiries that only live in an inbox get lost." },
      ],
      aside: {
        tone: "tip",
        title: "A useful test",
        body: ["Once a month, send a test enquiry through the contact form and click one email link. If both reach the inbox and get answered within a day, the channel works."],
        h: 2.1,
      },
      stepsW: 7.9,
      notes: "Adapt names and rotas to how the team actually assigns ownership. The monthly self-test catches silent failures (an expired sending key, a changed mailbox password, a stale forwarding rule) before an investor does.",
    },
    {
      type: "steps",
      label: "What's next",
      title: "Newsletter signups and the live subscriber list.",
      intro: "The News page's Subscribe box completes the picture:",
      steps: [
        { n: 1, title: "Visitors leave an email on /news", body: "One box, instant confirmation." },
        { n: 2, title: "A live subscriber list is rolling out in the admin", body: "A section on the admin newsletter page showing signups as a list you can review and mail. Being deployed as these materials are written." },
        { n: 3, title: "Until it is live in your admin", body: "Signups are not stored. Treat the box as decorative and gather addresses another way. Check /admin/newsletter to see whether the section has arrived." },
      ],
      aside: {
        tone: "check",
        title: "How you'll know",
        body: ["Open /admin/newsletter: a subscribers section beside the composer means the rollout has reached you. Webinar 02 covers using it alongside publishing."],
        h: 2.05,
      },
      stepsW: 7.9,
      notes: "Live-check this during the webinar: open /admin/newsletter on screen. If the subscriber section is there, demonstrate it and ignore step 3; if not, step 3 is the operative guidance. Update this slide when the rollout lands.",
    },
    {
      type: "steps",
      label: "Under the bonnet",
      title: "What powers the form email, and its one setting.",
      intro: "For the curious, and for whoever holds the Vercel keys:",
      steps: [
        { n: 1, title: "Resend does the sending", body: "The site hands each submission to Resend, an email-delivery service, as plain text. Nothing a visitor types is ever rendered as a web page or stored on the site." },
        { n: 2, title: "One key turns it on", body: "SATIS_RESEND_API_KEY in Vercel's environment settings. Missing or expired, forms show the visitor the team's address instead of pretending to send, and the fix is the usual settings-plus-redeploy routine from webinar 06." },
        { n: 3, title: "Destinations are settings too", body: "SATIS_ENQUIRY_TO directs where enquiries land (with SATIS_CONTACT_TO available to split contact-form traffic into a separate inbox if the volume ever justifies it)." },
      ],
      aside: {
        tone: "tip",
        title: "Also unlocked",
        body: ["The same Resend account can later send the newsletter to the subscriber list. The sending rail is already in place."],
        h: 1.85,
      },
      stepsW: 7.9,
      notes: "Submissions are throttled per connection to blunt scripted spam, field lengths are capped, and everything travels as plain text. If forms start reporting failures, the first check is the Resend key in Vercel. Same pattern as the repository token in webinar 06.",
    },
  ],
  takeaways: [
    "Two routes, one inbox: form submissions arrive as email, and every email link is pre-addressed.",
    "Replies are one click. The sender rides on Reply-To of every form submission.",
    "Portal links pre-fill the subject. Let them route the inbox.",
    "Watch noreply.ai@satisgroup.co.uk daily; log investment enquiries the same day.",
    "Sending fails loud, never silent: the visitor is shown the team's address if it ever can't send.",
  ],
  help: [
    "Mailbox access and passwords: managed with the domain at 123 Reg.",
    "Forms reporting send failures? Check SATIS_RESEND_API_KEY in Vercel first.",
    "Want addresses or wording changed? One-sentence Claude request.",
  ],
};
