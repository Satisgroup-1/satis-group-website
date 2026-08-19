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

The investor enquiry form (`/investors/enquire`) and the contact form
(`/contact`) send submissions to `noreply@satisgroup.co.uk` through
[Resend](https://resend.com). Set these in the hosting environment
(Vercel → Settings → Environment Variables):

| Variable | Required | Default |
| --- | --- | --- |
| `SATIS_RESEND_API_KEY` | yes | — |
| `SATIS_ENQUIRY_TO` | no | `noreply@satisgroup.co.uk` |
| `SATIS_CONTACT_TO` | no | whatever `SATIS_ENQUIRY_TO` resolves to |
| `SATIS_ENQUIRY_FROM` | no | `Satis Group website <noreply@satisgroup.co.uk>` |

Both forms land in the same inbox unless `SATIS_CONTACT_TO` splits the general
enquiries out.

The sender must be on a domain verified in the Resend account, so it stays a
satisgroup.co.uk address; the enquirer rides on `Reply-To`, so replying in the
inbox reaches them.

Without `SATIS_RESEND_API_KEY` nothing is sent: in development the submission
is written to the server log and the sender still sees the confirmation, and
in production the form says it could not send and points at
info@satisgroup.co.uk rather than dropping an enquiry silently.

`lib/email.ts` is the Resend client; `lib/enquiry.ts` holds the shared form
plumbing (field reading, per-IP throttle, delivery and the not-configured
behaviour) that both server actions use.

## Notes

The newsletter signup is still front-end only; wire it through
`lib/enquiry.ts` before relying on its submissions.
