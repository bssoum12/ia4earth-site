"use client";

import { useEffect, useState } from "react";
import { CHALLENGE_CATS, CHALLENGE_STEPS } from "@/lib/content";

type Status = "done" | "next" | "later";
const LABELS: Record<Status, string> = { done: "Terminé", next: "Prochaine étape", later: "À venir" };

/** Statut de chaque étape selon la date du jour (calculé côté client). */
function computeStatuses(now: number): Status[] {
  let nextSet = false;
  return CHALLENGE_STEPS.map((s) => {
    const end = new Date(s.date + "T23:59:59+01:00").getTime();
    if (now > end) return "done";
    if (!nextSet) {
      nextSet = true;
      return "next";
    }
    return "later";
  });
}

export default function Concours() {
  const [statuses, setStatuses] = useState<Status[] | null>(null);
  useEffect(() => setStatuses(computeStatuses(Date.now())), []);

  // Position du trait lumineux : jusqu'à l'étape en cours (index 0..3)
  const idx = statuses ? (statuses.includes("next") ? statuses.indexOf("next") : CHALLENGE_STEPS.length - 1) : 0;

  return (
    <section className="sec sec--deep" id="concours">
      <div className="wrap">
        <div className="head" data-rv>
          <h2>IA4EARTH <span className="red">Startup Challenge</span></h2>
          <div className="lede"><p>Le concours met en lumière les idées, projets et startups qui appliquent l&apos;IA aux enjeux du développement durable. Les finalistes présentent leur solution devant le jury pendant le salon.</p></div>
          <a
            href="https://challenge.salondedeveloppementdurable.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--glow"
            style={{ marginTop: "1.5rem", display: "inline-flex" }}
          >
            Participer au concours →
          </a>
        </div>

        <ol className="steps" data-rv style={{ "--idx": idx } as React.CSSProperties}>
          {CHALLENGE_STEPS.map((s, i) => {
            const st = statuses?.[i];
            return (
              <li key={s.date} className={st ?? "later"}>
                <span className="dot" />
                <p className="when">{s.when}</p>
                <p className="what">{s.what}</p>
                <p className="state">{st ? LABELS[st] : " "}</p>
              </li>
            );
          })}
        </ol>

        <div className="cats">
          {CHALLENGE_CATS.map((c, i) => (
            <article key={c.title} data-rv className="hud" style={{ "--c": `var(--${c.c})`, "--i": i } as React.CSSProperties}>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
