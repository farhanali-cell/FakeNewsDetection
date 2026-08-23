import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

/* ---------------- Sidebar (shared shape with Dashboard) ---------------- */
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#0D1119] border-r border-white/8 flex flex-col z-40 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
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
function Header({ onMenuClick, title, subtitle }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 px-5 sm:px-8 py-4 bg-[#0B0E14]/80 backdrop-blur-xl border-b border-white/8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden text-white/60 hover:text-white transition-colors"
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
            {title}
          </h1>
          <p className="text-white/40 text-xs">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full border border-white/8 bg-white/2">
        <Avatar username={user?.username} />
        <span className="hidden sm:block text-sm text-white/70">
          {user?.username}
        </span>
      </div>
    </header>
  );
}

/* ---------------- Delete confirm modal ---------------- */
function ConfirmDeleteModal({ open, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-6">
      <div className="w-full max-w-sm bg-[#12161F] border border-white/10 rounded-2xl p-6 animate-[fadeUp_0.2s_ease-out]">
        <h3
          className="text-white font-medium mb-2"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Delete this entry?
        </h3>
        <p className="text-white/50 text-sm mb-6">
          This will permanently remove it from your history. This can't be
          undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 text-sm font-medium text-white/70 hover:text-white border border-white/10 hover:border-white/25 rounded-lg py-2.5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 text-sm font-medium text-[#0B0E14] bg-[#E8935B] hover:bg-[#f0a879] rounded-lg py-2.5 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Main History Page ---------------- */
export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState("all"); // all | FAKE | REAL
  const [search, setSearch] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/history/");
      setHistory(res.data);
    } catch (err) {
      setError("Could not load history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/history/${id}/`);
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch {
      setError("Could not delete this entry. Please try again.");
    } finally {
      setPendingDeleteId(null);
    }
  };

  const filtered = useMemo(() => {
    return history.filter((item) => {
      const matchesFilter = filter === "all" || item.prediction === filter;
      const matchesSearch =
        !search.trim() ||
        item.text_preview.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [history, filter, search]);

  const formatDate = (iso) => {
    const d = new Date(iso);
    return (
      d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) +
      " · " +
      d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
    );
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#E8EAED] flex">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          title="History"
          subtitle={`${history.length} article${history.length === 1 ? "" : "s"} analyzed`}
        />

        <main className="px-5 sm:px-8 py-8 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
            <div className="relative flex-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.75}
                  d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
                />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search history..."
                className="w-full bg-black/30 border border-white/10 text-[#E8EAED] rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#3ECF8E] focus:border-[#3ECF8E] transition-colors placeholder-white/25"
              />
            </div>

            <div className="flex gap-2">
              {["all", "FAKE", "REAL", "UNCERTAIN"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium border transition-colors ${
                    filter === f
                      ? "bg-[#3ECF8E]/10 border-[#3ECF8E]/40 text-[#3ECF8E]"
                      : "border-white/10 text-white/50 hover:text-white hover:border-white/25"
                  }`}
                >
                  {f === "all"
                    ? "All"
                    : f === "FAKE"
                      ? "Fake"
                      : f === "REAL"
                        ? "Real"
                        : "Uncertain"}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-[#E8935B]/10 border border-[#E8935B]/25 text-[#E8935B] text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 rounded-xl bg-white/3 animate-pulse"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 border border-white/8 rounded-2xl bg-white/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-white/15 mx-auto mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.25}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-white/40 text-sm">
                {history.length === 0
                  ? "No articles analyzed yet"
                  : "Nothing matches your search"}
              </p>
              {history.length === 0 && (
                <Link
                  to="/dashboard"
                  className="inline-block mt-4 text-sm text-[#3ECF8E] hover:text-[#5adba3] font-medium transition-colors"
                >
                  Analyze your first article →
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-2.5">
              {filtered.map((item, idx) => {
                const fake = item.prediction === "FAKE";
                const uncertain = item.prediction === "UNCERTAIN";
                const color = uncertain
                  ? "#8B93A6"
                  : fake
                    ? "#E8935B"
                    : "#3ECF8E";
                const expanded = expandedId === item.id;
                return (
                  <div
                    key={item.id}
                    className="border border-white/8 bg-white/2 rounded-xl overflow-hidden hover:border-white/20 transition-colors duration-200 animate-[fadeUp_0.4s_ease-out_both]"
                    style={{ animationDelay: `${Math.min(idx * 40, 400)}ms` }}
                  >
                    <button
                      onClick={() => setExpandedId(expanded ? null : item.id)}
                      className="w-full flex items-center gap-4 px-4 py-3.5 text-left"
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{
                          backgroundColor: color,
                        }}
                      />

                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white/80 truncate">
                          {item.text_preview}
                        </p>
                        <p className="text-xs text-white/30 mt-0.5">
                          {formatDate(item.created_at)}
                        </p>
                      </div>

                      <span
                        className="text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full shrink-0"
                        style={{
                          backgroundColor: color,
                          color: "#0B0E14",
                        }}
                      >
                        {item.prediction}
                      </span>

                      <span className="text-xs text-white/40 w-10 text-right shrink-0">
                        {item.confidence}%
                      </span>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 text-white/30 shrink-0 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
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

                    {expanded && (
                      <div className="px-4 pb-4 pt-1 border-t border-white/8 animate-[fadeUp_0.2s_ease-out]">
                        <p className="text-sm text-white/50 leading-relaxed mb-3">
                          {item.text_preview}
                        </p>
                        <button
                          onClick={() => setPendingDeleteId(item.id)}
                          className="text-xs font-medium text-[#E8935B] hover:text-[#f0a879] transition-colors"
                        >
                          Delete entry
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      <ConfirmDeleteModal
        open={pendingDeleteId !== null}
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => handleDelete(pendingDeleteId)}
      />
    </div>
  );
}
