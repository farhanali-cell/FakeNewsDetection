import { RevealSection } from "./Shared";

const STEPS = [
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    ),
    title: "Paste the text",
    body: "Drop in a headline, a paragraph, or a full article — no link required.",
  },
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    ),
    title: "Model runs inference",
    body: "A trained classifier scores the language patterns against thousands of known examples.",
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
    title: "See the reasoning",
    body: "Get a verdict — Real, Fake, or Uncertain — with a confidence score and the exact words that influenced it.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how"
      className="max-w-5xl mx-auto px-6 py-24 border-t border-white/5"
    >
      <RevealSection>
        <p className="text-[#3ECF8E] text-xs font-medium tracking-widest uppercase mb-3">
          Process
        </p>
        <h2
          className="text-3xl sm:text-4xl font-medium mb-16 max-w-md"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          From paste to verdict in three steps.
        </h2>
      </RevealSection>

      <div className="relative grid sm:grid-cols-3 gap-5">
        {/* Connecting line behind the cards (desktop only) */}
        <div className="hidden sm:block absolute top-13 left-[16.5%] right-[16.5%] h-px bg-linear-to-r from-white/10 via-white/15 to-white/10" />

        {STEPS.map((step, i) => (
          <RevealSection key={step.title} delay={i * 120}>
            <div className="group relative bg-[#0B0E14] border border-white/8 rounded-2xl p-8 h-full hover:border-[#3ECF8E]/30 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="w-11 h-11 rounded-xl bg-white/5 group-hover:bg-[#3ECF8E]/10 flex items-center justify-center transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white/60 group-hover:text-[#3ECF8E] transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {step.icon}
                  </svg>
                </div>
                <span className="text-white/25 text-sm font-mono">
                  0{i + 1}
                </span>
              </div>
              <h3 className="font-medium text-lg mb-2">{step.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                {step.body}
              </p>
            </div>
          </RevealSection>
        ))}
      </div>
    </section>
  );
}
