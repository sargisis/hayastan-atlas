"use client";

import type { Era, King } from "@/lib/types";

function fmt(y: number) {
  return y < 0 ? `${Math.abs(y)} BC` : `${y} AD`;
}

interface Props {
  era: Era | null;
  year: number;
  kings?: King[];
}

export default function EraPanel({ era, year, kings }: Props) {
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
      className="anim-fade relative flex items-center gap-6 px-6 py-3 bg-stone-900/95 border-b border-stone-800 backdrop-blur overflow-hidden"
      style={{ borderLeftColor: era.color, borderLeftWidth: 4 }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-40 opacity-10 pointer-events-none"
        style={{ background: `linear-gradient(to right, ${era.color}, transparent)` }}
      />

      <div className="relative flex flex-col min-w-0">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="font-bold text-white text-lg leading-tight">{era.name}</span>
          <span className="text-stone-400 text-sm">
            {fmt(era.start_year)} – {fmt(era.end_year)}
          </span>
          {era.capital && (
            <span className="text-stone-500 text-sm">
              Capital: <span className="text-stone-300">{era.capital}</span>
            </span>
          )}
          {rulers.length > 0 && (
            <span className="text-stone-500 text-sm">
              ♔{" "}
              <span className="text-armenia-orange font-medium">
                {rulers.map((r) => r.name).join(", ")}
              </span>
              {rulers[0]?.name_hy && (
                <span className="text-stone-500 ml-1">({rulers[0].name_hy})</span>
              )}
            </span>
          )}
        </div>
        {era.description && (
          <p className="text-stone-400 text-xs mt-0.5 truncate max-w-3xl">{era.description}</p>
        )}
      </div>

      <div className="ml-auto relative shrink-0 text-right">
        <div className="font-bold text-2xl tabular-nums" style={{ color: era.color }}>
          {fmt(year)}
        </div>
      </div>
    </div>
  );
}
