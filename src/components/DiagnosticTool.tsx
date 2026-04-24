import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, RotateCcw } from "lucide-react";
import omegaProduct from "@/assets/BLP_Omega_Balance.png";
import organProduct from "@/assets/BLP_Organ_Balance.png";
import gutProduct   from "@/assets/BLP_Gut_Balance.png";

// ── Colour tokens ──────────────────────────────────────────────────────────
const C = {
  formBg:   "#161a1e",   // dark grey — science-section card shade
  borderLo: "#1e2226",
  borderMd: "#272d33",
  borderHi: "#3a4550",
  textHi:   "#dfe3ea",
  textBody: "#8a96a4",
  textMeta: "#5e6b78",
  textDim:  "#3a444e",
} as const;

// Middle panel tokens — dark grey card (matches science section language)
const W = {
  bg:      "#1c1f22",
  text:    "#e8eef4",
  textMid: "rgba(232,238,244,0.50)",
  textLow: "rgba(232,238,244,0.26)",
  border:  "rgba(255,255,255,0.08)",
} as const;

const R = {
  text:    "#e8eef4",
  textMid: "rgba(232,238,244,0.52)",
  textLow: "rgba(232,238,244,0.26)",
  border:  "rgba(255,255,255,0.08)",
  surf:    "rgba(255,255,255,0.05)",
} as const;

const BC = "'Barlow', sans-serif";           // matches site heading font
const BN = "'Barlow Condensed', sans-serif"; // condensed — numbers & data only

// ── Dosing ─────────────────────────────────────────────────────────────────
const WEIGHT_RANGES = [
  { min: 1,  max: 5,  sachets: 0.5 },
  { min: 6,  max: 10, sachets: 1   },
  { min: 11, max: 20, sachets: 1.5 },
  { min: 21, max: 30, sachets: 2   },
  { min: 31, max: 40, sachets: 2.5 },
  { min: 41, max: 60, sachets: 3   },
];
const SIZE_LABELS = ["Toy", "Small", "Medium", "Large", "Giant"];
const calcSachets = (w: number) =>
  (WEIGHT_RANGES.find((r) => w >= r.min && w <= r.max) ?? WEIGHT_RANGES[WEIGHT_RANGES.length - 1]).sachets;

// ── Types ──────────────────────────────────────────────────────────────────
type AgeGroup  = "puppy" | "adult" | "senior";
type ProductKey = "omega" | "organ" | "gut";
type SymptomKey =
  | "stiffJoints" | "dullCoat"    | "lowAlertness"     | "lowEnergy"
  | "weakImmunity"| "looseStools" | "sensitiveStomach"  | "itchySkin"
  | "poorAppetite"| "gasBloating";

// ── Onset timeline ─────────────────────────────────────────────────────────
const ONSET: Record<ProductKey, Record<AgeGroup, [string, string]>> = {
  omega: { puppy: ["2–3 wk", "4–6 wk"],  adult: ["3–4 wk", "6–8 wk"],  senior: ["4–6 wk",  "8–10 wk"] },
  organ: { puppy: ["2–3 wk", "4–5 wk"],  adult: ["3–4 wk", "5–6 wk"],  senior: ["4–6 wk",  "7–8 wk"]  },
  gut:   { puppy: ["1–2 wk", "3–4 wk"],  adult: ["2–3 wk", "4–5 wk"],  senior: ["3–4 wk",  "5–6 wk"]  },
};

// ── Symptom data ───────────────────────────────────────────────────────────
interface SymptomData { label: string; scores: Partial<Record<ProductKey, number>>; ingredient: string; benefit: string; }
const SYMPTOMS: Record<SymptomKey, SymptomData> = {
  stiffJoints:      { label: "Stiff Joints",      scores: { omega: 3 },           ingredient: "Green-Lipped Mussel",     benefit: "joint mobility"       },
  dullCoat:         { label: "Dull Coat",          scores: { omega: 3 },           ingredient: "omega-3 fatty acids",     benefit: "skin & coat health"   },
  lowAlertness:     { label: "Low Alertness",      scores: { omega: 2, organ: 1 }, ingredient: "DHA + B vitamins",        benefit: "brain function"       },
  lowEnergy:        { label: "Low Energy",         scores: { organ: 3 },           ingredient: "organ peptides",          benefit: "vitality & energy"    },
  weakImmunity:     { label: "Weak Immunity",      scores: { organ: 3 },           ingredient: "organ micronutrients",    benefit: "immune support"       },
  looseStools:      { label: "Loose Stools",       scores: { gut: 3 },             ingredient: "prebiotics & probiotics", benefit: "stool consistency"    },
  sensitiveStomach: { label: "Sensitive Stomach",  scores: { gut: 3 },             ingredient: "gut lining support",      benefit: "digestive comfort"    },
  itchySkin:        { label: "Itchy Skin",         scores: { omega: 2, gut: 1 },   ingredient: "EPA/DHA + gut flora",     benefit: "skin barrier health"  },
  poorAppetite:     { label: "Poor Appetite",      scores: { organ: 3 },           ingredient: "organ peptides",          benefit: "appetite & digestion" },
  gasBloating:      { label: "Gas & Bloating",     scores: { gut: 3 },             ingredient: "digestive enzymes",       benefit: "gut motility"         },
};

// ── Product definitions ────────────────────────────────────────────────────
interface ProductDef { name: string; system: string; tagline: string; image: string; url: string; hex: string; foundHex: string; rgb: string; }
const PRODUCTS: Record<ProductKey, ProductDef> = {
  omega: { name: "Omega Balance+", system: "OMEGA SYSTEM", tagline: "Marine-derived omega topper with green-lipped mussel", image: omegaProduct, url: "https://amazon.in/biologica", hex: "#A8D8F0", foundHex: "#0dd6c8", rgb: "168,216,240" },
  organ: { name: "Organ Balance+", system: "ORGAN SYSTEM", tagline: "Dehydrated organ-based daily vitality topper",          image: organProduct, url: "https://amazon.in/biologica", hex: "#F0A8B8", foundHex: "#f28030", rgb: "240,168,184" },
  gut:   { name: "Gut Balance+",   system: "GUT SYSTEM",   tagline: "100% vegetarian gut support and digestion topper",      image: gutProduct,   url: "https://amazon.in/biologica", hex: "#A0E0B0", foundHex: "#5ece2a", rgb: "160,224,176" },
};

// ── Recommendation engine ──────────────────────────────────────────────────
interface MatchedSymptom { key: SymptomKey; product: ProductKey; ingredient: string; benefit: string; }
interface Recommendation { primary: ProductKey; primaryScore: number; secondary: ProductKey[]; matched: MatchedSymptom[]; }

function computeRec(selected: SymptomKey[], age: AgeGroup | null): Recommendation | null {
  if (!selected.length) return null;
  const scores: Record<ProductKey, number> = { omega: 0, organ: 0, gut: 0 };
  for (const sk of selected) {
    for (const [pk, s] of Object.entries(SYMPTOMS[sk].scores) as [ProductKey, number][]) scores[pk] += s;
  }
  if (age === "senior") { scores.omega += 2; scores.organ += 1; }
  if (age === "puppy")  { scores.organ += 1; }
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
  return { background: `rgba(${p.rgb},0.16)`, borderColor: `rgba(${p.rgb},0.5)`, color: p.hex };
}

// ── Animated number ────────────────────────────────────────────────────────
const AnimatedNumber = ({ value, duration = 500 }: { value: number; duration?: number }) => {
  const prefersReducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const rafRef  = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  useEffect(() => {
    if (prefersReducedMotion) { setDisplay(value); return; }
    const from = display, to = value;
    startRef.current = null;
    const step = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const t = Math.min((ts - startRef.current) / duration, 1);
      setDisplay(from + (to - from) * (1 - Math.pow(1 - t, 3)));
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, prefersReducedMotion]);
  return <>{Number.isInteger(display) ? display.toString() : display.toFixed(1)}</>;
};

// ── Shared inline style for all headline words ────────────────────────────
const wordStyle = (fontSize: string, color: string): React.CSSProperties => ({
  fontFamily: BC,
  fontSize,
  fontWeight: 900,
  letterSpacing: "-0.02em",
  lineHeight: 1,
  color,
  display: "block",
  position: "absolute",
  top: 0,
  left: 0,
  whiteSpace: "nowrap",
});

// ══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════
const DiagnosticTool = () => {
  const prefersReducedMotion = useReducedMotion();

  const [dogName,     setDogName]     = useState("");
  const [age,         setAge]         = useState<AgeGroup | null>(null);
  const [weight,      setWeight]      = useState(12);
  const [weightInput, setWeightInput] = useState("12");
  const [symptoms,    setSymptoms]    = useState<Set<SymptomKey>>(new Set());
  const [slideState,  setSlideState]  = useState<"input" | "result">("input");

  const toggleSymptom = (sk: SymptomKey) =>
    setSymptoms((prev) => { const next = new Set(prev); next.has(sk) ? next.delete(sk) : next.add(sk); return next; });

  const handleSlider      = (e: React.ChangeEvent<HTMLInputElement>) => { const v = parseInt(e.target.value, 10); setWeight(v); setWeightInput(String(v)); };
  const handleWeightInput = (e: React.ChangeEvent<HTMLInputElement>) => { const raw = e.target.value.replace(/[^0-9]/g, ""); setWeightInput(raw); const n = parseInt(raw, 10); if (!isNaN(n)) setWeight(Math.min(60, Math.max(1, n))); };
  const handleWeightBlur  = () => { const n = parseInt(weightInput, 10); const c = isNaN(n) ? 12 : Math.min(60, Math.max(1, n)); setWeight(c); setWeightInput(String(c)); };

  const rec         = useMemo(() => computeRec([...symptoms] as SymptomKey[], age), [symptoms, age]);
  const displayName = dogName.trim();
  const canFind     = symptoms.size > 0;

  const handleFind  = () => { if (rec) setSlideState("result"); };
  const handleReset = () => setSlideState("input");

  const p            = rec ? PRODUCTS[rec.primary] : PRODUCTS.omega;
  const sachets      = calcSachets(weight);
  const sachetLabel  = Number.isInteger(sachets) ? sachets.toString() : sachets.toFixed(1);
  const ageKey       = age ?? "adult";
  const [firstWk, fullWk] = rec ? ONSET[rec.primary][ageKey] : ["3–4 wk", "6–8 wk"];
  const primaryCount = rec ? rec.matched.filter((m) => m.product === rec.primary).length : 0;
  const confLabel    = rec
    ? primaryCount === rec.matched.length
      ? `All ${rec.matched.length} symptom${rec.matched.length > 1 ? "s" : ""} point here`
      : `${primaryCount} of ${rec.matched.length} symptoms point here`
    : "";

  // Headline font size tokens — calibrated for non-condensed Barlow 900
  const FS_LARGE  = "clamp(52px, 5.2vw, 80px)";   // FIND / FOUND
  const FS_MEDIUM = "clamp(36px, 3.6vw, 55px)";   // MY / YOUR / FORMULA (same size)

  return (
    <section
      id="find-your-formula"
      style={{ background: "#0e1114", overflow: "hidden", scrollMarginTop: "72px" }}
    >
      {/* ── Three-column grid: [FORM | HEADLINE | REC] — form and rec equal width ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", alignItems: "stretch" }}>

        {/* ══════ LEFT — FORM ══════ */}
        <div
          style={{
            background: C.formBg,
            padding: "44px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Dog name */}
          <div style={{ marginBottom: "20px" }}>
            <span className="block text-[9px] font-semibold tracking-[0.22em] uppercase mb-2" style={{ color: C.textMeta }}>DOG'S NAME</span>
            <input
              type="text" value={dogName} onChange={(e) => setDogName(e.target.value)}
              placeholder="e.g. Buddy" maxLength={24}
              className="w-full bg-transparent text-lg font-medium outline-none pb-2 border-b placeholder:opacity-25 transition-colors duration-200"
              style={{ color: C.textHi, caretColor: C.textHi, borderColor: C.borderMd }}
              onFocus={(e) => (e.target.style.borderColor = C.borderHi)}
              onBlur={(e)  => (e.target.style.borderColor = C.borderMd)}
            />
          </div>

          {/* Age group */}
          <div style={{ marginBottom: "20px" }}>
            <span className="block text-[9px] font-semibold tracking-[0.22em] uppercase mb-2" style={{ color: C.textMeta }}>AGE GROUP</span>
            <div className="flex gap-2">
              {(["puppy", "adult", "senior"] as AgeGroup[]).map((a) => (
                <button key={a} onClick={() => setAge(age === a ? null : a)}
                  className="flex-1 py-2.5 text-center rounded border transition-all duration-200"
                  style={{ background: age === a ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)", borderColor: age === a ? C.borderHi : C.borderMd, color: age === a ? C.textHi : C.textMeta }}>
                  <div className="text-xs font-semibold">{a.charAt(0).toUpperCase() + a.slice(1)}</div>
                  <div className="text-[9px] mt-0.5" style={{ color: age === a ? C.textBody : C.textDim }}>{a === "puppy" ? "0–1 yr" : a === "adult" ? "1–7 yr" : "7+ yr"}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Weight */}
          <div style={{ marginBottom: "20px" }}>
            <span className="block text-[9px] font-semibold tracking-[0.22em] uppercase mb-2" style={{ color: C.textMeta }}>BODY WEIGHT</span>
            <div className="flex items-baseline gap-2 mb-3">
              <input type="text" inputMode="numeric" value={weightInput}
                onChange={handleWeightInput} onBlur={handleWeightBlur}
                className="text-3xl font-black bg-transparent outline-none w-14 text-center border-b transition-colors duration-150"
                style={{ fontFamily: BC, color: C.textHi, borderColor: C.borderMd }}
                onFocus={(e) => { e.target.select(); (e.target as HTMLInputElement).style.borderColor = C.borderHi; }}
                onBlur={(e)  => { handleWeightBlur(); (e.target as HTMLInputElement).style.borderColor = C.borderMd; }}
              />
              <span className="text-base font-bold" style={{ color: C.textBody }}>kg</span>
            </div>
            <input type="range" min={1} max={60} step={1} value={weight} onChange={handleSlider} className="dosing-range w-full" />
            <div className="flex justify-between mt-2">
              {SIZE_LABELS.map((s, i) => (
                <span key={s} className={`text-[9px] ${i === 0 ? "text-left" : i === SIZE_LABELS.length - 1 ? "text-right" : "text-center"}`} style={{ color: C.textDim }}>{s}</span>
              ))}
            </div>
          </div>

          {/* Symptoms */}
          <div style={{ flex: 1 }}>
            <div className="flex items-center justify-between mb-2">
              <span className="block text-[9px] font-semibold tracking-[0.22em] uppercase" style={{ color: C.textMeta }}>PRESENTING SYMPTOMS</span>
              {symptoms.size > 0 && (
                <button onClick={() => setSymptoms(new Set())} className="text-[9px] font-semibold tracking-widest uppercase transition-colors duration-150" style={{ color: C.textMeta }}>CLEAR</button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {(Object.keys(SYMPTOMS) as SymptomKey[]).map((sk) => {
                const sel = symptoms.has(sk);
                return (
                  <button key={sk} onClick={() => toggleSymptom(sk)}
                    className="px-2.5 py-2 text-left text-[11px] font-medium rounded border transition-all duration-150"
                    style={sel ? { borderWidth: "1px", ...chipStyle(sk, true) } : { background: "rgba(255,255,255,0.02)", borderColor: C.borderMd, color: C.textMeta, borderWidth: "1px" }}>
                    {SYMPTOMS[sk].label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status + CTA */}
          <div style={{ marginTop: "16px", flexShrink: 0 }}>
            <AnimatePresence>
              {symptoms.size > 0 && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                  className="text-[10px] mb-3" style={{ color: C.textMeta }}>
                  {symptoms.size} symptom{symptoms.size > 1 ? "s" : ""} selected{age ? ` · ${age}` : ""}
                </motion.p>
              )}
            </AnimatePresence>
            <button
              onClick={handleFind}
              disabled={!canFind}
              className="w-full flex items-center justify-center gap-2 py-3 rounded font-semibold text-sm tracking-wide transition-all duration-200"
              style={{
                background: canFind ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
                border:     `1px solid ${canFind ? C.borderHi : C.borderMd}`,
                color:      canFind ? C.textHi : C.textDim,
                cursor:     canFind ? "pointer" : "default",
              }}>
              Find My Formula
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ══════ CENTRE — HEADLINE (grey bg, black text, text morphs in place, never moves) ══════ */}
        <div
          style={{
            background: W.bg,
            display: "flex",
            flexDirection: "column",
            padding: "clamp(80px, 9vh, 140px) 40px 44px 48px",
          }}
        >
          {/* ── Word 1: FIND fades out → FOUND wipes in left-to-right (pack colour) ── */}
          <div style={{ position: "relative", height: `clamp(52px, 5.2vw, 80px)`, overflow: "hidden" }}>
            <AnimatePresence mode="popLayout">
              {slideState === "input" ? (
                <motion.span
                  key="find"
                  exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, filter: "blur(4px)", transition: { duration: 0.18, ease: "easeIn" } }}
                  style={wordStyle(FS_LARGE, W.text)}
                >
                  FIND
                </motion.span>
              ) : (
                <motion.span
                  key="found"
                  initial={prefersReducedMotion ? { opacity: 0 } : { clipPath: "inset(0 100% 0 0)" }}
                  animate={prefersReducedMotion ? { opacity: 1 } : { clipPath: "inset(0 0% 0 0)" }}
                  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.62, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
                  style={wordStyle(FS_LARGE, p.hex)}
                >
                  FOUND
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* ── Word 2: MY fades out → YOUR fades in (blur dissolve, no movement) ── */}
          <div style={{ position: "relative", height: `clamp(36px, 3.6vw, 55px)`, overflow: "hidden", marginTop: "4px" }}>
            <AnimatePresence mode="popLayout">
              {slideState === "input" ? (
                <motion.span
                  key="my"
                  exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, filter: "blur(6px)", transition: { duration: 0.2, delay: 0.04 } }}
                  style={wordStyle(FS_MEDIUM, W.text)}
                >
                  MY
                </motion.span>
              ) : (
                <motion.span
                  key="your"
                  initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, filter: "blur(8px)" }}
                  animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, filter: "blur(0px)" }}
                  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.38 }}
                  style={wordStyle(FS_MEDIUM, W.text)}
                >
                  YOUR
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* ── FORMULA — always black ── */}
          <div style={{ marginTop: "6px" }}>
            <span style={{ fontFamily: BC, fontSize: FS_MEDIUM, fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1, display: "block", color: W.text }}>
              FORMULA
            </span>
          </div>

          {/* "Formula for [Name]" — sits below FORMULA, never shifts the word stack */}
          <div style={{ marginTop: "14px", minHeight: "16px" }}>
            <AnimatePresence>
              {slideState === "result" && (
                <motion.span
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ delay: 0.55, duration: 0.25 }}
                  style={{ display: "block", fontSize: "9px", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: W.textLow }}>
                  {displayName ? `Formula for ${displayName}` : "Found Your Formula"}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Bottom summary + start over — result only */}
          <AnimatePresence>
            {slideState === "result" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                transition={{ delay: 0.6, duration: 0.3 }}>
                <div style={{ borderTop: `1px solid ${W.border}`, paddingTop: "16px", marginBottom: "14px" }}>
                  <div style={{ fontSize: "12px", color: W.textMid, lineHeight: "1.7" }}>
                    {displayName && <span style={{ color: W.text, fontWeight: 600 }}>{displayName} · </span>}
                    {age && <span>{age.charAt(0).toUpperCase() + age.slice(1)} · </span>}
                    <span>{weight}kg</span>
                    {symptoms.size > 0 && <span> · {symptoms.size} symptom{symptoms.size > 1 ? "s" : ""} analysed</span>}
                  </div>
                </div>
                <button onClick={handleReset}
                  style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: W.textLow, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  <RotateCcw style={{ width: "11px", height: "11px" }} />
                  Start over
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ══════ RIGHT — REC PANEL (slides in from right) ══════ */}
        <div style={{ position: "relative", overflow: "hidden", background: "#12161a" }}>
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              background: "#12161a",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
            }}
            initial={{ x: "100%" }}
            animate={{ x: slideState === "input" ? "100%" : "0%" }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            {rec && (
              <>
                {/* ── Product header: text left, BIG cropped tin right ── */}
                <div style={{ borderBottom: `1px solid ${R.border}`, display: "flex", alignItems: "stretch", flexShrink: 0, overflow: "hidden" }}>
                  {/* Text */}
                  <div style={{ flex: 1, padding: "24px 20px 20px 28px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <div style={{ fontSize: "8px", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: p.hex, marginBottom: "6px" }}>{p.system}</div>
                    <div style={{ fontFamily: BN, fontSize: "28px", fontWeight: 800, letterSpacing: "-0.01em", color: R.text, lineHeight: 1, marginBottom: "6px" }}>{p.name}</div>
                    <div style={{ fontSize: "11px", color: R.textMid, lineHeight: "1.4", marginBottom: "12px" }}>{p.tagline}</div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "3px 10px", borderRadius: "999px", fontSize: "10px", fontWeight: 600, background: `rgba(${p.rgb},0.1)`, border: `1px solid rgba(${p.rgb},0.22)`, color: p.hex }}>
                      {confLabel}
                    </div>
                  </div>
                  {/* BIG tin — overflow:hidden crops the transparent padding */}
                  <div style={{ width: "148px", flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: `rgba(${p.rgb},0.08)` }}>
                    <motion.img
                      key={rec.primary} src={p.image} alt={p.name}
                      style={{
                        width: "220px",
                        height: "220px",
                        objectFit: "contain",
                        filter: "drop-shadow(0 10px 28px rgba(0,0,0,0.55))",
                        transform: "scale(1.18)",
                        transformOrigin: "center center",
                      }}
                      initial={prefersReducedMotion ? false : { opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1.18 }}
                      transition={{ delay: 0.45, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>

                {/* ── DAILY DOSE — top position, big display ── */}
                <div style={{ padding: "20px 28px 18px", borderBottom: `1px solid ${R.border}`, flexShrink: 0 }}>
                  <div style={{ fontSize: "8px", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: R.textLow, marginBottom: "10px" }}>
                    DAILY DOSE{displayName ? ` FOR ${displayName.toUpperCase()}` : ""}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "16px" }}>
                    <span style={{ fontFamily: BN, fontSize: "60px", fontWeight: 900, lineHeight: 1, color: R.text, letterSpacing: "-0.02em" }}>
                      <AnimatedNumber value={sachets} />
                    </span>
                    <div>
                      <div style={{ fontSize: "15px", fontWeight: 600, color: R.textMid }}>sachet{sachetLabel !== "1" ? "s" : ""}</div>
                      <div style={{ fontSize: "11px", color: R.textLow }}>per day · with food</div>
                    </div>
                  </div>

                  {/* Metrics row — pack size BIGGER */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderRadius: "6px", overflow: "hidden", border: `1px solid ${R.border}` }}>
                    {([
                      { val: weight.toString(), unit: "kg",      sub: "dog weight" },
                      { val: String(Math.floor(30 / sachets)),   unit: "days", sub: "per box" },
                      { val: "30",              unit: "sachets", sub: "box size"   },
                    ] as { val: string; unit: string; sub: string }[]).map((s, i) => (
                      <div key={i} style={{ padding: "12px 14px", background: R.surf, borderLeft: i > 0 ? `1px solid ${R.border}` : undefined }}>
                        <div style={{ display: "flex", alignItems: "baseline", gap: "3px" }}>
                          <span style={{ fontFamily: BN, fontSize: "30px", fontWeight: 900, color: R.text, lineHeight: 1 }}>{s.val}</span>
                          <span style={{ fontSize: "11px", fontWeight: 600, color: R.textMid, marginLeft: "1px" }}>{s.unit}</span>
                        </div>
                        <div style={{ fontSize: "8px", textTransform: "uppercase", letterSpacing: "0.12em", color: R.textLow, marginTop: "3px" }}>{s.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Ingredient connections ── */}
                <div style={{ padding: "14px 28px 10px", borderBottom: `1px solid ${R.border}`, flexShrink: 0 }}>
                  <div style={{ fontSize: "8px", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: R.textLow, marginBottom: "8px" }}>INGREDIENT CONNECTIONS</div>
                  {rec.matched.map((m) => {
                    const mp = PRODUCTS[m.product];
                    return (
                      <div key={m.key} style={{ display: "flex", gap: "8px", padding: "6px 0", borderBottom: `1px solid ${R.border}` }}>
                        <div style={{ width: "110px", flexShrink: 0 }}>
                          <span style={{ fontSize: "11px", fontWeight: 500, color: m.product === rec.primary ? R.textMid : mp.hex }}>{SYMPTOMS[m.key].label}</span>
                        </div>
                        <span style={{ fontSize: "11px", color: R.textLow }}>→</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "11px", fontWeight: 600, color: mp.hex }}>{m.ingredient}</div>
                          <div style={{ fontSize: "10px", color: R.textLow }}>{m.benefit}{m.product !== rec.primary ? ` · ${PRODUCTS[m.product].name}` : ""}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ── Expected onset ── */}
                <div style={{ padding: "14px 28px", borderBottom: `1px solid ${R.border}`, flexShrink: 0 }}>
                  <div style={{ fontSize: "8px", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: R.textLow, marginBottom: "8px" }}>
                    EXPECTED ONSET — {ageKey.toUpperCase()} DOG
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                    {[
                      { label: "FIRST CHANGES", wk: firstWk },
                      { label: "FULL EFFECT",   wk: fullWk  },
                      null,
                    ].map((cell, i) => (
                      <div key={i} style={{ background: R.surf, borderRadius: "5px", padding: "10px 12px" }}>
                        {cell ? (
                          <>
                            <div style={{ fontSize: "8px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: p.hex, marginBottom: "4px" }}>{cell.label}</div>
                            <div style={{ fontFamily: BN, fontSize: "24px", fontWeight: 900, color: R.text, lineHeight: 1 }}>{cell.wk}</div>
                          </>
                        ) : (
                          <div style={{ fontSize: "10px", fontStyle: "italic", color: R.textLow, lineHeight: "1.5" }}>Daily use required. Seniors may take longer.</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Also consider (up to 2 products) + CTA ── */}
                <div style={{ marginTop: "auto" }}>
                  {rec.secondary.slice(0, 2).map((secKey, idx) => {
                    const sp = PRODUCTS[secKey];
                    return (
                      <div key={secKey} style={{
                        padding: "12px 28px",
                        background: `rgba(${sp.rgb},0.07)`,
                        borderTop: `1px solid rgba(${sp.rgb},0.18)`,
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: sp.hex, flexShrink: 0 }} />
                          <div>
                            <div style={{ fontSize: "8px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: sp.hex, opacity: 0.6 }}>
                              {idx === 0 ? "Also Consider" : "Or Consider"}
                            </div>
                            <div style={{ fontFamily: BN, fontSize: "17px", fontWeight: 800, color: sp.hex, lineHeight: 1 }}>{sp.name}</div>
                          </div>
                        </div>
                        <img src={sp.image} alt={sp.name} style={{ width: "44px", height: "44px", objectFit: "contain", opacity: 0.9 }} />
                      </div>
                    );
                  })}
                  <a href={p.url} target="_blank" rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 28px", background: `rgba(${p.rgb},0.1)`, borderTop: `1px solid rgba(${p.rgb},0.2)`, textDecoration: "none" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: p.hex }}>View on Amazon India</span>
                    <ArrowRight style={{ width: "14px", height: "14px", color: p.hex, opacity: 0.6 }} />
                  </a>
                </div>
              </>
            )}
          </motion.div>
        </div>{/* end right col */}

      </div>{/* end grid */}

      {/* Disclaimer — sits under the rec panel (right third) */}
      <div style={{ maxWidth: "33.333%", marginLeft: "66.666%", padding: "14px 28px" }}>
        <p style={{ fontSize: "10px", lineHeight: "1.6", color: "rgba(255,255,255,0.38)" }}>
          Always follow the product label and consult your vet, especially for puppies, seniors, or dogs on medication. This tool is not a substitute for veterinary guidance.
        </p>
      </div>
    </section>
  );
};

export default DiagnosticTool;
