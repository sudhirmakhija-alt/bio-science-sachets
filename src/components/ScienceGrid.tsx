import { motion } from "framer-motion";
import { Thermometer, Lock, Layers, FlaskConical, ShieldCheck, Microscope } from "lucide-react";

const scienceItems = [
  {
    icon: Layers,
    title: "Microencapsulation",
    description: "Active compounds are individually coated to survive stomach acid and deliver at the intestinal absorption site.",
    span: "md:col-span-2",
  },
  {
    icon: Thermometer,
    title: "<25°C Storage",
    description: "Every batch stored and shipped below 25°C. Cold-chain integrity from production to your door.",
    span: "",
  },
  {
    icon: Lock,
    title: "Nitrogen-Flushed Sachets",
    description: "Oxygen displaced at packaging. Zero oxidation from seal to serve.",
    span: "",
  },
  {
    icon: FlaskConical,
    title: "Pharmaceutical-Grade Sourcing",
    description: "Raw materials from certified pharmaceutical suppliers — not feed-grade commodity markets.",
    span: "md:col-span-2",
  },
  {
    icon: ShieldCheck,
    title: "Airtight Barrier",
    description: "Multi-layer aluminium laminate blocks light, moisture, and oxygen — the three enemies of potency.",
    span: "",
  },
  {
    icon: Microscope,
    title: "Batch-Tested Potency",
    description: "Every production batch tested against declared values. Certificate of Analysis available on request.",
    span: "md:col-span-2",
  },
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
            Technical Specifications
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-foreground max-w-2xl">
            The Science Grid v5.2
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-px bg-border">
          {scienceItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`bg-background p-8 md:p-10 group hover:bg-background-subtle transition-colors duration-300 ${item.span}`}
              >
                <Icon className="w-8 h-8 text-muted-foreground group-hover:text-omega transition-colors mb-6" strokeWidth={1.5} />
                <h3 className="text-lg font-bold tracking-tight text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ScienceGrid;
