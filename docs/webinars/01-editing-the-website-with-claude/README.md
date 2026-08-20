# Webinar 01 — Editing the website with Claude

`01-editing-the-website-with-claude.pptx` is the deck used for the backend webinar
series. This revision adds five slides to the original twelve:

| Page | Slide | Why |
| --- | --- | --- |
| 05 | Connecting Claude to a different GitHub account | Which account is connected decides which repositories a session can see |
| 06 | Choosing the account, then the repositories | The two GitHub screens that follow, and what to pick on each |
| 10 | Seeing a change before it goes live | What a branch preview is, and the fastest way to get its address |
| 11 | Finding a preview in Vercel, click by click | The dashboard route, with the tabs and buttons marked |
| 14 | Where the skills are, and what one actually is | Both places skills come from, and a one-sentence definition |

The agenda (02) and the recap (17) were rewritten to match, and the page numbers
on the slides that moved were renumbered.

## The screenshots

`screenshots/` holds annotated renderings of the claude.ai, GitHub and Vercel
screens the new slides walk through. They are **built from HTML, not captured
from a live session** — the pages involved sit behind sign-in, and recreating
them keeps the account names, repository names and branch names on-brand and
free of anyone's real data. Each one follows the real interface's layout and
labels; the orange callouts are ours. Re-check them against the live products
before a rerun of the webinar, since all three interfaces move.

## Rebuilding

```bash
npm install playwright pptxgenjs      # in a scratch directory
node scripts/mockups.mjs              # writes shots/*.png
node scripts/newslides.mjs            # writes new.pptx — the added/replaced slides only
python3 scripts/merge.py              # splices them into deck.pptx -> out.pptx
```

`merge.py` expects the previous revision of the deck alongside it as `deck.pptx`.
It leaves every untouched slide byte-for-byte identical, so the original design
survives editing rounds; only the replaced slides, the new slides and the
renumbered page footers change.
