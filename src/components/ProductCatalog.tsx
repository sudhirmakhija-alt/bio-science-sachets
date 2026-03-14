import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const products = [
  {
    name: "Omega Balance+",
    subtitle: "Essential Fatty Acid Complex",
    description: "Marine Collagen + Green Lipped Mussel. High-potency EPA/DHA microencapsulated for zero oxidation. Supports skin, coat, joints, and cognitive function.",
    color: "omega" as const,
    features: ["Marine Collagen + Green Lipped Mussel", "Microencapsulated EPA/DHA", "30 Precision Sachets (2g each)"],
    price: "₹1,399",
    amazonUrl: "#",
  },
  {
    name: "Organ  \nBalance+",
    subtitle: "Ancestral Organ Matrix",
    description: "Ancestral Chicken Organ Matrix — Liver & Heart. Freeze-dried from grass-fed, pasture-raised sources with mathematically controlled Vitamin A levels.",
    color: "organ" as const,
    features: ["Chicken Liver + Heart Matrix", "Controlled Vitamin A levels", "30 Precision Sachets (2g each)"],
    price: "₹1,599",
    amazonUrl: "#",
  },
  {
    name: "Gut \nBalance+",
    subtitle: "Digestive Microbiome Support",
    description: "6 Billion CFU/kg + Whey Hydrolysate. Heat-stable probiotic strains with postbiotics for digestive resilience and immune modulation.",
    color: "gut" as const,
    features: ["6 Billion CFU/kg guaranteed", "Whey Hydrolysate base", "30 Precision Sachets (2g each)"],
    price: "₹1,299",
    amazonUrl: "#",
  },
];

const colorClasses = {
  omega: {
    border: "hover:border-omega/30",
    accent: "bg-omega",
    text: "text-omega",
    button: "bg-omega text-omega-foreground hover:opacity-90",
  },
  organ: {
    border: "hover:border-organ/30",
    accent: "bg-organ",
    text: "text-organ",
    button: "bg-organ text-organ-foreground hover:opacity-90",
  },
  gut: {
    border: "hover:border-gut/30",
    accent: "bg-gut",
    text: "text-gut",
    button: "bg-gut text-gut-foreground hover:opacity-90",
  },
};

const ProductCatalog = () => {
  return (
    <section id="products" className="section-padding bg-background/70 backdrop-blur-sm">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground block mb-4">
            Product Range
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-foreground">
            Complementary Feed Systems
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {products.map((product, i) => {
            const cls = colorClasses[product.color];
            return (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`border border-border ${cls.border} transition-all duration-300 bg-background group flex flex-col`}
              >
                {/* Color accent bar */}
                <div className={`h-1 ${cls.accent}`} />

                <div className="p-8 md:p-10 flex flex-col flex-1">
                  <div className={`text-xs font-semibold tracking-[0.2em] uppercase ${cls.text} mb-3`}>
                    {product.subtitle}
                  </div>
                  <h3 className="text-2xl font-black tracking-tight text-foreground mb-4 whitespace-pre-line">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {product.description}
                  </p>

                  <ul className="space-y-2 mb-8 flex-1">
                    {product.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                        <div className={`w-1 h-1 ${cls.accent}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between pt-6 border-t border-border mt-auto">
                    <span className="text-2xl font-black text-foreground">{product.price}</span>
                    <a
                      href={product.amazonUrl}
                      className={`inline-flex items-center gap-2 px-6 py-3 ${cls.button} font-semibold text-sm tracking-wide transition-opacity`}
                    >
                      BUY ON AMAZON
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductCatalog;
