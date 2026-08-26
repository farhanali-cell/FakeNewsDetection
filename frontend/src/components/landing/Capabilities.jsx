import { RevealSection } from "./Shared";

const FEATURES = [
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    ),
    title: "Instant analysis",
    body: "Results return in under a second, no queue, no waiting.",
  },
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
      />
    ),
    title: "Confidence scoring",
    body: "A percentage, not a guess — know exactly how sure the model is.",
  },
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    ),
    title: "Explainable results",
    body: "Every verdict comes with the specific words that drove the decision.",
  },
];

export default function Capabilities() {
  return (
    <section
      id="features"
      className="max-w-5xl mx-auto px-6 py-24 border-t border-white/5"
    >
      <RevealSection>
        <p className="text-[#3ECF8E] text-xs font-medium tracking-widest uppercase mb-3">
          Capabilities
        </p>
        <h2
          className="text-3xl sm:text-4xl font-medium mb-16 max-w-md"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Built to be checked, not just trusted.
        </h2>
      </RevealSection>

      <div className="grid sm:grid-cols-3 gap-5">
        {FEATURES.map((f, i) => (
          <RevealSection key={f.title} delay={i * 120}>
            <div className="group border border-white/8 rounded-2xl p-6 h-full hover:border-[#3ECF8E]/30 hover:-translate-y-1 transition-all duration-300 hover:bg-white/2">
              <div className="w-10 h-10 rounded-lg bg-white/5 group-hover:bg-[#3ECF8E]/10 flex items-center justify-center mb-5 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white/60 group-hover:text-[#3ECF8E] transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {f.icon}
                </svg>
              </div>
              <h3 className="font-medium mb-2">{f.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{f.body}</p>
            </div>
          </RevealSection>
        ))}
      </div>
    </section>
  );
}
