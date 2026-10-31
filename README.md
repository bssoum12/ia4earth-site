# IA4EARTH — site du salon (Next.js 14)

Découpage du prototype `ia4earth-prototype.html` (conservé comme référence) en projet Next.js 14 (App Router) + Tailwind + Three.js r128.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Structure
- `src/app/` : `layout.tsx` (polices, métadonnées, Open Graph, JSON-LD Event), `page.tsx`, `globals.css` (CSS du prototype), `api/register/route.ts` (inscription).
- `src/components/` : Nav, Hero (+ Countdown), Salon, Panels, Programme, Concours, Organisation, Inscription, Footer.
- `src/components/globe/` : `GlobeLoader` (import différé, globe de repli si WebGL indisponible), `Globe` (scène Three.js), `shaders.ts`, `landMask.ts`.
- `src/lib/content.ts` : tout le contenu (textes, équipe dans l'ordre de l'affiche, partenaires).
- `public/team/*.jpg` : photos extraites du prototype (à remplacer par les originaux haute résolution).

## Formulaire
`POST /api/register` envoie un e-mail via Resend. Copier `.env.example` vers `.env.local` et renseigner `RESEND_API_KEY`, `REGISTRATION_TO_EMAIL`, `REGISTRATION_FROM_EMAIL` (domaine vérifié chez Resend). Sans ces variables, la route répond 503 avec un message invitant à écrire à l'adresse de contact.

## Administration (/admin)
Liste des participants (inscriptions du site + saisie manuelle), recherche, filtre par catégorie, export CSV et impression des badges (un ou plusieurs, ou tous les non imprimés).
- **Accès** : `ADMIN_PASSWORD` et `ADMIN_SESSION_SECRET` (16 caractères minimum) dans `.env.local` ou les variables Vercel. Session par cookie signé, 12 h.
- **Stockage** : en production, Supabase (exécuter `supabase/schema.sql`, puis définir `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY`). Sans ces variables, un fichier local `.data/participants.json` est utilisé : développement uniquement (le disque Vercel est éphémère).
- **Badge** : maquette provisoire (90 × 130 mm) dans `src/components/admin/BadgeCard.tsx` ; la taille d'impression est dans `@page` de `src/app/admin/admin.css`. À remplacer avec la maquette définitive.

## Programme PDF
Le programme officiel est servi depuis `public/programme-officiel-ia4earth-2026.pdf` (constante `PROGRAMME_PDF` dans `src/lib/content.ts`). Un bouton de téléchargement apparaît après une inscription (salon ou master class), et le lien figure dans les e-mails de confirmation (`src/lib/salonMail.ts`, `src/lib/masterclassMail.ts`, envoi via `src/lib/mail.ts`). Pour mettre à jour le programme, remplacer le fichier PDF en gardant le même nom.

## Master class (/masterclass)
Neuf master class (3 le jeudi, 6 le vendredi, 12h à 13h30) définies dans `MASTERCLASSES` (`src/lib/content.ts`). Inscription en ligne par master class via `POST /api/masterclass` : **20 places maximum** (`MASTERCLASS_CAPACITY`), le bouton passe sur « Complet » et l'API refuse (409) dès que la limite est atteinte. Une personne (e-mail) ne peut s'inscrire qu'à une master class par jour, car elles ont lieu en parallèle.
- **Stockage** : même règle que les participants. En production, exécuter la partie « Master class » de `supabase/schema.sql` (table et fonction `register_masterclass`, qui verrouille et compte de façon atomique) ; en développement, fichier `.data/masterclass.json`.
- **E-mail de confirmation** : envoyé à l'inscrit via Resend (`src/lib/masterclassMail.ts`) avec `RESEND_API_KEY` et `REGISTRATION_FROM_EMAIL` (domaine vérifié chez Resend). Sans ces variables, l'inscription est quand même enregistrée, sans e-mail.
- **Administration** : `/admin/masterclass` liste les inscrits par master class (lien depuis `/admin`).

## À compléter plus tard
- Horaires du programme : issus du « Programme Officiel » PDF (`DAYS` dans `src/lib/content.ts`). Sujets des master classes et intervenants des panels non repris.
- Logos des partenaires (actuellement des noms en bandes défilantes), lien du règlement du Startup Challenge, parking et transports : volontairement non affichés pour le moment.
