import { Upload, Pencil, Rocket } from "lucide-react";

const steps = [
  { icon: Upload, title: "Upload Resume", desc: "Upload your PDF or DOCX resume. Our AI parses every detail automatically.", num: "01" },
  { icon: Pencil, title: "Edit & Customize", desc: "Review parsed data, pick a theme, and customize your portfolio sections.", num: "02" },
  { icon: Rocket, title: "Publish & Share", desc: "Publish with one click and share your portfolio with the world.", num: "03" },
];

const HowItWorks = () => {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">How It Works</p>
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-4">Three steps to your portfolio</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div key={s.num} className="relative text-center animate-slide-up" style={{ animationDelay: `${i * 0.15}s` }}>
              {i < 2 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px border-t border-dashed border-border/50" />
              )}
              <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-card border border-border/50 mb-6">
                <s.icon className="w-10 h-10 text-primary" />
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {s.num}
                </span>
              </div>
              <h3 className="font-display font-semibold text-xl mb-2">{s.title}</h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
