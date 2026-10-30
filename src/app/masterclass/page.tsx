import type { Metadata } from "next";
import Footer from "@/components/Footer";
import MasterclassList from "@/components/MasterclassList";
import Nav from "@/components/Nav";
import { MASTERCLASS_CAPACITY } from "@/lib/content";
import { masterclass } from "@/lib/masterclass";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Master class | IA4EARTH, 5–6 novembre 2026, Tunis",
  description:
    "Neuf master class sur l'intelligence artificielle, la finance et l'entreprise, les 5 et 6 novembre 2026 de 12h à 13h30. 20 places par master class : inscrivez-vous en ligne.",
  alternates: { canonical: "/masterclass" },
};

export default async function MasterclassPage() {
  // Si le stockage est indisponible, la page reste affichée : l'inscription indiquera l'erreur.
  const counts = await masterclass.counts().catch((e) => {
    console.error("[masterclass] page", e);
    return null;
  });

  return (
    <div className="page">
      <a className="skip" href="#masterclass">Aller au contenu</a>
      <Nav base="/" />
      <main className="sec sec--deep mc" id="masterclass">
        <div className="wrap">
          <div className="head">
            <h1>Les <span className="red">master class</span></h1>
            <div className="lede">
              <p>Des ateliers pratiques de 1h30, animés par des experts, les deux jours du salon. Chaque master class est limitée à {MASTERCLASS_CAPACITY} participants : l&apos;inscription se ferme automatiquement quand les places sont prises.</p>
              <ul className="chips access">
                <li><span>12h à 13h30</span></li>
                <li><span>{MASTERCLASS_CAPACITY} places par master class</span></li>
                <li><span>Une master class par jour et par personne</span></li>
              </ul>
              <p className="note">Les master class d&apos;une même journée ont lieu en parallèle, au même horaire : vous pouvez en suivre une par jour. L&apos;entrée au salon reste soumise à l&apos;<a href="/#inscription">inscription au salon</a>.</p>
            </div>
          </div>
          <MasterclassList initialCounts={counts} capacity={MASTERCLASS_CAPACITY} />
        </div>
      </main>
      <Footer base="/" />
    </div>
  );
}
