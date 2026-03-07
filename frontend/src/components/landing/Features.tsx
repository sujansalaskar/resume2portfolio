import { Brain, Palette, Globe, BarChart3 } from "lucide-react";

const features = [
  { icon: Brain, title: "AI Resume Parsing", desc: "Advanced AI extracts your skills, experience, and projects automatically from any resume format." },
  { icon: Palette, title: "3 Beautiful Themes", desc: "Choose from 3 professionally designed portfolio themes that make you stand out." },
  { icon: Globe, title: "One-Click Hosting", desc: "Publish your portfolio instantly with a custom URL. No deployment hassle." },
  { icon: BarChart3, title: "Built-in Analytics", desc: "Track visitors, page views, and engagement with a powerful analytics dashboard." },
];

const Features = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">Features</p>
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-4">Everything you need to shine</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            From resume parsing to portfolio hosting, we handle it all so you can focus on what matters.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group relative p-6 rounded-2xl bg-card border border-border/50 hover-lift cursor-default animate-slide-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2 flex items-center gap-2">
                {f.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
