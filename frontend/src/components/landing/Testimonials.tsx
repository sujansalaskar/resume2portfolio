import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Full Stack Developer",
    text: "Resume2Portfolio saved me hours. I uploaded my resume and had a stunning portfolio live in under 5 minutes. The themes are gorgeous.",
    avatar: "SC",
  },
  {
    name: "Marcus Rivera",
    role: "UX Designer",
    text: "The AI parsing is incredibly accurate. It pulled out every project and skill perfectly. The analytics feature helps me track who's viewing my work.",
    avatar: "MR",
  },
  {
    name: "Aisha Patel",
    role: "Data Scientist",
    text: "I tried building my portfolio from scratch for weeks. Resume2Portfolio did it better in minutes. The 3 premium themes are a huge bonus.",
    avatar: "AP",
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">Testimonials</p>
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-4">Loved by professionals</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="p-6 rounded-2xl bg-card border border-border/50 hover-lift animate-slide-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-warning text-warning" />
                ))}
              </div>
              <p className="text-foreground/90 text-sm leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
