"use client";

import { useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import ShareButton from "@/components/ShareButton";
import ExportButton from "@/components/ExportButton";
import useSWR from "swr";
import Timeline from "@/components/Timeline";
import EraPanel from "@/components/EraPanel";
import EventsPanel from "@/components/EventsPanel";
import TerritoryChart from "@/components/TerritoryChart";
import RulerOfYear from "@/components/RulerOfYear";
import ShortcutsOverlay from "@/components/ShortcutsOverlay";
import type { Era, Event, King } from "@/lib/types";
import { useLang, fmt } from "@/lib/lang";
import Link from "next/link";

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
  return -782;
}

// Era-transition "History Pulse" toast — appears briefly when era changes
function HistoryPulse({ era }: { era: Era | null }) {
  const { lang } = useLang();
  if (!era) return null;
  return (
    <div
      key={era.id}
      className="anim-fade absolute bottom-28 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
    >
      <div
        className="px-5 py-2.5 rounded-full text-sm font-semibold text-white shadow-2xl backdrop-blur border"
        style={{ backgroundColor: era.color + "cc", borderColor: era.color }}
      >
        {lang === "hy" && era.name_hy ? era.name_hy : era.name}
        <span className="ml-2 opacity-70 font-normal text-xs">
          {fmt(era.start_year, lang)} – {fmt(era.end_year, lang)}
        </span>
      </div>
    </div>
  );
}

export default function MapPage() {
  const [year, setYear] = useState<number>(initialYear);
  const [era, setEra] = useState<Era | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const lastEraId = useRef<number | null>(null);
  const [pulseEra, setPulseEra] = useState<Era | null>(null);
  const { data: kings } = useSWR<King[]>("/api/kings", fetcher);

  const handleTimelineChange = useCallback((y: number) => setYear(y), []);

  const handleEraLoad = useCallback((newEra: Era) => {
    setEra(newEra);
    if (newEra.id !== lastEraId.current) {
      lastEraId.current = newEra.id;
      setPulseEra(newEra);
      // Clear after animation
      setTimeout(() => setPulseEra(null), 2800);
    }
  }, []);

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-56px)]">
      <EraPanel era={era} year={year} kings={kings} />

      <div className="flex-1 relative min-h-0">
        <HistoryMap
          year={year}
          onEraLoad={handleEraLoad}
          onEventsLoad={setEvents}
        />

        {/* Era-change pulse toast */}
        {pulseEra && <HistoryPulse era={pulseEra} />}

        <EventsPanel events={events} year={year} onJump={handleTimelineChange} />
        <RulerOfYear year={year} kings={kings} />
        <TerritoryChart year={year} />
        <ShortcutsOverlay />
        <ShareButton year={year} />
        <ExportButton year={year} />
      </div>

      <Timeline year={year} onChange={handleTimelineChange} />
    </div>
  );
}
