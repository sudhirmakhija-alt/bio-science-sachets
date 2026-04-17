import { ScrollProvider } from "@/components/ScrollContext";
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
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

const Index = () => {
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

        {/* FAQ */}
        <FAQSection />

        {/* FOOTER */}
        <Footer />
      </main>
    </ScrollProvider>
  );
};

export default Index;
