const items = [
  "WHO-GMP+ Certified",
  "FAMI-QS Approved",
  "AAFCO Guidelines",
  "FEDIAF Compliant",
  "Microencapsulated",
  "Zero Oxidation",
  "Veterinary-Grade",
  "Sachet-Dosed Precision",
];

const CredentialsMarquee = () => {
  const renderRow = (keyPrefix: string) => (
    <div className="flex shrink-0 items-center flex-nowrap whitespace-nowrap" aria-hidden={keyPrefix === "b"}>
      {items.map((item, i) => (
        <div key={`${keyPrefix}-${i}`} className="flex items-center shrink-0 whitespace-nowrap">
          <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground whitespace-nowrap">
            {item}
          </span>
          <span className="mx-6 text-xs text-muted-foreground/60 shrink-0" aria-hidden="true">·</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="border-y border-border/40 bg-background/80 backdrop-blur-sm py-3 overflow-hidden w-full relative">
      {/* Animated marquee — runs on all screen sizes */}
      <div className="group w-full overflow-hidden">
        <div
          className="inline-flex flex-nowrap whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none"
          style={{ willChange: "transform" }}
        >
          {renderRow("a")}
          {renderRow("b")}
        </div>
      </div>
    </div>
  );
};

export default CredentialsMarquee;
