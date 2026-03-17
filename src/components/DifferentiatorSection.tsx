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
    <section id="differentiator" className="section-padding" style={{ backgroundColor: '#f5f7f2' }}>
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

          {/* Right — 2x2 stat cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { stat: "100%", label: "Vet-led formulation process" },
              { stat: "30", label: "Precision sachets per pack" },
              { stat: "2", label: "Global quality certifications — WHO-GMP+ and FAMI-QS" },
              { stat: "0", label: "Artificial colours, flavours or unnecessary fillers" },
            ].map((card) => (
              <div
                key={card.stat + card.label}
                className="border border-border rounded-md p-5 flex flex-col gap-2"
              >
                <span className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                  {card.stat}
                </span>
                <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground leading-snug">
                  {card.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DifferentiatorSection;
