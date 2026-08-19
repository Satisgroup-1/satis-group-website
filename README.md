# Satis Group

Marketing website for Satis Group, a Manchester-based property development
company specialising in the renovation of neglected buildings across Greater
Manchester and the North West.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- Tailwind CSS v4
- Framer Motion for scroll and interaction animation

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — run ESLint

## Structure

- `app/` — routes: home, about, portfolio (+ per-development pages),
  newsletter (+ issues), careers, contact
- `components/` — shared UI and graphic/motion components
- `lib/` — portfolio and property page data, newsletter loader
- `content/newsletters/` — Markdown newsletter issues (drop a file to publish)
- `public/images/` — photography, team headshots, floor plans

## Content

- **Portfolio**: developments are defined in `lib/portfolio-data.ts` (cards)
  and `lib/property-pages.ts` (detail pages).
- **Newsletters**: add a Markdown file to `content/newsletters/` with
  `title`, `date` and `summary` frontmatter to publish a new issue.
- **Theme**: light/dark, brand palette defined in `app/globals.css`.

## Contact form email

The contact form posts to `app/api/contact/route.ts`, which sends each
submission through Microsoft 365 (Outlook) SMTP to `info@satisgroup.co.uk`
(the visitor's address is set as reply-to, so replying in Outlook goes
straight back to them).

Setup — see `.env.example` for details on each variable:

1. In the Microsoft 365 admin center, enable **Authenticated SMTP** on the
   sending mailbox (e.g. `noreply.ai@satisgroup.co.uk`).
2. On Vercel: Project → Settings → Environment Variables, add `SMTP_USER`,
   `SMTP_PASS` and (optionally) `CONTACT_TO_EMAIL`, then redeploy.
3. Locally: copy `.env.example` to `.env.local` and fill in the values.

If the variables are missing the API returns 503 and the form shows a
"temporarily unavailable" message; submissions are never silently dropped.

## Notes

The newsletter form is front-end only; wire it to an email provider before
relying on submissions.
