import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useRef, useEffect, useCallback } from "react";

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Scrub video playback with scroll
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.currentTime = 0;

    const handleLoaded = () => {
      // Set initial frame
      video.currentTime = 0;
    };

    video.addEventListener("loadedmetadata", handleLoaded);
    return () => video.removeEventListener("loadedmetadata", handleLoaded);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    video.currentTime = latest * video.duration;
  });

  const videoScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const videoY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section ref={sectionRef} className="relative min-h-[200vh] overflow-hidden">
      <div className="sticky top-0 min-h-screen flex items-center">
        <div className="section-padding w-full max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left - Copy */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-border rounded-sm mb-8">
              <span className="w-2 h-2 rounded-full bg-gut" />
              <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
                Veterinary-Grade Nutrition
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[0.92] tracking-[-0.04em] text-foreground mb-6">
              Precision
              <br />
              Science.
              <br />
              <span className="text-muted-foreground">Identified</span>
              <br />
              <span className="text-muted-foreground">Results.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-md leading-relaxed mb-10 font-light">
              Mathematically precise sachet dosing.
              No oxidation. No blind dosing.
            </p>

            <div className="flex gap-4">
              <a
                href="#products"
                className="inline-flex items-center justify-center px-8 py-4 bg-foreground text-background font-semibold text-sm tracking-wide hover:opacity-90 transition-opacity"
              >
                EXPLORE PRODUCTS
              </a>
              <a
                href="#science"
                className="inline-flex items-center justify-center px-8 py-4 border border-foreground text-foreground font-semibold text-sm tracking-wide hover:bg-foreground hover:text-background transition-colors"
              >
                THE SCIENCE
              </a>
            </div>
          </motion.div>

          {/* Right - Scroll-scrubbed video */}
          <motion.div
            className="relative flex items-center justify-center min-h-[500px] lg:min-h-[600px]"
            style={{ scale: videoScale, y: videoY }}
          >
            <motion.video
              ref={videoRef}
              src="/hero-video.mp4"
              muted
              playsInline
              preload="auto"
              className="w-full max-w-md lg:max-w-lg rounded-lg drop-shadow-2xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Scroll</span>
          <div className="w-px h-8 bg-border" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
