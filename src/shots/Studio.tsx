import { useEffect, useMemo, useRef, useState } from "react";
import { zipSync } from "fflate";
import { cn } from "../utils/cn";
import { ArrowRight, Check, Close, Download, Logo } from "../components/icons";
import { GROUPS, SHOTS, type ShotDef, type ShotGroup } from "./registry";
import { toLocalBlob, waitForShotApi } from "./capture";

type ScaleMode = "auto" | 1 | 2 | 3;
type Format = "image/png" | "image/jpeg";
type CardStatus = { state: "working" | "done" | "error"; info?: string };
type Batch = { total: number; done: number; current: string };
type Summary = { ok: number; failed: string[]; file?: string; cancelled: boolean };
type Job = { def: ShotDef; nonce: string };

const GRID: Record<ShotGroup, string> = {
  boards: "grid gap-6 md:grid-cols-2",
  devices: "grid grid-cols-2 gap-5 lg:grid-cols-4",
  desktop: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
  mobile: "grid grid-cols-2 gap-5 lg:grid-cols-4",
};

function scaleFor(def: ShotDef, mode: ScaleMode): number {
  if (mode !== "auto") return mode;
  return GROUPS.find((g) => g.id === def.group)?.recommended ?? 2;
}

function formatFor(def: ShotDef, format: Format): Format {
  return def.transparent ? "image/png" : format;
}

const extOf = (format: Format) => (format === "image/png" ? "png" : "jpg");
const scaleTag = (scale: number) => `${Number(scale.toFixed(2))}x`;

function outputLabel(def: ShotDef, scale: number) {
  const w = Math.round(def.width * scale);
  return def.height === "auto" ? `${w} px wide` : `${w} × ${Math.round(def.height * scale)} px`;
}

function saveBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 5000);
}

function Spinner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("inline-block h-5 w-5 animate-spin rounded-full border-2 border-olive/25 border-t-olive", className)}
    />
  );
}

function Segmented<T extends string | number>({
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  label: string;
  value: T;
  options: { v: T; l: string }[];
  onChange: (v: T) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">{label}</span>
      <div className="flex gap-1 rounded-md bg-ivory p-1 ring-1 ring-line" role="group" aria-label={label}>
        {options.map((o) => (
          <button
            key={String(o.v)}
            type="button"
            disabled={disabled}
            aria-pressed={value === o.v}
            onClick={() => onChange(o.v)}
            className={cn(
              "rounded-[5px] px-3 py-1.5 text-[13px] font-semibold transition-colors duration-200 disabled:opacity-60",
              value === o.v ? "bg-olive text-ivory shadow-[0_4px_10px_-6px_rgba(54,61,43,1)]" : "text-muted hover:text-ink",
            )}
          >
            {o.l}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Live, scaled-down preview. Only mounted while near the viewport to keep memory low. */
function Preview({ def }: { def: ShotDef }) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);
  const [near, setNear] = useState(false);
  const viewHeight = def.previewHeight ?? (def.height === "auto" ? Math.round(def.width * 0.625) : def.height);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => setWidth(entries[0]?.contentRect.width ?? 0));
    ro.observe(el);
    const io = new IntersectionObserver((entries) => setNear(entries[0]?.isIntersecting ?? false), {
      rootMargin: "600px 0px",
    });
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  const scale = width > 0 ? width / def.width : 0;

  return (
    <div ref={boxRef} className="relative w-full overflow-hidden" style={{ aspectRatio: `${def.width} / ${viewHeight}` }}>
      {near && scale > 0 ? (
        <iframe
          src={`?shot=${def.id}`}
          title={`Preview of ${def.title}`}
          loading="lazy"
          tabIndex={-1}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 border-0"
          style={{ width: def.width, height: viewHeight, transform: `scale(${scale})`, transformOrigin: "0 0" }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner className="opacity-50" />
        </div>
      )}
    </div>
  );
}

function ShotCard({
  def,
  scale,
  format,
  status,
  disabled,
  onDownload,
}: {
  def: ShotDef;
  scale: number;
  format: Format;
  status?: CardStatus;
  disabled: boolean;
  onDownload: () => void;
}) {
  const working = status?.state === "working";
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-line bg-paper shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
      <div className={cn("relative border-b border-line", def.transparent ? "checker" : "bg-ivory")}>
        <Preview def={def} />
        {working && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ivory/75 backdrop-blur-[2px]">
            <Spinner />
            <span className="text-[12.5px] font-semibold text-olive-deep">Rendering…</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-[16px] leading-tight font-bold tracking-[-0.02em] text-ink">{def.title}</h3>
            <p className="mt-1 text-[12.5px] leading-snug text-muted">{def.note}</p>
          </div>
          {status?.state === "done" && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-sage/30 px-2 py-0.5 text-[11px] font-semibold text-olive-deep">
              <Check className="h-3 w-3" strokeWidth={3} /> Saved
            </span>
          )}
          {status?.state === "error" && (
            <span
              title={status.info}
              className="inline-flex shrink-0 items-center rounded-full bg-flame-tint px-2 py-0.5 text-[11px] font-semibold text-flame-dark"
            >
              Failed
            </span>
          )}
        </div>

        <p className="num mt-3 flex flex-wrap items-center gap-1.5 text-[11.5px] text-muted">
          {def.width} × {def.height === "auto" ? "auto" : def.height}
          <ArrowRight className="h-3 w-3" strokeWidth={2} />
          <span className="font-semibold text-ink">
            {status?.state === "done" && status.info ? status.info : outputLabel(def, scale)}
          </span>
          {def.transparent && <span className="text-olive">· transparent</span>}
        </p>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onDownload}
            disabled={disabled}
            className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md bg-olive px-3 text-[13px] font-semibold text-ivory transition-colors duration-200 hover:bg-olive-deep active:translate-y-px disabled:pointer-events-none disabled:opacity-55"
          >
            <Download className="h-4 w-4" />
            Download {format === "image/png" ? "PNG" : "JPG"}
          </button>
          <a
            href={`?shot=${def.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-line px-3 text-[13px] font-semibold text-ink transition-colors duration-200 hover:border-olive/45 hover:bg-ivory"
          >
            Open
            <ArrowRight className="h-3.5 w-3.5 -rotate-45" strokeWidth={2} />
          </a>
        </div>
      </div>
    </article>
  );
}

export default function Studio() {
  const [mode, setMode] = useState<ScaleMode>("auto");
  const [format, setFormat] = useState<Format>("image/png");
  const [status, setStatus] = useState<Record<string, CardStatus>>({});
  const [batch, setBatch] = useState<Batch | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const cancelRef = useRef(false);
  const runningRef = useRef(false);
  const busy = batch !== null;
  const visible = useMemo(() => SHOTS.filter((s) => !s.hidden), []);

  useEffect(() => {
    document.title = "Media kit · HD screens — Shopkeeper AI";
  }, []);

  async function renderShot(def: ShotDef, scale: number, fmt: Format) {
    const nonce = Math.random().toString(36).slice(2, 10);
    setJob({ def, nonce });
    const api = await waitForShotApi(() => frameRef.current, def.id, nonce, 90000);
    const res = await api.capture(scale, fmt);
    return { ...res, blob: await toLocalBlob(res.blob, fmt) };
  }

  async function run(defs: ShotDef[], zipName?: string) {
    if (busy || runningRef.current || !defs.length) return;
    runningRef.current = true;
    try {
      await runBatch(defs, zipName);
    } finally {
      runningRef.current = false;
    }
  }

  async function runBatch(defs: ShotDef[], zipName?: string) {
    cancelRef.current = false;
    setSummary(null);
    const files: Record<string, Uint8Array> = {};
    const failed: string[] = [];
    let ok = 0;

    for (let i = 0; i < defs.length; i++) {
      if (cancelRef.current) break;
      const def = defs[i];
      setBatch({ total: defs.length, done: i, current: def.title });
      setStatus((s) => ({ ...s, [def.id]: { state: "working" } }));
      try {
        const fmt = formatFor(def, format);
        const res = await renderShot(def, scaleFor(def, mode), fmt);
        const name = `${def.file}@${scaleTag(res.scale)}.${extOf(fmt)}`;
        if (zipName) {
          const folder = GROUPS.find((g) => g.id === def.group)?.folder ?? def.group;
          files[`${folder}/${name}`] = new Uint8Array(await res.blob.arrayBuffer());
        } else {
          saveBlob(res.blob, `shopkeeper-ai-${GROUPS.find((g) => g.id === def.group)?.id ?? "screen"}-${name}`);
        }
        ok++;
        setStatus((s) => ({ ...s, [def.id]: { state: "done", info: `${res.width} × ${res.height} px` } }));
      } catch (err) {
        console.error(err);
        failed.push(def.title);
        setStatus((s) => ({
          ...s,
          [def.id]: { state: "error", info: err instanceof Error ? err.message : "Export failed" },
        }));
      }
    }

    setJob(null);
    let file: string | undefined;
    if (zipName && ok > 0) {
      setBatch({ total: defs.length, done: defs.length, current: "Packing ZIP…" });
      await new Promise((r) => window.setTimeout(r, 40));
      const zipped = zipSync(files, { level: 0 });
      saveBlob(new Blob([zipped as Uint8Array<ArrayBuffer>], { type: "application/zip" }), zipName);
      file = zipName;
    }
    setBatch(null);
    setSummary({ ok, failed, file, cancelled: cancelRef.current });
  }

  const allZip = `shopkeeper-ai-screens${mode === "auto" ? "" : `@${mode}x`}.zip`;

  return (
    <div className="relative min-h-screen bg-ivory">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(900px_420px_at_85%_-10%,rgba(168,184,159,0.35),transparent_62%)]"
      />

      {/* header */}
      <header className="sticky top-0 z-40 border-b border-line bg-ivory/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1320px] items-center gap-3 px-5 sm:px-8">
          <a href="./" className="flex items-center gap-2.5 rounded-md" aria-label="Shopkeeper AI — back to website">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-olive text-ivory">
              <Logo className="h-[22px] w-[22px]" />
            </span>
            <span className="font-display text-[16px] font-bold tracking-[-0.015em] text-ink">
              SHOPKEEPER<span className="ml-1.5 text-olive">AI</span>
            </span>
          </a>
          <span className="hidden rounded-full border border-olive/20 bg-paper px-2.5 py-1 text-[11px] font-semibold tracking-[0.14em] text-olive uppercase sm:inline-flex">
            Media kit
          </span>
          <a
            href="./"
            className="ml-auto inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-[14px] font-semibold text-muted transition-colors hover:bg-olive/8 hover:text-ink"
          >
            <ArrowRight className="h-4 w-4 rotate-180" strokeWidth={2} />
            Back to website
          </a>
        </div>
      </header>

      <main className="relative mx-auto max-w-[1320px] px-5 pt-14 pb-36 sm:px-8 lg:pt-20">
        {/* intro */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2.5 text-[11.5px] font-semibold tracking-[0.19em] text-olive uppercase">
              <span aria-hidden className="h-px w-7 bg-current opacity-45" />
              Media kit
            </p>
            <h1 className="mt-5 font-display text-[clamp(2.4rem,5.6vw,4rem)] leading-[1] font-extrabold tracking-[-0.04em] text-ink">
              HD screens for your <span className="text-olive">portfolio.</span>
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-muted">
              Every image is rendered from the live Shopkeeper AI code — the same components as the website — and
              exported as a crisp, pixel-perfect file. Download one screen, a set, or everything as a ZIP.
            </p>
          </div>
          <ul className="grid grid-cols-3 gap-3">
            {[
              { v: String(visible.length), l: "screens & boards" },
              { v: "4800 px", l: "widest export (boards at 3×)" },
              { v: "PNG", l: "transparent phone mockups" },
            ].map((s) => (
              <li key={s.l} className="rounded-lg border border-line bg-paper p-4 shadow-[var(--shadow-card)]">
                <p className="num font-display text-[24px] leading-none font-bold tracking-[-0.03em] text-ink">{s.v}</p>
                <p className="mt-2 text-[12.5px] leading-snug text-muted">{s.l}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* controls */}
        <div className="sticky top-[76px] z-30 mt-10 rounded-xl border border-line bg-paper/95 p-4 shadow-[var(--shadow-card)] backdrop-blur sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
              <Segmented<ScaleMode>
                label="Resolution"
                value={mode}
                onChange={setMode}
                disabled={busy}
                options={[
                  { v: "auto", l: "Recommended" },
                  { v: 1, l: "1×" },
                  { v: 2, l: "2×" },
                  { v: 3, l: "3×" },
                ]}
              />
              <Segmented<Format>
                label="Format"
                value={format}
                onChange={setFormat}
                disabled={busy}
                options={[
                  { v: "image/png", l: "PNG" },
                  { v: "image/jpeg", l: "JPG" },
                ]}
              />
            </div>
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center lg:justify-end">
              <p className="text-[12.5px] leading-snug text-muted">
                {mode === "auto" ? "Boards & desktop at 2×, phones at 3×." : `Everything at ${mode}×.`} Device mockups
                always export as transparent PNG.
              </p>
              <button
                type="button"
                onClick={() => run(visible, allZip)}
                disabled={busy}
                className="btn-sheen inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-flame px-5 text-[15px] font-semibold text-white shadow-[0_10px_22px_-14px_rgba(192,86,26,.9)] transition-colors duration-200 hover:bg-flame-dark active:translate-y-px disabled:pointer-events-none disabled:opacity-55"
              >
                <Download className="h-[18px] w-[18px]" />
                Download all ({visible.length}) · ZIP
              </button>
            </div>
          </div>
        </div>
        <p className="mt-3 text-[12.5px] text-muted">
          Works best in <span className="font-semibold text-ink">Chrome or Edge on a laptop or desktop</span>. Each
          screen takes a few seconds — keep this tab open while it renders.
        </p>

        {/* groups */}
        {GROUPS.map((g) => {
          const items = visible.filter((s) => s.group === g.id);
          return (
            <section key={g.id} className="mt-16" aria-labelledby={`group-${g.id}`}>
              <div className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2
                    id={`group-${g.id}`}
                    className="font-display text-[26px] leading-tight font-bold tracking-[-0.025em] text-ink"
                  >
                    {g.title}
                    <span className="num ml-2 text-[14px] font-semibold text-muted">{items.length}</span>
                  </h2>
                  <p className="mt-1.5 max-w-2xl text-[14.5px] leading-relaxed text-muted">{g.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => run(items, `shopkeeper-ai-${g.folder}.zip`)}
                  disabled={busy}
                  className="inline-flex h-10 shrink-0 items-center justify-center gap-2 self-start rounded-md border border-olive/30 bg-paper px-4 text-[13.5px] font-semibold text-ink transition-colors duration-200 hover:border-olive hover:bg-olive hover:text-ivory disabled:pointer-events-none disabled:opacity-55 sm:self-auto"
                >
                  <Download className="h-4 w-4" />
                  Download set · ZIP
                </button>
              </div>
              <div className={cn("mt-6", GRID[g.id])}>
                {items.map((def) => (
                  <ShotCard
                    key={def.id}
                    def={def}
                    scale={scaleFor(def, mode)}
                    format={formatFor(def, format)}
                    status={status[def.id]}
                    disabled={busy}
                    onDownload={() => run([def])}
                  />
                ))}
              </div>
            </section>
          );
        })}

        {/* tips */}
        <section className="mt-20 rounded-xl border border-olive/15 bg-sage/12 p-6 sm:p-8" aria-labelledby="tips">
          <h2 id="tips" className="font-display text-[22px] font-bold tracking-[-0.02em] text-ink">
            Using these in your portfolio
          </h2>
          <ul className="mt-5 grid gap-5 md:grid-cols-3">
            {[
              {
                t: "Dribbble",
                d: "Upload the showcase boards at 2× (3200 × 2400). Lead with the Cover, then Mobile app and Dashboard.",
              },
              {
                t: "Behance & case studies",
                d: "Stack the desktop sections in order, or use the full landing page. Add the Design system board near the end.",
              },
              {
                t: "Slides & mockup tools",
                d: "Drop the transparent phone PNGs onto your own backgrounds in Figma, Keynote or Canva.",
              },
            ].map((tip) => (
              <li key={tip.t}>
                <p className="flex items-center gap-2 text-[15px] font-semibold text-ink">
                  <Check className="h-4 w-4 text-olive" strokeWidth={2.6} />
                  {tip.t}
                </p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{tip.d}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>

      {/* progress / summary */}
      {(batch || summary) && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 left-1/2 z-50 w-[min(34rem,calc(100vw-2rem))] -translate-x-1/2 rounded-xl border border-line bg-paper p-4 shadow-[var(--shadow-lift)]"
        >
          {batch ? (
            <>
              <div className="flex items-center gap-3">
                <Spinner />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-[15px] font-bold text-ink">
                    {batch.done >= batch.total
                      ? "Packing your ZIP…"
                      : `Rendering ${Math.min(batch.done + 1, batch.total)} of ${batch.total}`}
                  </p>
                  <p className="truncate text-[13px] text-muted">{batch.current}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    cancelRef.current = true;
                  }}
                  className="rounded-md border border-line px-3 py-1.5 text-[12.5px] font-semibold text-muted transition-colors hover:border-flame/40 hover:text-flame"
                >
                  Cancel
                </button>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line-soft">
                <div
                  className="h-full rounded-full bg-olive transition-[width] duration-500"
                  style={{ width: `${Math.max(4, (batch.done / batch.total) * 100)}%` }}
                />
              </div>
              <p className="mt-2 text-[11.5px] text-muted">Keep this tab open — larger screens take a few seconds each.</p>
            </>
          ) : (
            summary && (
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
                    summary.failed.length ? "bg-flame-tint text-flame" : "bg-sage/30 text-olive-deep",
                  )}
                >
                  {summary.failed.length ? (
                    <Close className="h-4 w-4" strokeWidth={2.4} />
                  ) : (
                    <Check className="h-4 w-4" strokeWidth={2.6} />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-[15px] font-bold text-ink">
                    {summary.ok} {summary.ok === 1 ? "screen" : "screens"} exported
                    {summary.cancelled ? " (cancelled)" : ""}
                  </p>
                  <p className="mt-0.5 text-[13px] leading-snug text-muted">
                    {summary.failed.length
                      ? `Couldn't export: ${summary.failed.join(", ")}. Try again in Chrome or at a lower resolution.`
                      : summary.file
                        ? `Saved as ${summary.file} in your Downloads folder.`
                        : "Check your Downloads folder."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSummary(null)}
                  aria-label="Dismiss"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-ivory hover:text-ink"
                >
                  <Close className="h-4 w-4" />
                </button>
              </div>
            )
          )}
        </div>
      )}

      {/* hidden render frame (sits behind the page; same-origin so we can capture it) */}
      {job && (
        <iframe
          key={job.nonce}
          ref={frameRef}
          src={`?shot=${job.def.id}&n=${job.nonce}`}
          title="Rendering screen"
          aria-hidden="true"
          tabIndex={-1}
          className="pointer-events-none fixed top-0 left-0 -z-10 border-0"
          style={{
            width: job.def.width,
            height: job.def.height === "auto" ? (job.def.previewHeight ?? 1000) : job.def.height,
          }}
        />
      )}
    </div>
  );
}
