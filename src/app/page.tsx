import Effects from "@/components/Effects";
import StickyCta from "@/components/StickyCta";
import Concours from "@/components/Concours";
import Footer from "@/components/Footer";
import GlobeLoader from "@/components/globe/GlobeLoader";
import Hero from "@/components/Hero";
import Inscription from "@/components/Inscription";
import Nav from "@/components/Nav";
import Organisation from "@/components/Organisation";
import Panels from "@/components/Panels";
import Programme from "@/components/Programme";
import Salon from "@/components/Salon";

export default function Home() {
  return (
    <>
      <GlobeLoader />
      <Effects />
      <StickyCta />
      <div className="page">
        <a className="skip" href="#salon">Aller au contenu</a>
        <Nav />
        <Hero />
        <main>
          <Salon />
          <Panels />
          <Programme />
          <Concours />
          <Organisation />
          <Inscription />
        </main>
        <Footer />
      </div>
    </>
  );
}
