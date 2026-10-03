import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../utils/cn";
import { Avatar, Button, Reveal, SectionHead, StatusChip } from "./ui";
import { ArrowRight, Bell, Check, Clock, Download, Plus, SearchIcon, Sparkle, Trend, Users } from "./icons";
import { customers, feed as seedFeed, groupPKR, pkr, tickerPool, type FeedItem } from "../lib/data";
import { useCountUp, useInView, usePrefersReducedMotion } from "../lib/hooks";
import { useToast } from "./Toast";

type Tab = "all" | "due" | "overdue" | "clear";

const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "due", label: "Due" },
  { id: "overdue", label: "Overdue" },
  { id: "clear", label: "Paid up" },
];

function StatTile({
  label,
  target,
  extra = 0,
  prefix = "",
  delta,
  deltaIcon,
  tone = "olive",
  delay = 0,
}: {
  label: string;
  target: number;
  extra?: number;
  prefix?: string;
  delta: string;
  deltaIcon?: "up" | "clock" | "users";
  tone?: "olive" | "flame" | "muted";
  delay?: number;
}) {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);
  const v = useCountUp(target, inView, 1500);
  const shown = Math.round(v) + extra;
  const Icon = deltaIcon === "clock" ? Clock : deltaIcon === "users" ? Users : Trend;
  const toneCls = {
    olive: "text-olive",
    flame: "text-flame",
    muted: "text-muted",
  }[tone];
  return (
    <Reveal delay={delay}>
      <div
        ref={ref}
        className="group relative h-full overflow-hidden rounded-lg border border-line bg-paper p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-olive/28 hover:shadow-[var(--shadow-card)] sm:p-5"
      >
        <span
          aria-hidden
          className={cn("absolute top-0 left-0 h-[3px] w-10 rounded-br transition-all duration-300 group-hover:w-full", tone === "flame" ? "bg-flame/60" : "bg-sage/70")}
        />
        <p className="text-[11px] font-semibold tracking-[0.11em] text-muted uppercase">{label}</p>
        <p className="num mt-2.5 font-display text-[clamp(1.35rem,2.5vw,1.85rem)] leading-none font-extrabold tracking-[-0.035em] text-ink">
          {prefix}
          {groupPKR(shown)}
        </p>
        <p className={cn("mt-2.5 flex items-center gap-1.5 text-[11.5px] font-medium", toneCls)}>
          {deltaIcon !== "users" && <Icon className="h-3.5 w-3.5" strokeWidth={2} />}
          {delta}
        </p>
      </div>
    </Reveal>
  );
}

export default function Dashboard({
  selectedId,
  onSelect,
  bare = false,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
  /** Render only the app window (used by the HD screenshot boards). */
  bare?: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  const notify = useToast();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  const [feedItems, setFeedItems] = useState<FeedItem[]>(seedFeed);
  const [panelOpen, setPanelOpen] = useState(false);
  const [entryKind, setEntryKind] = useState<"credit" | "payment">("credit");
  const [entryAmount, setEntryAmount] = useState("1200");
  const [extraSales, setExtraSales] = useState(0);
  const [feedRef, feedInView] = useInView<HTMLDivElement>(0.3);
  const nextId = useRef(100);
  const feedBox = useRef<HTMLUListElement | null>(null);

  /* live transaction ticker */
  useEffect(() => {
    if (reduced || !feedInView) return;
    const t = window.setInterval(() => {
      const pick = tickerPool[Math.floor(Math.random() * tickerPool.length)];
      setFeedItems((prev) => [{ ...pick, id: nextId.current++ }, ...prev].slice(0, 7));
    }, 5200);
    return () => window.clearInterval(t);
  }, [reduced, feedInView]);

  useEffect(() => {
    if (feedBox.current) feedBox.current.scrollTop = 0;
  }, [feedItems]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return customers.filter((c) => {
      const matchQ =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.area.toLowerCase().includes(q) ||
        c.phone.replace(/\s/g, "").includes(q.replace(/\s/g, ""));
      const matchT = tab === "all" || c.status === tab;
      return matchQ && matchT;
    });
  }, [query, tab]);

  const selected = customers.find((c) => c.id === selectedId) ?? customers[0];

  function saveEntry() {
    const amt = Math.max(0, Math.round(Number(entryAmount) || 0));
    if (!amt) {
      notify({ kind: "ok", title: "Enter an amount first", body: "Quick entry needs a value above Rs. 0." });
      return;
    }
    setFeedItems((prev) =>
      [{ id: nextId.current++, name: selected.name, kind: entryKind, amount: amt, when: "Just now" }, ...prev].slice(0, 7),
    );
    if (entryKind === "credit") setExtraSales((s) => s + amt);
    setPanelOpen(false);
    notify({
      kind: "ok",
      title: `${entryKind === "credit" ? "Udhaar" : "Payment"} of ${pkr(amt)} saved`,
      body: `Added to ${selected.name}'s khata · ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}`,
    });
  }

  return (
    <section
      id={bare ? undefined : "dashboard"}
      className={cn(!bare && "relative scroll-mt-24 border-y border-line bg-paper/45 py-20 lg:py-28")}
    >
      <div className={cn(!bare && "mx-auto max-w-[1240px] px-5 sm:px-8")}>
        {!bare && (
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHead
            eyebrow="Dashboard preview"
            title={
              <>
                Everything your khata needs.
                <br className="hidden sm:block" /> In one place.
              </>
            }
            className="max-w-2xl"
          />
          <Reveal delay={160}>
            <p className="max-w-xs text-[14.5px] leading-relaxed text-muted lg:pb-2">
              This is a live sample. Search a customer, switch the tabs, or add an entry — the numbers respond the way
              they will in your shop.
            </p>
          </Reveal>
        </div>
        )}

        <Reveal mode="scale" delay={80}>
          <div
            className={cn(
              "overflow-hidden rounded-xl border border-line bg-ivory shadow-[var(--shadow-lift)]",
              !bare && "mt-12",
            )}
          >
            {/* window chrome */}
            <div className="flex items-center gap-3 border-b border-line bg-paper px-4 py-2.5">
              <span className="flex gap-1.5" aria-hidden>
                <span className="h-2.5 w-2.5 rounded-full bg-beige-deep" />
                <span className="h-2.5 w-2.5 rounded-full bg-sage" />
                <span className="h-2.5 w-2.5 rounded-full bg-olive/60" />
              </span>
              <span className="mx-auto hidden items-center gap-2 rounded-md bg-ivory px-3 py-1 text-[11.5px] text-muted ring-1 ring-line sm:flex">
                <svg viewBox="0 0 12 14" className="h-3 w-3 text-olive" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
                  <rect x="1.4" y="5.6" width="9.2" height="7" rx="1.6" />
                  <path d="M3.8 5.6V4a2.2 2.2 0 014.4 0v1.6" />
                </svg>
                app.shopkeeperai.pk/khata
              </span>
              <span className="ml-auto flex items-center gap-2 sm:ml-0">
                <span className="relative flex h-7 w-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-ivory hover:text-ink">
                  <Bell className="h-4 w-4" />
                  <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-flame" />
                </span>
                <span className="hidden h-7 w-7 items-center justify-center rounded-md bg-olive font-display text-[11px] font-bold text-ivory sm:flex">
                  IG
                </span>
              </span>
            </div>

            {/* app toolbar */}
            <div className="border-b border-line bg-paper/60 px-4 py-4 sm:px-6">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="min-w-0">
                  <h3 className="font-display text-[19px] leading-tight font-bold tracking-[-0.025em] text-ink">
                    Imran General Store
                  </h3>
                  <p className="mt-0.5 text-[12.5px] text-muted">
                    Thursday, 19 March · <span className="font-medium text-olive">Khata synced 2 min ago</span>
                  </p>
                </div>

                <div className="flex flex-1 items-center gap-2 lg:justify-end">
                  <label className="relative flex h-11 min-w-0 flex-1 items-center lg:max-w-sm">
                    <SearchIcon className="pointer-events-none absolute left-3 h-4 w-4 text-muted" />
                    <input
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search customer, phone or area…"
                      aria-label="Search customers"
                      className="h-11 w-full rounded-md border border-line bg-paper pr-3 pl-9 text-[14px] text-ink placeholder:text-muted/80 transition-colors duration-200 hover:border-olive/30 focus:border-olive focus:outline-none"
                    />
                    {query && (
                      <button
                        type="button"
                        onClick={() => setQuery("")}
                        className="absolute right-2 rounded px-1.5 py-0.5 text-[11px] font-semibold text-muted hover:text-flame"
                        aria-label="Clear search"
                      >
                        Clear
                      </button>
                    )}
                  </label>
                  <Button size="md" onClick={() => setPanelOpen((v) => !v)} className="h-11 shrink-0 px-4">
                    <Plus className="h-4 w-4" strokeWidth={2.6} />
                    <span className="hidden sm:inline">Add Transaction</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                </div>
              </div>

              {/* quick entry panel */}
              <div
                className={cn(
                  "grid overflow-hidden transition-[grid-template-rows,opacity] duration-300",
                  panelOpen ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className={cn("min-h-0", !panelOpen && "invisible")} aria-hidden={!panelOpen}>
                  <div className="rounded-lg border border-olive/18 bg-sage/12 p-3.5 sm:p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <div className="grid shrink-0 grid-cols-2 gap-1 rounded-md bg-paper p-1 ring-1 ring-line">
                        {(["credit", "payment"] as const).map((k) => (
                          <button
                            key={k}
                            type="button"
                            onClick={() => setEntryKind(k)}
                            aria-pressed={entryKind === k}
                            className={cn(
                              "rounded-[5px] px-3.5 py-1.5 text-[12.5px] font-bold transition-colors duration-200",
                              entryKind === k
                                ? k === "credit"
                                  ? "bg-flame text-white"
                                  : "bg-olive text-ivory"
                                : "text-muted hover:text-ink",
                            )}
                          >
                            {k === "credit" ? "Udhaar" : "Payment"}
                          </button>
                        ))}
                      </div>

                      <label className="relative flex h-11 flex-1 items-center sm:max-w-[220px]">
                        <span className="pointer-events-none absolute left-3 text-[13px] font-semibold text-muted">Rs.</span>
                        <input
                          type="number"
                          min={0}
                          value={entryAmount}
                          onChange={(e) => setEntryAmount(e.target.value)}
                          aria-label="Amount in rupees"
                          className="num h-11 w-full rounded-md border border-line bg-paper pr-3 pl-11 text-[15px] font-semibold text-ink focus:border-olive focus:outline-none"
                        />
                      </label>

                      <p className="min-w-0 flex-1 text-[12.5px] text-muted">
                        For <span className="font-semibold text-ink">{selected.name}</span>
                        <span className="hidden sm:inline"> · selected in the customer list</span>
                      </p>

                      <div className="flex shrink-0 gap-2">
                        <Button variant="quiet" size="sm" className="h-10" onClick={() => setPanelOpen(false)}>
                          Cancel
                        </Button>
                        <Button variant="olive" size="sm" className="h-10" onClick={saveEntry}>
                          <Check className="h-4 w-4" strokeWidth={2.4} />
                          Save entry
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* stats */}
            <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
              <StatTile label="Total Customers" target={248} delta="+12 this month" deltaIcon="users" tone="olive" delay={0} />
              <StatTile label="Total Receivables" target={184500} prefix="Rs. " delta="from 36 customers" tone="flame" delay={60} />
              <StatTile label="Today's Sales" target={27340} extra={extraSales} prefix="Rs. " delta="+18% vs yesterday" tone="olive" delay={120} />
              <StatTile label="Pending Payments" target={36} delta="9 due this week" deltaIcon="clock" tone="muted" delay={180} />
            </div>

            {/* body */}
            <div className="grid gap-3 px-4 pb-4 sm:px-6 sm:pb-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
              {/* recent transactions */}
              <div ref={feedRef} className="rounded-lg border border-line bg-paper">
                <div className="flex items-center justify-between gap-3 border-b border-line-soft px-4 py-3.5">
                  <div>
                    <h4 className="font-display text-[14.5px] font-bold tracking-[-0.015em] text-ink">
                      Recent Transactions
                    </h4>
                    <p className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-muted">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="anim-pulse absolute inline-flex h-full w-full rounded-full bg-flame" />
                        <span className="relative h-1.5 w-1.5 rounded-full bg-flame" />
                      </span>
                      Updating live
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => notify({ kind: "ok", title: "Daily report ready", body: "A PDF of today's khata has been prepared for download." })}
                    className="inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 text-[11.5px] font-semibold text-muted transition-colors hover:border-olive/40 hover:text-ink"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Report
                  </button>
                </div>
                <ul ref={feedBox} className="max-h-[336px] overflow-y-auto scrollbar-thin">
                  {feedItems.map((f) => (
                    <li
                      key={f.id}
                      className="anim-row flex items-center gap-3 border-b border-line-soft px-4 py-3 last:border-0 hover:bg-ivory/70"
                    >
                      <span
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
                          f.kind === "payment" ? "bg-sage/30 text-olive-deep" : "bg-flame-tint text-flame",
                        )}
                      >
                        {f.kind === "payment" ? (
                          <ArrowRight className="h-4 w-4 rotate-90" strokeWidth={2.2} />
                        ) : (
                          <ArrowRight className="h-4 w-4 -rotate-90" strokeWidth={2.2} />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13.5px] font-semibold text-ink">{f.name}</p>
                        <p className="truncate text-[11.5px] text-muted">
                          {f.kind === "payment" ? "Payment received" : "Credit sale"} · {f.when}
                        </p>
                      </div>
                      <p
                        className={cn(
                          "num shrink-0 text-[13.5px] font-semibold",
                          f.kind === "payment" ? "text-olive" : "text-flame",
                        )}
                      >
                        {f.kind === "payment" ? "+" : "−"}
                        {groupPKR(f.amount)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* customer list */}
              <div className="rounded-lg border border-line bg-paper">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-soft px-4 py-3.5">
                  <h4 className="font-display text-[14.5px] font-bold tracking-[-0.015em] text-ink">Customer list</h4>
                  <div className="flex flex-wrap gap-1 rounded-md bg-ivory p-1 ring-1 ring-line" role="group" aria-label="Filter customers by payment status">
                    {TABS.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        aria-pressed={tab === t.id}
                        onClick={() => setTab(t.id)}
                        className={cn(
                          "rounded-[5px] px-2.5 py-1 text-[11.5px] font-semibold transition-colors duration-200",
                          tab === t.id ? "bg-olive text-ivory shadow-[0_4px_10px_-6px_rgba(54,61,43,1)]" : "text-muted hover:text-ink",
                        )}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {filtered.length ? (
                  <ul className="max-h-[336px] overflow-y-auto scrollbar-thin">
                    {filtered.map((c) => {
                      const on = c.id === selectedId;
                      return (
                        <li key={c.id}>
                          <button
                            type="button"
                            onClick={() => onSelect(c.id)}
                            aria-pressed={on}
                            className={cn(
                              "group relative flex w-full items-center gap-3 border-b border-line-soft px-4 py-3 text-left transition-colors duration-200 last:border-0",
                              on ? "bg-sage/18" : "hover:bg-ivory/70",
                            )}
                          >
                            <span
                              aria-hidden
                              className={cn(
                                "absolute inset-y-0 left-0 w-[3px] bg-flame transition-transform duration-200",
                                on ? "scale-y-100" : "scale-y-0",
                              )}
                            />
                            <Avatar name={c.name} className="h-9 w-9 text-[12px]" />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[13.5px] font-semibold text-ink">{c.name}</p>
                              <p className="truncate text-[11.5px] text-muted">
                                {c.area} · last entry {c.last}
                              </p>
                            </div>
                            <div className="shrink-0 text-right">
                              <p
                                className={cn(
                                  "num text-[13.5px] font-semibold",
                                  c.balance === 0 ? "text-olive" : c.status === "overdue" ? "text-flame" : "text-ink",
                                )}
                              >
                                {c.balance === 0 ? "Rs. 0" : pkr(c.balance)}
                              </p>
                              <StatusChip status={c.status} className="mt-1" />
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center px-6 py-12 text-center">
                    <span className="flex h-11 w-11 items-center justify-center rounded-md bg-ivory text-muted ring-1 ring-line">
                      <SearchIcon className="h-5 w-5" />
                    </span>
                    <p className="mt-3 font-display text-[15px] font-bold text-ink">No customer matches "{query}"</p>
                    <p className="mt-1 text-[13px] text-muted">Check the spelling, or add them as a new customer.</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => {
                        setQuery("");
                        setTab("all");
                      }}
                    >
                      Reset search
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* insight strip */}
            <div className="flex flex-col gap-3 border-t border-line bg-sage/10 px-4 py-4 sm:flex-row sm:items-center sm:px-6">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-olive text-ivory">
                <Sparkle className="h-[18px] w-[18px]" />
              </span>
              <p className="text-[13.5px] leading-snug text-ink/80">
                <span className="font-semibold text-ink">AI insight · </span>
                9 customers are past their usual payment date. Sending a reminder now usually brings payment within 3
                days.
              </p>
              <button
                type="button"
                onClick={() => {
                  notify({
                    kind: "wa",
                    title: "9 reminders queued",
                    body: "Review and send them from your own WhatsApp number.",
                  });
                }}
                className="inline-flex shrink-0 items-center gap-2 self-start rounded-md border border-olive/25 bg-paper px-3.5 py-2 text-[12.5px] font-semibold text-olive-deep transition-colors duration-200 hover:border-olive hover:bg-olive hover:text-ivory sm:self-auto"
              >
                <Bell className="h-3.5 w-3.5" />
                Remind all 9
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
