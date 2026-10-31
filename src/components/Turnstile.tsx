"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render(el: HTMLElement, options: Record<string, unknown>): string;
      reset(id?: string): void;
      remove(id?: string): void;
    };
  }
}

/** Clé publique du widget (variable NEXT_PUBLIC_*, lue à la compilation). Sans elle, aucun widget n'est affiché. */
export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
export const TURNSTILE_FIELD = "cf-turnstile-response";

const SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let loading: Promise<void> | null = null;
function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  loading ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      loading = null;
      reject(new Error("turnstile"));
    };
    document.head.appendChild(s);
  });
  return loading;
}

/**
 * Widget Cloudflare Turnstile. Placé dans un <form>, il y ajoute un champ caché « cf-turnstile-response »
 * qui part avec les données. `lazy` : ne charge le script qu'à l'approche du formulaire (garde la page d'accueil légère).
 * `resetSignal` : à incrémenter après chaque envoi, car un jeton ne sert qu'une fois.
 */
export default function Turnstile({ lazy = false, resetSignal = 0 }: { lazy?: boolean; resetSignal?: number }) {
  const box = useRef<HTMLDivElement>(null);
  const widget = useRef<string | undefined>(undefined);

  useEffect(() => {
    const el = box.current;
    if (!TURNSTILE_SITE_KEY || !el) return;
    let cancelled = false;
    const mount = () => {
      loadScript()
        .then(() => {
          if (cancelled || !window.turnstile || widget.current) return;
          widget.current = window.turnstile.render(el, { sitekey: TURNSTILE_SITE_KEY, theme: "dark", language: "fr" });
        })
        .catch(() => undefined);
    };
    let io: IntersectionObserver | undefined;
    if (lazy && "IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            io?.disconnect();
            mount();
          }
        },
        { rootMargin: "400px" },
      );
      io.observe(el);
    } else {
      mount();
    }
    return () => {
      cancelled = true;
      io?.disconnect();
      if (widget.current) window.turnstile?.remove(widget.current);
      widget.current = undefined;
    };
  }, [lazy]);

  useEffect(() => {
    if (resetSignal && widget.current) window.turnstile?.reset(widget.current);
  }, [resetSignal]);

  if (!TURNSTILE_SITE_KEY) return null;
  return <div ref={box} className="turnstile" />;
}
