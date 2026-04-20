import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

type Article = {
  id: string;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  image: string;
  imagePosition?: string;
};

const articles: Article[] = [
  {
    id: "glm",
    slug: "green-lipped-mussel-dogs",
    category: "Joints & Mobility",
    title: "The New Zealand Shellfish That's Changing How We Think About Dog Joints",
    excerpt:
      "Most people haven't heard of Green-Lipped Mussel. Which is strange, because it might be the single best thing you can give a dog with stiff joints, a dull coat, or low energy.",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80&auto=format",
  },
  {
    id: "toppers-vs-supplements",
    slug: "dog-food-toppers-vs-supplements",
    category: "Nutrition",
    title: "Toppers vs Supplements. They Are Not the Same Thing.",
    excerpt:
      "Dog owners use these words interchangeably. They shouldn't. The difference matters more than most people realise, and understanding it will help you make a much better choice for your dog.",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&q=80&auto=format",
    imagePosition: "center 35%",
  },
  {
    id: "gut-health",
    slug: "leaky-gut-dogs",
    category: "Gut Health",
    title: "Your Dog's Gut Is Trying to Tell You Something. Here's How to Listen.",
    excerpt:
      "Loose stools. Itchy skin. Low energy after meals. Recurring ear infections. Most dog owners treat these as separate problems. They are usually not.",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80&auto=format",
  },
  {
    id: "ancestral-organ",
    slug: "organ-meat-dogs",
    category: "Immunity",
    title: "The Food Your Dog's Ancestors Ate First. And Why Modern Dogs Are Missing It.",
    excerpt:
      "When a wolf makes a kill, the first thing it eats isn't the muscle meat. It's the organs. This isn't random behaviour. It's nutritional intelligence that took thousands of years to develop.",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80&auto=format",
  },
  {
    id: "which-one",
    slug: "choosing-dog-topper",
    category: "Getting Started",
    title: "Not Every Dog Needs the Same Thing. Here's How to Figure Out What Yours Does.",
    excerpt:
      "The three BioLogica toppers are not interchangeable. They do different things, for different dogs, at different life stages. Here is how to think about which one makes sense for yours.",
    image: "https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=800&q=80&auto=format",
  },
];

const ArticleCard = ({ article, hero = false, delay = 0 }: { article: Article; hero?: boolean; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, transform: "translateY(20px)" }}
    whileInView={{ opacity: 1, transform: "translateY(0px)" }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    className="group"
  >
    <Link
      to={`/blog/${article.slug}`}
      className={`relative flex flex-col overflow-hidden rounded-2xl bg-gray-900 text-left shadow-md transition-shadow duration-300 hover:shadow-2xl hover:shadow-black/40 ${
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
          style={{ objectPosition: article.imagePosition ?? (hero ? "center top" : "top") }}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
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
        <span className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-semibold text-gut transition-colors duration-150 group-hover:text-gut/70">
          Read article
          <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  </motion.div>
);

const JournalSection = () => {
  const [hero, ...rest] = articles;

  return (
    <section id="journal" className="-mt-px section-padding bg-gray-950">
      <div className="mx-auto max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, transform: "translateY(20px)" }}
          whileInView={{ opacity: 1, transform: "translateY(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 md:mb-8"
        >
          <span className="mb-4 block text-[11px] font-medium uppercase tracking-[0.25em] text-gray-500/70">
            From the Journal
          </span>
          <h2 className="text-4xl font-black tracking-[-0.03em] text-white md:text-5xl">
            Things worth knowing about your dog
          </h2>
          <p className="mt-4 text-base text-gray-500 md:text-lg">
            No jargon. No fluff. Just useful things.
          </p>
        </motion.div>

        <div className="grid gap-6 md:gap-8">
          <ArticleCard article={hero} hero delay={0} />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            {rest.map((article, i) => (
              <ArticleCard key={article.id} article={article} delay={i * 0.06} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JournalSection;
