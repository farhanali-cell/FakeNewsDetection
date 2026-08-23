import { RevealSection } from "./shared";

export default function BilingualSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-24 border-t border-white/5">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: copy */}
        <RevealSection>
          <p className="text-[#3ECF8E] text-xs font-medium tracking-widest uppercase mb-3">
            Bilingual
          </p>
          <h2
            className="text-3xl sm:text-4xl font-medium mb-5 max-w-md"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Works in English and Urdu.
          </h2>
          <p className="text-white/50 leading-relaxed max-w-md mb-8">
            TruthLens runs two independently trained models — one for English,
            one for Urdu — so misinformation gets caught regardless of which
            language it's written in.
          </p>

          <div className="flex flex-col gap-3 max-w-sm">
            <div className="flex items-center gap-3 rounded-xl border border-white/8 px-4 py-3">
              <span className="w-2 h-2 rounded-full bg-[#3ECF8E]" />
              <span className="text-sm text-white/70">
                English detection model
              </span>
              <span className="ml-auto text-xs text-white/35 font-mono">
                96.5% accuracy
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/8 px-4 py-3">
              <span className="w-2 h-2 rounded-full bg-[#3ECF8E]" />
              <span className="text-sm text-white/70">
                Urdu detection model
              </span>
              <span className="ml-auto text-xs text-white/35 font-mono">
                Native script
              </span>
            </div>
          </div>
        </RevealSection>

        {/* Right: side-by-side language cards */}
        <RevealSection delay={150}>
          <div className="grid gap-4 mt-6">
            {/* English card */}
            <div className="rounded-2xl border border-white/10 bg-[#10141D] p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-white/35">
                  input · english
                </span>
                <span className="text-[10px] uppercase tracking-wider text-white/30 border border-white/10 rounded-full px-2 py-0.5">
                  EN
                </span>
              </div>
              <p className="text-white/75 text-sm leading-relaxed">
                Government announces new education policy for public schools.
              </p>
              <div className="mt-4 flex items-center gap-2 pt-3 border-t border-white/8">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3ECF8E] pt-1" />
                <span className="text-xs font-medium text-[#3ECF8E] pt-1">
                  REAL — 94.8% confidence
                </span>
              </div>
            </div>

            {/* Urdu card (RTL) */}
            <div className="rounded-2xl border border-white/10 bg-[#10141D] p-5 mt-2">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase tracking-wider text-white/30 border border-white/10 rounded-full px-2 py-0.5">
                  UR
                </span>
                <span className="text-xs font-mono text-white/35">
                  ان پٹ · اردو
                </span>
              </div>
              <p
                dir="rtl"
                className="text-white/75 text-sm leading-relaxed"
                style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}
              >
                سائنسدانوں نے ایک حیرت انگیز دریافت کا دعویٰ کیا ہے۔
              </p>
              <div className="mt-4 flex items-center gap-2 pt-3 border-t border-white/8 justify-end">
                <span className="text-xs font-medium text-[#E8935B]">
                  91.0% confidence — FAKE
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8935B]" />
              </div>
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}
