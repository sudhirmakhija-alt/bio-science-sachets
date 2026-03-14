import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import omegaPack from "@/assets/omega-pack.png";
import organPack from "@/assets/organ-pack.png";
import gutPack from "@/assets/gut-pack.png";

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Each pack gets unique scroll-driven transforms
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -260]);

  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, -8]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, 5]);
  const rotate3 = useTransform(scrollYProgress, [0, 1], [0, -12]);

  const scale1 = useTransform(scrollYProgress, [0, 0.5], [1, 0.92]);
  const scale2 = useTransform(scrollYProgress, [0, 0.5], [1, 0.88]);
  const scale3 = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center overflow-hidden">
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
            <span className="text-muted-foreground">Identified</span>
            <br />
            <span className="text-muted-foreground">Results.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-md leading-relaxed mb-10 font-light">
            Mathematically precise sachet dosing.
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

        {/* Right - Three product packs with scroll-driven parallax */}
        <div className="relative flex items-center justify-center min-h-[500px] lg:min-h-[600px]">
          {/* Omega - left, slightly back */}
          <motion.img
            src={omegaPack}
            alt="BioLogica Omega Balance+ packaging"
            className="absolute w-40 md:w-48 lg:w-56 z-10 drop-shadow-2xl"
            style={{
              y: y1,
              rotate: rotate1,
              scale: scale1,
              left: '5%',
              top: '15%',
            }}
            initial={{ opacity: 0, x: -60, y: 40 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Organ - center, foreground */}
          <motion.img
            src={organPack}
            alt="BioLogica Organ Balance+ packaging"
            className="relative w-48 md:w-56 lg:w-64 z-20 drop-shadow-2xl"
            style={{
              y: y2,
              rotate: rotate2,
              scale: scale2,
            }}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Gut - right, slightly back */}
          <motion.img
            src={gutPack}
            alt="BioLogica Gut Balance+ packaging"
            className="absolute w-40 md:w-48 lg:w-56 z-10 drop-shadow-2xl"
            style={{
              y: y3,
              rotate: rotate3,
              scale: scale3,
              right: '5%',
              top: '10%',
            }}
            initial={{ opacity: 0, x: 60, y: 40 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Subtle radial glow behind packs */}
          <div className="absolute inset-0 bg-gradient-radial from-omega/5 to-transparent rounded-full blur-3xl" />
        </div>
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
