import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { MASTERCLASSES, MASTERCLASS_CAPACITY } from "./content";
import { StorageNotConfigured } from "./participants";

/* ---------------------------------------------------------------------
   Inscriptions aux master class : 20 places par master class, une master class par personne et par jour
   (les master class d'une même journée ont lieu au même horaire).
   Stockage : Supabase (production, fonction SQL atomique) ou fichier local (développement).
   --------------------------------------------------------------------- */

export type MasterclassRegistration = {
  id: string;
  createdAt: string;
  classId: string;
  day: number;
  nom: string;
  email: string;
  telephone: string;
  organisation: string;
};

export type RegisterInput = Omit<MasterclassRegistration, "id" | "createdAt" | "day">;
export type RegisterResult = "ok" | "full" | "duplicate" | "same_day";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export const findClass = (id: string) => MASTERCLASSES.find((m) => m.id === id);

export function parseRegistration(
  body: Record<string, unknown>,
): { ok: true; value: RegisterInput } | { ok: false; error: string } {
  const classId = str(body.classId, 80);
  const nom = str(body.nom, 120);
  const email = str(body.email, 160).toLowerCase();
  if (!findClass(classId)) return { ok: false, error: "Master class inconnue." };
  if (!nom) return { ok: false, error: "Le nom est obligatoire." };
  if (!EMAIL.test(email)) return { ok: false, error: "Adresse e-mail invalide." };
  return {
    ok: true,
    value: { classId, nom, email, telephone: str(body.telephone, 40), organisation: str(body.organisation, 160) },
  };
}

interface Backend {
  counts(): Promise<Record<string, number>>;
  list(): Promise<MasterclassRegistration[]>;
  register(input: RegisterInput, day: number): Promise<RegisterResult>;
}

const tally = (rows: { classId: string }[]) => {
  const out: Record<string, number> = Object.fromEntries(MASTERCLASSES.map((m) => [m.id, 0]));
  for (const r of rows) if (r.classId in out) out[r.classId] += 1;
  return out;
};

/* ---------- Fichier local (développement) ---------- */

const FILE = path.join(process.cwd(), ".data", "masterclass.json");
let queue: Promise<unknown> = Promise.resolve();
const serial = <T,>(fn: () => Promise<T>): Promise<T> => {
  const run = queue.then(fn, fn);
  queue = run.catch(() => undefined);
  return run;
};
async function readAll(): Promise<MasterclassRegistration[]> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as MasterclassRegistration[];
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw e;
  }
}

const fileBackend: Backend = {
  async counts() {
    return tally(await readAll());
  },
  async list() {
    return (await readAll()).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  },
  register: (input, day) =>
    serial(async () => {
      const rows = await readAll();
      const mine = rows.filter((r) => r.email.toLowerCase() === input.email.toLowerCase());
      if (mine.some((r) => r.classId === input.classId)) return "duplicate";
      if (mine.some((r) => r.day === day)) return "same_day";
      if (rows.filter((r) => r.classId === input.classId).length >= MASTERCLASS_CAPACITY) return "full";
      rows.push({ ...input, id: randomUUID(), createdAt: new Date().toISOString(), day });
      await fs.mkdir(path.dirname(FILE), { recursive: true });
      await fs.writeFile(FILE, JSON.stringify(rows, null, 2), "utf8");
      return "ok";
    }),
};

/* ---------- Supabase (production) : la fonction SQL register_masterclass verrouille et compte ---------- */

type Row = {
  id: string;
  created_at: string;
  class_id: string;
  day: number;
  nom: string;
  email: string;
  telephone: string;
  organisation: string;
};

function supabaseBackend(url: string, key: string): Backend {
  const root = `${url.replace(/\/$/, "")}/rest/v1`;
  const headers = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
  async function call(p: string, init: RequestInit = {}) {
    const res = await fetch(root + p, { ...init, headers, cache: "no-store" });
    if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text().catch(() => "")}`);
    return res;
  }
  return {
    async counts() {
      const res = await call("/masterclass_registrations?select=class_id");
      return tally(((await res.json()) as { class_id: string }[]).map((r) => ({ classId: r.class_id })));
    },
    async list() {
      const res = await call("/masterclass_registrations?select=*&order=created_at.asc");
      return ((await res.json()) as Row[]).map(
        (r): MasterclassRegistration => ({
          id: r.id,
          createdAt: r.created_at,
          classId: r.class_id,
          day: r.day,
          nom: r.nom,
          email: r.email,
          telephone: r.telephone,
          organisation: r.organisation,
        }),
      );
    },
    async register(input, day) {
      const res = await call("/rpc/register_masterclass", {
        method: "POST",
        body: JSON.stringify({
          p_class_id: input.classId,
          p_day: day,
          p_capacity: MASTERCLASS_CAPACITY,
          p_nom: input.nom,
          p_email: input.email,
          p_telephone: input.telephone,
          p_organisation: input.organisation,
        }),
      });
      const out = (await res.json()) as string;
      return out === "ok" || out === "full" || out === "duplicate" || out === "same_day" ? out : "full";
    },
  };
}

function backend(): Backend {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && key) return supabaseBackend(url, key);
  if (process.env.VERCEL) throw new StorageNotConfigured("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY manquants");
  return fileBackend;
}

export const masterclass = {
  counts: () => backend().counts(),
  list: () => backend().list(),
  register: (input: RegisterInput) => backend().register(input, findClass(input.classId)!.day),
};
