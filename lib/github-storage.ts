// GitHub-backed persistence for the investor datasets. Serverless hosting
// (Vercel) has a read-only filesystem, so the /admin/platform forms can't
// write content/investors/*.json in place. When SATIS_GITHUB_TOKEN is set,
// mutations commit the JSON to the repository through the GitHub contents
// API instead — git stays the single source of truth, and the commit
// triggers the deployment that publishes the change. Without the token,
// nothing here runs and datasets are written to disk as in development.

const REPO = process.env.SATIS_GITHUB_REPO ?? "Satisgroup-1/satis-group-website";
const BRANCH = process.env.SATIS_GITHUB_BRANCH ?? "main";
// Override honoured for tests and GitHub Enterprise, mirroring the gh CLI.
const API = process.env.GITHUB_API_URL ?? "https://api.github.com";

export function isGitHubPersistenceEnabled(): boolean {
  return Boolean(process.env.SATIS_GITHUB_TOKEN);
}

function contentsUrl(path: string): string {
  return `${API}/repos/${REPO}/contents/${encodeURIComponent(path).replace(
    /%2F/g,
    "/"
  )}`;
}

async function githubRequest(
  url: string,
  init?: RequestInit
): Promise<Response> {
  return fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.SATIS_GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "satis-group-website-admin",
      ...init?.headers,
    },
    // The repo is the database here — never serve a cached read.
    cache: "no-store",
  });
}

export type GitHubFile = { records: unknown[]; sha: string };

/**
 * Raised when a commit is rejected because the file moved on underneath it.
 * A distinct type so callers appending to a list (the newsletter signup
 * list) can re-read and retry, while the admin forms keep surfacing the
 * message to the operator.
 */
export class RepoConflictError extends Error {}

/** Current committed contents of a repo file, or null when it doesn't exist. */
export async function fetchRepoJson(path: string): Promise<GitHubFile | null> {
  const response = await githubRequest(
    `${contentsUrl(path)}?ref=${encodeURIComponent(BRANCH)}`
  );
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(
      response.status === 401 || response.status === 403
        ? "The repository token was rejected — check SATIS_GITHUB_TOKEN in the hosting environment."
        : `The repository could not be read (GitHub responded ${response.status}).`
    );
  }
  const file = (await response.json()) as { content?: string; sha: string };
  let records: unknown;
  try {
    records = JSON.parse(
      Buffer.from(file.content ?? "", "base64").toString("utf8")
    );
  } catch {
    throw new Error(`${path} in the repository is not valid JSON.`);
  }
  return { records: Array.isArray(records) ? records : [], sha: file.sha };
}

/**
 * Current committed contents of a binary repo file (an uploaded PDF, say),
 * or null when it doesn't exist. Files up to ~1MB come back inline from the
 * contents API; larger ones only return a download_url, so follow it.
 */
export async function fetchRepoFile(
  path: string
): Promise<{ content: Buffer; sha: string } | null> {
  const response = await githubRequest(
    `${contentsUrl(path)}?ref=${encodeURIComponent(BRANCH)}`
  );
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(
      `The file could not be read (GitHub responded ${response.status}).`
    );
  }
  const file = (await response.json()) as {
    content?: string;
    sha: string;
    download_url?: string;
  };
  if (file.content) {
    return { content: Buffer.from(file.content, "base64"), sha: file.sha };
  }
  if (file.download_url) {
    const raw = await githubRequest(file.download_url);
    if (!raw.ok) {
      throw new Error(
        `The file could not be downloaded (GitHub responded ${raw.status}).`
      );
    }
    return {
      content: Buffer.from(await raw.arrayBuffer()),
      sha: file.sha,
    };
  }
  return null;
}

/** True when a file already exists at this repo path. */
export async function repoFileExists(path: string): Promise<boolean> {
  const response = await githubRequest(
    `${contentsUrl(path)}?ref=${encodeURIComponent(BRANCH)}`
  );
  if (response.status === 404) return false;
  if (!response.ok) {
    throw new Error(
      `The repository could not be read (GitHub responded ${response.status}).`
    );
  }
  return true;
}

/** Commit a new binary file (an uploaded PDF) to the repository. */
export async function commitRepoFile(
  path: string,
  content: Buffer,
  message: string
): Promise<void> {
  const response = await githubRequest(contentsUrl(path), {
    method: "PUT",
    body: JSON.stringify({
      message,
      content: content.toString("base64"),
      branch: BRANCH,
    }),
  });
  if (response.status === 409 || response.status === 422) {
    throw new Error(
      "A file with this name already exists — rename the PDF and try again."
    );
  }
  if (response.status === 401 || response.status === 403) {
    throw new Error(
      "The repository token was rejected — check SATIS_GITHUB_TOKEN in the hosting environment."
    );
  }
  if (!response.ok) {
    throw new Error(
      `The file could not be committed (GitHub responded ${response.status}).`
    );
  }
}

/** Commit new contents for a repo file; sha must match the current file. */
export async function commitRepoJson(
  path: string,
  records: unknown[],
  sha: string | undefined,
  message: string
): Promise<void> {
  const response = await githubRequest(contentsUrl(path), {
    method: "PUT",
    body: JSON.stringify({
      message,
      content: Buffer.from(
        `${JSON.stringify(records, null, 2)}\n`,
        "utf8"
      ).toString("base64"),
      branch: BRANCH,
      ...(sha ? { sha } : {}),
    }),
  });
  if (response.status === 409 || response.status === 422) {
    throw new RepoConflictError(
      "The data changed while you were editing — reload the page and try again."
    );
  }
  if (response.status === 401 || response.status === 403) {
    throw new Error(
      "The repository token was rejected — check SATIS_GITHUB_TOKEN in the hosting environment."
    );
  }
  if (!response.ok) {
    throw new Error(
      `The change could not be committed (GitHub responded ${response.status}).`
    );
  }
}
