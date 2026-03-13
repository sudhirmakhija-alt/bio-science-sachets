import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, ShieldCheck } from "lucide-react";

const XRayCard = ({ 
  title, 
  defaultState, 
  hoverState, 
  isGood 
}: { 
  title: string; 
  defaultState: string; 
  hoverState: string; 
  isGood: boolean;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="relative border border-border p-8 md:p-12 cursor-crosshair overflow-hidden group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Background flash on hover */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${
        hovered ? 'opacity-100' : 'opacity-0'
      } ${isGood ? 'bg-gut/5' : 'bg-destructive/5'}`} />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground">
            {title}
          </span>
          <div className={`transition-all duration-300 ${hovered ? 'scale-110' : 'scale-100'}`}>
            {hovered ? (
              isGood ? (
                <ShieldCheck className="w-6 h-6 text-gut" />
              ) : (
                <ShieldAlert className="w-6 h-6 text-destructive" />
              )
            ) : (
              <div className="w-6 h-6 border border-border rounded-sm" />
            )}
          </div>
        </div>

        <div className="min-h-[120px] flex items-center">
          <p className={`text-2xl md:text-3xl font-bold tracking-tight transition-all duration-500 ${
            hovered ? (isGood ? 'text-gut' : 'text-destructive') : 'text-foreground'
          }`}>
            {hovered ? hoverState : defaultState}
          </p>
        </div>

        <div className={`mt-6 h-1 transition-all duration-500 ${
          hovered 
            ? (isGood ? 'bg-gut w-full' : 'bg-destructive w-full') 
            : 'bg-border w-12'
        }`} />

        <p className={`mt-4 text-sm transition-all duration-300 ${
          hovered ? 'opacity-100 text-muted-foreground' : 'opacity-0'
        }`}>
          {isGood 
            ? 'Nitrogen-flushed aluminium sachets lock potency from Day 1 to Day 30.' 
            : 'Open bottles oxidize within 30 days. Every pump delivers less than the last.'}
        </p>
      </div>
    </motion.div>
  );
};

const XRaySection = () => {
  return (
    <section className="section-padding bg-background/70 backdrop-blur-sm">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground block mb-4">
            The Incumbent Problem
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-foreground max-w-2xl">
            Why your current supplement is failing your dog.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-px bg-border">
          <XRayCard
            title="Standard Fish Oil Bottle"
            defaultState="250ml Open Bottle"
            hoverState="⚠ OXIDIZED"
            isGood={false}
          />
          <XRayCard
            title="BioLogica Precision Sachet"
            defaultState="Individual Sealed Sachet"
            hoverState="✓ LOCKED POTENCY"
            isGood={true}
          />
        </div>
      </div>
    </section>
  );
};

export default XRaySection;
