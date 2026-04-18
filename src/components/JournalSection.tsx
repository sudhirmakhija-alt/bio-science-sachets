import { useState } from "react";
import { motion } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

type Article = {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  image: string;
  content: string[];
};

const articles: Article[] = [
  {
    id: "glm",
    category: "Joints & Mobility",
    title: "The New Zealand Shellfish That's Changing How We Think About Dog Joints",
    excerpt:
      "Most people haven't heard of Green-Lipped Mussel. Which is strange, because it might be the single best thing you can give a dog with stiff joints, a dull coat, or low energy.",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80&auto=format",
    content: [
      "Most people haven't heard of Green-Lipped Mussel. Which is strange, because it might be the single best thing you can give a dog with stiff joints, a dull coat, or low energy.",
      "Here's what it is and why it works.",
      "## What is Green-Lipped Mussel?",
      "Green-Lipped Mussel (GLM) is a shellfish native to New Zealand. The Maori people have eaten it for centuries, and researchers noticed something interesting: coastal Maori populations had significantly lower rates of arthritis than inland populations. The difference? Their diet.",
      "GLM contains a rare omega fatty acid called ETA (eicosatetraenoic acid) that you won't find in regular fish oil. ETA directly blocks the specific enzymes that cause joint inflammation. Fish oil works on only one of those pathways. GLM works on both.",
      "## What does that mean for your dog?",
      "If your dog is slowing down on walks, reluctant to climb stairs, or showing early signs of hip stiffness, inflammation is usually the cause. Most dog owners reach for glucosamine, which supports cartilage but does not address the inflammation itself. GLM does both.",
      "Studies show dogs on GLM supplementation show measurable improvement in mobility within 4 to 6 weeks. Coat condition improves too, because the same omega fatty acids that reduce internal inflammation also nourish skin and hair follicles from the inside out.",
      "## Why isn't everyone using it?",
      "Cost, mostly. Quality GLM is expensive to source. A lot of products on the market use such small amounts that it has no real effect. You need a meaningful dose of properly processed GLM for it to work.",
      "The other issue is how it's processed. GLM needs to be cold-processed or freeze-dried to preserve the bioactive lipids. Heat destroys the very compounds that make it effective. If a supplement has gone through high-temperature manufacturing, the GLM in it is essentially decorative.",
      "## What to look for",
      "When choosing a GLM product for your dog, look for cold-processed or freeze-dried GLM (not a heated extract), a clear indication of GLM content by weight, and no synthetic omega sources used as fillers.",
      "Omega Balance+ by BioLogica uses marine-grade GLM in a cold-processed sachet format. One sachet a day mixed into food. No measuring, no guesswork.",
    ],
  },
  {
    id: "toppers-vs-supplements",
    category: "Nutrition",
    title: "Toppers vs Supplements. They Are Not the Same Thing.",
    excerpt:
      "Dog owners use these words interchangeably. They shouldn't. The difference matters more than most people realise, and understanding it will help you make a much better choice for your dog.",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=80&auto=format",
    content: [
      "Dog owners use these words interchangeably. They shouldn't. The difference matters more than most people realise.",
      "## What's a supplement?",
      "A supplement is designed to add one specific nutrient that's missing. A vitamin D capsule. An iron tablet. A single-purpose intervention.",
      "Most dog supplements on the market are exactly this: isolated compounds, synthesised in a lab, pressed into a pill or stirred into a powder. They're cheap to produce, easy to dose, and they do a decent job of hitting a specific number on a blood panel.",
      "The problem is that isolated nutrients don't behave the same way in the body as nutrients from real food. Vitamin D from a capsule is absorbed differently than vitamin D from organ meat. Omega-3 from a synthetic source behaves differently than omega-3 from whole marine tissue. Your dog's gut evolved to process food, not isolated pharmaceutical compounds.",
      "## What's a topper?",
      "A topper is a whole-food addition to your dog's regular meal. Instead of isolating nutrients, it delivers them in the same matrix they would appear in naturally, alongside co-factors, enzymes, and other compounds that help the body actually absorb and use them.",
      "Think of it this way. Eating an orange gives you vitamin C. So does taking a synthetic vitamin C tablet. But the orange also delivers bioflavonoids that increase absorption by up to 30 percent. The tablet gives you the number. The orange gives you the result.",
      "A good topper does the same thing. It fills nutritional gaps using real food, so the nutrients land where they are supposed to.",
      "## Which one does your dog actually need?",
      "If your dog has a diagnosed deficiency that needs to be corrected quickly, a targeted supplement under vet guidance makes sense.",
      "For day-to-day nutrition support, a topper is almost always the better choice. You are not trying to fix one thing. You are maintaining overall health, coat condition, joint function, digestion, and energy over the long term. Real food does that better than isolated compounds.",
      "The sachet format matters too. Pre-portioned sachets mean you are giving the same amount every day without measuring. And because each sachet is sealed, the ingredients are not oxidising between uses the way an open tub of powder does.",
    ],
  },
  {
    id: "gut-health",
    category: "Gut Health",
    title: "Your Dog's Gut Is Trying to Tell You Something. Here's How to Listen.",
    excerpt:
      "Loose stools. Itchy skin. Low energy after meals. Recurring ear infections. Most dog owners treat these as separate problems. They are usually not.",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80&auto=format",
    content: [
      "Loose stools. Itchy skin. Low energy after meals. Recurring ear infections.",
      "Most dog owners treat these as separate problems. They are usually not. They are often the same problem showing up in different places, and that problem is gut health.",
      "## What is leaky gut in dogs?",
      "The gut lining is designed to be selectively permeable. It lets nutrients through and keeps everything else out. When the gut lining is damaged or inflamed, that selectivity breaks down. Partially digested food particles, bacteria, and toxins pass through into the bloodstream. The immune system, encountering these things where they should not be, responds with inflammation.",
      "That inflammation can show up anywhere. Joints. Skin. Ears. Brain. Which is why gut problems in dogs so often look like completely unrelated issues.",
      "## Signs your dog might have a compromised gut",
      "Loose stools or inconsistent stool quality. Bloating or visible discomfort after eating. Skin rashes, hot spots, or persistent itching without a clear allergen. Recurring ear infections. Food sensitivities that seem to be getting worse over time. Low energy after meals. Excessive gas. A dull or brittle coat despite a decent diet.",
      "No single symptom confirms leaky gut. But if your dog is showing three or more of these, the gut is worth looking at.",
      "## What damages the gut lining?",
      "Antibiotics (necessary sometimes, but they wipe out the microbiome). Processed food with artificial preservatives. Chronic stress. Overuse of anti-inflammatories like Metacam. Grain-heavy diets that spike blood sugar and feed the wrong bacteria.",
      "## What actually helps",
      "The gut lining can repair itself, but it needs the right inputs. Fermentable fibre feeds the beneficial bacteria that produce short-chain fatty acids, which directly repair the cells lining the gut wall. Anti-inflammatory plant compounds reduce the local inflammation that prevents healing. Soothing, mucilaginous ingredients coat the gut while repair happens underneath.",
      "This is the logic behind Gut Balance+. It is a food-based gut repair formula designed to address the root cause, not just the symptoms.",
      "If your dog has been on antibiotics recently, has recurring digestive issues, or just seems off in ways you cannot quite pin down, starting with the gut is almost always the right call.",
    ],
  },
  {
    id: "ancestral-organ",
    category: "Immunity",
    title: "The Food Your Dog's Ancestors Ate First. And Why Modern Dogs Are Missing It.",
    excerpt:
      "When a wolf makes a kill, the first thing it eats isn't the muscle meat. It's the organs. This isn't random behaviour. It's nutritional intelligence that took thousands of years to develop.",
    image: "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=800&q=80&auto=format",
    content: [
      "When a wolf makes a kill, the first thing it eats is not the muscle meat. It is the organs. Liver first. Then kidney, heart, and spleen. The muscle meat comes last, or gets left for scavengers.",
      "This is not random behaviour. It is nutritional intelligence that took thousands of years to develop.",
      "## Why organs are different",
      "Muscle meat is mostly protein and fat. Good, but not complete.",
      "Organs are where the animal stores its most concentrated nutrients. The liver alone contains more vitamin A, B12, iron, copper, zinc, and CoQ10 than virtually any other food. Kidney is rich in selenium and riboflavin. Heart is one of the best natural sources of CoQ10 on the planet, which is essential for cardiac function and cellular energy.",
      "These are not trace amounts. Liver contains roughly 10 to 100 times the nutrients of the equivalent weight in muscle meat, depending on the nutrient you are measuring.",
      "## Why modern dog food is missing this",
      "Organ meat is inconvenient. It is perishable, has a short shelf life, and does not process well into kibble. Most commercial dog food uses muscle meat, grains, and synthetic vitamin additions to hit the numbers on a nutritional label.",
      "Hitting the number and delivering the nutrient are not the same thing. Synthetic vitamin A and natural vitamin A from liver are processed completely differently by the body. Bioavailability matters.",
      "## What organ feeding actually does",
      "Dogs fed regular organ-based nutrition typically show better coat condition and shine, improved muscle tone, higher sustained energy levels, a stronger immune response, and better recovery after illness or surgery.",
      "Organ Balance+ uses dehydrated organ meat in a concentrated, shelf-stable form that is easy to add to any meal. One sachet a day puts back what modern dog food takes out.",
    ],
  },
  {
    id: "which-one",
    category: "Getting Started",
    title: "Not Every Dog Needs the Same Thing. Here's How to Figure Out What Yours Does.",
    excerpt:
      "The three BioLogica toppers are not interchangeable. They do different things, for different dogs, at different life stages. Here is how to think about which one makes sense for yours.",
    image: "https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=800&q=80&auto=format",
    content: [
      "The three BioLogica toppers are not interchangeable. They do different things, for different dogs, at different life stages.",
      "## Start with your dog's most obvious issue",
      "If your dog is over 5 years old, slowing down, or showing any signs of joint stiffness, start with Omega Balance+. The Green-Lipped Mussel addresses the inflammation that causes mobility issues, and the coat benefits come as a bonus.",
      "If your dog has recurring digestive problems, has been on antibiotics in the past year, or shows food sensitivities, start with Gut Balance+. Fix the gut first. A lot of other problems including skin, energy, and immunity tend to clear up once the gut is working properly.",
      "If your dog is generally healthy but lacking energy, has a dull coat despite a decent diet, or has been ill recently and needs to rebuild, start with Organ Balance+. The nutrient density of organ meat fills gaps that even a good diet can leave.",
      "## What about using more than one?",
      "The three products target different systems and use different ingredients. There is no overlap and no conflict. A lot of dog parents use all three in rotation.",
      "The pattern that tends to work well: Gut Balance+ three days a week, Omega Balance+ two days a week, Organ Balance+ two days a week.",
      "## A note on expectations",
      "Real food works differently than pharmaceuticals. You will not see a change in 48 hours. What you will see, over 3 to 6 weeks of consistent use, is a dog that moves better, looks better, and seems more like themselves.",
      "That is what we are going for.",
    ],
  },
];

const ArticleCard = ({
  article,
  onOpen,
  hero = false,
}: {
  article: Article;
  onOpen: () => void;
  hero?: boolean;
}) => (
  <motion.button
    type="button"
    onClick={onOpen}
    whileHover={{ y: -4 }}
    transition={{ type: "spring", stiffness: 300, damping: 24 }}
    className={`group relative flex flex-col overflow-hidden rounded-2xl bg-gray-900 text-left shadow-md transition-shadow hover:shadow-2xl hover:shadow-black/40 ${
      hero ? "" : "h-[480px]"
    }`}
  >
    <div
      className={`relative overflow-hidden ${hero ? "h-[480px]" : "h-[240px] flex-shrink-0"}`}
    >
      <img
        src={article.image}
        alt={article.title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover object-[center_top] transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-transparent" />
    </div>
    <div className="flex flex-1 flex-col gap-3 p-6 md:p-8">
      <span className="inline-flex w-fit items-center rounded-full bg-gut/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gut">
        {article.category}
      </span>
      <h3
        className={`font-black tracking-tight text-white ${
          hero ? "text-2xl md:text-4xl leading-[1.15]" : "text-lg md:text-xl leading-snug"
        }`}
      >
        {article.title}
      </h3>
      <p className="line-clamp-2 text-sm leading-relaxed text-gray-400">{article.excerpt}</p>
      <span className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-semibold text-gut transition-colors group-hover:text-gut/80">
        Read article
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </div>
  </motion.button>
);

const ArticleModal = ({ article, onClose }: { article: Article | null; onClose: () => void }) => (
  <Dialog open={!!article} onOpenChange={(open) => !open && onClose()}>
    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-gray-800 bg-gray-950 p-0 text-gray-100 [&>button]:hidden">
      {article && (
        <>
          <button
            onClick={onClose}
            aria-label="Close article"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gray-900/80 text-gray-200 backdrop-blur transition-colors hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative h-64 w-full overflow-hidden md:h-80">
            <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
          </div>
          <article className="px-6 pb-12 pt-2 md:px-12">
            <span className="inline-flex w-fit items-center rounded-full bg-gut/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gut">
              {article.category}
            </span>
            <DialogTitle className="mt-4 font-black tracking-tight text-white text-3xl md:text-4xl leading-[1.15]">
              {article.title}
            </DialogTitle>
            <DialogDescription className="sr-only">{article.excerpt}</DialogDescription>
            <div className="mt-8 space-y-5 font-serif text-[17px] leading-[1.75] text-gray-300">
              {article.content.map((para, i) => {
                if (para.startsWith("## ")) {
                  return (
                    <h2
                      key={i}
                      className="pt-4 font-sans text-xl font-bold tracking-tight text-white md:text-2xl"
                    >
                      {para.replace("## ", "")}
                    </h2>
                  );
                }
                return <p key={i}>{para}</p>;
              })}
            </div>
          </article>
        </>
      )}
    </DialogContent>
  </Dialog>
);

const JournalSection = () => {
  const [active, setActive] = useState<Article | null>(null);
  const [hero, ...rest] = articles;

  return (
    <section id="journal" className="section-padding bg-gray-950">
      <div className="mx-auto max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 md:mb-8"
        >
          <span className="mb-4 block text-xs font-medium uppercase tracking-[0.3em] text-gray-500">
            From the Journal
          </span>
          <h2 className="text-4xl font-black tracking-[-0.03em] text-white md:text-5xl">
            Things worth knowing about your dog
          </h2>
          <p className="mt-4 text-base text-gray-400 md:text-lg">
            No jargon. No fluff. Just useful things.
          </p>
        </motion.div>

        <div className="grid gap-6 md:gap-8">
          <ArticleCard article={hero} onOpen={() => setActive(hero)} hero />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            {rest.map((article) => (
              <ArticleCard key={article.id} article={article} onOpen={() => setActive(article)} />
            ))}
          </div>
        </div>
      </div>

      <ArticleModal article={active} onClose={() => setActive(null)} />
    </section>
  );
};

export default JournalSection;
