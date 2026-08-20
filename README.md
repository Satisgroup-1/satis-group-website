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

## Staging deployment

Every branch pushed to GitHub gets its own Vercel preview build, and the
`staging` branch is the stable one to point people at: same code, same build
pipeline, separate URL, so a change can be looked at properly before it
reaches www.satisgroup.co.uk.

### Day-to-day use

```bash
git switch staging
git merge main            # start from what is live
# ...make the change...
git push -u origin staging
```

Vercel builds the push and updates the staging URL. When it looks right,
merge the same commits into `main` to publish.

### One-time Vercel setup

In the Vercel project (Settings → Git):

1. **Production Branch** — `main`. Only `main` deploys to the live domain.
2. **Preview Deployments** — leave enabled for all branches.
3. Settings → Domains → add `staging.satisgroup.co.uk`, choose *Preview* and
   assign it to the `staging` branch, then add the DNS `CNAME` Vercel shows.
   Without a custom domain the staging URL is still stable at
   `satis-group-website-git-staging-<team>.vercel.app`.
4. Settings → Deployment Protection → turn on Vercel Authentication for
   Preview deployments if staging should stay behind a login.

### Environment variables

Vercel scopes each variable to Production, Preview and Development
separately, and the staging deployment must not reach into live data:

| Variable | Production | Preview (staging) |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://www.satisgroup.co.uk` | leave unset, or the staging domain |
| `SATIS_GITHUB_BRANCH` | `main` | `staging` |
| `SATIS_GITHUB_TOKEN` | live token | set only if admin edits should be testable |
| `SATIS_ENQUIRY_TO` / `SATIS_CONTACT_TO` | real inbox | a test inbox |
| `SATIS_ADMIN_SECRET` / `SATIS_INVESTOR_SECRET` | live secrets | different values |

`NEXT_PUBLIC_SITE_URL` in particular must be scoped to Production only —
set for all environments it would make staging claim the live canonical URLs.
`SATIS_GITHUB_BRANCH` matters because `/admin/platform` commits investor data
back to the repository (`lib/github-storage.ts`); pointed at `main`, an edit
made on staging would publish itself to the live site.

### What the code does differently off production

`lib/site.ts` reads `NEXT_PUBLIC_VERCEL_ENV`, which Vercel sets on every
deployment, and treats anything other than `production` as a copy:

- `robots.txt` disallows everything, and every response carries
  `X-Robots-Tag: noindex, nofollow` plus a `noindex` meta tag, so staging
  never competes with the live site in search results.
- Canonical, Open Graph and sitemap URLs use the deployment's own hostname
  instead of www.satisgroup.co.uk.
- A small "Staging" marker sits in the bottom-left corner
  (`components/StagingBadge.tsx`) so a staging tab is never mistaken for the
  live site. Locally it reads "Local".

## Notes

The newsletter signup is still front-end only; wire it through
`lib/enquiry.ts` before relying on its submissions.
