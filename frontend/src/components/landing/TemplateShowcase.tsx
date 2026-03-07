import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

const themes = [
  { name: "Minimal", category: "minimal", color: "from-primary/20 to-primary/5" },
  { name: "Developer Pro", category: "developer", color: "from-accent/20 to-accent/5" },
  { name: "Creative Flow", category: "creative", color: "from-success/20 to-success/5" },
  { name: "Corporate", category: "corporate", color: "from-warning/20 to-warning/5" },
  { name: "Neon Night", category: "developer", color: "from-primary/30 to-accent/10" },
  { name: "Clean Slate", category: "minimal", color: "from-muted-foreground/10 to-muted/20" },
];

const filters = ["All", "Minimal", "Developer", "Creative", "Corporate"];

const TemplateShowcase = () => {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? themes : themes.filter(t => t.category === active.toLowerCase());

  return (
    <section id="templates" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">Templates</p>
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-4">Pick your style</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Premium portfolio themes designed to showcase your work beautifully.
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                active === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((t, i) => (
            <div
              key={t.name}
              className="group rounded-2xl overflow-hidden border border-border/50 bg-card hover-lift animate-slide-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className={`aspect-[4/3] bg-gradient-to-br ${t.color} relative flex items-center justify-center`}>
                <div className="w-3/4 h-3/4 rounded-xl bg-background/20 backdrop-blur-sm border border-foreground/5" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/40 backdrop-blur-sm">
                  <Button variant="hero" size="sm">
                    <Eye className="w-4 h-4" />
                    Preview
                  </Button>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <span className="font-medium text-sm">{t.name}</span>
                <Button variant="outline" size="sm">Select</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TemplateShowcase;
