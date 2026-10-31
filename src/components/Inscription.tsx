"use client";

import { useState } from "react";
import { PROFILES, PROGRAMME_PDF, SITE } from "@/lib/content";
import Social from "./Social";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "ok" | "error"; msg: string };

export default function Inscription() {
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setState({ kind: "sending" });
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { message?: string };
      if (res.ok) {
        form.reset();
        setState({ kind: "ok", msg: json.message ?? "Merci, votre demande a bien été envoyée." });
      } else {
        setState({ kind: "error", msg: json.message ?? "L'envoi a échoué. Réessayez ou écrivez-nous directement." });
      }
    } catch {
      setState({ kind: "error", msg: "Connexion impossible. Réessayez ou écrivez-nous directement." });
    }
  }

  return (
    <section className="sec sec--deep" id="inscription">
      <div className="wrap">
        <div className="head" data-rv>
          <h2>Participer au salon</h2>
          <div className="lede">
            <p>L&apos;entrée au salon est gratuite, mais l&apos;inscription est obligatoire. Choisissez votre catégorie et laissez vos coordonnées : l&apos;équipe du salon vous écrit avec les informations pratiques. Un badge est nécessaire pour accéder au salon : vous le recevez par e-mail, ou vous pouvez le retirer à l&apos;accueil.</p>
            <ul className="chips access">
              <li><span>Entrée gratuite</span></li>
              <li><span>Inscription obligatoire</span></li>
              <li><span>Badge requis pour accéder au salon</span></li>
              <li><span>Badge envoyé par e-mail ou retiré à l&apos;accueil</span></li>
            </ul>
          </div>
        </div>

        <div className="reg">
          <form className="form hud" onSubmit={onSubmit} noValidate>
            <div className="row2">
              <label htmlFor="f-nom">Nom complet<input id="f-nom" name="nom" type="text" autoComplete="name" required /></label>
              <label htmlFor="f-org">Organisation<input id="f-org" name="organisation" type="text" autoComplete="organization" /></label>
            </div>
            <label htmlFor="f-mail">Adresse e-mail<input id="f-mail" name="email" type="email" autoComplete="email" required /></label>
            <label htmlFor="f-profil">Votre catégorie
              <select id="f-profil" name="categorie" required defaultValue="">
                <option value="">Choisir une catégorie</option>
                {PROFILES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </label>
            <label htmlFor="f-msg">Message (facultatif)<textarea id="f-msg" name="message" /></label>
            {/* Champ piège anti-spam : invisible pour les humains */}
            <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
              <label>Ne pas remplir<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
            </div>
            <label className="check" htmlFor="f-ok">
              <input id="f-ok" name="consentement" type="checkbox" required />
              <span>J&apos;accepte d&apos;être contacté par l&apos;équipe du salon au sujet de l&apos;événement.</span>
            </label>
            <div>
              <button className="btn btn--glow" type="submit" disabled={state.kind === "sending"}>
                {state.kind === "sending" ? "Envoi en cours…" : "Envoyer ma demande"}
              </button>
            </div>
            <p className="status" role="status" aria-live="polite" hidden={state.kind === "idle" || state.kind === "sending"}>
              {state.kind === "ok" || state.kind === "error" ? state.msg : ""}
            </p>
            {state.kind === "ok" && (
              <a className="btn btn--ghost" href={PROGRAMME_PDF.href} download>{PROGRAMME_PDF.label}</a>
            )}
          </form>

          <dl className="info">
            <div><dt>Dates</dt><dd>Jeudi 5 et vendredi 6 novembre 2026</dd></div>
            <div><dt>Lieu</dt><dd>Centre International des Congrès, siège de l&apos;UTICA, Tunis</dd></div>
            <div>
              <dt>Adresse et accès</dt>
              <dd>
                UTICA, Union Tunisienne de l’Industrie, du Commerce et de l’Artisanat<br />
                Rue Ferjani Belhaj Ammar, n°4, 1003 Tunis
              </dd>
            </div>
            <div>
              <dt>Contact</dt>
              <dd>
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a><br />
                <a href={SITE.phoneHref}>{SITE.phone}</a><br />
                {SITE.domain}
              </dd>
            </div>
            <div><dt>Suivez le salon</dt><dd><Social /></dd></div>
            <div className="links">
              <a className="btn btn--ghost" href="https://www.google.com/maps/search/?api=1&query=UTICA+Rue+Ferjani+Belhaj+Ammar+4+1003+Tunis" target="_blank" rel="noopener">Ouvrir dans Google Maps</a>
              <a className="btn btn--ghost" href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Salon+IA4EARTH+2026&dates=20261105/20261107&details=Innover+pour+un+monde+durable&location=Centre+International+des+Congr%C3%A8s%2C+UTICA%2C+Tunis" target="_blank" rel="noopener">Ajouter à Google Agenda</a>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
