import Image from "next/image";
import Logo from "./Logo";
import Social from "./Social";

export default function Footer({ base = "" }: { base?: string }) {
  return (
    <footer className="foot">
      <div className="wrap foot__row">
        <a className="brand" href={`${base}#top`}>
          <Logo />
          IA4EARTH
        </a>
        <span className="foot__logo">
          <Image
            src="/logo-salon.png"
            alt="Salon de l'économie verte, finance responsable et développement durable"
            width={629}
            height={174}
            sizes="200px"
          />
        </span>
        <p>3e édition du Salon de l&apos;économie verte, finance responsable et développement durable, 5–6 novembre 2026, Tunis. Organisé par Neo Influence.</p>
        <Social />
      </div>
    </footer>
  );
}
