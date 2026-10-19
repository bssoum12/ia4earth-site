# Site du salon IA4EARTH (3e édition) — passation vers le développement

## Objectif
Site officiel du Salon de l'économie verte, finance responsable et développement durable (IA4EARTH, 3e édition),
5–6 novembre 2026, Centre International des Congrès (UTICA), Tunis. Organisé par Neo Influence. Langue : français (accroche arabe : الابتكار من أجل عالم مستدام).

## Prototype validé
`ia4earth-prototype.html` : page unique autonome (HTML/CSS/JS, Three.js r128 depuis cdnjs). Il sert de référence visuelle et de contenu.
Les photos des membres sont intégrées en base64 : à extraire en fichiers (`/public/team/*.jpg`) dans la vraie version.

## Direction de design (décidée avec le client)
- Futuriste, couleurs vives, animations 3D, esprit IA, thème environnement durable.
- Hero : Terre 3D plein écran, continents en points verts, nuages, arcs « réseau IA », balayage lumineux, balise ambre pulsante sur Tunis (36,8065 N ; 10,1815 E), étiquette « Tunis » qui suit le point.
- Palette : fond #02130f, vert #4dff9a, turquoise #2de8d0, citron #c8ff5a, ambre #ffb938 (Tunis), rouge #ff3355 / #c4123a en accent ponctuel (coup de pinceau « 3e édition », mots clés des titres, urgence).
- Polices : Unbounded (titres), Sora (texte), Noto Kufi Arabic.
- Équité dans la section Organisation : cartes identiques pour tous, ordre de l'affiche officielle.
- `prefers-reduced-motion` respecté ; globe de repli si WebGL indisponible.

## Globe
Masque terre/mer : `land-mask-720x360.b64` (bitmask équirectangulaire, 1 bit/pixel, MSB d'abord, ligne 0 = nord, 43 200 caractères base64).
Généré depuis world-atlas land-110m (topojson). Dans le prototype, 40 000 points de Fibonacci sont testés contre ce masque.

## Contenu à compléter (marqué en jaune « à compléter » dans le prototype)
- Messages clés des panels 2, 3 et 4 (panel 1 est fourni)
- Horaires du programme des deux jours
- Logos des partenaires et liste à vérifier
- Lien vers le règlement du Startup Challenge
- Adresse exacte, parking, transports
- Modalités d'inscription

## Stack recommandée
Next.js 14 (App Router) + Tailwind + Three.js (react-three-fiber ou three direct, chargement différé du globe), déploiement Vercel.
Formulaire d'inscription : actuellement une maquette. À brancher sur Web3Forms/Formspree ou une route API + e-mail (Resend).
Contact public : contact@salondedeveloppementdurable.com — salondedeveloppementdurable.com — Facebook « Salon du developpement durable ».

## Prochaines tâches suggérées
1. Initialiser le projet Next.js et découper le prototype en composants (Hero/Globe, Nav, Panels, Programme, Concours, Organisation, Partenaires, Inscription, Footer).
2. Extraire les photos en fichiers optimisés (next/image) ; demander les originaux haute résolution.
3. Brancher le formulaire, ajouter le SEO (métadonnées, Open Graph, JSON-LD Event déjà présent), i18n FR/AR/EN si souhaité.
4. Tester mobile (400 px), performances du globe (réduire le nombre de points sur mobile), accessibilité (contrastes, focus).
