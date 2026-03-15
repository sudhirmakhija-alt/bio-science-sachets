import { motion } from "framer-motion";
import originDog from "@/assets/origin-dog.png";

const OriginSection = () => {
  return (
    <section id="origin" className="section-padding bg-background/60 backdrop-blur-sm">
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
            style={{ filter: 'grayscale(100%) contrast(1.1)' }} src="/lovable-uploads/ffb50a4d-5e4f-47f9-86ae-ad14cf157fd3.png" />
          
          <div className="absolute bottom-6 left-6 bg-background/90 backdrop-blur-sm px-4 py-2">
            <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium">WOOF MY NAME IS CAT</span>
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
            Born from a dog
            <br />
            named Cat.
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
            <div className="grid grid-cols-3 gap-8">
              {[
              { value: '30', label: 'Precision Sachets' },
              { value: '<25°C', label: 'Storage Standard' },
              { value: 'v5.2', label: 'Formulation' }].
              map((stat) =>
              <div key={stat.label}>
                  <div className="text-2xl font-black text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1 tracking-wide uppercase">
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