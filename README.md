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

## À compléter plus tard
- Horaires du programme : valeurs provisoires dans `src/lib/content.ts` (`DAYS`), à confirmer avec les organisateurs.
- Logos des partenaires (actuellement des noms en bandes défilantes), lien du règlement du Startup Challenge, parking et transports : volontairement non affichés pour le moment.
