"use client";

import { useState } from "react";
import { getWorldContextForYear } from "@/lib/worldContext";
import { useLang } from "@/lib/lang";

interface Props {
  year: number;
}

export default function WorldContext({ year }: Props) {
  const { lang } = useLang();
  const hy = lang === "hy";
  const [open, setOpen] = useState(false);

  const items = getWorldContextForYear(year);

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        title={hy ? "Աշխ. կ." : "World context"}
        className={`absolute top-28 right-4 z-20 w-9 h-9 rounded-lg flex items-center justify-center text-base shadow-lg border transition-all ${
          open
            ? "bg-armenia-orange text-stone-950 border-armenia-orange"
            : "bg-stone-950/85 backdrop-blur border-stone-700 text-stone-300 hover:text-white"
        }`}
      >
        🌍
      </button>

      {/* Panel */}
      {open && (
        <div className="absolute top-[5.5rem] right-14 z-20 w-64 bg-stone-950/92 backdrop-blur border border-stone-700 rounded-xl shadow-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-stone-800 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-stone-400">
              {hy ? "Աշխ. կոնտ." : "World context"}
            </span>
            <button onClick={() => setOpen(false)} className="text-stone-600 hover:text-stone-300 text-lg leading-none">×</button>
          </div>

          <div className="p-3 space-y-2">
            {items.length === 0 && (
              <p className="text-stone-600 text-xs text-center py-4">
                {hy ? "Տ. չկա" : "No world data for this period"}
              </p>
            )}
            {items.map((item) => (
              <div
                key={item.civ}
                className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg bg-stone-900/60 border border-stone-800"
              >
                <span className="text-base shrink-0 mt-0.5">{item.icon}</span>
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: item.color }}>
                    {hy ? item.civ_hy : item.civ}
                  </div>
                  <div className="text-xs text-stone-300 mt-0.5 leading-tight">
                    {hy ? item.event_hy : item.event}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
