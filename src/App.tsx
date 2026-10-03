import { useEffect, useState } from "react";
import { cn } from "./utils/cn";
import { ToastProvider } from "./components/Toast";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Problem from "./components/Problem";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Dashboard from "./components/Dashboard";
import CustomerProfile from "./components/CustomerProfile";
import WhatsAppSection from "./components/WhatsAppSection";
import Trust from "./components/Trust";
import FAQ from "./components/FAQ";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";
import { customers } from "./lib/data";
import { ArrowDown } from "./components/icons";

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 1400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={cn(
        "fixed bottom-4 left-4 z-[85] flex h-11 w-11 items-center justify-center rounded-full border border-olive/25 bg-paper text-olive shadow-[var(--shadow-lift)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-olive hover:text-ivory sm:bottom-6 sm:left-6",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <ArrowDown className="h-4 w-4 rotate-180" strokeWidth={2} />
    </button>
  );
}

/** The full landing page. `shot` renders it for HD screenshots (static navbar, no floating UI). */
export function Page({ shot = false }: { shot?: boolean }) {
  const [selectedId, setSelectedId] = useState(customers[0].id);
  const selected = customers.find((c) => c.id === selectedId) ?? customers[0];

  return (
    <div className="page-bg min-h-screen overflow-x-clip">
      {!shot && (
        <a
          href="#home"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-olive focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ivory"
        >
          Skip to content
        </a>
      )}

      <Navbar variant={shot ? "static" : "fixed"} />

      <main>
        <Hero />
        <Problem />
        <Features />
        <HowItWorks />
        <Dashboard selectedId={selectedId} onSelect={setSelectedId} />
        <CustomerProfile customerId={selectedId} />
        <WhatsAppSection
          firstName={selected.name.split(" ")[0]}
          fullName={selected.name}
          amount={selected.balance > 0 ? selected.balance : 4500}
        />
        <Trust />
        <FAQ />
        <FinalCTA />
      </main>

      <Footer />
      {!shot && <BackToTop />}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <Page />
    </ToastProvider>
  );
}
