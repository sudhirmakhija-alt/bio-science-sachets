import { useScrollState } from "./ScrollContext";

/**
 * Stage-driven gradient overlay with Gaussian blur for "origin" (The Legacy).
 * Surgical White → Laboratory Grey base, tinted per stage.
 */
const stageGradients: Record<string, { from: string; to: string; blur: number }> = {
  hero:     { from: "rgba(255,255,255,0.14)", to: "rgba(245,248,252,0.10)", blur: 0 },
  xray:     { from: "rgba(248,248,248,0.50)", to: "rgba(238,238,240,0.40)", blur: 0 },
  origin:   { from: "rgba(255,250,240,0.50)", to: "rgba(248,240,225,0.40)", blur: 12 },
  organ:    { from: "rgba(255,248,245,0.45)", to: "rgba(252,242,238,0.35)", blur: 0 },
  gut:      { from: "rgba(245,255,248,0.45)", to: "rgba(240,252,242,0.35)", blur: 0 },
  omega:    { from: "rgba(245,248,255,0.45)", to: "rgba(238,244,255,0.35)", blur: 0 },
  dosing:   { from: "rgba(242,248,255,0.45)", to: "rgba(238,246,255,0.35)", blur: 0 },
  science:  { from: "rgba(245,252,245,0.40)", to: "rgba(240,250,240,0.30)", blur: 0 },
  products: { from: "rgba(250,250,250,0.50)", to: "rgba(244,244,244,0.40)", blur: 0 },
};

const ScrollGradientOverlay = () => {
  const { stage } = useScrollState();
  const g = stageGradients[stage] ?? stageGradients.hero;

  return (
    <div
      className="fixed inset-0 z-[1] pointer-events-none"
      style={{
        background: `linear-gradient(180deg, ${g.from} 0%, ${g.to} 100%)`,
        backdropFilter: g.blur > 0 ? `blur(${g.blur}px)` : "none",
        WebkitBackdropFilter: g.blur > 0 ? `blur(${g.blur}px)` : "none",
        transition: "background 1.2s ease-out, backdrop-filter 1.2s ease-out",
      }}
    />
  );
};

export default ScrollGradientOverlay;
