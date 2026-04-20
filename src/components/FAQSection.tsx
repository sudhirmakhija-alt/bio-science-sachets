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
  {
    q: "What is a dog food topper?",
    a: "A topper is a nutrient-dense addition mixed into your dog's regular food. It fills nutritional gaps without replacing their main meal — think of it as a daily vitamin in real-food form.",
  },
  {
    q: "What is Green-Lipped Mussel (GLM) and why is it in Omega Balance+?",
    a: "GLM is a New Zealand shellfish clinically proven to reduce joint inflammation, improve mobility, and support heart and brain health in dogs. It's one of the most bioavailable marine omega sources available.",
  },
  {
    q: "Are BioLogica products vet recommended?",
    a: "Yes. All three BioLogica toppers — Omega Balance+, Organ Balance+, and Gut Balance+ — are vet recommended and formulated with ingredients backed by clinical research.",
  },
  {
    q: "Can I give my dog multiple BioLogica products at the same time?",
    a: "Yes. The three products target different systems — joints and coat, immunity and energy, and gut health — and are designed to complement each other. Many dog parents use all three in rotation.",
  },
  {
    q: "Is Gut Balance+ safe for dogs with sensitive stomachs?",
    a: "Yes — it's 100% vegetarian and specifically formulated for dogs with nausea, loose stools, or gut lining issues. The ingredients soothe rather than stress the digestive system.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="section-padding backdrop-blur-sm" style={{ backgroundColor: '#f5f7f2' }}>
      <div className="max-w-[900px] mx-auto">
        <motion.div
          initial={{ opacity: 0, transform: "translateY(16px)" }}
          whileInView={{ opacity: 1, transform: "translateY(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-muted-foreground/50 block mb-4">
            Reassurance
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-foreground">
            Frequently asked questions
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, transform: "translateY(12px)" }}
          whileInView={{ opacity: 1, transform: "translateY(0px)" }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <Accordion type="single" collapsible className="space-y-0">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border-b border-border group/faq rounded-sm transition-colors duration-150 hover:bg-gut/[0.04]"
              >
                <AccordionTrigger className="py-6 px-3 text-sm md:text-base font-semibold text-foreground text-left hover:no-underline group-hover/faq:text-gut transition-colors duration-150">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-6 px-3">
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
