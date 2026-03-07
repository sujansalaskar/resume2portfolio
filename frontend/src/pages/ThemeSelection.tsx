import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Eye, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { portfolio } from "@/services/api";
import CreativeTheme from "@/themes/CreativeTheme";
import DeveloperTheme from "@/themes/DeveloperTheme";
import MinimalTheme from "@/themes/MinimalTheme";
import { mapPortfolioToThemeContent, PortfolioDocument } from "@/themes/mapPortfolioToThemeContent";

const themes = [
  { id: 1, name: "Minimal Clean", category: "minimal", gradient: "from-primary/20 to-primary/5" },
  { id: 2, name: "Developer Pro", category: "developer", gradient: "from-accent/20 to-accent/5" },
  { id: 3, name: "Creative Flow", category: "creative", gradient: "from-success/20 to-success/5" },
];



const ThemeSelection = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewPortfolio, setPreviewPortfolio] = useState<PortfolioDocument | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        setLoading(true);
        setError(null);
        const portfolios = await portfolio.getMyPortfolios();
        if (Array.isArray(portfolios) && portfolios.length > 0) {
          setPreviewPortfolio(portfolios[0]);
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : "Failed to load portfolio preview.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void loadPortfolio();
  }, []);

  const handleContinueToEditor = () => {
    if (!selected) return;
    const selectedTheme = themes.find((t) => t.id === selected);
    if (!selectedTheme) return;

    // Map UI theme categories to backend theme keys used by PortfolioPage/themeMap
    let themeKey = "minimal-light";
    if (selectedTheme.category === "developer") {
      themeKey = "developer-dark";
    } else if (selectedTheme.category === "creative") {
      themeKey = "creative-gradient";
    }

    // Persist selection locally so the editor or publish flow can read it
    try {
      localStorage.setItem("selected_theme", themeKey);
    } catch {
      // ignore storage errors, still navigate
    }

    navigate("/dashboard/editor");
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-2xl">Choose a Theme</h1>
            <p className="text-sm text-muted-foreground mt-1">Select a theme for your portfolio. You can change it anytime.</p>
          </div>
          {selected && (
            <Button variant="hero" onClick={handleContinueToEditor}>
              Continue to Editor
            </Button>
          )}
        </div>


        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {themes.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelected(t.id)}
              className={`group rounded-2xl overflow-hidden border cursor-pointer transition-all hover-lift ${selected === t.id ? "border-primary glow-blue" : "border-border/50 hover:border-border"
                }`}
            >
              <div className={`aspect-[4/3] bg-gradient-to-br ${t.gradient} relative flex items-center justify-center`}>
                <div className="w-3/4 h-3/4 rounded-xl bg-background/20 backdrop-blur-sm border border-foreground/5" />
                {selected === t.id && (
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/30 backdrop-blur-sm">
                  <Button variant="hero" size="sm"><Eye className="w-4 h-4" /> Preview</Button>
                </div>
              </div>
              <div className="p-3 bg-card">
                <p className="font-medium text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{t.category}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Live preview area – temporarily disabled per request */}
      </div>
    </DashboardLayout>
  );
};

export default ThemeSelection;
