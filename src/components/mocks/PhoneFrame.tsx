import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

export function PhoneFrame({
  children,
  className,
  width = "w-[268px] sm:w-[300px]",
  screenClassName,
}: {
  children: ReactNode;
  className?: string;
  width?: string;
  /** Extra classes for the screen area, e.g. a fixed height for export boards. */
  screenClassName?: string;
}) {
  return (
    <div className={cn("relative select-none", width, className)}>
      <span aria-hidden className="absolute top-24 -left-[3px] h-10 w-[3px] rounded-l-sm bg-olive-deep/45" />
      <span aria-hidden className="absolute top-40 -left-[3px] h-16 w-[3px] rounded-l-sm bg-olive-deep/45" />
      <span aria-hidden className="absolute top-32 -right-[3px] h-20 w-[3px] rounded-r-sm bg-olive-deep/45" />
      <div className="relative rounded-[32px] border border-ink/15 bg-olive-deep p-[9px] shadow-[var(--shadow-lift)]">
        <div className={cn("relative overflow-hidden rounded-[24px] bg-ivory ring-1 ring-ink/5", screenClassName)}>
          <span
            aria-hidden
            className="absolute top-[7px] left-1/2 z-30 h-[18px] w-[74px] -translate-x-1/2 rounded-full bg-olive-deep"
          />
          {children}
        </div>
      </div>
    </div>
  );
}

export function StatusBar({ time = "9:41", tint = "light" }: { time?: string; tint?: "light" | "dark" }) {
  const c = tint === "light" ? "text-ivory" : "text-ink";
  return (
    <div className={cn("flex items-center justify-between px-5 pt-[9px] pb-1 text-[10.5px] font-semibold", c)}>
      <span className="num">{time}</span>
      <span className="flex items-center gap-1.5">
        <svg viewBox="0 0 16 10" className="h-2.5 w-4" fill="currentColor" aria-hidden>
          <rect x="0" y="6.5" width="2.4" height="3.5" rx="0.6" />
          <rect x="3.6" y="4.6" width="2.4" height="5.4" rx="0.6" />
          <rect x="7.2" y="2.6" width="2.4" height="7.4" rx="0.6" />
          <rect x="10.8" y="0.4" width="2.4" height="9.6" rx="0.6" opacity="0.4" />
        </svg>
        <svg viewBox="0 0 14 10" className="h-2.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
          <path d="M1 3.6a8.5 8.5 0 0112 0M3.4 6.1a5 5 0 017.2 0" />
          <circle cx="7" cy="8.6" r="0.8" fill="currentColor" stroke="none" />
        </svg>
        <svg viewBox="0 0 22 10" className="h-2.5 w-[22px]" aria-hidden>
          <rect x="0.5" y="0.5" width="17" height="9" rx="2.4" fill="none" stroke="currentColor" opacity="0.55" />
          <rect x="2" y="2" width="12" height="6" rx="1.4" fill="currentColor" />
          <path d="M19.4 3.6v2.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />
        </svg>
      </span>
    </div>
  );
}
