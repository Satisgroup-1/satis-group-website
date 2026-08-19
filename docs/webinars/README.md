# Backend webinar series

Seven PowerPoint decks that walk the team through every functional part of the
website's backend. Each deck is self-contained, follows the Satis brand
guidelines (Satis_Brand_V7_1: Work Sans, monochrome palette, letterspaced
wordmark), and carries **presenter notes on every slide** — open the notes
view in PowerPoint and the talk track is written for you.

| # | Deck | Covers |
|---|------|--------|
| 01 | Editing the website with Claude | Starting a Claude Code session, plain-English change requests, commit & push, skills, safety |
| 02 | The newsletter studio | Writing and publishing news stories, formatting, corrections, the live-hosting routine, signups |
| 03 | Admin accounts & access | Adding admins via `SATIS_ADMIN_USERS`, Vercel + redeploy, resets, removals, lock-outs |
| 04 | The investor platform | The portal, the seven-tab studio, accounts, cap tables, cash events, reports, insights, raises, documents, support |
| 05 | The Satis Appraisal agent | What the desktop app does, downloading, installing (Windows/Mac), AI setup, pricing research |
| 06 | The systems behind the website | GitHub, Vercel, 123 Reg, the change lifecycle, settings, the repository token, troubleshooting |
| 07 | Contact & email | The two forms and how they deliver, email links into the enquiries inbox, daily habits, what's next |

## Presenting

- **Install the Work Sans font** (free, [fonts.google.com/specimen/Work+Sans](https://fonts.google.com/specimen/Work+Sans))
  on the machine you present from — the decks reference it and fall back to a
  default sans otherwise.
- Screenshots use the same numbered orange badges as the illustrated
  operations guide at `/admin/guide`, and slide step numbers match them.
- Decks 02 and 07 each carry one slide about the newsletter **subscriber
  list**, which was mid-rollout when these decks were generated — check
  `/admin/newsletter` before presenting and update those slides if the
  section has landed (the speaker notes flag this too).

## Updating

The decks are generated from data files — see `scripts/webinar-decks/`.
Change the content there and rebuild rather than editing slides by hand, or
edit the .pptx directly for one-off tweaks.
