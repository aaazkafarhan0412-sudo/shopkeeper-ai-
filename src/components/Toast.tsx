import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { Check, WhatsApp } from "./icons";

type Toast = { id: number; title: string; body?: string; kind: "wa" | "ok" };

const ToastCtx = createContext<(t: Omit<Toast, "id">) => void>(() => {});

export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const seq = useRef(0);

  const notify = useCallback((t: Omit<Toast, "id">) => {
    const id = ++seq.current;
    setItems((prev) => [...prev.slice(-2), { ...t, id }]);
    window.setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== id)), 3600);
  }, []);

  const value = useMemo(() => notify, [notify]);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed right-4 bottom-4 z-[90] flex w-[min(21rem,calc(100vw-2rem))] flex-col gap-2.5 sm:right-6 sm:bottom-6"
      >
        {items.map((t) => (
          <div
            key={t.id}
            className="anim-toast pointer-events-auto flex items-start gap-3 rounded-lg border border-olive/15 bg-paper p-3.5 shadow-[var(--shadow-lift)]"
          >
            <span
              className={
                t.kind === "wa"
                  ? "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#128C7E]/10 text-[#128C7E]"
                  : "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-sage/30 text-olive-deep"
              }
            >
              {t.kind === "wa" ? <WhatsApp className="h-4 w-4" /> : <Check className="h-4 w-4" strokeWidth={2.4} />}
            </span>
            <div className="min-w-0">
              <p className="font-display text-[14.5px] leading-tight font-semibold text-ink">{t.title}</p>
              {t.body && <p className="mt-1 text-[13px] leading-snug text-muted">{t.body}</p>}
            </div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
