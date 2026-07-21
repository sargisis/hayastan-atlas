"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import type { King, Event } from "@/lib/types";
import { useLang, fmt, t } from "@/lib/lang";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface Props {
  open: boolean;
  onClose: () => void;
}

type Result =
  | { kind: "king"; data: King }
  | { kind: "event"; data: Event };

export default function SearchModal({ open, onClose }: Props) {
  const { lang } = useLang();
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { data: kings } = useSWR<King[]>("/api/kings", fetcher);
  const { data: events } = useSWR<Event[]>("/api/events?year=9999", fetcher);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const q = query.trim().toLowerCase();

  const matchedKings: Result[] = q.length < 2 ? [] : (kings ?? []).filter(
    (k) =>
      k.name.toLowerCase().includes(q) ||
      (k.name_hy ?? "").toLowerCase().includes(q) ||
      k.dynasty_name.toLowerCase().includes(q)
  ).slice(0, 5).map((k) => ({ kind: "king", data: k }));

  const matchedEvents: Result[] = q.length < 2 ? [] : (events ?? []).filter(
    (e) =>
      e.title.toLowerCase().includes(q) ||
      (e.title_hy ?? "").toLowerCase().includes(q) ||
      (e.description ?? "").toLowerCase().includes(q) ||
      (e.description_hy ?? "").toLowerCase().includes(q)
  ).slice(0, 5).map((e) => ({ kind: "event", data: e }));

  const results: Result[] = [...matchedKings, ...matchedEvents];

  // Reset active index when results change
  useEffect(() => { setActiveIdx(0); }, [query]);

  const navigate = useCallback((r: Result) => {
    if (r.kind === "king") router.push(`/kings/${r.data.id}`);
    else router.push(`/map?year=${r.data.year}`);
    onClose();
  }, [router, onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (!open) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && results[activeIdx]) {
        navigate(results[activeIdx]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose, results, activeIdx, navigate]);

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${activeIdx}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-xl bg-stone-900 border border-stone-700 rounded-2xl shadow-2xl overflow-hidden anim-fade"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-stone-800">
          <svg className="w-5 h-5 text-stone-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search_placeholder", lang)}
            className="flex-1 bg-transparent text-white placeholder-stone-500 text-sm outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-stone-600 hover:text-stone-400 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <kbd className="hidden sm:block text-xs text-stone-600 border border-stone-700 rounded px-1.5 py-0.5">Esc</kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-96 overflow-y-auto">
          {q.length < 2 && (
            <p className="text-stone-600 text-sm text-center py-8">{t("type_to_search", lang)}</p>
          )}

          {q.length >= 2 && results.length === 0 && (
            <p className="text-stone-500 text-sm text-center py-8">{t("no_results", lang)} "{query}"</p>
          )}

          {matchedKings.length > 0 && (
            <div>
              <div className="px-4 py-2 text-[10px] uppercase tracking-widest text-stone-600">{t("rulers", lang)}</div>
              {matchedKings.map((r, i) => {
                const k = r.data as King;
                const globalIdx = i;
                return (
                  <button
                    key={k.id}
                    data-idx={globalIdx}
                    onClick={() => navigate(r)}
                    onMouseEnter={() => setActiveIdx(globalIdx)}
                    className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${
                      activeIdx === globalIdx ? "bg-stone-800" : "hover:bg-stone-800/50"
                    }`}
                  >
                    <span className="text-stone-400 text-lg">♔</span>
                    <div className="min-w-0">
                      <div className="text-white text-sm font-medium truncate">
                        {lang === "hy" && k.name_hy ? k.name_hy : k.name}
                      </div>
                      <div className="text-stone-500 text-xs">
                        {k.dynasty_name} · {fmt(k.reign_start, lang)} – {k.reign_end != null ? fmt(k.reign_end, lang) : "?"}
                      </div>
                    </div>
                    <span className="ml-auto text-stone-600 text-xs shrink-0">{t("ruler", lang)}</span>
                  </button>
                );
              })}
            </div>
          )}

          {matchedEvents.length > 0 && (
            <div>
              <div className="px-4 py-2 text-[10px] uppercase tracking-widest text-stone-600 border-t border-stone-800/60">
                {t("events", lang)}
              </div>
              {matchedEvents.map((r, i) => {
                const ev = r.data as Event;
                const globalIdx = matchedKings.length + i;
                return (
                  <button
                    key={ev.id}
                    data-idx={globalIdx}
                    onClick={() => navigate(r)}
                    onMouseEnter={() => setActiveIdx(globalIdx)}
                    className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${
                      activeIdx === globalIdx ? "bg-stone-800" : "hover:bg-stone-800/50"
                    }`}
                  >
                    <span className="text-stone-400 text-lg">⚡</span>
                    <div className="min-w-0">
                      <div className="text-white text-sm font-medium truncate">
                        {lang === "hy" && ev.title_hy ? ev.title_hy : ev.title}
                      </div>
                      <div className="text-stone-500 text-xs">{fmt(ev.year, lang)}</div>
                    </div>
                    <span className="ml-auto text-stone-600 text-xs shrink-0">{t("event", lang)}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2 border-t border-stone-800 flex gap-4 text-[11px] text-stone-600">
          <span>↑↓ {lang === "hy" ? "ընտրել" : "navigate"}</span>
          <span>{t("enter_to_navigate", lang)}</span>
          <span>{t("esc_to_close", lang)}</span>
        </div>
      </div>
    </div>
  );
}
