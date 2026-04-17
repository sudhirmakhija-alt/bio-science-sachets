import { motion, useReducedMotion } from "framer-motion";
import { Layers, ShieldCheck, Target, type LucideIcon } from "lucide-react";

interface Pillar {
  icon: LucideIcon;
  title: string;
  body: string;
  stat: string;
}

const pillars: Pillar[] = [
  {
    icon: Layers,
    title: "Microencapsulated",
    body:
      "Unstable nutrients like Omega-3 and live cultures are individually encapsulated, protecting them from heat, moisture and oxidation until digested.",
    stat: "94% nutrient retention",
  },
  {
    icon: ShieldCheck,
    title: "Zero Oxidation",
    body:
      "Single-dose sachets mean the product is never opened and re-exposed. No rancid fats. No degraded actives. Every sachet is as fresh as the day it was sealed.",
    stat: "Single-use sealed format",
  },
  {
    icon: Target,
    title: "Precision Dosing",
    body:
      "Mathematically calculated sachet weights remove dosing guesswork. No scoops, no spills, no under- or over-supplementing.",
    stat: "Exact weight per sachet",
  },
];

const certifications = ["WHO-GMP+", "FAMI-QS", "AAFCO Guidelines", "FEDIAF Compliant"];

const InsideEverySachet = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="bg-foreground text-background py-24 px-6 md:px-12">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center">
          <span className="text-xs tracking-widest uppercase text-background/50 mb-3 block">
            The Science
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-background">
            Inside Every Sachet
          </h2>
          <p className="text-base text-background/60 mt-3 max-w-xl mx-auto">
            Every variable that degrades pet supplements has been engineered out.
          </p>
        </div>

        {/* Pillars grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.45,
                ease: "easeOut",
                delay: prefersReducedMotion ? 0 : i * 0.1,
              }}
              className="bg-background/5 backdrop-blur-xl border border-background/10 rounded-2xl p-8 hover:border-background/20 hover:bg-background/[0.08] transition-all duration-300"
            >
              <p.icon className="w-8 h-8 text-background/80" strokeWidth={1.75} />
              <h3 className="text-xl font-bold text-background mt-4">{p.title}</h3>
              <p className="text-sm text-background/60 leading-relaxed mt-3">{p.body}</p>
              <div className="text-xs font-semibold tracking-wider text-background/40 uppercase mt-6 border-t border-background/10 pt-4">
                {p.stat}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Certifications row */}
        <div className="mt-16 flex flex-col items-center">
          <span className="text-xs text-background/30 mb-4">
            Manufactured & formulated to:
          </span>
          <div className="flex flex-wrap justify-center gap-3">
            {certifications.map((c) => (
              <span
                key={c}
                className="border border-background/20 text-background/50 text-xs tracking-widest uppercase px-4 py-2 rounded-full"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InsideEverySachet;
