"use client";

import { useEffect, useState } from "react";
import { NAV } from "@/lib/content";
import Logo from "./Logo";

/** `base` : "/" quand la barre est affichée hors de la page d'accueil (les ancres pointent alors vers l'accueil). */
export default function Nav({ base = "" }: { base?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`nav${open ? " is-open" : ""}`}>
      <div className="wrap nav__in">
        <a className="brand" href={`${base}#top`} onClick={() => setOpen(false)}>
          <Logo />
          IA4EARTH
        </a>
        <nav aria-label="Navigation principale">
          <ul id="nav-menu">
            {NAV.map((l) => (
              <li key={l.href}>
                <a href={l.href.startsWith("#") ? `${base}${l.href}` : l.href} onClick={() => setOpen(false)}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <a className="btn btn--glow btn--sm nav__cta" href={`${base}#inscription`} onClick={() => setOpen(false)}>S&apos;inscrire</a>
        <button
          type="button"
          className="nav__burger"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          aria-controls="nav-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
