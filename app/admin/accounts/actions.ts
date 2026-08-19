"use server";

import { randomInt } from "node:crypto";
import { isAuthenticated, getAdminAccounts } from "@/lib/admin-auth";
import { hashPassword } from "@/lib/investor-auth";

// Admin accounts live in the SATIS_ADMIN_USERS environment variable, not on
// disk — serverless filesystems are read-only and per-instance, so an env
// var (set in Vercel, applied on redeploy) is the only durable store that
// needs no database. This action therefore doesn't persist anything: it
// hashes the password and returns the complete new SATIS_ADMIN_USERS value
// for the operator to paste into the hosting environment.

export type CreateAccountState = {
  error?: string;
  username?: string;
  /** Echoed once so a generated password can be recorded; never stored. */
  password?: string;
  envValue?: string;
  replaced?: boolean;
};

const MIN_PASSWORD_LENGTH = 12;

// Unambiguous characters only (no 0/O/1/l/I), grouped for easy typing.
const ALPHABET = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";

function generatePassword(): string {
  return Array.from({ length: 4 }, () =>
    Array.from(
      { length: 5 },
      () => ALPHABET[randomInt(ALPHABET.length)]
    ).join("")
  ).join("-");
}

export async function createAdminAccountEntry(
  _prev: CreateAccountState,
  formData: FormData
): Promise<CreateAccountState> {
  if (!(await isAuthenticated())) {
    return { error: "Your session has expired. Please sign in again." };
  }

  const username = String(formData.get("username") ?? "")
    .trim()
    .toLowerCase();
  let password = String(formData.get("password") ?? "");

  if (!/^[^\s=,]+@[^\s=,]+\.[^\s=,]+$/.test(username)) {
    return { error: "The username must be an email address." };
  }
  if (!password) {
    password = generatePassword();
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      error: `Passwords must be at least ${MIN_PASSWORD_LENGTH} characters — or leave the field blank to generate one.`,
    };
  }

  const accounts = getAdminAccounts();
  const others = accounts.filter((a) => a.username !== username);
  const replaced = others.length !== accounts.length;
  const entries = [
    ...others.map((a) => `${a.username}=${a.passwordHash}`),
    `${username}=${hashPassword(password)}`,
  ];

  return {
    username,
    // Only echo a password the operator hasn't seen; typed ones they know.
    password: formData.get("password") ? undefined : password,
    envValue: entries.join(","),
    replaced,
  };
}
