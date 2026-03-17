import { useState } from "react";
import { motion } from "framer-motion";
import { PawPrint } from "lucide-react";

const WEIGHT_RANGES = [
  { min: 1, max: 5, sachets: 0.5 },
  { min: 6, max: 10, sachets: 1 },
  { min: 11, max: 20, sachets: 1.5 },
  { min: 21, max: 30, sachets: 2 },
  { min: 31, max: 40, sachets: 2.5 },
  { min: 41, max: 60, sachets: 3 },
];

const LIFE_STAGES = ["Adult", "Senior", "Puppy (only under vet guidance)"];
const GOALS = [
  "Gut support and stool consistency",
  "Overall vitality and natural micronutrients",
  "Joints, skin and coat",
];

const DosingCalculator = () => {
  const [weight, setWeight] = useState("");
  const [lifeStage, setLifeStage] = useState("");
  const [goal, setGoal] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const handleCalculate = () => {
    const w = parseFloat(weight);
    if (!w || w <= 0) return;
    const range = WEIGHT_RANGES.find((r) => w >= r.min && w <= r.max);
    setResult(range ? range.sachets : WEIGHT_RANGES[WEIGHT_RANGES.length - 1].sachets);
  };

  return (
    <section id="dosing" className="section-padding relative overflow-hidden">
      <div className="max-w-[1000px] mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground block mb-4">
            Daily routine
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-foreground mb-6">
            Dosing helper
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Use this simple helper to estimate how many sachets per day may be appropriate for your dog. This is not a substitute for veterinary advice. Always follow the product label and your vet's specific guidance.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-sm p-8 md:p-12"
        >
          <div className="space-y-6 mb-8">
            {/* Weight */}
            <div>
              <label className="text-sm font-medium tracking-wide text-foreground block mb-2">
                Dog weight in kg
              </label>
              <input
                type="number"
                placeholder="e.g. 12"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full h-12 px-5 border border-border/80 bg-background text-foreground text-sm rounded-full shadow-sm focus:outline-none focus:ring-1 focus:ring-gut"
              />
            </div>

            {/* Life Stage */}
            <div>
              <label className="text-sm font-medium tracking-wide text-foreground block mb-2">
                Life stage
              </label>
              <select
                value={lifeStage}
                onChange={(e) => setLifeStage(e.target.value)}
                className="w-full h-12 px-5 border border-border/80 bg-background text-foreground text-sm rounded-full shadow-sm focus:outline-none focus:ring-1 focus:ring-gut appearance-none"
              >
                <option value="">Select life stage</option>
                {LIFE_STAGES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Goal */}
            <div>
              <label className="text-sm font-medium tracking-wide text-foreground block mb-2">
                Primary goal
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full h-12 px-4 border border-border bg-background text-foreground text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-foreground appearance-none"
              >
                <option value="">Select primary goal</option>
                {GOALS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full py-4 bg-foreground text-background font-semibold text-sm tracking-wide hover:opacity-90 transition-opacity mb-8"
          >
            Calculate suggested daily sachets
          </button>

          {result !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center border border-border p-8"
            >
              <div className="text-4xl font-black text-foreground mb-2">{result}</div>
              <div className="text-xs text-muted-foreground tracking-wide uppercase mb-4">
                Suggested sachets per day
              </div>
              {goal && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-sm text-xs text-muted-foreground">
                  {goal}
                </span>
              )}
            </motion.div>
          )}

          <p className="text-xs text-muted-foreground mt-6 text-center">
            Always follow the product label and your vet's specific advice, especially for puppies, seniors or dogs on medication.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default DosingCalculator;
