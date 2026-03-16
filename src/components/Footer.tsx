import { ArrowRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="section-padding bg-foreground text-background">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
          <div className="max-w-md">
            <h3 className="text-2xl font-black tracking-tight mb-4">BioLogica</h3>
            <p className="text-background/60 text-sm leading-relaxed">
              Clinical daily nutrition support for Indian dogs. Based in Bengaluru, India.
            </p>
          </div>
          <a
            href="https://amazon.in/biologica"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-background text-foreground font-semibold text-sm tracking-wide hover:opacity-90 transition-opacity"
          >
            Shop on Amazon India
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="pt-8 border-t border-background/10">
          <p className="text-xs text-background/40 leading-relaxed max-w-3xl">
            Formulations reference AAFCO and FEDIAF dog nutrition guidelines. Manufactured in WHO-GMP+ and FAMI-QS certified facilities. BioLogica products are intended to complement, not replace, veterinary care and a balanced diet.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
