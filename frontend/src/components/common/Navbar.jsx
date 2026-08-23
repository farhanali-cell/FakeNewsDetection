import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

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
        </div>
      </div>
    </nav>
  );
}
