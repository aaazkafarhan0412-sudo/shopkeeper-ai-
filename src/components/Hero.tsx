import AppScreen from "./mocks/AppScreen";
import PaperKhata from "./mocks/PaperKhata";
import { Button, Eyebrow, Reveal } from "./ui";
import { ArrowRight, Check, Star, WhatsApp } from "./icons";
import { useCountUp, useInView } from "../lib/hooks";
import { pkr } from "../lib/data";

function PlayGlyph() {
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current">
      <svg viewBox="0 0 10 10" className="ml-[1px] h-2.5 w-2.5" fill="currentColor" aria-hidden>
        <path d="M2 1.2l6.4 3.8L2 8.8z" />
      </svg>
    </span>
  );
}

function StatValue({ to, prefix, suffix, label }: { to: number; prefix?: string; suffix?: string; label: string }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.5);
  const v = useCountUp(to, inView, 1600);
  return (
    <div
      ref={ref}
      className="pr-4 sm:border-l sm:border-line sm:px-7 sm:first:border-l-0 sm:first:pl-0"
    >
      <p className="num font-display text-[22px] leading-none font-bold tracking-[-0.02em] text-ink">
        {prefix}
        {Math.round(v).toLocaleString("en-US")}
        {suffix}
      </p>
      <p className="mt-1.5 text-[12.5px] leading-snug text-muted">{label}</p>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-[104px] pb-14 sm:pt-[124px] lg:pt-[132px] lg:pb-20">
      {/* ambient layers */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="rules absolute inset-y-0 right-0 w-1/2 opacity-45 [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_72%,transparent)]" />
        <div className="dot-grid absolute top-40 -left-24 h-72 w-72 opacity-50 [mask-image:radial-gradient(circle,black,transparent_70%)]" />
        <div className="absolute -top-16 right-[8%] h-80 w-80 rounded-full bg-sage/18 blur-3xl" />
        <p className="urdu absolute top-24 right-[6%] hidden text-[64px] text-olive/10 select-none lg:block">کھاتہ</p>
      </div>

      <div className="mx-auto grid max-w-[1240px] items-center gap-14 px-5 sm:px-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,1fr)] lg:gap-10">
        {/* ---------------- copy ---------------- */}
        <div className="max-w-[38rem]">
          <Reveal>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-olive/18 bg-paper/80 py-1.5 pr-3.5 pl-2 text-[12.5px] font-medium text-ink/80 shadow-[0_1px_0_rgba(255,255,255,.7)_inset]">
              <span className="relative flex h-2 w-2">
                <span className="anim-pulse absolute inline-flex h-full w-full rounded-full bg-flame" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-flame" />
              </span>
              Digital khata for Pakistani shops
              <span aria-hidden className="h-3 w-px bg-line" />
              <span className="urdu text-[13px] leading-[1.9] text-olive">اب ڈیجیٹل</span>
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-6 font-display text-[clamp(2.65rem,7.4vw,4.5rem)] leading-[0.97] font-extrabold tracking-[-0.042em] text-ink">
              Your Khata,
              <br />
              <span className="relative inline-block text-olive">
                Now Smarter.
                <svg
                  viewBox="0 0 320 22"
                  preserveAspectRatio="none"
                  className="anim-draw absolute -bottom-1 left-0 h-[14px] w-full text-flame"
                  aria-hidden
                >
                  <path
                    d="M4 15c58-9 128-12 190-8 40 2.5 78 6 122 3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
          </Reveal>

          <Reveal delay={150}>
            <p className="mt-7 text-[17.5px] leading-[1.65] text-muted sm:text-[18.5px]">
              Manage customer credit, payments, transactions and shop records digitally — without the hassle of paper
              notebooks.
            </p>
          </Reveal>

          <Reveal delay={220}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href="#get-started" size="lg" className="w-full sm:w-auto">
                Get Started Free
                <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2} />
              </Button>
              <Button href="#how-it-works" size="lg" variant="outline" className="w-full sm:w-auto">
                <PlayGlyph />
                See How It Works
              </Button>
            </div>
          </Reveal>

          <Reveal delay={280}>
            <ul className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13.5px] text-muted">
              {["Free 30-day trial", "No card required", "Urdu · English · Roman Urdu"].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-olive" strokeWidth={2.6} />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={340}>
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-6 border-t border-line pt-6 sm:grid-cols-3">
              <StatValue to={12400} suffix="+" label="shops registered across Pakistan" />
              <StatValue to={21} prefix="Rs. " suffix=" arab" label="of udhaar recorded in khata" />
              <div className="col-span-2 pr-4 sm:col-span-1 sm:border-l sm:border-line sm:px-7">
                <p className="flex items-center gap-1.5 font-display text-[22px] leading-none font-bold text-ink">
                  4.8
                  <span className="flex gap-[2px] text-flame" aria-hidden>
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star key={i} className="h-3.5 w-3.5" />
                    ))}
                  </span>
                </p>
                <p className="mt-1.5 text-[12.5px] leading-snug text-muted">average shopkeeper rating</p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ---------------- visual ---------------- */}
        <Reveal mode="scale" delay={200} className="relative">
          <div className="relative mx-auto flex w-full max-w-[520px] flex-col items-center gap-5 sm:min-h-[600px] sm:block sm:space-y-0">
            {/* paper khata (the "before") */}
            <div className="absolute top-10 left-0 hidden z-0 sm:block lg:-left-4">
              <PaperKhata />
              <span
                aria-hidden
                className="absolute -right-6 bottom-16 hidden h-16 w-16 rotate-[8deg] text-flame/70 lg:block"
              >
                <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 6">
                  <path d="M6 40C22 52 44 44 54 22" strokeLinecap="round" />
                  <path d="M50 14l6 7-8 5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>

            {/* the app */}
            <div className="anim-float-slow relative z-10 sm:mx-auto" style={{ ["--rot" as string]: "1.5deg" }}>
              <AppScreen />
            </div>

            {/* floating: payment received */}
            <div className="anim-float relative z-20 w-full max-w-[300px] rotate-[-1.5deg] rounded-lg border border-line bg-paper p-3 shadow-[var(--shadow-lift)] sm:absolute sm:top-6 sm:left-0 sm:w-[206px] sm:max-w-none sm:rotate-[-2.5deg] lg:-left-6">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-sage/30 text-olive-deep">
                  <Check className="h-3.5 w-3.5" strokeWidth={2.6} />
                </span>
                <div className="min-w-0">
                  <p className="font-display text-[12.5px] leading-tight font-bold text-ink">Payment received</p>
                  <p className="mt-0.5 truncate text-[11px] text-muted">Bilal Ahmed · Cash</p>
                </div>
                <span className="num ml-auto shrink-0 text-[12.5px] font-semibold text-olive">{pkr(3000)}</span>
              </div>
              <div className="mt-2.5 flex items-center justify-between border-t border-line-soft pt-2 text-[10.5px]">
                <span className="text-muted">Balance now</span>
                <span className="font-semibold text-olive">Rs. 0 · Cleared</span>
              </div>
            </div>

            {/* floating: whatsapp reminder */}
            <div
              className="anim-float relative z-20 w-full max-w-[300px] rotate-[1.5deg] rounded-lg border border-line bg-paper p-3 shadow-[var(--shadow-lift)] sm:absolute sm:bottom-10 sm:right-0 sm:w-[226px] sm:max-w-none sm:rotate-[2.5deg] lg:-right-4"
              style={{ animationDelay: "1.4s" }}
            >
              <div className="flex items-center gap-2">
                <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-[#128C7E]/12 text-[#128C7E]">
                  <WhatsApp className="h-3.5 w-3.5" />
                  <span className="anim-pulse absolute inset-0 rounded-full bg-[#128C7E]/25" />
                </span>
                <p className="font-display text-[11.5px] font-bold tracking-[-0.01em] text-ink">WhatsApp reminder</p>
                <span className="ml-auto text-[10px] font-semibold text-muted">9:41 am</span>
              </div>
              <p className="mt-2.5 rounded-md rounded-tl-none bg-sage/22 px-2.5 py-2 text-[11.5px] leading-snug text-ink/85 ring-1 ring-olive/10">
                Assalam-o-Alaikum Ahmed, your current balance is {pkr(4500)}. Thank you.
              </p>
              <div className="mt-1.5 flex items-center justify-end gap-1 text-[10px] text-muted">
                Sent
                <svg viewBox="0 0 20 12" className="h-2.5 w-4 text-tick" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
                  <path d="M1 6.6l3.4 3.4L11 2.6" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7.6 9.9L9 11l6.6-8.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* ground shadow */}
            <span
              aria-hidden
              className="absolute bottom-2 left-1/2 z-0 hidden h-8 w-[62%] -translate-x-1/2 rounded-[50%] bg-olive-deep/12 blur-xl sm:block"
            />
          </div>
        </Reveal>
      </div>

      <div className="mx-auto mt-16 max-w-[1240px] px-5 sm:px-8 lg:mt-20">
        <Reveal>
          <div className="flex items-center gap-4 border-y border-line py-3.5">
            <Eyebrow className="shrink-0">Works for</Eyebrow>
            <div className="scrollbar-thin flex flex-1 gap-7 overflow-hidden text-[13px] font-medium whitespace-nowrap text-muted">
              {[
                "General stores",
                "Kirana shops",
                "Mobile & electronics",
                "Tailors & boutiques",
                "Hardware stores",
                "Medical stores",
                "Bakeries",
                "Wholesale dealers",
              ].map((s) => (
                <span key={s} className="flex items-center gap-7">
                  {s}
                  <span aria-hidden className="h-1 w-1 rounded-full bg-sage" />
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
