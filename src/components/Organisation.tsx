import Image from "next/image";
import { PARTNERS, TEAM } from "@/lib/content";

type Partner = (typeof PARTNERS)[number];

/** Bande défilante : le contenu est doublé pour une boucle continue (copie masquée aux lecteurs d'écran). */
function Marquee({ items, reverse, label }: { items: Partner[]; reverse?: boolean; label: string }) {
  const half = [...items, ...items];
  return (
    <div className={`marquee${reverse ? " marquee--rev" : ""}`} role="group" aria-label={label}>
      <ul className="marquee__track">
        {[...half, ...half].map((p, i) => (
          <li
            key={i}
            className={i >= items.length ? "dup" : undefined}
            aria-hidden={i >= items.length ? true : undefined}
            style={{ "--c": `var(--${p.c})` } as React.CSSProperties}
          >
            <b>{p.name}</b>
            <span>{p.kind}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Organisation() {
  const half = Math.ceil(PARTNERS.length / 2);
  return (
    <section className="sec" id="organisation">
      <div className="wrap">
        <div className="head" data-rv>
          <h2>Organisation et partenaires</h2>
          <div className="lede"><p>Le salon est organisé par Neo Influence. Un comité de pilotage de neuf personnalités, soutenu par un ambassadeur, porte cette 3e édition.</p></div>
        </div>

        <h3 className="sub" data-rv>Comité de pilotage et ambassade</h3>
        <p className="lede" style={{ marginBottom: 22 }}>Le comité de pilotage est présenté dans l&apos;ordre de l&apos;affiche officielle, avec le même format pour chaque membre : le salon repose sur un travail collectif.</p>
        <ul className="team">
          {TEAM.map((m, i) => (
            <li key={m.slug} className="member" data-rv style={{ "--i": i % 2 } as React.CSSProperties}>
              <span className="photo-wrap">
                <Image
                  className="photo"
                  src={`/team/${m.slug}.jpg`}
                  alt={`Portrait de ${m.name}`}
                  width={168}
                  height={168}
                  sizes="84px"
                />
              </span>
              <div className="member__txt">
                <h4>{m.name}</h4>
                <p className="role">{m.role}</p>
                <p>{m.bio}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="wrap">
        <h3 className="sub" data-rv>Sponsors et <span className="red">partenaires</span></h3>
      </div>
      {/* Pleine largeur : deux bandes en sens opposés (remplacées par les logos dès qu'ils sont fournis) */}
      <Marquee items={PARTNERS.slice(0, half)} label="Sponsors et partenaires, première liste" />
      <Marquee items={PARTNERS.slice(half)} reverse label="Sponsors et partenaires, seconde liste" />
    </section>
  );
}
