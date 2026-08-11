import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// Demo-grade credential gate for the newsletter admin. The username and
// password are deliberately hardcoded to test/test per the brief — do NOT
// treat this as production security. The session cookie carries an
// expiring HMAC-signed token so it can't be replayed forever.

export const ADMIN_COOKIE = "satis-admin";
export const ADMIN_USERNAME = "test";
export const ADMIN_PASSWORD = "test";

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
  const expected = Buffer.from(sign(`${username}.${expiresAt}`));
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
