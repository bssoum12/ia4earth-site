"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";

// Three.js et le masque terre/mer ne sont chargés qu'après le premier rendu.
const Globe = dynamic(() => import("./Globe"), { ssr: false });

export default function GlobeLoader() {
  const [failed, setFailed] = useState(false);
  const onFail = useCallback(() => setFailed(true), []);

  useEffect(() => {
    document.documentElement.classList.toggle("no-gl", failed);
  }, [failed]);

  return (
    <>
      <div className="nebula" aria-hidden="true" />
      <div className="fallback-globe" aria-hidden="true" />
      {!failed && <Globe onFail={onFail} />}
    </>
  );
}
