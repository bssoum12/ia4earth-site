import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { PROFILES } from "./content";

/* ---------------------------------------------------------------------
   Participants : stockage sur Supabase (production) ou fichier local (dev).
   Supabase est utilisé dès que SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont définis.
   --------------------------------------------------------------------- */

export type Participant = {
  id: string;
  createdAt: string;
  nom: string;
  organisation: string;
  email: string;
  telephone: string;
  categorie: string;
  message: string;
  source: "site" | "manuel";
  badgePrintedAt: string | null;
};

export type ParticipantInput = Omit<Participant, "id" | "createdAt" | "badgePrintedAt">;

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Valide et nettoie les données d'un participant. L'e-mail est facultatif pour une saisie manuelle. */
export function parseParticipant(
  body: Record<string, unknown>,
  opts: { source: "site" | "manuel" },
): { ok: true; value: ParticipantInput } | { ok: false; error: string } {
  const nom = str(body.nom, 120);
  const email = str(body.email, 160);
  const categorie = str(body.categorie ?? body.profil, 120);
  if (!nom) return { ok: false, error: "Le nom est obligatoire." };
  if (!PROFILES.includes(categorie)) return { ok: false, error: "Catégorie invalide." };
  if (opts.source === "site" && !EMAIL.test(email)) return { ok: false, error: "Adresse e-mail invalide." };
  if (email && !EMAIL.test(email)) return { ok: false, error: "Adresse e-mail invalide." };
  return {
    ok: true,
    value: {
      nom,
      organisation: str(body.organisation, 160),
      email,
      telephone: str(body.telephone, 40),
      categorie,
      message: str(body.message, 3000),
      source: opts.source,
    },
  };
}

interface Backend {
  list(): Promise<Participant[]>;
  getMany(ids: string[]): Promise<Participant[]>;
  add(input: ParticipantInput): Promise<Participant>;
  remove(id: string): Promise<void>;
  markPrinted(ids: string[]): Promise<void>;
}

/* ---------- Fichier local (développement) ---------- */

const FILE = path.join(process.cwd(), ".data", "participants.json");
let queue: Promise<unknown> = Promise.resolve();
const serial = <T,>(fn: () => Promise<T>): Promise<T> => {
  const run = queue.then(fn, fn);
  queue = run.catch(() => undefined);
  return run;
};

async function readAll(): Promise<Participant[]> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as Participant[];
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw e;
  }
}
async function writeAll(rows: Participant[]) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(rows, null, 2), "utf8");
}

const fileBackend: Backend = {
  async list() {
    return (await readAll()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  async getMany(ids) {
    const set = new Set(ids);
    return (await readAll()).filter((p) => set.has(p.id));
  },
  add: (input) =>
    serial(async () => {
      const row: Participant = { ...input, id: randomUUID(), createdAt: new Date().toISOString(), badgePrintedAt: null };
      await writeAll([...(await readAll()), row]);
      return row;
    }),
  remove: (id) =>
    serial(async () => {
      await writeAll((await readAll()).filter((p) => p.id !== id));
    }),
  markPrinted: (ids) =>
    serial(async () => {
      const set = new Set(ids);
      const now = new Date().toISOString();
      await writeAll((await readAll()).map((p) => (set.has(p.id) ? { ...p, badgePrintedAt: now } : p)));
    }),
};

/* ---------- Supabase (production), via l'API REST PostgREST ---------- */

type Row = {
  id: string;
  created_at: string;
  nom: string;
  organisation: string;
  email: string;
  telephone: string;
  categorie: string;
  message: string;
  source: "site" | "manuel";
  badge_printed_at: string | null;
};

const fromRow = (r: Row): Participant => ({
  id: r.id,
  createdAt: r.created_at,
  nom: r.nom,
  organisation: r.organisation,
  email: r.email,
  telephone: r.telephone,
  categorie: r.categorie,
  message: r.message,
  source: r.source,
  badgePrintedAt: r.badge_printed_at,
});

function supabaseBackend(url: string, key: string): Backend {
  const base = `${url.replace(/\/$/, "")}/rest/v1/participants`;
  const headers = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
  async function call(query: string, init: RequestInit = {}) {
    const res = await fetch(base + query, { ...init, headers: { ...headers, ...(init.headers ?? {}) }, cache: "no-store" });
    if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text().catch(() => "")}`);
    return res;
  }
  const inList = (ids: string[]) => `in.(${ids.filter((i) => UUID.test(i)).join(",")})`;
  return {
    async list() {
      const res = await call("?select=*&order=created_at.desc");
      return ((await res.json()) as Row[]).map(fromRow);
    },
    async getMany(ids) {
      if (!ids.some((i) => UUID.test(i))) return [];
      const res = await call(`?select=*&id=${inList(ids)}`);
      return ((await res.json()) as Row[]).map(fromRow);
    },
    async add(input) {
      const res = await call("", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify(input) });
      return fromRow(((await res.json()) as Row[])[0]);
    },
    async remove(id) {
      if (!UUID.test(id)) return;
      await call(`?id=eq.${id}`, { method: "DELETE" });
    },
    async markPrinted(ids) {
      if (!ids.some((i) => UUID.test(i))) return;
      await call(`?id=${inList(ids)}`, { method: "PATCH", body: JSON.stringify({ badge_printed_at: new Date().toISOString() }) });
    },
  };
}

export class StorageNotConfigured extends Error {}

function backend(): Backend {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && key) return supabaseBackend(url, key);
  // Sur Vercel le disque est éphémère : un stockage externe est indispensable.
  if (process.env.VERCEL) throw new StorageNotConfigured("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY manquants");
  return fileBackend;
}

export const participants = {
  list: () => backend().list(),
  getMany: (ids: string[]) => backend().getMany(ids),
  add: (input: ParticipantInput) => backend().add(input),
  remove: (id: string) => backend().remove(id),
  markPrinted: (ids: string[]) => backend().markPrinted(ids),
};
