/* Validation commune (serveur et formulaires) des adresses e-mail et numéros de téléphone. */

/** Motif HTML `pattern` (sans ancres : le navigateur les ajoute). Identique à celui du serveur. */
export const EMAIL_PATTERN = "[A-Za-z0-9._%+'\\-]+@[A-Za-z0-9\\-]+(\\.[A-Za-z0-9\\-]+)*\\.[A-Za-z]{2,24}";
export const PHONE_PATTERN = "\\+?[0-9 .\\-]{8,20}";

export const EMAIL_HINT = "Adresse e-mail invalide : saisissez par exemple nom@domaine.com (l'extension ne contient que des lettres).";
export const PHONE_HINT = "Numéro invalide : 8 à 15 chiffres, éventuellement précédés de +, par exemple 20 123 456 ou +216 20 123 456.";

const EMAIL_RE = new RegExp(`^${EMAIL_PATTERN}$`);
const PHONE_RE = new RegExp(`^${PHONE_PATTERN}$`);

/** L'extension (après le dernier point) ne contient que des lettres : « gmail.com46 » est refusé. */
export function isEmail(value: string): boolean {
  return value.length <= 254 && EMAIL_RE.test(value) && !value.includes("..") && !/^\.|\.@|@\./.test(value);
}

/**
 * Nettoie un numéro (espaces, points et tirets retirés) et le valide : 8 à 15 chiffres, « + » initial facultatif.
 * Retourne le numéro nettoyé, une chaîne vide si le champ est vide, ou null si le numéro est invalide.
 */
export function cleanPhone(value: string): string | null {
  const v = value.trim();
  if (!v) return "";
  if (!PHONE_RE.test(v)) return null;
  const cleaned = v.replace(/[ .\-]/g, "");
  const digits = cleaned.replace(/^\+/, "");
  return digits.length >= 8 && digits.length <= 15 ? cleaned : null;
}
