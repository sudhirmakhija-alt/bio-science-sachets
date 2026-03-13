import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useScrollState } from "./ScrollContext";

const DOSING_DATA = [
  { weight: 4, sachets: 0.5, cost: 23 },
  { weight: 8, sachets: 1, cost: 47 },
  { weight: 12, sachets: 1, cost: 47 },
  { weight: 16, sachets: 1.5, cost: 70 },
  { weight: 20, sachets: 1.5, cost: 70 },
  { weight: 25, sachets: 2, cost: 93 },
  { weight: 30, sachets: 2, cost: 93 },
  { weight: 35, sachets: 2.5, cost: 117 },
  { weight: 40, sachets: 3, cost: 140 },
];

const DosingCalculator = () => {
  const [index, setIndex] = useState(3);
  const data = DOSING_DATA[index];
  const { setDosingCount } = useScrollState();

  useEffect(() => {
    setDosingCount(data.sachets);
  }, [data.sachets, setDosingCount]);

  return (
    <section id="dosing" className="section-padding bg-background-subtle relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }} />

      <div className="max-w-[1000px] mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground block mb-4">
            Dosing Protocol
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-foreground">
            Precision Dosing Calculator
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-sm p-8 md:p-12"
        >
          {/* Weight Slider */}
          <div className="mb-12">
            <div className="flex justify-between items-baseline mb-6">
              <span className="text-sm font-medium tracking-wide uppercase text-muted-foreground">
                Dog Weight
              </span>
              <span className="text-4xl font-black text-foreground">
                {data.weight}<span className="text-lg font-medium text-muted-foreground ml-1">kg</span>
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={DOSING_DATA.length - 1}
              value={index}
              onChange={(e) => setIndex(Number(e.target.value))}
              className="w-full h-1 bg-border rounded-none appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:cursor-pointer
                [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-foreground 
                [&::-moz-range-thumb]:rounded-none [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
            />

            <div className="flex justify-between mt-2">
              <span className="text-xs text-muted-foreground">4kg</span>
              <span className="text-xs text-muted-foreground">40kg</span>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-3 gap-px bg-border">
            <div className="bg-background p-6 md:p-8 text-center">
              <div className="text-3xl md:text-4xl font-black text-foreground">{data.sachets}</div>
              <div className="text-xs text-muted-foreground mt-2 tracking-wide uppercase">
                Sachets / Day
              </div>
            </div>
            <div className="bg-background p-6 md:p-8 text-center">
              <div className="text-3xl md:text-4xl font-black text-omega">₹{data.cost}</div>
              <div className="text-xs text-muted-foreground mt-2 tracking-wide uppercase">
                Cost / Day
              </div>
            </div>
            <div className="bg-background p-6 md:p-8 text-center">
              <div className="text-3xl md:text-4xl font-black text-foreground">
                ₹{(data.cost * 30).toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mt-2 tracking-wide uppercase">
                Cost / Month
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-6 text-center">
            Based on Omega Balance+ pricing. Complementary feed — consult your veterinarian for specific protocols.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default DosingCalculator;
