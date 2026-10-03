import { Eyebrow, Reveal } from "./ui";
import { Check, Quote, Star } from "./icons";
import { testimonials, trustPoints } from "../lib/data";

const cities = ["Lahore", "Karachi", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Hyderabad"];

export default function Trust() {
  return (
    <section id="shopkeepers" className="relative scroll-mt-24 overflow-hidden bg-beige py-20 lg:py-28">
      <span aria-hidden className="paper-noise pointer-events-none absolute inset-0 opacity-[0.25]" />
      <span aria-hidden className="dot-grid pointer-events-none absolute inset-x-0 bottom-0 h-72 opacity-40 [mask-image:linear-gradient(to_top,black,transparent)]" />

      <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <div>
            <Reveal>
              <Eyebrow>For shopkeepers</Eyebrow>
            </Reveal>
            <Reveal delay={70}>
              <h2 className="mt-5 font-display text-[clamp(1.95rem,4.2vw,3.1rem)] leading-[1.05] font-semibold tracking-[-0.033em] text-olive-deep">
                Built for the way local shops actually work.
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-6 max-w-md text-[16.5px] leading-relaxed text-olive-deep/85">
              Not an accounting suite. Not a POS terminal. A khata that behaves like a khata — only faster, searchable,
              and impossible to misplace.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <div className="mt-8 flex items-center gap-4 rounded-lg border border-olive-deep/12 bg-paper/70 p-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-olive text-ivory">
                  <span className="font-display text-[15px] font-bold">8s</span>
                </span>
                <p className="text-[13.5px] leading-snug text-olive-deep/80">
                  Average time to record one udhaar entry — including finding the customer.
                </p>
              </div>
            </Reveal>
            <Reveal delay={260}>
              <div className="mt-8">
                <p className="text-[11px] font-semibold tracking-[0.16em] text-olive-deep/80 uppercase">
                  Serving shops in
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {cities.map((c) => (
                    <span
                      key={c}
                      className="rounded-full border border-olive-deep/15 bg-paper/60 px-3 py-1 text-[12.5px] font-medium text-olive-deep/85 transition-colors duration-200 hover:border-olive-deep/40 hover:bg-paper"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2">
            {trustPoints.map((t, i) => (
              <li key={t}>
                <Reveal delay={i * 65}>
                  <div className="group flex h-full items-start gap-3 rounded-lg border border-olive-deep/10 bg-paper p-4 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:border-olive/35 hover:shadow-[var(--shadow-lift)]">
                    <span className="relative mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sage/30 text-olive-deep transition-colors duration-300 group-hover:bg-olive group-hover:text-ivory">
                      <Check className="h-3.5 w-3.5" strokeWidth={2.8} />
                    </span>
                    <p className="text-[14.5px] leading-snug font-semibold text-ink">{t}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        {/* testimonials */}
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 110}>
              <figure className="group relative flex h-full flex-col rounded-xl border border-olive-deep/10 bg-paper p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] sm:p-7">
                <Quote className="h-7 w-7 text-sage transition-colors duration-300 group-hover:text-flame/60" />
                <blockquote className="mt-4 font-display text-[19px] leading-[1.42] font-semibold tracking-[-0.02em] text-ink sm:text-[21px]">
                  “{t.quote}”
                </blockquote>
                <p className="mt-3 text-[14px] leading-relaxed text-muted italic">{t.translation}</p>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-line-soft pt-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-beige font-display text-[13px] font-bold text-[#7A6234]">
                    {t.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-semibold text-ink">{t.name}</p>
                    <p className="truncate text-[12.5px] text-muted">{t.shop}</p>
                  </div>
                  <span className="ml-auto flex shrink-0 gap-[2px] text-flame" aria-label="5 out of 5">
                    {[0, 1, 2, 3, 4].map((s) => (
                      <Star key={s} className="h-3.5 w-3.5" />
                    ))}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
