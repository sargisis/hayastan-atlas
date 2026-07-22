"use client";

import useSWR from "swr";
import { useState } from "react";
import type { Era } from "@/lib/types";
import { useLang, fmt } from "@/lib/lang";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

// Rough area estimates (km²) per era phase — for visualization
const ERA_AREA: Record<string, number> = {
  "Kingdom of Urartu":        210000,
  "Orontid Armenia":           90000,
  "Artaxiad Armenia":         300000,
  "Greater Armenia (Tigranes)":750000,
  "Arsacid Armenia":          180000,
  "Marzpanate Period":         95000,
  "Bagratid Armenia":         120000,
  "Armenian Kingdom of Cilicia": 40000,
};

const DYNASTY_RULERS: Record<string, number> = {
  Urartian: 22, Orontid: 10, Artaxiad: 14, Arsacid: 16, Bagratid: 12, Rubenid: 8, Hethumid: 6,
};

export default function StatsPage() {
  const { lang } = useLang();
  const hy = lang === "hy";
  const { data: eras } = useSWR<Era[]>("/api/eras", fetcher);

  const eraList = eras ?? [];
  const totalYears = eraList.reduce((s, e) => s + (e.end_year - e.start_year), 0);
  const maxDuration = Math.max(...eraList.map((e) => e.end_year - e.start_year), 1);
  const [cmpA, setCmpA] = useState<string>("");
  const [cmpB, setCmpB] = useState<string>("");

  // Territory chart: SVG area chart from ERA_AREA data
  const chartData = Object.entries(ERA_AREA);
  const maxArea = Math.max(...chartData.map(([, v]) => v));
  const chartW = 600;
  const chartH = 200;
  const barW = chartW / chartData.length - 6;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 w-full">
      {/* Header */}
      <div className="anim-fade-up text-center mb-12">
        <h1 className="text-4xl font-bold text-white tracking-tight">
          {hy ? <>Պատմական <span className="text-armenia-orange">Վիճակագրություն</span></> : <>Historical <span className="text-armenia-orange">Statistics</span></>}
        </h1>
        <p className="text-stone-400 mt-3 max-w-2xl mx-auto">
          {hy ? "Հայկական պետականության 2800 տարվա թվեր, ժամկետներ և փոփոխություններ" : "Numbers, durations, and changes across 2,800 years of Armenian statehood"}
        </p>
      </div>

      {/* KPI row */}
      <div className="anim-fade-up grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        {[
          { label: hy ? "Դարաշրջաններ" : "Eras", value: eraList.length || 8, suffix: "" },
          { label: hy ? "Ընդհանուր տարիներ" : "Total years", value: "2,800+", suffix: "" },
          { label: hy ? "Թագ. ամենախոշոր" : "Peak territory", value: "750K", suffix: "km²" },
          { label: hy ? "Արքայատոհմ" : "Dynasties", value: 7, suffix: "" },
        ].map(({ label, value, suffix }) => (
          <div key={label} className="bg-stone-900 border border-stone-800 rounded-2xl p-5 text-center">
            <div className="text-3xl font-bold text-armenia-orange tabular-nums">{value}<span className="text-lg ml-1 text-stone-500">{suffix}</span></div>
            <div className="text-xs text-stone-500 uppercase tracking-widest mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Territory area chart */}
      <section className="anim-fade-up mb-12">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <span className="w-1 h-5 rounded bg-armenia-orange inline-block" />
          {hy ? "Տարածք ըստ Դարաշրջանի (կm²)" : "Territory by Era (km²)"}
        </h2>
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 overflow-x-auto">
          <svg viewBox={`0 0 ${chartW} ${chartH + 60}`} className="w-full min-w-[500px]">
            {/* Grid lines */}
            {[0.25, 0.5, 0.75, 1].map((frac) => (
              <g key={frac}>
                <line
                  x1={0} y1={chartH - chartH * frac}
                  x2={chartW} y2={chartH - chartH * frac}
                  stroke="#292524" strokeWidth={1}
                />
                <text x={chartW - 2} y={chartH - chartH * frac - 3} textAnchor="end" fill="#57534e" fontSize={9}>
                  {Math.round(maxArea * frac / 1000)}K
                </text>
              </g>
            ))}
            {/* Bars */}
            {chartData.map(([name, area], i) => {
              const h = (area / maxArea) * chartH;
              const x = i * (chartW / chartData.length) + 3;
              const era = eraList.find((e) => e.name === name);
              const color = era?.color ?? "#c0392b";
              const shortName = name.split(" ")[name.split(" ").length - 1];
              return (
                <g key={name}>
                  <rect
                    x={x} y={chartH - h} width={barW} height={h}
                    fill={color} opacity={0.8} rx={3}
                  />
                  <rect
                    x={x} y={chartH - h} width={barW} height={3}
                    fill={color} rx={2}
                  />
                  <text
                    x={x + barW / 2} y={chartH + 14}
                    textAnchor="middle" fill="#78716c" fontSize={8.5}
                    transform={`rotate(-30, ${x + barW / 2}, ${chartH + 14})`}
                  >
                    {shortName}
                  </text>
                  <text x={x + barW / 2} y={chartH - h - 5} textAnchor="middle" fill={color} fontSize={8.5}>
                    {Math.round(area / 1000)}K
                  </text>
                </g>
              );
            })}
            {/* Axis */}
            <line x1={0} y1={chartH} x2={chartW} y2={chartH} stroke="#44403c" strokeWidth={1} />
          </svg>
        </div>
      </section>

      {/* Era duration bars */}
      <section className="anim-fade-up mb-12">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <span className="w-1 h-5 rounded bg-armenia-orange inline-block" />
          {hy ? "Դարաշրջանների Տևողությունը" : "Era Durations"}
        </h2>
        <div className="bg-stone-900 border border-stone-800 rounded-2xl divide-y divide-stone-800 overflow-hidden">
          {eraList.length === 0
            ? [
                { name: "Kingdom of Urartu", name_hy: "Ուրարտու", color: "#8e5bb5", start_year: -800, end_year: -590 },
                { name: "Artaxiad Armenia", name_hy: "Արտաշեսյան", color: "#e74c3c", start_year: -189, end_year: 1 },
                { name: "Arsacid Armenia", name_hy: "Արշակունի", color: "#e67e22", start_year: 12, end_year: 428 },
                { name: "Bagratid Armenia", name_hy: "Բագրատունի", color: "#27ae60", start_year: 885, end_year: 1045 },
                { name: "Armenian Kingdom of Cilicia", name_hy: "Կիլիկիա", color: "#16a085", start_year: 1080, end_year: 1375 },
              ].map((e) => {
                const dur = e.end_year - e.start_year;
                const pct = (dur / 750) * 100;
                const n = hy ? e.name_hy : e.name;
                return (
                  <div key={e.name} className="px-5 py-4 flex items-center gap-4">
                    <div className="w-32 shrink-0 text-sm text-stone-300 font-medium truncate">{n}</div>
                    <div className="flex-1 h-3 bg-stone-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: e.color }} />
                    </div>
                    <div className="w-20 text-right shrink-0">
                      <span className="text-sm font-bold tabular-nums" style={{ color: e.color }}>{dur}</span>
                      <span className="text-xs text-stone-600 ml-1">{hy ? "տ." : "yrs"}</span>
                    </div>
                  </div>
                );
              })
            : eraList.map((e) => {
                const dur = e.end_year - e.start_year;
                const pct = (dur / maxDuration) * 100;
                return (
                  <div key={e.id} className="px-5 py-4 flex items-center gap-4 group hover:bg-stone-800/30 transition-colors">
                    <Link href={`/map?year=${e.start_year}`} className="w-36 shrink-0 text-sm text-stone-300 font-medium truncate hover:text-white transition-colors">
                      {hy && e.name_hy ? e.name_hy : e.name}
                    </Link>
                    <div className="flex-1 h-3 bg-stone-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all group-hover:brightness-125" style={{ width: `${pct}%`, backgroundColor: e.color }} />
                    </div>
                    <div className="w-20 text-right shrink-0">
                      <span className="text-sm font-bold tabular-nums" style={{ color: e.color }}>{dur}</span>
                      <span className="text-xs text-stone-600 ml-1">{hy ? "տ." : "yrs"}</span>
                    </div>
                    <span className="text-xs text-stone-600 tabular-nums w-32 text-right shrink-0">
                      {fmt(e.start_year, lang)} – {fmt(e.end_year, lang)}
                    </span>
                  </div>
                );
              })}
        </div>
      </section>

      {/* Era comparison */}
      {eraList.length > 1 && (
        <section className="anim-fade-up mb-12">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-1 h-5 rounded bg-armenia-orange inline-block" />
            {hy ? "Դ. Համ." : "Era Comparison"}
          </h2>
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
            {/* Era selectors */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[{ val: cmpA, set: setCmpA, label: hy ? "Դ. 1" : "Era A" },
                { val: cmpB, set: setCmpB, label: hy ? "Դ. 2" : "Era B" }].map(({ val, set, label }, idx) => (
                <div key={idx}>
                  <label className="text-[10px] uppercase tracking-widest text-stone-500 mb-1 block">{label}</label>
                  <select
                    value={val}
                    onChange={(e) => set(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-armenia-orange"
                  >
                    <option value="">{hy ? "Ընտ. Դ." : "Select era…"}</option>
                    {eraList.map((e) => (
                      <option key={e.id} value={String(e.id)}>
                        {hy && e.name_hy ? e.name_hy : e.name}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* Comparison metrics */}
            {(() => {
              const eA = eraList.find((e) => String(e.id) === cmpA);
              const eB = eraList.find((e) => String(e.id) === cmpB);
              if (!eA || !eB) return (
                <div className="text-center text-stone-600 py-8 text-sm">
                  {hy ? "Ընտ. er. Era-ner ham." : "Select two eras above to compare"}
                </div>
              );
              const durA = eA.end_year - eA.start_year;
              const durB = eB.end_year - eB.start_year;
              const areaA = ERA_AREA[eA.name] ?? 0;
              const areaB = ERA_AREA[eB.name] ?? 0;
              const maxDur = Math.max(durA, durB);
              const maxArea = Math.max(areaA, areaB);

              const rows = [
                {
                  label: hy ? "Ժամ." : "Duration",
                  vA: `${durA} ${hy ? "tiv." : "yrs"}`, vB: `${durB} ${hy ? "tiv." : "yrs"}`,
                  pA: durA / maxDur, pB: durB / maxDur,
                },
                ...(areaA > 0 && areaB > 0 ? [{
                  label: hy ? "Territ." : "Territory",
                  vA: `${Math.round(areaA / 1000)}K km²`, vB: `${Math.round(areaB / 1000)}K km²`,
                  pA: areaA / maxArea, pB: areaB / maxArea,
                }] : []),
                {
                  label: hy ? "Zharman." : "Period",
                  vA: `${fmt(eA.start_year, lang)} – ${fmt(eA.end_year, lang)}`,
                  vB: `${fmt(eB.start_year, lang)} – ${fmt(eB.end_year, lang)}`,
                  pA: null, pB: null,
                },
              ];

              return (
                <div className="space-y-5">
                  <div className="grid grid-cols-[1fr_auto_1fr] gap-4 mb-2 text-center">
                    <div className="text-sm font-bold truncate" style={{ color: eA.color }}>
                      {hy && eA.name_hy ? eA.name_hy : eA.name}
                    </div>
                    <div className="text-xs text-stone-600 self-center">vs</div>
                    <div className="text-sm font-bold truncate" style={{ color: eB.color }}>
                      {hy && eB.name_hy ? eB.name_hy : eB.name}
                    </div>
                  </div>

                  {rows.map(({ label, vA, vB, pA, pB }) => (
                    <div key={label}>
                      <div className="text-[10px] uppercase tracking-widest text-stone-500 mb-2 text-center">{label}</div>
                      <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
                        <div className="text-right">
                          <div className="text-sm font-semibold text-white">{vA}</div>
                          {pA !== null && (
                            <div className="h-2 bg-stone-800 rounded-full mt-1.5 overflow-hidden flex justify-end">
                              <div className="h-full rounded-full" style={{ width: `${pA * 100}%`, backgroundColor: eA.color }} />
                            </div>
                          )}
                        </div>
                        <div className="w-px bg-stone-700 self-stretch" />
                        <div className="text-left">
                          <div className="text-sm font-semibold text-white">{vB}</div>
                          {pB !== null && (
                            <div className="h-2 bg-stone-800 rounded-full mt-1.5 overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${pB * 100}%`, backgroundColor: eB.color }} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="pt-3 border-t border-stone-800 flex justify-center gap-4">
                    <Link
                      href={`/map?year=${eA.start_year}`}
                      className="text-xs px-3 py-1.5 rounded-lg border transition-colors hover:text-white"
                      style={{ borderColor: eA.color + "55", color: eA.color }}
                    >
                      {hy ? "Qtrt. →" : "View on map →"}
                    </Link>
                    <Link
                      href={`/map?year=${eB.start_year}`}
                      className="text-xs px-3 py-1.5 rounded-lg border transition-colors hover:text-white"
                      style={{ borderColor: eB.color + "55", color: eB.color }}
                    >
                      {hy ? "Qtrt. →" : "View on map →"}
                    </Link>
                  </div>
                </div>
              );
            })()}
          </div>
        </section>
      )}

      {/* Dynasty ruler count */}
      <section className="anim-fade-up mb-8">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <span className="w-1 h-5 rounded bg-armenia-orange inline-block" />
          {hy ? "Կառավարիչների Թիվ ըստ Արքայատոհմի" : "Ruler Count by Dynasty"}
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {Object.entries(DYNASTY_RULERS).map(([dynasty, count]) => {
            const colors: Record<string, string> = { Urartian: "#8e5bb5", Orontid: "#2980b9", Artaxiad: "#e74c3c", Arsacid: "#e67e22", Bagratid: "#27ae60", Rubenid: "#16a085", Hethumid: "#1abc9c" };
            const names: Record<string, { en: string; hy: string }> = {
              Urartian: { en: "Urartian", hy: "Ուրարտական" }, Orontid: { en: "Orontid", hy: "Երվանդունի" },
              Artaxiad: { en: "Artaxiad", hy: "Արտաշեսյան" }, Arsacid: { en: "Arsacid", hy: "Արշակունի" },
              Bagratid: { en: "Bagratid", hy: "Բագրատունի" }, Rubenid: { en: "Rubenid", hy: "Ռուբինյան" },
              Hethumid: { en: "Hethumid", hy: "Հեթումյան" },
            };
            const color = colors[dynasty] ?? "#a8a29e";
            const maxCount = Math.max(...Object.values(DYNASTY_RULERS));
            return (
              <div key={dynasty} className="flex items-center gap-3 bg-stone-900 border border-stone-800 rounded-xl px-4 py-3">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <span className="text-sm text-stone-300 font-medium w-28 shrink-0">{names[dynasty]?.[lang] ?? dynasty}</span>
                <div className="flex-1 h-2 bg-stone-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(count / maxCount) * 100}%`, backgroundColor: color + "cc" }} />
                </div>
                <span className="text-sm font-bold w-8 text-right" style={{ color }}>{count}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
