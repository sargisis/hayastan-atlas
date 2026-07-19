"use client";

import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import type { Era, Event } from "@/lib/types";
import { useLang, fmt, t } from "@/lib/lang";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function EventsPage() {
  const { lang } = useLang();
  const { data: eras } = useSWR<Era[]>("/api/eras", fetcher);
  const { data: events, isLoading } = useSWR<Event[]>("/api/events?year=9999", fetcher);
  const [activeEra, setActiveEra] = useState<number | null>(null);

  if (isLoading || !eras) {
    return (
      <div className="flex items-center justify-center flex-1 text-stone-500">
        <div className="anim-fade text-center">
          <div className="text-3xl mb-2 animate-pulse">📜</div>
          Loading events…
        </div>
      </div>
    );
  }

  const filtered = activeEra
    ? (events ?? []).filter((ev) => ev.era_id === activeEra)
    : (events ?? []);

  const byEra: Record<number, Event[]> = {};
  for (const ev of filtered) {
    const key = ev.era_id ?? -1;
    (byEra[key] ??= []).push(ev);
  }

  const eraMap: Record<number, Era> = {};
  for (const era of eras) eraMap[era.id] = era;

  const sortedEraIds = Object.keys(byEra)
    .map(Number)
    .sort((a, b) => {
      const aStart = eraMap[a]?.start_year ?? 9999;
      const bStart = eraMap[b]?.start_year ?? 9999;
      return aStart - bStart;
    });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 w-full">
      <div className="anim-fade-up mb-10 text-center">
        <h1 className="text-4xl font-bold text-white tracking-tight">
          {lang === "hy" ? (
            <>Պատմական <span className="text-armenia-orange">Իրադարձություններ</span></>
          ) : (
            <>Historical <span className="text-armenia-orange">Events</span></>
          )}
        </h1>
        <p className="text-stone-400 mt-3 max-w-2xl mx-auto leading-relaxed">
          {t("events_subtitle", lang)}
        </p>
      </div>

      {/* Era filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveEra(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            activeEra === null
              ? "bg-armenia-orange text-stone-950"
              : "bg-stone-800 text-stone-400 hover:text-white"
          }`}
        >
          {t("all_eras", lang)}
        </button>
        {eras.map((era) => (
          <button
            key={era.id}
            onClick={() => setActiveEra(activeEra === era.id ? null : era.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
              activeEra === era.id
                ? "text-stone-950"
                : "bg-stone-900 text-stone-400 hover:text-white border-transparent"
            }`}
            style={
              activeEra === era.id
                ? { backgroundColor: era.color, borderColor: era.color }
                : { borderColor: era.color + "55" }
            }
          >
            {era.name}
          </button>
        ))}
      </div>

      {sortedEraIds.length === 0 && (
        <div className="text-center text-stone-500 py-20">{t("no_events_found", lang)}</div>
      )}

      <div className="space-y-12">
        {sortedEraIds.map((eraId) => {
          const era = eraMap[eraId];
          const eraEvents = byEra[eraId].slice().sort((a, b) => a.year - b.year);
          return (
            <section key={eraId}>
              <div className="flex items-center gap-3 mb-5 pb-3 border-b border-stone-800">
                {era ? (
                  <>
                    <div className="w-2.5 h-6 rounded-sm shrink-0" style={{ backgroundColor: era.color }} />
                    <h2 className="text-lg font-bold text-white">{era.name}</h2>
                    <span className="text-stone-500 text-sm tabular-nums">
                      {fmt(era.start_year, lang)} – {fmt(era.end_year, lang)}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-2.5 h-6 rounded-sm shrink-0 bg-stone-600" />
                    <h2 className="text-lg font-bold text-stone-400">{t("other_events", lang)}</h2>
                  </>
                )}
                <span className="ml-auto text-stone-600 text-xs">{eraEvents.length} events</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {eraEvents.map((ev, i) => (
                  <div
                    key={ev.id}
                    className="anim-fade-up group relative bg-stone-900 border border-stone-800 rounded-xl p-5 hover:border-stone-600 hover:bg-stone-800/60 transition-all"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    {era && (
                      <div
                        className="absolute top-0 left-0 w-full h-0.5 rounded-t-xl opacity-50 group-hover:opacity-100 transition-opacity"
                        style={{ backgroundColor: era.color }}
                      />
                    )}
                    <div className="flex items-start gap-3">
                      <span
                        className="shrink-0 text-xs font-bold tabular-nums mt-0.5 px-2 py-0.5 rounded"
                        style={
                          era
                            ? { backgroundColor: era.color + "22", color: era.color }
                            : { backgroundColor: "#44403c", color: "#a8a29e" }
                        }
                      >
                        {fmt(ev.year, lang)}
                      </span>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-stone-100 leading-snug">{ev.title}</div>
                        {ev.description && (
                          <p className="text-xs text-stone-400 mt-1.5 leading-relaxed line-clamp-3">
                            {ev.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Link
                        href={`/map?year=${ev.year}`}
                        className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-armenia-orange transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        {t("jump_to_map", lang)}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
