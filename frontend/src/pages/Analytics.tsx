import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { BarChart3, Users, Eye, Clock, ArrowUpRight, ArrowDownRight, Globe, Loader2, ChevronDown } from "lucide-react";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { analytics, portfolio as portfolioApi } from "@/services/api";

const DEVICE_COLORS: Record<string, string> = {
  Desktop: "hsl(217, 91%, 60%)",
  Mobile: "hsl(250, 80%, 65%)",
  Tablet: "hsl(142, 76%, 46%)",
};

const dateFilters = ["7 days", "30 days", "All time"];

type PortfolioOption = { _id: string; username: string; name: string; isPublished: boolean };

const Analytics = () => {
  const [dateRange, setDateRange] = useState("All time");
  const [portfolios, setPortfolios] = useState<PortfolioOption[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Load user's portfolios
  useEffect(() => {
    portfolioApi.getMyPortfolios()
      .then((res: any) => {
        const mapped = (res || []).map((p: any) => ({
          _id: p._id,
          username: p.username,
          name: p.content?.name || p.username || "Untitled",
          isPublished: p.isPublished,
        }));
        setPortfolios(mapped);
        if (mapped.length > 0) {
          setSelectedId(mapped[0]._id);
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
        setError("Failed to load portfolios.");
      });
  }, []);

  // Fetch analytics when selected portfolio changes
  useEffect(() => {
    if (!selectedId) return;
    setLoading(true);
    setError(null);

    analytics.get(selectedId)
      .then((res: any) => {
        setData(res);
      })
      .catch(() => {
        setData(null);
        setError("Failed to load analytics.");
      })
      .finally(() => setLoading(false));
  }, [selectedId]);

  // Derive filtered + formatted chart data
  const visitsOverTime = (() => {
    if (!data?.visitsOverTime) return [];
    let items = data.visitsOverTime.map((v: any) => ({
      date: v._id,
      visits: v.count,
    }));

    // Filter by date range
    if (dateRange !== "All time") {
      const days = dateRange === "7 days" ? 7 : 30;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      items = items.filter((v: any) => new Date(v.date) >= cutoff);
    }

    // Format date labels
    return items.map((v: any) => ({
      ...v,
      date: new Date(v.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    }));
  })();

  const deviceData = (() => {
    if (!data?.deviceTypes) return [];
    const total = data.deviceTypes.reduce((s: number, d: any) => s + d.count, 0);
    return data.deviceTypes.map((d: any) => ({
      name: d._id || "Unknown",
      value: total > 0 ? Math.round((d.count / total) * 100) : 0,
      count: d.count,
      color: DEVICE_COLORS[d._id] || "hsl(215, 20%, 55%)",
    }));
  })();

  const referrers = (() => {
    if (!data?.referrers) return [];
    const total = data.referrers.reduce((s: number, r: any) => s + r.count, 0);
    return data.referrers.map((r: any) => ({
      source: r._id || "Unknown",
      visits: r.count,
      pct: total > 0 ? `${Math.round((r.count / total) * 100)}%` : "0%",
    }));
  })();

  const stats = [
    { label: "Total Visits", value: data?.totalVisits ?? "—", icon: Eye },
    { label: "Unique Visitors", value: data?.uniqueVisitors ?? "—", icon: Users },
    { label: "Bounce Rate", value: data?.bounceRate != null ? `${data.bounceRate}%` : "—", icon: BarChart3 },
  ];

  const selectedPortfolio = portfolios.find(p => p._id === selectedId);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-2xl">Analytics</h1>
            <p className="text-sm text-muted-foreground mt-1">Track your portfolio performance.</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Portfolio Selector */}
            {portfolios.length > 0 && (
              <div className="relative">
                <select
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="appearance-none bg-card border border-border/50 rounded-lg px-3 py-1.5 pr-8 text-sm font-medium text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {portfolios.map(p => (
                    <option key={p._id} value={p._id}>
                      {p.username} {p.isPublished ? "" : "(Draft)"}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            )}

            {/* Date Range Filter */}
            <div className="flex gap-1">
              {dateFilters.map(f => (
                <button
                  key={f}
                  onClick={() => setDateRange(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${dateRange === f ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Loading analytics...
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-20">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {/* No portfolios */}
        {!loading && !error && portfolios.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p>No portfolios found. Create and publish a portfolio to see analytics.</p>
          </div>
        )}

        {/* Analytics content */}
        {!loading && !error && data && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="p-5 rounded-2xl bg-card border border-border/50">
                  <div className="flex items-center justify-between mb-3">
                    <s.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div className="grid lg:grid-cols-3 gap-4">
              {/* Line chart */}
              <div className="lg:col-span-2 p-5 rounded-2xl bg-card border border-border/50">
                <h3 className="font-semibold text-sm mb-4">Visits Over Time</h3>
                {visitsOverTime.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={visitsOverTime}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 20%, 16%)" />
                      <XAxis dataKey="date" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                      <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} allowDecimals={false} />
                      <Tooltip contentStyle={{ background: "hsl(222, 40%, 9%)", border: "1px solid hsl(222, 20%, 16%)", borderRadius: "8px", color: "hsl(210, 40%, 96%)" }} />
                      <Line type="monotone" dataKey="visits" stroke="hsl(217, 91%, 60%)" strokeWidth={2} dot={{ fill: "hsl(217, 91%, 60%)", r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[250px] text-muted-foreground text-sm">
                    No visit data yet.
                  </div>
                )}
              </div>

              {/* Pie chart */}
              <div className="p-5 rounded-2xl bg-card border border-border/50">
                <h3 className="font-semibold text-sm mb-4">Device Types</h3>
                {deviceData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={deviceData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
                          {deviceData.map((d: any, i: number) => <Cell key={i} fill={d.color} />)}
                        </Pie>
                        <Tooltip contentStyle={{ background: "hsl(222, 40%, 9%)", border: "1px solid hsl(222, 20%, 16%)", borderRadius: "8px", color: "hsl(210, 40%, 96%)" }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-4 mt-2">
                      {deviceData.map((d: any) => (
                        <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                          {d.name} {d.value}%
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">
                    No device data yet.
                  </div>
                )}
              </div>
            </div>

            {/* Referrer table */}
            <div className="p-5 rounded-2xl bg-card border border-border/50">
              <h3 className="font-semibold text-sm mb-4">Referrer Sources</h3>
              {referrers.length > 0 ? (
                <div className="space-y-3">
                  {referrers.map((r: any) => (
                    <div key={r.source} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{r.source}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">{r.visits}</span>
                        <span className="text-xs text-muted-foreground w-8 text-right">{r.pct}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm text-center py-6">No referrer data yet.</p>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
