import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Shield, Sparkles, Leaf, Droplets, Fish } from "lucide-react";
import organBalance from "@/assets/organ-balance-new.png";
import gutBalance from "@/assets/gut-balance-new.png";
import omegaBalance from "@/assets/omega-balance-new.png";

const productData = [
  {
    name: "Organ Balance+",
    tagline: "Vital organ support for everyday wellness",
    image: organBalance,
    glowColor: "rgba(232,130,154,0.4)",
    tint: "rgba(255,182,193,0.08)",
    benefits: [
      { icon: Heart, label: "Heart & liver support" },
      { icon: Shield, label: "Immune defence" },
      { icon: Sparkles, label: "Antioxidant boost" },
    ],
  },
  {
    name: "Gut Balance+",
    tagline: "Digestive health & nutrient absorption",
    image: gutBalance,
    glowColor: "rgba(93,184,122,0.4)",
    tint: "rgba(144,238,144,0.08)",
    benefits: [
      { icon: Leaf, label: "Prebiotic fibre" },
      { icon: Shield, label: "Gut lining repair" },
      { icon: Sparkles, label: "Better absorption" },
    ],
  },
  {
    name: "Omega Balance+",
    tagline: "Skin, coat & joint lubrication",
    image: omegaBalance,
    glowColor: "rgba(106,174,214,0.4)",
    tint: "rgba(173,216,230,0.08)",
    benefits: [
      { icon: Droplets, label: "Omega 3-6-9 blend" },
      { icon: Fish, label: "Joint lubrication" },
      { icon: Sparkles, label: "Shiny coat" },
    ],
  },
];

const FloatingProductCard = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % productData.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const product = productData[activeIndex];

  return (
    <div
      className="w-[320px] h-[420px] rounded-[24px] overflow-hidden relative flex-shrink-0"
      style={{
        background: `linear-gradient(180deg, #0d1520 0%, #131d2e 100%)`,
        border: "1px solid rgba(255,255,255,0.1)",
        animation: "floatCard 4s ease-in-out infinite",
      }}
    >
      {/* Tint overlay that shifts per product */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`tint-${activeIndex}`}
          className="absolute inset-0 rounded-[24px]"
          style={{ background: `radial-gradient(ellipse at 50% 70%, ${product.tint} 0%, transparent 70%)` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center h-full px-6 pt-8 pb-6">
        {/* Product image with glow */}
        <div className="relative w-full flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={`product-${activeIndex}`}
              className="relative flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              {/* Glow beneath */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-16 rounded-full blur-2xl"
                style={{ background: product.glowColor }}
              />
              <img
                src={product.image}
                alt={product.name}
                className="w-44 h-auto object-contain relative z-[1]"
                style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.3))" }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Name & tagline */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`text-${activeIndex}`}
            className="text-center mt-2 mb-4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="text-white font-bold text-base">{product.name}</h3>
            <p className="text-gray-400 text-xs mt-1">{product.tagline}</p>
          </motion.div>
        </AnimatePresence>

        {/* Benefit pills */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`pills-${activeIndex}`}
            className="flex flex-wrap justify-center gap-2"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {product.benefits.map((b) => (
              <div
                key={b.label}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <b.icon className="w-3 h-3 text-gray-300" />
                <span className="text-[10px] text-gray-300 font-medium">{b.label}</span>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Dot indicators */}
        <div className="flex gap-2 mt-4">
          {productData.map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full transition-all duration-300"
              style={{
                background: i === activeIndex ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.2)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FloatingProductCard;
