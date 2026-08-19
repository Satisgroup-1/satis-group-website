// Captures the annotated screenshots used by the operations guide
// (/admin/guide). Re-run whenever the admin UI changes so the pictures in
// the guide keep matching the real screens:
//
//   1. npm run dev            (in one terminal)
//   2. node scripts/capture-guide-screenshots.mjs
//
// Requires a Chromium binary; set CHROMIUM_PATH if it is not at the
// default Playwright location used by Claude Code sessions.
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
import path from "node:path";

const BASE = process.env.GUIDE_BASE_URL ?? "http://localhost:3000";
const OUT = path.join(process.cwd(), "public", "admin-guide");
const EXECUTABLE = process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium";
const MARKER = "#b3400c"; // annotation colour — high contrast on the light theme

mkdirSync(OUT, { recursive: true });

/**
 * Injects numbered badge + arrow annotations over the current page.
 * Each marker: { selector, n, side: left|right|top|bottom, gap? }.
 * The badge sits `gap` px away on the chosen side with an arrow pointing
 * at the element, plus a highlight ring around the element itself.
 */
async function annotate(page, markers) {
  await page.evaluate(
    ({ markers, MARKER }) => {
      document.getElementById("__guide-annotations")?.remove();
      const layer = document.createElement("div");
      layer.id = "__guide-annotations";
      Object.assign(layer.style, {
        position: "absolute",
        inset: "0",
        pointerEvents: "none",
        zIndex: "9999",
      });
      document.body.appendChild(layer);

      const svgNS = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(svgNS, "svg");
      Object.assign(svg.style, {
        position: "absolute",
        left: "0",
        top: "0",
        width: document.documentElement.scrollWidth + "px",
        height: document.documentElement.scrollHeight + "px",
        overflow: "visible",
      });
      const defs = document.createElementNS(svgNS, "defs");
      defs.innerHTML = `<marker id="__ga-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${MARKER}"/></marker>`;
      svg.appendChild(defs);
      layer.appendChild(svg);

      for (const m of markers) {
        const el = document.querySelector(m.selector);
        if (!el) {
          console.warn("guide annotation: no match for", m.selector);
          continue;
        }
        const r = el.getBoundingClientRect();
        const x = r.left + window.scrollX;
        const y = r.top + window.scrollY;

        const ring = document.createElement("div");
        Object.assign(ring.style, {
          position: "absolute",
          left: x - 5 + "px",
          top: y - 5 + "px",
          width: r.width + 10 + "px",
          height: r.height + 10 + "px",
          border: `2.5px solid ${MARKER}`,
          borderRadius: "3px",
          boxShadow: "0 0 0 2px rgba(255,255,255,.55)",
        });
        layer.appendChild(ring);

        const gap = m.gap ?? 58;
        const side = m.side ?? "left";
        const cx = x + r.width / 2;
        const cy = y + r.height / 2;
        let bx, by, ax1, ay1, ax2, ay2;
        if (side === "left") {
          bx = x - gap; by = cy;
          ax1 = bx + 17; ay1 = by; ax2 = x - 9; ay2 = cy;
        } else if (side === "right") {
          bx = x + r.width + gap; by = cy;
          ax1 = bx - 17; ay1 = by; ax2 = x + r.width + 9; ay2 = cy;
        } else if (side === "top") {
          bx = m.alignLeft ? x + 16 : cx; by = y - gap;
          ax1 = bx; ay1 = by + 17; ax2 = m.alignLeft ? x + 16 : cx; ay2 = y - 9;
        } else {
          bx = m.alignLeft ? x + 16 : cx; by = y + r.height + gap;
          ax1 = bx; ay1 = by - 17; ax2 = m.alignLeft ? x + 16 : cx; ay2 = y + r.height + 9;
        }

        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", ax1); line.setAttribute("y1", ay1);
        line.setAttribute("x2", ax2); line.setAttribute("y2", ay2);
        line.setAttribute("stroke", MARKER);
        line.setAttribute("stroke-width", "2.5");
        line.setAttribute("marker-end", "url(#__ga-head)");
        svg.appendChild(line);

        const badge = document.createElement("div");
        badge.textContent = String(m.n);
        Object.assign(badge.style, {
          position: "absolute",
          left: bx - 16 + "px",
          top: by - 16 + "px",
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          background: MARKER,
          color: "#fff",
          font: "700 15px/32px 'Work Sans', Arial, sans-serif",
          textAlign: "center",
          boxShadow: "0 1px 4px rgba(0,0,0,.35), 0 0 0 2px rgba(255,255,255,.7)",
        });
        layer.appendChild(badge);
      }
    },
    { markers, MARKER }
  );
}

async function clearAnnotations(page) {
  await page.evaluate(() =>
    document.getElementById("__guide-annotations")?.remove()
  );
}

/** Screenshot a document-relative region around `selector`, padded so
 *  annotation badges on any side stay in frame. */
async function shootRegion(page, selector, file, pad = {}, hide = []) {
  if (hide.length)
    await page.evaluate((sels) => {
      for (const s of sels)
        document.querySelectorAll(s).forEach((el) => (el.style.visibility = "hidden"));
    }, hide);
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
  const p = { left: 96, right: 24, top: 24, bottom: 24, ...pad };
  const clip = {
    x: Math.max(0, box.x - p.left),
    y: Math.max(0, box.y - p.top),
    width: Math.min(box.docW, box.x + box.width + p.right) - Math.max(0, box.x - p.left),
    height: Math.min(box.docH, box.y + box.height + p.bottom) - Math.max(0, box.y - p.top),
  };
  await page.screenshot({ path: path.join(OUT, file), clip, fullPage: true });
  if (hide.length)
    await page.evaluate((sels) => {
      for (const s of sels)
        document.querySelectorAll(s).forEach((el) => (el.style.visibility = ""));
    }, hide);
  console.log("✓", file);
}

async function shootFull(page, file) {
  await page.screenshot({ path: path.join(OUT, file), fullPage: true });
  console.log("✓", file);
}

const browser = await chromium.launch({ executablePath: EXECUTABLE });
const context = await browser.newContext({
  viewport: { width: 1360, height: 900 },
  deviceScaleFactor: 2,
  colorScheme: "light",
});
// Skip the intro splash and the terms gate so overlays never block clicks.
await context.addInitScript(() => {
  window.sessionStorage.setItem("satis-splash-seen", "1");
  window.localStorage.setItem("satis-terms-accepted", new Date().toISOString());
});
const page = await context.newPage();

// ---------- 1. Sign-in screen (logged out) ----------
await page.goto(`${BASE}/admin`, { waitUntil: "networkidle" });
await annotate(page, [
  { selector: 'input[name="username"]', n: 1, side: "left" },
  { selector: 'input[name="password"]', n: 2, side: "left" },
  { selector: 'form button[type="submit"]', n: 3, side: "left" },
]);
await shootRegion(page, "form", "signin.png", { top: 40, bottom: 40, right: 60 });
await clearAnnotations(page);

// ---------- Log in ----------
await page.fill('input[name="username"]', process.env.GUIDE_ADMIN_USER ?? "test");
await page.fill('input[name="password"]', process.env.GUIDE_ADMIN_PASS ?? "test");
await page.click('form button[type="submit"]');
await page.waitForSelector("text=Satis Group control room", { timeout: 20000 });

// ---------- 2. Admin home ----------
const card = (n) => `.grid > a:nth-child(${n})`;
await annotate(page, [
  { selector: card(1), n: 1, side: "left", gap: 50 },
  { selector: card(2), n: 2, side: "right", gap: 50 },
  { selector: card(3), n: 3, side: "left", gap: 50 },
  { selector: card(4), n: 4, side: "right", gap: 50 },
  { selector: card(5), n: 5, side: "left", gap: 50 },
  { selector: 'form button[type="submit"]', n: 6, side: "right", gap: 44 },
]);
await shootFull(page, "home.png");
await clearAnnotations(page);

// ---------- 2b. Admin accounts ----------
await page.goto(`${BASE}/admin/accounts`, { waitUntil: "networkidle" });
await annotate(page, [
  { selector: 'input[name="username"]', n: 1, side: "left", gap: 48 },
  { selector: 'input[name="password"]', n: 2, side: "left", gap: 48 },
  { selector: 'form button[type="submit"]', n: 3, side: "right", gap: 44 },
]);
await shootRegion(page, "form", "accounts-form.png", {
  left: 84, right: 84, top: 260, bottom: 40,
});
await clearAnnotations(page);

// ---------- 3. Newsletter studio ----------
await page.goto(`${BASE}/admin/newsletter`, { waitUntil: "networkidle" });
await annotate(page, [
  { selector: 'input[name="title"]', n: 1, side: "left" },
  { selector: 'input[name="date"]', n: 2, side: "left" },
  { selector: 'input[name="summary"]', n: 3, side: "left" },
  { selector: 'textarea[name="body"]', n: 4, side: "left" },
  { selector: 'form[class*="flex-col"] button[type="submit"]', n: 5, side: "right", gap: 44 },
  { selector: "aside ul", n: 6, side: "top", alignLeft: true, gap: 46 },
]);
await shootFull(page, "newsletter.png");
await clearAnnotations(page);

// ---------- Platform studio ----------
await page.goto(`${BASE}/admin/platform`, { waitUntil: "networkidle" });
const TAB_NAV = 'nav[aria-label="Investor platform data"]';
const tab = (n) => `${TAB_NAV} button:nth-child(${n})`;

// 4. The tab bar itself
await annotate(page, [
  { selector: tab(1), n: 1, side: "bottom", gap: 40 },
  { selector: tab(2), n: 2, side: "bottom", gap: 40 },
  { selector: tab(3), n: 3, side: "bottom", gap: 40 },
  { selector: tab(4), n: 4, side: "bottom", gap: 40 },
  { selector: tab(5), n: 5, side: "bottom", gap: 40 },
  { selector: tab(6), n: 6, side: "bottom", gap: 40 },
  { selector: tab(7), n: 7, side: "bottom", gap: 40 },
]);
await shootRegion(page, TAB_NAV, "platform-tabs.png", {
  left: 24, right: 24, top: 20, bottom: 88,
});
await clearAnnotations(page);

// 5. Investors tab overview + forms
await annotate(page, [
  { selector: "section.border ul", n: 1, side: "right", gap: 44 },
  { selector: 'form:has(input[name="contactName"])', n: 2, side: "left", gap: 46 },
  { selector: 'form:has(input[name="label"])', n: 3, side: "left", gap: 46 },
]);
await shootFull(page, "investors-tab.png");
await clearAnnotations(page);

await annotate(page, [
  { selector: 'form:has(input[name="contactName"]) input[name="name"]', n: 1, side: "left", gap: 48 },
  { selector: 'input[name="contactName"]', n: 2, side: "left", gap: 48 },
  { selector: 'form:has(input[name="contactName"]) input[name="id"]', n: 3, side: "right", gap: 40 },
  { selector: 'form:has(input[name="contactName"]) input[name="email"]', n: 4, side: "left", gap: 48 },
  { selector: 'select[name="tier"]', n: 5, side: "left", gap: 48 },
  { selector: 'form:has(input[name="contactName"]) input[name="password"]', n: 6, side: "left", gap: 48 },
  { selector: 'form:has(input[name="contactName"]) button[type="submit"]', n: 7, side: "right", gap: 40 },
]);
await shootRegion(page, 'form:has(input[name="contactName"])', "investor-form.png", { right: 84 }, ["section.border ul"]);
await clearAnnotations(page);

await annotate(page, [
  { selector: 'form:has(input[name="label"]) select[name="investorId"]', n: 1, side: "left", gap: 48 },
  { selector: 'input[name="label"]', n: 2, side: "left", gap: 48 },
  { selector: 'form:has(input[name="label"]) input[name="value"]', n: 3, side: "right", gap: 40 },
  { selector: 'form:has(input[name="label"]) button[type="submit"]', n: 4, side: "right", gap: 40 },
]);
await shootRegion(page, 'form:has(input[name="label"])', "valuation-form.png", { right: 84 }, ["section.border ul"]);
await clearAnnotations(page);

// 6. Developments & SPVs tab
await page.click(tab(2));
await page.waitForSelector('input[name="gdv"]');
const devForm = 'form:has(input[name="gdv"])';
await annotate(page, [
  { selector: `${devForm} input[name="name"]`, n: 1, side: "left", gap: 48 },
  { selector: `${devForm} input[name="progress"]`, n: 2, side: "left", gap: 48 },
  { selector: `${devForm} input[name="nextReport"]`, n: 3, side: "left", gap: 48 },
  { selector: `${devForm} input[name="equityValue"]`, n: 4, side: "left", gap: 48 },
  { selector: `${devForm} button[type="submit"]`, n: 5, side: "right", gap: 40 },
]);
await shootRegion(page, devForm, "development-form.png", { right: 84 }, ["section.border ul"]);
await clearAnnotations(page);

await annotate(page, [
  { selector: "section.border ul", n: 1, side: "right", gap: 44 },
  { selector: devForm, n: 2, side: "left", gap: 46 },
]);
await shootFull(page, "developments-tab.png");
await clearAnnotations(page);

// 7. Cap tables & returns tab
await page.click(tab(3));
await page.waitForSelector('input[name="sharePercent"]');
const posForm = 'form:has(input[name="sharePercent"])';
const cashForm = 'form:has(select[name="type"])';
await annotate(page, [
  { selector: `${posForm} select[name="developmentId"]`, n: 1, side: "left", gap: 48 },
  { selector: `${posForm} select[name="investorId"]`, n: 2, side: "left", gap: 48 },
  { selector: `${posForm} input[name="holder"]`, n: 3, side: "right", gap: 40 },
  { selector: `${posForm} input[name="committed"]`, n: 4, side: "left", gap: 48 },
  { selector: `${posForm} input[name="sharePercent"]`, n: 5, side: "right", gap: 40 },
  { selector: `${posForm} button[type="submit"]`, n: 6, side: "right", gap: 40 },
]);
await shootRegion(page, posForm, "captable-form.png", { right: 84 }, ["section.border ul"]);
await clearAnnotations(page);

await annotate(page, [
  { selector: `${cashForm} select[name="investorId"]`, n: 1, side: "left", gap: 48 },
  { selector: `${cashForm} select[name="type"]`, n: 2, side: "left", gap: 48 },
  { selector: `${cashForm} select[name="status"]`, n: 3, side: "right", gap: 40 },
  { selector: `${cashForm} input[name="date"]`, n: 4, side: "left", gap: 48 },
  { selector: `${cashForm} input[name="amount"]`, n: 5, side: "right", gap: 40 },
  { selector: `${cashForm} button[type="submit"]`, n: 6, side: "right", gap: 40 },
]);
await shootRegion(page, cashForm, "cash-event-form.png", { right: 84 }, ["section.border ul"]);
await clearAnnotations(page);

// 8. Monthly reports tab
await page.click(tab(4));
await page.waitForSelector('textarea[name="tasks"]');
const repForm = 'form:has(textarea[name="tasks"])';
await annotate(page, [
  { selector: `${repForm} select[name="developmentId"]`, n: 1, side: "left", gap: 48 },
  { selector: `${repForm} input[name="period"]`, n: 2, side: "left", gap: 48 },
  { selector: `${repForm} input[name="file"]`, n: 3, side: "right", gap: 40 },
  { selector: `${repForm} input[name="title"]`, n: 4, side: "left", gap: 48 },
  { selector: `${repForm} textarea[name="body"]`, n: 5, side: "left", gap: 48 },
  { selector: `${repForm} textarea[name="tasks"]`, n: 6, side: "left", gap: 48 },
  { selector: `${repForm} button[type="submit"]`, n: 7, side: "right", gap: 40 },
]);
await shootRegion(page, repForm, "report-form.png", { right: 84 }, ["section.border ul"]);
await clearAnnotations(page);

// 9. Insights tab
await page.click(tab(5));
await page.waitForSelector('select[name="theme"]');
const insForm = 'form:has(select[name="theme"])';
await annotate(page, [
  { selector: `${insForm} input[name="title"]`, n: 1, side: "left", gap: 48 },
  { selector: `${insForm} input[name="category"]`, n: 2, side: "left", gap: 48 },
  { selector: `${insForm} input[name="date"]`, n: 3, side: "right", gap: 40 },
  { selector: `${insForm} textarea[name="summary"]`, n: 4, side: "left", gap: 48 },
  { selector: `${insForm} textarea[name="body"]`, n: 5, side: "left", gap: 48 },
  { selector: `${insForm} button[type="submit"]`, n: 6, side: "right", gap: 40 },
]);
await shootRegion(page, insForm, "insight-form.png", { right: 84 }, ["section.border ul"]);
await clearAnnotations(page);

// 10. Opportunities tab
await page.click(tab(6));
await page.waitForSelector('input[name="targetRaise"]');
const oppForm = 'form:has(input[name="targetRaise"])';
await annotate(page, [
  { selector: `${oppForm} input[name="name"]`, n: 1, side: "left", gap: 48 },
  { selector: `${oppForm} select[name="status"]`, n: 2, side: "left", gap: 48 },
  { selector: `${oppForm} input[name="targetRaise"]`, n: 3, side: "left", gap: 48 },
  { selector: `${oppForm} input[name="raisedToDate"]`, n: 4, side: "right", gap: 40 },
  { selector: `${oppForm} textarea[name="summary"]`, n: 5, side: "left", gap: 48 },
  { selector: `${oppForm} button[type="submit"]`, n: 6, side: "right", gap: 40 },
]);
await shootRegion(page, oppForm, "opportunity-form.png", { right: 84 }, ["section.border ul"]);
await clearAnnotations(page);

// 11. Import / export tab
await page.click(tab(7));
await page.waitForSelector('a[href="/api/investor-data"]');
await annotate(page, [
  { selector: 'a[href="/api/investor-data"]', n: 1, side: "left", gap: 48 },
  { selector: 'input[name="dataset"]', n: 2, side: "left", gap: 48 },
  { selector: 'textarea[name="json"]', n: 3, side: "left", gap: 48 },
  { selector: 'form:has(input[name="dataset"]) button[type="submit"]', n: 4, side: "right", gap: 40 },
]);
await shootFull(page, "data-tab.png");
await clearAnnotations(page);

// ---------- 12. Appraisal download page ----------
await page.goto(`${BASE}/admin/appraisal`, { waitUntil: "networkidle" });
await shootFull(page, "appraisal.png");

// ---------- 13. What visitors see: the public news archive list ----------
await page.goto(`${BASE}/news`, { waitUntil: "networkidle" });
// Scroll through the page so lazy-loaded images are in before the shot.
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 600) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 60));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(500);
await shootRegion(page, 'section:has(a[href^="/news/2"])', "news-public.png", {
  left: 0, right: 0, top: 0, bottom: 0,
});

// ---------- 14. What investors see: the portal after signing in ----------
// Needs a real investor credential (the demo accounts are retired); pass
// GUIDE_INVESTOR_EMAIL / GUIDE_INVESTOR_PASS. Skipped otherwise, keeping
// whatever investor-portal.png is already committed.
const ipage = await context.newPage();
await ipage.goto(`${BASE}/investors`, { waitUntil: "networkidle" });
try {
  if (!process.env.GUIDE_INVESTOR_EMAIL) throw new Error("no investor credential provided");
  await ipage.fill('input[name="email"]', process.env.GUIDE_INVESTOR_EMAIL);
  await ipage.fill('input[name="password"]', process.env.GUIDE_INVESTOR_PASS ?? "");
  await ipage.click('form button[type="submit"]');
  await ipage.waitForLoadState("networkidle");
  await ipage.waitForTimeout(1500);
  await ipage.screenshot({
    path: path.join(OUT, "investor-portal.png"),
    clip: { x: 0, y: 0, width: 1360, height: 900 },
  });
  console.log("✓ investor-portal.png");
} catch (e) {
  console.warn("investor portal screenshot skipped:", e.message);
}

await browser.close();
console.log("All screenshots written to public/admin-guide/");
