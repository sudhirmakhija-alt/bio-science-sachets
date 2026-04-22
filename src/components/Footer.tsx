import { ArrowRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleAnchorClick = (e: React.MouseEvent, hash: string) => {
    e.preventDefault();
    if (location.pathname === "/") {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      window.history.replaceState(null, "", `/#${hash}`);
    } else {
      navigate(`/#${hash}`);
    }
  };

  const productLinks = [
    { label: "Omega", hash: "omega", dot: "bg-omega" },
    { label: "Organ", hash: "organ", dot: "bg-organ" },
    { label: "Gut", hash: "gut", dot: "bg-gut" },
  ];

  const siteLinks = [
    { label: "Science", hash: "science" },
    { label: "Dosing", hash: "find-your-formula" },
    { label: "Origin", hash: "origin" },
    { label: "Blog", hash: "journal" },
    { label: "Reviews", hash: "reviews" },
  ];

  return (
    <footer className="section-padding bg-foreground text-background border-t border-border/20">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_auto_auto_1fr] gap-x-12 gap-y-8 items-start mb-12">
          <div className="max-w-md">
            <h3 className="text-2xl font-black tracking-tight mb-2">BioLogica</h3>
            <p className="text-xs text-background/30 mt-2">
              Veterinary-grade sachet nutrition for dogs. Bangalore, India.
            </p>
            <p className="text-background/50 text-sm leading-relaxed mt-4 pr-[40px]">
              Clinical daily nutrition support for Indian dogs. Based in India.
            </p>
          </div>

          <nav className="flex flex-col gap-[12px] px-0">
            {productLinks.map((link) => (
              <a
                key={link.label}
                href={`/#${link.hash}`}
                onClick={(e) => handleAnchorClick(e, link.hash)}
                className="nav-link inline-flex items-center text-xs font-medium tracking-widest uppercase text-background/40 hover:text-background transition-colors duration-150"
              >
                {link.dot && (
                  <span className={`w-2 h-2 rounded-full ${link.dot} inline-block mr-2 opacity-70`} />
                )}
                {link.label}
              </a>
            ))}
          </nav>

          <nav className="flex flex-col gap-[12px] px-0">
            {siteLinks.map((link) => (
              <a
                key={link.label}
                href={`/#${link.hash}`}
                onClick={(e) => handleAnchorClick(e, link.hash)}
                className="nav-link inline-flex items-center text-xs font-medium tracking-widest uppercase text-background/40 hover:text-background transition-colors duration-150"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="md:text-right">
            <a
              href="https://amazon.in/biologica"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-press inline-flex items-center gap-2 py-3 bg-background text-foreground font-semibold text-sm tracking-wide px-[30px]"
            >
              Shop on Amazon India
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-background/10">
          <p className="text-xs text-background/30 leading-relaxed max-w-3xl">
            Formulations reference AAFCO and FEDIAF dog nutrition guidelines. Manufactured in WHO-GMP+ and FAMI-QS certified facilities. BioLogica products are intended to complement, not replace, veterinary care and a balanced diet.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
