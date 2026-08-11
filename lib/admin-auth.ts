import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// Demo-grade credential gate for the newsletter admin. The username and
// password are deliberately hardcoded to test/test per the brief — do NOT
// treat this as production security. The session cookie carries an HMAC so
// it can't be forged by simply setting an arbitrary value.

export const ADMIN_COOKIE = "satis-admin";
export const ADMIN_USERNAME = "test";
export const ADMIN_PASSWORD = "test";

const SECRET = process.env.SATIS_ADMIN_SECRET ?? "satis-demo-admin-secret";

export function sessionToken(): string {
  return createHmac("sha256", SECRET).update(ADMIN_USERNAME).digest("hex");
}

export async function isAuthenticated(): Promise<boolean> {
  const cookie = (await cookies()).get(ADMIN_COOKIE);
  if (!cookie?.value) return false;
  const expected = Buffer.from(sessionToken());
  const received = Buffer.from(cookie.value);
  return (
    expected.length === received.length && timingSafeEqual(expected, received)
  );
}
