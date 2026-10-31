/**
 * Envoi d'e-mail via Resend (RESEND_API_KEY et REGISTRATION_FROM_EMAIL, domaine vérifié chez Resend).
 * Ne lève jamais d'erreur : retourne true si Resend a accepté l'envoi.
 */
export async function sendMail(opts: { to: string; subject: string; html: string; replyTo: string; tag: string }): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.REGISTRATION_FROM_EMAIL;
  if (!key || !from) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [opts.to], reply_to: opts.replyTo, subject: opts.subject, html: opts.html }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error(`[${opts.tag}] Resend`, res.status, await res.text().catch(() => ""));
    return res.ok;
  } catch (e) {
    console.error(`[${opts.tag}] Resend`, e);
    return false;
  }
}

export const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Bouton « Télécharger le programme » commun aux e-mails de confirmation. */
export const programmeButton = (siteUrl: string, href: string, label: string) =>
  `<p style="margin:18px 0"><a href="${siteUrl}${href}" style="background:#0a7a4b;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:6px;font-weight:bold;display:inline-block">${label}</a></p>`;
