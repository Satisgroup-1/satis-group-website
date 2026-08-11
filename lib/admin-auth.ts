import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// Demo-grade credential gate for the newsletter admin. The username and
// password are deliberately hardcoded to test/test per the brief — do NOT
// treat this as production security. The session cookie carries an
// expiring HMAC-signed token so it can't be forged or replayed forever.

export const ADMIN_COOKIE = "satis-admin";
export const ADMIN_USERNAME = "test";
export const ADMIN_PASSWORD = "test";

export const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

// Dev fallback: random per boot, so cookies are still unforgeable and
// simply expire when the server restarts. In production the secret must be
// provided; the check is lazy (at first use, not import) so `next build`
// doesn't require the env var.
let cachedSecret: string | undefined;

function getSecret(): string {
  if (cachedSecret) return cachedSecret;
  const envSecret = process.env.SATIS_ADMIN_SECRET;
  if (!envSecret && process.env.NODE_ENV === "production") {
    // Refuse to fall back to a guessable value in production: with a known
    // secret anyone can mint the session cookie without logging in.
    throw new Error("SATIS_ADMIN_SECRET must be set in production");
  }
  cachedSecret = envSecret ?? randomBytes(32).toString("hex");
  return cachedSecret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function sessionToken(
  expiresAtMs: number = Date.now() + SESSION_TTL_MS
): string {
  const payload = `${ADMIN_USERNAME}.${expiresAtMs}`;
  return `${payload}.${sign(payload)}`;
}

export async function isAuthenticated(): Promise<boolean> {
  const cookie = (await cookies()).get(ADMIN_COOKIE);
  if (!cookie?.value) return false;
  const parts = cookie.value.split(".");
  if (parts.length !== 3) return false;
  const [username, expiresAt, mac] = parts;
  let expected: Buffer;
  try {
    // If the secret is unavailable no cookie can be valid; treat as signed
    // out rather than erroring the whole page. login() still throws, so the
    // misconfiguration is surfaced where a session would be minted.
    expected = Buffer.from(sign(`${username}.${expiresAt}`));
  } catch {
    return false;
  }
  const received = Buffer.from(mac);
  if (
    expected.length !== received.length ||
    !timingSafeEqual(expected, received)
  ) {
    return false;
  }
  if (username !== ADMIN_USERNAME) return false;
  const expiry = Number(expiresAt);
  return Number.isFinite(expiry) && Date.now() < expiry;
}
