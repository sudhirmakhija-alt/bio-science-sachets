import { motion, useScroll, useTransform } from "framer-motion";
import { ShieldCheck, Factory, Sun } from "lucide-react";
import { useRef } from "react";
import organBalance from "@/assets/organ-balance-new.png";
import gutBalance from "@/assets/gut-balance-new.png";
import omegaBalance from "@/assets/omega-balance-new.png";
import MolecularRing from "@/components/MolecularRing";

const badges = [
  { icon: ShieldCheck, label: "Vet-formulated" },
  { icon: Factory, label: "WHO-GMP+ & FAMI-QS facilities" },
  { icon: Sun, label: "Designed for Indian diets & climate" },
];

const heroProducts = [
  { src: organBalance, alt: "Organ Balance+", xOffset: "-55%", rotate: -8, scale: 0.75, zIndex: 1, shadow: "drop-shadow(0 12px 24px rgba(232,130,154,0.35))" },
  { src: gutBalance, alt: "Gut Balance+", xOffset: "0%", rotate: 0, scale: 1, zIndex: 3, shadow: "drop-shadow(0 12px 24px rgba(93,184,122,0.35))" },
  { src: omegaBalance, alt: "Omega Balance+", xOffset: "55%", rotate: 8, scale: 0.75, zIndex: 1, shadow: "drop-shadow(0 12px 24px rgba(106,174,214,0.35))" },
];

const products = [
  { src: organBalance, alt: "Organ Balance+ packaging", delay: 0, ringColor: "#f2c4b8", ringSpeed: 0.3 },
  { src: gutBalance, alt: "Gut Balance+ packaging", delay: 0.15, ringColor: "#b8e8c0", ringSpeed: 0.22 },
  { src: omegaBalance, alt: "Omega Balance+ packaging", delay: 0.3, ringColor: "#b8d4f2", ringSpeed: 0.26 },
];

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const y0 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const rotate0 = useTransform(scrollYProgress, [0, 1], [0, -4]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 3]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -3]);
  const scale0 = useTransform(scrollYProgress, [0.3, 0.7], [1, 1.4]);
  const scale1 = useTransform(scrollYProgress, [0.3, 0.7], [1, 1.5]);
  const scale2 = useTransform(scrollYProgress, [0.3, 0.7], [1, 1.3]);
  const yValues = [y0, y1, y2];
  const rotateValues = [rotate0, rotate1, rotate2];
  const scaleValues = [scale0, scale1, scale2];

  return (
    <section ref={sectionRef} className="relative flex flex-col items-center overflow-visible pb-0" style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(255,182,193,0.12) 0%, transparent 55%), radial-gradient(ellipse at 70% 40%, rgba(144,238,144,0.10) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(173,216,230,0.12) 0%, transparent 45%), linear-gradient(160deg, rgba(250,251,255,0.42) 0%, rgba(244,247,244,0.42) 100%)' }}>
      <div className="section-padding w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left - Copy */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-border rounded-sm mb-8 mt-6 md:mt-0">
            <span className="w-2 h-2 rounded-full bg-gut" />
            <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              Vet-formulated daily toppers for Indian dogs
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[0.95] tracking-[-0.04em] text-foreground mb-6">
            Clinical-grade
            <br />
            daily nutrition
            <br />
            <span className="text-muted-foreground">support for</span>
            <br />
            <span className="text-muted-foreground">Indian dogs.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-md leading-relaxed mb-6 font-light">
            Vet-formulated toppers that support joints, digestion, immunity, skin & coat and overall vitality in dogs living in Indian homes and climates.
          </p>

          {/* Trust line */}
          <p className="text-xs text-muted-foreground/70 max-w-md leading-relaxed mb-10">
            Developed by veterinarians and animal nutrition experts, referencing AAFCO and FEDIAF dog nutrition guidelines and manufactured in WHO-GMP+ and FAMI-QS certified facilities.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-10">
            <a
              href="https://amazon.in/biologica"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-foreground text-background font-semibold text-sm tracking-wide hover:opacity-90 transition-opacity"
            >
              SHOP ON AMAZON INDIA
            </a>
            <a
              href="#science"
              className="inline-flex items-center justify-center px-8 py-4 border border-foreground text-foreground font-semibold text-sm tracking-wide hover:bg-foreground hover:text-background transition-colors"
            >
              HOW BIOLOGICA HELPS YOUR DOG
            </a>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-3">
            {badges.map((badge) => (
              <div
                key={badge.label}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-sm"
              >
                <badge.icon className="w-3.5 h-3.5 text-gut" />
                <span className="text-xs font-medium text-muted-foreground">{badge.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right - Stacked fan of 3 canisters */}
        <div className="relative flex items-center justify-center min-h-[400px] lg:min-h-[500px]">
          {heroProducts.map((product, i) => (
            <motion.div
              key={product.alt}
              className="absolute"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              style={{
                zIndex: product.zIndex,
                transform: `translateX(${product.xOffset}) rotate(${product.rotate}deg) scale(${product.scale})`,
              }}
            >
              <img
                src={product.src}
                alt={product.alt}
                className="w-44 md:w-56 lg:w-64 object-contain"
                style={{
                  filter: product.shadow,
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Full-width 3-product section below */}
      <div className="w-full flex items-center justify-center mt-8 pb-8" style={{ background: 'radial-gradient(ellipse at 20% 60%, rgba(255,182,193,0.15) 0%, transparent 40%), radial-gradient(ellipse at 50% 50%, rgba(144,238,144,0.12) 0%, transparent 40%), radial-gradient(ellipse at 80% 60%, rgba(173,216,230,0.15) 0%, transparent 40%)' }}>
        <div className="relative flex items-end justify-center -space-x-6 lg:-space-x-10">
          {products.map((product, i) => (
            <motion.div
              key={product.alt}
              className="relative"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 + product.delay, ease: [0.16, 1, 0.3, 1] }}
              style={{ y: yValues[i], rotate: rotateValues[i], scale: scaleValues[i] }}
            >
              <div className="relative flex items-center justify-center">
                <MolecularRing color={product.ringColor} size={320} speed={product.ringSpeed} nodeCount={6} />
                <img
                  src={product.src}
                  alt={product.alt}
                  className={`w-56 md:w-72 lg:w-[22rem] object-contain relative z-[1] ${i === 1 ? "scale-110" : ""}`}
                  style={{
                    filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.08)) drop-shadow(0 8px 16px rgba(0,0,0,0.06))",
                  }}
                />
              </div>
            </motion.div>
          ))}
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
