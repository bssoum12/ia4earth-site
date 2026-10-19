import { SITE } from "@/lib/content";

// Pictogrammes au trait (style Feather)
const ICONS = {
  Instagram: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <path d="M17.5 6.5h.01" />
    </>
  ),
  LinkedIn: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
  Facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
};

const LINKS: { name: keyof typeof ICONS; href: string }[] = [
  { name: "Instagram", href: SITE.instagram },
  { name: "LinkedIn", href: SITE.linkedin },
  { name: "Facebook", href: SITE.facebook },
];

/** Liens vers les réseaux sociaux du salon. */
export default function Social() {
  return (
    <ul className="social" aria-label="Réseaux sociaux">
      {LINKS.map((l) => (
        <li key={l.name}>
          <a href={l.href} target="_blank" rel="noopener" aria-label={`${l.name} du salon`} title={l.name}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {ICONS[l.name]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
