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
    <div
      className="flex shrink-0 items-center"
      aria-hidden={keyPrefix === "b"}
    >
      {items.map((item, i) => (
        <div key={`${keyPrefix}-${i}`} className="flex items-center shrink-0">
          <span className="text-xs font-medium tracking-widest uppercase text-white whitespace-nowrap">
            {item}
          </span>
          <span className="mx-6 text-xs text-white shrink-0" aria-hidden="true">
            ·
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative w-full pt-0 md:bg-white md:pt-14">
      <div className="w-full bg-black py-3 overflow-hidden">
        <div className="credentials-marquee-wrapper">
          <div className="credentials-marquee-track">
            {renderRow("a")}
            {renderRow("b")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CredentialsMarquee;
