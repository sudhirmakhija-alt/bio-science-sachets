import { motion, useReducedMotion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { ShieldCheck, Factory, Sun, ArrowRight } from "lucide-react";
import { useRef } from "react";
import SpotlightCard from "@/components/SpotlightCard";
import { useIsMobile } from "@/hooks/use-mobile";
import organBalance from "@/assets/organ-balance-new.png";
import gutBalance from "@/assets/gut-balance-new.png";
import omegaBalance from "@/assets/omega-balance-new.png";

const tins = [
  { src: omegaBalance, alt: "BioLogica Omega Balance+ dog nutrition topper with Green-Lipped Mussel, 30 sachets", label: "OMEGA BALANCE+", labelLine1: "OMEGA", labelLine2: "BALANCE+", labelDelay: 0 },
  { src: organBalance, alt: "BioLogica Organ Balance+ dehydrated organ topper for dogs, 30 sachets", label: "ORGAN BALANCE+", labelLine1: "ORGAN", labelLine2: "BALANCE+", labelDelay: 0.1 },
  { src: gutBalance, alt: "BioLogica Gut Balance+ vegetarian gut health topper for dogs, 30 sachets", label: "GUT BALANCE+", labelLine1: "GUT", labelLine2: "BALANCE+", labelDelay: 0.2 },
];

const badges = [
  { icon: ShieldCheck, label: "Vet-formulated" },
  { icon: Factory, label: "WHO-GMP+ & FAMI-QS facilities" },
  { icon: Sun, label: "Designed for Indian diets & climate" },
];

const TinLabel = ({ progress, delay }: { progress: MotionValue<number>; delay: number }) => {
  const opacity = useTransform(progress, [0.5 + delay * 0.05, 0.65 + delay * 0.05], [0, 1]);
  return opacity;
};

const HeroSection = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  // Smooth spring-based progress
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Hero content: scrolls up & fades out
  const heroOpacity = useTransform(smoothProgress, [0, 0.4], [1, 0]);
  const heroY = useTransform(smoothProgress, [0, 0.4], [0, -80]);

  // Tins: parallax rise + scale + fade
  const tinsY = useTransform(smoothProgress, [0, 0.6, 0.9], [80, 0, -10]);
  const tinsOpacity = useTransform(smoothProgress, [0, 0.3], [0, 1]);
  const tinsScale = useTransform(smoothProgress, [0, 0.6], [0.94, 1]);

  // Tin labels: staggered fade-in around 50%
  const label0Opacity = useTransform(smoothProgress, [0.5, 0.6], [0, 1]);
  const label1Opacity = useTransform(smoothProgress, [0.55, 0.65], [0, 1]);
  const label2Opacity = useTransform(smoothProgress, [0.6, 0.7], [0, 1]);
  const labelOpacities = [label0Opacity, label1Opacity, label2Opacity];

  // Headline split into words for stagger animation.
  const headlineLines: { words: string[]; muted?: boolean }[] = [
    { words: ["Clinical-grade"] },
    { words: ["daily", "Precision", "nutrition"] },
    { words: ["support", "for"], muted: true },
    { words: ["Indian", "dogs."], muted: true },
  ];
  const allWords = headlineLines.flatMap((l) => l.words);
  const totalWords = allWords.length;
  const wordStaggerMs = 60;
  const wordDurationMs = 400;
  const statDelayMs = totalWords * wordStaggerMs + 200;

  // Mobile/reduced-motion: render statically with tins below content in normal flow
  const StaticTins = ({ mobileOnly = false }: { mobileOnly?: boolean }) => (
    <div className={`relative w-full max-w-[1400px] mx-auto mt-8 px-0 md:px-12 ${mobileOnly ? "md:hidden" : "md:mt-12"}`}>
      <div className="flex md:grid md:grid-cols-3 justify-center items-end gap-0 md:gap-6 w-full">
        {tins.map((tin) => (
          <div key={tin.alt} className="flex flex-col items-center gap-3 min-w-0 flex-1 basis-0 md:flex-initial md:basis-auto">
            <img
              src={tin.src}
              alt={tin.alt}
              className="h-auto object-contain mx-auto w-full max-w-[158px] md:max-w-[450px] lg:max-w-[564px]"
              style={{ filter: "drop-shadow(0 28px 18px rgba(0,0,0,0.18)) drop-shadow(0 50px 40px rgba(0,0,0,0.10))" }}
            />
            <span className="text-[10px] md:text-xs tracking-widest uppercase text-muted-foreground text-center leading-tight">
              <span className="md:hidden">{tin.labelLine1}<br />{tin.labelLine2}</span>
              <span className="hidden md:inline">{tin.label}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  if (prefersReducedMotion) {
    return (
      <section className="relative flex flex-col items-center justify-center overflow-hidden min-h-screen pb-0 pt-20 bg-background">
        <div className="px-6 md:px-12 w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center relative z-10">
          <HeroCopy headlineLines={headlineLines} badges={badges} prefersReducedMotion={true} wordStaggerMs={wordStaggerMs} wordDurationMs={wordDurationMs} statDelayMs={statDelayMs} />
          <div className="hidden md:flex items-center justify-center mt-4 lg:mt-0">
            <SpotlightCard variant="notify" />
          </div>
        </div>
        <StaticTins />
      </section>
    );
  }

  const heroCopy = (
    <HeroCopy
      headlineLines={headlineLines}
      badges={badges}
      prefersReducedMotion={false}
      wordStaggerMs={wordStaggerMs}
      wordDurationMs={wordDurationMs}
      statDelayMs={statDelayMs}
    />
  );

  return (
    <>
      {/* MOBILE: static hero + tins in normal flow, no parallax */}
      {isMobile && (
        <section className="md:hidden relative flex flex-col items-center overflow-hidden min-h-screen pt-20 pb-2 bg-background">
          <div className="px-6 w-full max-w-[1400px] mx-auto relative z-10">
            {heroCopy}
          </div>
          <StaticTins mobileOnly />
        </section>
      )}

      {/* DESKTOP/TABLET: scroll-driven reveal */}
      {!isMobile && (
        <div ref={wrapperRef} className="relative hidden md:block" style={{ height: "130vh" }}>
          <div className="sticky top-0 h-screen overflow-hidden bg-background">
            {/* HERO CONTENT — scrolls up & fades out */}
            <motion.section
              style={{ opacity: heroOpacity, y: heroY }}
              className="relative flex flex-col items-center justify-center min-h-screen pt-20"
            >
              <div
                className="absolute inset-0 -z-10"
                style={{
                  background:
                    "radial-gradient(ellipse at 30% 50%, rgba(255,182,193,0.12) 0%, transparent 55%), radial-gradient(ellipse at 70% 40%, rgba(144,238,144,0.10) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(173,216,230,0.12) 0%, transparent 45%), linear-gradient(160deg, rgba(250,251,255,0.42) 0%, rgba(244,247,244,0.42) 100%)",
                }}
              />
              <div className="px-6 md:px-12 w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center relative z-10">
                {heroCopy}
                <div className="hidden md:flex items-center justify-center mt-4 lg:mt-0">
                  <SpotlightCard variant="notify" />
                </div>
              </div>
            </motion.section>

            {/* PRODUCT TINS — parallax rise on clean white bg, centered with tight whitespace */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none px-6 md:px-12"
              style={{ y: tinsY, opacity: tinsOpacity, scale: tinsScale }}
            >
              <div className="w-full max-w-[1400px] mx-auto grid grid-cols-3 gap-6 items-end">
                {tins.map((tin, i) => (
                  <div key={tin.alt} className="flex flex-col items-center gap-4">
                    <img
                      src={tin.src}
                      alt={tin.alt}
                      className="w-[450px] lg:w-[564px] h-auto object-contain"
                      style={{
                        filter:
                          "drop-shadow(0 28px 18px rgba(0,0,0,0.18)) drop-shadow(0 50px 40px rgba(0,0,0,0.10))",
                      }}
                    />
                    <motion.span
                      className="text-xs tracking-widest uppercase text-muted-foreground text-center"
                      style={{ opacity: labelOpacities[i] }}
                    >
                      {tin.label}
                    </motion.span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </>
  );
};

// Extracted hero copy to avoid duplication between reduced-motion and animated paths
const HeroCopy = ({
  headlineLines,
  badges,
  prefersReducedMotion,
  wordStaggerMs,
  wordDurationMs,
  statDelayMs,
}: {
  headlineLines: { words: string[]; muted?: boolean }[];
  badges: { icon: typeof ShieldCheck; label: string }[];
  prefersReducedMotion: boolean;
  wordStaggerMs: number;
  wordDurationMs: number;
  statDelayMs: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
  >
    {/* Pill */}
    <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-border rounded-sm mb-4 mt-2 md:mt-0">
      <span className="w-2 h-2 rounded-full bg-gut" />
      <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
        Vet-formulated daily toppers for Indian dogs
      </span>
    </div>

    {/* Headline */}
    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-[0.95] tracking-[-0.04em] text-foreground mb-4">
      {(() => {
        let wordIndex = 0;
        return headlineLines.map((line, lineIdx) => (
          <span key={lineIdx} className="block">
            {line.words.map((word, i) => {
              const delay = prefersReducedMotion ? 0 : wordIndex * wordStaggerMs;
              wordIndex++;
              const isPrecision = word === "Precision";
              return (
                <motion.span
                  key={`${lineIdx}-${i}`}
                  className={`inline-block ${line.muted && !isPrecision ? "text-muted-foreground" : ""} ${i < line.words.length - 1 ? "mr-[0.25em]" : ""}`}
                  style={
                    isPrecision
                      ? {
                          background: "linear-gradient(135deg, #0EA5E9, #059669)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }
                      : undefined
                  }
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: wordDurationMs / 1000,
                    delay: delay / 1000,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {word}
                </motion.span>
              );
            })}
          </span>
        ));
      })()}
    </h1>

    <p className="text-base md:text-lg text-muted-foreground max-w-md leading-relaxed mb-3 font-light">
      Vet-formulated toppers that support joints, digestion, immunity, skin & coat and overall vitality in dogs living in Indian homes and climates.
    </p>

    <p className="text-xs text-muted-foreground/70 max-w-md leading-relaxed mb-5">
      Developed by veterinarians and animal nutrition experts, referencing AAFCO and FEDIAF dog nutrition guidelines and manufactured in WHO-GMP+ and FAMI-QS certified facilities.
    </p>

    <div className="flex flex-wrap gap-3 mb-4">
      <a
        href="https://amazon.in/biologica"
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-background font-semibold text-sm tracking-wide hover:opacity-90 transition-opacity"
      >
        SHOP ON AMAZON INDIA
        <ArrowRight size={14} className="transition-transform duration-150 ease-out group-hover:translate-x-1" />
      </a>
      <a
        href="#science"
        className="group inline-flex items-center justify-center gap-2 px-6 py-3 border border-foreground text-foreground font-semibold text-sm tracking-wide hover:bg-foreground hover:text-background transition-colors"
      >
        HOW BIOLOGICA HELPS YOUR DOG
        <ArrowRight size={14} className="transition-transform duration-150 ease-out group-hover:translate-x-1" />
      </a>
    </div>

    <motion.div
      className="md:text-xs tracking-wide text-muted-foreground mt-3 mb-4 whitespace-nowrap text-xs"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: prefersReducedMotion ? 0 : statDelayMs / 1000, ease: "easeOut" }}
    >
      0% Oxidation <span className="mx-1 text-muted-foreground/50">·</span> 3 Feed Systems <span className="mx-1 text-muted-foreground/50">·</span> WHO-GMP+ Certified
    </motion.div>

    <div className="flex flex-nowrap gap-2 overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0 md:flex-wrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {badges.map((badge) => (
        <div
          key={badge.label}
          className="inline-flex shrink-0 items-center gap-2 px-3 py-1.5 bg-secondary rounded-sm whitespace-nowrap"
        >
          <badge.icon className="w-3.5 h-3.5 text-gut shrink-0" />
          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">{badge.label}</span>
        </div>
      ))}
    </div>
  </motion.div>
);

export default HeroSection;
