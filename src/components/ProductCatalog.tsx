import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const products = [
{
  name: "Organ Balance+",
  subtitle: "Daily organ-based topper",
  description:
  "Organ Balance+ is a dehydrated, organ-based topper that helps support overall vitality, natural micronutrient intake and immune function in dogs.",
  color: "organ" as const,
  bullets: [
  "Ideal for dogs on kibble or vegetarian home-cooked diets that miss out on organ meats",
  "Provides concentrated organ-based nutrients to complement regular food and support energy and immune function",
  "Acts as a natural source of vitamins, minerals and other bioactive compounds often missing from standard diets",
  "Designed as a once-daily topper that can be mixed with food in seconds"],

  usage:
  "Sprinkle the contents of one sachet over your dog's regular meal once daily, or as advised by your veterinarian. Most pet parents report better appetite and overall energy over 3 to 6 weeks of consistent use when combined with a balanced diet and regular exercise.",
  cta: "View Organ Balance+ on Amazon India",
  amazonUrl: "https://amazon.in/biologica",
  price: "₹1,599"
},
{
  name: "Gut Balance+",
  subtitle: "Daily gut support topper",
  description:
  "Gut Balance+ is a 100% vegetarian, gut-friendly topper formulated to support healthy digestion, stool consistency and gut lining integrity in dogs.",
  color: "gut" as const,
  bullets: [
  "Suited for dogs with soft stool, variable stool quality or occasional digestive upsets",
  "Combines functional fibres, prebiotics and selected actives to support beneficial gut bacteria and comfortable digestion",
  "Helps promote firmer, more consistent stools and may reduce mild nausea or discomfort associated with diet changes",
  "Gentle enough for long-term daily use alongside regular food and veterinary care"],

  usage:
  "Mix one sachet with your dog's main meal once daily, adjusting as per body weight and your vet's advice. Many pet parents notice improvements in stool consistency and overall gut comfort within 1 to 3 weeks of regular use, especially when combined with an appropriate base diet.",
  cta: "View Gut Balance+ on Amazon India",
  amazonUrl: "https://amazon.in/biologica",
  price: "₹1,299"
},
{
  name: "Omega Balance+",
  subtitle: "Marine-derived omega topper",
  description:
  "Omega Balance+ is a marine-derived topper with green-lipped mussel (GLM) and omega fatty acids to support joint comfort, skin and coat health and overall cardiovascular and brain function in dogs.",
  color: "omega" as const,
  bullets: [
  "Designed for dogs with emerging joint stiffness or reduced willingness to jump or climb stairs",
  "Supplies EPA and DHA omega-3 fatty acids that help support normal inflammatory balance in joints and tissues",
  "Green-lipped mussel adds bioactive compounds that may help maintain mobility in active and ageing dogs",
  "Omega-3s also support healthy skin and coat, and normal heart and brain function with consistent use"],

  usage:
  "Sprinkle the sachet over food once daily, following the feeding guide and your vet's advice, especially for dogs already on omega-rich diets. Joint and mobility support typically requires several weeks of continuous use. Skin and coat changes may be visible earlier as part of an overall care plan.",
  cta: "View Omega Balance+ on Amazon India",
  amazonUrl: "https://amazon.in/biologica",
  price: "₹1,399"
}];


const colorClasses = {
  omega: {
    accent: "bg-omega",
    text: "text-omega",
    button: "bg-omega text-omega-foreground hover:opacity-90",
    dot: "bg-omega"
  },
  organ: {
    accent: "bg-organ",
    text: "text-organ",
    button: "bg-organ text-organ-foreground hover:opacity-90",
    dot: "bg-organ"
  },
  gut: {
    accent: "bg-gut",
    text: "text-gut",
    button: "bg-gut text-gut-foreground hover:opacity-90",
    dot: "bg-gut"
  }
};

const ProductCatalog = () => {
  return (
    <section id="products" className="section-padding bg-background/70 backdrop-blur-sm">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16">
          
          <span className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground block mb-4">
            Product family
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-foreground">
            The BioLogica topper range
          </h2>
        </motion.div>

        <div className="space-y-12">
          {products.map((product, i) => {
            const cls = colorClasses[product.color];
            return (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="border border-border bg-background">
                
                {/* Color accent bar */}
                <div className={`h-1 ${cls.accent}`} />

                <div className="p-8 md:p-12">
                  <div className="grid lg:grid-cols-2 gap-10">
                    {/* Left — info */}
                    <div>
                      <div className={`text-xs font-semibold tracking-[0.2em] uppercase ${cls.text} mb-3`}>
                        {product.subtitle}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black tracking-tight text-foreground mb-4">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                        {product.description}
                      </p>

                      <ul className="space-y-3 mb-8">
                        {product.bullets.map((b) =>
                        <li key={b} className="flex items-start gap-3 text-sm text-foreground">
                            <div className={`w-1.5 h-1.5 ${cls.dot} mt-1.5 shrink-0`} />
                            {b}
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Right — usage + CTA */}
                    <div className="flex flex-col justify-between">
                      <div className="border border-border p-6 mb-6">
                        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground block mb-3">
                          Usage & Expectations
                        </span>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {product.usage}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-border">
                        <span className="text-2xl font-black text-foreground px-[20px]">{product.price}</span>
                        <a
                          href={product.amazonUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-2 px-6 py-3 ${cls.button} font-semibold text-sm tracking-wide transition-opacity`}>
                          
                          {product.cta}
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>);

          })}
        </div>
      </div>
    </section>);

};

export default ProductCatalog;