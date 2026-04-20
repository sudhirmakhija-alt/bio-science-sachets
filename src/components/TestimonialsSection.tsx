import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "Remy was limping after his morning walks for months. Three weeks on Omega Balance+ and he's back to his normal self. I genuinely didn't expect results this fast.",
    author: "Arjun S., Bangalore",
    dog: "Golden Retriever",
  },
  {
    quote:
      "I've tried three different gut supplements for Coco and nothing stuck. Gut Balance+ is the first one where I've actually seen consistent stools within a week. Simple format, no fuss.",
    author: "Meera K., Mumbai",
    dog: "Beagle",
  },
  {
    quote:
      "The sachet format is the reason I actually use this every day. No scooping, no waste, no forgetting. Organ Balance+ has made a visible difference to Bruno's coat in about a month.",
    author: "Rohan T., Delhi",
    dog: "Indie Dog",
  },
];

const TestimonialsSection = () => {
  return (
    <section
      id="reviews"
      className="pt-20 md:pt-24 pb-8 md:pb-10 px-6 md:px-12 backdrop-blur-sm bg-stone-50"
    >
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, transform: "translateY(16px)" }}
          whileInView={{ opacity: 1, transform: "translateY(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-muted-foreground/50 block mb-4">
            Feedback from our trials
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-foreground">
            What dog parents are saying
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((t, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, transform: "translateY(24px)" }}
              whileInView={{ opacity: 1, transform: "translateY(0px)" }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col h-full bg-white border border-border rounded-lg p-8 shadow-sm card-lift"
            >
              <Quote
                className="absolute top-6 right-6 w-10 h-10 text-gut/20"
                strokeWidth={1.5}
                aria-hidden="true"
              />

              <div className="flex items-center gap-1 mb-5" aria-label="5 star rating">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <blockquote className="text-base leading-relaxed text-gray-700 flex-1">
                "{t.quote}"
              </blockquote>

              <figcaption className="mt-6 pt-6 border-t border-border">
                <div className="text-sm font-semibold text-foreground">
                  {t.author}
                </div>
                <div className="text-xs text-muted-foreground/60 mt-0.5">
                  {t.dog}
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <p className="text-xs text-muted-foreground/40 text-center mt-8">
          Complementary feed only. No therapeutic claims.
        </p>
      </div>
    </section>
  );
};

export default TestimonialsSection;
