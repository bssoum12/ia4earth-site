import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Authentification admin à mot de passe unique.
 * Variables : ADMIN_PASSWORD et ADMIN_SESSION_SECRET (16 caractères minimum, aléatoire).
 * La session est un cookie httpOnly signé (HMAC), valable 12 h.
 */
export const COOKIE = "ia4_admin";
export const SESSION_SECONDS = 12 * 60 * 60;

export const adminConfigured = () => !!process.env.ADMIN_PASSWORD && (process.env.ADMIN_SESSION_SECRET ?? "").length >= 16;

const sign = (v: string) => createHmac("sha256", process.env.ADMIN_SESSION_SECRET ?? "").update(v).digest("hex");
const sha = (v: string) => createHash("sha256").update(v).digest();

export function checkPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return timingSafeEqual(sha(candidate), sha(expected));
}

export function createSessionValue(): string {
  const exp = String(Date.now() + SESSION_SECONDS * 1000);
  return `${exp}.${sign(exp)}`;
}

export function isAdmin(): boolean {
  if (!adminConfigured()) return false;
  const value = cookies().get(COOKIE)?.value;
  if (!value) return false;
  const [exp, sig] = value.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  const good = Buffer.from(sign(exp));
  const got = Buffer.from(sig);
  return good.length === got.length && timingSafeEqual(good, got);
}
