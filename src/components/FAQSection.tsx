import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Can I use BioLogica toppers with my dog's current food?",
    a: "Yes. BioLogica toppers are designed to mix easily with common feeding patterns in India, including kibble, home-cooked diets or a combination of both. They do not replace a complete and balanced diet but provide additional functional support on top of regular food.",
  },
  {
    q: "Are these suitable for puppies or only adult dogs?",
    a: "Most formulations are suitable for adult dogs. Use in puppies, pregnant or lactating dogs, or dogs with medical conditions should always be discussed with your veterinarian first, as growth and special conditions require tailored nutrient intakes.",
  },
  {
    q: "How long should I use a topper before expecting results?",
    a: "Digestive support products often show stool and comfort changes within 1 to 3 weeks. Joint and mobility support can take several weeks of consistent use. We recommend using the product daily for at least 6 to 8 weeks, alongside appropriate diet and exercise, before evaluating long-term impact.",
  },
  {
    q: "Are BioLogica products regulated or tested?",
    a: "Our formulations are developed with reference to AAFCO and FEDIAF guidelines and manufactured in WHO-GMP+ and FAMI-QS compliant facilities with documented quality systems. We follow labelling and safety practices aligned with global pet nutrition norms and continuously review emerging research in pet nutraceuticals.",
  },
  {
    q: "Where can I buy BioLogica?",
    a: "You can purchase BioLogica toppers on Amazon India. For questions, reach our team via the contact details on our Amazon store page.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="section-padding backdrop-blur-sm" style={{ backgroundColor: '#f5f7f2' }}>
      <div className="max-w-[900px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground block mb-4">
            Reassurance
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-foreground">
            Frequently asked questions
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-0">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-b border-border group/faq rounded-sm transition-colors hover:bg-gut/[0.04]">
                <AccordionTrigger className="py-6 px-3 text-sm md:text-base font-semibold text-foreground text-left hover:no-underline group-hover/faq:text-gut transition-colors">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-6">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
