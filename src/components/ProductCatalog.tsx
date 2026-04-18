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

const panelBackground: Record<ProductColor, string> = {
  omega:
    "radial-gradient(ellipse at center, rgba(147,197,253,0.35) 0%, rgba(219,234,254,0.15) 60%, rgba(255,255,255,0) 100%)",
  organ:
    "radial-gradient(ellipse at center, rgba(251,207,232,0.35) 0%, rgba(252,231,243,0.15) 60%, rgba(255,255,255,0) 100%)",
  gut:
    "radial-gradient(ellipse at center, rgba(187,247,208,0.35) 0%, rgba(220,252,231,0.15) 60%, rgba(255,255,255,0) 100%)",
};

const badgeClasses: Record<ProductColor, string> = {
  omega: "bg-blue-100 text-blue-700",
  organ: "bg-pink-100 text-pink-700",
  gut: "bg-green-100 text-green-700",
};

const dotClasses: Record<ProductColor, string> = {
  omega: "bg-blue-500",
  organ: "bg-pink-500",
  gut: "bg-green-500",
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
            const imageLeft = product.imageSide === "left";
            const imageX = imageLeft ? -40 : 40;

            const ImagePanel = (
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, x: imageX }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative flex items-center justify-center min-h-[320px] md:min-h-[560px] overflow-hidden"
                style={{ background: panelBackground[product.color] }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-contain motion-safe:animate-product-float hover:scale-[1.04] transition-transform duration-500 ease-out"
                  style={{
                    height: "260px",
                    maxHeight: "380px",
                    filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.12))",
                    animationDelay: prefersReducedMotion ? undefined : product.floatDelay,
                  }}
                  // Use responsive height via inline style + class fallback
                  onLoad={(e) => {
                    // ensure desktop height
                    const el = e.currentTarget;
                    if (window.matchMedia("(min-width: 768px)").matches) {
                      el.style.height = "380px";
                    }
                  }}
                />
              </motion.div>
            );

            const ContentPanel = (
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                className="bg-background flex items-center p-8 md:p-12"
              >
                <div className="max-w-[480px] w-full">
                  {/* Badge */}
                  <span
                    className={`inline-flex ${badgeClasses[product.color]} text-xs font-semibold tracking-[0.15em] uppercase rounded-full px-3 py-1`}
                  >
                    {product.badgeLabel}
                  </span>

                  {/* Name */}
                  <h3 className="text-3xl font-bold tracking-tight text-foreground mt-3">
                    {product.name}
                  </h3>

                  {/* Descriptor */}
                  <p className="text-sm text-muted-foreground mt-1">
                    {product.descriptor}
                  </p>

                  {/* Divider */}
                  <div className="border-t border-border/40 my-6" />

                  {/* Benefit tags */}
                  <div className="flex gap-2 flex-wrap">
                    {product.benefits.map((b) => (
                      <span
                        key={b}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground/70 border border-border/60 rounded-full px-3 py-1.5"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${dotClasses[product.color]}`} />
                        {b}
                      </span>
                    ))}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed mt-6">
                    {product.description}
                  </p>

                  {/* CTA */}
                  <a
                    href={product.amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-foreground text-background text-xs font-semibold tracking-wide px-6 py-3 hover:opacity-90 transition-opacity mt-8 inline-flex items-center gap-2"
                  >
                    View on Amazon India
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            );

            return (
              <div
                key={product.name}
                data-product={product.color}
                className="grid grid-cols-1 md:grid-cols-2 min-h-[560px]"
              >
                {imageLeft ? (
                  <>
                    {ImagePanel}
                    {ContentPanel}
                  </>
                ) : (
                  <>
                    {/* On mobile, image still appears first (DOM order) */}
                    <div className="md:hidden">{ImagePanel}</div>
                    {ContentPanel}
                    <div className="hidden md:block">{ImagePanel}</div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ProductCatalog;
