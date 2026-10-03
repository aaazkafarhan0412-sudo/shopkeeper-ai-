import { steps } from "../lib/data";
import { Reveal, SectionHead } from "./ui";
import { ArrowRight, Check, Plus, Send, Users, WhatsApp } from "./icons";
import { pkr } from "../lib/data";

function StepOne() {
  return (
    <div className="rounded-lg border border-line bg-paper p-4 shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-2 border-b border-line-soft pb-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-olive text-ivory">
          <Plus className="h-4 w-4" strokeWidth={2.4} />
        </span>
        <p className="font-display text-[13px] font-bold text-ink">New customer</p>
      </div>
      <div className="mt-3 space-y-2.5">
        {[
          { l: "Name", v: "Ahmed Khan" },
          { l: "Phone", v: "+92 300 4412889" },
          { l: "Area", v: "Gulberg III, Lahore" },
        ].map((f) => (
          <div key={f.l}>
            <p className="text-[10px] font-semibold tracking-[0.12em] text-muted uppercase">{f.l}</p>
            <p className="num mt-1 border-b border-dashed border-line pb-1 text-[12.5px] text-ink">{f.v}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between rounded-md bg-olive px-3 py-2 text-[12px] font-semibold text-ivory">
        <span className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5" /> Save customer
        </span>
        <span className="num text-[10.5px] text-sage">takes 8 sec</span>
      </div>
    </div>
  );
}

function StepTwo() {
  return (
    <div className="rounded-lg border border-line bg-paper p-4 shadow-[var(--shadow-card)]">
      <div className="grid grid-cols-2 gap-1 rounded-md bg-ivory p-1">
        <span className="rounded-[5px] bg-flame py-1.5 text-center text-[11.5px] font-bold text-white">Udhaar</span>
        <span className="rounded-[5px] py-1.5 text-center text-[11.5px] font-semibold text-muted">Payment</span>
      </div>
      <p className="mt-3.5 text-[10px] font-semibold tracking-[0.12em] text-muted uppercase">Amount</p>
      <p className="num font-display text-[30px] leading-none font-extrabold tracking-[-0.03em] text-ink">
        {pkr(1200)}
      </p>
      <p className="mt-2 text-[11.5px] text-muted">
        Item <span className="font-semibold text-ink/80">Grocery</span> · 14 Mar 2026
      </p>
      <div className="mt-3.5 grid grid-cols-3 gap-1.5">
        {["1", "2", "3", "4", "5", "6"].map((k) => (
          <span
            key={k}
            className="num rounded-[5px] border border-line-soft bg-ivory py-1.5 text-center text-[12px] font-semibold text-ink/70"
          >
            {k}
          </span>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-center gap-1.5 rounded-md bg-sage/35 py-2 text-[12px] font-semibold text-olive-deep">
        <Check className="h-3.5 w-3.5" strokeWidth={2.6} /> Entry saved · balance updated
      </div>
    </div>
  );
}

function StepThree() {
  return (
    <div className="rounded-lg border border-line bg-paper p-4 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.12em] text-muted uppercase">Ahmed Khan</p>
          <p className="num font-display text-[26px] leading-tight font-extrabold tracking-[-0.03em] text-flame">
            {pkr(4500)}
          </p>
        </div>
        <span className="rounded-full border border-flame/25 bg-flame-tint px-2.5 py-1 text-[10.5px] font-bold text-flame-dark">
          14 days due
        </span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line-soft">
        <div className="h-full w-[62%] rounded-full bg-flame/70" />
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-md bg-[#128C7E]/8 p-2.5 ring-1 ring-[#128C7E]/15">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#128C7E] text-white">
          <WhatsApp className="h-3.5 w-3.5" />
        </span>
        <p className="min-w-0 flex-1 truncate text-[11.5px] text-ink/80">Reminder ready to send</p>
        <span className="flex items-center gap-1 rounded-[5px] bg-[#128C7E] px-2 py-1 text-[10.5px] font-bold text-white">
          <Send className="h-3 w-3" /> Send
        </span>
      </div>
      <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-muted">
        <Check className="h-3.5 w-3.5 text-olive" strokeWidth={2.6} />
        Last reminder delivered · 2 days ago
      </div>
    </div>
  );
}

const visuals = [StepOne, StepTwo, StepThree];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative scroll-mt-24 overflow-hidden py-20 lg:py-28">
      <span aria-hidden className="dot-grid pointer-events-none absolute inset-x-0 top-0 h-64 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHead
          eyebrow="How it works"
          align="center"
          title={
            <>
              Three steps. That's the whole thing.
            </>
          }
          lead="If you can send a WhatsApp message, you can run your khata on Shopkeeper AI. Most shopkeepers finish setup before their first customer of the day."
        />

        <div className="relative mt-16">
          {/* connector */}
          <span aria-hidden className="absolute top-[26px] right-[10%] left-[10%] hidden border-t-2 border-dashed border-olive/22 lg:block">
            <span className="anim-travel absolute -top-[6px] h-2.5 w-2.5 rounded-full bg-flame shadow-[0_0_0_4px_rgba(192,86,26,.16)]" />
          </span>

          <ol className="relative grid gap-10 lg:grid-cols-3 lg:gap-8">
            {steps.map((s, i) => {
              const Visual = visuals[i];
              return (
                <li key={s.n}>
                  <Reveal delay={i * 120}>
                    <div className="group flex gap-5 lg:block">
                      <div className="flex flex-col items-center lg:items-start">
                        <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 border-olive/22 bg-ivory font-display text-[17px] font-extrabold tracking-[-0.02em] text-olive transition-all duration-300 group-hover:border-flame group-hover:bg-flame group-hover:text-white lg:mb-6">
                          {s.n}
                        </span>
                        <span aria-hidden className="mt-2 w-px flex-1 border-l-2 border-dashed border-olive/18 lg:hidden" />
                      </div>
                      <div className="min-w-0 flex-1 lg:mt-0">
                        <h3 className="font-display text-[24px] leading-tight font-bold tracking-[-0.028em] text-ink">
                          {s.title}
                        </h3>
                        <p className="mt-2.5 text-[16px] leading-relaxed text-ink/75">{s.body}</p>
                        <p className="mt-1.5 text-[13.5px] text-muted">{s.detail}</p>
                        <div className="mt-6 transition-transform duration-300 group-hover:-translate-y-1">
                          <Visual />
                        </div>
                      </div>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>

        <Reveal delay={120}>
          <div className="mt-14 flex flex-col items-center justify-between gap-4 rounded-lg border border-olive/15 bg-sage/12 px-6 py-5 sm:flex-row">
            <p className="text-[15px] text-ink/80">
              Already have a list of customers?{" "}
              <span className="font-semibold text-ink">Import them from Excel or your phone contacts in one tap.</span>
            </p>
            <a
              href="#get-started"
              className="group inline-flex shrink-0 items-center gap-2 text-[14px] font-semibold text-flame transition-colors hover:text-flame-dark"
            >
              Start free
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
