import type { Participant } from "@/lib/participants";

/**
 * Badge PROVISOIRE : la maquette définitive sera fournie plus tard.
 * Pour la remplacer, modifier uniquement ce composant (et la taille @page dans admin.css).
 * Format provisoire : 90 × 130 mm, un badge par page.
 */
const COLORS: Record<string, string> = {
  Visiteur: "#1c9d62",
  Exposant: "#d98a00",
  Startup: "#6b3fe0",
  Presse: "#0a8fa0",
};

export default function BadgeCard({ p }: { p: Participant }) {
  const color = COLORS[p.categorie] ?? "#333";
  return (
    <article className="badge" style={{ "--bc": color } as React.CSSProperties}>
      <header className="badge__top">
        <b>IA4EARTH</b>
        <span>3e édition · 5–6 novembre 2026</span>
      </header>
      <div className="badge__body">
        <h2>{p.nom}</h2>
        {p.organisation && <p>{p.organisation}</p>}
      </div>
      <footer className="badge__cat">{p.categorie}</footer>
    </article>
  );
}
