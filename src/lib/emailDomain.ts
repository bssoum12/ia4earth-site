import { promises as dns } from "node:dns";

/**
 * Vérifie que le domaine d'une adresse e-mail existe et peut recevoir du courrier (enregistrement MX, ou A/AAAA à défaut).
 * « gmail.comqsfsdf » : domaine inexistant, donc refusé. On ne refuse que sur une réponse claire « domaine inexistant »
 * ou « pas de courrier » : une panne DNS ne bloque jamais le visiteur. Si le résolveur du système est injoignable,
 * on réessaie auprès de résolveurs publics. Serveur uniquement (module Node).
 */
const cache = new Map<string, { ok: boolean; at: number }>();
const TTL = 10 * 60 * 1000;

const withTimeout = <T,>(p: Promise<T>, ms: number) =>
  Promise.race([
    p,
    new Promise<never>((_, reject) => setTimeout(() => reject(Object.assign(new Error("timeout"), { code: "ETIMEOUT" })), ms)),
  ]);

const NOT_FOUND = new Set(["ENOTFOUND", "ENODATA", "NXDOMAIN"]);
const codeOf = (e: unknown) => (e as NodeJS.ErrnoException).code ?? "";

const publicResolver = new dns.Resolver();
publicResolver.setServers(["1.1.1.1", "8.8.8.8"]);

type Method = "resolveMx" | "resolve4" | "resolve6";

/** Interroge le résolveur du système, puis les résolveurs publics si celui-ci est en panne. Rejette avec le code d'erreur. */
async function query(method: Method, domain: string): Promise<unknown[]> {
  try {
    return await withTimeout(dns[method](domain) as Promise<unknown[]>, 3000);
  } catch (e) {
    if (NOT_FOUND.has(codeOf(e))) throw e;
    return withTimeout(publicResolver[method](domain) as Promise<unknown[]>, 3000);
  }
}

async function lookup(domain: string): Promise<boolean> {
  try {
    const mx = (await query("resolveMx", domain)) as { exchange: string }[];
    // MX nul (RFC 7505) : le domaine déclare ne jamais recevoir de courrier.
    return mx.some((r) => r.exchange && r.exchange !== ".");
  } catch (e) {
    if (!NOT_FOUND.has(codeOf(e))) return true; // panne DNS : on laisse passer
  }
  // Pas de MX : un domaine avec une adresse A ou AAAA peut recevoir du courrier (RFC 5321).
  let unknown = false;
  const found = await Promise.all(
    (["resolve4", "resolve6"] as const).map((m) =>
      query(m, domain).then(
        (r) => r.length > 0,
        (e) => {
          if (!NOT_FOUND.has(codeOf(e))) unknown = true;
          return false;
        },
      ),
    ),
  );
  return found.some(Boolean) || unknown;
}

export async function emailDomainExists(email: string): Promise<boolean> {
  const domain = email.slice(email.lastIndexOf("@") + 1).toLowerCase();
  if (!domain) return false;
  const hit = cache.get(domain);
  if (hit && Date.now() - hit.at < TTL) return hit.ok;
  const ok = await lookup(domain);
  cache.set(domain, { ok, at: Date.now() });
  return ok;
}

export const EMAIL_DOMAIN_ERROR =
  "Le domaine de cette adresse e-mail n'existe pas ou ne reçoit pas de courrier. Vérifiez l'orthographe (par exemple gmail.com).";
