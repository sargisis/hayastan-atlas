"use client";

import type { Event } from "@/lib/types";

function fmt(y: number) {
  return y < 0 ? `${Math.abs(y)} BC` : `${y} AD`;
}

interface Props {
  events: Event[];
  year: number;
  onJump: (year: number) => void;
}

export default function EventsPanel({ events, year, onJump }: Props) {
  // Show events near the selected year, closest first
  const nearby = events
    .filter((ev) => Math.abs(ev.year - year) <= 100)
    .sort((a, b) => Math.abs(a.year - year) - Math.abs(b.year - year))
    .slice(0, 6);

  if (nearby.length === 0) return null;

  return (
    <div className="anim-slide-right absolute top-4 right-4 w-80 max-h-[calc(100%-6rem)] overflow-y-auto rounded-xl bg-stone-950/85 backdrop-blur border border-stone-800 shadow-2xl z-10 hidden md:block">
      <div className="px-4 py-3 border-b border-stone-800/70 sticky top-0 bg-stone-950/95 backdrop-blur">
        <h3 className="text-xs font-semibold tracking-widest uppercase text-stone-400">
          Events around {fmt(year)}
        </h3>
      </div>
      <ul>
        {nearby.map((ev, i) => {
          const active = Math.abs(ev.year - year) <= 5;
          return (
            <li
              key={ev.id}
              className="anim-fade-up border-b border-stone-800/40 last:border-0"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <button
                onClick={() => onJump(ev.year)}
                className={`w-full text-left px-4 py-3 transition-colors hover:bg-stone-800/50 ${
                  active ? "bg-stone-800/40" : ""
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[11px] font-bold tracking-wide ${
                      active ? "text-armenia-orange" : "text-stone-500"
                    }`}
                  >
                    {fmt(ev.year)}
                  </span>
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-armenia-orange animate-pulse" />
                  )}
                </div>
                <div className="text-sm font-semibold text-stone-100 leading-snug">{ev.title}</div>
                {ev.description && (
                  <div className="text-xs text-stone-400 mt-1 leading-relaxed line-clamp-2">
                    {ev.description}
                  </div>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
