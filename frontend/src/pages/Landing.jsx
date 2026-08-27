import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import WhatsAppFloat from "../components/common/WhatsAppFloat";
import Hero from "../components/landing/Hero";
import LiveDemoSection from "../components/landing/LiveDemoSection";
import HowItWorks from "../components/landing/HowItWorks";
import BilingualSection from "../components/landing/BilingualSection";
import Capabilities from "../components/landing/Capabilities";
import CTASection from "../components/landing/CTASection";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#E8EAED] font-sans selection:bg-[#3ECF8E]/30">
      {/* Scoped keyframe for the WhatsApp button's pulse ring */}
      
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
