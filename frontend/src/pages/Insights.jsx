import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

/* ---------------- Sidebar ---------------- */
function Sidebar({ open, onClose }) {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    {
      to: "/dashboard",
      label: "Analyze",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.75}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      ),
    },
    {
      to: "/dashboard/history",
      label: "History",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.75}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
    },
    {
      to: "/dashboard/insights",
      label: "Insights",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.75}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      ),
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#0D1119] border-r border-white/8 flex flex-col z-40 transition-transform duration-300 shrink-0 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <Link to="/" className="flex items-center gap-2.5 px-6 py-6">
          <div className="w-8 h-8 rounded-lg bg-[#3ECF8E] flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4.5 w-4.5 text-[#0B0E14]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <span
            className="font-semibold text-[15px] tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            TruthLens
          </span>
        </Link>

        <nav className="flex-1 px-3 py-2 space-y-1">
          {links.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={`group relative flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-[#3ECF8E]/10 text-[#3ECF8E]"
                    : "text-white/50 hover:text-white hover:bg-white/4 hover:translate-x-0.5"
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r bg-[#3ECF8E]" />
                )}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4.5 w-4.5 transition-transform duration-200 group-hover:scale-110 ${
                    active
                      ? "text-[#3ECF8E]"
                      : "text-white/40 group-hover:text-white/70"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {link.icon}
                </svg>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-white/50 hover:text-[#E8935B] hover:bg-[#E8935B]/10 transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4.5 w-4.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}

/* ---------------- Avatar ---------------- */
function Avatar({ username, size = 36 }) {
  const initial = username ? username[0].toUpperCase() : "?";
  return (
    <div
      className="rounded-full bg-linear-to-br from-[#3ECF8E] to-[#2fae77] flex items-center justify-center text-[#0B0E14] font-semibold shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {initial}
    </div>
  );
}

/* ---------------- Header ---------------- */
function Header({ onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 px-5 sm:px-8 py-4 bg-[#0B0E14]/80 backdrop-blur-xl border-b border-white/8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-white/60 hover:text-white transition-colors"
          aria-label="Open menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div>
          <h1
            className="text-white font-medium text-lg"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Insights
          </h1>
          <p className="text-white/40 text-xs">
            Patterns across your analyzed articles
          </p>
        </div>
      </div>

      <Avatar username={user?.username} />
    </header>
  );
}

/* ---------------- Stat card ---------------- */
function StatCard({ label, value, accent, icon, delay = 0 }) {
  return (
    <div
      className="group border border-white/8 bg-white/2 rounded-2xl p-5 hover:border-white/20 hover:-translate-y-0.5 transition-all duration-300 animate-[fadeUp_0.5s_ease-out_both] min-w-0"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundColor: `${accent}1A` }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4.5 w-4.5"
          style={{ color: accent }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {icon}
        </svg>
      </div>
      <p
        className="text-2xl font-semibold text-white mb-0.5 truncate"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {value}
      </p>
      <p className="text-white/40 text-xs">{label}</p>
    </div>
  );
}

/* ---------------- Donut chart: Fake vs Real ---------------- */
function DistributionDonut({ fakeCount, realCount }) {
  const total = fakeCount + realCount;

  if (total === 0) {
    return (
      <div className="h-56 flex items-center justify-center text-white/30 text-sm">
        No data yet
      </div>
    );
  }

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const fakePct = fakeCount / total;
  const fakeLength = circumference * fakePct;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-8">
      <div className="relative w-44 h-44 shrink-0">
        <svg className="w-44 h-44 -rotate-90" viewBox="0 0 180 180">
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="#3ECF8E"
            strokeWidth="20"
            opacity="0.85"
          />
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="#E8935B"
            strokeWidth="20"
            strokeDasharray={`${fakeLength} ${circumference}`}
            strokeLinecap="round"
            opacity="0.9"
            style={{ transition: "stroke-dasharray 0.8s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-2xl font-semibold text-white"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {total}
          </span>
          <span className="text-[11px] text-white/40">total</span>
        </div>
      </div>

      <div className="space-y-3 min-w-0">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3ECF8E] shrink-0" />
          <span className="text-sm text-white/70">Real</span>
          <span className="text-sm text-white font-medium ml-auto">
            {realCount}{" "}
            <span className="text-white/30 text-xs">
              ({Math.round((realCount / total) * 100)}%)
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E8935B] shrink-0" />
          <span className="text-sm text-white/70">Fake</span>
          <span className="text-sm text-white font-medium ml-auto">
            {fakeCount}{" "}
            <span className="text-white/30 text-xs">
              ({Math.round((fakeCount / total) * 100)}%)
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Area chart: confidence over full history ---------------- */
function ConfidenceAreaChart({ items }) {
  if (items.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-white/30 text-sm">
        No analysis yet — chart will appear here
      </div>
    );
  }
  
  const points = [...items].filter((p) => p.confidence != null).reverse();
  const width = 100;
  const height = 100;
  const stepX = points.length > 1 ? width / (points.length - 1) : 0;

  const coords = points.map((p, i) => ({
    x: points.length > 1 ? i * stepX : width / 2,
    y: height - (p.confidence / 100) * height,
    fake: p.prediction === "FAKE",
  }));

  const linePath = coords
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${height} L ${coords[0].x} ${height} Z`;

  return (
    <div className="h-48 relative">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3ECF8E" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#3ECF8E" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#areaFill)" />
        <path
          d={linePath}
          fill="none"
          stroke="#3ECF8E"
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />
        {coords.map((c, i) => (
          <circle
            key={i}
            cx={c.x}
            cy={c.y}
            r="1.4"
            fill={c.fake ? "#E8935B" : "#3ECF8E"}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
    </div>
  );
}

/* ---------------- Bar chart: last 7 days activity ---------------- */
function DailyActivityChart({ items }) {
  const days = useMemo(() => {
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString("en-US", { weekday: "short" });
      const count = items.filter(
        (item) => new Date(item.created_at).toISOString().slice(0, 10) === key,
      ).length;
      result.push({ label, count });
    }
    return result;
  }, [items]);

  const max = Math.max(...days.map((d) => d.count), 1);

  return (
    <div className="flex items-end justify-between gap-2.5 h-36 px-1">
      {days.map((d, i) => {
        const heightPct =
          d.count === 0 ? 3 : Math.max((d.count / max) * 100, 10);
        return (
          <div
            key={i}
            className="flex-1 flex flex-col items-center justify-end h-full group"
          >
            <span className="text-[10px] text-white/40 mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              {d.count}
            </span>
            <div
              className="w-full rounded-t-md bg-[#3ECF8E] transition-all duration-700 ease-out"
              style={{
                height: `${heightPct}%`,
                opacity: d.count === 0 ? 0.15 : 0.85,
              }}
            />
            <span className="text-[10px] text-white/30 mt-2">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- Main Insights page ---------------- */
export default function Insights() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/history/");
        setHistory(res.data);
      } catch {
        // silent — page degrades to empty state
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const stats = useMemo(() => {
    const total = history.length;
    const fakeCount = history.filter((h) => h.prediction === "FAKE").length;
    const uncertainCount = history.filter(
      (h) => h.prediction === "UNCERTAIN",
    ).length;
    const realCount = total - fakeCount - uncertainCount;

    const scored = history.filter((h) => h.confidence != null);
    const avgConfidence = scored.length
      ? Math.round(scored.reduce((s, h) => s + h.confidence, 0) / scored.length)
      : 0;
    const highestConfidence = scored.length
      ? Math.max(...scored.map((h) => h.confidence))
      : 0;
    return {
      total,
      fakeCount,
      realCount,
      uncertainCount,
      avgConfidence,
      highestConfidence,
    };
  }, [history]);

  return (
    <div className="h-screen bg-[#0B0E14] text-[#E8EAED] flex overflow-hidden">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0 h-screen overflow-y-auto">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="px-5 sm:px-8 py-8 max-w-6xl mx-auto">
          {loading ? (
            <div className="h-64 flex items-center justify-center text-white/30 text-sm">
              Loading insights...
            </div>
          ) : stats.total === 0 ? (
            <div className="border border-white/8 bg-white/2 rounded-2xl p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-[#3ECF8E]/10 flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#3ECF8E]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.75}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h2
                className="text-white font-medium mb-1"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                No insights yet
              </h2>
              <p className="text-white/40 text-sm mb-5">
                Analyze a few articles first, then come back to see patterns.
              </p>
              <Link
                to="/dashboard"
                className="inline-block bg-[#3ECF8E] text-[#0B0E14] font-medium rounded-lg px-5 py-2.5 text-sm hover:bg-[#5adba3] transition-colors"
              >
                Analyze an article
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                  label="Total analyzed"
                  value={stats.total}
                  accent="#3ECF8E"
                  delay={0}
                  icon={
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.75}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  }
                />
                <StatCard
                  label="Fake rate"
                  value={`${stats.total ? Math.round((stats.fakeCount / stats.total) * 100) : 0}%`}
                  accent="#E8935B"
                  delay={80}
                  icon={
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.75}
                      d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                    />
                  }
                />
                <StatCard
                  label="Avg. confidence"
                  value={`${stats.avgConfidence}%`}
                  accent="#8B93A6"
                  delay={160}
                  icon={
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.75}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  }
                />
                <StatCard
                  label="Highest confidence"
                  value={`${stats.highestConfidence}%`}
                  accent="#3ECF8E"
                  delay={240}
                  icon={
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.75}
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  }
                />
              </div>

              <div className="grid lg:grid-cols-5 gap-6 mb-6">
                <div
                  className="lg:col-span-2 border border-white/8 bg-white/2 rounded-2xl p-6 min-w-0 animate-[fadeUp_0.5s_ease-out_both]"
                  style={{ animationDelay: "100ms" }}
                >
                  <h2
                    className="text-white font-medium mb-5 text-sm"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Real vs Fake distribution
                  </h2>
                  <DistributionDonut
                    fakeCount={stats.fakeCount}
                    realCount={stats.realCount}
                  />
                </div>

                <div
                  className="lg:col-span-3 border border-white/8 bg-white/2 rounded-2xl p-6 min-w-0 animate-[fadeUp_0.5s_ease-out_both]"
                  style={{ animationDelay: "180ms" }}
                >
                  <h2
                    className="text-white font-medium mb-5 text-sm"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Confidence over time
                  </h2>
                  <ConfidenceAreaChart items={history} />
                </div>
              </div>

              <div
                className="border border-white/8 bg-white/2 rounded-2xl p-6 min-w-0 animate-[fadeUp_0.5s_ease-out_both]"
                style={{ animationDelay: "260ms" }}
              >
                <h2
                  className="text-white font-medium mb-5 text-sm"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Activity this week
                </h2>
                <DailyActivityChart items={history} />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
