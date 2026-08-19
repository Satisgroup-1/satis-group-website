// Captures the extra screenshots the webinar decks need, beyond the ones
// already committed in public/admin-guide/. Mirrors the conventions of
// scripts/capture-guide-screenshots.mjs (viewport, 2x, light theme,
// splash/terms skip).
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
import path from "node:path";

const BASE = "http://localhost:3000";
const OUT = process.env.SHOT_OUT ?? path.join(process.cwd(), "shots");
const EXECUTABLE = "/opt/pw-browsers/chromium";

mkdirSync(OUT, { recursive: true });

async function shootFull(page, file) {
  await page.screenshot({ path: path.join(OUT, file), fullPage: true });
  console.log("✓", file);
}

async function shootViewport(page, file, height = 900) {
  await page.screenshot({
    path: path.join(OUT, file),
    clip: { x: 0, y: 0, width: 1360, height },
  });
  console.log("✓", file);
}

async function shootRegion(page, selector, file, pad = {}) {
  const box = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      x: r.left + window.scrollX,
      y: r.top + window.scrollY,
      width: r.width,
      height: r.height,
      docW: document.documentElement.scrollWidth,
      docH: document.documentElement.scrollHeight,
    };
  }, selector);
  if (!box) throw new Error(`shootRegion: no match for ${selector}`);
  const p = { left: 24, right: 24, top: 24, bottom: 24, ...pad };
  const clip = {
    x: Math.max(0, box.x - p.left),
    y: Math.max(0, box.y - p.top),
    width: Math.min(box.docW, box.x + box.width + p.right) - Math.max(0, box.x - p.left),
    height: Math.min(box.docH, box.y + box.height + p.bottom) - Math.max(0, box.y - p.top),
  };
  await page.screenshot({ path: path.join(OUT, file), clip, fullPage: true });
  console.log("✓", file);
}

async function scrollThrough(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(400);
}

const browser = await chromium.launch({ executablePath: EXECUTABLE });
const context = await browser.newContext({
  viewport: { width: 1360, height: 900 },
  deviceScaleFactor: 2,
  colorScheme: "light",
});
await context.addInitScript(() => {
  window.sessionStorage.setItem("satis-splash-seen", "1");
  window.localStorage.setItem("satis-terms-accepted", new Date().toISOString());
});
const page = await context.newPage();

// ---- Public: contact page ----
await page.goto(`${BASE}/contact`, { waitUntil: "networkidle" });
await scrollThrough(page);
await shootFull(page, "contact-full.png");
await shootRegion(page, "form", "contact-form.png", { top: 40, bottom: 40, left: 40, right: 40 });

// ---- Public: homepage top ----
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await shootViewport(page, "home-hero.png");

// ---- Public: portfolio grid ----
await page.goto(`${BASE}/portfolio`, { waitUntil: "networkidle" });
await scrollThrough(page);
await shootViewport(page, "portfolio-top.png", 900);

// ---- Public: a news story page ----
await page.goto(`${BASE}/news/2026-08-property-investors-awards-judge`, { waitUntil: "networkidle" }).catch(() => {});
// fall back to first story linked from /news
if (!(await page.url()).includes("/news/2026")) {
  await page.goto(`${BASE}/news`, { waitUntil: "networkidle" });
  const href = await page.evaluate(() => document.querySelector('a[href^="/news/2"]')?.getAttribute("href"));
  if (href) await page.goto(`${BASE}${href}`, { waitUntil: "networkidle" });
}
await page.waitForTimeout(600);
await shootViewport(page, "news-story.png");

// ---- Investors: login screen ----
await page.goto(`${BASE}/investors`, { waitUntil: "networkidle" });
await page.waitForTimeout(600);
await shootViewport(page, "investor-login.png");

// ---- Admin: sign in, then guide hub + chapter ----
await page.goto(`${BASE}/admin`, { waitUntil: "networkidle" });
await page.fill('input[name="username"]', "test");
await page.fill('input[name="password"]', "test");
await page.click('form button[type="submit"]');
await page.waitForSelector("text=Satis Group control room", { timeout: 20000 });

await page.goto(`${BASE}/admin/guide`, { waitUntil: "networkidle" });
await scrollThrough(page);
await shootFull(page, "guide-hub.png");

await page.goto(`${BASE}/admin/guide/website-content`, { waitUntil: "networkidle" });
await scrollThrough(page);
await shootViewport(page, "guide-claude-chapter.png", 900);

await browser.close();
console.log("done ->", OUT);
