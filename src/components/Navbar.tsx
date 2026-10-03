import { useEffect, useState } from "react";
import { cn } from "../utils/cn";
import { useScrollSpy, useScrolled } from "../lib/hooks";
import { Button } from "./ui";
import { ArrowRight, Close, Logo, Menu, Phone } from "./icons";
import { useToast } from "./Toast";

const LINKS = [
  { id: "home", label: "Home" },
  { id: "features", label: "Features" },
  { id: "how-it-works", label: "How It Works" },
  { id: "shopkeepers", label: "For Shopkeepers" },
  { id: "faq", label: "FAQ" },
];

const IDS = LINKS.map((l) => l.id);

export default function Navbar({ variant = "fixed" }: { variant?: "fixed" | "static" }) {
  const notify = useToast();
  const scrolled = useScrolled(10);
  const active = useScrollSpy(IDS, 160);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={cn(variant === "fixed" ? "fixed" : "absolute", "inset-x-0 top-0 z-[80]")}>
      <div
        className={cn(
          "relative transition-all duration-300",
          scrolled ? "border-b border-line bg-ivory/88 backdrop-blur-xl" : "border-b border-transparent bg-transparent",
        )}
      >
        <nav className="mx-auto flex h-[68px] max-w-[1240px] items-center gap-6 px-5 sm:px-8" aria-label="Main">
          <a
            href="#home"
            className="group flex shrink-0 items-center gap-2.5 rounded-md"
            aria-label="Shopkeeper AI — home"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-olive text-ivory shadow-[0_8px_18px_-12px_rgba(54,61,43,1)] transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-[1.04]">
              <Logo className="h-[22px] w-[22px]" />
            </span>
            <span className="font-display text-[16.5px] leading-none font-bold tracking-[-0.015em] text-ink">
              SHOPKEEPER<span className="ml-1.5 text-olive">AI</span>
            </span>
          </a>

          <ul className="ml-2 hidden items-center gap-7 lg:flex">
            {LINKS.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  data-active={active === l.id}
                  className={cn(
                    "link-underline py-1 text-[14.5px] font-medium transition-colors duration-200",
                    active === l.id ? "text-ink" : "text-muted hover:text-ink",
                  )}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="ml-auto hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() =>
                notify({
                  kind: "ok",
                  title: "Log in with your mobile number",
                  body: "We'll send a one-time code by SMS — no password to remember.",
                })
              }
              className="inline-flex h-10 items-center gap-2 rounded-md px-3.5 text-[14.5px] font-semibold text-ink/75 transition-colors duration-200 hover:bg-olive/8 hover:text-ink"
            >
              <Phone className="h-4 w-4 text-olive" />
              Log In
            </button>
            <Button href="#get-started" size="sm" className="h-10 px-[18px]">
              Get Started
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="ml-auto flex h-10 w-10 items-center justify-center rounded-md border border-line bg-paper text-ink transition-colors hover:border-olive/40 sm:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <Close className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        <div className="absolute inset-x-0 bottom-0 h-px bg-transparent">
          <div
            className="h-full bg-flame/70 transition-[width] duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* mobile sheet */}
      <div
        id="mobile-menu"
        className={cn(
          "overflow-hidden border-b border-line bg-ivory/97 backdrop-blur-xl transition-[max-height,opacity] duration-300 sm:hidden",
          open ? "max-h-[26rem] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <ul className="mx-auto max-w-[1240px] px-5 py-3">
          {LINKS.map((l, i) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-line/70 py-3.5 font-display text-[17px] font-semibold text-ink last:border-0"
              >
                {l.label}
                <span className="num text-[12px] text-muted">0{i + 1}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="mx-auto flex max-w-[1240px] gap-2.5 px-5 pt-2 pb-6">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              setOpen(false);
              notify({
                kind: "ok",
                title: "Log in with your mobile number",
                body: "We'll send a one-time code by SMS — no password to remember.",
              });
            }}
          >
            Log In
          </Button>
          <Button href="#get-started" className="flex-1" onClick={() => setOpen(false)}>
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
}
