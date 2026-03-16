import { motion } from "framer-motion";

const cards = [
  { label: "Market", text: "India's pet supplement space is rapidly premiumising." },
  { label: "Need", text: "Gut, joint and skin support are the top supplement use-cases for Indian dogs." },
  { label: "Approach", text: "Daily toppers that plug into your dog's existing feeding routine without disruption." },
];

const chips = [
  "Mixed diets: home-cooked and kibble",
  "Heat, humidity, hard floors",
  "Preventive, not just reactive, support",
];

const WhyNutritionSection = () => {
  return (
    <section id="why" className="section-padding bg-background/65 backdrop-blur-sm">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground block mb-4">
            Indian context
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-foreground">
            Why targeted nutrition matters
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
              Indian pet parents are moving beyond basic kibble to premium, functional nutrition that addresses real health concerns like digestion, joints and skin issues.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              Dogs in our cities live on mixed diets, walk on hard surfaces and deal with heat, humidity and pollution, which can put extra stress on their gut, joints and immune system.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              Targeted supplements and toppers allow you to fine-tune your dog's nutrition to their age, lifestyle and health status, alongside regular food and veterinary care.
            </p>
          </motion.div>

          {/* Right — cards & chips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {cards.map((card, i) => (
              <div key={card.label} className="border border-border p-6">
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-omega block mb-2">
                  {card.label}
                </span>
                <p className="text-sm text-foreground leading-relaxed">{card.text}</p>
              </div>
            ))}

            <div className="flex flex-wrap gap-2 pt-2">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="px-3 py-1.5 bg-secondary text-xs font-medium text-muted-foreground rounded-sm"
                >
                  {chip}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyNutritionSection;
