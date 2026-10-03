import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../utils/cn";
import { Avatar, Button, Eyebrow, Reveal, StatusChip } from "./ui";
import { ArrowRight, Check, Clock, Close, Plus, Send, Shield, WhatsApp } from "./icons";
import { customers, groupPKR, pkr, type Txn } from "../lib/data";
import { useToast } from "./Toast";

type AddedMap = Record<string, Txn[]>;

export default function CustomerProfile({
  customerId,
  bare = false,
}: {
  customerId: string;
  /** Render only the profile card (used by the HD screenshot boards). */
  bare?: boolean;
}) {
  const notify = useToast();
  const base = customers.find((c) => c.id === customerId) ?? customers[0];
  const [added, setAdded] = useState<AddedMap>({});
  const [dialog, setDialog] = useState(false);
  const [kind, setKind] = useState<"credit" | "payment">("credit");
  const [amount, setAmount] = useState("1200");
  const [item, setItem] = useState("Grocery");
  const [sentAt, setSentAt] = useState<string | null>(null);
  const amountRef = useRef<HTMLInputElement | null>(null);

  const mine = added[base.id] ?? [];
  const txns = useMemo(() => [...base.txns, ...mine], [base, mine]);
  const balance = useMemo(
    () =>
      txns.reduce((sum, t) => sum + (t.type === "payment" ? -t.amount : t.amount), 0),
    [txns],
  );

  useEffect(() => {
    if (!dialog) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDialog(false);
    };
    window.addEventListener("keydown", onKey);
    window.setTimeout(() => amountRef.current?.focus(), 60);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [dialog]);

  function saveTxn() {
    const amt = Math.max(0, Math.round(Number(amount) || 0));
    if (!amt) {
      notify({ kind: "ok", title: "Enter an amount", body: "An entry needs a value above Rs. 0." });
      return;
    }
    const prevRunning = txns.length ? txns[txns.length - 1].running : 0;
    const entry: Txn = {
      id: `${base.id}-new-${Date.now()}`,
      label: item.trim() || (kind === "credit" ? "Udhaar" : "Payment"),
      type: kind,
      amount: amt,
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
      running: kind === "credit" ? prevRunning + amt : Math.max(0, prevRunning - amt),
      note: "Just now",
    };
    setAdded((prev) => ({ ...prev, [base.id]: [...(prev[base.id] ?? []), entry] }));
    setDialog(false);
    notify({
      kind: "ok",
      title: `${pkr(amt)} ${kind === "credit" ? "udhaar" : "payment"} recorded`,
      body: `${base.name}'s balance is now ${pkr(entry.running)}.`,
    });
  }

  function sendReminder() {
    setSentAt(new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }));
    notify({
      kind: "wa",
      title: "WhatsApp reminder sent",
      body: balance > 0 ? `Delivered to ${base.name} at ${base.phone}.` : `${base.name} has no pending balance.`,
    });
    window.setTimeout(() => setSentAt(null), 6000);
  }

  return (
    <section
      id={bare ? undefined : "customer-profile"}
      className={cn(!bare && "relative scroll-mt-24 overflow-hidden py-20 lg:py-28")}
    >
      {!bare && (
        <span aria-hidden className="rules pointer-events-none absolute inset-y-0 left-0 w-1/3 opacity-40 [mask-image:linear-gradient(to_right,black,transparent)]" />
      )}

      <div
        className={cn(
          "relative",
          !bare &&
            "mx-auto grid max-w-[1240px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-14",
        )}
      >
        {!bare && (
        <div>
          <Reveal>
            <Eyebrow>Customer profile</Eyebrow>
          </Reveal>
          <Reveal delay={70}>
            <h2 className="mt-5 font-display text-[clamp(1.95rem,4.1vw,3.05rem)] leading-[1.05] font-semibold tracking-[-0.032em] text-ink">
              One tap. The customer's <span className="text-olive">complete hisaab</span>.
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-6 max-w-md text-[16.5px] leading-relaxed text-muted">
              No page-turning, no guessing. Every udhaar, every payment and the running balance — in the order it
              actually happened, just like your register.
            </p>
          </Reveal>

          <ul className="mt-8 space-y-3.5">
            {[
              { Icon: Clock, t: "Running balance on every line", s: "You always know where the customer stands." },
              { Icon: Send, t: "Reminder writes itself", s: "Polite message, correct amount, your WhatsApp number." },
              { Icon: Shield, t: "Nothing gets lost", s: "Entries are backed up nightly and exportable to PDF." },
            ].map((r, i) => (
              <li key={r.t}>
                <Reveal delay={i * 80}>
                  <div className="flex items-start gap-3.5">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-olive/15 bg-paper text-olive">
                      <r.Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-[15px] leading-snug font-semibold text-ink">{r.t}</p>
                      <p className="mt-0.5 text-[13.5px] leading-snug text-muted">{r.s}</p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>

          <Reveal delay={260}>
            <p className="mt-8 inline-flex items-center gap-2 rounded-md border border-line bg-paper px-3.5 py-2 text-[12.5px] text-muted">
              <ArrowRight className="h-3.5 w-3.5 -rotate-90 text-flame" />
              Pick any customer in the dashboard above — this screen follows it.
            </p>
          </Reveal>
        </div>
        )}

        {/* ------------- the profile card ------------- */}
        <Reveal mode="scale" delay={100}>
          <div className="overflow-hidden rounded-xl border border-line bg-paper shadow-[var(--shadow-lift)]">
            {/* header */}
            <div className="flex items-start gap-4 border-b border-line bg-ivory/70 px-5 py-5 sm:px-6">
              <Avatar name={base.name} className="h-[52px] w-[52px] rounded-lg text-[17px]" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-[21px] leading-tight font-bold tracking-[-0.025em] text-ink">
                    {base.name}
                  </h3>
                  <StatusChip status={balance === 0 ? "clear" : base.status} />
                </div>
                <p className="num mt-1 text-[13px] text-muted">{base.phone}</p>
                <p className="mt-0.5 text-[12px] text-muted">
                  {base.area} · <span className="text-olive">{base.since}</span>
                </p>
              </div>
              <span className="hidden shrink-0 items-center gap-1.5 rounded-md border border-line bg-paper px-2.5 py-1.5 text-[11px] font-semibold text-muted sm:inline-flex">
                <Clock className="h-3.5 w-3.5" /> Last entry {base.last}
              </span>
            </div>

            {/* balance */}
            <div className="grid gap-px border-b border-line bg-line sm:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
              <div className="bg-paper px-5 py-5 sm:px-6">
                <p className="text-[11px] font-semibold tracking-[0.12em] text-muted uppercase">Balance</p>
                <p
                  className={cn(
                    "num mt-2 font-display text-[clamp(2.1rem,5vw,2.9rem)] leading-none font-extrabold tracking-[-0.04em]",
                    balance === 0 ? "text-olive" : balance > 6000 ? "text-flame" : "text-ink",
                  )}
                >
                  {pkr(balance)}
                </p>
                <p className="mt-2.5 flex items-center gap-2 text-[12.5px] text-muted">
                  {balance === 0 ? (
                    <>
                      <Check className="h-4 w-4 text-olive" strokeWidth={2.4} /> Account cleared — no pending amount
                    </>
                  ) : (
                    <>
                      <span className="h-1.5 w-1.5 rounded-full bg-flame" />
                      {base.status === "overdue" ? "Overdue by 15 days" : "Due this month"} · usual payment in 7 days
                    </>
                  )}
                </p>
              </div>
              <div className="flex flex-col justify-center gap-2 bg-ivory/60 px-5 py-5 sm:px-6">
                {[
                  { l: "Total credit", v: txns.filter((t) => t.type !== "payment").reduce((s, t) => s + t.amount, 0) },
                  { l: "Total paid", v: txns.filter((t) => t.type === "payment").reduce((s, t) => s + t.amount, 0) },
                  { l: "Entries", v: txns.length },
                ].map((r) => (
                  <div key={r.l} className="flex items-baseline justify-between gap-3">
                    <span className="text-[12px] text-muted">{r.l}</span>
                    <span className="num text-[13px] font-semibold text-ink">
                      {r.l === "Entries" ? r.v : pkr(r.v)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* history */}
            <div className="px-5 py-5 sm:px-6">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-[14.5px] font-bold tracking-[-0.015em] text-ink">
                  Transaction history
                </h4>
                <span className="text-[11.5px] font-semibold text-muted">March 2026</span>
              </div>

              <div className="mt-3 flex items-center gap-3 border-b border-line pb-2 text-[10px] font-semibold tracking-[0.11em] text-muted uppercase">
                <span className="num w-12 shrink-0">Date</span>
                <span className="min-w-0 flex-1">Particulars</span>
                <span className="num hidden w-20 text-right sm:block">Udhaar</span>
                <span className="num hidden w-20 text-right sm:block">Payment</span>
                <span className="num w-[76px] shrink-0 text-right">Balance</span>
              </div>

              <ul className="max-h-[268px] overflow-y-auto scrollbar-thin">
                {txns.map((t) => (
                  <li
                    key={t.id}
                    className={cn(
                      "flex items-center gap-3 border-b border-line-soft py-2.5 text-[13px] last:border-0 hover:bg-ivory/70",
                      t.note === "Just now" && "anim-row",
                    )}
                  >
                    <span className="num w-12 shrink-0 text-[11.5px] text-muted">{t.date}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-ink/85">{t.label}</span>
                      {t.note && <span className="block truncate text-[11px] text-muted">{t.note}</span>}
                    </span>
                    <span className="num hidden w-20 text-right text-[12.5px] font-semibold text-flame sm:block">
                      {t.type === "payment" ? "" : groupPKR(t.amount)}
                    </span>
                    <span className="num hidden w-20 text-right text-[12.5px] font-semibold text-olive sm:block">
                      {t.type === "payment" ? groupPKR(t.amount) : ""}
                    </span>
                    <span className="num w-[76px] shrink-0 text-right text-[12.5px] font-semibold text-ink">
                      {groupPKR(t.running)}
                    </span>
                  </li>
                ))}
              </ul>

              {/* actions */}
              <div className="mt-5 flex flex-col gap-2.5 border-t border-line pt-5 sm:flex-row">
                <Button className="flex-1" onClick={() => setDialog(true)}>
                  <Plus className="h-4 w-4" strokeWidth={2.6} />
                  Add Transaction
                </Button>
                <Button variant="olive" className="flex-1" onClick={sendReminder} disabled={balance === 0}>
                  {sentAt ? (
                    <>
                      <Check className="h-4 w-4" strokeWidth={2.6} />
                      Reminder sent {sentAt}
                    </>
                  ) : (
                    <>
                      <WhatsApp className="h-4 w-4" />
                      Send WhatsApp Reminder
                    </>
                  )}
                </Button>
              </div>
              {balance === 0 && (
                <p className="mt-2 text-center text-[11.5px] text-muted sm:text-left">
                  No pending balance — reminders are paused for this customer.
                </p>
              )}
            </div>
          </div>
        </Reveal>
      </div>

      {/* ------------- add transaction dialog ------------- */}
      {dialog && (
        <div className="fixed inset-0 z-[95] flex items-end justify-center p-4 sm:items-center">
          <div
            className="absolute inset-0 bg-olive-deep/45 backdrop-blur-[3px]"
            onClick={() => setDialog(false)}
            aria-hidden
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="entry-title"
            className="anim-toast relative w-full max-w-md overflow-hidden rounded-xl border border-line bg-paper shadow-[var(--shadow-lift)]"
          >
            <div className="flex items-center justify-between border-b border-line bg-ivory/70 px-5 py-4">
              <div>
                <h4 id="entry-title" className="font-display text-[16px] font-bold tracking-[-0.02em] text-ink">
                  Add transaction
                </h4>
                <p className="mt-0.5 text-[12px] text-muted">
                  {base.name} · current balance {pkr(balance)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDialog(false)}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-paper hover:text-flame"
              >
                <Close className="h-[18px] w-[18px]" />
              </button>
            </div>

            <div className="px-5 py-5">
              <div className="grid grid-cols-2 gap-1 rounded-md bg-ivory p-1 ring-1 ring-line">
                {(["credit", "payment"] as const).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setKind(k)}
                    aria-pressed={kind === k}
                    className={cn(
                      "rounded-[5px] py-2 text-[13px] font-bold transition-colors duration-200",
                      kind === k
                        ? k === "credit"
                          ? "bg-flame text-white"
                          : "bg-olive text-ivory"
                        : "text-muted hover:text-ink",
                    )}
                  >
                    {k === "credit" ? "Udhaar (credit)" : "Payment received"}
                  </button>
                ))}
              </div>

              <label className="mt-5 block">
                <span className="text-[11px] font-semibold tracking-[0.12em] text-muted uppercase">Amount</span>
                <span className="relative mt-1.5 flex items-center">
                  <span className="absolute left-3.5 text-[15px] font-semibold text-muted">Rs.</span>
                  <input
                    ref={amountRef}
                    type="number"
                    min={0}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="num h-[52px] w-full rounded-md border border-line bg-ivory pr-4 pl-14 font-display text-[22px] font-bold text-ink focus:border-olive focus:bg-paper focus:outline-none"
                  />
                </span>
              </label>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {[500, 1000, 2000, 5000].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setAmount(String(v))}
                    className="num rounded-full border border-line px-3 py-1 text-[12px] font-semibold text-muted transition-colors hover:border-flame/50 hover:text-flame"
                  >
                    Rs. {groupPKR(v)}
                  </button>
                ))}
              </div>

              <label className="mt-5 block">
                <span className="text-[11px] font-semibold tracking-[0.12em] text-muted uppercase">Item or note</span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                  placeholder="Grocery, ration, cash payment…"
                  className="mt-1.5 h-11 w-full rounded-md border border-line bg-ivory px-3.5 text-[14px] text-ink placeholder:text-muted/75 focus:border-olive focus:bg-paper focus:outline-none"
                />
              </label>
            </div>

            <div className="flex gap-2.5 border-t border-line bg-ivory/70 px-5 py-4">
              <Button variant="quiet" className="flex-1" onClick={() => setDialog(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={saveTxn}>
                <Check className="h-4 w-4" strokeWidth={2.6} />
                Save entry
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
