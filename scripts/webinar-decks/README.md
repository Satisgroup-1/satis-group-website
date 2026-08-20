# Webinar deck generator

Generates the seven backend webinar decks in `docs/webinars/` from data files,
applying the Satis brand system (Work Sans, monochrome palette, letterspaced
wordmark, hairline-rule page motif) via `theme.mjs`. Designed to run inside a
Claude Code session on this repository, like `capture-guide-screenshots.mjs`.

## Layout

- `theme.mjs` — the brand system: colours, wordmark, header/footer, panels,
  step chips (the same orange as the guide's screenshot badges), diagram nodes,
  cover/divider/closing slides.
- `build.mjs` — slide-type renderers (agenda, steps, panels, imageFocus,
  twoCol, table, diagram, statement) and the build loop.
- `content/deck1.mjs … deck7.mjs` — everything that appears on the slides,
  including per-slide presenter notes. Edit these.
- `prep-images.mjs` — prepares embedded images into `assets/`: crops the site
  footer off full-page screenshots in `public/admin-guide/`, cuts regions,
  resizes, and records dimensions in `assets/dims.json`.
- `capture-deck-screens.mjs` — captures the extra screenshots the decks need
  beyond `public/admin-guide/` (contact page, investor login/enquire, guide
  hub, news story, portfolio) into `shots/`.

## Regenerating

```bash
npm install                              # repo deps (includes playwright-core)
npm i --no-save pptxgenjs sharp          # generator-only deps, not saved
npm run dev                              # in one terminal

# in another terminal, from this directory:
node capture-deck-screens.mjs            # fresh screenshots -> shots/
node prep-images.mjs                     # process into assets/ + dims.json
node build.mjs                           # all decks -> out/*.pptx
node build.mjs deck2                     # or a single deck
cp out/*.pptx ../../docs/webinars/
```

Cover photography comes from `public/images/**` hero shots; admin screenshots
from `public/admin-guide/` (regenerate those first with
`capture-guide-screenshots.mjs` if the admin UI has changed).

Known state at generation time (2026-08-19): the contact and investor enquiry
forms deliver by email through Resend (`SATIS_RESEND_API_KEY`, destinations
`SATIS_ENQUIRY_TO`/`SATIS_CONTACT_TO`), every site email address is unified on
noreply.ai@satisgroup.co.uk, and the newsletter subscriber-list admin section
was mid-rollout — decks 02 and 07 carry clearly-marked slides to update when
that lands. House style for the decks: no em-dashes anywhere on slides or in
notes (labels use `·`; the platform's task and pull-quote syntax is taught in
its `--` form, which the parsers accept alongside the long dash).
