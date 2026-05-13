// lib/fingerprint.ts — server-side anti-abuse helpers for signup bonus.
// Goal: make it expensive to farm new accounts for free credits.

import { createHash } from "crypto";

/** Normalize an email so 'foo+1@gmail.com' and 'f.o.o@gmail.com' collapse to one identity. */
export function normalizeEmail(email: string): string {
  const trimmed = email.trim().toLowerCase();
  const [localRaw, domain] = trimmed.split("@");
  if (!domain) return trimmed;
  let local = localRaw.split("+")[0];
  if (domain === "gmail.com" || domain === "googlemail.com") {
    local = local.replace(/\./g, "");
    return `${local}@gmail.com`;
  }
  return `${local}@${domain}`;
}

const SALT = process.env.FINGERPRINT_SALT || "pressclass-fp-default-salt";

export function hashValue(input: string): string {
  return createHash("sha256").update(`${SALT}:${input}`).digest("hex");
}

export function extractClientIp(headers: Headers): string | null {
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return headers.get("x-real-ip") || headers.get("cf-connecting-ip");
}
