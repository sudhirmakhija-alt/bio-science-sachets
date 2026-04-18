import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import organProduct from "@/assets/organ-product.png";
import gutProduct from "@/assets/gut-product.png";
import omegaProduct from "@/assets/omega-product.png";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";

type ProductColor = "omega" | "organ" | "gut";

interface Product {
  name: string;
  badgeLabel: string;
  descriptor: string;
  description: string;
  image: string;
  imageAlt: string;
  color: ProductColor;
  benefits: string[];
  amazonUrl: string;
  imageSide: "left" | "right";
  floatDelay: string;
}

const products: Product[] = [
  {
    name: "Omega Balance+",
    badgeLabel: "OMEGA SYSTEM",
    descriptor: "Marine-derived omega topper with green-lipped mussel",
    description:
      "Omega Balance+ is a marine-derived topper with green-lipped mussel (GLM) and omega fatty acids to support joint comfort, skin and coat health and overall cardiovascular and brain function in dogs.",
    image: omegaProduct,
    color: "omega",
    benefits: ["Joint Mobility", "Skin & Coat", "Brain & Heart"],
    amazonUrl: "https://amazon.in/biologica",
    imageSide: "left",
    floatDelay: "0s",
  },
  {
    name: "Organ Balance+",
    badgeLabel: "ORGAN SYSTEM",
    descriptor: "Dehydrated organ-based daily vitality topper",
    description:
      "Organ Balance+ is a dehydrated, organ-based topper that helps support overall vitality, natural micronutrient intake and immune function in dogs.",
    image: organProduct,
    color: "organ",
    benefits: ["Vitality", "Energy", "Immunity"],
    amazonUrl: "https://amazon.in/biologica",
    imageSide: "right",
    floatDelay: "1.8s",
  },
  {
    name: "Gut Balance+",
    badgeLabel: "GUT SYSTEM",
    descriptor: "100% vegetarian gut support and digestion topper",
    description:
      "Gut Balance+ is a 100% vegetarian, gut-friendly topper formulated to support healthy digestion, stool consistency and gut lining integrity in dogs.",
    image: gutProduct,
    color: "gut",
    benefits: ["Digestion", "Stool Quality", "Gut Lining"],
    amazonUrl: "https://amazon.in/biologica",
    imageSide: "left",
    floatDelay: "0.9s",
  },
];

const cardBackground: Record<ProductColor, string> = {
  omega:
    "linear-gradient(135deg, rgba(186,230,253,0.25) 0%, rgba(224,242,254,0.12) 100%)",
  organ:
    "linear-gradient(135deg, rgba(251,207,232,0.25) 0%, rgba(252,231,243,0.12) 100%)",
  gut:
    "linear-gradient(135deg, rgba(187,247,208,0.25) 0%, rgba(220,252,231,0.12) 100%)",
};

const badgeClasses: Record<ProductColor, string> = {
  omega: "bg-blue-200/60 text-blue-800",
  organ: "bg-pink-200/60 text-pink-800",
  gut: "bg-green-200/60 text-green-800",
};

const tagClasses: Record<ProductColor, string> = {
  omega: "text-blue-700 border-blue-700/20",
  organ: "text-pink-700 border-pink-700/20",
  gut: "text-green-700 border-green-700/20",
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

      {/* Section header */}
      <div className="py-16 px-6 text-center max-w-[1400px] mx-auto">
        <span className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground block">
          THE RANGE
        </span>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mt-2">
          Three systems. One daily routine.
        </h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
          Each topper targets a specific area. Use one or combine all three.
        </p>
      </div>

      <div className="px-4 md:px-8 pb-20 max-w-[1400px] mx-auto">
        {!allLoaded ? (
          <div className="space-y-6" aria-busy="true" aria-live="polite">
            {products.map((p) => (
              <ProductCardSkeleton key={`skeleton-${p.name}`} />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {products.map((product, idx) => {
              const imageLeft = product.imageSide === "left";

              const ImageColumn = (
                <div className="flex items-center justify-center py-8 md:py-12 px-6 md:px-8">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-contain motion-safe:md:animate-product-float"
                    style={{
                      height: "330px",
                      mixBlendMode: "multiply",
                      animationDelay: prefersReducedMotion ? undefined : product.floatDelay,
                    }}
                    onLoad={(e) => {
                      const el = e.currentTarget;
                      if (window.matchMedia("(min-width: 768px)").matches) {
                        el.style.height = "480px";
                      }
                    }}
                  />
                </div>
              );

              const ContentColumn = (
                <div className="flex items-center py-8 md:py-12 px-6 md:px-10">
                  <div className="w-full max-w-[480px]">
                    {/* Badge */}
                    <span
                      className={`inline-flex ${badgeClasses[product.color]} text-xs font-semibold tracking-[0.15em] uppercase rounded-full px-3 py-1 mb-4`}
                    >
                      {product.badgeLabel}
                    </span>

                    {/* Name */}
                    <h3 className="text-3xl font-bold tracking-tight text-foreground">
                      {product.name}
                    </h3>

                    {/* Descriptor */}
                    <p className="text-sm text-muted-foreground mt-1 mb-6">
                      {product.descriptor}
                    </p>

                    {/* Benefit tags */}
                    <div className="flex gap-2 flex-wrap">
                      {product.benefits.map((b) => (
                        <span
                          key={b}
                          className={`inline-flex items-center text-xs font-medium border rounded-full px-3 py-1.5 ${tagClasses[product.color]}`}
                        >
                          {b}
                        </span>
                      ))}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-foreground/70 leading-relaxed mt-6">
                      {product.description}
                    </p>

                    {/* CTA */}
                    <a
                      href={product.amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-foreground text-background text-xs font-semibold tracking-wide px-6 py-3 rounded-lg hover:opacity-90 transition-opacity mt-8 inline-flex items-center gap-2"
                    >
                      View on Amazon India
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );

              return (
                <motion.div
                  key={product.name}
                  id={product.color}
                  data-product={product.color}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
                  whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                    delay: prefersReducedMotion ? 0 : idx * 0.15,
                  }}
                  className="rounded-2xl overflow-hidden border border-border/30 grid grid-cols-1 md:grid-cols-2"
                  style={{
                    background: cardBackground[product.color],
                    boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                  }}
                >
                  {imageLeft ? (
                    <>
                      {ImageColumn}
                      {ContentColumn}
                    </>
                  ) : (
                    <>
                      {/* Mobile: image first */}
                      <div className="md:hidden">{ImageColumn}</div>
                      {ContentColumn}
                      <div className="hidden md:block">{ImageColumn}</div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductCatalog;
