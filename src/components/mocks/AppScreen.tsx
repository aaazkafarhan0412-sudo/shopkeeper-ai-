import { pkr } from "../../lib/data";
import { Avatar } from "../ui";
import { Bell, Book, Plus, SearchIcon, Sparkle, Users } from "../icons";
import { PhoneFrame, StatusBar } from "./PhoneFrame";

const rows = [
  { name: "Ahmed Khan", area: "Gulberg III", amount: 4500, status: "due" as const, when: "18 Mar" },
  { name: "Muhammad Usman", area: "DHA Phase 5", amount: 8900, status: "overdue" as const, when: "04 Mar" },
  { name: "Fatima Bibi", area: "Saddar", amount: 1250, status: "due" as const, when: "19 Mar" },
  { name: "Bilal Ahmed", area: "Model Town", amount: 0, status: "clear" as const, when: "Today" },
  { name: "Zainab Mart", area: "Johar Town", amount: 3600, status: "due" as const, when: "17 Mar" },
];

export default function AppScreen({
  frameWidth,
  screenClassName,
}: {
  frameWidth?: string;
  screenClassName?: string;
}) {
  return (
    <PhoneFrame width={frameWidth} screenClassName={screenClassName}>
      {/* app header */}
      <div className="bg-olive-deep pb-4">
        <StatusBar tint="light" />
        <div className="mt-2.5 flex items-center gap-2.5 px-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-sage/25 font-display text-[12px] font-bold text-ivory ring-1 ring-ivory/20">
            IG
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-[13px] leading-tight font-semibold text-ivory">
              Imran General Store
            </p>
            <p className="truncate text-[10.5px] text-sage">Lahore · Main khata</p>
          </div>
          <span className="relative flex h-8 w-8 items-center justify-center rounded-md bg-ivory/10 text-ivory">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-flame ring-2 ring-olive-deep" />
          </span>
        </div>

        {/* balance summary */}
        <div className="mx-4 mt-3.5 rounded-lg bg-ivory/[0.07] p-3.5 ring-1 ring-ivory/12">
          <p className="text-[10.5px] font-medium tracking-[0.12em] text-sage uppercase">Total receivables</p>
          <p className="num mt-1 font-display text-[26px] leading-none font-bold text-ivory">{pkr(184500)}</p>
          <div className="mt-2.5 flex items-center gap-3 text-[10.5px] text-ivory/70">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-flame" /> 36 owe you
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-sage" /> 212 clear
            </span>
          </div>
        </div>
      </div>

      {/* search */}
      <div className="px-4 pt-3.5">
        <div className="flex h-9 items-center gap-2 rounded-md border border-line bg-paper px-2.5">
          <SearchIcon className="h-3.5 w-3.5 text-muted" />
          <span className="text-[11.5px] text-muted">Search customer or amount…</span>
        </div>

        {/* quick actions */}
        <div className="mt-2.5 grid grid-cols-3 gap-2">
          {[
            { label: "Udhaar", tone: "bg-flame-tint text-flame-dark border-flame/20" },
            { label: "Payment", tone: "bg-sage/25 text-olive-deep border-olive/15" },
            { label: "Customer", tone: "bg-beige/60 text-[#7A6234] border-[#CDBB94]" },
          ].map((a) => (
            <span
              key={a.label}
              className={`flex h-8 items-center justify-center gap-1 rounded-md border text-[10.5px] font-semibold ${a.tone}`}
            >
              <Plus className="h-3 w-3" strokeWidth={2.4} />
              {a.label}
            </span>
          ))}
        </div>

        {/* list */}
        <div className="mt-3 flex items-center justify-between px-0.5">
          <p className="font-display text-[12px] font-bold tracking-[-0.01em] text-ink">Customers</p>
          <span className="text-[10px] font-semibold text-olive">248 total</span>
        </div>
      </div>

      <ul className="px-4 pt-1.5 pb-24">
        {rows.map((r) => (
          <li
            key={r.name}
            className="flex items-center gap-2.5 border-b border-line-soft py-2.5 last:border-0"
          >
            <Avatar name={r.name} className="h-8 w-8 text-[11px]" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-[12.5px] leading-tight font-semibold text-ink">{r.name}</p>
              <p className="truncate text-[10px] text-muted">
                {r.status === "clear" ? `Paid · ${r.when}` : `${r.area} · ${r.when}`}
              </p>
            </div>
            <div className="text-right">
              <p
                className={`num text-[12.5px] leading-tight font-semibold ${
                  r.amount === 0 ? "text-olive" : r.status === "overdue" ? "text-flame" : "text-ink"
                }`}
              >
                {r.amount === 0 ? "Rs. 0" : pkr(r.amount)}
              </p>
              <p
                className={`text-[9.5px] font-semibold ${
                  r.amount === 0 ? "text-olive/80" : r.status === "overdue" ? "text-flame/85" : "text-muted"
                }`}
              >
                {r.amount === 0 ? "Cleared" : r.status === "overdue" ? "Overdue" : "Balance"}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* bottom nav + FAB */}
      <div className="absolute inset-x-0 bottom-0 border-t border-line bg-paper/95 backdrop-blur">
        <div className="grid grid-cols-4 px-2 pt-2 pb-3">
          {[
            { label: "Khata", Icon: Book, on: true },
            { label: "Customers", Icon: Users, on: false },
            { label: "", Icon: null, on: false },
            { label: "Insights", Icon: Sparkle, on: false },
          ].map((t) =>
            t.Icon ? (
              <span
                key={t.label}
                className={`flex flex-col items-center gap-1 text-[9.5px] font-semibold ${
                  t.on ? "text-olive-deep" : "text-muted"
                }`}
              >
                <t.Icon className="h-[17px] w-[17px]" />
                {t.label}
              </span>
            ) : (
              <span key="spacer" />
            ),
          )}
        </div>
        <span className="absolute -top-5 left-1/2 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full bg-flame text-ivory shadow-[0_12px_24px_-10px_rgba(192,86,26,.9)] ring-4 ring-ivory">
          <Plus className="h-5 w-5" strokeWidth={2.4} />
        </span>
      </div>
    </PhoneFrame>
  );
}
