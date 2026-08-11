"use server";

import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  INVESTOR_COOKIE,
  INVESTOR_SESSION_TTL_MS,
  investorSessionToken,
  verifyPassword,
} from "@/lib/investor-auth";
import { findInvestorByEmail } from "@/lib/investor-platform";

export type InvestorLoginState = { error?: string };

// Same best-effort per-IP throttle as the admin login: 5 failures per
// 15 minutes, per serverless instance.
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 5;
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

export async function investorLogin(
  _prev: InvestorLoginState,
  formData: FormData
): Promise<InvestorLoginState> {
  const ip =
    (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  const now = Date.now();
  const attempts = loginAttempts.get(ip);
  if (
    attempts &&
    attempts.resetAt > now &&
    attempts.count >= LOGIN_MAX_ATTEMPTS
  ) {
    return { error: "Too many attempts. Please try again later." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const investor = email ? findInvestorByEmail(email) : undefined;
  // Verify against a real hash even for unknown emails so response timing
  // doesn't reveal which addresses hold accounts.
  const DUMMY_HASH =
    "scrypt:00000000000000000000000000000000:" + "0".repeat(128);
  const ok = investor
    ? verifyPassword(password, investor.passwordHash)
    : (verifyPassword(password, DUMMY_HASH), false);
  if (!ok || !investor) {
    const entry =
      attempts && attempts.resetAt > now
        ? { count: attempts.count + 1, resetAt: attempts.resetAt }
        : { count: 1, resetAt: now + LOGIN_WINDOW_MS };
    loginAttempts.set(ip, entry);
    console.warn(`investor login failed (ip=${ip}, attempt=${entry.count})`);
    return { error: "The email or password you entered is incorrect." };
  }
  loginAttempts.delete(ip);

  const proto = (await headers()).get("x-forwarded-proto");
  (await cookies()).set(INVESTOR_COOKIE, investorSessionToken(investor.id), {
    httpOnly: true,
    secure: proto === "https",
    sameSite: "lax",
    path: "/",
    maxAge: INVESTOR_SESSION_TTL_MS / 1000,
  });
  revalidatePath("/investors");
  return {};
}

export async function investorLogout(): Promise<void> {
  (await cookies()).delete(INVESTOR_COOKIE);
  revalidatePath("/investors");
}
