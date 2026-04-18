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
    <div className="border-y border-border/40 bg-background/80 backdrop-blur-sm py-3 overflow-hidden w-full">
      {/* Animated marquee — runs on all screen sizes, paused only when user prefers reduced motion */}
      <div className="flex w-full overflow-hidden group motion-reduce:[&_.animate-marquee]:animate-none">
        <div className="flex flex-nowrap whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused] min-w-max">
          {renderRow("a")}
          {renderRow("b")}
        </div>
      </div>
    </div>
  );
};

export default CredentialsMarquee;
