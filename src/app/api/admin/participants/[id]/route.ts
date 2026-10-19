import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { participants, UUID } from "@/lib/participants";

export const runtime = "nodejs";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!isAdmin()) return NextResponse.json({ message: "Non autorisé." }, { status: 401 });
  if (!UUID.test(params.id)) return NextResponse.json({ message: "Identifiant invalide." }, { status: 400 });
  try {
    await participants.remove(params.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin] remove", e);
    return NextResponse.json({ message: "Suppression impossible." }, { status: 500 });
  }
}
