"use client";

import Image from "next/image";
import { useState } from "react";
import { MASTERCLASSES, MASTERCLASS_DAYS, MASTERCLASS_TIME, PROGRAMME_PDF } from "@/lib/content";

type Counts = Record<string, number>;
type Status = { kind: "idle" } | { kind: "sending" } | { kind: "ok" | "error"; msg: string };

export default function MasterclassList({ initialCounts, capacity }: { initialCounts: Counts | null; capacity: number }) {
  const [counts, setCounts] = useState<Counts | null>(initialCounts);
  const [openId, setOpenId] = useState<string | null>(null);
  const [status, setStatus] = useState<Record<string, Status>>({});

  const setOne = (id: string, s: Status) => setStatus((prev) => ({ ...prev, [id]: s }));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>, classId: string) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setOne(classId, { kind: "sending" });
    const data = { ...Object.fromEntries(new FormData(form).entries()), classId };
    try {
      const res = await fetch("/api/masterclass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { message?: string; counts?: Counts | null };
      if (json.counts) setCounts(json.counts);
      if (res.ok) {
        form.reset();
        setOpenId(null);
        setOne(classId, { kind: "ok", msg: json.message ?? "Votre place est réservée." });
      } else {
        setOne(classId, { kind: "error", msg: json.message ?? "L'inscription a échoué. Réessayez ou écrivez-nous." });
      }
    } catch {
      setOne(classId, { kind: "error", msg: "Connexion impossible. Réessayez ou écrivez-nous." });
    }
  }

  return (
    <>
      {MASTERCLASS_DAYS.map((d) => (
        <div key={d.day} className="mc-day" style={{ "--c": `var(--${d.c})` } as React.CSSProperties}>
          <h2 className="mc-day__title">
            {d.label} <span>{MASTERCLASS_TIME}</span>
          </h2>
          <ul className="mc-grid">
            {MASTERCLASSES.filter((m) => m.day === d.day).map((m) => {
              const taken = counts?.[m.id];
              const left = taken === undefined ? null : Math.max(0, capacity - taken);
              const full = left === 0;
              const st = status[m.id] ?? { kind: "idle" };
              const open = openId === m.id && !full;
              const done = st.kind === "ok";
              return (
                <li key={m.id} className={`hud mc-card${full ? " is-full" : ""}`}>
                  <h3>{m.title}</h3>
                  <div className="mc-trainer">
                    <span className="mc-logo">
                      <Image src={`/partners/${m.logo}.png`} alt="" width={120} height={60} sizes="64px" />
                    </span>
                    <span>
                      <b>{m.trainer}</b>
                      <em>{m.org}</em>
                    </span>
                  </div>

                  <div className="mc-places" role="group" aria-label="Places">
                    <div className="mc-bar" aria-hidden="true">
                      <i style={{ width: taken === undefined ? "0%" : `${Math.min(100, (taken / capacity) * 100)}%` }} />
                    </div>
                    <p className={`mc-left${full ? " is-full" : left !== null && left <= 5 ? " is-low" : ""}`}>
                      {left === null
                        ? `${capacity} places`
                        : full
                          ? "Complet"
                          : left <= 5
                            ? `Dernières places : ${left} restante${left > 1 ? "s" : ""}`
                            : `${left} places restantes sur ${capacity}`}
                    </p>
                  </div>

                  {full ? (
                    <button className="btn btn--ghost" type="button" disabled>
                      Inscriptions closes
                    </button>
                  ) : (
                    <button
                      className="btn btn--glow"
                      type="button"
                      aria-expanded={open}
                      aria-controls={`mc-form-${m.id}`}
                      onClick={() => setOpenId(open ? null : m.id)}
                    >
                      {done ? "Inscription enregistrée" : open ? "Fermer" : "S'inscrire"}
                    </button>
                  )}

                  {open && (
                    <form id={`mc-form-${m.id}`} className="form mc-form" onSubmit={(e) => onSubmit(e, m.id)} noValidate>
                      <label htmlFor={`n-${m.id}`}>Nom complet<input id={`n-${m.id}`} name="nom" type="text" autoComplete="name" required /></label>
                      <label htmlFor={`e-${m.id}`}>Adresse e-mail<input id={`e-${m.id}`} name="email" type="email" autoComplete="email" required /></label>
                      <div className="row2">
                        <label htmlFor={`t-${m.id}`}>Téléphone<input id={`t-${m.id}`} name="telephone" type="tel" autoComplete="tel" /></label>
                        <label htmlFor={`o-${m.id}`}>Organisation<input id={`o-${m.id}`} name="organisation" type="text" autoComplete="organization" /></label>
                      </div>
                      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
                        <label>Ne pas remplir<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
                      </div>
                      <label className="check" htmlFor={`c-${m.id}`}>
                        <input id={`c-${m.id}`} name="consentement" type="checkbox" required />
                        <span>J&apos;accepte d&apos;être contacté(e) par l&apos;équipe du salon au sujet de cette master class.</span>
                      </label>
                      <button className="btn btn--glow" type="submit" disabled={st.kind === "sending"}>
                        {st.kind === "sending" ? "Envoi en cours…" : "Réserver ma place"}
                      </button>
                    </form>
                  )}

                  <p className={`status mc-status${st.kind === "error" ? " is-error" : ""}`} role="status" aria-live="polite" hidden={st.kind === "idle" || st.kind === "sending"}>
                    {st.kind === "ok" || st.kind === "error" ? st.msg : ""}
                  </p>
                  {done && (
                    <a className="btn btn--ghost" href={PROGRAMME_PDF.href} download>{PROGRAMME_PDF.label}</a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </>
  );
}
