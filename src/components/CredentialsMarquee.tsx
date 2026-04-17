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
    <div className="flex shrink-0 items-center" aria-hidden={keyPrefix === "b"}>
      {items.map((item, i) => (
        <div key={`${keyPrefix}-${i}`} className="flex items-center">
          <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground whitespace-nowrap">
            {item}
          </span>
          <span className="mx-6 text-xs text-muted-foreground/60" aria-hidden="true">·</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="border-y border-border/40 bg-background/80 backdrop-blur-sm py-3 overflow-hidden">
      {/* Reduced motion: static */}
      <div className="motion-reduce:flex hidden flex-wrap justify-center gap-x-6 gap-y-2 px-4">
        {items.map((item, i) => (
          <span
            key={i}
            className="text-xs font-medium tracking-widest uppercase text-muted-foreground"
          >
            {item}
            {i < items.length - 1 && <span className="ml-6 text-muted-foreground/60" aria-hidden="true">·</span>}
          </span>
        ))}
      </div>

      {/* Animated marquee */}
      <div className="motion-reduce:hidden flex group">
        <div className="flex animate-marquee group-hover:[animation-play-state:paused]">
          {renderRow("a")}
          {renderRow("b")}
        </div>
      </div>
    </div>
  );
};

export default CredentialsMarquee;
