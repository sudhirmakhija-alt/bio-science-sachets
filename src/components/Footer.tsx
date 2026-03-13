const Footer = () => {
  return (
    <footer className="section-padding bg-foreground text-background">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-black tracking-tight mb-4">BioLogica</h3>
            <p className="text-background/60 text-sm leading-relaxed max-w-sm">
              Veterinary-grade canine nutrition. Precision sachets. 
              No oxidation. No blind dosing. Built from clinical discipline.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-background/40 mb-4">Products</h4>
            <ul className="space-y-2 text-sm text-background/60">
              <li><a href="#products" className="hover:text-background transition-colors">Omega Balance+</a></li>
              <li><a href="#products" className="hover:text-background transition-colors">Organ Balance+</a></li>
              <li><a href="#products" className="hover:text-background transition-colors">Gut Balance+</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-background/40 mb-4">Science</h4>
            <ul className="space-y-2 text-sm text-background/60">
              <li><a href="#science" className="hover:text-background transition-colors">Microencapsulation</a></li>
              <li><a href="#dosing" className="hover:text-background transition-colors">Dosing Protocol</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Certificate of Analysis</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-xs text-background/40">
            © 2026 BioLogica. Complementary Feed for Dogs. Not for human consumption.
          </span>
          <span className="text-xs text-background/40">
            Veterinary consultation recommended before use.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
