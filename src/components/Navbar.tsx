import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import biologicaLogo from "@/assets/biologica-logo.jpg";

const NAV_LINKS = [
{ label: "Products", href: "#products" },
{ label: "Science", href: "#science" },
{ label: "Dosing", href: "#dosing" },
{ label: "Origin", href: "#origin" }];


const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ?
      "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm" :
      "bg-transparent"}`
      }
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
      
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 md:px-12 lg:px-24 h-16 opacity-100">
        {/* Logo */}
        <a href="#" className="flex items-center">
          <img
            src={biologicaLogo}
            alt="BioLogica Pets"
            className="h-7 w-auto" />
          
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) =>
          <a
            key={link.href}
            href={link.href}
            className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors">
            
              {link.label}
            </a>
          )}
          <a
            href="#products"
            className="inline-flex items-center justify-center px-5 py-2 bg-foreground text-background text-xs font-semibold tracking-wide hover:opacity-90 transition-opacity">
            
            BUY ON AMAZON
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu">
          
          <span className={`block w-5 h-px bg-foreground transition-transform ${mobileOpen ? "rotate-45 translate-y-[3.5px]" : ""}`} />
          <span className={`block w-5 h-px bg-foreground transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-px bg-foreground transition-transform ${mobileOpen ? "-rotate-45 -translate-y-[3.5px]" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen &&
        <motion.div
          className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}>
          
            <div className="flex flex-col gap-4 px-6 py-6">
              {NAV_LINKS.map((link) =>
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-sm font-semibold tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground transition-colors">
              
                  {link.label}
                </a>
            )}
              <a
              href="#products"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center justify-center px-5 py-3 bg-foreground text-background text-xs font-semibold tracking-wide mt-2">
              
                BUY ON AMAZON
              </a>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </motion.nav>);

};

export default Navbar;