import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";

interface ScrollState {
  /** 0-1 normalized scroll through entire page */
  progress: number;
  /** Current stage based on visible section */
  stage: string;
  /** Scroll velocity (pixels/frame, smoothed) */
  velocity: number;
  /** Mouse position normalized -1 to 1 */
  mouseX: number;
  mouseY: number;
  /** Dosing sachet count for 3D reaction */
  dosingCount: number;
  setDosingCount: (n: number) => void;
}

const ScrollContext = createContext<ScrollState>({
  progress: 0,
  stage: "hero",
  velocity: 0,
  mouseX: 0,
  mouseY: 0,
  dosingCount: 1.5,
  setDosingCount: () => {},
});

export const useScrollState = () => useContext(ScrollContext);

// Map section IDs to stage names for color transitions
const SECTION_STAGE_MAP: [string, string][] = [
  ["products", "products"],  // checked first so individual product sections take priority
  ["science", "science"],
  ["dosing", "dosing"],
  ["origin", "origin"],
  ["xray", "xray"],
];

const detectStage = (): string => {
  const scrollTop = window.scrollY;
  const viewportMid = scrollTop + window.innerHeight * 0.5;

  // Check for product catalog section — detect individual product cards
  const productSection = document.getElementById("products");
  if (productSection) {
    const rect = productSection.getBoundingClientRect();
    const absTop = rect.top + scrollTop;
    const absBottom = rect.bottom + scrollTop;
    if (viewportMid >= absTop && viewportMid <= absBottom) {
      // Find which product card is most visible
      const cards = productSection.querySelectorAll("[data-product]");
      for (let i = cards.length - 1; i >= 0; i--) {
        const cardRect = cards[i].getBoundingClientRect();
        const cardMid = cardRect.top + scrollTop + cardRect.height / 2;
        if (viewportMid >= cardMid - cardRect.height) {
          const product = cards[i].getAttribute("data-product");
          if (product === "organ" || product === "gut" || product === "omega") {
            return product;
          }
        }
      }
      return "products";
    }
  }

  // Check other named sections
  for (const [id, stage] of SECTION_STAGE_MAP) {
    const el = document.getElementById(id);
    if (el) {
      const rect = el.getBoundingClientRect();
      const absTop = rect.top + scrollTop;
      const absBottom = rect.bottom + scrollTop;
      if (viewportMid >= absTop && viewportMid <= absBottom) {
        return stage;
      }
    }
  }

  return "hero";
};

export const ScrollProvider = ({ children }: { children: ReactNode }) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("hero");
  const [velocity, setVelocity] = useState(0);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [dosingCount, setDosingCount] = useState(1.5);
  const lastScrollRef = useRef(0);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const p = docHeight > 0 ? scrollTop / docHeight : 0;
    setProgress(Math.max(0, Math.min(1, p)));

    const v = Math.abs(scrollTop - lastScrollRef.current);
    setVelocity((prev) => prev * 0.8 + v * 0.2);
    lastScrollRef.current = scrollTop;

    setStage(detectStage());
  }, []);

  const handleMouse = useCallback((e: MouseEvent) => {
    setMouseX((e.clientX / window.innerWidth) * 2 - 1);
    setMouseY(-((e.clientY / window.innerHeight) * 2 - 1));
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, [handleScroll, handleMouse]);

  return (
    <ScrollContext.Provider value={{ progress, stage, velocity, mouseX, mouseY, dosingCount, setDosingCount }}>
      {children}
    </ScrollContext.Provider>
  );
};
