import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      id="footer"
      className="relative overflow-hidden border-t border-white/10 bg-linear-to-b from-[#0B0E14] via-[#10141D] to-[#0B0E14]"
    >
      {/* Background Glow */}
      <div className="absolute -top-28 left-10 w-72 h-72 rounded-full bg-[#3ECF8E]/5 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-cyan-500/5 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#3ECF8E] to-[#2CB67D] flex items-center justify-center shadow-lg shadow-[#3ECF8E]/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#0B0E14]"
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
                className="text-2xl font-bold text-white tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                TruthLens
              </span>
            </div>

            <p className="text-white/55 text-sm leading-7 max-w-sm">
              A machine learning system for detecting misinformation patterns in
              news text using intelligent NLP models and modern AI techniques.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white text-base font-semibold mb-5">Product</h3>

            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#how"
                  className="text-white/45 hover:text-[#3ECF8E] transition-all duration-300"
                >
                  How it Works
                </a>
              </li>

              <li>
                <a
                  href="#features"
                  className="text-white/45 hover:text-[#3ECF8E] transition-all duration-300"
                >
                  Features
                </a>
              </li>

              <li>
                <Link
                  to="/login"
                  className="text-white/45 hover:text-[#3ECF8E] transition-all duration-300"
                >
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white text-base font-semibold mb-5">
              Resources
            </h3>

            <ul className="space-y-3 text-sm">
              <li className="text-white/45 hover:text-[#3ECF8E] transition-colors cursor-pointer">
                Documentation
              </li>

              <li className="text-white/45 hover:text-[#3ECF8E] transition-colors cursor-pointer">
                Research Paper
              </li>

              <li className="text-white/45 hover:text-[#3ECF8E] transition-colors cursor-pointer">
                Dataset
              </li>

              <li className="text-white/45 hover:text-[#3ECF8E] transition-colors cursor-pointer">
                API Guide
              </li>
            </ul>
          </div>

          {/* Project */}
          <div>
            <h3 className="text-white text-base font-semibold mb-5">Project</h3>

            <ul className="space-y-3 text-sm text-white/45">
              <li>Final Year Project</li>
              <li>Islamia University Bahawalpur</li>
              <li>Department of Computer Science</li>
              <li>2026</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-white/35 text-sm">
            © 2026 TruthLens. Built for research purposes.
          </p>

          <div className="flex items-center gap-5">
            <a
              href="https://github.com/farhanali-cell"
              target="_blank"
              rel="noopener noreferrer"
              className="group w-11 h-11 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-[#3ECF8E] hover:border-[#3ECF8E] transition-all duration-300 hover:scale-110"
              aria-label="GitHub"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white/70 group-hover:text-[#0B0E14] transition-colors"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.207 11.387.6.113.793-.26.793-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.754-1.333-1.754-1.089-.744.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.303-5.466-1.332-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.5 11.5 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.604-.014 2.896-.014 3.29 0 .32.192.694.801.576C20.566 21.795 24 17.298 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>

            <a
              href="https://www.linkedin.com/in/farhan-ali-59a863373"
              target="_blank"
              rel="noopener noreferrer"
              className="group w-11 h-11 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-[#3ECF8E] hover:border-[#3ECF8E] transition-all duration-300 hover:scale-110"
              aria-label="LinkedIn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white/70 group-hover:text-[#0B0E14] transition-colors"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>

            <a
              href="mailto:farhan314567@gmail.com"
              className="group w-11 h-11 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-[#3ECF8E] hover:border-[#3ECF8E] transition-all duration-300 hover:scale-110"
              aria-label="Email"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white/70 group-hover:text-[#0B0E14] transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.75}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </a>

            <span className="text-xs text-white/30">
              Open Source • AI • NLP
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
