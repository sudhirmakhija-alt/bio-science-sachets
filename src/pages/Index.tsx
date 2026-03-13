import { ScrollProvider } from "@/components/ScrollContext";
import BioBackground from "@/components/BioBackground";
import ScrollGradientOverlay from "@/components/ScrollGradientOverlay";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import XRaySection from "@/components/XRaySection";
import OriginSection from "@/components/OriginSection";
import DosingCalculator from "@/components/DosingCalculator";
import ScienceGrid from "@/components/ScienceGrid";
import ProductCatalog from "@/components/ProductCatalog";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <ScrollProvider>
      <BioBackground />
      <ScrollGradientOverlay />
      <Navbar />
      <main className="relative z-[2]">
        <HeroSection />
        <XRaySection />
        <OriginSection />
        <DosingCalculator />
        <ScienceGrid />
        <ProductCatalog />
        <Footer />
      </main>
    </ScrollProvider>
  );
};

export default Index;
