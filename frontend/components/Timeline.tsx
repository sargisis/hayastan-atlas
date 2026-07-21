"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import type { Era } from "@/lib/types";
import { useLang, fmt } from "@/lib/lang";

const MIN_YEAR = -800;
const MAX_YEAR = 2025;

function yearToPct(y: number) {
  return ((y - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface Props {
  year: number;
  onChange: (year: number) => void;
}

export default function Timeline({ year, onChange }: Props) {
  const { lang } = useLang();
  const { data: eras } = useSWR<Era[]>("/api/eras", fetcher);
  const [playing, setPlaying] = useState(false);
  const playRef = useRef<number | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(parseInt(e.target.value, 10)),
    [onChange]
  );

  // Auto-play: advance ~8 years per tick
  useEffect(() => {
    if (!playing) return;
    playRef.current = window.setInterval(() => {
      onChange(Math.min(year + 8, MAX_YEAR));
    }, 60);
    return () => {
      if (playRef.current) window.clearInterval(playRef.current);
    };
  }, [playing, year, onChange]);

  useEffect(() => {
    if (year >= MAX_YEAR) setPlaying(false);
  }, [year]);

  const currentEraIdx = eras?.findIndex((e) => e.start_year <= year && e.end_year >= year) ?? -1;

  const jumpEra = (dir: -1 | 1) => {
    if (!eras || currentEraIdx < 0) return;
    const next = eras[currentEraIdx + dir];
    if (next) onChange(next.start_year);
  };

  // v4: Global keyboard shortcuts for timeline
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === " ") { e.preventDefault(); setPlaying((p) => !p); }
      if (e.key === "ArrowLeft") { e.preventDefault(); jumpEra(-1); }
      if (e.key === "ArrowRight") { e.preventDefault(); jumpEra(1); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eras, currentEraIdx]);

  const pct = yearToPct(year);

  return (
    <div className="bg-stone-900 border-t border-stone-800 px-6 pt-5 pb-3 select-none">
      <style>{`
        @keyframes pulse-marker {
          0%, 100% { transform: scale(1); box-shadow: 0 0 8px #F2A800aa; }
          50% { transform: scale(1.2); box-shadow: 0 0 16px #F2A800; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .maplibregl-popup-content {
          background: #1c1917 !important;
          border: 1px solid #44403c !important;
          border-radius: 8px !important;
          padding: 12px 14px !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.6) !important;
        }
        .maplibregl-popup-tip { border-top-color: #1c1917 !important; }
        .maplibregl-popup-close-button { color: #aaa !important; }

        /* Custom range slider — big hit area, styled thumb */
        .tl-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 28px;               /* generous hit area */
          background: transparent;
          cursor: pointer;
          margin: 0;
        }
        .tl-slider::-webkit-slider-runnable-track {
          height: 6px;
          border-radius: 3px;
          background: #44403c;
        }
        .tl-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #D90012;
          border: 3px solid #fff;
          box-shadow: 0 0 10px rgba(217,0,18,.8);
          margin-top: -7px;           /* centers thumb on 6px track */
        }
        .tl-slider::-moz-range-track {
          height: 6px;
          border-radius: 3px;
          background: #44403c;
        }
        .tl-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #D90012;
          border: 3px solid #fff;
          box-shadow: 0 0 10px rgba(217,0,18,.8);
        }
      `}</style>

      <div className="max-w-5xl mx-auto">
        {/* Era color bands — click jumps to era START */}
        {eras && (
          <div className="relative h-2 md:h-3 rounded-full overflow-hidden mb-4 bg-stone-800">
            {eras.map((era) => (
              <div
                key={era.id}
                className="absolute top-0 bottom-0 opacity-75 cursor-pointer hover:opacity-100 transition-opacity"
                style={{
                  left: `${yearToPct(era.start_year)}%`,
                  width: `${Math.max(yearToPct(era.end_year) - yearToPct(era.start_year), 0.4)}%`,
                  backgroundColor: era.color,
                }}
                title={`${era.name} (${fmt(era.start_year, lang)} – ${fmt(era.end_year, lang)})`}
                onClick={() => onChange(era.start_year)}
              />
            ))}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white rounded shadow-lg z-10 pointer-events-none"
              style={{ left: `calc(${pct}% - 2px)` }}
            />
          </div>
        )}

        {/* Controls + slider */}
        <div className="flex items-center gap-3">
          {/* Era navigation */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => jumpEra(-1)}
              className="w-7 h-7 md:w-8 md:h-8 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs md:text-sm transition-colors"
              title="Previous era"
            >
              ⏮
            </button>
            <button
              onClick={() => setPlaying((p) => !p)}
              className={`w-7 h-7 md:w-8 md:h-8 rounded-md text-xs md:text-sm transition-colors ${
                playing
                  ? "bg-armenia-red text-white"
                  : "bg-stone-800 hover:bg-stone-700 text-stone-300"
              }`}
              title={playing ? "Pause" : "Play through history"}
            >
              {playing ? "⏸" : "▶"}
            </button>
            <button
              onClick={() => jumpEra(1)}
              className="w-7 h-7 md:w-8 md:h-8 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs md:text-sm transition-colors"
              title="Next era"
            >
              ⏭
            </button>
          </div>

          <span className="text-stone-500 text-xs w-14 text-right shrink-0">{fmt(MIN_YEAR, lang)}</span>

          <div className="relative flex-1">
            <input
              type="range"
              min={MIN_YEAR}
              max={MAX_YEAR}
              step={1}
              value={year}
              onChange={handleChange}
              className="tl-slider"
            />
          </div>

          <span className="text-stone-500 text-xs w-14 shrink-0">{fmt(MAX_YEAR, lang)}</span>

          {/* Current year display */}
          <div className="shrink-0 w-24 text-right">
            <span className="text-armenia-orange font-bold text-xl tabular-nums">{fmt(year, lang)}</span>
          </div>
        </div>

        {/* Quick jump labels — hidden on mobile */}
        <div className="hidden md:flex justify-between mt-1 px-32">
          {[-800, -500, -100, 300, 700, 1000, 1375, 1828, 1991].map((y) => (
            <button
              key={y}
              onClick={() => onChange(y)}
              className="text-[10px] text-stone-600 hover:text-stone-300 transition-colors"
            >
              {fmt(y, lang)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
