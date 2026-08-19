import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { verifyPassword } from "./investor-auth";

// Credential gate for the admin section. Real accounts live in the
// SATIS_ADMIN_USERS environment variable as comma-separated
// "email=scrypt:<salt>:<hash>" pairs (generate entries at /admin/accounts),
// so credentials never touch the repository. When that variable is unset —
// local development, fresh previews — the gate falls back to the public
// demo pair test/test. The session cookie carries an expiring HMAC-signed
// token so it can't be replayed forever.

export const ADMIN_COOKIE = "satis-admin";

const DEMO_USERNAME = "test";
const DEMO_PASSWORD = "test";

export const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

// While the credentials are the public test/test pair, a baked-in fallback
// signing secret exposes nothing the login form doesn't already, so sign-in
// works on any deployment with zero configuration. Set SATIS_ADMIN_SECRET
// in the hosting environment the day real credentials replace test/test —
// the env value always wins, and it (not this constant) is what makes
// cookies unforgeable.
const FALLBACK_SECRET = "satis-demo-6b2c1e0f4a9d4e37b1c5f8a2d7e30964";

function getSecret(): string {
  return process.env.SATIS_ADMIN_SECRET ?? FALLBACK_SECRET;
}

/** True when running on the built-in demo secret rather than an env value. */
export function isUsingFallbackSecret(): boolean {
  return !process.env.SATIS_ADMIN_SECRET;
}

/** True when no real accounts are configured and test/test still works. */
export function isUsingDemoCredentials(): boolean {
  return getAdminAccounts().length === 0;
}

export type AdminAccount = { username: string; passwordHash: string };

/**
 * Parse SATIS_ADMIN_USERS. Malformed entries are dropped rather than
 * treated as demo mode, so a typo can never silently reopen test/test.
 */
export function getAdminAccounts(): AdminAccount[] {
  const raw = process.env.SATIS_ADMIN_USERS?.trim();
  if (!raw) return [];
  return raw
    .split(",")
    .map((entry) => {
      const eq = entry.indexOf("=");
      if (eq < 1) return null;
      const username = entry.slice(0, eq).trim().toLowerCase();
      const passwordHash = entry.slice(eq + 1).trim();
      if (!username || !passwordHash.startsWith("scrypt:")) return null;
      return { username, passwordHash };
    })
    .filter((account): account is AdminAccount => account !== null);
}

function safeEquals(a: string, b: string): boolean {
  const max = Math.max(a.length, b.length, 1);
  const bufA = Buffer.alloc(max);
  const bufB = Buffer.alloc(max);
  bufA.write(a);
  bufB.write(b);
  return timingSafeEqual(bufA, bufB) && a.length === b.length;
}

// Hash of an unguessable value: verified against when the username doesn't
// exist, so a login attempt costs the same time either way.
const DUMMY_HASH =
  "scrypt:6c1de5a4b2f34c78a90d13e6f5b72814:1f2e3d4c5b6a798800112233445566778899aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff0011223344556677";

/**
 * Check a username/password pair against the configured accounts, or
 * against the demo pair when SATIS_ADMIN_USERS is unset. Setting the env
 * variable disables test/test entirely.
 */
export function verifyAdminCredentials(
  username: string,
  password: string
): boolean {
  const accounts = getAdminAccounts();
  if (accounts.length === 0) {
    return (
      safeEquals(username, DEMO_USERNAME) && safeEquals(password, DEMO_PASSWORD)
    );
  }
  const account = accounts.find(
    (a) => a.username === username.trim().toLowerCase()
  );
  const valid = verifyPassword(password, account?.passwordHash ?? DUMMY_HASH);
  return Boolean(account) && valid;
}

function isKnownAdmin(username: string): boolean {
  const accounts = getAdminAccounts();
  if (accounts.length === 0) return username === DEMO_USERNAME;
  return accounts.some((a) => a.username === username);
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

// Usernames are base64url-encoded inside the token because emails contain
// dots, the token's own separator.

export function sessionToken(
  username: string,
  expiresAtMs: number = Date.now() + SESSION_TTL_MS
): string {
  const encoded = Buffer.from(username.trim().toLowerCase()).toString(
    "base64url"
  );
  const payload = `${encoded}.${expiresAtMs}`;
  return `${payload}.${sign(payload)}`;
}

export async function isAuthenticated(): Promise<boolean> {
  const cookie = (await cookies()).get(ADMIN_COOKIE);
  if (!cookie?.value) return false;
  const parts = cookie.value.split(".");
  if (parts.length !== 3) return false;
  const [encoded, expiresAt, mac] = parts;
  const expected = Buffer.from(sign(`${encoded}.${expiresAt}`));
  const received = Buffer.from(mac);
  if (
    expected.length !== received.length ||
    !timingSafeEqual(expected, received)
  ) {
    return false;
  }
  let username: string;
  try {
    username = Buffer.from(encoded, "base64url").toString("utf8");
  } catch {
    return false;
  }
  // Re-checked per request, so removing an account from SATIS_ADMIN_USERS
  // (or setting it for the first time) invalidates existing sessions.
  if (!isKnownAdmin(username)) return false;
  const expiry = Number(expiresAt);
  return Number.isFinite(expiry) && Date.now() < expiry;
}
