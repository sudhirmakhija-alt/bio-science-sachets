import { motion } from "framer-motion";
import originDog from "@/assets/cat_smile.png";

const OriginSection = () => {
  return (
    <section id="origin" className="section-padding bg-background/60 backdrop-blur-sm mt-0 pt-4">
      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-6 lg:gap-16 items-center">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, transform: "translateX(-24px)" }}
          whileInView={{ opacity: 1, transform: "translateX(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative">

          <img
            alt="Cat, the dog who inspired BioLogica Pets veterinary nutrition"
            className="w-full"
            style={{ filter: 'grayscale(100%) contrast(1.1)' }}
            src={originDog}
          />

          <div className="absolute bottom-6 left-6 bg-background/90 backdrop-blur-sm px-4 py-2">
            <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium">WOOF WOOF! MY NAME IS CAT</span>
          </div>
        </motion.div>

        {/* Editorial copy */}
        <motion.div
          initial={{ opacity: 0, transform: "translateX(24px)" }}
          whileInView={{ opacity: 1, transform: "translateX(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>

          <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-muted-foreground/50 block mb-6">
            The Origin
          </span>

          <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-foreground mb-8 leading-[1.05]">
            It all started with
            <br />
            a dog named Cat.
          </h2>

          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p className="text-lg font-light">
              What started as a treat brand in 2021 — pivoted to clinical discipline when our founder's dog, ironically named Cat, needed consistent, vet-grade nutrition that no Indian product on the market could deliver.
            </p>
            <p>
              Opened bottles oxidised within weeks. Pump dispensers delivered inconsistent doses. "Natural" labels covered up industrial shortcuts. And efficacy was masked with labels that had zero transparency and dosing was nowhere close to being precise.
            </p>
            <p>
              BioLogica Pets was built from a single premise: if pharmaceutical-grade human supplements come in individually sealed doses, why don't veterinary ones? India's first sachet-based canine nutrition system was born.
            </p>
          </div>

          <div className="mt-10 pt-10 border-t border-border">
            <div className="grid grid-cols-3 gap-0">
              {[
                { value: '30', label: 'Precision Sachets' },
                { value: '<25°C', label: 'Storage Standard' },
                { value: 'v5.2', label: 'Formulation' },
              ].map((stat, idx) => (
                <div
                  key={stat.label}
                  className={`flex flex-col items-center justify-center text-center px-2 md:px-4 ${idx === 1 ? 'border-x border-border' : ''}`}
                >
                  <div className="text-2xl md:text-4xl lg:text-[48px] font-black text-foreground leading-none tabular-nums">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground/50 mt-2 tracking-[0.15em] uppercase text-[9px] md:text-[10px]">
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
