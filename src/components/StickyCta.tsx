"use client";

import { useEffect, useState } from "react";

/** Barre d'inscription fixe sur mobile : visible tant que le bouton du hero et le formulaire sont hors écran. */
export default function StickyCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const targets = [document.querySelector(".hero .cta"), document.getElementById("inscription")].filter(
      (el): el is Element => !!el,
    );
    if (!targets.length || !("IntersectionObserver" in window)) return;
    const seen = new Map<Element, boolean>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => seen.set(e.target, e.isIntersecting));
      setShow(!Array.from(seen.values()).some(Boolean));
    });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <div className={`sticky-cta${show ? " show" : ""}`}>
      <span>5–6 nov. 2026 · Tunis</span>
      <a className="btn btn--glow btn--sm" href="#inscription" tabIndex={show ? 0 : -1}>Réserver ma place</a>
    </div>
  );
}
