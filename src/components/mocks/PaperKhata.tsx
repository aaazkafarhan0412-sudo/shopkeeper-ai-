const lines = [
  { name: "Ahmed Khan", v: "1,200", kind: "udhaar" as const },
  { name: "Bilal Ahmed", v: "500", kind: "jama" as const },
  { name: "Fatima Bibi", v: "2,250", kind: "udhaar" as const },
  { name: "Kashif Traders", v: "19,350", kind: "udhaar" as const },
  { name: "Zainab Mart", v: "2,250", kind: "jama" as const },
];

/** The faded paper register that sits behind the app — the "before" picture. */
export default function PaperKhata() {
  return (
    <div className="relative w-[230px] rotate-[-4deg] rounded-[3px] border border-beige-deep/70 bg-[#F6EFDF] p-4 shadow-[var(--shadow-card)] sm:w-[268px]">
      <span aria-hidden className="paper-noise pointer-events-none absolute inset-0 rounded-[3px] opacity-[0.28]" />
      <span aria-hidden className="absolute inset-y-3 left-8 w-px bg-[#D8877A]/35" />
      <div className="relative">
        <p className="urdu text-right text-[15px] text-[#5B5341]">کھاتہ</p>
        <p className="font-display text-[11px] font-bold tracking-[0.14em] text-[#6B6250] uppercase">
          Register · 2024
        </p>
        <ul className="mt-3 space-y-[7px]">
          {lines.map((l, i) => (
            <li
              key={l.name}
              className="flex items-baseline gap-2 border-b border-dashed border-[#C9BC9C]/70 pb-[5px] text-[11px] text-[#6A6252]"
              style={{ opacity: 1 - i * 0.09 }}
            >
              <span className="num w-4 text-[9px] text-[#9A8F77]">{i + 1}</span>
              <span className="flex-1 font-medium" style={{ fontStyle: "italic" }}>
                {l.name}
              </span>
              <span className="num text-[#4E5B3E]">{l.v}</span>
              <span className="text-[9px] text-[#9A8F77]">{l.kind === "udhaar" ? "udhaar" : "jama"}</span>
            </li>
          ))}
        </ul>
      </div>
      {/* tea stain */}
      <span
        aria-hidden
        className="absolute right-5 bottom-6 h-14 w-14 rounded-full border-[6px] border-[#B98B52]/18 bg-[#B98B52]/7"
      />
      {/* fade toward the digital app */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-[3px] bg-gradient-to-t from-transparent via-transparent to-[#FAF7F0]/85"
      />
    </div>
  );
}
