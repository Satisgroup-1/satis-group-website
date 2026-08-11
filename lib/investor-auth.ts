import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { cookies } from "next/headers";

// Session + password layer for the investor platform. Unlike the admin gate
// (fixed test/test credentials), investor accounts live in
// content/investors/investors.json with per-account scrypt password hashes,
// so real credentials can be imported without touching code. Sessions use
// the same expiring HMAC-signed cookie pattern as lib/admin-auth.ts.

export const INVESTOR_COOKIE = "satis-investor";
export const INVESTOR_SESSION_TTL_MS = 24 * 60 * 60 * 1000;

// Baked-in fallback so the demo works with zero configuration; set
// SATIS_INVESTOR_SECRET (or SATIS_ADMIN_SECRET) in the hosting environment
// the day real investor accounts are imported — the env value always wins.
const FALLBACK_SECRET = "satis-investor-demo-8f31c7a94d2e46b5a0c8d1f6e97b2340";

function getSecret(): string {
  return (
    process.env.SATIS_INVESTOR_SECRET ??
    process.env.SATIS_ADMIN_SECRET ??
    FALLBACK_SECRET
  );
}

// ---------------------------------------------------------------------------
// Passwords: stored as "scrypt:<salt hex>:<hash hex>"

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split(":");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const [, salt, expectedHex] = parts;
  try {
    const expected = Buffer.from(expectedHex, "hex");
    const actual = scryptSync(password, salt, expected.length);
    return (
      expected.length > 0 &&
      actual.length === expected.length &&
      timingSafeEqual(actual, expected)
    );
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Sessions: "<investorId>.<expiresAtMs>.<hmac>" cookie

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function investorSessionToken(
  investorId: string,
  expiresAtMs: number = Date.now() + INVESTOR_SESSION_TTL_MS
): string {
  const payload = `${investorId}.${expiresAtMs}`;
  return `${payload}.${sign(payload)}`;
}

/** Returns the signed-in investor's id, or null when not authenticated. */
export async function getSessionInvestorId(): Promise<string | null> {
  const cookie = (await cookies()).get(INVESTOR_COOKIE);
  if (!cookie?.value) return null;
  const parts = cookie.value.split(".");
  if (parts.length !== 3) return null;
  const [investorId, expiresAt, mac] = parts;
  const expected = Buffer.from(sign(`${investorId}.${expiresAt}`));
  const received = Buffer.from(mac);
  if (
    expected.length !== received.length ||
    !timingSafeEqual(expected, received)
  ) {
    return null;
  }
  const expiry = Number(expiresAt);
  if (!Number.isFinite(expiry) || Date.now() >= expiry) return null;
  return investorId;
}
