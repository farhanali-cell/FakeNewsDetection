import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#E8EAED] flex items-center justify-center px-6 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#E8EAED 1px, transparent 1px), linear-gradient(90deg, #E8EAED 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, black, transparent)',
        }}
      />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#3ECF8E]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-sm animate-[fadeUp_0.5s_ease-out]">
        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        <Link to="/" className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-9 h-9 rounded-lg bg-[#3ECF8E] flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0B0E14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="font-semibold text-lg tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            TruthLens
          </span>
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Reset your password
          </h1>
          <p className="text-white/40 text-sm">We'll email you a link to get back in</p>
        </div>

        <div className="border border-white/8 bg-white/2 rounded-2xl p-7">
          {sent ? (
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#3ECF8E]/10 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#3ECF8E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm text-white/70 mb-1">Check your inbox</p>
              <p className="text-xs text-white/40">
                If an account exists for <span className="text-white/60">{email}</span>, a reset link is on its way.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-[#E8935B]/10 border border-[#E8935B]/25 text-[#E8935B] text-sm rounded-lg px-4 py-3">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-white/50 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="w-full bg-black/30 border border-white/10 text-[#E8EAED] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#3ECF8E] focus:border-[#3ECF8E] transition-colors placeholder-white/25"
                  placeholder="you@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#3ECF8E] text-[#0B0E14] font-medium rounded-lg px-4 py-2.5 text-sm hover:bg-[#5adba3] transition-colors disabled:opacity-50 mt-2"
              >
                {loading ? 'Sending...' : 'Send reset link'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-white/40 text-sm mt-6">
          Remember your password?{' '}
          <Link to="/login" className="text-[#3ECF8E] hover:text-[#5adba3] font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}