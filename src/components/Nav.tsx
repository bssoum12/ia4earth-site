import { NAV } from "@/lib/content";
import Logo from "./Logo";

/** `base` : "/" quand la barre est affichée hors de la page d'accueil (les ancres pointent alors vers l'accueil). */
export default function Nav({ base = "" }: { base?: string }) {
  return (
    <header className="nav">
      <div className="wrap nav__in">
        <a className="brand" href={`${base}#top`}>
          <Logo />
          IA4EARTH
        </a>
        <nav aria-label="Navigation principale">
          <ul>
            {NAV.map((l) => (
              <li key={l.href}>
                <a href={l.href.startsWith("#") ? `${base}${l.href}` : l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <a className="btn btn--glow btn--sm" href={`${base}#inscription`}>S&apos;inscrire</a>
      </div>
    </header>
  );
}
