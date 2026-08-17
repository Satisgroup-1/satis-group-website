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

## Notes

Contact and newsletter forms are front-end only; wire them to an email
provider before relying on submissions.
