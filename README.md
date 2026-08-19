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

## Email

The investor enquiry form (`/investors/enquire`) sends submissions to
`noreply@satisgroup.co.uk` through [Resend](https://resend.com). Set these in
the hosting environment (Vercel → Settings → Environment Variables):

| Variable | Required | Default |
| --- | --- | --- |
| `SATIS_RESEND_API_KEY` | yes | — |
| `SATIS_ENQUIRY_TO` | no | `noreply@satisgroup.co.uk` |
| `SATIS_ENQUIRY_FROM` | no | `Satis Group website <noreply@satisgroup.co.uk>` |

The sender must be on a domain verified in the Resend account, so it stays a
satisgroup.co.uk address; the enquirer rides on `Reply-To`, so replying in the
inbox reaches them.

Without `SATIS_RESEND_API_KEY` nothing is sent: in development the submission
is written to the server log and the sender still sees the confirmation, and
in production the form says it could not send and points at
info@satisgroup.co.uk rather than dropping an enquiry silently.

## Notes

The contact and newsletter forms are still front-end only; wire them to
`lib/email.ts` before relying on their submissions.
