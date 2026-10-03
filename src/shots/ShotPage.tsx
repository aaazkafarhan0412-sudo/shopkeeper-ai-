import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { StaticModeContext } from "../lib/static";
import { ToastProvider } from "../components/Toast";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Problem from "../components/Problem";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import Dashboard from "../components/Dashboard";
import CustomerProfile from "../components/CustomerProfile";
import WhatsAppSection from "../components/WhatsAppSection";
import Trust from "../components/Trust";
import FAQ from "../components/FAQ";
import FinalCTA from "../components/FinalCTA";
import Footer from "../components/Footer";
import AppScreen from "../components/mocks/AppScreen";
import { CustomerScreen, EntryScreen, ReminderScreen } from "../components/mocks/MobileScreens";
import { Page } from "../App";
import { getShot } from "./registry";
import { ShotHooksContext, type ShotHooks } from "./context";
import { captureElement, getEmbeddedFontCSS, loadFonts, safeScale, sleep, waitForImages, type ShotApi } from "./capture";
import {
  CoverBoard,
  DashboardBoard,
  DesignSystemBoard,
  MobileAppBoard,
  ProfileBoard,
  ResponsiveBoard,
} from "./boards";

/* ---------- wrappers ---------- */
function Site({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("page-bg", className)}>{children}</div>;
}

function Device({ children }: { children: ReactNode }) {
  return <div className="flex h-full w-full items-center justify-center">{children}</div>;
}

function SiteHero() {
  return (
    <Site>
      <Navbar variant="static" />
      <Hero />
    </Site>
  );
}

function DashboardDemo() {
  const [selected, setSelected] = useState("ahmed");
  return <Dashboard selectedId={selected} onSelect={setSelected} />;
}

const PHONE = { frameWidth: "w-[300px]", screenClassName: "h-[610px]" };

const VIEWS: Record<string, () => ReactNode> = {
  "board-cover": () => <CoverBoard />,
  "board-mobile": () => <MobileAppBoard />,
  "board-dashboard": () => <DashboardBoard />,
  "board-profile": () => <ProfileBoard />,
  "board-design": () => <DesignSystemBoard />,
  "board-responsive": () => <ResponsiveBoard />,

  "device-home": () => (
    <Device>
      <AppScreen {...PHONE} />
    </Device>
  ),
  "device-customer": () => (
    <Device>
      <CustomerScreen />
    </Device>
  ),
  "device-entry": () => (
    <Device>
      <EntryScreen />
    </Device>
  ),
  "device-reminder": () => (
    <Device>
      <ReminderScreen />
    </Device>
  ),

  "web-hero": () => <SiteHero />,
  "web-problem": () => (
    <Site>
      <Problem />
    </Site>
  ),
  "web-features": () => (
    <Site>
      <Features />
    </Site>
  ),
  "web-how": () => (
    <Site>
      <HowItWorks />
    </Site>
  ),
  "web-dashboard": () => (
    <Site>
      <DashboardDemo />
    </Site>
  ),
  "web-profile": () => (
    <Site>
      <CustomerProfile customerId="ahmed" />
    </Site>
  ),
  "web-whatsapp": () => (
    <Site>
      <WhatsAppSection />
    </Site>
  ),
  "web-trust": () => (
    <Site>
      <Trust />
    </Site>
  ),
  "web-faq": () => (
    <Site>
      <FAQ />
    </Site>
  ),
  "web-cta": () => (
    <Site>
      <FinalCTA />
      <Footer />
    </Site>
  ),
  "web-full": () => <Page shot />,
  "d-hero": () => <SiteHero />,

  "m-hero": () => <SiteHero />,
  "m-features": () => (
    <Site>
      <Navbar variant="static" />
      <Features />
    </Site>
  ),
  "m-profile": () => (
    <Site>
      <Navbar variant="static" />
      <div className="px-4 pt-[92px] pb-10">
        <CustomerProfile customerId="ahmed" bare />
      </div>
    </Site>
  ),
  "m-full": () => <Page shot />,
};

/**
 * Renders a single screen at its exact export size and exposes `window.__shot`
 * so the media kit (or a nested board) can capture it as an HD image.
 */
export default function ShotPage({ id, nonce }: { id: string; nonce: string }) {
  const def = getShot(id);
  const View = def ? VIEWS[def.id] : undefined;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const hooksRef = useRef(new Set<ShotHooks>());
  const warmedRef = useRef(false);

  const registry = useMemo(
    () => ({
      register: (hooks: ShotHooks) => {
        hooksRef.current.add(hooks);
        return () => {
          hooksRef.current.delete(hooks);
        };
      },
    }),
    [],
  );

  useEffect(() => {
    if (!def) return;
    document.title = `${def.title} · Shopkeeper AI screens`;

    const root = () => {
      const el = rootRef.current;
      if (!el) throw new Error("Screen is not mounted");
      return el;
    };

    const measure = () => ({
      width: def.width,
      height: def.height === "auto" ? Math.ceil(root().getBoundingClientRect().height) : def.height,
    });

    const ready = async () => {
      await loadFonts();
      await getEmbeddedFontCSS();
      for (const hooks of Array.from(hooksRef.current)) await hooks.ready?.();
      await waitForImages(root());
      await sleep(250);
    };

    const capture = async (requested: number, type = "image/png") => {
      await ready();
      for (const hooks of Array.from(hooksRef.current)) await hooks.prepare?.(requested);
      const el = root();
      await waitForImages(el);
      await sleep(60);
      const { width, height } = measure();
      const scale = safeScale(width, height, requested);
      if (!warmedRef.current) {
        // First render primes the browser's font + image decoding so the real export is complete.
        await captureElement(el, { width, height, scale: Math.min(0.3, scale) });
        warmedRef.current = true;
        await sleep(120);
      }
      const blob = await captureElement(el, { width, height, scale, type });
      return { blob, width: Math.round(width * scale), height: Math.round(height * scale), scale };
    };

    const api: ShotApi = { id: def.id, nonce, ready, measure, capture };
    window.__shot = api;
    return () => {
      if (window.__shot === api) delete window.__shot;
    };
  }, [def, nonce]);

  if (!def || !View) {
    return (
      <div className="p-10 text-ink">
        <p className="font-display text-xl font-bold">Unknown screen “{id}”</p>
        <a className="mt-3 inline-block font-semibold text-olive underline" href="?screens">
          Open the media kit
        </a>
      </div>
    );
  }

  return (
    <StaticModeContext.Provider value={true}>
      <ShotHooksContext.Provider value={registry}>
        <ToastProvider>
          <div
            id="shot-root"
            ref={rootRef}
            className={cn("relative", def.height !== "auto" && "overflow-hidden")}
            style={{ width: def.width, height: def.height === "auto" ? undefined : def.height }}
          >
            <View />
          </div>
        </ToastProvider>
      </ShotHooksContext.Provider>
    </StaticModeContext.Provider>
  );
}
