import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, ShieldCheck } from "lucide-react";

interface ComparisonCard {
  problem: {title: string;label: string;detail: string;};
  solution: {title: string;label: string;detail: string;};
}

const comparisons: ComparisonCard[] = [
{
  problem: {
    title: "The Oxidation Trap",
    label: "Liquid Oils in Open Bottles",
    detail: "Omega-3 oils oxidize within days of opening. Every pump delivers less potency than the last."
  },
  solution: {
    title: "The Micro-Cap Shield",
    label: "Microencapsulated Precision",
    detail: "Active compounds individually coated. Zero oxidation from seal to serve — no nitrogen flushing needed."
  }
},
{
  problem: {
    title: "The Heat Problem",
    label: "Dying Probiotics",
    detail: "Standard probiotics lose viability during storage and transit. Most are dead before they reach the gut."
  },
  solution: {
    title: "Heat-Stable Resilience",
    label: "6 Billion CFU/kg Guaranteed",
    detail: "Stabilized strains survive stomach acid and shelf life. Store <25°C for guaranteed potency."
  }
},
{
  problem: {
    title: "The Toxicity Risk",
    label: "Unmeasured Organ Supplements",
    detail: "Uncontrolled organ content risks Vitamin A toxicity. Guesswork dosing with no safety margin."
  },
  solution: {
    title: "Measured Safety",
    label: "Precision Organ Matrix",
    detail: "Ancestral organ blend with mathematically controlled Vitamin A levels. Every sachet is identical."
  }
}];


const XRayCard = ({
  title,
  label,
  detail,
  isGood





}: {title: string;label: string;detail: string;isGood: boolean;}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative border border-border p-6 md:p-8 cursor-crosshair overflow-hidden group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
        hovered ? "opacity-100" : "opacity-0"} ${
        isGood ? "bg-gut/5" : "bg-destructive/5"}`} />
      

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground">
            {isGood ? "BioLogica" : "Industry Standard"}
          </span>
          <div className={`transition-all duration-300 ${hovered ? "scale-110" : "scale-100"}`}>
            {isGood ?
            <ShieldCheck className="w-5 h-5 text-gut" /> :

            <ShieldAlert className="w-5 h-5 text-destructive" />
            }
          </div>
        </div>

        <h4
          className={`text-lg md:text-xl font-bold tracking-tight mb-2 transition-colors duration-500 ${
          hovered ? isGood ? "text-gut" : "text-destructive" : "text-foreground"}`
          }>
          
          {title}
        </h4>
        <p className="text-sm font-medium text-muted-foreground mb-3">{label}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{detail}</p>

        <div
          className={`mt-4 h-0.5 transition-all duration-500 ${
          hovered ? isGood ? "bg-gut w-full" : "bg-destructive w-full" : "bg-border w-8"}`
          } />
        
      </div>
    </div>);

};

const XRaySection = () => {
  return (
    <section className="section-padding bg-background/70 backdrop-blur-sm">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16">
          
          <span className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground block mb-4">
            The Current Problem
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-foreground max-w-2xl">
            Why your current supplement is failing your dog.
          </h2>
        </motion.div>

        <div className="space-y-6">
          {comparisons.map((comp, i) =>
          <motion.div
            key={comp.problem.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="grid md:grid-cols-2 gap-px bg-border">
            
              <XRayCard
              title={comp.problem.title}
              label={comp.problem.label}
              detail={comp.problem.detail}
              isGood={false} />
            
              <XRayCard
              title={comp.solution.title}
              label={comp.solution.label}
              detail={comp.solution.detail}
              isGood={true} />
            
            </motion.div>
          )}
        </div>
      </div>
    </section>);

};

export default XRaySection;