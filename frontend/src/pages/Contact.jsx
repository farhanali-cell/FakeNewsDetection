import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

/* ---------------- Navbar ---------------- */


/* ---------------- Footer ---------------- */


/* ---------------- Info card ---------------- */
function InfoCard({ icon, title, value, delay = 0 }) {
  return (
    <div
      className="border border-white/8 bg-white/2 rounded-2xl p-5 flex items-start gap-4 hover:border-white/20 transition-all duration-300 animate-[fadeUp_0.5s_ease-out_both]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-10 h-10 rounded-lg bg-[#3ECF8E]/10 flex items-center justify-center shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#3ECF8E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {icon}
        </svg>
      </div>
      <div className="min-w-0">
        <p className="text-white/40 text-xs mb-0.5">{title}</p>
        <p className="text-white text-sm font-medium truncate">{value}</p>
      </div>
    </div>
  );
}

/* ---------------- Main Contact page ---------------- */
export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!form.email.trim()) {
      next.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid email address.";
    }
    if (!form.subject.trim()) next.subject = "Subject is required.";
    if (!form.message.trim()) {
      next.message = "Message is required.";
    } else if (form.message.trim().length < 10) {
      next.message = "Message should be at least 10 characters.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setStatus("loading");
    try {
      await api.post("/contact/", form);
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
      setServerError(
        err.response?.data?.email?.[0] ||
          "Something went wrong. Please try again in a moment."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#E8EAED]">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <Navbar />

      <main className="px-5 sm:px-8 py-14 sm:py-20 max-w-6xl mx-auto">
        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto mb-14 animate-[fadeUp_0.6s_ease-out_both]">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-medium tracking-wide uppercase bg-[#3ECF8E]/10 text-[#3ECF8E] mb-4">
            Get in touch
          </span>
          <h1
            className="text-3xl sm:text-4xl font-semibold text-white mb-4 tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            We'd love to hear from you
          </h1>
          <p className="text-white/50 text-sm sm:text-base leading-relaxed">
            Questions, feedback, or found something that doesn't look right? Send us a
            message and we'll get back to you as soon as we can.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Info column */}
          <div className="lg:col-span-2 space-y-4 min-w-0">
            <InfoCard
              delay={0}
              title="Email us"
              value="farhan314567@gmail.com"
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />}
            />
            <InfoCard
              delay={80}
              title="Response time"
              value="Usually within 24–48 hours"
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
            />
            <InfoCard
              delay={160}
              title="Project"
              value="Fake News Detection System — Final Year Project"
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
            />
          </div>

          {/* Form column */}
          <div
            className="lg:col-span-3 border border-white/8 bg-white/2 rounded-2xl p-6 sm:p-8 min-w-0 animate-[fadeUp_0.5s_ease-out_both]"
            style={{ animationDelay: "120ms" }}
          >
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center text-center py-10 animate-[fadeUp_0.4s_ease-out_both]">
                <div className="w-14 h-14 rounded-full bg-[#3ECF8E]/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#3ECF8E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-white font-medium text-lg mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Message sent
                </h2>
                <p className="text-white/40 text-sm mb-6">
                  Thanks for reaching out — we'll get back to you soon.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="text-sm text-[#3ECF8E] hover:text-[#5adba3] transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className={`w-full bg-black/30 border text-[#E8EAED] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 transition-colors placeholder-white/25 ${
                        errors.name
                          ? "border-[#E8935B]/60 focus:ring-[#E8935B] focus:border-[#E8935B]"
                          : "border-white/10 focus:ring-[#3ECF8E] focus:border-[#3ECF8E]"
                      }`}
                    />
                    {errors.name && <p className="text-[#E8935B] text-xs mt-1.5">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={`w-full bg-black/30 border text-[#E8EAED] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 transition-colors placeholder-white/25 ${
                        errors.email
                          ? "border-[#E8935B]/60 focus:ring-[#E8935B] focus:border-[#E8935B]"
                          : "border-white/10 focus:ring-[#3ECF8E] focus:border-[#3ECF8E]"
                      }`}
                    />
                    {errors.email && <p className="text-[#E8935B] text-xs mt-1.5">{errors.email}</p>}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs text-white/50 mb-1.5">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="What's this about?"
                    className={`w-full bg-black/30 border text-[#E8EAED] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 transition-colors placeholder-white/25 ${
                      errors.subject
                        ? "border-[#E8935B]/60 focus:ring-[#E8935B] focus:border-[#E8935B]"
                        : "border-white/10 focus:ring-[#3ECF8E] focus:border-[#3ECF8E]"
                    }`}
                  />
                  {errors.subject && <p className="text-[#E8935B] text-xs mt-1.5">{errors.subject}</p>}
                </div>

                <div className="mb-5">
                  <label className="block text-xs text-white/50 mb-1.5">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Tell us more..."
                    className={`w-full bg-black/30 border text-[#E8EAED] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-colors resize-none placeholder-white/25 ${
                      errors.message
                        ? "border-[#E8935B]/60 focus:ring-[#E8935B] focus:border-[#E8935B]"
                        : "border-white/10 focus:ring-[#3ECF8E] focus:border-[#3ECF8E]"
                    }`}
                  />
                  <div className="flex items-center justify-between mt-1.5">
                    {errors.message ? (
                      <p className="text-[#E8935B] text-xs">{errors.message}</p>
                    ) : (
                      <span />
                    )}
                    <span className="text-[11px] text-white/25">{form.message.length} characters</span>
                  </div>
                </div>

                {status === "error" && (
                  <div className="mb-4 bg-[#E8935B]/10 border border-[#E8935B]/25 text-[#E8935B] text-sm rounded-lg px-4 py-3">
                    {serverError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full sm:w-auto bg-[#3ECF8E] text-[#0B0E14] font-medium rounded-lg px-6 py-2.5 text-sm hover:bg-[#5adba3] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? "Sending..." : "Send message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}