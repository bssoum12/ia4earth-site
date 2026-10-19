"use client";

import Link from "next/link";
import { useState } from "react";

export default function PrintToolbar({ ids, count }: { ids: string[]; count: number }) {
  const [busy, setBusy] = useState(false);

  async function print() {
    setBusy(true);
    // Marque les badges comme imprimés, puis ouvre la boîte d'impression
    await fetch("/api/admin/print", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    }).catch(() => null);
    setBusy(false);
    window.print();
  }

  return (
    <div className="adm-toolbar no-print">
      <Link className="adm-btn" href="/admin">← Retour à la liste</Link>
      <span>{count} badge{count > 1 ? "s" : ""} prêt{count > 1 ? "s" : ""} à imprimer</span>
      <button className="adm-btn adm-btn--primary" onClick={print} disabled={busy || count === 0}>
        {busy ? "Préparation…" : "Imprimer"}
      </button>
    </div>
  );
}
