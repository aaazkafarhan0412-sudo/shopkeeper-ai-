import { useState } from "react";
import { cn } from "../utils/cn";
import { Logo, Mail, MapPin, Phone, Facebook, Instagram, YouTube, LinkedIn, WhatsApp, ArrowRight } from "./icons";
import { useToast } from "./Toast";

const columns: { title: string; links: { label: string; href?: string; note?: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Dashboard preview", href: "#dashboard" },
      { label: "Customer profile", href: "#customer-profile" },
      { label: "WhatsApp reminders", href: "#whatsapp" },
      { label: "Media kit · HD screens", href: "?screens" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ", href: "#faq" },
      { label: "Contact", href: "#contact" },
      { label: "Help centre", note: "Help centre articles open inside the app." },
      { label: "Report a problem", note: "Thanks — our team replies within one working day." },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#legal" },
      { label: "Terms of Service", href: "#legal" },
      { label: "Data & security", href: "#legal" },
    ],
  },
];

const socials = [
  { label: "Facebook", Icon: Facebook },
  { label: "Instagram", Icon: Instagram },
  { label: "YouTube", Icon: YouTube },
  { label: "LinkedIn", Icon: LinkedIn },
];

export default function Footer() {
  const notify = useToast();
  const [lang, setLang] = useState<"en" | "ur">("en");

  return (
    <footer className="relative overflow-hidden bg-[#1D2219] text-ivory/70">
      <span aria-hidden className="dot-grid pointer-events-none absolute inset-x-0 top-0 h-56 opacity-[0.13]" />

      <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8">
        {/* top */}
        <div className="grid gap-12 py-14 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,2fr)] lg:py-16">
          <div id="contact" className="scroll-mt-28">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-olive text-ivory">
                <Logo className="h-6 w-6" />
              </span>
              <span className="font-display text-[17px] leading-none font-bold tracking-[-0.015em] text-ivory">
                SHOPKEEPER<span className="ml-1.5 text-sage">AI</span>
              </span>
            </div>

            <p className="mt-5 font-display text-[20px] leading-snug font-semibold tracking-[-0.02em] text-ivory">
              {lang === "en" ? "Smarter khata. Simpler business." : "سمجھ کھاتہ۔ آسان کاروبار۔"}
            </p>
            <p
              className={cn(
                "mt-2 max-w-sm text-[14px] leading-relaxed text-ivory/55",
                lang === "ur" && "urdu text-[15px] leading-[2.6]",
              )}
            >
              {lang === "en"
                ? "The digital register for Pakistani shops — customer credit, payments and reminders, all in one place."
                : "پاکستانی دکانوں کا ڈیجیٹل کھاتہ — ادھار، ادائیگی اور یاد دہانی، ایک ہی جگہ۔"}
            </p>

            {/* language switch */}
            <div className="mt-5 inline-flex rounded-md border border-ivory/15 p-1">
              {[
                { id: "en" as const, label: "English" },
                { id: "ur" as const, label: "اردو" },
              ].map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setLang(l.id)}
                  aria-pressed={lang === l.id}
                  className={cn(
                    "rounded-[5px] px-3 py-1.5 text-[12.5px] font-semibold transition-colors duration-200",
                    lang === l.id ? "bg-sage text-olive-deep" : "text-ivory/60 hover:text-ivory",
                  )}
                >
                  {l.label}
                </button>
              ))}
            </div>

            <ul className="mt-8 space-y-3 text-[14px]">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                <span>Office 12, Gulberg III, Lahore, Pakistan</span>
              </li>
              <li>
                <a href="mailto:salam@shopkeeperai.pk" className="flex items-center gap-3 transition-colors hover:text-ivory">
                  <Mail className="h-4 w-4 shrink-0 text-sage" />
                  salam@shopkeeperai.pk
                </a>
              </li>
              <li>
                <a href="tel:+928007467533" className="flex items-center gap-3 transition-colors hover:text-ivory">
                  <Phone className="h-4 w-4 shrink-0 text-sage" />
                  <span className="num">0800-SHOPKEEPER</span>
                </a>
              </li>
            </ul>

            <div className="mt-7 flex items-center gap-2.5">
              {socials.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  aria-label={`Shopkeeper AI on ${s.label}`}
                  onClick={() => notify({ kind: "ok", title: s.label, body: "Follow Shopkeeper AI for shopkeeper tips in Urdu." })}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-ivory/15 text-ivory/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-sage/60 hover:bg-ivory/8 hover:text-ivory"
                >
                  <s.Icon className="h-4 w-4" />
                </button>
              ))}
              <button
                type="button"
                onClick={() => notify({ kind: "wa", title: "WhatsApp support", body: "Message +92 300 111 5428 (Mon–Sat, 9am–9pm)." })}
                aria-label="Chat with support on WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-[#128C7E]/40 bg-[#128C7E]/12 text-[#4FD1C5] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#128C7E]/22"
              >
                <WhatsApp className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* link columns */}
          <div className="grid gap-10 sm:grid-cols-3">
            {columns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <p className="font-display text-[12px] font-bold tracking-[0.16em] text-ivory uppercase">{col.title}</p>
                <ul className="mt-4 space-y-2.5 text-[14px]">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      {l.href ? (
                        <a
                          href={l.href}
                          className="group inline-flex items-center gap-1.5 transition-colors duration-200 hover:text-ivory"
                        >
                          <span className="h-px w-0 bg-sage transition-all duration-200 group-hover:w-3" />
                          {l.label}
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => notify({ kind: "ok", title: l.label, body: l.note })}
                          className="group inline-flex items-center gap-1.5 text-left transition-colors duration-200 hover:text-ivory"
                        >
                          <span className="h-px w-0 bg-sage transition-all duration-200 group-hover:w-3" />
                          {l.label}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* app badges */}
        <div className="flex flex-col gap-4 border-t border-ivory/12 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[14px] text-ivory/60">
            Get the app — <span className="text-ivory/85">Android, iPhone and shop-counter mode.</span>
          </p>
          <div className="flex flex-wrap gap-2.5">
            {[
              { store: "Google Play", sub: "Get it on" },
              { store: "App Store", sub: "Download on the" },
            ].map((b) => (
              <button
                key={b.store}
                type="button"
                onClick={() =>
                  notify({ kind: "ok", title: `${b.store} link`, body: "We'll SMS the download link to your registered number." })
                }
                className="group flex items-center gap-3 rounded-lg border border-ivory/18 px-4 py-2.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-sage/55 hover:bg-ivory/6"
              >
                <span className="text-ivory/80">
                  {b.store === "Google Play" ? (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                      <path d="M3.6 2.3c-.3.3-.5.8-.5 1.4v16.6c0 .6.2 1.1.5 1.4l.1.1 9.3-9.3v-.2z" />
                      <path d="M16.1 15.6l-3.1-3.1v-.2l3.1-3.1.1.1 3.7 2.1c1 .6 1 1.6 0 2.2z" opacity=".85" />
                      <path d="M16.2 15.5L13 12.3l-9.4 9.4c.4.4 1 .4 1.7 0z" opacity=".65" />
                      <path d="M16.2 9.1L5.3 2.9c-.7-.4-1.3-.3-1.7 0L13 12.3z" opacity=".45" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                      <path d="M16.4 12.7c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.7.8-3.4.8-.7 0-1.8-.8-2.9-.8-1.5 0-2.9.9-3.7 2.2-1.5 2.7-.4 6.6 1.1 8.8.7 1 1.6 2.2 2.7 2.2 1.1 0 1.5-.7 2.8-.7s1.6.7 2.8.7 1.9-1 2.6-2.1c.8-1.2 1.2-2.4 1.2-2.5-.1 0-2.3-.9-2.3-3.5zM14.3 5.9c.6-.7 1-1.7.9-2.7-.9 0-2 .6-2.6 1.3-.6.6-1 1.6-.9 2.6 1 .1 2-.5 2.6-1.2z" />
                    </svg>
                  )}
                </span>
                <span>
                  <span className="block text-[10px] tracking-wide text-ivory/65 uppercase">{b.sub}</span>
                  <span className="block font-display text-[14px] font-bold text-ivory">{b.store}</span>
                </span>
                <ArrowRight className="ml-1 h-3.5 w-3.5 text-ivory/40 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            ))}
          </div>
        </div>

        {/* bottom */}
        <div id="legal" className="scroll-mt-28 border-t border-ivory/12 py-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-[12.5px] text-ivory/60">
              © 2026 Shopkeeper AI (Pvt) Ltd · Lahore, Pakistan · NTN 4471122-8
            </p>
            <p className="max-w-xl text-[12.5px] leading-relaxed text-ivory/60">
              <span className="font-semibold text-ivory/65">Privacy Policy & Terms:</span> your khata data is encrypted
              in transit and at rest, backed up nightly, never sold, and exportable by you at any time. By using
              Shopkeeper AI you agree to fair-use limits on WhatsApp reminders.
            </p>
          </div>
          <p className="mt-5 flex items-center gap-2 text-[12px] text-ivory/55">
            <span aria-hidden className="inline-flex h-3.5 w-5 overflow-hidden rounded-[2px]">
              <span className="h-full w-1/2 bg-[#0E5C2F]" />
              <span className="h-full w-1/2 bg-ivory/85" />
            </span>
            Designed and built in Pakistan for Pakistani shopkeepers.
          </p>
        </div>
      </div>
    </footer>
  );
}
