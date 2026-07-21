"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import useSWR from "swr";
import type { Era, Event } from "@/lib/types";
import { useLang, fmt, t } from "@/lib/lang";

const HistoryMap = dynamic(() => import("@/components/HistoryMap"), { ssr: false });

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const MIN_YEAR = -800;
const MAX_YEAR = 2025;

interface PanelProps {
  year: number;
  side: "left" | "right";
  onChange: (y: number) => void;
}

function MapPanel({ year, side, onChange }: PanelProps) {
  const { lang } = useLang();
  const { data: eras } = useSWR<Era[]>("/api/eras", fetcher);
  const [era, setEra] = useState<Era | null>(null);
  const [phaseLabel, setPhaseLabel] = useState("");

  const handleEra = useCallback((e: Era) => setEra(e), []);
  const handleEvents = useCallback((_: Event[]) => {}, []);
  const handlePhase = useCallback((l: string) => setPhaseLabel(l), []);

  return (
    <div className="flex flex-col flex-1 min-w-0 border-stone-800 first:border-r">
      {/* Year header */}
      <div className="bg-stone-950 border-b border-stone-800 px-4 py-3 flex items-center gap-3">
        <span className="text-armenia-orange font-bold text-xl tabular-nums w-28 shrink-0">
          {fmt(year, lang)}
        </span>
        <input
          type="range"
          min={MIN_YEAR}
          max={MAX_YEAR}
          step={1}
          value={year}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="flex-1 accent-armenia-orange h-1.5 rounded cursor-pointer"
        />
        <span className="text-stone-500 text-xs w-16 text-right shrink-0">
          {era ? (lang === "hy" && era.name_hy ? era.name_hy : era.name) : ""}
        </span>
      </div>

      {/* Era quick-jump */}
      {eras && (
        <div className="bg-stone-900 border-b border-stone-800 px-4 py-2 flex gap-1.5 overflow-x-auto scrollbar-hide">
          {eras.map((e) => (
            <button
              key={e.id}
              onClick={() => onChange(e.start_year)}
              className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors border"
              style={
                era?.id === e.id
                  ? { backgroundColor: e.color, color: "#000", borderColor: e.color }
                  : { backgroundColor: "transparent", color: "#78716c", borderColor: e.color + "44" }
              }
            >
              {lang === "hy" && e.name_hy ? e.name_hy : e.name}
            </button>
          ))}
        </div>
      )}

      {/* Map */}
      <div className="flex-1 relative min-h-0">
        <HistoryMap
          year={year}
          onEraLoad={handleEra}
          onEventsLoad={handleEvents}
          onPhaseLoad={handlePhase}
        />
        {phaseLabel && (
          <div className="absolute top-3 left-3 z-10 px-3 py-1.5 rounded-lg bg-stone-950/80 backdrop-blur border border-stone-800 text-xs font-semibold text-stone-100 pointer-events-none">
            {phaseLabel}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ComparePage() {
  const { lang } = useLang();

  const getInitYear = (param: string, fallback: number) => {
    if (typeof window !== "undefined") {
      const v = new URLSearchParams(window.location.search).get(param);
      if (v) { const n = parseInt(v, 10); if (!isNaN(n)) return n; }
    }
    return fallback;
  };

  const [leftYear, setLeftYear] = useState(() => getInitYear("a", -69));
  const [rightYear, setRightYear] = useState(() => getInitYear("b", 885));

  const diff = rightYear - leftYear;
  const diffLabel = diff === 0
    ? (lang === "hy" ? "Նույն տարին" : "Same year")
    : diff > 0
    ? `+${diff} ${lang === "hy" ? "տ." : "yrs"}`
    : `${diff} ${lang === "hy" ? "տ." : "yrs"}`;

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-56px)]">
      {/* Top bar */}
      <div className="bg-stone-950 border-b border-stone-800 px-6 py-3 flex items-center gap-4">
        <div>
          <h1 className="text-sm font-semibold text-white">{t("compare_title", lang)}</h1>
          <p className="text-xs text-stone-500 mt-0.5">{t("compare_subtitle", lang)}</p>
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs font-semibold tabular-nums">
          <span className="text-stone-400">{fmt(leftYear, lang)}</span>
          <span className="px-2 py-0.5 rounded-full bg-stone-800 text-stone-300">{diffLabel}</span>
          <span className="text-stone-400">{fmt(rightYear, lang)}</span>
        </div>
      </div>

      {/* Two maps side by side */}
      <div className="flex flex-1 min-h-0 divide-x divide-stone-800">
        <MapPanel year={leftYear} side="left" onChange={setLeftYear} />
        <MapPanel year={rightYear} side="right" onChange={setRightYear} />
      </div>
    </div>
  );
}
