import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import omegaProduct from "@/assets/BLP_Omega_Balance_Catalog.png";
import organProduct from "@/assets/BLP_Organ_Balance_Catalog.png";
import gutProduct from "@/assets/BLP_Gut_Balance_Catalog.png";

// ── Colour tokens — contrast-verified against bg #06090c ──────────────────
const C = {
  bg:       "#06090c",
  surf1:    "#0c1219",
  borderLo: "#111a24",
  borderMd: "#1c2d3f",
  borderHi: "#283d55",
  textHi:   "#dfe3ea",   // ~15:1 — headings, product names
  textBody: "#95a3b8",   //  ~8:1 — body copy
  textMeta: "#6a7a90",   //  ~5:1 — labels, hints (ALL-CAPS small)
  textDim:  "#3d4f63",   //  ~2:1 — decorative only
} as const;

// ── Dosing data ────────────────────────────────────────────────────────────
const WEIGHT_RANGES = [
  { min: 1,  max: 5,  sachets: 0.5 },
  { min: 6,  max: 10, sachets: 1   },
  { min: 11, max: 20, sachets: 1.5 },
  { min: 21, max: 30, sachets: 2   },
  { min: 31, max: 40, sachets: 2.5 },
  { min: 41, max: 60, sachets: 3   },
];
const SIZE_LABELS = ["Toy", "Small", "Medium", "Large", "Giant"];

function calcSachets(w: number) {
  return (WEIGHT_RANGES.find((r) => w >= r.min && w <= r.max) ?? WEIGHT_RANGES[WEIGHT_RANGES.length - 1]).sachets;
}

// ── Types ──────────────────────────────────────────────────────────────────
type AgeGroup   = "puppy" | "adult" | "senior";
type ProductKey = "omega" | "organ" | "gut";
type SymptomKey =
  | "stiffJoints" | "dullCoat"    | "lowAlertness"    | "lowEnergy"
  | "weakImmunity"| "looseStools" | "sensitiveStomach" | "itchySkin"
  | "poorAppetite"| "gasBloating";

// ── Symptom data ───────────────────────────────────────────────────────────
interface SymptomData {
  label:      string;
  scores:     Partial<Record<ProductKey, number>>;
  ingredient: string;
  benefit:    string;
}

const SYMPTOMS: Record<SymptomKey, SymptomData> = {
  stiffJoints:      { label: "Stiff Joints",       scores: { omega: 3 },           ingredient: "Green-Lipped Mussel",    benefit: "joint mobility"      },
  dullCoat:         { label: "Dull Coat",           scores: { omega: 3 },           ingredient: "omega-3 fatty acids",    benefit: "skin & coat health"  },
  lowAlertness:     { label: "Low Alertness",       scores: { omega: 2, organ: 1 }, ingredient: "DHA + B vitamins",       benefit: "brain function"      },
  lowEnergy:        { label: "Low Energy",          scores: { organ: 3 },           ingredient: "organ peptides",         benefit: "vitality & energy"   },
  weakImmunity:     { label: "Weak Immunity",       scores: { organ: 3 },           ingredient: "organ micronutrients",   benefit: "immune support"      },
  looseStools:      { label: "Loose Stools",        scores: { gut: 3 },             ingredient: "prebiotics & probiotics", benefit: "stool consistency"  },
  sensitiveStomach: { label: "Sensitive Stomach",   scores: { gut: 3 },             ingredient: "gut lining support",     benefit: "digestive comfort"   },
  itchySkin:        { label: "Itchy Skin",          scores: { omega: 2, gut: 1 },   ingredient: "EPA/DHA + gut flora",    benefit: "skin barrier health" },
  poorAppetite:     { label: "Poor Appetite",       scores: { organ: 3 },           ingredient: "organ peptides",         benefit: "appetite & digestion" },
  gasBloating:      { label: "Gas & Bloating",      scores: { gut: 3 },             ingredient: "digestive enzymes",      benefit: "gut motility"         },
};

// ── Product definitions ────────────────────────────────────────────────────
interface ProductDef { name: string; system: string; tagline: string; image: string; url: string; hex: string; rgb: string; }

const PRODUCTS: Record<ProductKey, ProductDef> = {
  omega: { name: "Omega Balance+", system: "OMEGA SYSTEM", tagline: "Marine-derived omega topper with green-lipped mussel", image: omegaProduct, url: "https://amazon.in/biologica", hex: "#A8D8F0", rgb: "168, 216, 240" },
  organ: { name: "Organ Balance+", system: "ORGAN SYSTEM", tagline: "Dehydrated organ-based daily vitality topper",          image: organProduct, url: "https://amazon.in/biologica", hex: "#F0A8B8", rgb: "240, 168, 184" },
  gut:   { name: "Gut Balance+",   system: "GUT SYSTEM",   tagline: "100% vegetarian gut support and digestion topper",      image: gutProduct,   url: "https://amazon.in/biologica", hex: "#A0E0B0", rgb: "160, 224, 176" },
};

// ── Recommendation engine ──────────────────────────────────────────────────
interface MatchedSymptom { key: SymptomKey; product: ProductKey; ingredient: string; benefit: string; }
interface Recommendation  { primary: ProductKey; primaryScore: number; secondary: ProductKey[]; matched: MatchedSymptom[]; }

function computeRec(selected: SymptomKey[], age: AgeGroup | null): Recommendation | null {
  if (!selected.length) return null;
  const scores: Record<ProductKey, number> = { omega: 0, organ: 0, gut: 0 };
  for (const sk of selected) {
    for (const [pk, s] of Object.entries(SYMPTOMS[sk].scores) as [ProductKey, number][]) { scores[pk] += s; }
  }
  if (age === "senior") { scores.omega += 2; scores.organ += 1; }
  if (age === "puppy")  { scores.organ  += 1; }
  const ranked = (Object.entries(scores) as [ProductKey, number][]).filter(([, s]) => s > 0).sort(([, a], [, b]) => b - a);
  if (!ranked.length) return null;
  const [[primary, primaryScore], ...rest] = ranked;
  const secondary = rest.map(([k]) => k);
  const matched: MatchedSymptom[] = selected.map((sk) => {
    const top = (Object.entries(SYMPTOMS[sk].scores) as [ProductKey, number][]).sort(([, a], [, b]) => b - a)[0]?.[0] ?? primary;
    return { key: sk, product: top, ingredient: SYMPTOMS[sk].ingredient, benefit: SYMPTOMS[sk].benefit };
  });
  return { primary, primaryScore, secondary, matched };
}

function chipStyle(sk: SymptomKey, selected: boolean): React.CSSProperties {
  if (!selected) return {};
  const top = (Object.entries(SYMPTOMS[sk].scores) as [ProductKey, number][]).sort(([, a], [, b]) => b - a)[0]?.[0];
  if (!top) return {};
  const p = PRODUCTS[top];
  return { background: `rgba(${p.rgb}, 0.16)`, borderColor: `rgba(${p.rgb}, 0.5)`, color: p.hex };
}

// ── Animated sachet count ─────────────────────────────────────────────────
const AnimatedNumber = ({ value, duration = 500 }: { value: number; duration?: number }) => {
  const prefersReducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const rafRef    = useRef<number | null>(null);
  const startRef  = useRef<number | null>(null);
  const fromRef   = useRef(value);

  useEffect(() => {
    if (prefersReducedMotion) { setDisplay(value); return; }
    fromRef.current = display;
    startRef.current = null;
    const from = display, to = value;
    const step = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const t = Math.min((ts - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (to - from) * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, prefersReducedMotion]);

  const fmt = Number.isInteger(display) ? display.toString() : display.toFixed(1);
  return <>{fmt}</>;
};

// ── Shared label ──────────────────────────────────────────────────────────
const Label = ({ children }: { children: React.ReactNode }) => (
  <span className="block text-[10px] font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: C.textMeta }}>
    {children}
  </span>
);

// ── Segment button ────────────────────────────────────────────────────────
const SegBtn = ({ label, sub, active, onClick }: { label: string; sub?: string; active: boolean; onClick: () => void }) => (
  <button onClick={onClick} className="flex-1 py-2.5 px-2 text-center rounded border transition-all duration-200"
    style={{ background: active ? "rgba(255,255,255,0.06)" : C.surf1, borderColor: active ? C.borderHi : C.borderMd, color: active ? C.textHi : C.textMeta }}>
    <div className="text-xs font-semibold">{label}</div>
    {sub && <div className="text-[10px] mt-0.5" style={{ color: active ? C.textBody : C.textDim }}>{sub}</div>}
  </button>
);

// ── Symptom chip ──────────────────────────────────────────────────────────
const Chip = ({ sk, selected, onClick }: { sk: SymptomKey; selected: boolean; onClick: () => void }) => (
  <button onClick={onClick} className="px-3 py-3 text-left text-xs font-medium rounded border transition-all duration-150"
    style={selected ? { borderWidth: "1px", ...chipStyle(sk, true) } : { background: C.surf1, borderColor: C.borderMd, color: C.textMeta, borderWidth: "1px" }}>
    {SYMPTOMS[sk].label}
  </button>
);

// ── Scan line ─────────────────────────────────────────────────────────────
const ScanLine = ({ scanKey, accentRgb }: { scanKey: string; accentRgb: string }) => (
  <motion.div key={scanKey} className="absolute left-0 right-0 h-px pointer-events-none" style={{ zIndex: 20, background: `linear-gradient(90deg, transparent 0%, rgba(${accentRgb}, 0.08) 10%, rgba(${accentRgb}, 0.5) 50%, rgba(${accentRgb}, 0.08) 90%, transparent 100%)` }}
    initial={{ top: "0%", opacity: 0 }} animate={{ top: "100%", opacity: [0, 1, 1, 0] }} transition={{ duration: 0.75, ease: "linear", times: [0, 0.04, 0.94, 1] }} />
);

// ── Dormant panel ─────────────────────────────────────────────────────────
const DormantPanel = ({ dogName }: { dogName: string }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
    className="h-full flex flex-col items-center justify-center text-center" style={{ minHeight: "420px" }}>
    <div className="relative mb-8">
      <motion.div className="w-16 h-16 rounded-full border" style={{ borderColor: C.borderMd }}
        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.3, 1] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute inset-0 rounded-full border" style={{ borderColor: C.borderLo }}
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full" style={{ background: C.borderHi }} />
      </div>
    </div>
    <span className="block text-[9px] font-semibold tracking-[0.25em] uppercase mb-3" style={{ color: C.textDim }}>AWAITING INPUT</span>
    <p className="text-sm leading-relaxed max-w-[210px]" style={{ color: C.textMeta }}>
      {dogName ? `Select ${dogName}'s symptoms to generate a formula` : "Select symptoms to generate a personalised formula"}
    </p>
    <div className="mt-10 flex gap-4">
      {(["omega", "organ", "gut"] as ProductKey[]).map((pk) => (
        <div key={pk} className="flex items-center gap-1.5">
          <div className="w-1 h-1 rounded-full" style={{ background: C.textDim }} />
          <span className="text-[9px] tracking-widest uppercase" style={{ color: C.textDim }}>{pk}</span>
        </div>
      ))}
    </div>
  </motion.div>
);

// ── Active recommendation + dosing panel ───────────────────────────────────
const ActivePanel = ({
  rec, dogName, weight, scanKey, prefersReducedMotion,
}: {
  rec: Recommendation; dogName: string; weight: number; scanKey: string; prefersReducedMotion: boolean | null;
}) => {
  const p        = PRODUCTS[rec.primary];
  const name     = dogName || null;
  const sachets  = calcSachets(weight);
  const sachetLabel = Number.isInteger(sachets) ? sachets.toString() : sachets.toFixed(1);
  const primaryMatches = rec.matched.filter((m) => m.product === rec.primary).length;
  const confLabel = primaryMatches === rec.matched.length
    ? `All ${rec.matched.length} symptom${rec.matched.length > 1 ? "s" : ""} point here`
    : `${primaryMatches} of ${rec.matched.length} symptoms point here`;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
      className="relative h-full flex flex-col" style={{ minHeight: "420px" }}>
      {!prefersReducedMotion && <ScanLine scanKey={scanKey} accentRgb={p.rgb} />}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: prefersReducedMotion ? 0 : 0.42, duration: 0.35 }}
        className="flex flex-col flex-1">

        {/* ── Formula identity ─────────────────────────────────────────── */}
        <div className="flex items-start gap-6 mb-5">

          {/* Text — left column */}
          <div className="flex-1 min-w-0">
            <Label>RECOMMENDED FORMULA</Label>
            <h3 className="text-2xl font-black leading-tight mb-2" style={{ fontFamily: "Barlow, sans-serif", color: C.textHi }}>
              {name ? `${name}'s Formula` : "Your Formula"}
            </h3>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: p.hex }} />
              <span className="text-xs" style={{ color: C.textMeta }}>{confLabel}</span>
            </div>
            <div className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-1" style={{ color: p.hex, opacity: 0.7 }}>
              {p.system}
            </div>
            <div className="text-base font-bold leading-snug" style={{ color: p.hex }}>{p.name}</div>
            <div className="text-xs mt-1 leading-snug" style={{ color: C.textBody }}>{p.tagline}</div>
          </div>

          {/* Tin — right, larger, more hero */}
          <motion.img key={rec.primary} src={p.image} alt={p.name} className="flex-shrink-0 object-contain"
            style={{ height: "160px", filter: "drop-shadow(0 16px 32px rgba(0,0,0,0.65))" }}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }} transition={{ delay: prefersReducedMotion ? 0 : 0.52, duration: 0.55, ease: [0.16, 1, 0.3, 1] }} />
        </div>

        {/* ── Divider ───────────────────────────────────────────────────── */}
        <div className="mb-5" style={{ height: "1px", background: C.borderMd }} />

        {/* ── Daily dose ────────────────────────────────────────────────── */}
        <div className="mb-5">
          <Label>DAILY DOSE</Label>

          {/* Prescription-style count */}
          <div className="flex items-end gap-3 mb-4">
            <span className="text-[52px] font-black leading-none" style={{ color: C.textHi, fontFamily: "Barlow, sans-serif" }}>
              <AnimatedNumber value={sachets} />
            </span>
            <div className="pb-1.5">
              <div className="text-[15px] font-semibold leading-tight" style={{ color: C.textBody }}>
                sachet{sachetLabel !== "1" ? "s" : ""}
              </div>
              <div className="text-xs leading-tight mt-0.5" style={{ color: C.textMeta }}>per day · with food</div>
            </div>
          </div>

          {/* Supply stats strip */}
          <div className="grid grid-cols-3 rounded-lg overflow-hidden" style={{ border: `1px solid ${C.borderMd}` }}>
            {([
              { val: `${weight}kg`,                      sub: "dog weight"  },
              { val: `${Math.floor(30 / sachets)} days`, sub: "per box"     },
              { val: "30 sachets",                       sub: "box size"    },
            ] as { val: string; sub: string }[]).map((s, i) => (
              <div key={i} className={`px-3 py-2.5${i > 0 ? " border-l" : ""}`}
                style={{ background: C.surf1, borderColor: C.borderMd }}>
                <div className="text-sm font-bold leading-none" style={{ color: C.textBody, fontFamily: "Barlow, sans-serif" }}>
                  {s.val}
                </div>
                <div className="text-[10px] uppercase tracking-wider mt-1" style={{ color: C.textMeta }}>
                  {s.sub}
                </div>
              </div>
            ))}
          </div>

          {rec.secondary.length > 0 && (
            <p className="text-xs mt-2" style={{ color: C.textDim }}>Same dose applies to each recommended product</p>
          )}
        </div>

        {/* ── Divider ───────────────────────────────────────────────────── */}
        <div className="mb-4" style={{ height: "1px", background: C.borderMd }} />

        {/* ── Why [Name] needs this — two-column table ──────────────────── */}
        <div className="flex-1 mb-4">
          <Label>{name ? `WHY ${name.toUpperCase()} NEEDS THIS` : "FORMULA REASONING"}</Label>

          <AnimatePresence mode="sync" initial={false}>
            {rec.matched.map((m) => {
              const mp = PRODUCTS[m.product];
              return (
                <motion.div key={m.key}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden">
                  <div className="flex gap-4 py-2.5" style={{ borderBottom: `1px solid ${C.borderLo}` }}>

                    {/* Left column: symptom — tinted to product colour */}
                    <div className="w-[38%] flex-shrink-0 flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full mt-[5px] flex-shrink-0" style={{ background: mp.hex }} />
                      <span className="text-[13px] font-medium leading-snug" style={{ color: mp.hex, opacity: 0.7 }}>
                        {SYMPTOMS[m.key].label}
                      </span>
                    </div>

                    {/* Right column: ingredient (full product colour, bolder) + benefit */}
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold leading-snug" style={{ color: mp.hex }}>
                        {m.ingredient}
                      </div>
                      <div className="text-[11px] mt-0.5" style={{ color: C.textMeta }}>
                        {m.benefit}
                      </div>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* ── Also consider ─────────────────────────────────────────────── */}
        <AnimatePresence>
          {rec.secondary.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="mb-4">
              <Label>ALSO CONSIDER</Label>
              <div className="flex gap-2 flex-wrap">
                {rec.secondary.map((sk) => {
                  const sp = PRODUCTS[sk];
                  return (
                    <a key={sk} href={sp.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all duration-150"
                      style={{ background: `rgba(${sp.rgb}, 0.08)`, border: `1px solid rgba(${sp.rgb}, 0.2)`, color: sp.hex }}>
                      <img src={sp.image} alt={sp.name} className="w-5 h-5 object-contain flex-shrink-0" />
                      {sp.name}
                    </a>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── CTA ───────────────────────────────────────────────────────── */}
        <div className="mt-auto space-y-3">
          <a href={p.url} target="_blank" rel="noopener noreferrer"
            className="btn-press w-full flex items-center justify-center gap-2 py-3.5 rounded text-[13px] font-semibold tracking-wide transition-all duration-150"
            style={{ background: `rgba(${p.rgb}, 0.1)`, border: `1px solid rgba(${p.rgb}, 0.3)`, color: p.hex }}>
            View on Amazon India
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <p className="text-xs leading-relaxed" style={{ color: C.textMeta }}>
            Always follow the product label and consult your vet, especially for puppies, seniors, or dogs on medication.
          </p>
        </div>

      </motion.div>
    </motion.div>
  );
};

// ── Main component ─────────────────────────────────────────────────────────
const DiagnosticTool = () => {
  const prefersReducedMotion = useReducedMotion();

  const [dogName,    setDogName]    = useState("");
  const [age,        setAge]        = useState<AgeGroup | null>(null);
  const [weight,     setWeight]     = useState(12);
  const [weightInput, setWeightInput] = useState("12");
  const [symptoms,   setSymptoms]   = useState<Set<SymptomKey>>(new Set());

  const scanCounter = useRef(0);
  const [scanKey, setScanKey] = useState("0");

  const toggleSymptom = (sk: SymptomKey) => {
    setSymptoms((prev) => {
      const next = new Set(prev);
      next.has(sk) ? next.delete(sk) : next.add(sk);
      scanCounter.current += 1;
      setScanKey(String(scanCounter.current));
      return next;
    });
  };

  // Weight handlers
  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value, 10);
    setWeight(v);
    setWeightInput(String(v));
  };
  const handleWeightInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setWeightInput(raw);
    const n = parseInt(raw, 10);
    if (!isNaN(n)) setWeight(Math.min(60, Math.max(1, n)));
  };
  const handleWeightBlur = () => {
    const n = parseInt(weightInput, 10);
    const c = isNaN(n) ? 12 : Math.min(60, Math.max(1, n));
    setWeight(c);
    setWeightInput(String(c));
  };

  const rec = useMemo(
    () => computeRec([...symptoms] as SymptomKey[], age),
    [symptoms, age]
  );

  const displayName = dogName.trim();

  return (
    <section id="find-your-formula" className="relative overflow-hidden" style={{ background: C.bg }}>

      {/* Dot-grid texture */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      {/* Section header */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 pt-20 pb-10 px-6 text-center max-w-[1400px] mx-auto">
        <span className="block text-[10px] font-semibold tracking-[0.25em] uppercase mb-3" style={{ color: C.textMeta }}>
          Personalised Diagnostic
        </span>
        <h2 className="text-3xl md:text-4xl font-black" style={{ fontFamily: "Barlow, sans-serif", color: C.textHi }}>
          {displayName ? `Find ${displayName}'s formula` : "Find Your Dog's Formula"}
        </h2>
        <p className="text-sm mt-3 max-w-sm mx-auto leading-relaxed" style={{ color: C.textBody }}>
          Answer a few questions — get the right formula and exact daily dose in one place.
        </p>
      </motion.div>

      {/* Panel */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 pb-24">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="grid lg:grid-cols-[5fr_6fr] rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.borderMd}` }}>

          {/* ── Left: inputs ── */}
          <div className="p-8 lg:p-12 space-y-8 border-b lg:border-b-0 lg:border-r" style={{ borderColor: C.borderMd }}>

            {/* Dog name */}
            <div>
              <Label>DOG'S NAME</Label>
              <input type="text" value={dogName} onChange={(e) => setDogName(e.target.value)}
                placeholder="e.g. Buddy" maxLength={24}
                className="w-full bg-transparent text-sm outline-none pb-2.5 border-b transition-colors duration-200 placeholder:text-[#3d4f63]"
                style={{ color: C.textHi, caretColor: C.textHi, borderColor: C.borderMd }}
                onFocus={(e) => (e.target.style.borderColor = C.borderHi)}
                onBlur={(e)  => (e.target.style.borderColor = C.borderMd)} />
            </div>

            {/* Age */}
            <div>
              <Label>AGE GROUP</Label>
              <div className="flex gap-2">
                {(["puppy", "adult", "senior"] as AgeGroup[]).map((a) => (
                  <SegBtn key={a} label={a.charAt(0).toUpperCase() + a.slice(1)}
                    sub={a === "puppy" ? "0–1 yr" : a === "adult" ? "1–7 yr" : "7+ yr"}
                    active={age === a} onClick={() => setAge(age === a ? null : a)} />
                ))}
              </div>
            </div>

            {/* Weight */}
            <div>
              <Label>BODY WEIGHT</Label>
              <div className="flex items-baseline gap-2 mb-4">
                <input type="text" inputMode="numeric" value={weightInput}
                  onChange={handleWeightInput} onBlur={handleWeightBlur} onFocus={(e) => e.target.select()}
                  aria-label="Dog weight in kg"
                  className="text-[28px] font-black bg-transparent outline-none w-14 text-center border-b transition-colors duration-150"
                  style={{ fontFamily: "Barlow, sans-serif", color: C.textHi, borderColor: C.borderMd, caretColor: C.textHi }}
                  onFocus={(e) => { e.target.select(); (e.target as HTMLInputElement).style.borderColor = C.borderHi; }}
                  onBlur={(e)  => { handleWeightBlur(); (e.target as HTMLInputElement).style.borderColor = C.borderMd; }} />
                <span className="text-lg font-bold" style={{ color: C.textBody }}>kg</span>
              </div>
              <input type="range" min={1} max={60} step={1} value={weight} onChange={handleSlider}
                className="dosing-range w-full" aria-label="Dog weight slider" />
              <div className="flex justify-between mt-2.5 px-0.5">
                {SIZE_LABELS.map((s, i) => (
                  <span key={s} className={`text-[10px] ${i === 0 ? "text-left" : i === SIZE_LABELS.length - 1 ? "text-right" : "text-center"}`}
                    style={{ color: C.textDim }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Symptoms */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <Label>PRESENTING SYMPTOMS</Label>
                {symptoms.size > 0 && (
                  <button onClick={() => { setSymptoms(new Set()); scanCounter.current += 1; setScanKey(String(scanCounter.current)); }}
                    className="text-[9px] font-semibold tracking-widest uppercase transition-colors duration-150 mb-2.5"
                    style={{ color: C.textMeta }}>
                    CLEAR
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {(Object.keys(SYMPTOMS) as SymptomKey[]).map((sk) => (
                  <Chip key={sk} sk={sk} selected={symptoms.has(sk)} onClick={() => toggleSymptom(sk)} />
                ))}
              </div>
              <AnimatePresence>
                {symptoms.size > 0 && (
                  <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }} className="mt-3.5 text-xs" style={{ color: C.textMeta }}>
                    {symptoms.size} symptom{symptoms.size > 1 ? "s" : ""} selected
                    {age ? ` · ${age}` : ""}
                    {" · generating formula →"}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* ── Right: recommendation + dosing ── */}
          <div className="p-8 lg:p-12 relative overflow-hidden" style={{ minHeight: "560px" }}>
            <AnimatePresence mode="wait">
              {!rec ? (
                <DormantPanel key="dormant" dogName={displayName} />
              ) : (
                <ActivePanel key={rec.primary} rec={rec} dogName={displayName} weight={weight}
                  scanKey={scanKey} prefersReducedMotion={prefersReducedMotion} />
              )}
            </AnimatePresence>
          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default DiagnosticTool;
