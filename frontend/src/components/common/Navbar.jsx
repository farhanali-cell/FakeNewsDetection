import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0B0E14]/80 backdrop-blur-lg border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5">
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
            className="font-semibold tracking-tight text-[15px]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            TruthLens
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
          <a href="#how" className="hover:text-white transition-colors">
            How it works
          </a>

          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>

          <Link
            to="/contact"
            className="text-sm text-white/50 hover:text-white transition-colors"
          >
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full border border-white/10 hover:border-white/25 transition-colors"
              >
                <span className="w-7 h-7 rounded-full bg-[#3ECF8E] text-[#0B0E14] text-xs font-semibold flex items-center justify-center uppercase">
                  {user.username.charAt(0)}
                </span>
                <span className="text-sm text-white/80 hidden sm:block">
                  {user.username}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-3.5 w-3.5 text-white/40 transition-transform ${
                    menuOpen ? "rotate-180" : ""
                  }`}
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
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-[#10141D] shadow-xl shadow-black/40 py-1.5 z-50">
                    <Link
                      to="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/history"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      History
                    </Link>
                    <div className="my-1 border-t border-white/10" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-[#E8935B] hover:bg-white/5 transition-colors"
                    >
                      Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-white/70 hover:text-white transition-colors hidden sm:block"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium bg-[#3ECF8E] text-[#0B0E14] hover:bg-[#5adba3] px-4 py-2 rounded-lg transition-colors"
              >
                Sign up free
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
