import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { participants } from "@/lib/participants";

export const runtime = "nodejs";

/** Marque des badges comme imprimés (appelé juste avant l'impression). */
export async function POST(req: Request) {
  if (!isAdmin()) return NextResponse.json({ message: "Non autorisé." }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as { ids?: unknown };
  const ids = Array.isArray(body.ids) ? body.ids.filter((i): i is string => typeof i === "string").slice(0, 2000) : [];
  try {
    await participants.markPrinted(ids);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin] print", e);
    return NextResponse.json({ message: "Mise à jour impossible." }, { status: 500 });
  }
}
