import { motion, useScroll, useTransform } from "framer-motion";
import { ShieldCheck, Factory, Sun } from "lucide-react";
import { useRef } from "react";
import organBalance from "@/assets/organ-balance.png";
import gutBalance from "@/assets/gut-balance.png";
import omegaBalance from "@/assets/omega-balance.png";

const badges = [
  { icon: ShieldCheck, label: "Vet-formulated" },
  { icon: Factory, label: "WHO-GMP+ & FAMI-QS facilities" },
  { icon: Sun, label: "Designed for Indian diets & climate" },
];

const products = [
  { src: organBalance, alt: "Organ Balance+ packaging", delay: 0 },
  { src: gutBalance, alt: "Gut Balance+ packaging", delay: 0.15 },
  { src: omegaBalance, alt: "Omega Balance+ packaging", delay: 0.3 },
];

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const y0 = useTransform(scrollYProgress, [0, 1], [0, -500]);
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -750]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -350]);
  const rotate0 = useTransform(scrollYProgress, [0, 1], [0, -15]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 12]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -10]);
  const scale0 = useTransform(scrollYProgress, [0, 0.5], [1, 1.4]);
  const scale1 = useTransform(scrollYProgress, [0, 0.5], [1, 1.5]);
  const scale2 = useTransform(scrollYProgress, [0, 0.5], [1, 1.3]);
  const yValues = [y0, y1, y2];
  const rotateValues = [rotate0, rotate1, rotate2];
  const scaleValues = [scale0, scale1, scale2];

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center overflow-hidden">
      <div className="section-padding w-full max-w-[1400px] mx-auto grid grid-cols-1 gap-12 items-center relative z-10">
        {/* Left - Copy */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-border rounded-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-gut" />
            <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              Vet-formulated daily toppers for Indian dogs
            </span>
          </div>

          {/* Headline - black & grey style preserved */}
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

        {/* Product visuals — centered below */}
        <div className="lg:col-span-2 flex items-center justify-center mt-8">
          <div className="relative flex items-end justify-center gap-6 lg:gap-10">
            {products.map((product, i) => (
              <motion.div
                key={product.alt}
                className="relative"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 + product.delay, ease: [0.16, 1, 0.3, 1] }}
                style={{ y: yValues[i], rotate: rotateValues[i], scale: scaleValues[i] }}
              >
                <img
                  src={product.src}
                  alt={product.alt}
                  className={`w-48 md:w-64 lg:w-80 object-contain ${i === 1 ? "scale-110" : ""}`}
                  style={{ filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.12))" }}
                />
              </motion.div>
            ))}
          </div>
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
