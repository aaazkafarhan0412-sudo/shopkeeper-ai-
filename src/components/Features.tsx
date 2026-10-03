import type { ReactNode } from "react";
import { cn } from "../utils/cn";
import { Eyebrow, Reveal, SectionHead } from "./ui";
import { Bars, Receipt, SearchIcon, Sparkle, Users, WhatsApp } from "./icons";
import { pkr, customers } from "../lib/data";
import { useInView } from "../lib/hooks";

function Tile({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <Reveal delay={delay} className={cn("h-full", className)}>
      <article
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-lg border border-olive/12 bg-sage/15 p-6 transition-all duration-300 ease-out",
          "hover:-translate-y-1 hover:border-olive/32 hover:bg-sage/22 hover:shadow-[var(--shadow-lift)] sm:p-7",
        )}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-olive/35 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        {children}
      </article>
    </Reveal>
  );
}

function TileHead({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <>
      <span className="flex h-11 w-11 items-center justify-center rounded-md border border-olive/18 bg-paper text-olive shadow-[var(--shadow-card)] transition-all duration-300 group-hover:bg-olive group-hover:text-ivory">
        {icon}
      </span>
      <h3 className="mt-5 font-display text-[21px] leading-tight font-bold tracking-[-0.025em] text-ink sm:text-[23px]">
        {title}
      </h3>
    </>
  );
}

function Body({ children }: { children: ReactNode }) {
  return <p className="mt-3 max-w-md text-[15.5px] leading-relaxed text-muted">{children}</p>;
}

function InsightBars() {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);
  const bars = [42, 66, 51, 88, 72, 96, 61];
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  return (
    <div ref={ref} className="flex h-24 items-end gap-2">
      {bars.map((b, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-2">
          <div
            className={cn("w-full rounded-t-[3px] bg-olive/75", inView && "anim-grow")}
            style={{ height: `${b}%`, animationDelay: `${i * 70}ms` }}
          />
          <span className="text-[10px] font-semibold text-muted">{days[i]}</span>
        </div>
      ))}
    </div>
  );
}

export default function Features() {
  const searchHits = customers.filter((c) => c.name.toLowerCase().startsWith("a")).slice(0, 2);

  return (
    <section id="features" className="relative scroll-mt-24 py-20 lg:py-28">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHead
            eyebrow="Features"
            title={
              <>
                Six things your khata
                <br className="hidden sm:block" /> should already be doing.
              </>
            }
            className="max-w-2xl"
          />
          <Reveal delay={160}>
            <p className="max-w-xs text-[15px] leading-relaxed text-muted lg:pb-2">
              No complicated accounting. No training needed. Open the app, tap a name, and your record is up to date.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-12">
          {/* Digital Khata */}
          <Tile className="lg:col-span-5" delay={0}>
            <TileHead icon={<Receipt className="h-[22px] w-[22px]" />} title="Digital Khata" />
            <Body>Keep every customer's credit and payment record organized.</Body>
            <div className="mt-6 rounded-md border border-olive/12 bg-paper p-4 shadow-[var(--shadow-card)]">
              <div className="flex items-baseline justify-between border-b border-line-soft pb-2 text-[11px] font-semibold tracking-[0.1em] text-muted uppercase">
                <span>Ahmed Khan</span>
                <span>March</span>
              </div>
              {[
                { l: "Grocery · udhaar", a: 1200, t: "credit" as const, r: 3300 },
                { l: "Payment · cash", a: 500, t: "payment" as const, r: 2800 },
                { l: "Grocery · udhaar", a: 2000, t: "credit" as const, r: 4800 },
              ].map((row) => (
                <div
                  key={row.l}
                  className="flex items-center justify-between gap-3 border-b border-line-soft py-2 text-[12.5px] last:border-0"
                >
                  <span className="truncate text-muted">{row.l}</span>
                  <span className="flex items-center gap-3">
                    <span
                      className={cn(
                        "num font-semibold",
                        row.t === "credit" ? "text-flame" : "text-olive",
                      )}
                    >
                      {row.t === "credit" ? "+" : "−"}
                      {row.a.toLocaleString("en-US")}
                    </span>
                    <span className="num w-14 text-right text-[11.5px] text-ink/70">{pkr(row.r)}</span>
                  </span>
                </div>
              ))}
            </div>
          </Tile>

          {/* WhatsApp */}
          <Tile className="lg:col-span-7" delay={70}>
            <div className="flex h-full flex-col">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <TileHead icon={<WhatsApp className="h-[21px] w-[21px]" />} title="WhatsApp Integration" />
                  <Body>Send payment reminders and transaction updates directly through WhatsApp.</Body>
                </div>
                <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-[#128C7E]/25 bg-[#128C7E]/8 px-3 py-1 text-[11px] font-semibold text-[#128C7E] sm:inline-flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#128C7E]" />
                  From your number
                </span>
              </div>
              <div className="wa-doodle mt-6 flex flex-1 flex-col justify-end gap-2 rounded-md p-4">
                <div className="anim-bubble ml-auto max-w-[80%] rounded-lg rounded-br-none bg-paper px-3.5 py-2.5 text-[13px] leading-snug text-ink/85 shadow-[0_1px_2px_rgba(34,39,29,.08)]">
                  Assalam-o-Alaikum Ahmed, your current balance is {pkr(4500)}. Thank you.
                  <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-muted">
                    9:41 am
                    <svg viewBox="0 0 20 12" className="h-2.5 w-4 text-tick" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
                      <path d="M1 6.6l3.4 3.4L11 2.6" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M7.6 9.9L9 11l6.6-8.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <div
                  className="anim-bubble mr-auto max-w-[76%] rounded-lg rounded-bl-none bg-sage/45 px-3.5 py-2.5 text-[13px] leading-snug text-olive-deep"
                  style={{ animationDelay: "220ms" }}
                >
                  JazakAllah! Aaj shaam tak bhej deta hoon.
                  <div className="mt-1 text-right text-[10px] text-olive/70">9:44 am</div>
                </div>
              </div>
            </div>
          </Tile>

          {/* Customer Management */}
          <Tile className="lg:col-span-4" delay={0}>
            <TileHead icon={<Users className="h-[22px] w-[22px]" />} title="Customer Management" />
            <Body>Quickly find customers and view their complete transaction history.</Body>
            <div className="mt-6 flex items-center gap-3 rounded-md border border-olive/12 bg-paper px-3.5 py-3 shadow-[var(--shadow-card)]">
              <div className="flex -space-x-2">
                {customers.slice(0, 4).map((c) => (
                  <span
                    key={c.id}
                    className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-paper bg-olive/15 font-display text-[10px] font-bold text-olive-deep"
                  >
                    {c.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                  </span>
                ))}
              </div>
              <p className="text-[12px] leading-tight text-muted">
                <span className="num block font-display text-[14px] font-bold text-ink">248</span>
                active customers
              </p>
            </div>
          </Tile>

          {/* Smart Search */}
          <Tile className="lg:col-span-4" delay={70}>
            <TileHead icon={<SearchIcon className="h-[22px] w-[22px]" />} title="Smart Search" />
            <Body>Search customers, transactions and balances instantly.</Body>
            <div className="mt-6 rounded-md border border-olive/12 bg-paper p-3 shadow-[var(--shadow-card)]">
              <div className="flex h-9 items-center gap-2 rounded-[5px] border border-line bg-ivory px-2.5">
                <SearchIcon className="h-3.5 w-3.5 text-muted" />
                <span className="num text-[12.5px] font-medium text-ink">ahm</span>
                <span className="h-3.5 w-[1.5px] animate-pulse bg-flame" aria-hidden />
              </div>
              <div className="mt-2 space-y-1">
                {searchHits.map((c, i) => (
                  <div
                    key={c.id}
                    className={cn(
                      "flex items-center justify-between rounded-[5px] px-2.5 py-2 text-[12px]",
                      i === 0 ? "bg-sage/25 text-ink" : "text-muted",
                    )}
                  >
                    <span className="font-semibold">{c.name}</span>
                    <span className="num text-[11.5px]">{c.balance ? pkr(c.balance) : "Rs. 0"}</span>
                  </div>
                ))}
              </div>
            </div>
          </Tile>

          {/* Payment Tracking */}
          <Tile className="lg:col-span-4" delay={140}>
            <TileHead icon={<Receipt className="h-[22px] w-[22px]" />} title="Payment Tracking" />
            <Body>See who has paid, who owes money and recent transactions.</Body>
            <div className="mt-6 space-y-2.5 rounded-md border border-olive/12 bg-paper p-3.5 shadow-[var(--shadow-card)]">
              {[
                { l: "Paid up", n: 212, w: "86%", tone: "bg-olive" },
                { l: "Due", n: 27, w: "11%", tone: "bg-[#C9B58A]" },
                { l: "Overdue", n: 9, w: "4%", tone: "bg-flame" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="flex items-center justify-between text-[11.5px]">
                    <span className="font-semibold text-ink">{s.l}</span>
                    <span className="num text-muted">{s.n}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-line-soft">
                    <div
                      className={cn("h-full rounded-full transition-[width] duration-700", s.tone)}
                      style={{ width: s.w }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Tile>

          {/* AI Insights */}
          <Tile className="lg:col-span-12" delay={0}>
            <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center">
              <div>
                <TileHead icon={<Sparkle className="h-[22px] w-[22px]" />} title="AI Insights" />
                <Body>Get simple insights about your shop's transactions and customer activity.</Body>
                <div className="mt-6 flex flex-wrap gap-2">
                  {[
                    { Icon: Bars, t: "Thursday is your busiest udhaar day" },
                    { Icon: Sparkle, t: "5 customers pay within 3 days of a reminder" },
                  ].map((c) => (
                    <span
                      key={c.t}
                      className="inline-flex items-center gap-2 rounded-full border border-olive/15 bg-paper px-3.5 py-2 text-[12.5px] font-medium text-ink/80 shadow-[var(--shadow-card)]"
                    >
                      <c.Icon className="h-4 w-4 shrink-0 text-flame" />
                      {c.t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-md border border-olive/12 bg-paper p-5 shadow-[var(--shadow-card)]">
                <div className="flex items-center justify-between">
                  <p className="font-display text-[13px] font-bold tracking-[-0.01em] text-ink">This week's credit</p>
                  <span className="num text-[11.5px] font-semibold text-olive">+18%</span>
                </div>
                <div className="mt-4">
                  <InsightBars />
                </div>
              </div>
            </div>
          </Tile>
        </div>

        <Reveal delay={80}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-muted">
            <Eyebrow>Also included</Eyebrow>
            {["Staff logins", "Daily PDF report", "Print receipts", "Multi-shop support", "Offline mode"].map((f) => (
              <span key={f} className="flex items-center gap-2">
                <span aria-hidden className="h-1 w-1 rounded-full bg-sage" />
                {f}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
