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
    <div className="mt-8 md:mt-10 w-full bg-black py-3 overflow-hidden">
      <style>{`
        @keyframes credentials-marquee {
          0%   { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .credentials-marquee-track {
          display: inline-flex;
          flex-wrap: nowrap;
          white-space: nowrap;
          will-change: transform;
          animation: credentials-marquee 30s linear infinite;
        }
        .credentials-marquee-wrapper:hover .credentials-marquee-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .credentials-marquee-track { animation: none; }
        }
      `}</style>
      <div className="credentials-marquee-wrapper w-full overflow-hidden">
        <div className="credentials-marquee-track">
          {renderRow("a")}
          {renderRow("b")}
        </div>
      </div>
    </div>
  );
};

export default CredentialsMarquee;
