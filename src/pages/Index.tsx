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
import DiagnosticTool from "@/components/DiagnosticTool";
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

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 40; // ~4s at 100ms

    const tryScroll = () => {
      if (cancelled) return;
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        // Re-confirm after layout shifts (images, animations)
        setTimeout(() => {
          if (cancelled) return;
          const el2 = document.getElementById(id);
          if (el2) el2.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 600);
        return;
      }
      attempts += 1;
      if (attempts < maxAttempts) {
        setTimeout(tryScroll, 100);
      }
    };

    tryScroll();
    return () => {
      cancelled = true;
    };
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

        {/* DIAGNOSTIC / FORMULA FINDER + DOSING */}
        <DiagnosticTool />

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
