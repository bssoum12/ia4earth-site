import { PROGRAMME_PDF, SITE } from "./content";
import { esc, programmeButton, sendMail } from "./mail";

/**
 * E-mail de confirmation envoyé à la personne qui s'inscrit au salon, avec le lien de téléchargement
 * du programme officiel en PDF. Ne lève jamais d'erreur.
 */
export async function sendSalonConfirmation(p: { nom: string; email: string; categorie: string }): Promise<boolean> {
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;color:#0b2a21;line-height:1.5;max-width:560px">
<h2 style="color:#0a7a4b;margin:0 0 12px">Votre demande d'inscription est bien reçue</h2>
<p>Bonjour ${esc(p.nom)},</p>
<p>Merci de votre inscription au salon <b>IA4EARTH</b> (catégorie : ${esc(p.categorie)}). L'équipe vous écrit avec les informations pratiques.</p>
<table style="border-collapse:collapse;margin:8px 0 16px">
<tr><td style="padding:4px 14px 4px 0;color:#557">Dates</td><td>Jeudi 5 et vendredi 6 novembre 2026</td></tr>
<tr><td style="padding:4px 14px 4px 0;color:#557">Lieu</td><td>Centre International des Congrès, siège de l'UTICA<br>Rue Ferjani Belhaj Ammar, n°4, 1003 Tunis</td></tr>
</table>
${programmeButton(SITE.url, PROGRAMME_PDF.href, PROGRAMME_PDF.label)}
<p>L'entrée est gratuite. Un badge est nécessaire pour accéder au salon : vous le recevrez par e-mail, ou vous pourrez le retirer à l'accueil.</p>
<p>Des master class (12h à 13h30, 20 places chacune) sont ouvertes à l'inscription : <a href="${SITE.url}/masterclass">${SITE.domain}/masterclass</a>.</p>
<p>Une question ? Écrivez-nous à <a href="mailto:${SITE.email}">${SITE.email}</a>.</p>
<p style="color:#557">IA4EARTH, 3e édition, 5 et 6 novembre 2026, Tunis</p>
</div>`;

  return sendMail({
    to: p.email,
    replyTo: SITE.email,
    subject: "IA4EARTH : votre inscription au salon",
    html,
    tag: "register",
  });
}
