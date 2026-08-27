import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import WhatsAppFloat from "../components/common/WhatsAppFloat";
import Hero from "../components/landing/Hero";
import LiveDemoSection from "../components/landing/LiveDemoSection";
import HowItWorks from "../components/landing/HowItWorks";
import BilingualSection from "../components/landing/BilingualSection";
import Capabilities from "../components/landing/Capabilities";
import CTASection from "../components/landing/CTASection";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#E8EAED] font-sans selection:bg-[#3ECF8E]/30">
      {/* Scoped keyframe for the WhatsApp button's pulse ring */}
      <style>{`
        @keyframes whatsappPing {
          0% { transform: scale(1); opacity: 0.55; }
          75%, 100% { transform: scale(1.6); opacity: 0; }
        }
        .animate-whatsapp-ping {
          animation: whatsappPing 2.2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-whatsapp-ping { animation: none; }
        }
      `}</style>

      <Navbar />
      <Hero />
      <LiveDemoSection />
      <HowItWorks />
      <BilingualSection />
      <Capabilities />
      <CTASection />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
