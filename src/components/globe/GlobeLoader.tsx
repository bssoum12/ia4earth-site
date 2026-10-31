"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";

// Three.js et le masque terre/mer ne sont chargés qu'une fois la page affichée et le navigateur inactif :
// le texte du hero (LCP) et l'interactivité passent avant l'initialisation WebGL.
const Globe = dynamic(() => import("./Globe"), { ssr: false });

export default function GlobeLoader() {
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const onFail = useCallback(() => setFailed(true), []);

  useEffect(() => {
    document.documentElement.classList.toggle("no-gl", failed);
  }, [failed]);

  useEffect(() => {
    let cancelled = false;
    let handle: number | undefined;
    const start = () => {
      if (cancelled) return;
      const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
      if (ric) handle = ric(() => !cancelled && setReady(true), { timeout: 2500 });
      else handle = window.setTimeout(() => !cancelled && setReady(true), 1200);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", start);
      const cic = (window as unknown as { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback;
      if (handle !== undefined) (cic ? cic(handle) : window.clearTimeout(handle));
    };
  }, []);

  return (
    <>
      <div className="nebula" aria-hidden="true" />
      <div className="fallback-globe" aria-hidden="true" />
      {ready && !failed && <Globe onFail={onFail} />}
    </>
  );
}
