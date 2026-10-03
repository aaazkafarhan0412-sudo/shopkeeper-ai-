import { useEffect, useRef, useState } from "react";
import { cn } from "../utils/cn";
import { Button, Eyebrow, Reveal } from "./ui";
import { Check, Send, WhatsApp, Urdu, Shield } from "./icons";
import { pkr } from "../lib/data";
import { useToast } from "./Toast";

type Phase = "read" | "typing" | "sent" | "delivered";

const bullets = [
  {
    Icon: Send,
    t: "The message writes itself",
    s: "Correct name, correct balance, correct date — every time.",
  },
  {
    Icon: WhatsApp,
    t: "Sent from your own number",
    s: "Customers see your shop, not a faceless billing system.",
  },
  {
    Icon: Urdu,
    t: "Urdu, Roman Urdu or English",
    s: "Choose once per customer. We remember the preference.",
  },
  {
    Icon: Shield,
    t: "Nothing goes out without you",
    s: "You review every reminder before it leaves your phone.",
  },
];

function Ticks({ state }: { state: Phase }) {
  const double = state === "delivered" || state === "read";
  return (
    <svg
      viewBox="0 0 20 12"
      className={cn("h-2.5 w-4 transition-colors duration-300", double ? "text-tick" : "text-muted/70")}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden
    >
      <path d="M1 6.6l3.4 3.4L11 2.6" strokeLinecap="round" strokeLinejoin="round" />
      {double && <path d="M7.6 9.9L9 11l6.6-8.4" strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
}

export default function WhatsAppSection({
  firstName = "Ahmed",
  fullName = "Ahmed Khan",
  amount = 4500,
  bare = false,
}: {
  firstName?: string;
  fullName?: string;
  amount?: number;
  /** Render only the chat panel (used by the HD screenshot boards). */
  bare?: boolean;
}) {
  const notify = useToast();
  const replyAmount = Math.max(500, Math.min(2000, Math.round(amount / 2 / 50) * 50));
  const [phase, setPhase] = useState<Phase>("read");
  const [run, setRun] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  function send() {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setRun((r) => r + 1);
    setPhase("typing");
    timers.current.push(window.setTimeout(() => setPhase("sent"), 1100));
    timers.current.push(
      window.setTimeout(() => {
        setPhase("delivered");
        notify({
          kind: "wa",
          title: "Reminder sent on WhatsApp",
          body: `${firstName} received a balance reminder for ${pkr(amount)}.`,
        });
      }, 1900),
    );
    timers.current.push(window.setTimeout(() => setPhase("read"), 3000));
  }

  const showOut = phase !== "typing";
  const showReply = phase === "read";

  return (
    <section id={bare ? undefined : "whatsapp"} className={cn(!bare && "relative scroll-mt-24 py-20 lg:py-28")}>
      <div className={cn(!bare && "mx-auto max-w-[1240px] px-5 sm:px-8")}>
        <div
          className={cn(
            !bare &&
              "relative overflow-hidden rounded-2xl border border-olive/12 bg-sage/12 px-5 py-12 sm:px-10 lg:px-14 lg:py-16",
          )}
        >
          {!bare && (
            <>
              <span aria-hidden className="paper-noise pointer-events-none absolute inset-0 opacity-[0.18]" />
              <span aria-hidden className="dot-grid pointer-events-none absolute -top-10 -right-10 h-64 w-64 opacity-45 [mask-image:radial-gradient(circle,black,transparent_70%)]" />
            </>
          )}

          <div
            className={cn(
              !bare && "relative grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-16",
            )}
          >
            {!bare && (
            <div>
              <Reveal>
                <Eyebrow>WhatsApp</Eyebrow>
              </Reveal>
              <Reveal delay={70}>
                <h2 className="mt-5 font-display text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.04] font-semibold tracking-[-0.034em] text-ink">
                  Your khata meets <span className="text-olive">WhatsApp.</span>
                </h2>
              </Reveal>
              <Reveal delay={130}>
                <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-muted">
                  Keep your customers informed without changing the way you communicate. Shopkeeper AI prepares the
                  message; you tap send from your own number.
                </p>
              </Reveal>

              <ul className="mt-9 grid gap-5 sm:grid-cols-2">
                {bullets.map((b, i) => (
                  <li key={b.t}>
                    <Reveal delay={i * 80}>
                      <div className="group flex items-start gap-3">
                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-olive/15 bg-paper text-olive transition-all duration-300 group-hover:border-[#128C7E]/35 group-hover:bg-[#128C7E] group-hover:text-white">
                          <b.Icon className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="text-[14.5px] leading-snug font-semibold text-ink">{b.t}</p>
                          <p className="mt-1 text-[13px] leading-snug text-muted">{b.s}</p>
                        </div>
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ul>

              <Reveal delay={200}>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button variant="olive" size="lg" onClick={send} className="w-full sm:w-auto">
                    <WhatsApp className="h-[18px] w-[18px]" />
                    {phase === "typing" ? "Sending…" : "Send Reminder"}
                  </Button>
                  <p className="flex items-center gap-2 text-[13px] text-muted">
                    <Check className="h-4 w-4 shrink-0 text-olive" strokeWidth={2.4} />
                    Works with any WhatsApp number — nothing extra for your customers to install.
                  </p>
                </div>
              </Reveal>
            </div>
            )}

            {/* chat panel */}
            <Reveal mode="scale" delay={140}>
              <div className="relative mx-auto w-full max-w-[380px]">
                <div className="overflow-hidden rounded-xl border border-line bg-paper shadow-[var(--shadow-lift)]">
                  {/* header */}
                  <div className="flex items-center gap-3 border-b border-line bg-[#F3EDE1] px-4 py-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-olive font-display text-[12px] font-bold text-ivory">
                      AK
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-[13.5px] leading-tight font-bold text-ink">
                        {fullName}
                      </p>
                      <p className="truncate text-[11px] text-muted">
                        {phase === "typing" ? "typing…" : phase === "read" ? "online" : "last seen today at 9:44 am"}
                      </p>
                    </div>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#128C7E]/12 text-[#128C7E]">
                      <WhatsApp className="h-4 w-4" />
                    </span>
                  </div>

                  {/* messages */}
                  <div className="wa-doodle relative min-h-[300px] px-3.5 py-4">
                    <div className="mx-auto mb-3 w-fit rounded-full bg-paper/85 px-3 py-1 text-[10.5px] font-semibold text-muted shadow-sm">
                      Today
                    </div>

                    {phase === "typing" && (
                      <div className="ml-auto flex w-fit items-center gap-1.5 rounded-lg rounded-br-none bg-paper px-3.5 py-3 shadow-sm">
                        <span className="dot-1 h-1.5 w-1.5 rounded-full bg-muted" />
                        <span className="dot-2 h-1.5 w-1.5 rounded-full bg-muted" />
                        <span className="dot-3 h-1.5 w-1.5 rounded-full bg-muted" />
                      </div>
                    )}

                    {showOut && (
                      <div
                        key={`out-${run}`}
                        className="anim-bubble ml-auto w-fit max-w-[88%] rounded-lg rounded-br-none bg-paper px-3.5 py-2.5 shadow-[0_1px_2px_rgba(34,39,29,.1)]"
                      >
                        <p className="text-[13px] leading-snug text-ink/85">
                          Assalam-o-Alaikum {firstName}, your current balance is {pkr(amount)}. Thank you.
                        </p>
                        <p className="mt-1 flex items-center justify-end gap-1 text-[10px] text-muted">
                          9:41 am <Ticks state={phase} />
                        </p>
                      </div>
                    )}

                    {showReply && (
                      <div
                        key={`in-${run}`}
                        className="anim-bubble mr-auto mt-2.5 w-fit max-w-[86%] rounded-lg rounded-bl-none bg-sage/45 px-3.5 py-2.5"
                        style={{ animationDelay: "120ms" }}
                      >
                        <p className="text-[13px] leading-snug text-olive-deep">
                          JazakAllah! Aaj shaam tak {pkr(replyAmount)} bhej deta hoon.
                        </p>
                        <p className="mt-1 text-right text-[10px] text-olive/70">9:44 am</p>
                      </div>
                    )}

                    {showReply && (
                      <div
                        key={`rec-${run}`}
                        className="anim-bubble mx-auto mt-4 w-fit rounded-full bg-paper/85 px-3 py-1.5 text-[10.5px] font-semibold text-olive shadow-sm"
                        style={{ animationDelay: "260ms" }}
                      >
                        <span className="flex items-center gap-1.5">
                          <Check className="h-3 w-3" strokeWidth={3} /> Payment of {pkr(replyAmount)} recorded
                          automatically
                        </span>
                      </div>
                    )}
                  </div>

                  {/* composer */}
                  <div className="flex items-center gap-2 border-t border-line bg-ivory/80 px-3 py-2.5">
                    <span className="flex-1 truncate rounded-full bg-paper px-3.5 py-2 text-[12px] text-muted ring-1 ring-line">
                      Reminder message ready to review…
                    </span>
                    <button
                      type="button"
                      onClick={send}
                      aria-label="Send WhatsApp reminder"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#128C7E] text-white transition-transform duration-200 hover:scale-105 active:scale-95"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {!bare && (
                  <p className="mt-3 text-center text-[11.5px] text-muted">
                    Sample conversation · your real messages are private to your shop
                  </p>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
