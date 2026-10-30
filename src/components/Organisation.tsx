import Image from "next/image";
import { PARTNER_TIERS, PARTNERS, TEAM } from "@/lib/content";

export default function Organisation() {
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
      <div className="wrap">
        {PARTNER_TIERS.map((t) => (
          <div key={t.id} className="ptier" style={{ "--c": `var(--${t.c})` } as React.CSSProperties}>
            <h4 data-rv>{t.label}</h4>
            <ul className={`plogos plogos--${t.id}`}>
              {PARTNERS.filter((p) => p.tier === t.id).map((p) => (
                <li key={p.logo} data-rv>
                  <Image src={`/partners/${p.logo}.png`} alt={p.name} width={260} height={130} sizes="(max-width: 600px) 40vw, 180px" />
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="ptier ptier--org" style={{ "--c": "var(--green)" } as React.CSSProperties}>
          <h4 data-rv>Organisé par</h4>
          <ul className="plogos plogos--org">
            <li data-rv><Image src="/partners/neo-influence.png" alt="Neo Influence, Influence differently" width={260} height={70} sizes="260px" /></li>
          </ul>
        </div>
      </div>
    </section>
  );
}
