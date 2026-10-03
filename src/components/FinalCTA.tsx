import { Button, Eyebrow, Reveal } from "./ui";
import { ArrowRight, Check, Clock, WhatsApp } from "./icons";
import { useToast } from "./Toast";

function FakeQR() {
  const cells = 21;
  let seed = 20260319;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  const inFinder = (x: number, y: number) =>
    (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);

  const modules: { x: number; y: number }[] = [];
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      if (inFinder(x, y)) continue;
      if (rnd() > 0.53) modules.push({ x, y });
    }
  }

  return (
    <svg viewBox="0 0 21 21" className="h-[104px] w-[104px] text-olive-deep" aria-hidden>
      <rect width="21" height="21" fill="#FFFFFF" />
      {modules.map((m, i) => (
        <rect key={i} x={m.x} y={m.y} width="1" height="1" fill="currentColor" />
      ))}
      {[
        [0, 0],
        [14, 0],
        [0, 14],
      ].map(([ox, oy]) => (
        <g key={`${ox}-${oy}`}>
          <rect x={ox} y={oy} width="7" height="7" fill="currentColor" />
          <rect x={ox + 1} y={oy + 1} width="5" height="5" fill="#FFFFFF" />
          <rect x={ox + 2} y={oy + 2} width="3" height="3" fill="currentColor" />
        </g>
      ))}
    </svg>
  );
}

export default function FinalCTA() {
  const notify = useToast();

  return (
    <section id="get-started" className="relative scroll-mt-24 overflow-hidden bg-olive-deep py-20 lg:py-28">
      <span aria-hidden className="rules pointer-events-none absolute inset-0 opacity-[0.14]" />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-24 -bottom-32 h-[26rem] w-[26rem] rounded-full bg-flame/22 blur-3xl"
      />
      <span aria-hidden className="pointer-events-none absolute -top-20 left-[12%] h-64 w-64 rounded-full bg-sage/12 blur-3xl" />
      <p
        aria-hidden
        className="urdu pointer-events-none absolute -bottom-6 left-6 hidden text-[110px] leading-none text-ivory/[0.045] select-none lg:block"
      >
        کھاتہ
      </p>

      <div className="relative mx-auto grid max-w-[1240px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:gap-16">
        <div>
          <Reveal>
            <Eyebrow tone="light">Get started</Eyebrow>
          </Reveal>
          <Reveal delay={70}>
            <h2 className="mt-5 font-display text-[clamp(2.1rem,5vw,3.7rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-ivory">
              Ready to leave the
              <br className="hidden sm:block" /> paper khata behind?
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-6 max-w-xl text-[17.5px] leading-relaxed text-ivory/72">
              Start managing your customers and transactions with Shopkeeper AI. Your first 30 days are free, and you
              can keep using the free plan for up to 100 customers.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href="#home" size="lg" className="w-full sm:w-auto">
                Get Started Free
                <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2} />
              </Button>
              <button
                type="button"
                onClick={() =>
                  notify({
                    kind: "wa",
                    title: "Demo request noted",
                    body: "Our team will call you within one working day, in Urdu.",
                  })
                }
                className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-md border border-ivory/25 px-6 text-base font-semibold text-ivory transition-colors duration-200 hover:border-ivory/60 hover:bg-ivory/8 sm:w-auto"
              >
                <Clock className="h-4 w-4" />
                Book a 10-minute demo
              </button>
            </div>
          </Reveal>

          <Reveal delay={260}>
            <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-[13.5px] text-ivory/65">
              {["Free 30-day trial", "No card required", "Urdu support included", "Cancel anytime"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-sage" strokeWidth={2.6} />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* ticket card */}
        <Reveal mode="scale" delay={160}>
          <div className="relative mx-auto w-full max-w-sm">
            <div className="relative rounded-xl border border-dashed border-ivory/25 bg-ivory/[0.06] p-6 backdrop-blur-sm">
              <div className="flex items-start gap-5">
                <div className="shrink-0 rounded-md bg-paper p-1.5 shadow-[0_10px_24px_-14px_rgba(0,0,0,.8)]">
                  <FakeQR />
                </div>
                <div className="min-w-0">
                  <p className="font-display text-[16px] leading-tight font-bold text-ivory">Install in 2 minutes</p>
                  <p className="mt-2 text-[13px] leading-snug text-ivory/65">
                    Scan with your phone camera, or search <span className="font-semibold text-ivory/85">Shopkeeper AI</span>{" "}
                    on the Play Store.
                  </p>
                  <span className="num mt-3 inline-block rounded border border-ivory/20 px-2 py-0.5 text-[11px] text-ivory/60">
                    v2.4 · 18 MB
                  </span>
                </div>
              </div>

              <span aria-hidden className="my-5 block border-t border-dashed border-ivory/20" />

              <ul className="space-y-2.5">
                {[
                  "Unlimited customers on paid plans",
                  "WhatsApp reminders from your number",
                  "Urdu, Roman Urdu and English",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-[13.5px] text-ivory/75">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage/25 text-sage">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() =>
                  notify({ kind: "wa", title: "We'll send the install link", body: "Share your number with our team on WhatsApp." })
                }
                className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-flame px-4 py-3 text-[14px] font-bold text-white transition-colors duration-200 hover:bg-flame-dark"
              >
                <WhatsApp className="h-4 w-4" />
                Send me the install link
              </button>
            </div>
            {/* ticket notches */}
            <span aria-hidden className="absolute top-1/2 -left-[9px] h-4 w-4 -translate-y-1/2 rounded-full bg-olive-deep" />
            <span aria-hidden className="absolute top-1/2 -right-[9px] h-4 w-4 -translate-y-1/2 rounded-full bg-olive-deep" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
