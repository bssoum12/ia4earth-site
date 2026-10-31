import { NextResponse } from "next/server";
import { MASTERCLASS_CAPACITY } from "@/lib/content";
import { masterclass, parseRegistration } from "@/lib/masterclass";
import { sendMasterclassConfirmation } from "@/lib/masterclassMail";
import { TURNSTILE_ERROR, TURNSTILE_FIELD, verifyTurnstile } from "@/lib/turnstile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Nombre d'inscrits par master class (aucune donnée personnelle). */
export async function GET() {
  try {
    return NextResponse.json({ capacity: MASTERCLASS_CAPACITY, counts: await masterclass.counts() });
  } catch (e) {
    console.error("[masterclass] counts", e);
    return NextResponse.json({ message: "Indisponible." }, { status: 503 });
  }
}

/** Inscription à une master class : refusée (409) dès que les 20 places sont prises. */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Requête invalide." }, { status: 400 });
  }
  // Champ piège : un robot le remplit, on fait semblant d'accepter.
  if (typeof body.website === "string" && body.website.trim()) {
    return NextResponse.json({ message: "Merci, votre inscription est enregistrée." });
  }
  const consent = body.consentement === "on" || body.consentement === true;
  const parsed = parseRegistration(body);
  if (!parsed.ok || !consent) {
    return NextResponse.json({ message: parsed.ok ? "Merci de cocher la case de consentement." : parsed.error }, { status: 422 });
  }
  if (!(await verifyTurnstile(body[TURNSTILE_FIELD], req))) {
    return NextResponse.json({ message: TURNSTILE_ERROR }, { status: 403 });
  }

  try {
    const result = await masterclass.register(parsed.value);
    const counts = await masterclass.counts().catch(() => null);
    const payload = { counts, capacity: MASTERCLASS_CAPACITY };
    if (result === "ok") {
      const emailed = await sendMasterclassConfirmation(parsed.value);
      const message = emailed
        ? "Votre place est réservée. Un e-mail de confirmation vient de vous être envoyé (pensez à vérifier vos courriers indésirables)."
        : "Votre place est réservée. Rendez-vous à la master class, de 12h à 13h30 !";
      return NextResponse.json({ ...payload, message, emailed });
    }
    const message = {
      full: "Cette master class est complète : les 20 places sont prises.",
      duplicate: "Vous êtes déjà inscrit(e) à cette master class.",
      same_day: "Vous êtes déjà inscrit(e) à une autre master class ce jour-là : elles ont toutes lieu de 12h à 13h30.",
    }[result];
    return NextResponse.json({ ...payload, message }, { status: 409 });
  } catch (e) {
    console.error("[masterclass] register", e);
    return NextResponse.json(
      { message: "L'inscription en ligne n'est pas disponible pour le moment. Écrivez-nous à contact@salondedeveloppementdurable.com." },
      { status: 503 },
    );
  }
}
