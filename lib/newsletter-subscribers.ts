import fs from "node:fs";
import path from "node:path";
import {
  RepoConflictError,
  commitRepoJson,
  fetchRepoJson,
  isGitHubPersistenceEnabled,
} from "@/lib/github-storage";
import bundledSubscribers from "@/content/newsletter/subscribers.json";

// The newsletter signup list. Addresses collected by the public signup form
// are appended here, so the list is versioned with the repository and needs
// no database — the same arrangement as the investor datasets in
// lib/investor-platform.ts, including the GitHub-backed write path that
// works around read-only serverless filesystems. The static import keeps the
// file inside the serverless bundle: Vercel only traces files reachable
// through the module graph.

export type SubscriberStatus = "subscribed" | "unsubscribed";

export type NewsletterSubscriber = {
  email: string;
  /** Optional — the public form asks for an address only. */
  name?: string;
  /** Where the signup came from, e.g. "News page" or "Added by admin". */
  source: string;
  /** ISO timestamp of the original signup. */
  subscribedAt: string;
  status: SubscriberStatus;
  /** ISO timestamp of the most recent unsubscribe, when there is one. */
  unsubscribedAt?: string;
};

const DATA_DIR = path.join(process.cwd(), "content", "newsletter");
const DATA_FILE = path.join(DATA_DIR, "subscribers.json");
const REPO_PATH = "content/newsletter/subscribers.json";
const COMMIT_MESSAGE = "Update newsletter subscribers";

export function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isSubscriber(value: unknown): value is NewsletterSubscriber {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as NewsletterSubscriber).email === "string"
  );
}

/** Fill in fields older records may predate, so callers can trust the shape. */
function normaliseRecord(record: NewsletterSubscriber): NewsletterSubscriber {
  return {
    ...record,
    email: normaliseEmail(record.email),
    source: record.source || "Unknown",
    subscribedAt: record.subscribedAt || "",
    status: record.status === "unsubscribed" ? "unsubscribed" : "subscribed",
  };
}

function readFromDisk(): NewsletterSubscriber[] {
  try {
    const parsed: unknown = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    return Array.isArray(parsed) ? parsed.filter(isSubscriber) : [];
  } catch {
    return Array.isArray(bundledSubscribers)
      ? (structuredClone(bundledSubscribers) as unknown[]).filter(isSubscriber)
      : [];
  }
}

function writeToDisk(records: NewsletterSubscriber[]): void {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(
      DATA_FILE,
      `${JSON.stringify(records, null, 2)}\n`,
      "utf8"
    );
  } catch {
    throw new Error(
      "This deployment has read-only storage, so the signup list cannot be saved here. Set SATIS_GITHUB_TOKEN in the hosting environment so changes are committed to the repository (see the operations guide)."
    );
  }
}

/** Newest signup first. */
function sortSubscribers(
  records: NewsletterSubscriber[]
): NewsletterSubscriber[] {
  return [...records].sort(
    (a, b) =>
      b.subscribedAt.localeCompare(a.subscribedAt) ||
      a.email.localeCompare(b.email)
  );
}

export function getSubscribers(): NewsletterSubscriber[] {
  return sortSubscribers(readFromDisk().map(normaliseRecord));
}

// Two people signing up seconds apart both commit against the same file
// revision, and the second is rejected. Nobody is at a keyboard to retry a
// public signup, so re-read and re-apply instead of losing the address.
const MAX_COMMIT_ATTEMPTS = 3;

/**
 * Apply a change to the list and persist it: committed to the repository
 * when GitHub persistence is configured, written to disk otherwise. Reading
 * the repository back (rather than the deployed files, which lag until the
 * next deployment) keeps signups seconds apart from overwriting each other.
 */
async function mutateSubscribers(
  mutate: (records: NewsletterSubscriber[]) => NewsletterSubscriber[]
): Promise<NewsletterSubscriber[]> {
  if (isGitHubPersistenceEnabled()) {
    for (let attempt = 1; ; attempt += 1) {
      const current = await fetchRepoJson(REPO_PATH);
      const existing = current
        ? current.records.filter(isSubscriber).map(normaliseRecord)
        : getSubscribers();
      const records = mutate(existing);
      try {
        await commitRepoJson(REPO_PATH, records, current?.sha, COMMIT_MESSAGE);
        return records;
      } catch (err) {
        if (
          !(err instanceof RepoConflictError) ||
          attempt >= MAX_COMMIT_ATTEMPTS
        ) {
          throw err;
        }
      }
    }
  }
  const records = mutate(getSubscribers());
  writeToDisk(records);
  return records;
}

export type AddSubscriberResult = "added" | "resubscribed" | "already-listed";

/**
 * Add an address to the list, or bring a previously unsubscribed one back.
 * Idempotent: signing up twice is a no-op rather than a duplicate row.
 */
export async function addSubscriber(input: {
  email: string;
  name?: string;
  source: string;
  now?: Date;
}): Promise<AddSubscriberResult> {
  const email = normaliseEmail(input.email);
  const name = input.name?.trim();
  const timestamp = (input.now ?? new Date()).toISOString();
  let result: AddSubscriberResult = "added";

  await mutateSubscribers((records) => {
    const existing = records.find((record) => record.email === email);
    if (!existing) {
      return [
        ...records,
        {
          email,
          ...(name ? { name } : {}),
          source: input.source,
          subscribedAt: timestamp,
          status: "subscribed" as const,
        },
      ];
    }
    result =
      existing.status === "unsubscribed" ? "resubscribed" : "already-listed";
    return records.map((record) =>
      record.email === email
        ? {
            ...record,
            // A name given later fills a gap, but never overwrites one.
            ...(name && !record.name ? { name } : {}),
            status: "subscribed" as const,
            subscribedAt:
              existing.status === "unsubscribed"
                ? timestamp
                : record.subscribedAt,
            unsubscribedAt: undefined,
          }
        : record
    );
  });

  return result;
}

/** Mark an address unsubscribed, keeping the record for the audit trail. */
export async function setSubscriberStatus(
  email: string,
  status: SubscriberStatus
): Promise<void> {
  const target = normaliseEmail(email);
  const timestamp = new Date().toISOString();
  await mutateSubscribers((records) =>
    records.map((record) =>
      record.email === target
        ? {
            ...record,
            status,
            ...(status === "unsubscribed"
              ? { unsubscribedAt: timestamp }
              : { unsubscribedAt: undefined }),
          }
        : record
    )
  );
}

/** Delete an address outright — used when someone asks to be erased. */
export async function removeSubscriber(email: string): Promise<void> {
  const target = normaliseEmail(email);
  await mutateSubscribers((records) =>
    records.filter((record) => record.email !== target)
  );
}

export function countSubscribers(records: NewsletterSubscriber[]): {
  subscribed: number;
  unsubscribed: number;
} {
  return {
    subscribed: records.filter((r) => r.status === "subscribed").length,
    unsubscribed: records.filter((r) => r.status === "unsubscribed").length,
  };
}

export function formatSubscribedAt(timestamp: string): string {
  const parsed = new Date(timestamp);
  if (!timestamp || Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
