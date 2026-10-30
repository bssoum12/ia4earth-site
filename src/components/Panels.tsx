"use client";

import { useEffect, useRef } from "react";
import { PANELS, SPEAKERS, THEMES } from "@/lib/content";

/** Inclinaison 3D au survol (désactivée si prefers-reduced-motion ou sans survol). */
function useTilt(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    const cleanups: Array<() => void> = [];
    root.querySelectorAll<HTMLElement>(".tilt").forEach((el) => {
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty("--ry", (px * 7).toFixed(2) + "deg");
        el.style.setProperty("--rx", (-py * 7).toFixed(2) + "deg");
        el.style.setProperty("--mx", e.clientX - r.left + "px");
        el.style.setProperty("--my", e.clientY - r.top + "px");
      };
      const leave = () => {
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      });
    });
    return () => cleanups.forEach((fn) => fn());
  }, [ref]);
}

export default function Panels() {
  const ref = useRef<HTMLElement>(null);
  useTilt(ref);

  return (
    <section className="sec sec--deep" id="panels" ref={ref}>
      <div className="wrap">
        <div className="head" data-rv>
          <h2>Quatre panels, de la donnée à l&apos;<span className="red">impact</span></h2>
          <div className="lede"><p>Chaque panel part d&apos;une question concrète et se conclut par un message clé.</p></div>
        </div>

        <div className="panels">
          {PANELS.map((p, i) => (
            <article key={p.n} data-rv className="hud tilt panel" style={{ "--c": `var(--${p.c})`, "--i": i % 2 } as React.CSSProperties}>
              <span className="sweep" aria-hidden="true" />
              <div className="panel__top">
                <span className="num">{p.n}</span>
                <svg className={`ico ico--${p.n}`} viewBox="0 0 48 48" width="44" height="44" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {p.icons.map((d) => <path key={d} d={d} />)}
                </svg>
              </div>
              <h3>{p.title}</h3>
              <p className="panel__q">{p.q}</p>
              <blockquote className="key"><b>Message clé</b><p>{p.key}</p></blockquote>
              <details className="more">
                <summary>Lire la présentation du panel</summary>
                <div className="more__body">
                  <p className="more__hook">{p.more.hook}</p>
                  {p.more.intro.map((t) => <p key={t}>{t}</p>)}
                  <h4>Au cœur du panel</h4>
                  <ul>
                    {p.more.questions.map(([label, text]) => (
                      <li key={text}>{label && <b>{label} : </b>}{text}</li>
                    ))}
                  </ul>
                  <p>{p.more.outro}</p>
                </div>
              </details>
              {SPEAKERS[p.n] && (
                <div className="speakers">
                  <h4>Intervenants</h4>
                  <ul>
                    {SPEAKERS[p.n].keynote && <li><b>Keynote</b><span>{SPEAKERS[p.n].keynote![0]}</span><em>{SPEAKERS[p.n].keynote![1]}</em></li>}
                    <li><b>Modération</b><span>{SPEAKERS[p.n].moderator[0]}</span><em>{SPEAKERS[p.n].moderator[1]}</em></li>
                    {SPEAKERS[p.n].panelists.map(([name, role]) => <li key={name}><b>Panéliste</b><span>{name}</span><em>{role}</em></li>)}
                  </ul>
                </div>
              )}
            </article>
          ))}
        </div>

        <h3 className="sub" data-rv>Thématiques abordées</h3>
        <ul className="chips">
          {THEMES.map(([label, odd], i) => (
            <li key={label} data-rv style={{ "--i": i % 4 } as React.CSSProperties}><span>{label}</span><em>{odd}</em></li>
          ))}
        </ul>
      </div>
    </section>
  );
}
