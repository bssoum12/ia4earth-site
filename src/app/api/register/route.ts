import { NextResponse } from "next/server";
import { parseParticipant, participants } from "@/lib/participants";
import { sendSalonConfirmation } from "@/lib/salonMail";

export const runtime = "nodejs";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Inscription publique :
 *  1. enregistre le participant (visible dans /admin) ;
 *  2. envoie une notification à l'équipe via Resend, si RESEND_API_KEY, REGISTRATION_TO_EMAIL
 *     et REGISTRATION_FROM_EMAIL sont définis (le domaine d'envoi doit être vérifié chez Resend).
 * La demande réussit dès que l'une des deux étapes aboutit.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Requête invalide." }, { status: 400 });
  }

  // Champ piège : un robot le remplit, on fait semblant d'accepter.
  if (typeof body.website === "string" && body.website.trim()) {
    return NextResponse.json({ message: "Merci, votre demande a bien été envoyée." });
  }

  const consent = body.consentement === "on" || body.consentement === true;
  const parsed = parseParticipant(body, { source: "site" });
  if (!parsed.ok || !consent) {
    return NextResponse.json({ message: "Merci de renseigner tous les champs obligatoires." }, { status: 422 });
  }
  const p = parsed.value;

  let stored = false;
  try {
    await participants.add(p);
    stored = true;
  } catch (e) {
    console.error("[register] stockage", e);
  }

  let emailed = false;
  const key = process.env.RESEND_API_KEY;
  const to = process.env.REGISTRATION_TO_EMAIL;
  const from = process.env.REGISTRATION_FROM_EMAIL;
  if (key && to && from) {
    const html = `<h2>Nouvelle inscription IA4EARTH</h2>
<p><b>Nom :</b> ${esc(p.nom)}<br><b>Organisation :</b> ${esc(p.organisation) || "-"}<br><b>E-mail :</b> ${esc(p.email)}<br><b>Catégorie :</b> ${esc(p.categorie)}</p>
<p><b>Message :</b><br>${esc(p.message).replace(/\n/g, "<br>") || "-"}</p>`;
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to: [to], reply_to: p.email, subject: `Inscription IA4EARTH : ${p.nom}`, html }),
      });
      emailed = res.ok;
      if (!res.ok) console.error("[register] Resend", res.status, await res.text().catch(() => ""));
    } catch (e) {
      console.error("[register] Resend", e);
    }
  }

  // Confirmation à l'inscrit, avec le lien du programme PDF : facultative, n'empêche jamais l'inscription.
  if (stored || emailed) await sendSalonConfirmation(p);

  if (!stored && !emailed) {
    return NextResponse.json(
      { message: "L'inscription en ligne n'est pas disponible pour le moment. Écrivez-nous à contact@salondedeveloppementdurable.com." },
      { status: 503 },
    );
  }
  return NextResponse.json({ message: "Merci, votre demande a bien été envoyée. L'équipe vous répondra rapidement." });
}
