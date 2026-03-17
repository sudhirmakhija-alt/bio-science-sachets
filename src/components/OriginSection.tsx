import { motion } from "framer-motion";
import originDog from "@/assets/cat_smile.png";

const OriginSection = () => {
  return (
    <section id="origin" className="section-padding bg-background/60 backdrop-blur-sm mt-0 pt-4">
      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative">
          
          <img

            alt="Cat, the dog who inspired BioLogica Pets veterinary nutrition"
            className="w-full grayscale"
            style={{ filter: 'grayscale(100%) contrast(1.1)' }} src={originDog} />
          
          <div className="absolute bottom-6 left-6 bg-background/90 backdrop-blur-sm px-4 py-2">
            <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium">WOOF woof!  MY NAME IS CAT</span>
          </div>
        </motion.div>

        {/* Editorial copy */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}>
          
          <span className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground block mb-6">
            The Origin
          </span>

          <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-foreground mb-8 leading-[1.05]">
            It all started with
            <br />
            a dog named Cat.
          </h2>

          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p className="text-lg font-light">What started as a treat brand in 2021 - pivoted to clinical discipline when our founder's dog, ironically named Cat, needed consistent, vet-grade nutrition that no Indian product on the market could deliver.



            </p>
            <p>Opened bottles oxidised within weeks. Pump dispensers delivered inconsistent doses. "Natural" labels covered up industrial shortcuts. And efficacy was masked with labels that had zero transparency and dosing was nowhere close to being precise.


            </p>
            <p>BioLogica Pets was built from a single premise: if pharmaceutical-grade human supplements come in individually sealed doses, why don't veterinary ones? India's first sachet-based canine nutrition system was born.



            </p>
          </div>

          <div className="mt-10 pt-10 border-t border-border">
            <div className="grid grid-cols-3 gap-4 md:gap-8">
              {[
              { value: '30', label: 'Precision Sachets' },
              { value: '<25°C', label: 'Storage Standard' },
              { value: 'v5.2', label: 'Formulation' }].
              map((stat) =>
              <div key={stat.label} className="border-t border-border pt-4">
                  <div className="text-2xl md:text-4xl lg:text-[48px] font-black text-foreground leading-none">{stat.value}</div>
                  <div className="text-muted-foreground mt-2 tracking-widest uppercase text-[9px] md:text-[11px]">
                    {stat.label}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>);

};

export default OriginSection;