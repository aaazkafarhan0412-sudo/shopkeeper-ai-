import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { pkr } from "../lib/data";
import { Button, Eyebrow, StatusChip } from "../components/ui";
import {
  ArrowRight,
  Bars,
  Bell,
  Book,
  Check,
  Clock,
  Logo,
  Receipt,
  Rupee,
  SearchIcon,
  Send,
  Shield,
  Sparkle,
  Trend,
  Users,
  WhatsApp,
} from "../components/icons";
import AppScreen from "../components/mocks/AppScreen";
import { PhoneFrame } from "../components/mocks/PhoneFrame";
import { CustomerScreen, ReminderScreen } from "../components/mocks/MobileScreens";
import Dashboard from "../components/Dashboard";
import CustomerProfile from "../components/CustomerProfile";
import WhatsAppSection from "../components/WhatsAppSection";
import { useShotHooks } from "./context";
import { blobToDataURL, toLocalBlob, waitForShotApi } from "./capture";

const PHONE = { frameWidth: "w-[300px]", screenClassName: "h-[610px]" };

/* ================================================================== */
/* Shared pieces                                                       */
/* ================================================================== */
function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <span
      className={cn(
        "flex items-center gap-2.5 font-display text-[14px] font-bold tracking-[-0.01em]",
        light ? "text-ivory/80" : "text-ink/80",
      )}
    >
      <span
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-md",
          light ? "bg-ivory/12 text-ivory" : "bg-olive text-ivory",
        )}
      >
        <Logo className="h-[17px] w-[17px]" />
      </span>
      SHOPKEEPER AI
    </span>
  );
}

function BoardFooter({ index, label }: { index: string; label: string }) {
  return (
    <div className="absolute inset-x-[120px] bottom-[52px] flex items-center justify-between text-[13px] font-medium text-muted">
      <BrandMark />
      <span className="flex items-center gap-3">
        {label}
        <span aria-hidden className="h-3 w-px bg-line" />
        <span className="num">{index} / 06</span>
      </span>
    </div>
  );
}

function BoardHeading({ eyebrow, title }: { eyebrow: string; title: ReactNode }) {
  return (
    <div className="absolute top-[84px] left-[120px]">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-4 font-display text-[46px] leading-[1.04] font-semibold tracking-[-0.035em] text-ink">{title}</h2>
    </div>
  );
}

function MiniLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("text-[11px] font-semibold tracking-[0.14em] text-muted uppercase", className)}>{children}</p>
  );
}

function Ticks() {
  return (
    <svg viewBox="0 0 20 12" className="h-2.5 w-4 text-tick" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <path d="M1 6.6l3.4 3.4L11 2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.6 9.9L9 11l6.6-8.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BrowserFrame({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-paper shadow-[var(--shadow-lift)]">
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-3 w-3 rounded-full bg-beige-deep" />
          <span className="h-3 w-3 rounded-full bg-sage" />
          <span className="h-3 w-3 rounded-full bg-olive/60" />
        </span>
        <span className="mx-auto flex items-center gap-2 rounded-md bg-ivory px-4 py-1.5 text-[12.5px] text-muted ring-1 ring-line">
          <svg viewBox="0 0 12 14" className="h-3 w-3 text-olive" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
            <rect x="1.4" y="5.6" width="9.2" height="7" rx="1.6" />
            <path d="M3.8 5.6V4a2.2 2.2 0 014.4 0v1.6" />
          </svg>
          shopkeeperai.pk
        </span>
        <span className="w-[52px]" aria-hidden />
      </div>
      {children}
    </div>
  );
}

function PaymentCard({ className }: { className?: string }) {
  return (
    <div className={cn("w-[264px] rounded-xl border border-line bg-paper p-4 shadow-[var(--shadow-lift)]", className)}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sage/30 text-olive-deep">
          <Check className="h-4 w-4" strokeWidth={2.6} />
        </span>
        <div className="min-w-0">
          <p className="font-display text-[15px] leading-tight font-bold text-ink">Payment received</p>
          <p className="mt-0.5 truncate text-[12.5px] text-muted">Bilal Ahmed · Cash</p>
        </div>
        <span className="num ml-auto shrink-0 text-[14px] font-semibold text-olive">{pkr(3000)}</span>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-line-soft pt-2.5 text-[12px]">
        <span className="text-muted">Balance now</span>
        <span className="font-semibold text-olive">Rs. 0 · Cleared</span>
      </div>
    </div>
  );
}

function ReminderCard({ className }: { className?: string }) {
  return (
    <div className={cn("w-[304px] rounded-xl border border-line bg-paper p-4 shadow-[var(--shadow-lift)]", className)}>
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#128C7E]/12 text-[#128C7E]">
          <WhatsApp className="h-4 w-4" />
        </span>
        <p className="font-display text-[14px] font-bold text-ink">WhatsApp reminder</p>
        <span className="ml-auto text-[11.5px] font-semibold text-muted">9:41 am</span>
      </div>
      <p className="mt-3 rounded-lg rounded-tl-none bg-sage/22 px-3 py-2.5 text-[13.5px] leading-snug text-ink/85 ring-1 ring-olive/10">
        Assalam-o-Alaikum Ahmed, your current balance is {pkr(4500)}. Thank you.
      </p>
      <div className="mt-2 flex items-center justify-end gap-1 text-[11px] text-muted">
        Delivered <Ticks />
      </div>
    </div>
  );
}

function ReceivablesCard({ className }: { className?: string }) {
  return (
    <div className={cn("w-[232px] rounded-xl border border-line bg-paper p-4 shadow-[var(--shadow-lift)]", className)}>
      <p className="text-[11px] font-semibold tracking-[0.12em] text-muted uppercase">Total receivables</p>
      <p className="num mt-2 font-display text-[28px] leading-none font-extrabold tracking-[-0.035em] text-ink">
        {pkr(184500)}
      </p>
      <div className="mt-3 flex h-10 items-end gap-1.5">
        {[38, 56, 44, 72, 60, 88, 66].map((h, i) => (
          <span
            key={i}
            className={cn("flex-1 rounded-t-[3px]", i === 5 ? "bg-flame/80" : "bg-olive/70")}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <p className="mt-2 flex items-center gap-1.5 text-[11.5px] font-medium text-olive">
        <Trend className="h-3.5 w-3.5" strokeWidth={2} /> 36 customers owe you
      </p>
    </div>
  );
}

/* ================================================================== */
/* 01 · Cover                                                          */
/* ================================================================== */
export function CoverBoard() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-olive-deep">
      <span aria-hidden className="rules absolute inset-0 opacity-[0.12]" />
      <span aria-hidden className="absolute -top-48 -left-40 h-[560px] w-[560px] rounded-full bg-sage/15 blur-[110px]" />
      <span aria-hidden className="absolute -right-32 -bottom-48 h-[620px] w-[620px] rounded-full bg-flame/25 blur-[130px]" />
      <p aria-hidden className="urdu absolute right-[90px] bottom-[30px] text-[190px] leading-none text-ivory/[0.045]">
        کھاتہ
      </p>

      <div className="absolute top-[112px] left-[120px] w-[720px]">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-olive text-ivory ring-1 ring-ivory/15">
            <Logo className="h-7 w-7" />
          </span>
          <span className="font-display text-[22px] font-bold tracking-[-0.015em] text-ivory">
            SHOPKEEPER<span className="ml-2 text-sage">AI</span>
          </span>
        </div>

        <div className="mt-16">
          <Eyebrow tone="light">Product design case study · 2026</Eyebrow>
        </div>

        <h1 className="mt-6 font-display text-[104px] leading-[0.94] font-extrabold tracking-[-0.05em] text-ivory">
          Your Khata,
          <br />
          <span className="relative inline-block text-sage">
            Now Smarter.
            <svg
              viewBox="0 0 320 22"
              preserveAspectRatio="none"
              aria-hidden
              className="absolute -bottom-3 left-0 h-[18px] w-full text-flame"
            >
              <path
                d="M4 15c58-9 128-12 190-8 40 2.5 78 6 122 3"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        <p className="mt-11 max-w-[600px] text-[22px] leading-[1.55] text-ivory/75">
          A simple digital khata for Pakistani shopkeepers — customer credit, payments and WhatsApp reminders in one
          calm, trustworthy app.
        </p>

        <div className="mt-9 flex flex-wrap gap-2.5">
          {["Mobile app", "Web dashboard", "WhatsApp integration", "Design system"].map((t) => (
            <span
              key={t}
              className="rounded-full border border-ivory/20 bg-ivory/[0.06] px-4 py-2 text-[15px] font-medium text-ivory/85"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <dl className="absolute bottom-[92px] left-[120px] flex gap-14">
        {[
          ["Role", "Product & UI design"],
          ["Platform", "Android · Web"],
          ["Market", "Pakistan · Urdu + English"],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="text-[12px] font-semibold tracking-[0.16em] text-sage uppercase">{k}</dt>
            <dd className="mt-1.5 text-[16px] font-medium text-ivory/90">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="absolute top-[178px] left-[1036px]">
        <div style={{ transform: "rotate(2deg) scale(1.14)", transformOrigin: "50% 0" }}>
          <AppScreen {...PHONE} />
        </div>
      </div>
      <PaymentCard className="absolute top-[330px] left-[842px] -rotate-3" />
      <ReceivablesCard className="absolute top-[118px] left-[1302px] rotate-2" />
      <ReminderCard className="absolute top-[792px] left-[1186px] rotate-[1.5deg]" />
    </div>
  );
}

/* ================================================================== */
/* 02 · Mobile app                                                     */
/* ================================================================== */
export function MobileAppBoard() {
  const phones = [
    { label: "Khata home", node: <AppScreen {...PHONE} /> },
    { label: "Customer profile", node: <CustomerScreen /> },
    { label: "WhatsApp reminder", node: <ReminderScreen /> },
  ];

  return (
    <div className="relative h-full w-full overflow-hidden bg-ivory">
      <span
        aria-hidden
        className="absolute -top-56 left-1/2 h-[640px] w-[1180px] -translate-x-1/2 rounded-full bg-sage/28 blur-[120px]"
      />
      <span
        aria-hidden
        className="dot-grid absolute inset-x-0 bottom-0 h-[460px] opacity-50 [mask-image:linear-gradient(to_top,black,transparent)]"
      />

      <div className="absolute top-[72px] left-0 w-full text-center">
        <Eyebrow>Mobile app</Eyebrow>
        <h2 className="mt-4 font-display text-[52px] leading-[1.04] font-semibold tracking-[-0.035em] text-ink">
          A khata that fits in your pocket.
        </h2>
        <p className="mx-auto mt-4 max-w-[660px] text-[19px] leading-relaxed text-muted">
          Record udhaar in seconds, see every customer's hisaab and send a polite WhatsApp reminder — all from one
          phone.
        </p>
      </div>

      <div className="absolute top-[340px] left-0 flex w-full items-start justify-center gap-[96px]">
        {phones.map((p, i) => (
          <figure key={p.label} className={cn("flex flex-col items-center", i === 1 && "-mt-8")}>
            {p.node}
            <figcaption className="mt-7 flex items-center gap-2.5 text-[15px] font-semibold text-ink">
              <span className="num text-[13px] text-flame">0{i + 1}</span>
              {p.label}
            </figcaption>
          </figure>
        ))}
      </div>

      <BoardFooter index="02" label="Mobile app" />
    </div>
  );
}

/* ================================================================== */
/* 03 · Web dashboard                                                  */
/* ================================================================== */
export function DashboardBoard() {
  const [selected, setSelected] = useState("ahmed");

  return (
    <div className="relative h-full w-full overflow-hidden bg-ivory">
      <span aria-hidden className="absolute inset-0 bg-sage/15" />
      <span
        aria-hidden
        className="dot-grid absolute -top-16 -right-16 h-[460px] w-[620px] opacity-60 [mask-image:radial-gradient(circle,black,transparent_70%)]"
      />

      <div className="absolute top-[80px] right-[120px] left-[120px] flex items-end justify-between gap-10">
        <div>
          <Eyebrow>Web dashboard</Eyebrow>
          <h2 className="mt-4 font-display text-[46px] leading-[1.04] font-semibold tracking-[-0.035em] text-ink">
            Everything your khata needs.
            <br />
            In one place.
          </h2>
        </div>
        <ul className="flex flex-wrap justify-end gap-2 pb-1.5">
          {[
            { Icon: SearchIcon, t: "Instant search" },
            { Icon: Receipt, t: "Quick entry" },
            { Icon: Check, t: "Payment status" },
            { Icon: Sparkle, t: "AI insights" },
          ].map(({ Icon, t }) => (
            <li
              key={t}
              className="flex items-center gap-2 rounded-full border border-olive/18 bg-paper px-3.5 py-2 text-[13.5px] font-semibold text-olive-deep shadow-[var(--shadow-card)]"
            >
              <Icon className="h-4 w-4 text-olive" /> {t}
            </li>
          ))}
        </ul>
      </div>

      <div className="absolute top-[252px] left-[120px] w-[1360px]">
        <Dashboard bare selectedId={selected} onSelect={setSelected} />
      </div>

      <BoardFooter index="03" label="Web dashboard" />
    </div>
  );
}

/* ================================================================== */
/* 04 · Customer profile + WhatsApp                                    */
/* ================================================================== */
export function ProfileBoard() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-beige">
      <span aria-hidden className="paper-noise absolute inset-0 opacity-[0.25]" />
      <span
        aria-hidden
        className="dot-grid absolute inset-x-0 bottom-0 h-[420px] opacity-40 [mask-image:linear-gradient(to_top,black,transparent)]"
      />

      <BoardHeading
        eyebrow="Customer profile"
        title={
          <>
            One tap. The customer's
            <br />
            complete hisaab.
          </>
        }
      />

      <div className="absolute top-[268px] left-[120px] w-[740px]">
        <CustomerProfile bare customerId="ahmed" />
      </div>

      <svg
        aria-hidden
        viewBox="0 0 170 460"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute top-[470px] left-[858px] h-[460px] w-[170px] text-olive-deep/45"
      >
        <path d="M6 440C96 440 70 60 150 26" strokeDasharray="6 7" />
        <path d="M137 15l15 11-12 13" />
      </svg>

      <div className="absolute top-[268px] left-[1000px] flex w-[400px] flex-col gap-6">
        <WhatsAppSection bare firstName="Ahmed" fullName="Ahmed Khan" amount={4500} />
        <ol className="space-y-2.5">
          {[
            ["Tap “Send WhatsApp Reminder”", "Right from Ahmed Khan's profile"],
            ["The message writes itself", "Correct name, balance and date"],
            ["Payment recorded automatically", "The khata balance updates instantly"],
          ].map(([t, s], i) => (
            <li key={t} className="flex items-start gap-3 rounded-lg border border-olive-deep/10 bg-paper/80 px-4 py-3">
              <span className="num mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-olive text-[12px] font-bold text-ivory">
                {i + 1}
              </span>
              <div>
                <p className="text-[14.5px] leading-snug font-semibold text-ink">{t}</p>
                <p className="mt-0.5 text-[12.5px] text-muted">{s}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <BoardFooter index="04" label="Customer profile" />
    </div>
  );
}

/* ================================================================== */
/* 05 · Design system                                                  */
/* ================================================================== */
const PALETTE = [
  { name: "Olive", hex: "#657153", role: "Primary · buttons, links", cls: "bg-olive", fg: "text-ivory" },
  { name: "Sage", hex: "#A8B89F", role: "Secondary · accents", cls: "bg-sage", fg: "text-olive-deep" },
  { name: "Ivory", hex: "#FAF7F0", role: "Main background", cls: "bg-ivory", fg: "text-ink" },
  { name: "Warm Beige", hex: "#E8DCC4", role: "Testimonials, about", cls: "bg-beige", fg: "text-ink" },
  { name: "Sage 15%", hex: "#A8B89F / 15%", role: "Feature blocks", cls: "bg-sage/15", fg: "text-ink" },
  { name: "Ink", hex: "#22271D", role: "Headings & text", cls: "bg-ink", fg: "text-ivory" },
  { name: "Flame", hex: "#C0561A", role: "Key actions only", cls: "bg-flame", fg: "text-white" },
];

const ICON_SET = [Book, SearchIcon, Bell, Users, Receipt, WhatsApp, Sparkle, Shield, Clock, Rupee, Send, Bars];

export function DesignSystemBoard() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-ivory">
      <span aria-hidden className="absolute -top-48 -right-40 h-[560px] w-[760px] rounded-full bg-sage/22 blur-[120px]" />

      <div className="absolute top-[72px] right-[120px] left-[120px] flex items-end justify-between gap-10">
        <div>
          <Eyebrow>Design system</Eyebrow>
          <h2 className="mt-4 font-display text-[44px] leading-[1.04] font-semibold tracking-[-0.035em] text-ink">
            Calm colours. Clear type.
            <br />
            <span className="text-olive">Local by design.</span>
          </h2>
        </div>
        <ul className="flex gap-2 pb-1.5">
          {["8px spacing grid", "WCAG AA contrast", "Urdu-ready type"].map((t) => (
            <li
              key={t}
              className="flex items-center gap-1.5 rounded-full border border-olive/18 bg-paper px-3.5 py-1.5 text-[13px] font-semibold text-olive-deep"
            >
              <Check className="h-3.5 w-3.5 text-olive" strokeWidth={2.6} /> {t}
            </li>
          ))}
        </ul>
      </div>

      {/* palette */}
      <ul className="absolute top-[232px] right-[120px] left-[120px] flex gap-4">
        {PALETTE.map((c) => (
          <li key={c.name} className="flex-1 overflow-hidden rounded-lg border border-line bg-paper shadow-[var(--shadow-card)]">
            <div className={cn("flex h-[132px] items-end border-b border-line p-3", c.cls)}>
              <span className={cn("num text-[11px] font-semibold opacity-85", c.fg)}>{c.hex}</span>
            </div>
            <div className="px-3.5 py-3">
              <p className="font-display text-[16px] leading-tight font-bold tracking-[-0.015em] text-ink">{c.name}</p>
              <p className="mt-1 text-[12px] leading-snug text-muted">{c.role}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="absolute top-[480px] right-[120px] left-[120px] grid h-[576px] grid-cols-[500px_440px_1fr] gap-4">
        {/* typography */}
        <section className="rounded-xl border border-line bg-paper p-7 shadow-[var(--shadow-card)]">
          <MiniLabel>Typography</MiniLabel>
          <div className="mt-4 flex items-start gap-5">
            <span className="font-display text-[88px] leading-[0.82] font-extrabold tracking-[-0.05em] text-olive">Aa</span>
            <div className="pt-1">
              <p className="font-display text-[20px] font-bold tracking-[-0.02em] text-ink">Bricolage Grotesque</p>
              <p className="mt-1 text-[13px] leading-snug text-muted">
                Display & headings · 600–800 weight, tight −3% to −5% tracking.
              </p>
            </div>
          </div>
          <ul className="mt-6 space-y-2.5 border-t border-line-soft pt-5">
            {[
              { tag: "Display 72", cls: "text-[40px] leading-none font-extrabold tracking-[-0.042em]", t: "Your Khata" },
              { tag: "H2 52", cls: "text-[28px] leading-[1.1] font-semibold tracking-[-0.03em]", t: "Built for local shops" },
              { tag: "H3 23", cls: "text-[20px] leading-tight font-bold tracking-[-0.02em]", t: "Payment Tracking" },
            ].map((r) => (
              <li key={r.tag} className="flex items-baseline justify-between gap-4">
                <span className={cn("font-display text-ink", r.cls)}>{r.t}</span>
                <span className="num shrink-0 text-[11px] text-muted">{r.tag}</span>
              </li>
            ))}
          </ul>
          <ul className="mt-5 space-y-3 border-t border-line-soft pt-5">
            <li className="flex items-center justify-between gap-4">
              <span className="text-[16px] text-ink/80">Manage credit without paper.</span>
              <span className="num shrink-0 text-[11px] text-muted">Instrument Sans · Body</span>
            </li>
            <li className="flex items-center justify-between gap-4">
              <span className="num text-[19px] font-semibold text-ink">{pkr(184500)}</span>
              <span className="num shrink-0 text-[11px] text-muted">JetBrains Mono · Figures</span>
            </li>
            <li className="flex items-center justify-between gap-4">
              <span className="urdu text-[24px] leading-[1.7] text-olive">کھاتہ</span>
              <span className="num shrink-0 text-[11px] text-muted">Noto Nastaliq · Urdu</span>
            </li>
          </ul>
        </section>

        {/* components */}
        <section className="rounded-xl border border-line bg-paper p-7 shadow-[var(--shadow-card)]">
          <MiniLabel>Buttons</MiniLabel>
          <div className="mt-3 flex flex-wrap gap-2.5">
            <Button size="md">
              Get Started Free <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Button>
            <Button size="md" variant="olive">
              <WhatsApp className="h-4 w-4" /> Send Reminder
            </Button>
            <Button size="md" variant="outline">
              See How It Works
            </Button>
          </div>

          <MiniLabel className="mt-6">Payment status</MiniLabel>
          <div className="mt-3 flex gap-2">
            <StatusChip status="clear" />
            <StatusChip status="due" />
            <StatusChip status="overdue" />
          </div>

          <MiniLabel className="mt-6">Search</MiniLabel>
          <div className="mt-3 flex h-11 items-center gap-2 rounded-md border border-olive bg-paper px-3 shadow-[0_0_0_3px_rgba(101,113,83,0.12)]">
            <SearchIcon className="h-4 w-4 text-muted" />
            <span className="text-[14px] text-ink">Ahmed</span>
            <span aria-hidden className="h-4 w-[1.5px] bg-flame" />
            <span className="num ml-auto text-[11px] text-muted">2 results</span>
          </div>

          <MiniLabel className="mt-6">Entry type</MiniLabel>
          <div className="mt-3 grid grid-cols-2 gap-1 rounded-md bg-ivory p-1 ring-1 ring-line">
            <span className="rounded-[5px] bg-flame py-2 text-center text-[13px] font-bold text-white">Udhaar</span>
            <span className="rounded-[5px] py-2 text-center text-[13px] font-semibold text-muted">Payment</span>
          </div>
        </section>

        {/* foundations */}
        <section className="rounded-xl border border-line bg-paper p-7 shadow-[var(--shadow-card)]">
          <MiniLabel>Icons · 1.6px stroke</MiniLabel>
          <div className="mt-3 grid grid-cols-6 gap-2">
            {ICON_SET.map((Icon, i) => (
              <span
                key={i}
                className="flex aspect-square items-center justify-center rounded-md border border-olive/15 bg-ivory text-olive"
              >
                <Icon className="h-5 w-5" />
              </span>
            ))}
          </div>

          <MiniLabel className="mt-6">Spacing · 8px grid</MiniLabel>
          <ul className="mt-3 space-y-2">
            {[8, 16, 24, 32, 48, 64].map((v) => (
              <li key={v} className="flex items-center gap-3">
                <span className="num w-7 text-[11px] text-muted">{v}</span>
                <span className="h-3 rounded-[2px] bg-sage" style={{ width: v * 3 }} />
              </li>
            ))}
          </ul>

          <MiniLabel className="mt-6">Corner radius</MiniLabel>
          <div className="mt-3 flex gap-3">
            {[
              { r: 6, l: "Buttons" },
              { r: 8, l: "Cards" },
              { r: 12, l: "Panels" },
            ].map(({ r, l }) => (
              <div key={r} className="flex-1">
                <div className="h-14 border-2 border-olive/35 bg-sage/15" style={{ borderRadius: r }} />
                <p className="mt-1.5 text-[11px] text-muted">
                  <span className="num font-semibold text-ink">{r}px</span> · {l}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <BoardFooter index="05" label="Design system" />
    </div>
  );
}

/* ================================================================== */
/* 06 · Responsive                                                     */
/* ================================================================== */
type Nested = { key: string; id: string; w: number; h: number; display: number };

const NESTED: Nested[] = [
  { key: "desktop", id: "d-hero", w: 1440, h: 900, display: 1000 },
  { key: "mobileHero", id: "m-hero", w: 390, h: 844, display: 282 },
  { key: "mobileProfile", id: "m-profile", w: 390, h: 844, display: 282 },
];

function NestedView({
  item,
  image,
  frameRef,
}: {
  item: Nested;
  image?: string;
  frameRef: (el: HTMLIFrameElement | null) => void;
}) {
  const s = item.display / item.w;
  return (
    <div className="relative overflow-hidden bg-ivory" style={{ width: item.display, height: Math.round(item.h * s) }}>
      <iframe
        ref={frameRef}
        data-capture-ignore
        src={`?shot=${item.id}&nested=1`}
        title={`Live preview: ${item.id}`}
        tabIndex={-1}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 border-0"
        style={{ width: item.w, height: item.h, transform: `scale(${s})`, transformOrigin: "0 0" }}
      />
      {image && <img src={image} alt="" className="absolute inset-0 h-full w-full" />}
    </div>
  );
}

export function ResponsiveBoard() {
  const frames = useRef<Record<string, HTMLIFrameElement | null>>({});
  const [images, setImages] = useState<Record<string, string>>({});
  const committed = useRef<(() => void) | null>(null);

  useEffect(() => {
    const done = committed.current;
    if (done) {
      committed.current = null;
      done();
    }
  }, [images]);

  useShotHooks({
    ready: async () => {
      await Promise.all(
        NESTED.map(async (n) => {
          const api = await waitForShotApi(() => frames.current[n.key] ?? null, n.id, null, 60000);
          await api.ready();
        }),
      );
    },
    prepare: async (scale) => {
      const next: Record<string, string> = {};
      for (const n of NESTED) {
        const api = await waitForShotApi(() => frames.current[n.key] ?? null, n.id, null, 60000);
        const nestedScale = Math.min(4, Math.max(1, (n.display / n.w) * scale * 1.25));
        const shot = await api.capture(nestedScale, "image/png");
        next[n.key] = await blobToDataURL(await toLocalBlob(shot.blob, "image/png"));
      }
      await new Promise<void>((resolve) => {
        committed.current = resolve;
        setImages(next);
      });
    },
  });

  const view = (n: Nested) => (
    <NestedView
      item={n}
      image={images[n.key]}
      frameRef={(el) => {
        frames.current[n.key] = el;
      }}
    />
  );

  return (
    <div className="relative h-full w-full overflow-hidden bg-ivory">
      <span aria-hidden className="absolute -top-48 -left-40 h-[620px] w-[820px] rounded-full bg-sage/22 blur-[120px]" />
      <span
        aria-hidden
        className="dot-grid absolute right-0 bottom-0 h-[560px] w-[780px] opacity-50 [mask-image:radial-gradient(circle_at_bottom_right,black,transparent_70%)]"
      />

      <BoardHeading
        eyebrow="Responsive"
        title={
          <>
            Mobile-first. From the shop
            <br />
            counter to the pocket.
          </>
        }
      />

      <div className="absolute top-[268px] left-[120px]">
        <BrowserFrame>{view(NESTED[0])}</BrowserFrame>
        <p className="mt-5 flex items-center gap-2.5 text-[14px] font-semibold text-ink">
          <span className="num text-[12px] text-flame">1440 px</span> Desktop website
        </p>
      </div>

      <div className="absolute top-[320px] left-[1236px] z-10">
        <PhoneFrame {...{ width: PHONE.frameWidth, screenClassName: PHONE.screenClassName }}>{view(NESTED[2])}</PhoneFrame>
      </div>

      <div className="absolute top-[392px] left-[990px] z-20">
        <PhoneFrame width={PHONE.frameWidth} screenClassName={PHONE.screenClassName}>
          {view(NESTED[1])}
        </PhoneFrame>
        <p className="mt-5 flex items-center gap-2.5 text-[14px] font-semibold text-ink">
          <span className="num text-[12px] text-flame">390 px</span> Mobile website
        </p>
      </div>

      <BoardFooter index="06" label="Responsive" />
    </div>
  );
}
