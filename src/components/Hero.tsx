import Countdown from "./Countdown";

const WORD = "IA4EARTH";
const FROM = [45, 232, 208]; // turquoise
const MID = [109, 255, 138]; // vert
const TO = [212, 255, 94]; // citron

/** Couleur de chaque lettre sur le dégradé turquoise → vert → citron. */
function letterColor(i: number, n: number) {
  const t = i / (n - 1);
  const [a, b, u] = t < 0.55 ? [FROM, MID, t / 0.55] : [MID, TO, (t - 0.55) / 0.45];
  const c = a.map((v, k) => Math.round(v + (b[k] - v) * u));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

const d = (n: number) => ({ "--d": n }) as React.CSSProperties;

export default function Hero() {
  return (
    <section className="hero" id="top">
      {/* Zone de glisser : fait tourner le globe (derrière le texte) */}
      <div className="globe-drag" id="globe-drag" aria-hidden="true" />
      <div className="wrap hero__in">
        <div className="hero__col">
          <p className="official" style={d(0)}>
            <span className="brush">3e édition</span> du Salon de l&apos;économie verte, finance responsable et développement durable
          </p>
          <h1 className="mark" style={d(1)}>
            <span aria-hidden="true">
              {WORD.split("").map((ch, i) => (
                <span
                  key={i}
                  className="ltr"
                  style={{ color: letterColor(i, WORD.length), "--i": i } as React.CSSProperties}
                >
                  {ch}
                </span>
              ))}
            </span>
            <span className="sr">IA4EARTH, 3e édition</span>
          </h1>
          <p className="tag" style={d(4)}>Innover pour un <span className="red">monde durable</span></p>
          <p className="eco" style={d(5)}>Une planète vivante, éclairée par l&apos;IA</p>
          <p className="tag-ar" lang="ar" dir="rtl" style={d(6)}>الابتكار من أجل عالم مستدام</p>

          <div className="facts" style={d(7)}>
            <p className="date">5–6 novembre 2026</p>
            <p className="place">Centre International des Congrès, siège de l&apos;UTICA, Tunis</p>
            <Countdown />
          </div>

          <div className="cta" style={d(8)}>
            <a className="btn btn--glow" href="#inscription">Réserver ma place</a>
            <a className="btn btn--ghost" href="#panels">Découvrir les panels</a>
          </div>
        </div>
      </div>
    </section>
  );
}
