import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { parseParticipant, participants } from "@/lib/participants";

export const runtime = "nodejs";

/** Saisie manuelle d'un participant (admin). */
export async function POST(req: Request) {
  if (!isAdmin()) return NextResponse.json({ message: "Non autorisé." }, { status: 401 });
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ message: "Requête invalide." }, { status: 400 });
  const parsed = parseParticipant(body, { source: "manuel" });
  if (!parsed.ok) return NextResponse.json({ message: parsed.error }, { status: 422 });
  try {
    const created = await participants.add(parsed.value);
    return NextResponse.json({ participant: created }, { status: 201 });
  } catch (e) {
    console.error("[admin] add", e);
    return NextResponse.json({ message: "Enregistrement impossible (stockage non configuré ?)." }, { status: 500 });
  }
}
