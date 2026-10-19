import { FORMATS, PARTICIPANTS, PARTNERS, PILLARS, THEMES } from "@/lib/content";

const STATS: [number, string][] = [
  [2, "jours"],
  [4, "panels"],
  [THEMES.length, "thématiques liées aux ODD"],
  [FORMATS.length, "formats de rencontre"],
  [PARTNERS.length, "sponsors et partenaires"],
];
const rv = (i = 0) => ({ "--i": i }) as React.CSSProperties;

export default function Salon() {
  return (
    <section className="sec" id="salon">
      <div className="wrap">
        <div className="head" data-rv>
          <h2>L&apos;intelligence artificielle au service de la <span className="red">transition écologique</span></h2>
          <div className="lede">
            <p>Pendant deux jours, IA4EARTH réunit autour de la même table ceux qui financent, décident, innovent et déploient. Le salon veut renforcer la coopération entre public et privé, encourager l&apos;investissement responsable, promouvoir l&apos;innovation technologique et accélérer la transition vers une économie verte.</p>
            <p>Son ambition : devenir une plateforme de référence pour l&apos;Afrique et la Méditerranée, en lien avec les Objectifs de développement durable des Nations unies.</p>
          </div>
        </div>

        <ul className="stats" aria-label="Le salon en chiffres">
          {STATS.map(([n, label], i) => (
            <li key={label} data-rv style={rv(i)}>
              <b data-count={n}>{n}</b>
              <span>{label}</span>
            </li>
          ))}
        </ul>

        <ul className="pillars">
          {PILLARS.map((p, i) => (
            <li key={p.title} data-rv style={{ "--c": `var(--${p.c})`, "--i": i } as React.CSSProperties}>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </li>
          ))}
        </ul>

        <h3 className="sub" data-rv>Qui participe</h3>
        <ul className="tags">
          {PARTICIPANTS.map((t, i) => <li key={t} data-rv style={rv(i % 5)}>{t}</li>)}
        </ul>
      </div>
    </section>
  );
}
