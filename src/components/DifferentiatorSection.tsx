import { motion } from "framer-motion";

const bullets = [
  { bold: "Dog-specific science:", text: "formulas designed for dogs, not adapted from human supplements" },
  { bold: "Standards-driven:", text: "nutrient levels planned with reference to AAFCO and FEDIAF guidelines" },
  { bold: "Indian context:", text: "built for Indian diets, lifestyles and climates" },
  { bold: "Certified manufacturing:", text: "WHO-GMP+ and FAMI-QS animal nutrition facilities" },
  { bold: "Clean-label:", text: "no artificial colours or flavours, no unnecessary fillers" },
];

const DifferentiatorSection = () => {
  return (
    <section id="differentiator" className="section-padding bg-background/70 backdrop-blur-sm">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground block mb-4">
            Science-led
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-foreground">
            What makes BioLogica different
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left — intro + bullets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-base text-muted-foreground leading-relaxed mb-8">
              There are many supplements on the shelf. BioLogica focuses on being precise, transparent and clinically grounded.
            </p>

            <ul className="space-y-4">
              {bullets.map((b) => (
                <li key={b.bold} className="flex items-start gap-3 text-sm text-foreground">
                  <div className="w-1 h-1 bg-foreground mt-2 shrink-0" />
                  <span>
                    <span className="font-semibold">{b.bold}</span> {b.text}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right — pill + text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-border rounded-sm mb-8">
              <span className="w-2 h-2 rounded-full bg-gut" />
              <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
                From clinic insight to daily routine
              </span>
            </div>

            <p className="text-base text-muted-foreground leading-relaxed">
              BioLogica translates real-world cases seen by veterinarians into practical, measurable nutrition support that fits into what you already feed at home.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DifferentiatorSection;
