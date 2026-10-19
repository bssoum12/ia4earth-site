"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/content";

const pad = (n: number) => (n < 10 ? "0" : "") + n;

export default function Countdown() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const start = new Date(SITE.start).getTime();
  const end = new Date(SITE.end).getTime();

  let note: React.ReactNode = (
    <>
      <span className="red live">Dernière ligne droite</span> avant le 5 novembre
    </>
  );
  let timer: React.ReactNode = null;

  if (now === null) {
    timer = <Cells d="--" h="--" m="--" s="--" />;
  } else if (now >= end) {
    note = "Merci à toutes et à tous.";
  } else if (now >= start) {
    note = "Le salon est en cours à Tunis.";
  } else {
    const s = Math.floor((start - now) / 1000);
    timer = (
      <Cells
        d={String(Math.floor(s / 86400))}
        h={pad(Math.floor((s % 86400) / 3600))}
        m={pad(Math.floor((s % 3600) / 60))}
        s={pad(s % 60)}
      />
    );
  }

  return (
    <>
      {timer && (
        <div className="count" role="timer" aria-label="Compte à rebours avant le 5 novembre 2026">
          {timer}
        </div>
      )}
      <p className="count-note">{note}</p>
    </>
  );
}

function Cells({ d, h, m, s }: { d: string; h: string; m: string; s: string }) {
  return (
    <>
      <div><b>{d}</b><span>jours</span></div>
      <div><b>{h}</b><span>heures</span></div>
      <div><b>{m}</b><span>minutes</span></div>
      <div><b>{s}</b><span>secondes</span></div>
    </>
  );
}
