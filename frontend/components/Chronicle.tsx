"use client";

import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import type { Event } from "@/lib/types";
import { useLang, fmt } from "@/lib/lang";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const CATEGORIES = [
  { id: "all",      label: "Все",      labelEn: "All",      icon: "📜" },
  { id: "war",      label: "Войны",    labelEn: "Wars",     icon: "⚔️" },
  { id: "political",label: "Полит.",   labelEn: "Political",icon: "👑" },
  { id: "religion", label: "Религия",  labelEn: "Religion", icon: "✝️" },
  { id: "trade",    label: "Торговля", labelEn: "Trade",    icon: "🛤️" },
  { id: "culture",  label: "Культура", labelEn: "Culture",  icon: "🎨" },
] as const;

type CategoryId = typeof CATEGORIES[number]["id"];

const CATEGORY_COLORS: Record<string, string> = {
  war:       "#ef4444",
  political: "#F2A800",
  religion:  "#a78bfa",
  trade:     "#34d399",
  culture:   "#60a5fa",
};

interface Props {
  year: number;
  onJump: (year: number) => void;
}

export default function Chronicle({ year, onJump }: Props) {
  const { lang } = useLang();
  const hy = lang === "hy";
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<CategoryId>("all");
  const { data: allEvents } = useSWR<Event[]>("/api/events/all", fetcher);
  const listRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);

  const filtered = (allEvents ?? []).filter(
    (e) => category === "all" || e.category === category
  );

  // Find the index of the event closest to (but not after) current year
  const activeIdx = (() => {
    if (!filtered.length) return -1;
    let best = 0;
    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i].year <= year) best = i;
      else break;
    }
    return best;
  })();

  // Auto-scroll to active event when year changes
  useEffect(() => {
    if (!open || !activeRef.current || !listRef.current) return;
    activeRef.current.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [activeIdx, open]);

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        title={hy ? "Ժամ. ժապ." : "Chronicle"}
        className={`absolute top-16 right-4 z-20 w-9 h-9 rounded-lg flex items-center justify-center text-base shadow-lg border transition-all ${
          open
            ? "bg-armenia-orange text-stone-950 border-armenia-orange"
            : "bg-stone-950/85 backdrop-blur border-stone-700 text-stone-300 hover:text-white"
        }`}
      >
        📜
      </button>

      {/* Panel */}
      {open && (
        <div className="absolute top-4 right-14 z-20 w-72 h-[calc(100%-4rem)] bg-stone-950/92 backdrop-blur border border-stone-700 rounded-xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-4 pt-4 pb-3 border-b border-stone-800 shrink-0">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-stone-400">
                {hy ? "Ժամ. ժապ." : "Chronicle"}
              </span>
              <button onClick={() => setOpen(false)} className="text-stone-600 hover:text-stone-300 text-lg leading-none">×</button>
            </div>
            {/* Category filter */}
            <div className="flex flex-wrap gap-1">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors border ${
                    category === c.id
                      ? "bg-armenia-orange text-stone-950 border-armenia-orange"
                      : "border-stone-700 text-stone-500 hover:text-stone-300"
                  }`}
                >
                  <span>{c.icon}</span>
                  <span>{hy ? c.label : c.labelEn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Event list */}
          <div ref={listRef} className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
            {!allEvents && (
              <div className="text-stone-600 text-xs text-center mt-8">
                {hy ? "Բեռ..." : "Loading…"}
              </div>
            )}
            {filtered.map((ev, i) => {
              const isPast = ev.year <= year;
              const isActive = i === activeIdx;
              const color = CATEGORY_COLORS[ev.category] ?? "#F2A800";
              return (
                <div
                  key={ev.id}
                  ref={isActive ? activeRef : undefined}
                  onClick={() => onJump(ev.year)}
                  className={`flex gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer transition-all ${
                    isActive
                      ? "bg-stone-800 ring-1 ring-armenia-orange/60"
                      : isPast
                      ? "hover:bg-stone-900"
                      : "opacity-35 hover:opacity-60 hover:bg-stone-900"
                  }`}
                >
                  {/* Year + color bar */}
                  <div className="flex flex-col items-center shrink-0 w-10">
                    <div className="w-1.5 h-1.5 rounded-full mt-1 shrink-0" style={{ backgroundColor: color }} />
                    <div className="w-px flex-1 mt-1" style={{ backgroundColor: color + "44" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] tabular-nums" style={{ color }}>
                      {fmt(ev.year, lang)}
                    </div>
                    <div className={`text-xs font-medium leading-tight mt-0.5 ${isActive ? "text-white" : "text-stone-300"}`}>
                      {hy && ev.title_hy ? ev.title_hy : ev.title}
                    </div>
                    {isActive && (ev.description || ev.description_hy) && (
                      <div className="text-[10px] text-stone-500 mt-1 leading-relaxed">
                        {hy && ev.description_hy ? ev.description_hy : ev.description}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && allEvents && (
              <div className="text-stone-600 text-xs text-center mt-8">
                {hy ? "Իրադ. չկա" : "No events in this category"}
              </div>
            )}
          </div>

          {/* Footer — current year indicator */}
          <div className="border-t border-stone-800 px-4 py-2 shrink-0 flex items-center justify-between">
            <span className="text-[10px] text-stone-600">
              {hy ? "Ընթ. տ." : "Current year"}
            </span>
            <span className="text-armenia-orange font-bold text-sm tabular-nums">
              {fmt(year, lang)}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
