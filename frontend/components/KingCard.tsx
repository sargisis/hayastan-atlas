"use client";

import Link from "next/link";
import type { King } from "@/lib/types";
import { useLang, fmt, t } from "@/lib/lang";

interface Props {
  king: King;
  color: string;          // dynasty accent color
  dynastyStart: number;   // for the reign position bar
  dynastyEnd: number;
  index: number;          // stagger animation
}

export default function KingCard({ king, color, dynastyStart, dynastyEnd, index }: Props) {
  const { lang } = useLang();
  const reignEnd = king.reign_end ?? king.reign_start + 5;
  const span = Math.max(dynastyEnd - dynastyStart, 1);
  const left = Math.max(((king.reign_start - dynastyStart) / span) * 100, 0);
  const width = Math.max(((reignEnd - king.reign_start) / span) * 100, 1.5);
  const reignYears = reignEnd - king.reign_start;

  return (
    <div
      className="anim-fade-up group relative bg-stone-900 border border-stone-800 rounded-xl p-5 hover:border-stone-600 hover:bg-stone-800/60 transition-all hover:-translate-y-0.5 hover:shadow-xl"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      {/* Accent corner */}
      <div
        className="absolute top-0 left-0 w-full h-0.5 rounded-t-xl opacity-60 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: color }}
      />

      <div className="flex items-start gap-4">
        <div
          className="w-14 h-14 rounded-full shrink-0 flex items-center justify-center text-2xl border transition-colors"
          style={{ borderColor: color + "55", backgroundColor: color + "18", color }}
        >
          ♔
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-white leading-tight text-[15px]">
            {lang === "hy" && king.name_hy ? king.name_hy : king.name}
          </h3>
          {lang === "en" && king.name_hy && <p className="text-stone-400 text-sm mt-0.5">{king.name_hy}</p>}
          <p className="text-xs mt-1 font-semibold tabular-nums" style={{ color }}>
            {fmt(king.reign_start, lang)} – {king.reign_end != null ? fmt(king.reign_end, lang) : "?"}
            <span className="text-stone-500 font-normal ml-2">{reignYears} {t("yrs", lang)}</span>
          </p>
        </div>
      </div>

      {king.bio && (
        <p className="text-stone-400 text-[13px] mt-3 leading-relaxed line-clamp-3">{king.bio}</p>
      )}

      {/* Reign position within dynasty */}
      <div className="mt-4">
        <div className="relative h-1.5 rounded-full bg-stone-800 overflow-hidden">
          <div
            className="absolute top-0 bottom-0 rounded-full transition-all group-hover:brightness-125"
            style={{ left: `${left}%`, width: `${width}%`, backgroundColor: color }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-stone-600 mt-1">
          <span>{fmt(dynastyStart, lang)}</span>
          <span>{fmt(dynastyEnd, lang)}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <Link
          href={`/kings/${king.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-400 hover:text-white transition-colors"
        >
          {t("view_details", lang)}
        </Link>
        <span className="text-stone-700">·</span>
        <Link
          href={`/map?year=${king.reign_start}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-armenia-orange transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          {t("map_at", lang)} {fmt(king.reign_start, lang)}
        </Link>
      </div>
    </div>
  );
}
