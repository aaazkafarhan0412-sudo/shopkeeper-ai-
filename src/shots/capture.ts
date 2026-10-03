import { domToBlob } from "modern-screenshot";

export type ShotCapture = { blob: Blob; width: number; height: number; scale: number };

/** Exposed on `window.__shot` by every `?shot=` page so the media kit can drive it. */
export type ShotApi = {
  id: string;
  nonce: string;
  ready: () => Promise<void>;
  measure: () => { width: number; height: number };
  capture: (scale: number, type?: string) => Promise<ShotCapture>;
};

declare global {
  interface Window {
    __shot?: ShotApi;
  }
}

export const sleep = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

export function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("Could not read image"));
    reader.readAsDataURL(blob);
  });
}

/** Copies a Blob created inside another (same-origin) frame into this window. */
export async function toLocalBlob(blob: Blob, type?: string): Promise<Blob> {
  const buffer = await blob.arrayBuffer();
  return new Blob([buffer], { type: type || blob.type || "image/png" });
}

/* ------------------------------------------------------------------ */
/* Canvas safety                                                       */
/* ------------------------------------------------------------------ */
const MAX_SIDE = 32000;
const MAX_AREA = 120_000_000;

/** Lowers the requested scale when the image would exceed browser canvas limits. */
export function safeScale(width: number, height: number, requested: number): number {
  const s = Math.min(requested, MAX_SIDE / width, MAX_SIDE / height, Math.sqrt(MAX_AREA / (width * height)));
  return Math.max(0.25, Math.floor(s * 100) / 100);
}

/* ------------------------------------------------------------------ */
/* Fonts                                                               */
/* ------------------------------------------------------------------ */
const FONT_PROBES: [string, string][] = [
  ['400 16px "Instrument Sans"', "Aa"],
  ['600 16px "Instrument Sans"', "Aa"],
  ['italic 400 16px "Instrument Sans"', "Aa"],
  ['600 16px "Bricolage Grotesque"', "Aa"],
  ['800 16px "Bricolage Grotesque"', "Aa"],
  ['500 16px "JetBrains Mono"', "Rs. 1,234"],
  ['400 16px "Noto Nastaliq Urdu"', "کھاتہ"],
];

/** Makes sure every web font is loaded in the live page so layout is final. */
export async function loadFonts(): Promise<void> {
  if (!document.fonts) return;
  await Promise.all(FONT_PROBES.map(([font, text]) => document.fonts.load(font, text).catch(() => [])));
  await document.fonts.ready;
}

const KEEP_SUBSETS = new Set(["latin", "latin-ext", "arabic"]);
let fontCSS: Promise<string | null> | null = null;

/**
 * Google Fonts is a cross-origin stylesheet, so screenshot libraries can't read it.
 * We fetch it ourselves and inline every font file as a data URL (once per page).
 */
export function getEmbeddedFontCSS(): Promise<string | null> {
  if (!fontCSS) {
    fontCSS = buildFontCSS().catch((err) => {
      console.warn("[media kit] Could not embed web fonts — falling back to system fonts.", err);
      return null;
    });
  }
  return fontCSS;
}

async function buildFontCSS(): Promise<string | null> {
  const links = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')).filter((l) =>
    l.href.includes("fonts.googleapis.com"),
  );
  if (!links.length) return null;

  const files = new Map<string, Promise<string>>();
  const fetchFont = (url: string) => {
    let pending = files.get(url);
    if (!pending) {
      pending = fetch(url)
        .then((r) => {
          if (!r.ok) throw new Error(`Font ${r.status}: ${url}`);
          return r.blob();
        })
        .then(blobToDataURL);
      files.set(url, pending);
    }
    return pending;
  };

  const out: string[] = [];
  for (const link of links) {
    const res = await fetch(link.href);
    if (!res.ok) throw new Error(`Font stylesheet ${res.status}`);
    const css = await res.text();
    const blocks = css.match(/(?:\/\*\s*[\w-]+\s*\*\/\s*)?@font-face\s*\{[^}]*\}/g) ?? [];
    const faces = await Promise.all(
      blocks.map(async (block) => {
        const subset = block.match(/\/\*\s*([\w-]+)\s*\*\//)?.[1];
        if (subset && !KEEP_SUBSETS.has(subset)) return "";
        let face = block.replace(/\/\*[\s\S]*?\*\/\s*/, "");
        const urls = Array.from(face.matchAll(/url\((['"]?)([^'")]+)\1\)/g), (m) => m[2]);
        for (const url of urls) {
          if (url.startsWith("data:")) continue;
          const data = await fetchFont(new URL(url, link.href).href);
          face = face.split(url).join(data);
        }
        return face;
      }),
    );
    out.push(...faces.filter(Boolean));
  }
  return out.length ? out.join("\n") : null;
}

/* ------------------------------------------------------------------ */
/* Capture                                                             */
/* ------------------------------------------------------------------ */
export async function captureElement(
  node: HTMLElement,
  opts: { width: number; height: number; scale: number; type?: string },
): Promise<Blob> {
  const cssText = await getEmbeddedFontCSS();
  const type = opts.type ?? "image/png";
  return domToBlob(node, {
    width: opts.width,
    height: opts.height,
    scale: opts.scale,
    type,
    quality: 0.92,
    backgroundColor: type === "image/jpeg" ? "#FAF7F0" : null,
    font: cssText ? { cssText } : undefined,
    filter: (n) => !(n instanceof Element && n.hasAttribute("data-capture-ignore")),
    maximumCanvasSize: MAX_SIDE,
    timeout: 60000,
  });
}

export async function waitForImages(root: HTMLElement): Promise<void> {
  const images = Array.from(root.querySelectorAll("img"));
  await Promise.all(images.map((img) => img.decode().catch(() => undefined)));
}

/** Polls a same-origin iframe until its `?shot=` page has registered `window.__shot`. */
export function waitForShotApi(
  getFrame: () => HTMLIFrameElement | null,
  id: string,
  nonce: string | null,
  timeout = 60000,
): Promise<ShotApi> {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const tick = () => {
      let api: ShotApi | undefined;
      try {
        api = getFrame()?.contentWindow?.__shot;
      } catch {
        api = undefined;
      }
      if (api && api.id === id && (nonce === null || api.nonce === nonce)) {
        resolve(api);
        return;
      }
      if (Date.now() - started > timeout) {
        reject(new Error(`Timed out while loading “${id}”`));
        return;
      }
      window.setTimeout(tick, 120);
    };
    tick();
  });
}
