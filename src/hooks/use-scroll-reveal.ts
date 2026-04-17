import { useEffect } from "react";

/**
 * Global scroll-reveal hook.
 *
 * Mounts a single IntersectionObserver that watches every element with the
 * `data-reveal` attribute. When an element enters the viewport it gets
 * `data-revealed="true"` (CSS transitions opacity + transform).
 *
 * Safety guarantees:
 * - If IntersectionObserver is unavailable, every element is revealed immediately.
 * - If `prefers-reduced-motion: reduce`, every element is revealed immediately
 *   with no transform (handled in CSS).
 * - A MutationObserver picks up elements added after initial mount.
 * - A 4s safety timer reveals anything still hidden, so the page can never
 *   stay blank if the observer never fires.
 */
export const useScrollReveal = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reveal = (el: Element) => {
      if (el instanceof HTMLElement && el.dataset.revealed !== "true") {
        el.dataset.revealed = "true";
      }
    };

    // Fallback for ancient browsers
    if (typeof IntersectionObserver === "undefined") {
      document.querySelectorAll("[data-reveal]").forEach(reveal);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal(entry.target);
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -50px 0px", threshold: 0.1 }
    );

    const observeAll = () => {
      document.querySelectorAll("[data-reveal]:not([data-revealed='true'])").forEach((el) => {
        // If the element is already in/above the viewport on mount, reveal immediately
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          reveal(el);
          return;
        }
        io.observe(el);
      });
    };

    observeAll();

    // Watch for elements added later (route changes, conditional renders, etc.)
    const mo = new MutationObserver(() => observeAll());
    mo.observe(document.body, { childList: true, subtree: true });

    // Safety net: if anything is still hidden after 4s, force-reveal it.
    const safety = window.setTimeout(() => {
      document.querySelectorAll("[data-reveal]:not([data-revealed='true'])").forEach(reveal);
    }, 4000);

    return () => {
      io.disconnect();
      mo.disconnect();
      window.clearTimeout(safety);
    };
  }, []);
};
