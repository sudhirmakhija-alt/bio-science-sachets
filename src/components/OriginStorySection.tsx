import { motion, useReducedMotion } from "framer-motion";

const milestones = [
  { year: "2021", desc: "Launched as a premium dog treat brand" },
  { year: "2023", desc: "Pivoted to clinical nutrition after Cat's diagnosis" },
  { year: "2025", desc: "India's first sachet-dosed vet-grade supplement system" },
];

const OriginStorySection = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="origin-story" className="bg-background pt-24 pb-12 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <span className="text-xs tracking-widest uppercase text-muted-foreground mb-3 block">
          Our Origin
        </span>
        <h2 className="text-4xl font-bold text-foreground">
          Cat changed everything.
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed mt-4 max-w-2xl">
          What started as a treat brand in 2021 pivoted to clinical discipline when our founder's dog - ironically named Cat - needed consistent, vet-grade nutrition that no Indian product could deliver. BioLogica was rebuilt from the ground up around that single gap.
        </p>

        {/* Timeline */}
        <div className="mt-16 relative">
          {/* Horizontal connector line — desktop only, runs through dot centers */}
          <div
            className="hidden md:block absolute left-0 right-0 border-t border-border"
            style={{ top: "6px" }}
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 relative">
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.4,
                  ease: "easeOut",
                  delay: prefersReducedMotion ? 0 : i * 0.15,
                }}
                className="flex flex-col items-center text-center relative"
              >
                <div className="w-3 h-3 rounded-full bg-foreground relative z-10" />
                <div className="font-mono text-sm font-semibold text-foreground mt-4">
                  {m.year}
                </div>
                <p className="text-xs text-muted-foreground max-w-[160px] text-center mt-2 leading-relaxed">
                  {m.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OriginStorySection;
