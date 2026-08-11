# Satis Group

Marketing website for Satis Group, a Cheshire-based property development
company specialising in the renovation of neglected buildings across the
North West.

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

## Share an online preview

To give a client or teammate a temporary public link without deploying the
site, run:

```bash
npm run preview:online
```

The command starts the Next.js development server, waits for it to be ready,
and prints a `https://…loca.lt` URL. Keep the command running while the link is
being reviewed, then press `Ctrl+C` to close both the tunnel and local server.
The URL is temporary and should only be used for review—not production.

## Scripts

- `npm run dev` — start the dev server
- `npm run preview:online` — start the site with a temporary public review URL
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
