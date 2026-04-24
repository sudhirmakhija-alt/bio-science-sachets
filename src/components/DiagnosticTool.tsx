import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, RotateCcw } from "lucide-react";
import omegaProduct from "@/assets/BLP_Omega_Balance.png";
import organProduct from "@/assets/BLP_Organ_Balance.png";
import gutProduct   from "@/assets/BLP_Gut_Balance.png";

// ── Colour tokens ──────────────────────────────────────────────────────────
const C = {
  formBg:   "#161a1e",
  borderLo: "#1e2226",
  borderMd: "#272d33",
  borderHi: "#3a4550",
  textHi:   "#dfe3ea",
  textBody: "#8a96a4",
  textMeta: "#5e6b78",
  textDim:  "#3a444e",
} as const;

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

const BC = "'Barlow', sans-serif";
const BN = "'Barlow Condensed', sans-serif";

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
type AgeGroup   = "puppy" | "adult" | "senior";
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

// Returns full chip style — unified for selected + unselected, with spotlight glow
function chipStyle(sk: SymptomKey, selected: boolean): React.CSSProperties {
  const top = (Object.entries(SYMPTOMS[sk].scores) as [ProductKey, number][])
    .sort(([, a], [, b]) => b - a)[0]?.[0];
  const prod = top ? PRODUCTS[top] : null;
  const glowRgb = prod ? prod.rgb : "255,255,255";
  return {
    backgroundColor:      selected && prod ? `rgba(${prod.rgb},0.14)` : "rgba(255,255,255,0.02)",
    backgroundImage:      `radial-gradient(160px 160px at calc(var(--cursor-x, -9999) * 1px) calc(var(--cursor-y, -9999) * 1px), rgba(${glowRgb},0.11), transparent)`,
    backgroundAttachment: "fixed",
    borderWidth:          "1px",
    borderColor:          selected && prod ? `rgba(${prod.rgb},0.5)` : "rgba(255,255,255,0.12)",
    color:                selected && prod ? prod.hex : "rgba(232,238,244,0.55)",
  };
}

// ── Animated number ────────────────────────────────────────────────────────
const AnimatedNumber = ({ value, duration = 500 }: { value: number; duration?: number }) => {
  const prefersReducedMotion = useReducedMotion();
  const [display, setDisplay]   = useState(value);
  const rafRef   = useRef<number | null>(null);
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

// ── Shared inline style for headline words (position:absolute so they never shift layout)
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
  const [isMobile,    setIsMobile]    = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 1024
  );

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

  // Track global cursor position for spotlight effects — no re-renders, pure CSS vars
  useEffect(() => {
    const handler = (e: PointerEvent) => {
      document.documentElement.style.setProperty("--cursor-x", String(e.clientX));
      document.documentElement.style.setProperty("--cursor-y", String(e.clientY));
    };
    document.addEventListener("pointermove", handler);
    return () => document.removeEventListener("pointermove", handler);
  }, []);

  // Responsive breakpoint tracker
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

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

  // Headline font size tokens
  const FS_LARGE  = "clamp(52px, 5.2vw, 80px)";
  const FS_MEDIUM = "clamp(36px, 3.6vw, 55px)";

  // Word 2 result: "BUDDY'S" or "YOUR"
  const word2ResultText = displayName ? `${displayName.toUpperCase()}'S` : "YOUR";
  const word2ResultFS =
    displayName && displayName.length > 8 ? "clamp(22px, 2.2vw, 34px)" :
    displayName && displayName.length > 5 ? "clamp(28px, 2.8vw, 44px)" :
    FS_MEDIUM;

  // Age button spotlight
  const ageButtonStyle = (selected: boolean): React.CSSProperties => ({
    backgroundImage:      `radial-gradient(180px 180px at calc(var(--cursor-x, -9999) * 1px) calc(var(--cursor-y, -9999) * 1px), rgba(255,255,255,0.07), transparent)`,
    backgroundAttachment: "fixed",
    backgroundColor:      selected ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
    borderColor:          selected ? C.borderHi : "rgba(255,255,255,0.12)",
    color:                selected ? C.textHi : "rgba(232,238,244,0.55)",
  });

  // ── Extracted rec panel content (shared by desktop slide + mobile fade) ──
  const recPanelContent = rec ? (
    <>
      {/* Product header */}
      <div style={{ borderBottom: `1px solid ${R.border}`, display: "flex", alignItems: "stretch", flexShrink: 0 }}>
        <div style={{ flex: 1, padding: "24px 20px 22px 28px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.20em", textTransform: "uppercase", color: p.hex, marginBottom: "7px" }}>{p.system}</div>
          <div style={{ fontFamily: BN, fontSize: "30px", fontWeight: 800, letterSpacing: "-0.01em", color: R.text, lineHeight: 1, marginBottom: "7px" }}>{p.name}</div>
          <div style={{ fontSize: "12px", color: R.textMid, lineHeight: "1.5", marginBottom: "14px" }}>{p.tagline}</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "4px 11px", borderRadius: "999px", fontSize: "11px", fontWeight: 600, background: `rgba(${p.rgb},0.1)`, border: `1px solid rgba(${p.rgb},0.22)`, color: p.hex }}>
            {confLabel}
          </div>
        </div>
        {/* Tin — 20% smaller than previous 112px = 90px */}
        <div style={{ width: "120px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: `rgba(${p.rgb},0.07)`, padding: "14px 12px" }}>
          <motion.img
            key={rec.primary} src={p.image} alt={p.name}
            style={{ width: "90px", height: "auto", objectFit: "contain", filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.5))" }}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      {/* Daily dose */}
      <div style={{ padding: "22px 28px 20px", borderBottom: `1px solid ${R.border}`, flexShrink: 0 }}>
        <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.20em", textTransform: "uppercase", color: R.textMid, marginBottom: "12px" }}>
          DAILY DOSE{displayName ? ` FOR ${displayName.toUpperCase()}` : ""}
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "18px" }}>
          <span style={{ fontFamily: BN, fontSize: "64px", fontWeight: 900, lineHeight: 1, color: R.text, letterSpacing: "-0.02em" }}>
            <AnimatedNumber value={sachets} />
          </span>
          <div style={{ paddingBottom: "4px" }}>
            <div style={{ fontSize: "17px", fontWeight: 600, color: R.text, lineHeight: 1.1 }}>sachet{sachetLabel !== "1" ? "s" : ""}</div>
            <div style={{ fontSize: "12px", color: R.textMid, marginTop: "3px" }}>per day · with food</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderRadius: "6px", overflow: "hidden", border: `1px solid ${R.border}` }}>
          {([
            { val: weight.toString(), unit: "kg",      sub: "body weight" },
            { val: String(Math.floor(30 / sachets)),   unit: "days",     sub: "per box"   },
            { val: "30",              unit: "sachets", sub: "box size"   },
          ] as { val: string; unit: string; sub: string }[]).map((s, i) => (
            <div key={i} style={{ padding: "13px 14px", background: R.surf, borderLeft: i > 0 ? `1px solid ${R.border}` : undefined }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "3px" }}>
                <span style={{ fontFamily: BN, fontSize: "28px", fontWeight: 900, color: R.text, lineHeight: 1 }}>{s.val}</span>
                <span style={{ fontSize: "12px", fontWeight: 600, color: R.textMid, marginLeft: "2px" }}>{s.unit}</span>
              </div>
              <div style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.10em", color: R.textMid, marginTop: "4px" }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Ingredient connections */}
      <div style={{ padding: "16px 28px 12px", borderBottom: `1px solid ${R.border}`, flexShrink: 0 }}>
        <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.20em", textTransform: "uppercase", color: R.textMid, marginBottom: "10px" }}>INGREDIENT CONNECTIONS</div>
        {rec.matched.map((m) => {
          const mp = PRODUCTS[m.product];
          return (
            <div key={m.key} style={{ display: "flex", gap: "10px", padding: "7px 0", borderBottom: `1px solid ${R.border}` }}>
              <div style={{ width: "114px", flexShrink: 0 }}>
                <span style={{ fontSize: "12px", fontWeight: 500, color: m.product === rec.primary ? R.textMid : mp.hex }}>{SYMPTOMS[m.key].label}</span>
              </div>
              <span style={{ fontSize: "12px", color: R.textMid }}>→</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: mp.hex }}>{m.ingredient}</div>
                <div style={{ fontSize: "11px", color: R.textMid, marginTop: "1px" }}>{m.benefit}{m.product !== rec.primary ? ` · ${PRODUCTS[m.product].name}` : ""}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expected onset */}
      <div style={{ padding: "16px 28px", borderBottom: `1px solid ${R.border}`, flexShrink: 0 }}>
        <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.20em", textTransform: "uppercase", color: R.textMid, marginBottom: "10px" }}>
          EXPECTED ONSET — {ageKey.toUpperCase()} DOG
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
          {[
            { label: "FIRST CHANGES", wk: firstWk },
            { label: "FULL EFFECT",   wk: fullWk  },
            null,
          ].map((cell, i) => (
            <div key={i} style={{ background: R.surf, borderRadius: "5px", padding: "11px 12px" }}>
              {cell ? (
                <>
                  <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: p.hex, marginBottom: "6px" }}>{cell.label}</div>
                  <div style={{ fontFamily: BN, fontSize: "26px", fontWeight: 900, color: R.text, lineHeight: 1, letterSpacing: "0.06em" }}>{cell.wk}</div>
                </>
              ) : (
                <div style={{ fontSize: "11px", fontStyle: "italic", color: R.textMid, lineHeight: "1.6" }}>Daily use required. Seniors may take longer.</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Also consider + CTA */}
      <div style={{ marginTop: "auto" }}>
        {rec.secondary.slice(0, 2).map((secKey, idx) => {
          const sp = PRODUCTS[secKey];
          return (
            <div key={secKey} style={{ padding: "12px 28px", background: `rgba(${sp.rgb},0.07)`, borderTop: `1px solid rgba(${sp.rgb},0.18)`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: sp.hex, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: sp.hex, opacity: 0.7 }}>
                    {idx === 0 ? "Also Consider" : "Or Consider"}
                  </div>
                  <div style={{ fontFamily: BN, fontSize: "18px", fontWeight: 800, color: sp.hex, lineHeight: 1 }}>{sp.name}</div>
                </div>
              </div>
              <img src={sp.image} alt={sp.name} style={{ width: "44px", height: "44px", objectFit: "contain", opacity: 0.9 }} />
            </div>
          );
        })}
        <a href={p.url} target="_blank" rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 28px", background: `rgba(${p.rgb},0.1)`, borderTop: `1px solid rgba(${p.rgb},0.2)`, textDecoration: "none" }}>
          <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: p.hex }}>View on Amazon India</span>
          <ArrowRight style={{ width: "14px", height: "14px", color: p.hex, opacity: 0.6 }} />
        </a>
      </div>
    </>
  ) : null;

  return (
    <section id="find-your-formula" style={{ background: "#0e1114", overflow: "hidden", scrollMarginTop: "72px" }}>

      {/* ── Three-column grid — responsive via .dt-grid class ── */}
      <div className="dt-grid">

        {/* ══════ LEFT — FORM ══════ */}
        <div className="dt-form" style={{ background: C.formBg, display: "flex", flexDirection: "column" }}>

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
                  style={ageButtonStyle(age === a)}>
                  <div className="text-xs font-semibold">{a.charAt(0).toUpperCase() + a.slice(1)}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: age === a ? C.textBody : "rgba(232,238,244,0.32)" }}>
                    {a === "puppy" ? "0–1 yr" : a === "adult" ? "1–7 yr" : "7+ yr"}
                  </div>
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
                    className="px-2.5 py-2 text-left text-[12px] font-medium rounded border transition-all duration-150"
                    style={chipStyle(sk, sel)}>
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
              onClick={handleFind} disabled={!canFind}
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
        </div>{/* end form */}

        {/* ══════ CENTRE — HEADLINE ══════ */}
        <div className="dt-center" style={{ background: W.bg, display: "flex", flexDirection: "column", position: "relative" }}>

          {/* ── Product-colour bloom — fades in with transition ── */}
          <motion.div
            aria-hidden
            style={{
              position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
              background: `radial-gradient(ellipse 110% 55% at -8% 38%, ${p.hex}28 0%, transparent 62%)`,
            }}
            animate={{ opacity: slideState === "result" ? 1 : 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : {
              duration: 1.1,
              ease: [0.16, 1, 0.3, 1],
              delay: slideState === "result" ? 0.05 : 0.2,
            }}
          />

          {/* Content above bloom glow */}
          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", flex: 1 }}>

            {/* Word 1: FIND → FOUND (clip-path wipe, both always in DOM) */}
            <div style={{ position: "relative", height: `clamp(52px, 5.2vw, 80px)`, overflow: "hidden" }}>
              <motion.span
                animate={prefersReducedMotion
                  ? { opacity: slideState === "result" ? 0 : 1 }
                  : { opacity: slideState === "result" ? 0 : 1, filter: slideState === "result" ? "blur(4px)" : "blur(0px)" }}
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.18, ease: "easeIn" }}
                style={wordStyle(FS_LARGE, W.text)}
              >FIND</motion.span>

              <motion.span
                animate={prefersReducedMotion
                  ? { opacity: slideState === "result" ? 1 : 0 }
                  : { clipPath: slideState === "result" ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" }}
                transition={prefersReducedMotion ? { duration: 0 } : {
                  duration: 0.62, ease: [0.16, 1, 0.3, 1], delay: slideState === "result" ? 0.08 : 0,
                }}
                style={wordStyle(FS_LARGE, p.hex)}
              >FOUND</motion.span>
            </div>

            {/* Word 2: MY → BUDDY'S / YOUR */}
            <div style={{ position: "relative", height: `clamp(36px, 3.6vw, 55px)`, overflow: "hidden", marginTop: "4px" }}>
              <motion.span
                animate={prefersReducedMotion
                  ? { opacity: slideState === "result" ? 0 : 1 }
                  : { opacity: slideState === "result" ? 0 : 1, filter: slideState === "result" ? "blur(6px)" : "blur(0px)" }}
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2, delay: slideState === "result" ? 0.04 : 0 }}
                style={wordStyle(FS_MEDIUM, W.text)}
              >MY</motion.span>

              {/* Dog name — glows when it appears */}
              <motion.span
                animate={prefersReducedMotion
                  ? { opacity: slideState === "result" ? 1 : 0 }
                  : { opacity: slideState === "result" ? 1 : 0, filter: slideState === "result" ? "blur(0px)" : "blur(8px)" }}
                transition={prefersReducedMotion ? { duration: 0 } : {
                  duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: slideState === "result" ? 0.38 : 0,
                }}
                style={{
                  ...wordStyle(word2ResultFS, W.text),
                  textShadow: slideState === "result"
                    ? `0 0 32px ${p.hex}99, 0 0 60px ${p.hex}44`
                    : "none",
                  transition: "text-shadow 0.6s ease 0.5s",
                }}
              >{word2ResultText}</motion.span>
            </div>

            {/* FORMULA — static */}
            <div style={{ marginTop: "6px" }}>
              <span style={{ fontFamily: BC, fontSize: FS_MEDIUM, fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1, display: "block", color: W.text }}>
                FORMULA
              </span>
            </div>

            {/* Recommendation sub-label */}
            <div style={{ marginTop: "14px", minHeight: "16px" }}>
              <AnimatePresence>
                {slideState === "result" && (
                  <motion.span
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ delay: 0.55, duration: 0.25 }}
                    style={{ display: "block", fontSize: "9px", fontWeight: 700, letterSpacing: "0.20em", textTransform: "uppercase", color: W.textMid }}>
                    HERE'S BIOLOGICA'S RECOMMENDATION
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <div style={{ flex: 1 }} />

            {/* Bottom summary + start over */}
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

          </div>{/* end content wrapper */}
        </div>{/* end centre */}

        {/* ══════ RIGHT — REC PANEL ══════ */}
        {isMobile ? (
          /* Mobile: normal flow, AnimatePresence mount/unmount */
          <AnimatePresence>
            {slideState === "result" && (
              <motion.div
                key="mobile-rec"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                style={{ background: "#12161a", display: "flex", flexDirection: "column" }}
              >
                {recPanelContent}
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          /* Desktop: absolute fill + slide in from right */
          <div style={{ position: "relative", overflow: "hidden", background: "#12161a" }}>
            <motion.div
              style={{ position: "absolute", inset: 0, background: "#12161a", display: "flex", flexDirection: "column", overflowY: "auto" }}
              initial={{ x: "100%" }}
              animate={{ x: slideState === "input" ? "100%" : "0%" }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            >
              {recPanelContent}
            </motion.div>
          </div>
        )}

      </div>{/* end dt-grid */}

      {/* Disclaimer */}
      <div className="dt-disclaimer">
        <p style={{ fontSize: "10px", lineHeight: "1.6", color: "rgba(255,255,255,0.38)" }}>
          Always follow the product label and consult your vet, especially for puppies, seniors, or dogs on medication. This tool is not a substitute for veterinary guidance.
        </p>
      </div>

    </section>
  );
};

export default DiagnosticTool;
