import { motion } from "framer-motion";

const tags = [
  "AAFCO dog profiles referenced",
  "FEDIAF nutritional guidelines",
  "WHO-GMP+ facilities",
  "FAMI-QS certified manufacturing",
];

const ScienceGrid = () => {
  return (
    <section id="science" className="section-padding bg-background/65 backdrop-blur-sm">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground block mb-4">
            Standards
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-foreground">
            Evidence-based and safety-first
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left — paragraphs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-base text-muted-foreground leading-relaxed">
              Our formulations are developed with reference to AAFCO and FEDIAF nutritional guidelines for dogs, which define practical minimum and some maximum nutrient levels for safety and adequacy.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              We work with WHO-GMP+ and FAMI-QS compliant facilities that specialise in animal nutrition, with documented processes for ingredient sourcing, batch traceability and quality control.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              Every BioLogica product is intended to complement, not replace, a balanced diet and appropriate veterinary care. We recommend discussing any new supplement with your veterinarian, especially for dogs with existing medical conditions.
            </p>
          </motion.div>

          {/* Right — tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-3 content-start"
          >
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 border border-border text-sm font-medium text-foreground rounded-sm"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ScienceGrid;
