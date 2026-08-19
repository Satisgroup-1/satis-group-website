// Prepares every image the webinar decks embed: crops the site footer off
// full-page screenshots, cuts targeted regions, resizes, and records final
// pixel dimensions in dims.json so the deck builder can compute exact
// placements (and draw hairline frames that match).
import sharp from "sharp";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const GUIDE = path.join(REPO, "public/admin-guide");
const PHOTOS = path.join(REPO, "public/images");
const SHOTS = process.env.SHOTS_DIR ??
  path.join(path.dirname(new URL(import.meta.url).pathname), "shots");
const OUT = path.join(path.dirname(new URL(import.meta.url).pathname), "assets");
mkdirSync(OUT, { recursive: true });

// Find where the solid-dark site footer begins, scanning row luminance from
// the bottom. Returns the crop height (full height when no footer found).
async function footerCropHeight(file) {
  const img = sharp(file);
  const { width, height } = await img.metadata();
  const scale = 200 / width;
  const h = Math.max(1, Math.round(height * scale));
  const buf = await img.clone().resize(200, h, { fit: "fill" }).grayscale().raw().toBuffer();
  const rowMean = (y) => {
    let s = 0;
    for (let x = 0; x < 200; x++) s += buf[y * 200 + x];
    return s / 200;
  };
  let y = h - 1;
  if (rowMean(y) > 60) return height; // no dark footer at the very bottom
  while (y > 0 && rowMean(y) <= 60) y--;
  const cropSmall = y + 1;
  const crop = Math.floor((cropSmall / h) * height) - 6;
  // Sanity: never cut more than half the page.
  return crop > height * 0.4 ? crop : height;
}

async function emit(name, pipeline) {
  const outPath = path.join(OUT, name);
  const info = await pipeline.toFile(outPath);
  dims[name] = { w: info.width, h: info.height };
  console.log("✓", name, `${info.width}x${info.height}`);
}

const dims = {};
const MAXW = 1700;

async function screenshot(src, name, { crop, trimFooter } = {}) {
  if (!existsSync(src)) {
    console.warn("✗ missing", src);
    return;
  }
  let img = sharp(src);
  const meta = await img.metadata();
  let region = null;
  if (trimFooter) {
    const ch = await footerCropHeight(src);
    if (ch < meta.height) region = { left: 0, top: 0, width: meta.width, height: ch };
  }
  if (crop) {
    const top = Math.max(0, crop.top ?? 0);
    region = {
      left: Math.max(0, crop.left ?? 0),
      top,
      width: Math.min(meta.width - (crop.left ?? 0), crop.width ?? meta.width),
      height: Math.min(meta.height - top, crop.height),
    };
  }
  if (region) img = img.extract(region);
  const w = region?.width ?? meta.width;
  if (w > MAXW) img = img.resize(MAXW);
  await emit(name, img.png({ compressionLevel: 9, palette: false }));
}

async function photo(src, name) {
  if (!existsSync(src)) {
    console.warn("✗ missing", src);
    return;
  }
  await emit(name, sharp(src).resize(2000, 1125, { fit: "cover" }).jpeg({ quality: 82 }));
}

// ---- Committed guide screenshots ----
await screenshot(path.join(GUIDE, "home.png"), "admin-home.png", { trimFooter: true });
await screenshot(path.join(GUIDE, "newsletter.png"), "newsletter-studio.png", { trimFooter: true });
await screenshot(path.join(GUIDE, "signin.png"), "signin.png");
await screenshot(path.join(GUIDE, "accounts-form.png"), "accounts-form.png");
await screenshot(path.join(GUIDE, "platform-tabs.png"), "platform-tabs.png");
await screenshot(path.join(GUIDE, "investor-form.png"), "investor-form.png");
await screenshot(path.join(GUIDE, "valuation-form.png"), "valuation-form.png");
await screenshot(path.join(GUIDE, "captable-form.png"), "captable-form.png");
await screenshot(path.join(GUIDE, "cash-event-form.png"), "cash-event-form.png");
await screenshot(path.join(GUIDE, "report-form.png"), "report-form.png");
await screenshot(path.join(GUIDE, "insight-form.png"), "insight-form.png");
await screenshot(path.join(GUIDE, "opportunity-form.png"), "opportunity-form.png");
await screenshot(path.join(GUIDE, "development-form.png"), "development-form.png");
await screenshot(path.join(GUIDE, "investor-portal.png"), "investor-portal.png");
await screenshot(path.join(GUIDE, "data-tab.png"), "data-tab.png", { trimFooter: true });
await screenshot(path.join(GUIDE, "investors-tab.png"), "investors-tab.png", { trimFooter: true });
await screenshot(path.join(GUIDE, "developments-tab.png"), "developments-tab.png", { trimFooter: true });
await screenshot(path.join(GUIDE, "news-public.png"), "news-public.png", { trimFooter: true });
// Appraisal page: two useful regions of the tall page.
await screenshot(path.join(GUIDE, "appraisal.png"), "appraisal-top.png", {
  crop: { top: 300, height: 1150 },
});
await screenshot(path.join(GUIDE, "appraisal.png"), "appraisal-install.png", {
  crop: { top: 1450, height: 900 },
});

// ---- Fresh captures ----
await screenshot(path.join(SHOTS, "contact-full.png"), "contact-full.png", { trimFooter: true });
await screenshot(path.join(SHOTS, "contact-form.png"), "contact-form.png");
await screenshot(path.join(SHOTS, "investor-login.png"), "investor-login.png");
await screenshot(path.join(SHOTS, "guide-hub.png"), "guide-hub.png", { trimFooter: true });
await screenshot(path.join(SHOTS, "guide-claude-chapter.png"), "guide-claude-chapter.png");
await screenshot(path.join(SHOTS, "news-story.png"), "news-story.png");
await screenshot(path.join(SHOTS, "home-hero.png"), "home-hero.png");
await screenshot(path.join(SHOTS, "portfolio-top.png"), "portfolio-top.png");
await screenshot(path.join(SHOTS, "investor-enquire.png"), "investor-enquire.png");
// Guide hub is very tall — keep the heading + first chapter groups.
await screenshot(path.join(SHOTS, "guide-hub.png"), "guide-hub-top.png", {
  crop: { top: 260, height: 2400 },
});

// ---- Cover photography (16:9 crops for full-bleed covers) ----
await photo(path.join(PHOTOS, "courthouse/hero-v2.jpg"), "cover-claude.jpg");
await photo(path.join(PHOTOS, "meyer/hero-v2.jpg"), "cover-news.jpg");
await photo(path.join(PHOTOS, "barrington/exterior-dusk.jpg"), "cover-accounts.jpg");
await photo(path.join(PHOTOS, "qube/hero.jpg"), "cover-investors.jpg");
await photo(path.join(PHOTOS, "woodfield/hero.jpg"), "cover-appraisal.jpg");
await photo(path.join(PHOTOS, "stjohnscorner/hero.jpg"), "cover-systems.jpg");
await photo(path.join(PHOTOS, "springfield/hero.jpg"), "cover-email.jpg");

// Footer logo (white wordmark PNG from the repo, used on dark closing slides)
await emit("logo-white.png", sharp(path.join(REPO, "public/images/satis-logo-white.png")));
await emit("logo-dark.png", sharp(path.join(REPO, "public/images/satis-logo-dark.png")));

writeFileSync(path.join(OUT, "dims.json"), JSON.stringify(dims, null, 2));
console.log("dims.json written with", Object.keys(dims).length, "entries");
