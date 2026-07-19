"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import ShareButton from "@/components/ShareButton";
import useSWR from "swr";
import Timeline from "@/components/Timeline";
import EraPanel from "@/components/EraPanel";
import EventsPanel from "@/components/EventsPanel";
import type { Era, Event, King } from "@/lib/types";

// MapLibre must be client-only (it accesses window)
const HistoryMap = dynamic(() => import("@/components/HistoryMap"), { ssr: false });

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function initialYear(): number {
  if (typeof window !== "undefined") {
    const p = new URLSearchParams(window.location.search).get("year");
    if (p) {
      const n = parseInt(p, 10);
      if (!Number.isNaN(n)) return Math.max(-800, Math.min(2025, n));
    }
  }
  return -782; // Erebuni / Urartu as default
}

export default function MapPage() {
  const [year, setYear] = useState<number>(initialYear);
  const [era, setEra] = useState<Era | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [phaseLabel, setPhaseLabel] = useState<string>("");
  const { data: kings } = useSWR<King[]>("/api/kings", fetcher);

  const handleTimelineChange = useCallback((y: number) => {
    setYear(y);
  }, []);

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-56px)]">
      {/* Top: era info panel */}
      <EraPanel era={era} year={year} kings={kings} />

      {/* Map takes remaining space */}
      <div className="flex-1 relative min-h-0">
        <HistoryMap
          year={year}
          onEraLoad={setEra}
          onEventsLoad={setEvents}
          onPhaseLoad={setPhaseLabel}
        />
        {phaseLabel && (
          <div
            key={phaseLabel}
            className="anim-fade absolute top-4 left-4 z-10 px-4 py-2 rounded-lg bg-stone-950/80 backdrop-blur border border-stone-800 shadow-xl"
          >
            <div className="text-[10px] uppercase tracking-widest text-stone-500">Period</div>
            <div className="text-sm font-semibold text-stone-100">{phaseLabel}</div>
          </div>
        )}
        <EventsPanel events={events} year={year} onJump={handleTimelineChange} />
        <ShareButton year={year} />
      </div>

      {/* Bottom timeline */}
      <Timeline year={year} onChange={handleTimelineChange} />
    </div>
  );
}
