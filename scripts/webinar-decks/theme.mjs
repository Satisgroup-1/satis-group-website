// The Satis brand system for the webinar decks, per Satis_Brand_V7_1:
// letterspaced SATIS wordmark, Work Sans, monochrome palette (#ffffff,
// #000000, #ced1d2), small top-left label over a full-width hairline rule,
// generous whitespace, photography with white type. The single orange
// (#b3400c) is reserved for step-number chips so they match the numbered
// badges baked into the admin screenshots.
import { readFileSync } from "node:fs";
import path from "node:path";

const HERE = path.dirname(new URL(import.meta.url).pathname);
export const ASSETS = path.join(HERE, "assets");
export const DIMS = JSON.parse(readFileSync(path.join(ASSETS, "dims.json"), "utf8"));

export const C = {
  ink: "000000",
  paper: "FFFFFF",
  stone: "CED1D2",   // brand light grey: hairlines, frames, panels
  stoneTint: "ECEEEE", // stone at panel strength on white
  muted: "5C6366",   // muted text (monochrome family)
  faint: "9AA0A2",   // footer / page numbers
  marker: "B3400C",  // screenshot badge orange: step chips ONLY
  darkRule: "3A3A3A",
  darkMuted: "B9BDBE",
};

export const FONT = "Work Sans";
export const W = 13.333;
export const H = 7.5;
export const MX = 0.62;                 // page margin
export const CW = W - MX * 2;           // content width
export const TOP = 1.72;                // content top (below header block)

export const asset = (name) => path.join(ASSETS, name);

// ---------- primitives ----------

export function fit(name, maxW, maxH) {
  const d = DIMS[name];
  if (!d) throw new Error(`no dims for ${name}`);
  const s = Math.min(maxW / d.w, maxH / d.h);
  return { w: d.w * s, h: d.h * s };
}

/** Letterspaced SATIS wordmark. size = cap height in points. */
export function wordmark(slide, { x, y, size = 18, color = C.ink, sub = "GROUP", align = "left", w = 3 }) {
  slide.addText("SATIS", {
    x, y, w, h: size / 50,
    align, fontFace: FONT, fontSize: size, color,
    charSpacing: size * 0.72, margin: 0, bold: false,
  });
  if (sub) {
    slide.addText(sub, {
      x, y: y + size / 62, w, h: 0.3,
      align, fontFace: FONT, fontSize: size * 0.34, color,
      charSpacing: size * 0.3, margin: 0,
    });
  }
}

/** Small top-left label + full-width hairline rule (the brand-book page motif). */
export function header(slide, label, { dark = false, page, deckName } = {}) {
  slide.addText((label ?? "").toUpperCase(), {
    x: MX, y: 0.34, w: CW - 1.4, h: 0.28,
    fontFace: FONT, fontSize: 9.5, color: dark ? C.darkMuted : C.muted,
    charSpacing: 2.6, margin: 0, align: "left", valign: "middle",
  });
  slide.addShape("line", {
    x: MX, y: 0.76, w: CW, h: 0,
    line: { color: dark ? C.darkRule : C.ink, width: 0.75 },
  });
  // top-right miniature wordmark, as on the site header
  slide.addText("SATIS", {
    x: W - MX - 1.4, y: 0.27, w: 1.4, h: 0.24,
    fontFace: FONT, fontSize: 11, color: dark ? C.paper : C.ink,
    charSpacing: 5, margin: 0, align: "right",
  });
  slide.addText("GROUP", {
    x: W - MX - 1.4, y: 0.5, w: 1.4, h: 0.16,
    fontFace: FONT, fontSize: 5.5, color: dark ? C.darkMuted : C.muted,
    charSpacing: 3.4, margin: 0, align: "right",
  });
  footer(slide, { dark, page, deckName });
}

export function footer(slide, { dark = false, page, deckName } = {}) {
  slide.addText(deckName ? `SATIS GROUP · ${deckName.toUpperCase()}` : "SATIS GROUP", {
    x: MX, y: 7.08, w: 7, h: 0.22,
    fontFace: FONT, fontSize: 7, color: dark ? C.darkMuted : C.faint,
    charSpacing: 2, margin: 0,
  });
  if (page != null) {
    slide.addText(String(page).padStart(2, "0"), {
      x: W - MX - 1, y: 7.08, w: 1, h: 0.22, align: "right",
      fontFace: FONT, fontSize: 8, color: dark ? C.darkMuted : C.faint,
      charSpacing: 1, margin: 0,
    });
  }
}

export function title(slide, text, { y = 1.02, size = 25, dark = false, w = CW } = {}) {
  slide.addText(text, {
    x: MX, y, w, h: 0.62,
    fontFace: FONT, fontSize: size, color: dark ? C.paper : C.ink,
    margin: 0, align: "left",
  });
}

export function lede(slide, text, { y = 1.34, w = 9.4, dark = false } = {}) {
  slide.addText(text, {
    x: MX, y: y + 0.36, w, h: 0.52,
    fontFace: FONT, fontSize: 11.5, color: dark ? C.darkMuted : C.muted,
    margin: 0, lineSpacing: 16,
  });
}

/** Image at exact aspect inside a bounding box, with hairline frame + caption. */
export function image(slide, name, { x, y, maxW, maxH, caption, dark = false, align = "center" } = {}) {
  const { w, h } = fit(name, maxW, maxH);
  const px = align === "left" ? x : align === "right" ? x + (maxW - w) : x + (maxW - w) / 2;
  const py = y + (maxH - h) / 2;
  slide.addImage({ path: asset(name), x: px, y: py, w, h });
  slide.addShape("rect", {
    x: px, y: py, w, h, fill: { type: "none" },
    line: { color: dark ? C.darkRule : C.stone, width: 1 },
  });
  if (caption) {
    slide.addText(caption, {
      x: px, y: py + h + 0.07, w: Math.max(w, 3), h: 0.28,
      fontFace: FONT, fontSize: 8.5, color: dark ? C.darkMuted : C.muted,
      margin: 0, lineSpacing: 11,
    });
  }
  return { x: px, y: py, w, h };
}

/** Orange numbered chip matching the screenshot annotation badges. */
export function chip(slide, n, x, y, { d = 0.27, color = C.marker } = {}) {
  slide.addShape("ellipse", { x, y, w: d, h: d, fill: { color }, line: { type: "none" } });
  slide.addText(String(n), {
    x: x - 0.05, y: y - 0.028, w: d + 0.1, h: d + 0.05, align: "center", valign: "middle",
    fontFace: FONT, fontSize: 10.5, color: C.paper, bold: true, margin: 0,
  });
}

const CHARS_PER_IN = { 10: 12.4, 10.5: 11.8, 11: 11.3, 12: 10.3, 12.5: 9.9 };
export function estLines(text, wIn, fontSize = 10.5) {
  const cpl = (CHARS_PER_IN[fontSize] ?? 11.5) * wIn;
  return Math.max(1, Math.ceil(text.length / cpl));
}

/** Vertical run of numbered steps: chip + bold title + body. Returns bottom y. */
export function steps(slide, items, { x, y, w, gap = 0.16, bodySize = 10.5, titleSize = 12, chipColor } = {}) {
  let cy = y;
  for (const it of items) {
    const textX = x + 0.46;
    const textW = w - 0.46;
    if (it.n != null) chip(slide, it.n, x, cy + 0.015, { color: chipColor });
    slide.addText(it.title, {
      x: textX, y: cy, w: textW, h: 0.3,
      fontFace: FONT, fontSize: titleSize, color: C.ink, bold: true, margin: 0,
    });
    let bodyH = 0;
    if (it.body) {
      const lines = estLines(it.body, textW, bodySize);
      bodyH = lines * (bodySize * 1.42) / 72 + 0.04;
      slide.addText(it.body, {
        x: textX, y: cy + 0.3, w: textW, h: bodyH,
        fontFace: FONT, fontSize: bodySize, color: C.muted, margin: 0,
        lineSpacing: bodySize * 1.42,
      });
    }
    cy += 0.3 + bodyH + gap;
  }
  return cy;
}

/** Callout panel. Tones: tip (stone tint + label), warn (black + label),
 *  check (outline + label), plain (outline, no label), plainquote (tint,
 *  italic quote, no label). */
export function panel(slide, { tone = "tip", title: t, body, x, y, w, h, bodySize = 10 }) {
  const dark = tone === "warn";
  const quote = tone === "plainquote";
  const fill = tone === "tip" || quote ? { color: C.stoneTint } : dark ? { color: C.ink } : { color: C.paper };
  const line = tone === "check" || tone === "plain" ? { color: tone === "check" ? C.ink : C.stone, width: 0.75 } : { type: "none" };
  slide.addShape("rect", { x, y, w, h, fill, line });
  const label = dark ? "TAKE CARE" : tone === "check" ? "WHAT YOU SHOULD SEE" : tone === "tip" ? "GOOD TO KNOW" : null;
  if (label) {
    slide.addText(label, {
      x: x + 0.24, y: y + 0.16, w: w - 0.48, h: 0.2,
      fontFace: FONT, fontSize: 7.5, color: dark ? C.darkMuted : C.muted,
      charSpacing: 2, margin: 0,
    });
  }
  const runs = [];
  if (t) runs.push({
    text: t + "\n",
    options: {
      bold: !quote, italic: quote,
      fontSize: quote ? bodySize + 1.5 : bodySize + 1,
      color: dark ? C.paper : C.ink,
      paraSpaceAfter: quote ? 8 : 2,
    },
  });
  const bodyArr = Array.isArray(body) ? body : body ? [body] : [];
  bodyArr.forEach((b, i) => runs.push({
    text: b + (i < bodyArr.length - 1 ? "\n" : ""),
    options: { fontSize: bodySize, color: dark ? C.darkMuted : C.muted, paraSpaceAfter: 5 },
  }));
  slide.addText(runs, {
    x: x + 0.24, y: y + (label ? 0.4 : 0.18), w: w - 0.48, h: h - (label ? 0.55 : 0.36),
    fontFace: FONT, margin: 0, valign: "top", lineSpacing: bodySize * 1.38,
  });
}

/** Diagram node box. */
export function node(slide, { x, y, w, h, label, sub, dark = false, fillDark = false }) {
  slide.addShape("rect", {
    x, y, w, h,
    fill: fillDark ? { color: C.ink } : { color: dark ? C.ink : C.paper },
    line: { color: fillDark ? C.ink : dark ? C.darkRule : C.ink, width: 1 },
  });
  const runs = [{ text: label, options: { fontSize: 11, bold: true, color: fillDark || dark ? C.paper : C.ink } }];
  if (sub) runs.push({ text: "\n" + sub, options: { fontSize: 8.5, color: fillDark || dark ? C.darkMuted : C.muted } });
  slide.addText(runs, {
    x: x + 0.08, y, w: w - 0.16, h, align: "center", valign: "middle",
    fontFace: FONT, margin: 0, lineSpacing: 13,
  });
}

export function arrow(slide, x1, y1, x2, y2, { dark = false, dash } = {}) {
  slide.addShape("line", {
    x: x1, y: y1, w: x2 - x1, h: y2 - y1,
    line: { color: dark ? C.paper : C.ink, width: 1.2, endArrowType: "triangle", dashType: dash },
  });
}

export function arrowLabel(slide, text, x, y, w, { dark = false } = {}) {
  slide.addText(text, {
    x, y, w, h: 0.2, align: "center",
    fontFace: FONT, fontSize: 8, color: dark ? C.darkMuted : C.muted,
    charSpacing: 1, margin: 0,
  });
}

// ---------- full-slide layouts ----------

export function coverSlide(pres, { photo, series, titleText, sub, deckNo }) {
  const s = pres.addSlide();
  s.background = { color: C.ink };
  s.addImage({ path: asset(photo), x: 0, y: 0, w: W, h: H });
  s.addShape("rect", { x: 0, y: 0, w: W, h: H, fill: { color: "000000", transparency: 42 }, line: { type: "none" } });
  // brand hairline near the top, as on the brand-book photo covers
  s.addShape("line", { x: MX, y: 0.62, w: CW, h: 0, line: { color: "FFFFFF", width: 0.75 } });
  s.addText(series.toUpperCase(), {
    x: MX, y: 0.78, w: CW, h: 0.3, fontFace: FONT, fontSize: 9.5,
    color: "FFFFFF", charSpacing: 3, margin: 0,
  });
  // centered wordmark
  s.addText("SATIS", {
    x: 0, y: 2.52, w: W, h: 0.85, align: "center",
    fontFace: FONT, fontSize: 40, color: "FFFFFF", charSpacing: 30, margin: 0,
  });
  s.addText("GROUP", {
    x: 0, y: 3.38, w: W, h: 0.3, align: "center",
    fontFace: FONT, fontSize: 12.5, color: "FFFFFF", charSpacing: 11, margin: 0,
  });
  s.addText(titleText, {
    x: 1.5, y: 4.28, w: W - 3, h: 0.7, align: "center",
    fontFace: FONT, fontSize: 27, color: "FFFFFF", margin: 0,
  });
  if (sub) {
    s.addText(sub, {
      x: 2.4, y: 5.02, w: W - 4.8, h: 0.62, align: "center",
      fontFace: FONT, fontSize: 12, color: "E8EAEA", margin: 0, lineSpacing: 17,
    });
  }
  s.addText(`BACKEND WEBINAR ${String(deckNo).padStart(2, "0")} OF 07`, {
    x: MX, y: 6.92, w: CW, h: 0.26, align: "center",
    fontFace: FONT, fontSize: 8.5, color: "D8DADA", charSpacing: 3, margin: 0,
  });
  return s;
}

export function dividerSlide(pres, { label, titleText, sub, page, deckName }) {
  const s = pres.addSlide();
  s.background = { color: C.ink };
  header(s, label, { dark: true, page, deckName });
  s.addText(titleText, {
    x: MX, y: 3.05, w: CW, h: 0.8, fontFace: FONT, fontSize: 30, color: C.paper, margin: 0,
  });
  if (sub) {
    s.addText(sub, {
      x: MX, y: 3.95, w: 9.6, h: 0.9, fontFace: FONT, fontSize: 12.5,
      color: C.darkMuted, margin: 0, lineSpacing: 18,
    });
  }
  return s;
}

export function closeSlide(pres, { takeaways, helpLines, page, deckName }) {
  const s = pres.addSlide();
  s.background = { color: C.ink };
  header(s, "Recap", { dark: true, page, deckName });
  s.addText("What to remember.", {
    x: MX, y: 1.06, w: CW, h: 0.6, fontFace: FONT, fontSize: 24, color: C.paper, margin: 0,
  });
  const items = takeaways.map((t, i) => ({
    text: t,
    options: {
      fontSize: 12.5, color: C.paper, bullet: { code: "2022", indent: 14 },
      paraSpaceAfter: 12, breakLine: true, lineSpacing: 18,
    },
  }));
  s.addText(items, { x: MX + 0.05, y: 1.95, w: 7.3, h: 4.4, fontFace: FONT, margin: 0, valign: "top" });
  // help block
  s.addShape("line", { x: 8.55, y: 2.0, w: 0, h: 3.6, line: { color: C.darkRule, width: 0.75 } });
  s.addText("WHERE TO GET HELP", {
    x: 8.95, y: 2.0, w: 3.7, h: 0.24, fontFace: FONT, fontSize: 8.5,
    color: C.darkMuted, charSpacing: 2.4, margin: 0,
  });
  const help = helpLines.map((t, i) => ({
    text: t,
    options: { fontSize: 10.5, color: C.darkMuted, paraSpaceAfter: 10, breakLine: true, lineSpacing: 15 },
  }));
  s.addText(help, { x: 8.95, y: 2.4, w: 3.75, h: 3.4, fontFace: FONT, margin: 0, valign: "top" });
  s.addText("SATIS", {
    x: 0, y: 6.35, w: W, h: 0.5, align: "center",
    fontFace: FONT, fontSize: 20, color: C.paper, charSpacing: 15, margin: 0,
  });
  s.addText("GROUP", {
    x: 0, y: 6.82, w: W, h: 0.24, align: "center",
    fontFace: FONT, fontSize: 7.5, color: C.darkMuted, charSpacing: 6, margin: 0,
  });
  return s;
}
