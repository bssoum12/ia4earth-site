"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { PROFILES } from "@/lib/content";
import { EMAIL_HINT, EMAIL_PATTERN, PHONE_HINT, PHONE_PATTERN } from "@/lib/validate";
import type { Participant } from "@/lib/participants";

const fmt = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short", timeZone: "Africa/Tunis" });

export default function AdminClient({ initial }: { initial: Participant[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const rows = useMemo(() => {
    const n = q.trim().toLowerCase();
    return initial.filter(
      (p) =>
        (!cat || p.categorie === cat) &&
        (!n || [p.nom, p.organisation, p.email, p.telephone].some((v) => v.toLowerCase().includes(n))),
    );
  }, [initial, q, cat]);

  const pending = initial.filter((p) => !p.badgePrintedAt).length;
  const allShown = rows.length > 0 && rows.every((p) => selected.has(p.id));

  function toggle(id: string) {
    setSelected((s) => {
      const next = new Set(s);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  }
  function toggleAll() {
    setSelected(allShown ? new Set() : new Set(rows.map((p) => p.id)));
  }
  const openBadges = (ids: string[]) => window.open(`/admin/badges?ids=${ids.join(",")}`, "_blank");

  async function add(e: React.FormEvent<HTMLFormElement>, thenPrint: boolean) {
    e.preventDefault();
    const form = e.currentTarget.form ?? e.currentTarget;
    if (!(form as HTMLFormElement).checkValidity()) {
      (form as HTMLFormElement).reportValidity();
      return;
    }
    setBusy(true);
    setError("");
    const data = Object.fromEntries(new FormData(form as HTMLFormElement).entries());
    const res = await fetch("/api/admin/participants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).catch(() => null);
    const json = (await res?.json().catch(() => ({}))) as { message?: string; participant?: Participant } | undefined;
    setBusy(false);
    if (!res?.ok || !json?.participant) {
      setError(json?.message ?? "Enregistrement impossible.");
      return;
    }
    (form as HTMLFormElement).reset();
    router.refresh();
    if (thenPrint) openBadges([json.participant.id]);
  }

  async function remove(p: Participant) {
    if (!window.confirm(`Supprimer ${p.nom} ? Cette action est définitive.`)) return;
    const res = await fetch(`/api/admin/participants/${p.id}`, { method: "DELETE" }).catch(() => null);
    if (!res?.ok) {
      setError("Suppression impossible.");
      return;
    }
    setSelected((s) => {
      const next = new Set(s);
      next.delete(p.id);
      return next;
    });
    router.refresh();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <main className="adm-main">
      <header className="adm-head">
        <div>
          <h1>Participants</h1>
          <p className="adm-muted">
            {initial.length} inscrit{initial.length > 1 ? "s" : ""} · {pending} badge{pending > 1 ? "s" : ""} à imprimer
          </p>
        </div>
        <div className="adm-actions">
          <a className="adm-btn" href="/admin/masterclass">Master class</a>
          <a className="adm-btn" href="/api/admin/export">Exporter en CSV</a>
          <button className="adm-btn" onClick={logout}>Se déconnecter</button>
        </div>
      </header>

      <ul className="adm-stats">
        {PROFILES.map((c) => (
          <li key={c}>
            <b>{initial.filter((p) => p.categorie === c).length}</b>
            <span>{c}</span>
          </li>
        ))}
      </ul>

      <section className="adm-card">
        <button className="adm-btn adm-btn--primary" onClick={() => setShowForm((v) => !v)} aria-expanded={showForm}>
          {showForm ? "Fermer le formulaire" : "+ Ajouter un participant"}
        </button>
        {showForm && (
          <form className="adm-form adm-grid" onSubmit={(e) => add(e, false)}>
            <label>Nom complet *<input name="nom" required autoComplete="off" /></label>
            <label>Organisation<input name="organisation" autoComplete="off" /></label>
            <label>E-mail<input name="email" type="email" autoComplete="off" pattern={EMAIL_PATTERN} title={EMAIL_HINT} maxLength={254} autoCapitalize="none" spellCheck={false} /></label>
            <label>Téléphone<input name="telephone" type="tel" autoComplete="off" inputMode="tel" pattern={PHONE_PATTERN} title={PHONE_HINT} maxLength={20} /></label>
            <label>Catégorie *
              <select name="categorie" required defaultValue="">
                <option value="" disabled>Choisir</option>
                {PROFILES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <div className="adm-form__actions">
              <button className="adm-btn adm-btn--primary" type="submit" disabled={busy}>Enregistrer</button>
              <button className="adm-btn" type="button" disabled={busy} onClick={(e) => add(e as unknown as React.FormEvent<HTMLFormElement>, true)}>
                Enregistrer et imprimer le badge
              </button>
            </div>
          </form>
        )}
        {error && <p className="adm-alert" role="alert">{error}</p>}
      </section>

      <section className="adm-card">
        <div className="adm-filters">
          <input type="search" placeholder="Rechercher (nom, organisation, e-mail, téléphone)" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Rechercher" />
          <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Filtrer par catégorie">
            <option value="">Toutes les catégories</option>
            {PROFILES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <button className="adm-btn" disabled={selected.size === 0} onClick={() => openBadges(Array.from(selected))}>
            Imprimer la sélection ({selected.size})
          </button>
          <a className="adm-btn" href="/admin/badges?pending=1" target="_blank" rel="noopener">
            Imprimer les non imprimés ({pending})
          </a>
        </div>

        <div className="adm-scroll">
          <table className="adm-table">
            <thead>
              <tr>
                <th><input type="checkbox" checked={allShown} onChange={toggleAll} aria-label="Tout sélectionner" /></th>
                <th>Nom</th><th>Organisation</th><th>Catégorie</th><th>Contact</th><th>Inscrit le</th><th>Badge</th><th />
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td><input type="checkbox" checked={selected.has(p.id)} onChange={() => toggle(p.id)} aria-label={`Sélectionner ${p.nom}`} /></td>
                  <td><b>{p.nom}</b><br /><small className="adm-muted">{p.source === "manuel" ? "Saisie manuelle" : "Site web"}</small></td>
                  <td>{p.organisation || "—"}</td>
                  <td><span className={`adm-tag adm-tag--${p.categorie}`}>{p.categorie}</span></td>
                  <td>{p.email || "—"}{p.telephone && <><br /><small>{p.telephone}</small></>}</td>
                  <td>{fmt.format(new Date(p.createdAt))}</td>
                  <td>{p.badgePrintedAt ? <span title={fmt.format(new Date(p.badgePrintedAt))}>✓ imprimé</span> : <span className="adm-muted">à imprimer</span>}</td>
                  <td className="adm-row-actions">
                    <button className="adm-btn adm-btn--sm" onClick={() => openBadges([p.id])}>Badge</button>
                    <button className="adm-btn adm-btn--sm adm-btn--danger" onClick={() => remove(p)}>Supprimer</button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={8} className="adm-empty">{initial.length === 0 ? "Aucun participant pour le moment." : "Aucun résultat."}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
