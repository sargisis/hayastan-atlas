"use client";

import type { Era, King } from "@/lib/types";
import { useLang, fmt } from "@/lib/lang";

interface Props {
  era: Era | null;
  year: number;
  kings?: King[];
}

export default function EraPanel({ era, year, kings }: Props) {
  const { lang } = useLang();
  if (!era) {
    return (
      <div className="h-16 bg-stone-900/90 border-b border-stone-800 flex items-center px-6 text-stone-500 text-sm">
        Move the timeline to explore Armenian history
      </div>
    );
  }

  // Rulers reigning at the selected year
  const rulers = (kings ?? []).filter(
    (k) => k.reign_start <= year && (k.reign_end ?? 9999) >= year
  );

  return (
    <div
      key={era.id}
      className="anim-fade relative flex flex-col md:flex-row md:items-center gap-1 md:gap-6 px-4 md:px-6 py-2 md:py-3 bg-stone-900/95 border-b border-stone-800 backdrop-blur overflow-hidden"
      style={{ borderLeftColor: era.color, borderLeftWidth: 4 }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-40 opacity-10 pointer-events-none"
        style={{ background: `linear-gradient(to right, ${era.color}, transparent)` }}
      />

      <div className="relative flex flex-col min-w-0">
        <div className="flex items-baseline gap-2 md:gap-3 flex-wrap">
          <span className="font-bold text-white text-base md:text-lg leading-tight">{era.name}</span>
          <span className="text-stone-400 text-xs md:text-sm">
            {fmt(era.start_year, lang)} – {fmt(era.end_year, lang)}
          </span>
          {era.capital && (
            <span className="hidden md:inline text-stone-500 text-sm">
              Capital: <span className="text-stone-300">{era.capital}</span>
            </span>
          )}
          {rulers.length > 0 && (
            <span className="text-stone-500 text-xs md:text-sm">
              ♔{" "}
              <span className="text-armenia-orange font-medium">
                {rulers.map((r) => lang === "hy" && r.name_hy ? r.name_hy : r.name).join(", ")}
              </span>
              {lang === "en" && rulers[0]?.name_hy && (
                <span className="hidden md:inline text-stone-500 ml-1">({rulers[0].name_hy})</span>
              )}
            </span>
          )}
        </div>
        {era.description && (
          <p className="hidden md:block text-stone-400 text-xs mt-0.5 truncate max-w-3xl">{era.description}</p>
        )}
      </div>

      <div className="md:ml-auto relative shrink-0 md:text-right">
        <div className="font-bold text-lg md:text-2xl tabular-nums" style={{ color: era.color }}>
          {fmt(year, lang)}
        </div>
      </div>
    </div>
  );
}
