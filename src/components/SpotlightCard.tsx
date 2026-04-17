import { motion, useReducedMotion } from "framer-motion";
import { useState, FormEvent } from "react";
import { CheckCircle, ArrowRight } from "lucide-react";

type Variant = "notify" | "launch" | "offer";

interface SpotlightCardProps {
  variant?: Variant;
}

const cardBase =
  "w-full max-w-[380px] bg-background/70 backdrop-blur-xl border border-border/60 rounded-2xl p-8";
const cardStyle: React.CSSProperties = {
  boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
  borderTop: "1px solid rgba(255,255,255,0.6)",
};

const inputClass =
  "w-full px-4 py-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20";
const primaryBtn =
  "w-full inline-flex items-center justify-center gap-2 bg-foreground text-background text-sm font-semibold tracking-wide py-3 rounded-lg hover:opacity-90 transition-opacity mt-1";

const NotifyVariant = () => {
  const prefersReducedMotion = useReducedMotion();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Please enter your name and email.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  return (
    <>
      <span className="inline-flex items-center bg-foreground/[0.08] text-foreground/50 text-xs tracking-widest uppercase rounded-full px-3 py-1 mb-4">
        Early Access
      </span>
      <h2 className="text-2xl font-bold leading-tight mt-2 text-foreground">India's First</h2>
      <p className="text-sm text-muted-foreground mt-1 mb-6">Sachet-based canine nutrition.</p>
      <p className="text-sm text-muted-foreground leading-relaxed mb-6">
        Be the first to know when we launch — and get exclusive introductory pricing.
      </p>

      {submitted ? (
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="py-2"
        >
          <CheckCircle className="text-green-500" size={24} />
          <p className="text-base font-semibold mt-3 text-foreground">You're on the list.</p>
          <p className="text-sm text-muted-foreground mt-1">We'll be in touch before launch.</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            className={inputClass}
            aria-label="Your name"
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={255}
            className={inputClass}
            aria-label="Email address"
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
          <button type="submit" className={primaryBtn}>
            Notify Me <ArrowRight size={14} />
          </button>
        </form>
      )}

      <p className="text-xs text-muted-foreground/50 text-center mt-4">
        No spam. Unsubscribe any time.
      </p>
    </>
  );
};

const LaunchVariant = () => (
  <>
    <span className="inline-flex items-center bg-green-500/10 text-green-600 text-xs tracking-widest uppercase rounded-full px-3 py-1 mb-4">
      Now Available
    </span>
    <h2 className="text-2xl font-bold leading-tight mt-2 text-foreground">India's First</h2>
    <p className="text-sm text-muted-foreground mt-1 mb-6">Sachet-based canine nutrition.</p>
    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
      Veterinary-grade daily toppers for Indian dogs. Precision-dosed, clean-label, certified manufacturing.
    </p>

    <div className="grid grid-cols-3 gap-3 border-t border-border/40 pt-4 mt-4 mb-6">
      {[
        { n: "30", l: "sachets / pack" },
        { n: "3", l: "feed systems" },
        { n: "0", l: "artificial additives" },
      ].map((s) => (
        <div key={s.l}>
          <div className="font-bold text-lg text-foreground">{s.n}</div>
          <div className="text-xs text-muted-foreground leading-tight">{s.l}</div>
        </div>
      ))}
    </div>

    <a
      href="https://amazon.in/biologica"
      target="_blank"
      rel="noopener noreferrer"
      className={primaryBtn}
    >
      Shop on Amazon India <ArrowRight size={14} />
    </a>
  </>
);

const OfferVariant = () => (
  <>
    <span className="inline-flex items-center bg-amber-500/10 text-amber-600 text-xs tracking-widest uppercase rounded-full px-3 py-1 mb-4">
      Introductory Offer
    </span>
    <h2 className="text-2xl font-bold leading-tight mt-2 text-foreground">Launch pricing</h2>
    <p className="text-sm text-muted-foreground mt-1">Limited time only.</p>

    <div className="mt-4">
      <div className="text-4xl font-bold text-foreground">₹1,399</div>
      <p className="text-sm text-muted-foreground">per pack of 30 sachets</p>
      <p className="text-xs text-green-600 font-medium mt-2">
        Save 25% vs. single-serve alternatives
      </p>
    </div>

    <a
      href="https://amazon.in/biologica"
      target="_blank"
      rel="noopener noreferrer"
      className={primaryBtn + " mt-6"}
    >
      Claim Launch Price <ArrowRight size={14} />
    </a>

    <p className="text-xs text-muted-foreground/50 text-center mt-4">Offer ends Dec 31</p>
  </>
);

const SpotlightCard = ({ variant = "notify" }: SpotlightCardProps) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={cardBase}
      style={cardStyle}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: prefersReducedMotion ? 0 : 0.6, ease: "easeOut" }}
    >
      {variant === "notify" && <NotifyVariant />}
      {variant === "launch" && <LaunchVariant />}
      {variant === "offer" && <OfferVariant />}
    </motion.div>
  );
};

export default SpotlightCard;
