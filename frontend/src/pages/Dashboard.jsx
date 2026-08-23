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
  const [menuOpen, setMenuOpen] = useState(false);

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
            Overview
          </h1>
          <p className="text-white/40 text-xs">
            Welcome back, {user?.username}
          </p>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => setMenuOpen((s) => !s)}
          className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full border border-white/8 hover:border-white/20 bg-white/2 transition-colors"
        >
          <Avatar username={user?.username} />
          <span className="hidden sm:block text-sm text-white/70">
            {user?.username}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-3.5 w-3.5 text-white/40 transition-transform ${menuOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-[#12161F] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-[fadeUp_0.15s_ease-out]">
            <div className="px-4 py-3 border-b border-white/8">
              <p className="text-sm text-white/80 font-medium truncate">
                {user?.username}
              </p>
              <p className="text-xs text-white/40">Signed in</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

/* ---------------- Stat card ---------------- */
function StatCard({ label, value, sub, accent, icon, delay = 0 }) {
  return (
    <div
      className="group border border-white/8 bg-white/2 rounded-2xl p-5 hover:border-white/20 hover:-translate-y-0.5 transition-all duration-300 animate-[fadeUp_0.5s_ease-out_both]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
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
      </div>
      <p
        className="text-2xl font-semibold text-white mb-0.5"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {value}
      </p>
      <p className="text-white/40 text-xs">{label}</p>
      {sub && (
        <p className="text-[11px] mt-2" style={{ color: accent }}>
          {sub}
        </p>
      )}
    </div>
  );
}

/* ---------------- Mini bar chart (last 7 checks) ---------------- */
function TrendChart({ items }) {
  const points = items.slice(0, 7).reverse();
  const max = Math.max(...points.map((p) => p.confidence ?? 0), 1);

  if (points.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-white/30 text-sm">
        No analysis yet — results will appear here
      </div>
    );
  }

  return (
    <div className="flex items-end justify-between gap-2.5 h-40 px-1">
      {points.map((p, i) => {
        const isFake = p.prediction === "FAKE";
        const isUncertain = p.prediction === "UNCERTAIN";
        const color = isUncertain ? "#8B93A6" : isFake ? "#E8935B" : "#3ECF8E";
        const heightPct =
          p.confidence != null ? Math.max((p.confidence / max) * 100, 6) : 6;

        return (
          <div
            key={p.id ?? i}
            className="flex-1 flex flex-col items-center justify-end h-full group"
          >
            <span className="text-[10px] text-white/40 mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              {p.confidence != null ? `${p.confidence}%` : "—"}
            </span>
            <div
              className="w-full rounded-t-md transition-all duration-700 ease-out"
              style={{
                height: `${heightPct}%`,
                backgroundColor: color,
                opacity: isUncertain ? 0.5 : 0.85,
              }}
            />
            <span
              className="w-1.5 h-1.5 rounded-full mt-2"
              style={{ backgroundColor: color }}
            />
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- Main Dashboard ---------------- */
export default function Dashboard() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/history/");
      setHistory(res.data);
    } catch {
      // silent — history is supplementary
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setError("");
    setResult(null);
    setLoading(true);

    try {
      const response = await api.post("/detect/", { text });
      setResult(response.data);
      fetchHistory();
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isFake = result?.prediction === "FAKE";
  const isUncertain = result?.prediction === "UNCERTAIN";

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

    return { total, fakeCount, realCount, uncertainCount, avgConfidence };
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

      <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto px-5 sm:px-8 py-8 max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
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
              label="Flagged as fake"
              value={stats.fakeCount}
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
              label="Verified real"
              value={stats.realCount}
              accent="#3ECF8E"
              delay={160}
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.75}
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              }
            />
            <StatCard
              label="Avg. confidence"
              value={`${stats.avgConfidence}%`}
              accent="#8B93A6"
              delay={240}
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
              label="Uncertain"
              value={stats.uncertainCount}
              accent="#8B93A6"
              delay={320}
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.75}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              }
            />
          </div>

          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 space-y-6 min-w-0">
              <div
                className="border border-white/8 bg-white/2 rounded-2xl p-6 animate-[fadeUp_0.5s_ease-out_both]"
                style={{ animationDelay: "100ms" }}
              >
                <h2
                  className="text-white font-medium mb-1"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Analyze an article
                </h2>
                <p className="text-white/40 text-xs mb-4">
                  Paste text below to run detection
                </p>

                <form onSubmit={handleSubmit}>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={7}
                    placeholder="Paste the news article text here..."
                    className="w-full bg-black/30 border border-white/10 text-[#E8EAED] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#3ECF8E] focus:border-[#3ECF8E] transition-colors resize-none placeholder-white/25"
                  />

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-white/30">
                      {text.length} characters
                    </span>
                    <button
                      type="submit"
                      disabled={loading || !text.trim()}
                      className="bg-[#3ECF8E] text-[#0B0E14] font-medium rounded-lg px-5 py-2.5 text-sm hover:bg-[#5adba3] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {loading ? "Analyzing..." : "Analyze"}
                    </button>
                  </div>
                </form>

                {error && (
                  <div className="mt-4 bg-[#E8935B]/10 border border-[#E8935B]/25 text-[#E8935B] text-sm rounded-lg px-4 py-3">
                    {error}
                  </div>
                )}
              </div>

              {result && (
                <div
                  className={`rounded-2xl border p-6 animate-[fadeUp_0.4s_ease-out_both] ${
                    isUncertain
                      ? "bg-[#8B93A6]/6 border-[#8B93A6]/25"
                      : isFake
                        ? "bg-[#E8935B]/6 border-[#E8935B]/25"
                        : "bg-[#3ECF8E]/6 border-[#3ECF8E]/25"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative w-28 h-28 shrink-0">
                      <svg
                        className="w-28 h-28 -rotate-90"
                        viewBox="0 0 120 120"
                      >
                        <circle
                          cx="60"
                          cy="60"
                          r="52"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="9"
                          className="text-white/8"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="52"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="9"
                          strokeDasharray={2 * Math.PI * 52}
                          strokeDashoffset={
                            2 *
                            Math.PI *
                            52 *
                            (1 - (result.confidence ?? 0) / 100)
                          }
                          strokeLinecap="round"
                          style={{
                            color: isUncertain
                              ? "#8B93A6"
                              : isFake
                                ? "#E8935B"
                                : "#3ECF8E",
                            transition: "stroke-dashoffset 0.8s ease-out",
                          }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-semibold text-white">
                          {result.confidence != null
                            ? `${result.confidence}%`
                            : "—"}
                        </span>
                        <span className="text-[10px] text-white/40">
                          {result.confidence != null
                            ? "confidence"
                            : "no score"}
                        </span>
                      </div>
                    </div>

                    <div className="text-center sm:text-left">
                      <span
                        className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide mb-2"
                        style={{
                          backgroundColor: isUncertain
                            ? "#8B93A6"
                            : isFake
                              ? "#E8935B"
                              : "#3ECF8E",
                          color: "#0B0E14",
                        }}
                      >
                        {result.prediction}
                      </span>
                      <h3
                        className="text-lg font-medium text-white mb-1"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {isUncertain
                          ? "Not sure about this one"
                          : isFake
                            ? "This looks like Fake News"
                            : "This looks like Real News"}
                      </h3>
                    </div>
                  </div>

                  {result.message && (
                    <div className="mt-5 bg-[#8B93A6]/10 border border-[#8B93A6]/25 text-white/60 text-sm rounded-lg px-4 py-3">
                      {result.message}
                    </div>
                  )}

                  {result.top_keywords && result.top_keywords.length > 0 && (
                    <div className="mt-6 pt-5 border-t border-white/8">
                      <p className="text-[11px] font-medium text-white/40 uppercase tracking-wide mb-3">
                        Key indicators
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {result.top_keywords.map((word, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-md text-xs font-medium border"
                            style={{
                              backgroundColor: isUncertain
                                ? "#8B93A61A"
                                : isFake
                                  ? "#E8935B1A"
                                  : "#3ECF8E1A",
                              borderColor: isUncertain
                                ? "#8B93A640"
                                : isFake
                                  ? "#E8935B40"
                                  : "#3ECF8E40",
                              color: isUncertain
                                ? "#8B93A6"
                                : isFake
                                  ? "#E8935B"
                                  : "#3ECF8E",
                            }}
                          >
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="lg:col-span-2 space-y-6 min-w-0">
              <div
                className="border border-white/8 bg-white/2 rounded-2xl p-6 animate-[fadeUp_0.5s_ease-out_both]"
                style={{ animationDelay: "180ms" }}
              >
                <h2
                  className="text-white font-medium mb-4 text-sm"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Recent confidence trend
                </h2>
                <TrendChart items={history} />
              </div>

              <div
                className="border border-white/8 bg-white/2 rounded-2xl p-6 animate-[fadeUp_0.5s_ease-out_both]"
                style={{ animationDelay: "260ms" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2
                    className="text-white font-medium text-sm"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Recent activity
                  </h2>
                  <Link
                    to="/dashboard/history"
                    className="text-xs text-[#3ECF8E] hover:text-[#5adba3] transition-colors"
                  >
                    View all
                  </Link>
                </div>

                {history.length === 0 ? (
                  <p className="text-white/30 text-sm text-center py-6">
                    No submissions yet
                  </p>
                ) : (
                  <div className="space-y-1">
                    {history.slice(0, 5).map((item) => {
                      const fake = item.prediction === "FAKE";
                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-white/3 transition-colors min-w-0"
                        >
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{
                              backgroundColor: fake ? "#E8935B" : "#3ECF8E",
                            }}
                          />
                          <p className="text-white/60 text-xs truncate flex-1">
                            {item.text_preview}
                          </p>
                          <span className="text-[11px] text-white/30 shrink-0">
                            {item.confidence}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
