import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = (p: P) => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...p,
});

/* ---------- brand ---------- */
export const Logo = (p: P) => (
  <svg viewBox="0 0 32 32" fill="none" aria-hidden {...p}>
    <path d="M5 4.5h14.5L26 11v16.5H5z" fill="currentColor" opacity="0.14" />
    <path
      d="M5 4.5h14.5L26 11v16.5H5z"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinejoin="round"
    />
    <path d="M19.5 4.5V11H26" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
    <path d="M9 15h7M9 19h10" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    <path
      d="M23.2 20.6l1.1 2.4 2.4 1.1-2.4 1.1-1.1 2.4-1.1-2.4-2.4-1.1 2.4-1.1z"
      fill="#C0561A"
    />
  </svg>
);

/* ---------- product icons ---------- */
export const Book = (p: P) => (
  <svg {...base(p)}>
    <path d="M4.5 5.2A1.7 1.7 0 016.2 3.5H19v17H6.2a1.7 1.7 0 00-1.7 1.7z" />
    <path d="M4.5 18.8V5.2M19 3.5v17" />
    <path d="M8.6 8.4h6.2M8.6 12h4.4" />
  </svg>
);

export const SearchIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="10.8" cy="10.8" r="6.3" />
    <path d="M15.5 15.5L20.5 20.5" />
  </svg>
);

export const Bell = (p: P) => (
  <svg {...base(p)}>
    <path d="M6.4 10.2a5.6 5.6 0 0111.2 0c0 3.4.9 5 1.7 5.9H4.7c.8-.9 1.7-2.5 1.7-5.9z" />
    <path d="M10.2 19.2a2 2 0 003.6 0" />
    <path d="M12 3.2v1.4" />
  </svg>
);

export const Users = (p: P) => (
  <svg {...base(p)}>
    <circle cx="9.4" cy="8.4" r="3.4" />
    <path d="M3.6 19.4c.5-3.1 2.9-5 5.8-5s5.3 1.9 5.8 5" />
    <path d="M16.2 5.6a3.2 3.2 0 010 6.2M17.6 14.9c2.1.5 3.4 2.2 3.8 4.5" />
  </svg>
);

export const Receipt = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 3.6h12v17l-2.4-1.5-2.4 1.5-2.4-1.5L8.4 20.6 6 19.1z" />
    <path d="M9.3 8.4h5.4M9.3 12.2h3.6" />
  </svg>
);

export const WhatsApp = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export const Sparkle = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3.4l1.9 4.5 4.5 1.9-4.5 1.9L12 16.2l-1.9-4.5L5.6 9.8l4.5-1.9z" />
    <path d="M18.4 16.2l.7 1.7 1.7.7-1.7.7-.7 1.7-.7-1.7-1.7-.7 1.7-.7z" />
  </svg>
);

export const ArrowRight = (p: P) => (
  <svg {...base(p)}>
    <path d="M4.5 12h14" />
    <path d="M13.4 6.8L18.8 12l-5.4 5.2" />
  </svg>
);

export const ArrowDown = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 4.5v14" />
    <path d="M6.8 13.4L12 18.8l5.2-5.4" />
  </svg>
);

export const Check = (p: P) => (
  <svg {...base(p)}>
    <path d="M4.8 12.6l4.5 4.4L19.2 7" />
  </svg>
);

export const CheckCircle = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="M8.2 12.3l2.6 2.6 5-5.4" />
  </svg>
);

export const Plus = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 5.2v13.6M5.2 12h13.6" />
  </svg>
);

export const ChevronDown = (p: P) => (
  <svg {...base(p)}>
    <path d="M6.4 9.6L12 15l5.6-5.4" />
  </svg>
);

export const Menu = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 7.5h16M4 12h16M4 16.5h11" />
  </svg>
);

export const Close = (p: P) => (
  <svg {...base(p)}>
    <path d="M6.2 6.2l11.6 11.6M17.8 6.2L6.2 17.8" />
  </svg>
);

export const Shield = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3.4l7 2.4v5.6c0 4.2-2.8 7.5-7 9.2-4.2-1.7-7-5-7-9.2V5.8z" />
    <path d="M9.2 12.1l2 2 3.6-4" />
  </svg>
);

export const Clock = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="M12 7.4V12l3.2 2" />
  </svg>
);

export const Download = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 4v10.4" />
    <path d="M7.8 10.6L12 14.8l4.2-4.2" />
    <path d="M4.8 18.4h14.4" />
  </svg>
);

export const Star = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M12 3.6l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.9l6-.8z" />
  </svg>
);

export const Phone = (p: P) => (
  <svg {...base(p)}>
    <rect x="6.6" y="2.8" width="10.8" height="18.4" rx="1.8" />
    <path d="M10.6 5.6h2.8M11 18.4h2" />
  </svg>
);

export const Mail = (p: P) => (
  <svg {...base(p)}>
    <rect x="3.4" y="5.6" width="17.2" height="12.8" rx="1.6" />
    <path d="M4.2 6.8L12 12.8l7.8-6" />
  </svg>
);

export const MapPin = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 21s6.4-5.6 6.4-10.2A6.4 6.4 0 005.6 10.8C5.6 15.4 12 21 12 21z" />
    <circle cx="12" cy="10.6" r="2.4" />
  </svg>
);

export const Quote = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M9.4 5.6c-3.2 1.4-5 4-5 7.6 0 3.2 1.7 5.2 4.1 5.2 2 0 3.5-1.4 3.5-3.3 0-1.8-1.3-3.1-3-3.1-.3 0-.6 0-.9.1.3-1.6 1.5-3 3.3-4zM19.6 5.6c-3.2 1.4-5 4-5 7.6 0 3.2 1.7 5.2 4.1 5.2 2 0 3.5-1.4 3.5-3.3 0-1.8-1.3-3.1-3-3.1-.3 0-.6 0-.9.1.3-1.6 1.5-3 3.3-4z" />
  </svg>
);

export const Bars = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 20V12.4M10.3 20V6.6M15.6 20v-9M20.9 20V9.4" />
  </svg>
);

export const Rupee = (p: P) => (
  <svg {...base(p)}>
    <path d="M7.4 5.2h9.2M7.4 9h9.2M14.6 5.2c0 3-1.9 4.6-5 4.6h-.9l6.9 9" />
  </svg>
);

export const Send = (p: P) => (
  <svg {...base(p)}>
    <path d="M20.4 3.6L10.8 13.2M20.4 3.6l-6.4 17-3.2-7.4-7.4-3.2z" />
  </svg>
);

export const Filter = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 6.4h16M7 12h10M10 17.6h4" />
  </svg>
);

export const Trend = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 16.4l5.2-5.2 3.4 3.4L20 7.6" />
    <path d="M15.4 7.6H20v4.6" />
  </svg>
);

export const Wifi = (p: P) => (
  <svg {...base(p)}>
    <path d="M2.8 9.2a14 14 0 0118.4 0M6 12.6a9.4 9.4 0 0112 0M9.2 16a4.8 4.8 0 015.6 0" />
    <circle cx="12" cy="19.2" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const Urdu = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="M12 3.4v17.2" />
    <path d="M8.6 8.2h6.8M8.6 15.8h6.8" />
  </svg>
);

export const Facebook = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M13.6 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6c-.3-.04-1.3-.13-2.45-.13-2.42 0-4.08 1.48-4.08 4.2v2.23H7.5V13h2.77v8z" />
  </svg>
);

export const Instagram = (p: P) => (
  <svg {...base(p)}>
    <rect x="3.8" y="3.8" width="16.4" height="16.4" rx="4.6" />
    <circle cx="12" cy="12" r="3.9" />
    <circle cx="16.9" cy="7.1" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const YouTube = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M21.6 7.2c-.24-1.5-.9-2.16-2.4-2.4C17.1 4.5 14.7 4.4 12 4.4s-5.1.1-7.2.4c-1.5.24-2.16.9-2.4 2.4C2.1 9.1 2 10.7 2 12s.1 2.9.4 4.8c.24 1.5.9 2.16 2.4 2.4 2.1.3 4.5.4 7.2.4s5.1-.1 7.2-.4c1.5-.24 2.16-.9 2.4-2.4.3-1.9.4-3.5.4-4.8s-.1-2.9-.4-4.8zM10 15.4V8.6l5.6 3.4z" />
  </svg>
);

export const LinkedIn = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M4.8 3.6a2 2 0 110 4 2 2 0 010-4zM3.2 9.2h3.2V21H3.2zM9.2 9.2h3.1v1.6h.05c.45-.8 1.6-1.8 3.35-1.8 3.6 0 4.25 2.2 4.25 5.1V21h-3.2v-5.3c0-1.3 0-3-1.85-3s-2.1 1.4-2.1 2.9V21H9.2z" />
  </svg>
);
