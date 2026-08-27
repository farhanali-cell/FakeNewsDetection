import { useEffect, useState } from "react";
import { RevealSection } from "./Shared";

// Real / Fake / Uncertain examples so all three verdict states are shown.
const DEMO_EXAMPLES = [
  {
    words: [
      "Scientists",
      "confirm",
      "SECRET",
      "miracle",
      "cure",
      "discovery",
      "shocks",
      "entire",
      "medical",
      "community",
      "overnight",
    ],
    flagged: [2, 3, 6], // indices of suspicious words
    verdict: "FAKE",
    confidence: 91.2,
    color: "#E8935B",
  },
  {
    words: [
      "Central",
      "bank",
      "raises",
      "interest",
      "rates",
      "by",
      "quarter",
      "point",
      "amid",
      "inflation",
      "concerns",
    ],
    flagged: [],
    verdict: "REAL",
    confidence: 97.4,
    color: "#3ECF8E",
  },
  {
    words: ["Local", "team", "wins", "match", "on", "Sunday"],
    flagged: [],
    verdict: "UNCERTAIN",
    confidence: 58.0,
    color: "#8B93A6",
    note: "Text too short for a confident verdict",
  },
];

function LiveScanDemo() {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [revealedCount, setRevealedCount] = useState(0);
  const [showVerdict, setShowVerdict] = useState(false);

  const example = DEMO_EXAMPLES[exampleIndex];

  useEffect(() => {
    setRevealedCount(0);
    setShowVerdict(false);

    let i = 0;
    const wordTimer = setInterval(() => {
      i += 1;
      setRevealedCount(i);
      if (i >= example.words.length) {
        clearInterval(wordTimer);
        setTimeout(() => setShowVerdict(true), 300);
      }
    }, 220);

    return () => clearInterval(wordTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exampleIndex]);

  useEffect(() => {
    if (!showVerdict) return;
    const next = setTimeout(() => {
      setExampleIndex((idx) => (idx + 1) % DEMO_EXAMPLES.length);
    }, 2200);
    return () => clearTimeout(next);
  }, [showVerdict]);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#10141D] p-6 sm:p-8 shadow-2xl shadow-black/40">
      {/* Window chrome + label — wraps on narrow screens instead of overlapping */}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 mb-6">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-white/15 shrink-0" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/15 shrink-0" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/15 shrink-0" />
          <span className="ml-2 text-xs text-white/40 font-mono truncate">
            analyzing_input.txt
          </span>
        </div>
        <span className="text-[11px] uppercase tracking-wider text-[#3ECF8E]/80 font-medium whitespace-nowrap">
          Live model preview
        </span>
      </div>

      {/* Headline being scanned */}
      <div className="min-h-21 sm:min-h-19 flex flex-wrap content-start gap-x-2 gap-y-1 font-mono text-base sm:text-lg leading-relaxed mb-6">
        {example.words.map((word, i) => {
          const isRevealed = i < revealedCount;
          const isFlagged = example.flagged.includes(i);
          return (
            <span
              key={i}
              className="transition-all duration-300"
              style={{
                color: !isRevealed
                  ? "rgba(232,234,237,0.15)"
                  : isFlagged
                    ? example.color
                    : "rgba(232,234,237,0.85)",
                fontWeight: isRevealed && isFlagged ? 600 : 500,
                textShadow:
                  isRevealed && isFlagged
                    ? `0 0 16px ${example.color}55`
                    : "none",
              }}
            >
              {word}
            </span>
          );
        })}
      </div>

      {/* Progress + verdict */}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-white/8 pt-5">
        <div className="flex items-center gap-2.5">
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden w-28 sm:w-32">
            <div
              className="h-full bg-[#3ECF8E] transition-all duration-200 ease-linear"
              style={{
                width: `${(revealedCount / example.words.length) * 100}%`,
              }}
            />
          </div>
          <span className="text-xs text-white/35 font-mono">
            {Math.round((revealedCount / example.words.length) * 100)}%
          </span>
        </div>

        <div
          className={`flex items-center gap-2 transition-all duration-500 ${
            showVerdict
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-2"
          }`}
        >
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: example.color }}
          />
          <span
            className="text-sm font-semibold tracking-wide"
            style={{ color: example.color }}
          >
            {example.verdict}
            <span className="text-white/40 font-normal">
              {" "}
              — {example.confidence}% confidence
            </span>
          </span>
        </div>
      </div>

      <p
        className={`text-xs text-white/40 mt-3 text-right transition-opacity duration-500 min-h-4 ${
          showVerdict && example.note ? "opacity-100" : "opacity-0"
        }`}
      >
        {example.note}
      </p>
    </div>
  );
}

export default function LiveDemoSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20 border-t border-white/5">
      <RevealSection className="text-center mb-12">
        <p className="text-[#3ECF8E] text-xs font-medium tracking-widest uppercase mb-3">
          See it in action
        </p>
        <h2
          className="text-3xl sm:text-4xl font-medium max-w-lg mx-auto"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Same model, three real outcomes.
        </h2>
      </RevealSection>

      <RevealSection delay={120} className="relative max-w-2xl mx-auto">
        <LiveScanDemo />
      </RevealSection>
    </section>
  );
}
