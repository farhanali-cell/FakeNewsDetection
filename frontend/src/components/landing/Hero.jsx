import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

// ===== Hero robot mascot =====
// A friendly SVG robot that idles with a gentle float, blinks
// periodically, and turns its eyes to follow the cursor.
function HeroRobot() {
  const wrapRef = useRef(null);
  const [pupil, setPupil] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);

  // Cursor tracking — eyes subtly lean toward the pointer.
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    function onMove(e) {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      const clamp = (v, m) => Math.max(-m, Math.min(m, v));

      const nextX = clamp(dx * 6, 4.5);
      const nextY = clamp(dy * 6, 3.5);
      if (!Number.isFinite(nextX) || !Number.isFinite(nextY)) return;

      setPupil({ x: nextX, y: nextY });
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Periodic blink.
  useEffect(() => {
    let timeout;
    function scheduleBlink() {
      timeout = setTimeout(
        () => {
          setBlink(true);
          setTimeout(() => setBlink(false), 160);
          scheduleBlink();
        },
        2600 + Math.random() * 2400,
      );
    }
    scheduleBlink();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div ref={wrapRef} className="relative flex items-center justify-center">
      {/* Scoped keyframes for the robot's idle float + status chip */}
      <style>{`
        @keyframes robotFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes robotChip {
          0%, 100% { transform: translateY(0px); opacity: 0.9; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
        .animate-robot-float {
          animation: robotFloat 4.5s ease-in-out infinite;
        }
        .animate-robot-chip {
          animation: robotChip 3.5s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-robot-float, .animate-robot-chip {
            animation: none;
          }
        }
      `}</style>

      {/* Ambient glow behind the robot */}
      <div className="absolute w-64 h-64 bg-[#3ECF8E]/12 rounded-full blur-[70px]" />

      <div className="relative animate-robot-float">
        <svg
          width="260"
          height="260"
          viewBox="0 0 260 260"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Antenna */}
          <line
            x1="130"
            y1="42"
            x2="130"
            y2="20"
            stroke="#3ECF8E"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="130" cy="16" r="6" fill="#3ECF8E">
            <animate
              attributeName="opacity"
              values="1;0.4;1"
              dur="1.8s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Head */}
          <rect
            x="55"
            y="45"
            width="150"
            height="120"
            rx="34"
            fill="#141922"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1.5"
          />
          <rect
            x="55"
            y="45"
            width="150"
            height="120"
            rx="34"
            fill="url(#robotSheen)"
          />

          {/* Eye screen panel */}
          <rect
            x="76"
            y="80"
            width="108"
            height="56"
            rx="18"
            fill="#0B0E14"
            stroke="rgba(62,207,142,0.25)"
            strokeWidth="1"
          />

          {/* Eyes (blink via scaleY) */}
          <g
            style={{
              transformOrigin: "104px 108px",
              transform: blink ? "scaleY(0.08)" : "scaleY(1)",
              transition: "transform 90ms ease",
            }}
          >
            <circle
              cx={104 + pupil.x}
              cy={108 + pupil.y}
              r="12"
              fill="#3ECF8E"
            />
          </g>
          <g
            style={{
              transformOrigin: "156px 108px",
              transform: blink ? "scaleY(0.08)" : "scaleY(1)",
              transition: "transform 90ms ease",
            }}
          >
            <circle
              cx={156 + pupil.x}
              cy={108 + pupil.y}
              r="12"
              fill="#3ECF8E"
            />
          </g>

          {/* Cheek accents */}
          <circle cx="68" cy="120" r="5" fill="#E8935B" opacity="0.55" />
          <circle cx="192" cy="120" r="5" fill="#E8935B" opacity="0.55" />

          {/* Body */}
          <rect
            x="75"
            y="172"
            width="110"
            height="70"
            rx="22"
            fill="#141922"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1.5"
          />
          {/* Verified checkmark on chest */}
          <circle
            cx="130"
            cy="207"
            r="18"
            fill="none"
            stroke="#3ECF8E"
            strokeWidth="2.5"
            opacity="0.85"
          />
          <path
            d="M122 207l6 6 12-13"
            stroke="#3ECF8E"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Arms */}
          <rect
            x="46"
            y="185"
            width="14"
            height="40"
            rx="7"
            fill="#141922"
            stroke="rgba(255,255,255,0.08)"
          />
          <rect
            x="200"
            y="185"
            width="14"
            height="40"
            rx="7"
            fill="#141922"
            stroke="rgba(255,255,255,0.08)"
          />

          <defs>
            <linearGradient
              id="robotSheen"
              x1="55"
              y1="45"
              x2="205"
              y2="165"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.04" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="100%" stopColor="#3ECF8E" stopOpacity="0.03" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Speech-bubble style status chip */}
      <div className="absolute -right-2 top-4 bg-[#141922] border border-white/10 rounded-full px-3 py-1.5 text-[11px] text-white/60 shadow-lg animate-robot-chip">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#3ECF8E] mr-1.5 align-middle" />
        Scanning for patterns
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <header id="top" className="relative pt-40 pb-24 px-6 overflow-hidden">
      {/* Soft ambient glow — no distracting animation, just depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-125 bg-[#3ECF8E]/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: text content */}
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 border border-white/10 rounded-full px-3.5 py-1.5 mb-8 text-xs text-white/60 bg-[#0B0E14]/60 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3ECF8E]" />
            Trained on 44,000+ verified news articles
          </div>

          <h1
            className="text-[2.75rem] sm:text-6xl font-medium leading-[1.05] tracking-tight mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Read between
            <br />
            the headlines.
          </h1>

          <p className="text-white/50 text-lg max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed">
            Paste any article. TruthLens runs it through a trained detection
            model and shows you exactly which words gave it away.
          </p>

          <div className="flex items-center justify-center lg:justify-start gap-3">
            <Link
              to="/register"
              className="bg-[#3ECF8E] text-[#0B0E14] font-medium rounded-lg px-6 py-3 text-sm hover:bg-[#5adba3] transition-colors"
            >
              Analyze an article
            </Link>
            <Link
              to="/login"
              className="text-white/70 hover:text-white font-medium px-6 py-3 rounded-lg border border-white/10 hover:border-white/25 transition-colors text-sm"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Right: animated robot mascot */}
        <div className="hidden lg:flex justify-center">
          <HeroRobot />
        </div>
      </div>
    </header>
  );
}
