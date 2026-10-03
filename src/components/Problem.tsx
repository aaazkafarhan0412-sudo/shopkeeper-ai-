import { problems } from "../lib/data";
import { Eyebrow, Reveal } from "./ui";
import { ArrowRight, Bell, Book, SearchIcon } from "./icons";

const iconMap = { book: Book, search: SearchIcon, bell: Bell } as const;

export default function Problem() {
  return (
    <>
      <section id="problem" className="relative py-20 lg:py-28">
        <div className="mx-auto grid max-w-[1240px] gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <Eyebrow>The problem</Eyebrow>
            </Reveal>
            <Reveal delay={70}>
              <h2 className="mt-5 font-display text-[clamp(1.95rem,4.1vw,3.1rem)] leading-[1.05] font-semibold tracking-[-0.032em] text-ink">
                The traditional khata works.{" "}
                <span className="relative text-olive">
                  But it can be better.
                  <span aria-hidden className="absolute -bottom-1 left-0 h-[3px] w-full bg-sage/50" />
                </span>
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-6 max-w-md text-[16.5px] leading-relaxed text-muted">
                Every shop in Pakistan runs on trust and a notebook. The notebook is fine — until it goes missing, gets
                wet, or a customer asks for last year's hisaab on a busy evening.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <div className="mt-8 flex items-center gap-3 rounded-lg border border-line bg-paper p-4 shadow-[var(--shadow-card)]">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-beige text-[#7A6234]">
                  <Book className="h-5 w-5" />
                </span>
                <p className="text-[13.5px] leading-snug text-muted">
                  The average shopkeeper spends{" "}
                  <span className="font-semibold text-ink">over 3 hours a week</span> re-reading and fixing their paper
                  register.
                </p>
              </div>
            </Reveal>
          </div>

          <ul className="divide-y divide-line border-y border-line">
            {problems.map((p, i) => {
              const Icon = iconMap[p.icon];
              return (
                <li key={p.n}>
                  <Reveal delay={i * 90}>
                  <div className="group relative flex gap-5 py-8 transition-colors duration-300 hover:bg-sage/8 sm:gap-7 sm:py-9">
                    <span
                      aria-hidden
                      className="absolute top-0 left-0 h-full w-[3px] origin-top scale-y-0 bg-flame transition-transform duration-300 group-hover:scale-y-100"
                    />
                    <div className="flex w-11 shrink-0 flex-col items-center gap-3 sm:w-14">
                      <span className="flex h-11 w-11 items-center justify-center rounded-md border border-olive/15 bg-ivory text-olive transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-olive/35 group-hover:bg-olive group-hover:text-ivory sm:h-12 sm:w-12">
                        <Icon className="h-[21px] w-[21px]" />
                      </span>
                      <span className="num text-[11px] font-semibold text-muted/70">{p.n}</span>
                    </div>
                    <div className="min-w-0 flex-1 pl-1">
                      <h3 className="font-display text-[21px] leading-tight font-bold tracking-[-0.02em] text-ink sm:text-[23px]">
                        {p.title}
                      </h3>
                      <p className="mt-2.5 text-[16px] leading-relaxed text-ink/75">{p.body}</p>
                      <p className="mt-2 text-[14px] leading-relaxed text-muted italic">{p.detail}</p>
                    </div>
                  </div>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* transition band */}
      <section className="relative overflow-hidden bg-beige">
        <span aria-hidden className="paper-noise absolute inset-0 opacity-[0.22]" />
        <span aria-hidden className="dot-grid absolute inset-0 opacity-40" />
        <div className="relative mx-auto flex max-w-[1240px] flex-col items-start gap-7 px-5 py-14 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:py-16">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-olive-deep text-sage">
                <Book className="h-6 w-6" />
              </span>
              <ArrowRight className="hidden h-6 w-6 text-olive-deep/50 sm:block" />
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-olive text-ivory shadow-[0_10px_20px_-12px_rgba(54,61,43,1)]">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                  <rect x="6.4" y="2.8" width="11.2" height="18.4" rx="2.2" />
                  <path d="M9.6 7.6h4.8M9.6 11h4.8M9.6 14.4h2.8" strokeLinecap="round" />
                </svg>
              </span>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <p className="max-w-2xl font-display text-[clamp(1.5rem,3.2vw,2.35rem)] leading-[1.15] font-semibold tracking-[-0.03em] text-olive-deep">
              Shopkeeper AI turns your everyday khata into a simple digital system.
            </p>
          </Reveal>
          <Reveal delay={180}>
            <a
              href="#features"
              className="group inline-flex items-center gap-2 rounded-md border border-olive-deep/25 px-4 py-2.5 text-[14px] font-semibold text-olive-deep transition-colors duration-200 hover:border-olive-deep hover:bg-olive-deep hover:text-ivory"
            >
              See the features
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2} />
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
