import { ArrowLeft, ArrowRight } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface BlogPostPageProps {
  category: string;
  title: string;
  heroImage: string;
  heroImageAlt?: string;
  children: React.ReactNode;
}

const BlogPostPage = ({
  category,
  title,
  heroImage,
  heroImageAlt,
  children,
}: BlogPostPageProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-16">
        {/* Back button */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 pt-8">
          <a
            href="/#journal"
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to BioLogica
          </a>
        </div>

        {/* Hero image */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 mt-8">
          <img
            src={heroImage}
            alt={heroImageAlt || title}
            className="w-full max-h-[480px] object-cover object-top"
          />
        </div>

        {/* Article header */}
        <article className="max-w-[680px] mx-auto px-6 mt-12">
          <span className="inline-block px-3 py-1 bg-foreground/5 text-foreground text-xs font-semibold tracking-[0.15em] uppercase">
            {category}
          </span>
          <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
            {title}
          </h1>

          {/* Body */}
          <div
            className="mt-10 text-foreground/80 prose-article"
            style={{
              fontSize: "18px",
              lineHeight: 1.8,
            }}
          >
            {children}
          </div>
        </article>

        {/* CTA */}
        <section className="mt-24 section-padding bg-[#f5f7f2]">
          <div className="max-w-[680px] mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
              Ready to try BioLogica?
            </h2>
            <a
              href="https://amazon.in/biologica"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background font-semibold text-sm tracking-wide hover:opacity-90 transition-opacity"
            >
              Shop on Amazon India
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPostPage;
