export const SITE = {
  name: "IA4EARTH",
  url: "https://salondedeveloppementdurable.com",
  email: "contact@salondedeveloppementdurable.com",
  domain: "salondedeveloppementdurable.com",
  facebook: "https://www.facebook.com/salondudeveloppementdurable",
  instagram: "https://www.instagram.com/salondudeveloppement_durable/",
  linkedin:
    "https://www.linkedin.com/showcase/salon-de-l-%C3%A9conomie-verte-de-la-finance-responsable-et-du-d%C3%A9veloppement-durable/home/",
  phone: "29 362 252",
  phoneHref: "tel:+21629362252",
  start: "2026-11-05T00:00:00+01:00",
  end: "2026-11-07T00:00:00+01:00",
} as const;

export const NAV = [
  { href: "#salon", label: "Le salon" },
  { href: "#panels", label: "Panels" },
  { href: "#programme", label: "Programme" },
  { href: "/masterclass", label: "Master class" },
  { href: "#concours", label: "Concours" },
  { href: "#organisation", label: "Partenaires" },
];

export const PILLARS = [
  { c: "green", title: "Économie verte", text: "Filières, emplois et modèles d'affaires à faible empreinte carbone." },
  { c: "amber", title: "Finance responsable", text: "Des capitaux et des critères d'investissement tournés vers le long terme." },
  { c: "cyan", title: "Développement durable", text: "Politiques publiques et projets de terrain, de l'eau à l'agriculture." },
  { c: "violet", title: "Intelligence artificielle", text: "Des outils concrets, présentés sur place, pour mesurer et agir." },
];

export const PARTICIPANTS = [
  "Institutions publiques", "Organisations internationales", "Institutions financières", "Entreprises", "Investisseurs",
  "Startups", "Centres de recherche", "Universités", "Collectivités locales", "Société civile",
];

export const PANELS = [
  {
    n: 1, c: "cyan", title: "Données et souveraineté",
    q: "Construire les fondations d'une IA de confiance pour la transition écologique.",
    key: "Sans données fiables, représentatives, actualisées, interopérables et sécurisées, il ne peut y avoir d'IA de confiance ni d'impact durable.",
    more: {
      hook: "Pas d'intelligence artificielle performante sans données fiables, maîtrisées et responsables !",
      intro: [
        "Dans un monde où l'intelligence artificielle s'impose comme un levier majeur de transformation, la qualité, la représentativité, l'actualisation et le partage des données deviennent des enjeux stratégiques pour accélérer la transition écologique et renforcer la souveraineté numérique.",
      ],
      questions: [
        ["", "Comment garantir des données fiables et représentatives des réalités de nos territoires ?"],
        ["", "Quels mécanismes de gouvernance mettre en place pour concilier innovation, transparence, sécurité et partage des données ?"],
        ["", "Comment construire une intelligence artificielle de confiance, au service d'un développement durable et inclusif ?"],
      ],
      outro: "Un rendez-vous stratégique pour croiser les expertises, faire émerger des solutions concrètes et poser les bases d'une intelligence artificielle souveraine, éthique et au service de la planète.",
    },
    icons: [
      "M10 12a12 5 0 1 0 24 0a12 5 0 1 0-24 0z",
      "M10 12v10c0 2.8 5.4 5 12 5s12-2.2 12-5V12",
      "M10 22v10c0 2.8 5.4 5 12 5",
      "M30 30h12v10H30z",
      "M33 30v-3a3 3 0 0 1 6 0v3",
    ],
  },
  {
    n: 2, c: "green", title: "Eau, énergie et climat",
    q: "Quels cas d'usage de l'IA pour des infrastructures plus intelligentes et résilientes ?",
    key: "L'avenir durable se construit aujourd'hui : anticiper les risques, optimiser les ressources et innover grâce à l'IA.",
    more: {
      hook: "Et si l'intelligence artificielle devenait l'un de nos meilleurs alliés face aux défis climatiques ?",
      intro: [
        "Face au stress hydrique, à la pression croissante sur les ressources énergétiques et à l'intensification des risques climatiques, l'intelligence artificielle ouvre de nouvelles perspectives pour anticiper, optimiser et transformer la gestion de nos infrastructures essentielles.",
        "De la détection des fuites d'eau à l'optimisation de la consommation énergétique, en passant par la prévision des risques climatiques et la gestion intelligente des ressources, les applications de l'IA peuvent contribuer à bâtir des territoires plus durables, plus économes et mieux préparés aux défis de demain.",
      ],
      questions: [
        ["", "Comment l'IA peut-elle optimiser la gestion de l'eau et lutter contre le stress hydrique ?"],
        ["", "Comment améliorer l'efficacité énergétique grâce aux données et aux algorithmes intelligents ?"],
        ["", "Quels outils pour anticiper les risques climatiques et renforcer la résilience des infrastructures ?"],
        ["", "Comment transformer les innovations technologiques en solutions concrètes, accessibles et durables pour la Tunisie ?"],
      ],
      outro: "Des enjeux stratégiques qui réuniront les acteurs de l'innovation, de l'énergie, de l'environnement et du développement durable autour d'une ambition commune : mettre l'intelligence artificielle au service de la préservation des ressources et de la résilience de nos territoires.",
    },
    icons: ["M18 6c6 8 10 13 10 19a10 10 0 0 1-20 0c0-6 4-11 10-19z", "M36 20l-5 9h6l-5 9"],
  },
  {
    n: 3, c: "amber", title: "Produire autrement",
    q: "IA, agriculture durable et économie circulaire.",
    key: "Produire mieux. Valoriser davantage. Préserver nos ressources. L'intelligence artificielle au service d'une économie plus durable.",
    more: {
      hook: "Et si l'intelligence artificielle nous aidait à produire mieux, à consommer autrement et à préserver durablement nos ressources ?",
      intro: [
        "Face aux défis de la sécurité alimentaire, de la raréfaction des ressources naturelles et de la gestion des déchets, l'intelligence artificielle ouvre de nouvelles perspectives pour repenser nos modèles de production et accélérer la transition vers une économie plus durable et circulaire.",
        "De l'agriculture de précision à l'optimisation des ressources, en passant par la valorisation des déchets et le développement de chaînes de valeur responsables, l'IA représente un levier stratégique pour concilier performance économique, innovation technologique et préservation de l'environnement.",
      ],
      questions: [
        ["Agriculture intelligente", "comment l'IA peut-elle optimiser l'utilisation de l'eau, préserver les sols et améliorer les rendements agricoles ?"],
        ["Souveraineté alimentaire", "comment les technologies intelligentes peuvent-elles renforcer la résilience de notre système agricole et alimentaire ?"],
        ["Économie circulaire", "comment exploiter les données et l'IA pour réduire les déchets, favoriser le recyclage et transformer les ressources inutilisées en nouvelles opportunités économiques ?"],
        ["Innovation et compétitivité", "comment accompagner les entreprises, les agriculteurs et les startups dans l'adoption de solutions intelligentes, accessibles et durables ?"],
      ],
      outro: "Ce panel ambitionne de croiser les expertises scientifiques, économiques et technologiques afin de faire émerger des pistes d'action concrètes pour une agriculture plus résiliente et une économie circulaire créatrice de valeur.",
    },
    icons: ["M24 40V22", "M24 24c0-7-5-11-12-11 0 7 5 11 12 11z", "M24 28c0-6 4-10 11-10 0 6-4 10-11 10z"],
  },
  {
    n: 4, c: "violet", title: "De l'innovation à l'impact",
    q: "Financer, valoriser et déployer l'IA durable à grande échelle.",
    key: "L'innovation ne prend toute sa valeur que lorsqu'elle se transforme en impact. Financer aujourd'hui l'IA durable, c'est investir dans l'économie de demain.",
    more: {
      hook: "Comment transformer le potentiel de l'intelligence artificielle en solutions concrètes, financées et capables de changer durablement notre économie ?",
      intro: [
        "L'intelligence artificielle ouvre des perspectives inédites pour accélérer la transition écologique. Mais entre la recherche scientifique, l'innovation technologique et le déploiement à grande échelle, un défi majeur demeure : mobiliser les financements, valoriser les talents et construire des modèles économiques durables.",
        "Dans un contexte où les exigences ESG, la finance responsable et la transformation numérique redéfinissent les stratégies des entreprises et des investisseurs, ce quatrième panel propose d'explorer les leviers permettant de faire de l'IA durable un véritable moteur de croissance, de compétitivité et d'impact environnemental.",
      ],
      questions: [
        ["Recherche et innovation", "comment transformer les avancées scientifiques en solutions concrètes, utiles et adaptées aux besoins du marché ?"],
        ["Financement et investissement", "quels mécanismes financiers mobiliser pour soutenir les startups, les projets innovants et les entreprises engagées dans l'IA durable ?"],
        ["Talents et compétences", "comment développer les expertises nécessaires et renforcer les synergies entre universités, centres de recherche, entreprises et investisseurs ?"],
        ["ESG et création de valeur", "comment mesurer l'impact environnemental, social et économique des solutions d'intelligence artificielle ?"],
        ["Passage à l'échelle", "quelles conditions réunir pour déployer des innovations durables, pérennes, reproductibles et accessibles au plus grand nombre ?"],
      ],
      outro: "Ce panel réunira les regards des acteurs de la finance, de l'investissement, de la recherche, de l'entrepreneuriat et de l'innovation autour d'une ambition commune : faire converger capital, intelligence et responsabilité pour accélérer la transition vers une économie durable.",
    },
    icons: ["M8 40h32", "M10 28h6v12h-6z", "M21 20h6v20h-6z", "M32 10h6v30h-6z"],
  },
];

export const THEMES: [string, string][] = [
  ["L'IA pour le climat et l'environnement", "ODD 13"],
  ["Optimiser les ressources naturelles", "ODD 12 et 15"],
  ["Gestion intelligente de l'eau", "ODD 6"],
  ["Transition énergétique", "ODD 7"],
  ["Agriculture de précision", "ODD 2"],
  ["Économie circulaire et déchets", "ODD 12"],
  ["Écosystèmes d'innovation", "ODD 9 et 17"],
];

export const FORMATS = [
  "Conférences", "Tables rondes", "Ateliers thématiques", "Rencontres B2B", "Exposition de solutions innovantes",
  "Démonstrations technologiques", "Présentations de startups", "Remise de prix aux initiatives vertes",
];

export const DAYS = [
  {
    c: "cyan", title: "Jeudi 5 novembre",
    slots: [
      ["09:00", "Séance d'ouverture officielle"],
      ["10:00", "Conférence inaugurale, panel 1 : Données et souveraineté"],
      ["12:00", "Master class"],
      ["14:00", "Conférence 2, panel 2 : Eau, énergie et climat"],
    ],
  },
  {
    c: "green", title: "Vendredi 6 novembre",
    slots: [
      ["10:00", "Panel 3 : Produire autrement"],
      ["12:00", "Master class"],
      ["14:00", "Conférence de clôture, panel 4 : De l'innovation à l'impact"],
      ["17:00", "Séance de clôture officielle"],
    ],
  },
];

export const CHALLENGE_STEPS = [
  { date: "2026-09-15", when: "Mi-septembre", what: "Ouverture des candidatures" },
  { date: "2026-10-15", when: "15 octobre", what: "Clôture des candidatures" },
  { date: "2026-10-28", when: "28 octobre", what: "Annonce des finalistes" },
  { date: "2026-11-06", when: "5 et 6 novembre", what: "Finale pendant le salon" },
];

export const CHALLENGE_CATS = [
  { c: "green", title: "Idée / Projet", text: "Une grille d'évaluation dédiée, notée sur 100 points, pour présenter une idée ou un projet en construction." },
  { c: "violet", title: "Startup", text: "Une grille d'évaluation dédiée, notée sur 100 points, pour présenter une entreprise lancée et sa solution." },
];

// Ordre de l'affiche officielle : ne pas réordonner.
export const TEAM = [
  { slug: "jihene-el-ouakdi", name: "Jihene El Ouakdi", role: "Marraine de l'évènement", bio: "Directrice de l'École Supérieure de l'Économie Numérique" },
  { slug: "samiha-selmani", name: "Samiha Selmani", role: "Commissaire générale", bio: "PDG de Sodino SICAR" },
  { slug: "mouna-marrakchi-sallemi", name: "Mouna Marrakchi Sallemi", role: "Commissaire générale adjointe", bio: "Directrice de l'Institut Supérieur des Sciences Biologiques Appliquées de Tunis (ISSBAT)" },
  { slug: "moneim-taieb", name: "Moneim Taieb", role: "Commissaire général adjoint", bio: "Expert-comptable, président de l'Association des Jeunes Experts-comptables en Tunisie" },
  { slug: "bassem-thabti", name: "Bassem Thabti", role: "Commissaire général adjoint", bio: "CEO de Virtual Dev, expert en transformation digitale et digitalisation des processus métiers" },
  { slug: "nadia-mansour", name: "Nadia Mansour", role: "Cheffe du pôle relations avec les instances universitaires", bio: "Docteure en Finance, professeure à l'Université de Sousse et chercheuse invitée à l'Université de Salamanque (Espagne)" },
  { slug: "anissa-maraoui", name: "Anissa Maraoui", role: "Cheffe du pôle Suivi", bio: "CEO de MA Clinic Médical, médecin spécialiste en médecine esthétique et morphologique, membre du BD de la STM" },
  { slug: "hana-soltani", name: "Hana Soltani", role: "Cheffe du pôle relations avec les médias", bio: "Senior Journalist, Producer Radio & TV" },
  { slug: "adel-trabelsi", name: "Adel Trabelsi", role: "Chef du pôle Développement & Promotion", bio: "Senior Marketing & Communication Specialist" },
  { slug: "razi-miliani", name: "Razi Miliani", role: "Ambassadeur de la 3e édition", bio: "Figure engagée de l'écosystème de l'Intelligence Artificielle en Tunisie" },
];

// Source : page « Sponsors et partenaires » du Programme Officiel (ordre et regroupement du document).
export const PARTNER_TIERS = [
  { id: "sponsors", c: "amber", label: "Sponsors" },
  { id: "officiels", c: "cyan", label: "Partenaires officiels" },
  { id: "medias", c: "magenta", label: "Partenaires médias" },
] as const;

export const PARTNERS: { tier: (typeof PARTNER_TIERS)[number]["id"]; name: string; logo: string }[] = [
  { tier: "sponsors", name: "UGFS North Africa", logo: "ugfs-north-africa" },
  { tier: "sponsors", name: "Nety", logo: "nety" },
  { tier: "sponsors", name: "BTS Bank", logo: "bts-bank" },
  { tier: "sponsors", name: "Autohall", logo: "autohall" },
  { tier: "officiels", name: "RCH International", logo: "rch-international" },
  { tier: "officiels", name: "UN-Habitat", logo: "un-habitat" },
  { tier: "officiels", name: "ESEN, École Supérieure de l'Économie Numérique", logo: "esen" },
  { tier: "officiels", name: "ISSBAT", logo: "issbat" },
  { tier: "officiels", name: "ESSECT", logo: "essect" },
  { tier: "officiels", name: "IHEC Sousse", logo: "ihec-sousse" },
  { tier: "officiels", name: "Université de la Manouba", logo: "universite-manouba" },
  { tier: "officiels", name: "IRESA", logo: "iresa" },
  { tier: "officiels", name: "ISAMM", logo: "isamm" },
  { tier: "officiels", name: "ESC Tunis", logo: "esc-tunis" },
  { tier: "officiels", name: "PEEUT, Pôle Étudiant Entrepreneur de l'Université de Tunis", logo: "peeut" },
  { tier: "officiels", name: "Chaire UNESCO, Université de la Manouba", logo: "unesco-chair-manouba" },
  { tier: "officiels", name: "FSEGT", logo: "fsegt" },
  { tier: "officiels", name: "ISG Tunis", logo: "isg-tunis" },
  { tier: "officiels", name: "Inceptum", logo: "inceptum" },
  { tier: "officiels", name: "Virtual Dev", logo: "virtual-dev" },
  { tier: "officiels", name: "INRGREF", logo: "inrgref" },
  { tier: "officiels", name: "Ayadi & Attia Law Firm", logo: "ayadi-attia" },
  { tier: "officiels", name: "flowup", logo: "flowup" },
  { tier: "officiels", name: "INAT", logo: "inat" },
  { tier: "officiels", name: "IDC Innovative Display Concept", logo: "idc" },
  { tier: "officiels", name: "Click2Read", logo: "click2read" },
  { tier: "officiels", name: "MIP Imprimerie", logo: "mip-imprimerie" },
  { tier: "officiels", name: "IRSET", logo: "irset" },
  { tier: "medias", name: "Le Point TN", logo: "le-point-tn" },
  { tier: "medias", name: "Télévision Tunisienne", logo: "television-tunisienne" },
  { tier: "medias", name: "Business Talk", logo: "business-talk" },
  { tier: "medias", name: "L'Expert", logo: "l-expert" },
  { tier: "medias", name: "ilB", logo: "ilb" },
];

export const PROFILES = ["Visiteur", "Exposant", "Startup", "Presse"];

type Person = [name: string, role: string];

// Source : « Programme Officiel du Salon », 5 et 6 novembre 2026.
export const SPEAKERS: Record<number, { keynote?: Person; moderator: Person; panelists: Person[] }> = {
  1: {
    moderator: ["Me Fatma Attia", "Avocate associée, Ayadi & Attia Law Firm"],
    panelists: [
      ["Dr Oumaima Laifa", "CEO d'Euklydia France"],
      ["Samiha Chaabani", "Experte senior en stratégie data et IA"],
      ["Amine Chouaib", "Entrepreneur innovateur, PDG de Chifco Group"],
      ["Hatem Mliki", "Expert en développement économique et gouvernance"],
      ["Pr Najiba Mrabet Bellaaj", "Institut Supérieur d'Informatique, responsable qualité, coordinatrice PAQ DGSE RISE-ISI"],
    ],
  },
  2: {
    keynote: ["Dr Aida Robbana", "Cheffe de bureau, ONU-Habitat Tunisie"],
    moderator: ["Dr Nadia Mansour", "Professeure à l'Université de Sousse, chercheuse invitée à l'Université de Salamanque (Espagne)"],
    panelists: [
      ["Dr Alix Willemez", "Experte en gouvernance climatique"],
      ["Anis Oueslati", "Directeur général d'Auto Hall"],
      ["Mohamed Hayouni", "Maître de conférences à l'ISI Kef"],
      ["Saloua Languar", "Présidente de l'Institut de Responsabilité Sociétale des Entreprises en Tunisie (IRSET)"],
      ["Nadia Abeoub", "Directrice de l'ESCT"],
      ["Zeineb Kassouk", "Maître-assistante à l'INAT"],
    ],
  },
  3: {
    moderator: ["Pr Ahmed Snoussi", "Directeur général de l'École Supérieure des Industries Alimentaires de Tunis"],
    panelists: [
      ["Pr Mehdi Ben Mimoun", "Professeur à l'INAT"],
      ["Pr Faten Khamessi", "Professeure à l'INAT"],
      ["Asma Omri", "CEO et cofondatrice d'ARUMA"],
      ["Dr Bilel Marzouki", "Maître assistant, École Nationale des Sciences de l'Informatique (ENSI)"],
      ["Yasser Bououd", "Fondateur d'EZZAYRA"],
    ],
  },
  4: {
    moderator: ["Mohamed Agrebi", "Ancien ministre, consultant en investissement"],
    panelists: [
      ["Ahmed Karam", "Président du conseil d'administration de TLF"],
      ["Mohamed Salah Fard", "DG d'UGFS North Africa"],
      ["Hedia Mraihi", "Experte senior en finance durable, associée et directrice du conseil ESG chez Grant Thornton"],
      ["Pr Olfa Kammoun", "Maître de conférences, experte en innovation et entrepreneuriat"],
      ["Moneim Taieb", "Expert-comptable, président de l'AJECT"],
    ],
  },
};

/* Master class : source « Planning des masterclasses » (5 et 6 novembre 2026, 12h à 13h30). */
export const MASTERCLASS_CAPACITY = 20;
export const MASTERCLASS_TIME = "12h à 13h30";

export const MASTERCLASS_DAYS = [
  { day: 1, label: "Jeudi 5 novembre 2026", c: "cyan" },
  { day: 2, label: "Vendredi 6 novembre 2026", c: "green" },
] as const;

export const MASTERCLASSES = [
  { id: "j1-fondamentaux-ia", day: 1, title: "Les Fondamentaux IA", trainer: "Maram Yakoubi", org: "RCH International", logo: "rch-international" },
  { id: "j1-automatisation-agents-ia", day: 1, title: "Automatisation & agents IA", trainer: "Ahmed Oueslati", org: "RCH International", logo: "rch-international" },
  { id: "j1-prompt-engineering", day: 1, title: "Prompt engineering", trainer: "Atef Toumi", org: "RCH International", logo: "rch-international" },
  { id: "j2-finance-islamique", day: 2, title: "Finance islamique", trainer: "Mohamed Salah Frad", org: "UGFS North Africa", logo: "ugfs-north-africa" },
  { id: "j2-ia-et-ethiques", day: 2, title: "IA et éthiques", trainer: "Fatma Attia", org: "Ayadi & Attia Law Firm", logo: "ayadi-attia" },
  { id: "j2-entreprise-intelligente", day: 2, title: "De l'entreprise digitale à l'entreprise intelligente", trainer: "Bassem Thabti", org: "Virtual Dev", logo: "virtual-dev" },
  { id: "j2-ia-business-donnees", day: 2, title: "IA pour le business & l'analyse des données", trainer: "Maram Yakoubi", org: "RCH International", logo: "rch-international" },
  { id: "j2-ia-productivite", day: 2, title: "IA pour la productivité", trainer: "Yesmine Khlifa", org: "RCH International", logo: "rch-international" },
  { id: "j2-creation-contenu-ia", day: 2, title: "Création de contenu IA", trainer: "Atef Toumi", org: "RCH International", logo: "rch-international" },
] as const;
