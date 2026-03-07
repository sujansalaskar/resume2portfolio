import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import dashboardPreview from "@/assets/dashboard-preview.png";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-8 animate-fade-in">
          <Zap className="w-3.5 h-3.5" />
          Now with AI-Powered Resume Parsing
        </div>

        {/* Headline */}
        <h1 className="font-display font-extrabold text-5xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight mb-6 animate-slide-up">
          Turn Your Resume Into a{" "}
          <span className="gradient-text">Stunning Portfolio</span>
          {" "}in Seconds
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: "0.1s" }}>
          Upload your resume and let AI craft a beautiful, SEO-optimized portfolio website. 
          Choose from premium themes, customize everything, and publish instantly.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <Link to="/signup">
            <Button variant="hero" size="xl">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <a href="#templates">
            <Button variant="hero-outline" size="xl">
              <Play className="w-4 h-4" />
              View Templates
            </Button>
          </a>
        </div>

        {/* Dashboard Preview */}
        <div className="relative max-w-5xl mx-auto animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <div className="rounded-2xl overflow-hidden border border-border/50 shadow-2xl shadow-primary/5">
            <img src={dashboardPreview} alt="Resume2Portfolio Dashboard" className="w-full" />
          </div>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-primary/10 blur-3xl" />
        </div>
      </div>
    </section>
  );
};

const Zap = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

export default Hero;
