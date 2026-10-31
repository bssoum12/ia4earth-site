import { MASTERCLASS_DAYS, MASTERCLASS_TIME, SITE } from "./content";
import { findClass, type RegisterInput } from "./masterclass";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * E-mail de confirmation d'inscription à une master class, envoyé via Resend.
 * Nécessite RESEND_API_KEY et REGISTRATION_FROM_EMAIL (domaine vérifié chez Resend).
 * Ne lève jamais d'erreur : l'inscription est déjà enregistrée, l'e-mail est un plus.
 * Retourne true si Resend a accepté l'envoi.
 */
export async function sendMasterclassConfirmation(input: RegisterInput): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.REGISTRATION_FROM_EMAIL;
  const cls = findClass(input.classId);
  if (!key || !from || !cls) return false;

  const day = MASTERCLASS_DAYS.find((d) => d.day === cls.day)?.label ?? "";
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;color:#0b2a21;line-height:1.5;max-width:560px">
<h2 style="color:#0a7a4b;margin:0 0 12px">Votre place est réservée</h2>
<p>Bonjour ${esc(input.nom)},</p>
<p>Votre inscription à la master class suivante est confirmée :</p>
<table style="border-collapse:collapse;margin:8px 0 16px">
<tr><td style="padding:4px 14px 4px 0;color:#557">Master class</td><td><b>${esc(cls.title)}</b></td></tr>
<tr><td style="padding:4px 14px 4px 0;color:#557">Formateur</td><td>${esc(cls.trainer)}, ${esc(cls.org)}</td></tr>
<tr><td style="padding:4px 14px 4px 0;color:#557">Date</td><td>${esc(day)}, de ${esc(MASTERCLASS_TIME)}</td></tr>
<tr><td style="padding:4px 14px 4px 0;color:#557">Lieu</td><td>Centre International des Congrès, siège de l'UTICA<br>Rue Ferjani Belhaj Ammar, n°4, 1003 Tunis</td></tr>
</table>
<p>Les places sont limitées à 20 par master class. Si vous ne pouvez pas venir, merci de nous prévenir pour libérer votre place.</p>
<p>L'accès au salon est gratuit mais soumis à l'inscription : si ce n'est pas encore fait, inscrivez-vous sur <a href="${SITE.url}/#inscription">${SITE.domain}</a>. Un badge est nécessaire pour accéder au salon.</p>
<p>Une question ? Écrivez-nous à <a href="mailto:${SITE.email}">${SITE.email}</a>.</p>
<p style="color:#557">IA4EARTH, 3e édition, 5 et 6 novembre 2026, Tunis</p>
</div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [input.email],
        reply_to: SITE.email,
        subject: `Inscription confirmée : master class « ${cls.title} »`,
        html,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error("[masterclass] Resend", res.status, await res.text().catch(() => ""));
    return res.ok;
  } catch (e) {
    console.error("[masterclass] Resend", e);
    return false;
  }
}
