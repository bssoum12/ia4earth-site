import { NextResponse } from "next/server";
import { adminConfigured, checkPassword, COOKIE, createSessionValue, SESSION_SECONDS } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!adminConfigured()) {
    return NextResponse.json({ message: "L'administration n'est pas configurée (ADMIN_PASSWORD, ADMIN_SESSION_SECRET)." }, { status: 503 });
  }
  const body = (await req.json().catch(() => ({}))) as { password?: unknown };
  // Ralentit les tentatives en rafale
  await new Promise((r) => setTimeout(r, 700));
  if (typeof body.password !== "string" || !checkPassword(body.password)) {
    return NextResponse.json({ message: "Mot de passe incorrect." }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, createSessionValue(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
  return res;
}
