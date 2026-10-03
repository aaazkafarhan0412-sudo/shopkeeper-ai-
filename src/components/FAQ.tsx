import { useState } from "react";
import { cn } from "../utils/cn";
import { Eyebrow, Reveal } from "./ui";
import { ChevronDown, Phone, WhatsApp } from "./icons";
import { faqs } from "../lib/data";
import { useToast } from "./Toast";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const notify = useToast();

  return (
    <section id="faq" className="relative scroll-mt-24 py-20 lg:py-28">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <Eyebrow>FAQ</Eyebrow>
          </Reveal>
          <Reveal delay={70}>
            <h2 className="mt-5 font-display text-[clamp(1.95rem,4.1vw,3.05rem)] leading-[1.05] font-semibold tracking-[-0.032em] text-ink">
              Questions shopkeepers ask us.
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-6 max-w-sm text-[16px] leading-relaxed text-muted">
              Straight answers, no jargon. If something is still unclear, our support team speaks Urdu, Punjabi, Sindhi
              and English.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-8 rounded-lg border border-line bg-paper p-5 shadow-[var(--shadow-card)]">
              <p className="font-display text-[15px] font-bold tracking-[-0.015em] text-ink">Still need help?</p>
              <p className="mt-1.5 text-[13.5px] leading-snug text-muted">
                Free support, Monday to Saturday, 9am – 9pm.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() =>
                    notify({ kind: "wa", title: "WhatsApp support", body: "Message us at +92 300 111 5428 (Mon–Sat, 9am–9pm)." })
                  }
                  className="group inline-flex items-center gap-2.5 rounded-md border border-line bg-ivory px-3.5 py-2.5 text-left text-[13.5px] font-semibold text-ink transition-colors duration-200 hover:border-[#128C7E]/40 hover:bg-[#128C7E]/6"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#128C7E]/12 text-[#128C7E]">
                    <WhatsApp className="h-4 w-4" />
                  </span>
                  Chat on WhatsApp
                  <ChevronDown className="ml-auto h-4 w-4 -rotate-90 text-muted transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
                <button
                  type="button"
                  onClick={() => notify({ kind: "ok", title: "Urdu support line", body: "Dial 0800-7467533 — free from any network." })}
                  className="group inline-flex items-center gap-2.5 rounded-md border border-line bg-ivory px-3.5 py-2.5 text-left text-[13.5px] font-semibold text-ink transition-colors duration-200 hover:border-olive/40 hover:bg-sage/12"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-sage/30 text-olive-deep">
                    <Phone className="h-4 w-4" />
                  </span>
                  0800-SHOPKEEPER
                  <ChevronDown className="ml-auto h-4 w-4 -rotate-90 text-muted transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          </Reveal>
        </div>

        <ul className="divide-y divide-line border-y border-line">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            const panelId = `faq-panel-${i}`;
            const btnId = `faq-btn-${i}`;
            return (
              <li key={f.q}>
                <Reveal delay={Math.min(i, 4) * 60}>
                  <h3>
                    <button
                      type="button"
                      id={btnId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className={cn(
                        "group flex w-full items-start gap-4 py-6 text-left transition-colors duration-200 sm:gap-6",
                        isOpen ? "text-ink" : "text-ink/85 hover:text-ink",
                      )}
                    >
                      <span className="num mt-1 shrink-0 text-[12px] font-semibold text-muted/80">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "min-w-0 flex-1 font-display text-[18px] leading-snug font-bold tracking-[-0.022em] transition-colors duration-200 sm:text-[20px]",
                          isOpen && "text-olive",
                        )}
                      >
                        {f.q}
                      </span>
                      <span
                        className={cn(
                          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition-all duration-300",
                          isOpen
                            ? "rotate-180 border-flame bg-flame text-white"
                            : "border-line bg-paper text-muted group-hover:border-olive/40 group-hover:text-olive",
                        )}
                      >
                        <ChevronDown className="h-4 w-4" strokeWidth={2} />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={btnId}
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <p className="max-w-2xl pr-10 pb-7 pl-[38px] text-[15.5px] leading-relaxed text-muted sm:pl-[46px]">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
