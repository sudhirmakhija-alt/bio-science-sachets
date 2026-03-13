import { useScrollState } from "./ScrollContext";
import { useMemo } from "react";

/** Maps scroll stage to background gradient colors */
const stageGradients: Record<string, { from: string; to: string }> = {
  hero: { from: "rgba(255,255,255,0.92)", to: "rgba(245,248,252,0.88)" },
  xray: { from: "rgba(248,248,248,0.94)", to: "rgba(240,240,242,0.92)" },
  origin: { from: "rgba(255,252,245,0.90)", to: "rgba(250,245,235,0.88)" },
  dosing: { from: "rgba(245,250,255,0.90)", to: "rgba(240,248,255,0.88)" },
  science: { from: "rgba(248,255,248,0.92)", to: "rgba(245,252,245,0.90)" },
  products: { from: "rgba(250,250,250,0.94)", to: "rgba(245,245,245,0.92)" },
};

const ScrollGradientOverlay = () => {
  const { stage } = useScrollState();
  const gradient = stageGradients[stage] || stageGradients.hero;

  return (
    <div
      className="fixed inset-0 z-[1] pointer-events-none transition-all duration-1000 ease-out"
      style={{
        background: `linear-gradient(180deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
      }}
    />
  );
};

export default ScrollGradientOverlay;
