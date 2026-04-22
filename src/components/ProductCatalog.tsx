import { useState, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import organProduct from "@/assets/BLP_Organ_Balance_Catalog.png";
import gutProduct from "@/assets/BLP_Gut_Balance_Catalog.png";
import omegaProduct from "@/assets/BLP_Omega_Balance_Catalog.png";

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
}

const products: Product[] = [
  {
    name: "Omega Balance+",
    badgeLabel: "OMEGA SYSTEM",
    descriptor: "Marine-derived omega topper with green-lipped mussel",
    description:
      "Omega Balance+ is a marine-derived topper with green-lipped mussel (GLM) and omega fatty acids to support joint comfort, skin and coat health and overall cardiovascular and brain function in dogs.",
    image: omegaProduct,
    imageAlt: "BioLogica Omega Balance+ dog nutrition topper with Green-Lipped Mussel, 30 sachets",
    color: "omega",
    benefits: ["Joint Mobility", "Skin & Coat", "Brain & Heart"],
    amazonUrl: "https://amazon.in/biologica",
  },
  {
    name: "Organ Balance+",
    badgeLabel: "ORGAN SYSTEM",
    descriptor: "Dehydrated organ-based daily vitality topper",
    description:
      "Organ Balance+ is a dehydrated, organ-based topper that helps support overall vitality, natural micronutrient intake and immune function in dogs.",
    image: organProduct,
    imageAlt: "BioLogica Organ Balance+ dehydrated organ topper for dogs, 30 sachets",
    color: "organ",
    benefits: ["Vitality", "Energy", "Immunity"],
    amazonUrl: "https://amazon.in/biologica",
  },
  {
    name: "Gut Balance+",
    badgeLabel: "GUT SYSTEM",
    descriptor: "100% vegetarian gut support and digestion topper",
    description:
      "Gut Balance+ is a 100% vegetarian, gut-friendly topper formulated to support healthy digestion, stool consistency and gut lining integrity in dogs.",
    image: gutProduct,
    imageAlt: "BioLogica Gut Balance+ vegetarian gut health topper for dogs, 30 sachets",
    color: "gut",
    benefits: ["Digestion", "Stool Quality", "Gut Lining"],
    amazonUrl: "https://amazon.in/biologica",
  },
];

// Dark, rich image area backgrounds — product gets to be the hero
const imageAreaBg: Record<ProductColor, string> = {
  omega: "#2a5a7a", // dark powder blue — same family as pack
  organ: "#7a2840", // dark blush rose  — same family as pack
  gut:   "#2a6040", // dark sage green  — same family as pack
};

// Product accent colors for badges, dots, and glow
const accentHsl: Record<ProductColor, string> = {
  omega: "hsl(var(--omega))",
  organ: "hsl(var(--organ))",
  gut: "hsl(var(--gut))",
};

// Resolved hex values — pack colours, used in gradients where CSS var opacity syntax breaks
const accentHex: Record<ProductColor, string> = {
  omega: "#A8D8F0", // light powder blue
  organ: "#F0A8B8", // light blush rose
  gut:   "#A0E0B0", // light sage green
};

// ── Lamp effect ── simple pastel wash, pack colour fading top to bottom
const LampEffect = ({
  colorHex,
  bgColor,
  prefersReducedMotion,
}: {
  colorHex: string;
  bgColor: string;
  prefersReducedMotion: boolean | null;
}) => (
  <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2, overflow: "hidden" }}>
    {/* lamp off — plain flat bg */}
  </div>
);

const ProductCard = ({
  product,
  idx,
  prefersReducedMotion,
}: {
  product: Product;
  idx: number;
  prefersReducedMotion: boolean | null;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const { scrollYProgress } = useScroll({
    target: imgRef,
    offset: ["start end", "end end"],
  });
  const tinScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
  <motion.div
    ref={cardRef}
    id={product.color}
    data-product={product.color}
    initial={prefersReducedMotion ? false : { opacity: 0, transform: "translateY(28px)" }}
    whileInView={prefersReducedMotion ? undefined : { opacity: 1, transform: "translateY(0px)" }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      delay: prefersReducedMotion ? 0 : idx * 0.1,
    }}
    className="group flex flex-col overflow-hidden rounded-2xl border border-border/20 card-lift"
    style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.07)" }}
  >
    {/* ── Image area ── */}
    <div
      className="relative flex items-end justify-center overflow-hidden"
      style={{
        background: imageAreaBg[product.color],
        minHeight: "360px",
        paddingTop: "32px",
        paddingBottom: "0",
      }}
    >
      {/* Lamp — pastel pack colour wash, top to bottom */}
      <LampEffect
        colorHex={accentHex[product.color]}
        bgColor={imageAreaBg[product.color]}
        prefersReducedMotion={prefersReducedMotion}
      />

      <motion.img
        ref={imgRef}
        src={product.image}
        alt={product.imageAlt}
        className="relative z-10 object-contain"
        style={{
          height: "300px",
          filter: "drop-shadow(0 24px 32px rgba(0,0,0,0.35)) drop-shadow(0 8px 12px rgba(0,0,0,0.2))",
          scale: prefersReducedMotion ? 1 : tinScale,
        }}
      />
    </div>

    {/* ── Content area ── */}
    <div className="flex flex-col flex-1 p-6 bg-background">

      {/* Category */}
      <span
        className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-3 block"
        style={{ color: accentHsl[product.color] }}
      >
        {product.badgeLabel}
      </span>

      {/* Product name */}
      <h3
        className="text-2xl font-black text-foreground mb-1.5 leading-tight"
      >
        {product.name}
      </h3>

      {/* Descriptor */}
      <p className="text-xs text-muted-foreground leading-relaxed mb-5">
        {product.descriptor}
      </p>

      {/* Benefits — clean dot list, not pill tags */}
      <div className="flex flex-col gap-2.5 mb-5">
        {product.benefits.map((b) => (
          <div key={b} className="flex items-center gap-2.5">
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: accentHsl[product.color] }}
            />
            <span className="text-xs font-medium text-foreground/75">{b}</span>
          </div>
        ))}
      </div>

      {/* Description */}
      <p className="text-xs text-foreground/55 leading-relaxed flex-1 mb-6">
        {product.description}
      </p>

      {/* CTA */}
      <a
        href={product.amazonUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-press w-full flex items-center justify-center gap-2 py-3 bg-foreground text-background text-xs font-semibold tracking-wide"
      >
        View on Amazon India
        <ArrowRight className="w-3.5 h-3.5" />
      </a>
    </div>
  </motion.div>
  );
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
      <motion.div
        initial={{ opacity: 0, transform: "translateY(20px)" }}
        whileInView={{ opacity: 1, transform: "translateY(0px)" }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="py-16 px-6 text-center max-w-[1400px] mx-auto"
      >
        <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-muted-foreground/50 block">
          The Range
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-foreground mt-3">
          Three systems. One daily routine.
        </h2>
        <p className="text-sm text-muted-foreground mt-3 max-w-md mx-auto leading-relaxed">
          Each topper targets a specific area. Use one or combine all three.
        </p>
      </motion.div>

      {/* Cards grid */}
      <div className="px-4 md:px-8 pb-20 max-w-[1400px] mx-auto">
        {!allLoaded ? (
          // Skeleton placeholders while images load
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
            aria-busy="true"
            aria-live="polite"
          >
            {products.map((p) => (
              <div
                key={`skeleton-${p.name}`}
                className="rounded-2xl border border-border/20 overflow-hidden animate-pulse"
              >
                <div className="h-[360px] bg-muted" />
                <div className="p-6 space-y-3">
                  <div className="h-3 w-24 bg-muted rounded" />
                  <div className="h-6 w-40 bg-muted rounded" />
                  <div className="h-3 w-full bg-muted rounded" />
                  <div className="h-3 w-3/4 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {products.map((product, idx) => (
              <ProductCard
                key={product.name}
                product={product}
                idx={idx}
                prefersReducedMotion={prefersReducedMotion}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductCatalog;
