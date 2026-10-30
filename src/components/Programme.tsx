import { DAYS, FORMATS } from "@/lib/content";

export default function Programme() {
  return (
    <section className="sec" id="programme">
      <div className="wrap">
        <div className="head" data-rv>
          <h2>Le programme</h2>
          <div className="lede"><p>Conférences, tables rondes, ateliers, rencontres B2B, expositions et démonstrations se succèdent pendant deux jours.</p></div>
        </div>

        <ul className="formats">
          {FORMATS.map((f, i) => <li key={f} data-rv style={{ "--i": i % 4 } as React.CSSProperties}>{f}</li>)}
        </ul>

        <p className="note" style={{ marginTop: 28 }}>Horaires donnés à titre indicatif, sous réserve de modifications.</p>

        {/* Frise : le trait lumineux se remplit au fil du scroll (voir Effects) */}
        <div className="tl" data-progress>
          <div className="tl__rail" aria-hidden="true"><i className="tl__fill" /></div>
          {DAYS.map((d) => (
            <div key={d.title} className="tl__day" style={{ "--c": `var(--${d.c})` } as React.CSSProperties} data-rv>
              <div className="tl__head">
                <h3>{d.title}</h3>

              </div>
              <ul className="slots hud">
                {d.slots.map(([time, label]) => (
                  <li key={time}>
                    <time>{time}</time>
                    <span>{label === "Master class" ? <a href="/masterclass">Master class : réserver sa place</a> : label}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
