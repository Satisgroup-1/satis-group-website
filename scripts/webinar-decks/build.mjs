// Builds the seven Satis Group backend webinar decks. Content lives in
// content/deck*.mjs; the brand system in theme.mjs. Output: out/*.pptx.
import PptxGenJS from "pptxgenjs";
import { mkdirSync } from "node:fs";
import path from "node:path";
import * as T from "./theme.mjs";

const HERE = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(HERE, "out");
mkdirSync(OUT, { recursive: true });

const { C, FONT, W, MX, CW, TOP } = T;

function baseSlide(pres, s, meta, page) {
  T.header(s, meta.label ?? "", { dark: !!meta.dark, page, deckName: meta.deckName });
}

const RENDER = {
  agenda(pres, sl, page, deck) {
    const s = pres.addSlide();
    baseSlide(pres, s, { label: sl.label ?? "In this webinar", deckName: deck.name }, page);
    T.title(s, sl.title ?? "What this session covers.");
    if (sl.sub) T.lede(s, sl.sub, { y: 1.28, w: 9.6 });
    const items = sl.items;
    const colN = items.length > 4 ? 2 : 1;
    const perCol = Math.ceil(items.length / colN);
    const rightEdge = sl.aside ? 8.55 : W - MX;
    const colW = colN === 2 ? (rightEdge - MX - 0.55) / 2 : Math.min(8.4, rightEdge - MX);
    const rowStep = sl.aside && colN === 2 ? 1.18 : 0.92;
    items.forEach((it, i) => {
      const col = Math.floor(i / perCol);
      const row = i % perCol;
      const x = MX + col * (colW + 0.55);
      const y = 2.42 + row * rowStep;
      s.addText(String(i + 1).padStart(2, "0"), {
        x, y: y + 0.02, w: 0.5, h: 0.3, fontFace: FONT, fontSize: 11,
        color: C.muted, charSpacing: 1.5, margin: 0,
      });
      s.addText(it.title, {
        x: x + 0.55, y, w: colW - 0.55, h: 0.3, fontFace: FONT, fontSize: 12.5,
        color: C.ink, bold: true, margin: 0,
      });
      if (it.sub) s.addText(it.sub, {
        x: x + 0.55, y: y + 0.3, w: colW - 0.55, h: 0.42, fontFace: FONT,
        fontSize: 9.5, color: C.muted, margin: 0, lineSpacing: 13,
      });
    });
    if (sl.aside) {
      T.panel(s, { tone: sl.aside.tone ?? "tip", title: sl.aside.title, body: sl.aside.body,
        x: 8.9, y: 2.42, w: 3.8, h: sl.aside.h ?? 2.6 });
    }
    if (sl.notes) s.addNotes(sl.notes);
  },

  steps(pres, sl, page, deck) {
    const s = pres.addSlide();
    baseSlide(pres, s, { label: sl.label, deckName: deck.name }, page);
    T.title(s, sl.title);
    let stepTop = TOP;
    const introW = sl.image ? 11.6 : sl.aside ? (sl.stepsW ?? 8.6) - 0.2 : 9.8;
    if (sl.intro) {
      T.lede(s, sl.intro, { y: 1.3, w: introW });
      stepTop = 2.3 + (T.estLines(sl.intro, introW, 11.5) > 2 ? 0.26 : 0);
    }
    if (sl.image) {
      const boxW = sl.imageW ?? 5.4;
      const img = T.image(s, sl.image, {
        x: W - MX - boxW, y: stepTop, maxW: boxW, maxH: sl.imageH ?? (6.86 - stepTop),
        caption: sl.caption,
      });
      const colW = W - MX * 2 - boxW - 0.55;
      const bottom = T.steps(s, sl.steps, { x: MX, y: stepTop + (sl.stepsDy ?? 0), w: colW, bodySize: sl.bodySize ?? 10.5 });
      if (sl.panel) {
        const ph = sl.panel.h ?? 1.1;
        const py = Math.min(Math.max(bottom + 0.12, sl.panel.minY ?? 0), 7.0 - ph);
        T.panel(s, { ...sl.panel, x: MX, y: py, w: colW, h: ph });
      }
    } else {
      const colW = sl.stepsW ?? 8.6;
      const bottom = T.steps(s, sl.steps, { x: MX, y: stepTop, w: colW, bodySize: sl.bodySize ?? 10.5 });
      if (sl.panel) T.panel(s, { ...sl.panel, x: MX, y: bottom + 0.15, w: colW, h: sl.panel.h ?? 1.15 });
      if (sl.aside) T.panel(s, { ...sl.aside, x: MX + colW + 0.5, y: TOP + 0.05, w: CW - colW - 0.5, h: sl.aside.h ?? 2.6 });
    }
    if (sl.notes) s.addNotes(sl.notes);
  },

  imageFocus(pres, sl, page, deck) {
    const s = pres.addSlide();
    baseSlide(pres, s, { label: sl.label, deckName: deck.name }, page);
    T.title(s, sl.title);
    const textW = sl.textW ?? 4.1;
    if (sl.body) {
      const runs = [];
      sl.body.forEach((b, i) => {
        if (typeof b === "string") runs.push({ text: b + "\n", options: { fontSize: 11, color: C.muted, paraSpaceAfter: 10, lineSpacing: 16 } });
        else runs.push({ text: b.text + "\n", options: { fontSize: b.size ?? 11, bold: !!b.bold, color: b.mutedText === false ? C.ink : C.muted, paraSpaceAfter: 10, lineSpacing: 16 } });
      });
      s.addText(runs, { x: MX, y: TOP + 0.05, w: textW, h: 4.7, fontFace: FONT, margin: 0, valign: "top" });
    }
    T.image(s, sl.image, {
      x: MX + textW + 0.45, y: TOP, maxW: W - MX * 2 - textW - 0.45, maxH: sl.imageH ?? 5.14,
      caption: sl.caption,
    });
    if (sl.panel) T.panel(s, { ...sl.panel, x: MX, y: sl.panel.y ?? 5.4, w: textW, h: sl.panel.h ?? 1.35 });
    if (sl.notes) s.addNotes(sl.notes);
  },

  panels(pres, sl, page, deck) {
    const s = pres.addSlide();
    baseSlide(pres, s, { label: sl.label, deckName: deck.name }, page);
    T.title(s, sl.title);
    let top = TOP + 0.1;
    if (sl.intro) { T.lede(s, sl.intro, { y: 1.3, w: 10.4 }); top = 2.42; }
    const cols = sl.cols ?? sl.panels.length;
    const gap = 0.34;
    const pw = (CW - gap * (cols - 1)) / cols;
    const rows = Math.ceil(sl.panels.length / cols);
    const ph = sl.panelH ?? ((6.86 - top - (rows - 1) * gap) / rows);
    sl.panels.forEach((p, i) => {
      const cx = MX + (i % cols) * (pw + gap);
      const cy = top + Math.floor(i / cols) * (ph + gap);
      T.panel(s, { ...p, x: cx, y: cy, w: pw, h: p.h ?? ph });
    });
    if (sl.notes) s.addNotes(sl.notes);
  },

  statement(pres, sl, page, deck) {
    const s = pres.addSlide();
    if (sl.dark) s.background = { color: C.ink };
    baseSlide(pres, s, { label: sl.label, dark: sl.dark, deckName: deck.name }, page);
    s.addText(sl.big, {
      x: MX, y: 2.6, w: CW - 1, h: 1.6, fontFace: FONT, fontSize: sl.bigSize ?? 26,
      color: sl.dark ? C.paper : C.ink, margin: 0, lineSpacing: (sl.bigSize ?? 26) * 1.25,
    });
    if (sl.sub) s.addText(sl.sub, {
      x: MX, y: sl.subY ?? 4.55, w: 10.6, h: 1.5, fontFace: FONT, fontSize: 12.5,
      color: sl.dark ? C.darkMuted : C.muted, margin: 0, lineSpacing: 19,
    });
    if (sl.notes) s.addNotes(sl.notes);
  },

  twoCol(pres, sl, page, deck) {
    const s = pres.addSlide();
    baseSlide(pres, s, { label: sl.label, deckName: deck.name }, page);
    T.title(s, sl.title);
    if (sl.intro) T.lede(s, sl.intro, { y: 1.3, w: 10.4 });
    const top = sl.intro ? 2.45 : TOP + 0.1;
    const pw = (CW - 0.7) / 2;
    [sl.left, sl.right].forEach((col, ci) => {
      const x = MX + ci * (pw + 0.7);
      s.addText(col.heading.toUpperCase(), {
        x, y: top, w: pw, h: 0.24, fontFace: FONT, fontSize: 9,
        color: C.muted, charSpacing: 2.2, margin: 0,
      });
      s.addShape("line", { x, y: top + 0.34, w: pw, h: 0, line: { color: C.stone, width: 0.75 } });
      const items = col.items.map((t, i) => ({
        text: t,
        options: {
          fontSize: 10.5, color: C.ink,
          bullet: col.numbered ? { type: "number", indent: 16 } : { code: "2022", indent: 12 },
          paraSpaceAfter: 9, breakLine: true, lineSpacing: 15,
        },
      }));
      s.addText(items, { x: x + 0.02, y: top + 0.5, w: pw - 0.05, h: 4.1, fontFace: FONT, margin: 0, valign: "top" });
    });
    if (sl.panel) T.panel(s, { ...sl.panel, x: MX, y: 5.95, w: CW, h: sl.panel.h ?? 0.95 });
    if (sl.notes) s.addNotes(sl.notes);
  },

  table(pres, sl, page, deck) {
    const s = pres.addSlide();
    baseSlide(pres, s, { label: sl.label, deckName: deck.name }, page);
    T.title(s, sl.title);
    if (sl.intro) T.lede(s, sl.intro, { y: 1.3, w: 10.4 });
    const rows = [
      sl.headers.map((h) => ({
        text: h.toUpperCase(),
        options: { bold: false, color: C.muted, fontSize: 8.5, charSpacing: 1.8, fill: { color: "FFFFFF" }, border: [{ type: "none" }, { type: "none" }, { pt: 1, color: C.ink }, { type: "none" }], margin: [0.06, 0.04, 0.08, 0.04] },
      })),
      ...sl.rows.map((r) => r.map((cell, ci) => ({
        text: cell,
        options: {
          color: ci === 0 ? C.ink : C.muted, bold: ci === 0 && sl.boldFirst !== false,
          fontSize: 10, border: [{ type: "none" }, { type: "none" }, { pt: 0.5, color: C.stone }, { type: "none" }],
          margin: [0.09, 0.04, 0.09, 0.04], valign: "top",
        },
      }))),
    ];
    s.addTable(rows, {
      x: MX, y: sl.intro ? 2.45 : TOP + 0.05, w: CW, colW: sl.colW,
      fontFace: FONT, autoPage: false,
    });
    if (sl.notes) s.addNotes(sl.notes);
  },

  diagram(pres, sl, page, deck) {
    const s = pres.addSlide();
    if (sl.dark) s.background = { color: C.ink };
    baseSlide(pres, s, { label: sl.label, dark: sl.dark, deckName: deck.name }, page);
    T.title(s, sl.title, { dark: sl.dark });
    if (sl.intro) T.lede(s, sl.intro, { y: 1.3, w: 10.6, dark: sl.dark });
    sl.draw(s, T);
    if (sl.notes) s.addNotes(sl.notes);
  },

  custom(pres, sl, page, deck) {
    const s = pres.addSlide();
    if (sl.dark) s.background = { color: C.ink };
    if (sl.chrome !== false) baseSlide(pres, s, { label: sl.label, dark: sl.dark, deckName: deck.name }, page);
    sl.draw(s, T, pres);
    if (sl.notes) s.addNotes(sl.notes);
  },
};

export async function buildDeck(deck) {
  const pres = new PptxGenJS();
  pres.defineLayout({ name: "WIDE", width: 13.333, height: 7.5 });
  pres.layout = "WIDE";
  pres.author = "Satis Group";
  pres.company = "Satis Group";
  pres.title = deck.title;

  const cover = T.coverSlide(pres, {
    photo: deck.cover, series: "Satis Group · Backend webinar series",
    titleText: deck.title, sub: deck.subtitle, deckNo: deck.no,
  });
  if (deck.coverNotes) cover.addNotes(deck.coverNotes);

  let page = 2;
  for (const sl of deck.slides) {
    const fn = RENDER[sl.type];
    if (!fn) throw new Error(`unknown slide type ${sl.type}`);
    fn(pres, sl, page, deck);
    page++;
  }

  T.closeSlide(pres, { takeaways: deck.takeaways, helpLines: deck.help, page, deckName: deck.name })
    .addNotes(deck.closeNotes ?? "Recap the takeaways, answer questions, and point everyone at the written guide.");

  const file = path.join(OUT, deck.file);
  await pres.writeFile({ fileName: file });
  console.log("✓", deck.file, `(${deck.slides.length + 2} slides)`);
}

const which = process.argv[2];
const all = ["deck1", "deck2", "deck3", "deck4", "deck5", "deck6", "deck7"];
for (const name of which ? [which] : all) {
  const mod = await import(`./content/${name}.mjs`);
  await buildDeck(mod.deck);
}
