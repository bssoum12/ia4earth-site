/**
 * Vérification Cloudflare Turnstile côté serveur.
 * Active uniquement si TURNSTILE_SECRET_KEY est définie : sans elle (développement local), les formulaires
 * restent utilisables et seul le champ piège les protège.
 */
export const turnstileEnabled = () => !!process.env.TURNSTILE_SECRET_KEY;

export const TURNSTILE_FIELD = "cf-turnstile-response";

/** Retourne true si Cloudflare valide le jeton. En cas d'erreur réseau, refuse (le visiteur peut réessayer). */
export async function verifyTurnstile(token: unknown, req: Request): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (typeof token !== "string" || !token || token.length > 4096) return false;

  const body = new URLSearchParams({ secret, response: token });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip");
  if (ip) body.set("remoteip", ip);

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return false;
    const json = (await res.json()) as { success?: boolean };
    return json.success === true;
  } catch (e) {
    console.error("[turnstile]", e);
    return false;
  }
}

export const TURNSTILE_ERROR = "La vérification anti-robot a échoué. Actualisez la page et réessayez.";
