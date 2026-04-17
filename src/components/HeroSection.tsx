import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, Factory, Sun, ArrowRight } from "lucide-react";
import { useRef } from "react";
import SpotlightCard from "@/components/SpotlightCard";

const badges = [
  { icon: ShieldCheck, label: "Vet-formulated" },
  { icon: Factory, label: "WHO-GMP+ & FAMI-QS facilities" },
  { icon: Sun, label: "Designed for Indian diets & climate" },
];

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Headline split into words for stagger animation.
  // Each line keeps its own array so we can preserve <br /> breaks.
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

  return (
    <section ref={sectionRef} className="relative flex flex-col items-center justify-center overflow-hidden min-h-screen lg:h-screen pb-0 pt-20" style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(255,182,193,0.12) 0%, transparent 55%), radial-gradient(ellipse at 70% 40%, rgba(144,238,144,0.10) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(173,216,230,0.12) 0%, transparent 45%), linear-gradient(160deg, rgba(250,251,255,0.42) 0%, rgba(244,247,244,0.42) 100%)' }}>
      <div className="px-6 md:px-12 w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center relative z-10">
        {/* Left - Copy */}
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

          {/* Headline - black & grey style preserved */}
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

          {/* Subheadline */}
          <p className="text-base md:text-lg text-muted-foreground max-w-md leading-relaxed mb-3 font-light">
            Vet-formulated toppers that support joints, digestion, immunity, skin & coat and overall vitality in dogs living in Indian homes and climates.
          </p>

          {/* Trust line */}
          <p className="text-xs text-muted-foreground/70 max-w-md leading-relaxed mb-5">
            Developed by veterinarians and animal nutrition experts, referencing AAFCO and FEDIAF dog nutrition guidelines and manufactured in WHO-GMP+ and FAMI-QS certified facilities.
          </p>

          {/* CTAs */}
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

          {/* Stat row */}
          <motion.div
            className="md:text-xs tracking-wide text-muted-foreground mt-3 mb-4 whitespace-nowrap text-xs"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: prefersReducedMotion ? 0 : statDelayMs / 1000, ease: "easeOut" }}
          >
            0% Oxidation <span className="mx-1.5 md:mx-2 text-muted-foreground/50">·</span> 3 Feed Systems <span className="mx-1.5 md:mx-2 text-muted-foreground/50">·</span> WHO-GMP+ Certified
          </motion.div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
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

        {/* Spotlight card (hidden on mobile) */}
        <div className="hidden md:flex items-center justify-center mt-4 lg:mt-0">
          <SpotlightCard variant="notify" />
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
