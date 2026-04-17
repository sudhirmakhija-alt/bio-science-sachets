import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const WEIGHT_RANGES = [
  { min: 1, max: 5, sachets: 0.5 },
  { min: 6, max: 10, sachets: 1 },
  { min: 11, max: 20, sachets: 1.5 },
  { min: 21, max: 30, sachets: 2 },
  { min: 31, max: 40, sachets: 2.5 },
  { min: 41, max: 60, sachets: 3 },
];

const SIZE_LABELS = [
  "Toy (1–5kg)",
  "Small (5–10kg)",
  "Medium (10–25kg)",
  "Large (25–45kg)",
  "Giant (45kg+)",
];

type ProductKey = "omega" | "organ" | "gut";
const PRODUCTS: { key: ProductKey; label: string; name: string; activeClass: string }[] = [
  { key: "omega", label: "Omega", name: "Omega Balance+", activeClass: "bg-omega text-omega-foreground border-transparent" },
  { key: "organ", label: "Organ", name: "Organ Balance+", activeClass: "bg-organ text-organ-foreground border-transparent" },
  { key: "gut", label: "Gut", name: "Gut Balance+", activeClass: "bg-gut text-gut-foreground border-transparent" },
];

const calcSachets = (w: number) => {
  const range = WEIGHT_RANGES.find((r) => w >= r.min && w <= r.max);
  return range ? range.sachets : WEIGHT_RANGES[WEIGHT_RANGES.length - 1].sachets;
};

// Animated count-up display
const AnimatedNumber = ({ value, duration = 600 }: { value: number; duration?: number }) => {
  const prefersReducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const startTimeRef = useRef<number | null>(null);
  const fromRef = useRef(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplay(value);
      return;
    }
    fromRef.current = display;
    startTimeRef.current = null;
    const target = value;
    const from = display;

    const step = (ts: number) => {
      if (startTimeRef.current === null) startTimeRef.current = ts;
      const elapsed = ts - startTimeRef.current;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (target - from) * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, prefersReducedMotion]);

  // Round to 1 decimal if needed (matches 0.5 increments)
  const formatted = Number.isInteger(display) ? display.toString() : display.toFixed(1);
  return <>{formatted}</>;
};

const DosingCalculator = () => {
  const prefersReducedMotion = useReducedMotion();
  const [weight, setWeight] = useState(12);
  const [selected, setSelected] = useState<ProductKey[]>([]);

  const toggleProduct = (key: ProductKey) => {
    setSelected((curr) =>
      curr.includes(key) ? curr.filter((k) => k !== key) : [...curr, key]
    );
  };

  const sachets = calcSachets(weight);
  const showResult = selected.length > 0;
  const selectedNames = PRODUCTS.filter((p) => selected.includes(p.key)).map((p) => p.name).join(" · ");

  return (
    <section id="dosing" className="section-padding">
      <div className="bg-muted/40 backdrop-blur-sm rounded-3xl border border-border/50 p-8 md:p-12 max-w-2xl mx-auto">
        <span className="text-xs tracking-widest uppercase text-muted-foreground mb-2 block">
          Dosing Calculator
        </span>
        <h2 className="text-2xl font-bold mb-8 text-foreground">
          How much does your dog need?
        </h2>

        {/* STEP 1 — Weight slider */}
        <div>
          <label className="text-sm font-medium mb-2 block text-foreground">
            Dog's weight
          </label>
          <div className="text-2xl font-bold text-foreground mb-3">
            {weight} kg
          </div>
          <input
            type="range"
            min={1}
            max={60}
            step={1}
            value={weight}
            onChange={(e) => setWeight(parseInt(e.target.value, 10))}
            className="dosing-range w-full"
            aria-label="Dog weight in kilograms"
          />
          <div className="flex justify-between mt-3">
            {SIZE_LABELS.map((s) => (
              <span key={s} className="text-xs text-muted-foreground text-center flex-1">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* STEP 2 — Product selector */}
        <div className="mt-8">
          <label className="text-sm font-medium mb-3 block text-foreground">
            Select product
          </label>
          <div className="flex gap-3 flex-wrap">
            {PRODUCTS.map((p) => {
              const isActive = selected.includes(p.key);
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => toggleProduct(p.key)}
                  aria-pressed={isActive}
                  className={`text-sm font-medium px-5 py-2.5 rounded-full border transition-all duration-200 ${
                    isActive
                      ? p.activeClass
                      : "border-border bg-background text-foreground hover:border-foreground/30"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 3 — Result card */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              key={`result-${selected.join("-")}-${weight}`}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="bg-background border border-border rounded-2xl p-6 mt-8"
            >
              <div className="text-sm text-muted-foreground">
                For a {weight}kg dog
              </div>
              <div className="mt-1">
                <span className="text-5xl font-bold text-foreground">
                  <AnimatedNumber value={sachets} />
                </span>
                <span className="text-xl text-muted-foreground ml-2">
                  sachet/day
                </span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {selectedNames}
              </div>

              <div className="mt-4 border-t border-border" />

              <a
                href="https://amazon.in/biologica"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold mt-4 text-foreground hover:gap-3 transition-all"
              >
                Shop on Amazon
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-xs text-muted-foreground/60 italic mt-4 leading-relaxed">
          Always follow the product label and your vet's specific advice, especially for puppies, seniors or dogs on medication. This helper is not a substitute for veterinary guidance.
        </p>
      </div>
    </section>
  );
};

export default DosingCalculator;
