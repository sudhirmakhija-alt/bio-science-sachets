import { motion } from "framer-motion";
import heroPackaging from "@/assets/hero-packaging.png";
import sachetSingle from "@/assets/sachet-single.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      <div className="section-padding w-full max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left - Copy */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-border rounded-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-gut" />
            <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              Veterinary-Grade Nutrition
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[0.92] tracking-[-0.04em] text-foreground mb-6">
            Precision
            <br />
            Science.
            <br />
            <span className="text-muted-foreground">Measured</span>
            <br />
            <span className="text-muted-foreground">Results.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-md leading-relaxed mb-10 font-light">
            The first sachet-dosed veterinary nutrition system for dogs.
            No oxidation. No blind dosing.
          </p>

          <div className="flex gap-4">
            <a
              href="#products"
              className="inline-flex items-center justify-center px-8 py-4 bg-foreground text-background font-semibold text-sm tracking-wide hover:opacity-90 transition-opacity"
            >
              EXPLORE PRODUCTS
            </a>
            <a
              href="#science"
              className="inline-flex items-center justify-center px-8 py-4 border border-foreground text-foreground font-semibold text-sm tracking-wide hover:bg-foreground hover:text-background transition-colors"
            >
              THE SCIENCE
            </a>
          </div>
        </motion.div>

        {/* Right - 3D Parallax Product */}
        <motion.div
          className="relative flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Main packaging */}
          <motion.img
            src={heroPackaging}
            alt="BioLogica 30-sachet veterinary nutrition box with individual precision sachets"
            className="w-full max-w-lg animate-float relative z-10"
            style={{ filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.12))' }}
          />

          {/* Floating sachet accents */}
          <motion.img
            src={sachetSingle}
            alt=""
            className="absolute top-8 right-4 w-20 animate-float-slow opacity-60"
            style={{ animationDelay: '1s' }}
          />
          <motion.img
            src={sachetSingle}
            alt=""
            className="absolute bottom-16 left-4 w-16 animate-float-slow opacity-40"
            style={{ animationDelay: '2.5s', transform: 'rotate(-15deg)' }}
          />

          {/* Subtle radial glow */}
          <div className="absolute inset-0 bg-gradient-radial from-omega/5 to-transparent rounded-full blur-3xl" />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Scroll</span>
        <div className="w-px h-8 bg-border" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
