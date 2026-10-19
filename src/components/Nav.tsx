import { NAV } from "@/lib/content";
import Logo from "./Logo";

export default function Nav() {
  return (
    <header className="nav">
      <div className="wrap nav__in">
        <a className="brand" href="#top">
          <Logo />
          IA4EARTH
        </a>
        <nav aria-label="Navigation principale">
          <ul>
            {NAV.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <a className="btn btn--glow btn--sm" href="#inscription">S&apos;inscrire</a>
      </div>
    </header>
  );
}
