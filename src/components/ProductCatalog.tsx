import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Zap,
  Droplets,
  Brain,
  Heart,
  Flame,
  Shield,
  Leaf,
  CircleDot,
  Activity,
  type LucideIcon,
} from "lucide-react";
import organProduct from "@/assets/organ-product.png";
import gutProduct from "@/assets/gut-product.png";
import omegaProduct from "@/assets/omega-product.png";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";

type ProductColor = "omega" | "organ" | "gut";

interface Product {
  name: string;
  subtitle: string;
  description: string;
  image: string;
  color: ProductColor;
  badgeLabel: string;
  icons: { icon: LucideIcon; label: string }[];
  cta: string;
  amazonUrl: string;
  price: string;
  layout: "text-left" | "image-left";
  floatDelay: string;
}

const products: Product[] = [
  {
    name: "Omega Balance+",
    subtitle: "Marine-derived omega topper",
    description:
      "Omega Balance+ is a marine-derived topper with green-lipped mussel (GLM) and omega fatty acids to support joint comfort, skin and coat health and overall cardiovascular and brain function in dogs.",
    image: omegaProduct,
    color: "omega",
    badgeLabel: "OMEGA SYSTEM",
    icons: [
      { icon: Zap, label: "Joint Mobility" },
      { icon: Droplets, label: "Skin & Coat" },
      { icon: Brain, label: "Brain & Heart" },
    ],
    cta: "View Omega Balance+ on Amazon India",
    amazonUrl: "https://amazon.in/biologica",
    price: "₹1,399",
    layout: "text-left",
    floatDelay: "0s",
  },
  {
    name: "Organ Balance+",
    subtitle: "Daily organ-based topper",
    description:
      "Organ Balance+ is a dehydrated, organ-based topper that helps support overall vitality, natural micronutrient intake and immune function in dogs.",
    image: organProduct,
    color: "organ",
    badgeLabel: "ORGAN SYSTEM",
    icons: [
      { icon: Heart, label: "Vitality" },
      { icon: Flame, label: "Energy" },
      { icon: Shield, label: "Immunity" },
    ],
    cta: "View Organ Balance+ on Amazon India",
    amazonUrl: "https://amazon.in/biologica",
    price: "₹1,599",
    layout: "image-left",
    floatDelay: "1.8s",
  },
  {
    name: "Gut Balance+",
    subtitle: "Daily gut support topper",
    description:
      "Gut Balance+ is a 100% vegetarian, gut-friendly topper formulated to support healthy digestion, stool consistency and gut lining integrity in dogs.",
    image: gutProduct,
    color: "gut",
    badgeLabel: "GUT SYSTEM",
    icons: [
      { icon: Leaf, label: "Prebiotics" },
      { icon: CircleDot, label: "Stool Quality" },
      { icon: Activity, label: "Digestion" },
    ],
    cta: "View Gut Balance+ on Amazon India",
    amazonUrl: "https://amazon.in/biologica",
    price: "₹1,299",
    layout: "text-left",
    floatDelay: "0.9s",
  },
];

const bandBackground: Record<ProductColor, string> = {
  omega:
    "radial-gradient(ellipse at 70% 50%, rgba(14,165,233,0.10) 0%, transparent 65%)",
  organ:
    "radial-gradient(ellipse at 30% 50%, rgba(249,115,22,0.10) 0%, transparent 65%)",
  gut:
    "radial-gradient(ellipse at 70% 50%, rgba(5,150,105,0.10) 0%, transparent 65%)",
};

const colorMap: Record<ProductColor, { text: string; border: string; bgSoft: string }> = {
  omega: { text: "text-omega", border: "border-omega", bgSoft: "bg-omega/10" },
  organ: { text: "text-organ", border: "border-organ", bgSoft: "bg-organ/10" },
  gut: { text: "text-gut", border: "border-gut", bgSoft: "bg-gut/10" },
};

const ProductCatalog = () => {
  const prefersReducedMotion = useReducedMotion();
  const [loadedCount, setLoadedCount] = useState(0);
  const allLoaded = loadedCount >= products.length;

  return (
    <section id="products" className="bg-background">
      {/* Hidden preloaders */}
      <div className="sr-only" aria-hidden>
        {products.map((p) => (
          <img
            key={`preload-${p.name}`}
            src={p.image}
            alt=""
            onLoad={() => setLoadedCount((c) => c + 1)}
            onError={() => setLoadedCount((c) => c + 1)}
          />
        ))}
      </div>

      {/* Section heading */}
      <div className="section-padding pb-0 max-w-[1400px] mx-auto">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-12"
        >
          <span className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground block mb-4">
            Product family
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-foreground">
            The BioLogica topper range
          </h2>
        </motion.div>
      </div>

      {!allLoaded ? (
        <div
          className="section-padding pt-0 max-w-[1400px] mx-auto space-y-12"
          aria-busy="true"
          aria-live="polite"
        >
          {products.map((p) => (
            <ProductCardSkeleton key={`skeleton-${p.name}`} />
          ))}
        </div>
      ) : (
        <div>
          {products.map((product) => {
            const cls = colorMap[product.color];
            const imageLeft = product.layout === "image-left";

            return (
              <div
                key={product.name}
                data-product={product.color}
                className="relative overflow-hidden"
                style={{
                  minHeight: "480px",
                  background: bandBackground[product.color],
                }}
              >
                <div className="section-padding max-w-[1400px] mx-auto">
                  <div
                    className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
                      imageLeft ? "lg:[&>*:first-child]:order-2" : ""
                    }`}
                  >
                    {/* Glass content card */}
                    <motion.div
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl p-8 max-w-[480px] w-full"
                      style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.06)" }}
                    >
                      {/* Badge pill */}
                      <span
                        className={`inline-flex ${cls.bgSoft} ${cls.text} text-xs font-semibold tracking-widest uppercase rounded-full px-3 py-1 mb-4`}
                      >
                        {product.badgeLabel}
                      </span>

                      {/* Headline */}
                      <h3 className="text-3xl font-bold tracking-tight text-foreground mb-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        {product.subtitle}
                      </p>

                      {/* 3-column ingredient icons */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        {product.icons.map(({ icon: Icon, label }) => (
                          <div
                            key={label}
                            className="flex flex-col items-center text-center gap-2"
                          >
                            <Icon className={`w-6 h-6 ${cls.text}`} strokeWidth={1.75} />
                            <span className="text-xs text-muted-foreground leading-tight">
                              {label}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Science callout */}
                      <p
                        className={`italic text-sm text-muted-foreground border-l-2 ${cls.border} pl-3 mt-4`}
                      >
                        {product.description}
                      </p>

                      {/* CTA */}
                      <a
                        href={product.amazonUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-foreground text-background text-xs font-semibold tracking-wide px-6 py-3 hover:opacity-90 transition-opacity mt-6 inline-flex items-center gap-2"
                      >
                        {product.cta}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </motion.div>

                    {/* Product image */}
                    <div className="flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-56 md:w-72 lg:w-80 object-contain motion-safe:animate-product-float hover:scale-[1.04] transition-transform duration-300 ease-out"
                        style={{
                          filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.12))",
                          animationDelay: prefersReducedMotion ? undefined : product.floatDelay,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ProductCatalog;
