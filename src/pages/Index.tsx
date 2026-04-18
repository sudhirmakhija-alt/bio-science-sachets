import { useEffect } from "react";
import { ScrollProvider } from "@/components/ScrollContext";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import MolecularNetwork from "@/components/MolecularNetwork";
import ScrollGradientOverlay from "@/components/ScrollGradientOverlay";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CredentialsMarquee from "@/components/CredentialsMarquee";
import OriginSection from "@/components/OriginSection";
import AboutSection from "@/components/AboutSection";
import WhyNutritionSection from "@/components/WhyNutritionSection";
import DifferentiatorSection from "@/components/DifferentiatorSection";
import ProductCatalog from "@/components/ProductCatalog";
import DosingCalculator from "@/components/DosingCalculator";
import ScienceGrid from "@/components/ScienceGrid";
import InsideEverySachet from "@/components/InsideEverySachet";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import JournalSection from "@/components/JournalSection";
import Footer from "@/components/Footer";

const Index = () => {
  useScrollReveal();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const id = hash.slice(1);
    const timer = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ScrollProvider>
      <MolecularNetwork />
      <ScrollGradientOverlay />
      <Navbar />
      <main className="relative z-[2]">
        {/* HERO */}
        <HeroSection />

        {/* CREDENTIALS MARQUEE */}
        <CredentialsMarquee />

        {/* ORIGIN — kept as-is */}
        <OriginSection />

        {/* ABOUT */}
        <AboutSection />

        {/* WHY TARGETED NUTRITION */}
        <WhyNutritionSection />

        {/* DIFFERENTIATOR */}
        <DifferentiatorSection />

        {/* PRODUCTS */}
        <ProductCatalog />

        {/* DOSING */}
        <DosingCalculator />

        {/* EVIDENCE & SAFETY */}
        <ScienceGrid />

        {/* INSIDE EVERY SACHET */}
        <InsideEverySachet />

        {/* TESTIMONIALS */}
        <TestimonialsSection />

        {/* FAQ */}
        <FAQSection />

        {/* JOURNAL */}
        <JournalSection />

        {/* FOOTER */}
        <Footer />
      </main>
    </ScrollProvider>
  );
};

export default Index;
