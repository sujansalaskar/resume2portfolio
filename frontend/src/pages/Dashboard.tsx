import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus, Eye, TrendingUp, Users, Globe, ArrowUpRight, Loader2, Trash2, EyeOff, Send } from "lucide-react";
import { portfolio as portfolioApi, analytics as analyticsApi } from "@/services/api";

const stats = [
  { label: "Total Visits", value: "—", change: "", icon: Eye, up: true },
  { label: "Unique Visitors", value: "—", change: "", icon: Users, up: true },
  { label: "Published Sites", value: "—", change: "", icon: Globe, up: true },
  { label: "Conversion Rate", value: "—", change: "", icon: TrendingUp, up: true },
];

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dynamicStats, setDynamicStats] = useState(stats);
  const [actionLoading, setActionLoading] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load user name from localStorage
    const stored = localStorage.getItem("auth_user");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        setUserName(user.name || "");
      } catch { }
    }

    // Fetch user's portfolios from API
    portfolioApi.getMyPortfolios()
      .then((data: any) => {
        setPortfolios(data || []);
        updatePublishedCount(data || []);
      })
      .catch(() => {
        setPortfolios([]);
      })
      .finally(() => setLoading(false));

    // Fetch dashboard analytics
    analyticsApi.dashboard()
      .then((data: any) => {
        setDynamicStats(prev => prev.map(s => {
          if (s.label === "Total Visits") return { ...s, value: String(data.totalVisits ?? 0) };
          if (s.label === "Unique Visitors") return { ...s, value: String(data.uniqueVisitors ?? 0) };
          if (s.label === "Conversion Rate") return { ...s, value: `${data.conversionRate ?? 0}%` };
          return s;
        }));
      })
      .catch(() => { });
  }, []);

  const updatePublishedCount = (list: any[]) => {
    const published = list.filter((p: any) => p.isPublished);
    setDynamicStats(prev => prev.map(s =>
      s.label === "Published Sites" ? { ...s, value: String(published.length) } : s
    ));
  };

  const handleUnpublish = async (portfolioId: string) => {
    if (!confirm("Unpublish this portfolio? The public URL will no longer be accessible.")) return;

    setActionLoading(prev => ({ ...prev, [portfolioId]: "unpublish" }));
    try {
      await portfolioApi.unpublish(portfolioId);
      setPortfolios(prev => {
        const updated = prev.map(p =>
          p._id === portfolioId ? { ...p, isPublished: false } : p
        );
        updatePublishedCount(updated);
        return updated;
      });
    } catch (err) {
      alert("Failed to unpublish portfolio.");
    } finally {
      setActionLoading(prev => {
        const next = { ...prev };
        delete next[portfolioId];
        return next;
      });
    }
  };

  const handlePublish = async (portfolioId: string) => {
    setActionLoading(prev => ({ ...prev, [portfolioId]: "publish" }));
    try {
      await portfolioApi.publish({ portfolioId });
      setPortfolios(prev => {
        const updated = prev.map(p =>
          p._id === portfolioId ? { ...p, isPublished: true } : p
        );
        updatePublishedCount(updated);
        return updated;
      });
    } catch (err) {
      alert("Failed to publish portfolio.");
    } finally {
      setActionLoading(prev => {
        const next = { ...prev };
        delete next[portfolioId];
        return next;
      });
    }
  };

  const handleDelete = async (portfolioId: string) => {
    if (!confirm("Delete this portfolio? This action cannot be undone.")) return;

    setActionLoading(prev => ({ ...prev, [portfolioId]: "delete" }));
    try {
      await portfolioApi.delete(portfolioId);
      setPortfolios(prev => {
        const updated = prev.filter(p => p._id !== portfolioId);
        updatePublishedCount(updated);
        return updated;
      });
    } catch (err) {
      alert("Failed to delete portfolio.");
    } finally {
      setActionLoading(prev => {
        const next = { ...prev };
        delete next[portfolioId];
        return next;
      });
    }
  };

  const firstName = userName.split(" ")[0] || "there";

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-2xl">Welcome back, {firstName}</h1>
            <p className="text-muted-foreground text-sm mt-1">Here's what's happening with your portfolios.</p>
          </div>
          <Link to="/dashboard/upload">
            <Button variant="hero" size="default">
              <Plus className="w-4 h-4" />
              New Portfolio
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {dynamicStats.map((s) => (
            <div key={s.label} className="p-5 rounded-2xl bg-card border border-border/50">
              <div className="flex items-center justify-between mb-3">
                <s.icon className="w-5 h-5 text-muted-foreground" />
                {s.change && (
                  <span className="text-xs font-medium text-success flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3" />
                    {s.change}
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Portfolios */}
        <div>
          <h2 className="font-display font-semibold text-lg mb-4">Your Portfolios</h2>

          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Loading your portfolios...
            </div>
          ) : portfolios.length === 0 ? (
            <div className="text-center py-12 rounded-xl bg-card border border-border/50">
              <Globe className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">You haven't created any portfolios yet.</p>
              <Link to="/dashboard/upload">
                <Button variant="hero" size="default">
                  <Plus className="w-4 h-4" />
                  Create Your First Portfolio
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {portfolios.map((p: any) => {
                const busy = actionLoading[p._id];
                return (
                  <div key={p._id} className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/50 hover:border-border transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{p.content?.name || p.username || "Untitled"}</p>
                        <p className="text-xs text-muted-foreground">r2p.io/{p.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${p.isPublished ? "bg-success/10 text-success" : "bg-secondary text-muted-foreground"}`}>
                        {p.isPublished ? "Published" : "Draft"}
                      </span>

                      {p.isPublished ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={!!busy}
                          onClick={() => handleUnpublish(p._id)}
                          className="text-amber-500 hover:text-amber-600 hover:bg-amber-500/10"
                        >
                          {busy === "unpublish" ? <Loader2 className="w-4 h-4 animate-spin" /> : <EyeOff className="w-4 h-4" />}
                          <span className="ml-1 hidden sm:inline">Unpublish</span>
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={!!busy}
                          onClick={() => handlePublish(p._id)}
                          className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10"
                        >
                          {busy === "publish" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                          <span className="ml-1 hidden sm:inline">Publish</span>
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={!!busy}
                        onClick={() => handleDelete(p._id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        {busy === "delete" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        <span className="ml-1 hidden sm:inline">Delete</span>
                      </Button>

                      <Link to={`/dashboard/editor/${p._id}`}>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

