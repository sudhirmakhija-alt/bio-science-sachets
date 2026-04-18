import { ArrowRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="section-padding bg-foreground text-background border-t border-border/20">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-12">
          <div className="max-w-md">
            <h3 className="text-2xl font-black tracking-tight mb-2">BioLogica</h3>
            <p className="text-xs text-background/40 mt-2">
              Veterinary-grade sachet nutrition for dogs. Bangalore, India.
            </p>
            <p className="text-background/60 text-sm leading-relaxed mt-4 pr-[40px]">
              Clinical daily nutrition support for Indian dogs. Based in India.
            </p>
          </div>

          <nav className="flex flex-col gap-[12px] px-0">
            {[
              { label: "Omega", href: "#omega", dot: "bg-omega" },
              { label: "Organ", href: "#organ", dot: "bg-organ" },
              { label: "Gut", href: "#gut", dot: "bg-gut" },
              { label: "Science", href: "#science", dot: null },
              { label: "Dosing", href: "#dosing", dot: null },
              { label: "Origin", href: "#origin", dot: null },
              { label: "Blog", href: "#journal", dot: null },
              { label: "Reviews", href: "#reviews", dot: null },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="inline-flex items-center text-xs font-medium tracking-widest uppercase text-background/50 hover:text-background transition-colors"
              >
                {link.dot && (
                  <span className={`w-2 h-2 rounded-full ${link.dot} inline-block mr-2`} />
                )}
                {link.label}
              </a>
            ))}
          </nav>

          <div className="md:text-right">
            <a
              href="https://amazon.in/biologica"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-3 bg-background text-foreground font-semibold text-sm tracking-wide hover:opacity-90 transition-opacity px-[30px]">
              
              Shop on Amazon India
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-background/10">
          <p className="text-xs text-background/40 leading-relaxed max-w-3xl">
            Formulations reference AAFCO and FEDIAF dog nutrition guidelines. Manufactured in WHO-GMP+ and FAMI-QS certified facilities. BioLogica products are intended to complement, not replace, veterinary care and a balanced diet.
          </p>
        </div>
      </div>
    </footer>);

};

export default Footer;