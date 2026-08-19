import { randomBytes } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {
  commitRepoFile,
  fetchRepoFile,
  isGitHubPersistenceEnabled,
  repoFileExists,
} from "@/lib/github-storage";
import { INVESTOR_DATA_DIR } from "@/lib/investor-platform";

// Store for PDFs uploaded through /admin/platform (monthly reports, legal
// papers, accounts). Files live in content/investors/files/ — deliberately
// NOT in public/, because shareholder agreements and accounts must never be
// served from an unauthenticated URL. The portal downloads them through
// /investors/files/<name>, which checks the investor session and the
// caller's right to the specific document before streaming a byte.
//
// Persistence mirrors the JSON datasets: written to disk in development,
// committed to the repository on read-only hosting (Vercel). The download
// route falls back to fetching the repository when a file is not on disk,
// so an upload is servable immediately — before the redeploy finishes.

export const INVESTOR_FILES_DIR = path.join(INVESTOR_DATA_DIR, "files");

/** Public download path for a stored file name. */
export const INVESTOR_FILES_ROUTE = "/investors/files";

// Vercel caps serverless request bodies at ~4.5MB, so anything past 4MB
// would die at the platform layer with an opaque error. Enforce it here
// with a message the admin can act on.
export const MAX_PDF_BYTES = 4 * 1024 * 1024;

/**
 * Strict allow-list for stored names: no separators, no traversal, always
 * a .pdf suffix. Used both when storing and when serving, so a crafted
 * download URL can never reach outside the files directory.
 */
export function isSafeFileName(name: string): boolean {
  return /^[a-z0-9][a-z0-9-]{0,80}\.pdf$/.test(name);
}

function slugifyBaseName(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\.pdf$/i, "")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64)
    .replace(/-+$/g, "");
}

function repoFilePath(name: string): string {
  return `content/investors/files/${name}`;
}

async function fileNameTaken(name: string): Promise<boolean> {
  if (fs.existsSync(path.join(INVESTOR_FILES_DIR, name))) return true;
  if (isGitHubPersistenceEnabled()) {
    return repoFileExists(repoFilePath(name));
  }
  return false;
}

/**
 * Validate and store one uploaded PDF; returns the portal download path to
 * put in the record's `file` field. Throws a friendly error for anything
 * that is not a PDF, is too large, or cannot be persisted.
 */
export async function storeInvestorPdf(upload: File): Promise<string> {
  if (!upload || upload.size === 0) {
    throw new Error("Choose a PDF file to upload.");
  }
  if (upload.size > MAX_PDF_BYTES) {
    throw new Error(
      "The PDF is too large — files are capped at 4MB. Compress it (e.g. export at a lower image quality) and try again."
    );
  }
  const content = Buffer.from(await upload.arrayBuffer());
  // Trust the bytes, not the extension or the browser's MIME type.
  if (content.subarray(0, 5).toString("latin1") !== "%PDF-") {
    throw new Error("Only PDF files can be uploaded here.");
  }

  const base = slugifyBaseName(upload.name) || "document";
  let name = `${base}.pdf`;
  if (await fileNameTaken(name)) {
    name = `${base}-${randomBytes(3).toString("hex")}.pdf`;
  }
  if (!isSafeFileName(name)) {
    throw new Error("The file name could not be derived — rename the PDF and try again.");
  }

  if (isGitHubPersistenceEnabled()) {
    await commitRepoFile(
      repoFilePath(name),
      content,
      `Upload ${name} via the admin platform`
    );
  } else {
    try {
      fs.mkdirSync(INVESTOR_FILES_DIR, { recursive: true });
      fs.writeFileSync(path.join(INVESTOR_FILES_DIR, name), content);
    } catch {
      throw new Error(
        "This deployment has read-only storage, so files cannot be saved here. Set SATIS_GITHUB_TOKEN in the hosting environment so uploads commit to the repository (see the operations guide)."
      );
    }
  }
  return `${INVESTOR_FILES_ROUTE}/${name}`;
}

/**
 * The stored bytes for one file name, or null when it doesn't exist. Disk
 * first (development, and deployments where the files were bundled), then
 * the repository (an upload newer than the running deployment).
 */
export async function readInvestorPdf(name: string): Promise<Buffer | null> {
  if (!isSafeFileName(name)) return null;
  try {
    return fs.readFileSync(path.join(INVESTOR_FILES_DIR, name));
  } catch {
    // Not on disk — fall through to the repository.
  }
  if (isGitHubPersistenceEnabled()) {
    try {
      const file = await fetchRepoFile(repoFilePath(name));
      return file?.content ?? null;
    } catch {
      return null;
    }
  }
  return null;
}
