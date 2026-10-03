import type { ReactNode } from "react";
import { cn } from "../utils/cn";
import { useInView } from "../lib/hooks";

/* ---------------- Reveal ---------------- */
export function Reveal({
  children,
  delay = 0,
  mode = "up",
  className,
  threshold = 0.15,
}: {
  children: ReactNode;
  delay?: number;
  mode?: "up" | "left" | "scale";
  className?: string;
  threshold?: number;
}) {
  const [ref, inView] = useInView<HTMLDivElement>(threshold);
  return (
    <div
      ref={ref}
      data-reveal={mode}
      style={{ ["--reveal-delay" as string]: `${delay}ms` }}
      className={cn(inView && "is-in", className)}
    >
      {children}
    </div>
  );
}

/* ---------------- Button ---------------- */
type Variant = "primary" | "olive" | "outline" | "ghost" | "quiet";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-flame text-white shadow-[0_1px_0_rgba(255,255,255,.25)_inset,0_10px_22px_-14px_rgba(192,86,26,.9)] hover:bg-flame-dark active:translate-y-[1px]",
  olive:
    "bg-olive text-ivory shadow-[0_10px_22px_-16px_rgba(54,61,43,.95)] hover:bg-olive-deep active:translate-y-[1px]",
  outline:
    "border border-olive/30 text-ink bg-paper/70 hover:border-olive hover:bg-olive hover:text-ivory active:translate-y-[1px]",
  ghost: "text-ink/80 hover:text-ink hover:bg-olive/8",
  quiet: "border border-line bg-paper text-ink hover:border-olive/45 hover:bg-ivory",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[13.5px]",
  md: "h-11 px-5 text-[15px]",
  lg: "h-[52px] px-[26px] text-base",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  className,
  onClick,
  type = "button",
  ariaLabel,
  disabled,
}: {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  href?: string;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  ariaLabel?: string;
  disabled?: boolean;
}) {
  const cls = cn(
    "btn-sheen inline-flex items-center justify-center gap-2 rounded-md font-semibold tracking-[-0.01em]",
    "transition-[background-color,color,border-color,transform,box-shadow] duration-200 ease-out",
    "disabled:pointer-events-none disabled:opacity-55",
    variants[variant],
    sizes[size],
    className,
  );
  if (href) {
    return (
      <a href={href} className={cls} aria-label={ariaLabel} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick} aria-label={ariaLabel} disabled={disabled}>
      {children}
    </button>
  );
}

/* ---------------- Eyebrow ---------------- */
export function Eyebrow({
  children,
  tone = "olive",
  className,
}: {
  children: ReactNode;
  tone?: "olive" | "flame" | "light";
  className?: string;
}) {
  const tones = {
    olive: "text-olive",
    flame: "text-flame",
    light: "text-sage",
  };
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 text-[11.5px] font-semibold uppercase tracking-[0.19em]",
        tones[tone],
        className,
      )}
    >
      <span aria-hidden className={cn("h-px w-7", tone === "light" ? "bg-sage/60" : "bg-current opacity-45")} />
      {children}
    </div>
  );
}

/* ---------------- Section heading ---------------- */
export function SectionHead({
  eyebrow,
  title,
  lead,
  tone = "dark",
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  tone?: "dark" | "light";
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "mx-auto max-w-3xl text-center", className)}>
      {eyebrow && (
        <Reveal>
          <Eyebrow tone={tone === "light" ? "light" : "olive"} className={align === "center" ? "justify-center" : ""}>
            {eyebrow}
          </Eyebrow>
        </Reveal>
      )}
      <Reveal delay={70}>
        <h2
          className={cn(
            "mt-5 font-display text-[clamp(2rem,4.4vw,3.35rem)] leading-[1.04] font-semibold tracking-[-0.03em]",
            tone === "light" ? "text-ivory" : "text-ink",
          )}
        >
          {title}
        </h2>
      </Reveal>
      {lead && (
        <Reveal delay={140}>
          <p
            className={cn(
              "mt-5 max-w-2xl text-[17px] leading-relaxed",
              align === "center" && "mx-auto",
              tone === "light" ? "text-ivory/72" : "text-muted",
            )}
          >
            {lead}
          </p>
        </Reveal>
      )}
    </div>
  );
}

/* ---------------- Status chip ---------------- */
export function StatusChip({
  status,
  className,
}: {
  status: "clear" | "due" | "overdue";
  className?: string;
}) {
  const map = {
    clear: { label: "Paid up", cls: "bg-sage/28 text-olive-deep border-olive/18" },
    due: { label: "Due", cls: "bg-beige/70 text-[#7A6234] border-[#C9B58A]" },
    overdue: { label: "Overdue", cls: "bg-flame-tint text-flame-dark border-flame/25" },
  } as const;
  const s = map[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-[3px] text-[11px] font-semibold tracking-[0.02em] whitespace-nowrap",
        s.cls,
        className,
      )}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {s.label}
    </span>
  );
}

/* ---------------- Avatar ---------------- */
export function Avatar({ name, className }: { name: string; className?: string }) {
  const initials = name
    .split(" ")
    .filter((w) => !["Al", "Ul"].includes(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  const hues = ["bg-olive/12 text-olive-deep", "bg-beige text-[#7A6234]", "bg-sage/30 text-olive-deep"];
  const h = hues[name.length % hues.length];
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md border border-olive/12 font-display text-[13px] font-semibold",
        h,
        className,
      )}
    >
      {initials}
    </span>
  );
}
