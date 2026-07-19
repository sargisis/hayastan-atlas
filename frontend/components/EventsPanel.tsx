"use client";

import { useState } from "react";
import type { Event } from "@/lib/types";
import { useLang, fmt, t } from "@/lib/lang";

interface Props {
  events: Event[];
  year: number;
  onJump: (year: number) => void;
}

function EventList({ events, year, onJump }: Props) {
  const { lang } = useLang();
  const nearby = events
    .filter((ev) => Math.abs(ev.year - year) <= 100)
    .sort((a, b) => Math.abs(a.year - year) - Math.abs(b.year - year))
    .slice(0, 6);

  if (nearby.length === 0) return <div className="px-4 py-6 text-stone-500 text-sm text-center">{t("no_events_nearby", lang)}</div>;

  return (
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
                  {fmt(ev.year, lang)}
                </span>
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-armenia-orange animate-pulse" />
                )}
              </div>
              <div className="text-sm font-semibold text-stone-100 leading-snug">
                {lang === "hy" && ev.title_hy ? ev.title_hy : ev.title}
              </div>
              {ev.description && (
                <div className="text-xs text-stone-400 mt-1 leading-relaxed line-clamp-2">
                  {lang === "hy" && ev.description_hy ? ev.description_hy : ev.description}
                </div>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default function EventsPanel({ events, year, onJump }: Props) {
  const { lang } = useLang();
  const [sheetOpen, setSheetOpen] = useState(false);

  const nearby = events.filter((ev) => Math.abs(ev.year - year) <= 100);

  if (nearby.length === 0) return null;

  return (
    <>
      {/* Desktop panel */}
      <div className="anim-slide-right absolute top-4 right-4 w-80 max-h-[calc(100%-6rem)] overflow-y-auto rounded-xl bg-stone-950/85 backdrop-blur border border-stone-800 shadow-2xl z-10 hidden md:block">
        <div className="px-4 py-3 border-b border-stone-800/70 sticky top-0 bg-stone-950/95 backdrop-blur">
          <h3 className="text-xs font-semibold tracking-widest uppercase text-stone-400">
            {t("events_around", lang)} {fmt(year, lang)}
          </h3>
        </div>
        <EventList events={events} year={year} onJump={onJump} />
      </div>

      {/* Mobile: floating pill button */}
      <button
        onClick={() => setSheetOpen(true)}
        className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-4 py-2 rounded-full bg-stone-950/90 backdrop-blur border border-stone-700 shadow-xl text-sm font-medium text-stone-200"
      >
        <span className="w-2 h-2 rounded-full bg-armenia-orange animate-pulse" />
        {nearby.length} event{nearby.length !== 1 ? "s" : ""}
      </button>

      {/* Mobile: bottom sheet */}
      {sheetOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-20"
            onClick={() => setSheetOpen(false)}
          />
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-stone-950 border-t border-stone-800 rounded-t-2xl shadow-2xl max-h-[70vh] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-stone-800/70 shrink-0">
              <h3 className="text-xs font-semibold tracking-widest uppercase text-stone-400">
                {t("events_around", lang)} {fmt(year, lang)}
              </h3>
              <button
                onClick={() => setSheetOpen(false)}
                className="text-stone-500 hover:text-stone-300 transition-colors p-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto flex-1">
              <EventList events={events} year={year} onJump={(y) => { onJump(y); setSheetOpen(false); }} />
            </div>
          </div>
        </>
      )}
    </>
  );
}
