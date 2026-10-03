import type { ReactNode } from "react";
import { cn } from "../../utils/cn";
import { customers, groupPKR, pkr } from "../../lib/data";
import { Avatar, StatusChip } from "../ui";
import { ArrowRight, Check, ChevronDown, Clock, Close, Phone, Plus, Shield, WhatsApp } from "../icons";
import { PhoneFrame, StatusBar } from "./PhoneFrame";

type ScreenProps = { frameWidth?: string; screenClassName?: string };

const FRAME_W = "w-[300px]";
const SCREEN_H = "h-[610px]";
const ahmed = customers[0];

function IconBtn({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
        dark ? "bg-ivory/10 text-ivory" : "border border-line bg-paper text-ink",
      )}
    >
      {children}
    </span>
  );
}

function Caption({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("text-[9.5px] font-semibold tracking-[0.14em] text-muted uppercase", className)}>{children}</p>
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

function Toggle({ on }: { on: boolean }) {
  return (
    <span className={cn("relative h-[18px] w-8 shrink-0 rounded-full", on ? "bg-olive" : "bg-line")}>
      <span
        className={cn(
          "absolute top-[2px] h-[14px] w-[14px] rounded-full bg-paper shadow-[0_1px_2px_rgba(34,39,29,.25)]",
          on ? "left-4" : "left-[2px]",
        )}
      />
    </span>
  );
}

function Backspace() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 5h10.5A1.5 1.5 0 0121 6.5v11a1.5 1.5 0 01-1.5 1.5H9l-6-7z" />
      <path d="M12.5 9.5l5 5M17.5 9.5l-5 5" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Customer profile — Ahmed Khan                                       */
/* ------------------------------------------------------------------ */
export function CustomerScreen({ frameWidth = FRAME_W, screenClassName = SCREEN_H }: ScreenProps) {
  const history = ahmed.txns.filter((t) => t.type !== "opening");
  const credit = ahmed.txns.filter((t) => t.type !== "payment").reduce((s, t) => s + t.amount, 0);
  const paid = ahmed.txns.filter((t) => t.type === "payment").reduce((s, t) => s + t.amount, 0);

  return (
    <PhoneFrame width={frameWidth} screenClassName={screenClassName}>
      <div className="flex h-full flex-col">
        <div className="bg-olive-deep px-4 pb-8">
          <StatusBar tint="light" />
          <div className="mt-2 flex items-center justify-between">
            <IconBtn dark>
              <ChevronDown className="h-4 w-4 rotate-90" strokeWidth={2} />
            </IconBtn>
            <p className="font-display text-[12.5px] font-semibold tracking-[-0.01em] text-ivory">Customer khata</p>
            <IconBtn dark>
              <Phone className="h-4 w-4" />
            </IconBtn>
          </div>
          <div className="mt-3.5 flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sage/25 font-display text-[15px] font-bold text-ivory ring-1 ring-ivory/20">
              AK
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-[17px] leading-tight font-bold tracking-[-0.02em] text-ivory">
                {ahmed.name}
              </p>
              <p className="num mt-0.5 truncate text-[10.5px] text-sage">{ahmed.phone}</p>
            </div>
          </div>
        </div>

        <div className="relative -mt-6 px-4">
          <div className="rounded-lg border border-line bg-paper p-3.5 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between">
              <Caption>Balance</Caption>
              <StatusChip status="due" />
            </div>
            <p className="num mt-1.5 font-display text-[30px] leading-none font-extrabold tracking-[-0.04em] text-ink">
              {pkr(ahmed.balance)}
            </p>
            <p className="mt-1.5 flex items-center gap-1.5 text-[10.5px] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-flame" /> Due this month · usually pays in 7 days
            </p>
            <div className="mt-2.5 grid grid-cols-2 gap-2 border-t border-line-soft pt-2.5">
              <div>
                <Caption className="tracking-[0.1em]">Total credit</Caption>
                <p className="num mt-0.5 text-[12px] font-semibold text-flame">{pkr(credit)}</p>
              </div>
              <div className="text-right">
                <Caption className="tracking-[0.1em]">Total paid</Caption>
                <p className="num mt-0.5 text-[12px] font-semibold text-olive">{pkr(paid)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden px-4 pt-3">
          <div className="flex items-center justify-between">
            <p className="font-display text-[12px] font-bold tracking-[-0.01em] text-ink">Transaction history</p>
            <span className="text-[10px] font-semibold text-olive">March 2026</span>
          </div>
          <ul className="mt-1">
            {history.map((t) => {
              const isPay = t.type === "payment";
              return (
                <li key={t.id} className="flex items-center gap-2.5 border-b border-line-soft py-[6px] last:border-0">
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
                      isPay ? "bg-sage/30 text-olive-deep" : "bg-flame-tint text-flame",
                    )}
                  >
                    <ArrowRight className={cn("h-3.5 w-3.5", isPay ? "rotate-90" : "-rotate-90")} strokeWidth={2.2} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-semibold text-ink">{t.label}</p>
                    <p className="truncate text-[9.5px] text-muted">
                      {t.date}
                      {t.note ? ` · ${t.note}` : ""}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className={cn("num text-[12px] font-semibold", isPay ? "text-olive" : "text-flame")}>
                      {pkr(t.amount)}
                    </p>
                    <p className="num text-[9px] text-muted">Bal {groupPKR(t.running)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="space-y-2 border-t border-line bg-paper px-4 pt-3 pb-4">
          <span className="flex h-10 items-center justify-center gap-1.5 rounded-md bg-flame text-[12px] font-bold text-white shadow-[0_10px_20px_-14px_rgba(192,86,26,.9)]">
            <Plus className="h-3.5 w-3.5" strokeWidth={2.6} /> Add Transaction
          </span>
          <span className="flex h-10 items-center justify-center gap-1.5 rounded-md bg-olive text-[12px] font-bold text-ivory">
            <WhatsApp className="h-3.5 w-3.5" /> Send WhatsApp Reminder
          </span>
        </div>
      </div>
    </PhoneFrame>
  );
}

/* ------------------------------------------------------------------ */
/* Add transaction                                                     */
/* ------------------------------------------------------------------ */
export function EntryScreen({ frameWidth = FRAME_W, screenClassName = SCREEN_H }: ScreenProps) {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "00", "0", "del"];

  return (
    <PhoneFrame width={frameWidth} screenClassName={screenClassName}>
      <div className="flex h-full flex-col bg-ivory">
        <StatusBar tint="dark" />
        <div className="flex items-center justify-between px-4 pt-2">
          <IconBtn>
            <Close className="h-4 w-4" />
          </IconBtn>
          <p className="font-display text-[13px] font-bold tracking-[-0.01em] text-ink">Add transaction</p>
          <span className="w-8" aria-hidden />
        </div>

        <div className="mx-4 mt-3 flex items-center gap-2.5 rounded-lg border border-line bg-paper px-3 py-2.5">
          <Avatar name={ahmed.name} className="h-8 w-8 text-[11px]" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-semibold text-ink">{ahmed.name}</p>
            <p className="text-[9.5px] text-muted">Current balance</p>
          </div>
          <p className="num text-[12px] font-semibold text-ink">{pkr(ahmed.balance)}</p>
        </div>

        <div className="mx-4 mt-3 grid grid-cols-2 gap-1 rounded-md bg-paper p-1 ring-1 ring-line">
          <span className="rounded-[5px] bg-flame py-1.5 text-center text-[11.5px] font-bold text-white">Udhaar</span>
          <span className="rounded-[5px] py-1.5 text-center text-[11.5px] font-semibold text-muted">Payment</span>
        </div>

        <div className="mt-4 px-4 text-center">
          <Caption>Amount</Caption>
          <p className="num mt-1 flex items-center justify-center font-display text-[38px] leading-none font-extrabold tracking-[-0.04em] text-ink">
            {pkr(1200)}
            <span aria-hidden className="ml-1 h-[30px] w-[2px] rounded-full bg-flame" />
          </p>
          <p className="mt-1.5 text-[10.5px] text-muted">
            New balance <span className="num font-semibold text-flame">{pkr(ahmed.balance + 1200)}</span>
          </p>
        </div>

        <div className="mt-3.5 flex flex-wrap justify-center gap-1.5 px-4">
          {["Grocery", "Ration", "Milk", "Other"].map((c, i) => (
            <span
              key={c}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[10.5px] font-semibold",
                i === 0 ? "border-olive bg-olive text-ivory" : "border-line bg-paper text-muted",
              )}
            >
              {c}
            </span>
          ))}
        </div>

        <div className="mx-4 mt-3 flex items-center gap-2 rounded-md border border-line bg-paper px-3 py-2 text-[10.5px]">
          <Clock className="h-3.5 w-3.5 shrink-0 text-olive" />
          <span className="text-ink/80">Today · 19 Mar</span>
          <span className="ml-auto truncate text-muted">Atta, cheeni, chai</span>
        </div>

        <div className="mt-auto grid grid-cols-3 gap-1.5 px-4 pt-3">
          {keys.map((k) => (
            <span
              key={k}
              className="num flex h-9 items-center justify-center rounded-md bg-paper text-[14px] font-semibold text-ink ring-1 ring-line-soft"
            >
              {k === "del" ? <Backspace /> : k}
            </span>
          ))}
        </div>

        <div className="px-4 pt-3 pb-4">
          <span className="flex h-10 items-center justify-center gap-1.5 rounded-md bg-olive text-[12px] font-bold text-ivory">
            <Check className="h-4 w-4" strokeWidth={2.6} /> Save entry
          </span>
        </div>
      </div>
    </PhoneFrame>
  );
}

/* ------------------------------------------------------------------ */
/* WhatsApp reminder                                                   */
/* ------------------------------------------------------------------ */
export function ReminderScreen({ frameWidth = FRAME_W, screenClassName = SCREEN_H }: ScreenProps) {
  return (
    <PhoneFrame width={frameWidth} screenClassName={screenClassName}>
      <div className="flex h-full flex-col bg-ivory">
        <StatusBar tint="dark" />
        <div className="flex items-center gap-2.5 px-4 pt-2">
          <IconBtn>
            <ChevronDown className="h-4 w-4 rotate-90" strokeWidth={2} />
          </IconBtn>
          <p className="font-display text-[13px] font-bold tracking-[-0.01em] text-ink">Send reminder</p>
          <span className="ml-auto flex items-center gap-1 rounded-full bg-[#128C7E]/10 px-2 py-1 text-[9.5px] font-bold text-[#128C7E]">
            <WhatsApp className="h-3 w-3" /> WhatsApp
          </span>
        </div>

        <div className="mx-4 mt-3 flex items-center gap-2.5 rounded-lg border border-line bg-paper px-3 py-2.5">
          <Avatar name={ahmed.name} className="h-8 w-8 text-[11px]" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-semibold text-ink">{ahmed.name}</p>
            <p className="num truncate text-[9.5px] text-muted">{ahmed.phone}</p>
          </div>
          <div className="text-right">
            <p className="num text-[12px] font-semibold text-flame">{pkr(ahmed.balance)}</p>
            <p className="text-[9px] text-muted">due</p>
          </div>
        </div>

        <Caption className="mt-3.5 px-4">Message preview</Caption>
        <div className="wa-doodle mx-4 mt-1.5 rounded-lg p-3 ring-1 ring-line">
          <div className="ml-auto w-fit max-w-[94%] rounded-lg rounded-br-none bg-paper px-3 py-2 shadow-[0_1px_2px_rgba(34,39,29,.1)]">
            <p className="text-[11.5px] leading-snug text-ink/85">
              Assalam-o-Alaikum Ahmed, your current balance is {pkr(ahmed.balance)}. Thank you.
            </p>
            <p className="mt-1 flex items-center justify-end gap-1 text-[9px] text-muted">
              9:41 am <Ticks />
            </p>
          </div>
        </div>

        <Caption className="mt-3.5 px-4">Language</Caption>
        <div className="mx-4 mt-1.5 grid grid-cols-3 gap-1 rounded-md bg-paper p-1 ring-1 ring-line">
          <span className="flex items-center justify-center rounded-[5px] bg-olive py-1.5 text-[10.5px] font-bold text-ivory">
            English
          </span>
          <span className="flex items-center justify-center rounded-[5px] py-1.5 text-[10.5px] font-semibold text-muted">
            Roman Urdu
          </span>
          <span className="urdu flex items-center justify-center rounded-[5px] text-[12px] leading-[1.5] text-muted">
            اردو
          </span>
        </div>

        <div className="mx-4 mt-3 divide-y divide-line-soft rounded-lg border border-line bg-paper">
          {[
            { t: "Include shop name", s: "Imran General Store", on: true },
            { t: "Attach statement", s: "PDF · March 2026", on: false },
          ].map((r) => (
            <div key={r.t} className="flex items-center gap-3 px-3 py-2.5">
              <div className="min-w-0 flex-1">
                <p className="text-[11.5px] font-semibold text-ink">{r.t}</p>
                <p className="truncate text-[9.5px] text-muted">{r.s}</p>
              </div>
              <Toggle on={r.on} />
            </div>
          ))}
        </div>

        <div className="mt-auto px-4 pt-3 pb-4">
          <span className="flex h-10 items-center justify-center gap-1.5 rounded-md bg-olive text-[12px] font-bold text-ivory">
            <WhatsApp className="h-4 w-4" /> Send WhatsApp Reminder
          </span>
          <p className="mt-2 flex items-center justify-center gap-1.5 text-[9.5px] text-muted">
            <Shield className="h-3 w-3 text-olive" /> Sent from your own number · you review first
          </p>
        </div>
      </div>
    </PhoneFrame>
  );
}
