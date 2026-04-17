import { motion } from "framer-motion";

const AboutSection = () => {
  return (
    <section id="about" className="section-padding my-0" style={{ backgroundColor: '#f5f7f2' }}>
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16">
          
          <span className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground block mb-4">
            Brand overview
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-foreground">
            About BioLogica
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left — paragraphs */}
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6">
            
            <p className="text-base text-muted-foreground leading-relaxed">BioLogica is a premium pet nutrition brand focused on advanced daily nutrition support for Indian dogs. We design organ-based, gut-support and omega-rich toppers that integrate smoothly into everyday home-cooked and kibble diets.

            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              Our formulations are built on established canine nutrition science, referencing AAFCO and FEDIAF guidelines, and are produced in WHO-GMP+ and FAMI-QS certified facilities that follow strict quality and traceability systems.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              Each product targets a specific area - stool consistency, joint comfort, skin and coat health or overall vitality - so you can choose exactly what your dog needs rather than relying on generic multivitamins.
            </p>
          </motion.div>

          {/* Right — pill, bullets, tags */}
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}>
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-border rounded-sm mb-8">
              <span className="w-2 h-2 rounded-full bg-omega" />
              <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
                Clinical yet dog-parent friendly
              </span>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="border-l-[3px] border-gut pl-4 text-sm text-foreground">
                Vet-led formulations built specifically for dogs
              </li>
              <li className="border-l-[3px] border-gut pl-4 text-sm text-foreground">
                Designed for Indian diets, lifestyles and climates
              </li>
              <li className="border-l-[3px] border-gut pl-4 text-sm text-foreground">
                Clean-label, focused on meaningful functional ingredients
              </li>
            </ul>

            <div className="flex flex-wrap gap-3">
              {["Vet-formulated", "AAFCO & FEDIAF referenced", "WHO-GMP+ & FAMI-QS"].map((tag) =>
              <span
                key={tag}
                className="px-3 py-1.5 bg-secondary text-xs font-medium text-muted-foreground border border-border rounded-none">
                
                  {tag}
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>);

};

export default AboutSection;