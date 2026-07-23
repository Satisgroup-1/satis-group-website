import fs from "fs";
import path from "path";

// File-based newsletter content.
//
// To publish a new issue, drop a markdown file into content/newsletters/
// named like `2026-07-my-title.md` with this shape:
//
//   ---
//   title: The issue title
//   date: 2026-07-17
//   summary: One-line summary shown in the archive list.
//   ---
//
//   Plain paragraphs of text.
//
//   ## A section heading
//
//   - Bullet points
//   - work too
//
// The site picks it up automatically on the next build/dev reload.

export type NewsletterBlock =
  | { kind: "heading"; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[] };

export type Newsletter = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  blocks: NewsletterBlock[];
};

const CONTENT_DIR = path.join(process.cwd(), "content", "newsletters");

function parseFrontmatter(raw: string): {
  meta: Record<string, string>;
  body: string;
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx > 0) {
      meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
    }
  }
  return { meta, body: match[2] };
}

function parseBlocks(body: string): NewsletterBlock[] {
  const blocks: NewsletterBlock[] = [];
  const chunks = body.split(/\r?\n\r?\n+/);
  for (const chunk of chunks) {
    const trimmed = chunk.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("## ")) {
      blocks.push({ kind: "heading", text: trimmed.slice(3).trim() });
      continue;
    }
    const lines = trimmed.split(/\r?\n/).map((line) => line.trim());
    if (lines.every((line) => line.startsWith("- "))) {
      blocks.push({
        kind: "list",
        items: lines.map((line) => line.slice(2).trim()),
      });
      continue;
    }
    blocks.push({ kind: "paragraph", text: lines.join(" ") });
  }
  return blocks;
}

export function getNewsletters(): Newsletter[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
      const { meta, body } = parseFrontmatter(raw);
      return {
        slug: file.replace(/\.md$/, ""),
        title: meta.title ?? file.replace(/\.md$/, ""),
        date: meta.date ?? "",
        summary: meta.summary ?? "",
        blocks: parseBlocks(body),
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getNewsletter(slug: string): Newsletter | undefined {
  return getNewsletters().find((issue) => issue.slug === slug);
}

export function formatNewsletterDate(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
