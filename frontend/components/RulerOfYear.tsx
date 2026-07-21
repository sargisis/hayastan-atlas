"use client";

import Link from "next/link";
import type { King } from "@/lib/types";
import { useLang, fmt } from "@/lib/lang";

interface Props {
  year: number;
  kings: King[] | undefined;
}

const DYNASTY_COLORS: Record<string, string> = {
  Urartian: "#8e5bb5", Orontid: "#2980b9", Artaxiad: "#e74c3c",
  Arsacid: "#e67e22", Bagratid: "#27ae60", Rubenid: "#16a085", Hethumid: "#1abc9c",
};

export default function RulerOfYear({ year, kings }: Props) {
  const { lang } = useLang();

  if (!kings || kings.length === 0) return null;

  const ruler = kings.find((k) => k.reign_start <= year && (k.reign_end ?? 2025) >= year);
  if (!ruler) return null;

  const color = DYNASTY_COLORS[ruler.dynasty_name] ?? "#F2A800";
  const name = lang === "hy" && ruler.name_hy ? ruler.name_hy : ruler.name;
  const dynasty = ruler.dynasty_name;
  const reignStart = fmt(ruler.reign_start, lang);
  const reignEnd = ruler.reign_end != null ? fmt(ruler.reign_end, lang) : "?";
  const yearsReigned = (ruler.reign_end ?? year) - ruler.reign_start;

  return (
    <Link
      href={`/kings/${ruler.id}`}
      className="absolute top-4 left-4 z-10 group"
      title={`View ${name}`}
    >
      <div
        className="bg-stone-950/90 backdrop-blur border rounded-xl shadow-2xl px-3 py-2.5 flex items-center gap-3 transition-all group-hover:border-opacity-80"
        style={{ borderColor: color + "55" }}
      >
        {/* Crown icon with dynasty color */}
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0 transition-transform group-hover:scale-110"
          style={{ backgroundColor: color + "22", border: `1.5px solid ${color}44` }}
        >
          ♔
        </div>

        <div className="min-w-0">
          <div className="text-[9px] uppercase tracking-widest font-medium mb-0.5" style={{ color }}>
            {lang === "hy" ? "Այժմ թագավոր" : "Ruling now"}
          </div>
          <div className="text-sm font-bold text-white truncate max-w-[140px]">{name}</div>
          <div className="text-[10px] text-stone-500 flex items-center gap-1.5 mt-0.5">
            <span>{dynasty}</span>
            <span className="text-stone-700">·</span>
            <span className="tabular-nums">{reignStart}–{reignEnd}</span>
            <span className="text-stone-700">·</span>
            <span>{yearsReigned}y</span>
          </div>
        </div>

        {/* Arrow hint */}
        <svg className="w-3.5 h-3.5 text-stone-600 group-hover:text-stone-400 shrink-0 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
