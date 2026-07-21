"use client";

import Link from "next/link";
import useSWR from "swr";
import type { King } from "@/lib/types";
import { useLang, fmt } from "@/lib/lang";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const DYNASTY_META: Record<string, { color: string; nameEn: string; nameHy: string; start: number; end: number }> = {
  Urartian:  { color: "#8e5bb5", nameEn: "Urartian",  nameHy: "Ուրարտական", start: -800, end: -590 },
  Orontid:   { color: "#2980b9", nameEn: "Orontid",   nameHy: "Երվանդունի", start: -570, end: -200 },
  Artaxiad:  { color: "#e74c3c", nameEn: "Artaxiad",  nameHy: "Արտաշեսյան", start: -189, end:    1 },
  Arsacid:   { color: "#e67e22", nameEn: "Arsacid",   nameHy: "Արշակունի",  start:   12, end:  428 },
  Bagratid:  { color: "#27ae60", nameEn: "Bagratid",  nameHy: "Բագրատունի", start:  885, end: 1045 },
  Rubenid:   { color: "#16a085", nameEn: "Rubenid",   nameHy: "Ռուբինյան",  start: 1080, end: 1226 },
  Hethumid:  { color: "#1abc9c", nameEn: "Hethumid",  nameHy: "Հեթումյան",  start: 1226, end: 1375 },
};

const ORDER = ["Urartian", "Orontid", "Artaxiad", "Arsacid", "Bagratid", "Rubenid", "Hethumid"];

// Timeline constants
const MIN_YEAR = -800;
const MAX_YEAR = 1400;
const TOTAL = MAX_YEAR - MIN_YEAR;
const W = 900;   // SVG width in units
const ROW_H = 48;
const LABEL_W = 140;
const CHART_W = W - LABEL_W - 20;

function yearX(y: number) {
  return LABEL_W + ((y - MIN_YEAR) / TOTAL) * CHART_W;
}

export default function DynastiesPage() {
  const { lang } = useLang();
  const hy = lang === "hy";
  const { data: kings } = useSWR<King[]>("/api/kings", fetcher);

  const byDynasty: Record<string, King[]> = {};
  for (const k of kings ?? []) {
    (byDynasty[k.dynasty_name] ??= []).push(k);
  }

  const svgH = ORDER.length * ROW_H + 60;

  // Century tick marks
  const ticks: number[] = [];
  for (let y = -800; y <= 1400; y += 100) ticks.push(y);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full">
      {/* Header */}
      <div className="anim-fade-up text-center mb-12">
        <h1 className="text-4xl font-bold text-white tracking-tight">
          {hy ? <>Հայ <span className="text-armenia-orange">Արքայատոհմերը</span></> : <>Armenian <span className="text-armenia-orange">Dynasties</span></>}
        </h1>
        <p className="text-stone-400 mt-3 max-w-2xl mx-auto">
          {hy ? "7 արքայատոհմ, 2200 տարի — Ուրարտուից մինչ Կիլիկիա" : "7 dynasties spanning 2,200 years — from Urartu to Cilicia"}
        </p>
      </div>

      {/* Timeline SVG */}
      <div className="anim-fade-up bg-stone-900 border border-stone-800 rounded-2xl p-4 sm:p-6 overflow-x-auto mb-10">
        <svg viewBox={`0 0 ${W} ${svgH}`} className="w-full min-w-[600px]" style={{ fontFamily: "sans-serif" }}>
          {/* Century grid */}
          {ticks.map((y) => (
            <g key={y}>
              <line x1={yearX(y)} y1={30} x2={yearX(y)} y2={svgH - 20} stroke="#292524" strokeWidth={1} />
              <text x={yearX(y)} y={20} textAnchor="middle" fill="#57534e" fontSize={9}>
                {y < 0 ? `${Math.abs(y)}BC` : y === 0 ? "0" : `${y}AD`}
              </text>
            </g>
          ))}
          {/* Axis line */}
          <line x1={LABEL_W} y1={30} x2={W - 20} y2={30} stroke="#44403c" strokeWidth={1} />

          {/* Dynasty rows */}
          {ORDER.map((dName, i) => {
            const meta = DYNASTY_META[dName];
            const y = 40 + i * ROW_H;
            const x1 = yearX(meta.start);
            const x2 = yearX(meta.end);
            const rulers = byDynasty[dName] ?? [];
            const displayName = hy ? meta.nameHy : meta.nameEn;

            return (
              <g key={dName}>
                {/* Dynasty name */}
                <text x={LABEL_W - 8} y={y + ROW_H / 2 + 4} textAnchor="end" fill={meta.color} fontSize={11} fontWeight="600">
                  {displayName}
                </text>

                {/* Dynasty bar background */}
                <rect x={x1} y={y + 6} width={x2 - x1} height={ROW_H - 16} fill={meta.color} opacity={0.15} rx={4} />
                <rect x={x1} y={y + 6} width={x2 - x1} height={2} fill={meta.color} opacity={0.7} rx={1} />

                {/* Individual ruler segments */}
                {rulers
                  .sort((a, b) => a.reign_start - b.reign_start)
                  .map((k, ri) => {
                    const kx1 = yearX(k.reign_start);
                    const kx2 = yearX(k.reign_end ?? k.reign_start + 20);
                    const kw = Math.max(kx2 - kx1, 2);
                    const name = hy && k.name_hy ? k.name_hy : k.name;
                    return (
                      <g key={k.id}>
                        <rect
                          x={kx1} y={y + 10} width={kw} height={ROW_H - 24}
                          fill={meta.color} opacity={0.55 + (ri % 2) * 0.2} rx={2}
                        />
                        {kw > 18 && (
                          <text x={kx1 + kw / 2} y={y + ROW_H / 2 + 4} textAnchor="middle" fill="#fff" fontSize={7.5} opacity={0.85}>
                            {name.split(" ")[0]}
                          </text>
                        )}
                      </g>
                    );
                  })}

                {/* Duration label */}
                <text x={x2 + 4} y={y + ROW_H / 2 + 4} fill="#78716c" fontSize={8.5}>
                  {meta.end - meta.start}y
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Dynasty cards grid */}
      <div className="grid sm:grid-cols-2 gap-6">
        {ORDER.map((dName, i) => {
          const meta = DYNASTY_META[dName];
          const rulers = byDynasty[dName] ?? [];
          const displayName = hy ? meta.nameHy : meta.nameEn;
          const duration = meta.end - meta.start;

          return (
            <div
              key={dName}
              className="anim-fade-up bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden hover:border-stone-700 transition-colors"
              style={{ animationDelay: `${i * 60}ms`, borderTopWidth: 3, borderTopColor: meta.color }}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h2 className="text-lg font-bold text-white">{displayName}</h2>
                  <span className="text-xs font-bold tabular-nums px-2 py-1 rounded-full" style={{ color: meta.color, backgroundColor: meta.color + "18" }}>
                    {duration} {hy ? "տ." : "yrs"}
                  </span>
                </div>
                <div className="text-xs text-stone-500 mb-4">{fmt(meta.start, lang)} – {fmt(meta.end, lang)}</div>

                {/* Ruler list */}
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  {rulers.length === 0 ? (
                    <p className="text-xs text-stone-600 italic">{hy ? "Բեռնում…" : "Loading…"}</p>
                  ) : (
                    rulers.sort((a, b) => a.reign_start - b.reign_start).map((k) => (
                      <Link
                        key={k.id}
                        href={`/kings/${k.id}`}
                        className="flex items-center justify-between gap-2 py-1.5 px-2 rounded-lg hover:bg-stone-800 transition-colors group"
                      >
                        <span className="text-sm text-stone-300 group-hover:text-white transition-colors truncate">
                          {hy && k.name_hy ? k.name_hy : k.name}
                        </span>
                        <span className="text-xs text-stone-600 tabular-nums shrink-0">
                          {fmt(k.reign_start, lang)}
                        </span>
                      </Link>
                    ))
                  )}
                </div>
              </div>

              <div className="border-t border-stone-800 px-5 py-3 flex items-center justify-between">
                <span className="text-xs text-stone-600">
                  {rulers.length > 0 ? `${rulers.length} ${hy ? "կառ." : "rulers"}` : "—"}
                </span>
                <Link
                  href={`/map?year=${meta.start}`}
                  className="text-xs font-medium transition-colors hover:text-white"
                  style={{ color: meta.color }}
                >
                  {hy ? "Քարտ. →" : "Map →"}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
