import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

interface ScrollState {
  /** 0-1 normalized scroll through entire page */
  progress: number;
  /** Current stage: hero, xray, origin, dosing, science, products */
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

const STAGES = ["hero", "xray", "origin", "dosing", "science", "products"];

export const ScrollProvider = ({ children }: { children: ReactNode }) => {
  const [progress, setProgress] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [dosingCount, setDosingCount] = useState(1.5);
  const [lastScroll, setLastScroll] = useState(0);

  const stage = STAGES[Math.min(Math.floor(progress * STAGES.length), STAGES.length - 1)];

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const p = docHeight > 0 ? scrollTop / docHeight : 0;
    setProgress(Math.max(0, Math.min(1, p)));

    const v = Math.abs(scrollTop - lastScroll);
    setVelocity((prev) => prev * 0.8 + v * 0.2); // smoothed
    setLastScroll(scrollTop);
  }, [lastScroll]);

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
