import { isAdmin } from "@/lib/adminAuth";
import { participants } from "@/lib/participants";

export const runtime = "nodejs";

// Neutralise l'injection de formules (Excel) et échappe les guillemets
const cell = (v: string) => {
  const safe = /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
  return `"${safe.replace(/"/g, '""')}"`;
};

export async function GET() {
  if (!isAdmin()) return new Response("Non autorisé.", { status: 401 });
  const rows = await participants.list();
  const head = ["Nom", "Organisation", "E-mail", "Téléphone", "Catégorie", "Source", "Inscrit le", "Badge imprimé le", "Message"];
  const lines = rows.map((p) =>
    [p.nom, p.organisation, p.email, p.telephone, p.categorie, p.source, p.createdAt, p.badgePrintedAt ?? "", p.message].map(cell).join(";"),
  );
  // BOM UTF-8 pour qu'Excel lise correctement les accents
  const csv = "﻿" + [head.map(cell).join(";"), ...lines].join("\r\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="participants-ia4earth.csv"',
      "Cache-Control": "no-store",
    },
  });
}
