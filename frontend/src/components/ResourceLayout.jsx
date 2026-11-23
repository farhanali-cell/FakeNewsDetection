import { Link } from "react-router-dom";
import Footer from "../components/common/Footer";

export function Section({ title, children }) {
  return (
    <section className="mb-12">
      <h2
        className="text-2xl font-bold text-white mb-4 tracking-tight"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {title}
      </h2>
      <div className="text-white/65 text-[15px] leading-7 space-y-4">
        {children}
      </div>
    </section>
  );
}

export function CodeBlock({ children }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 text-[13px] leading-6 text-[#3ECF8E]">
      <code>{children}</code>
    </pre>
  );
}

export default function ResourceLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-[#0B0E14] text-white flex flex-col">
      {/* Top bar */}
      <header className="border-b border-white/10 bg-[#0B0E14]/90 backdrop-blur">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="text-xl font-bold tracking-tight text-white hover:text-[#3ECF8E] transition-colors"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            TruthLens
          </Link>

          <Link
            to="/"
            className="text-sm text-white/55 hover:text-[#3ECF8E] transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-14">
        <div className="mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold tracking-tight text-white"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 text-white/55 text-lg leading-8">{subtitle}</p>
          )}
          <div className="mt-6 h-px w-24 bg-[#3ECF8E]/60" />
        </div>

        {children}
      </main>

      <Footer />
    </div>
  );
}
