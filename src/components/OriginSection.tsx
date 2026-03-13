import { motion } from "framer-motion";
import originDog from "@/assets/origin-dog.png";

const OriginSection = () => {
  return (
    <section className="section-padding bg-background/60 backdrop-blur-sm">
      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <img
            src={originDog}
            alt="Cat, the dog who inspired BioLogica veterinary nutrition"
            className="w-full grayscale"
            style={{ filter: 'grayscale(100%) contrast(1.1)' }}
          />
          <div className="absolute bottom-6 left-6 bg-background/90 backdrop-blur-sm px-4 py-2">
            <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium">
              "Cat" — Est. 2019
            </span>
          </div>
        </motion.div>

        {/* Editorial copy */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground block mb-6">
            The Origin
          </span>

          <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-foreground mb-8 leading-[1.05]">
            Born from a dog
            <br />
            named Cat.
          </h2>

          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p className="text-lg font-light">
              We replaced industry frustration with clinical discipline. When our founder's 
              dog—ironically named Cat—needed consistent, vet-grade nutrition, every product 
              on the market failed the same test.
            </p>
            <p>
              Open bottles that oxidized within weeks. Pump dispensers that delivered 
              inconsistent doses. "Natural" labels that masked industrial shortcuts.
            </p>
            <p>
              BioLogica was built from a single premise: if pharmaceutical-grade human 
              supplements come in individually sealed doses, why don't veterinary ones?
            </p>
          </div>

          <div className="mt-10 pt-10 border-t border-border">
            <div className="grid grid-cols-3 gap-8">
              {[
                { value: '30', label: 'Precision Sachets' },
                { value: '<25°C', label: 'Storage Standard' },
                { value: '0%', label: 'Oxidation Risk' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-black text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1 tracking-wide uppercase">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OriginSection;
