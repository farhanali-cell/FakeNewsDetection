import { Link } from "react-router-dom";
import { RevealSection } from "./Shared";

export default function CTASection() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20">
      <RevealSection>
        <div className="relative rounded-2xl border border-white/8 bg-linear-to-br from-white/3 to-transparent px-8 py-16 text-center overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#3ECF8E]/10 rounded-full blur-3xl" />
          <h2
            className="relative text-3xl sm:text-4xl font-medium mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Stop guessing. Start checking.
          </h2>
          <p className="relative text-white/50 mb-8">
            Free to try, no credit card required.
          </p>
          <Link
            to="/register"
            className="relative inline-block bg-[#3ECF8E] text-[#0B0E14] font-medium rounded-lg px-7 py-3 text-sm hover:bg-[#5adba3] transition-colors"
          >
            Create free account
          </Link>
        </div>
      </RevealSection>
    </section>
  );
}
