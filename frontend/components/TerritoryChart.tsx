"use client";

import { useState, useMemo } from "react";
import { useLang, fmt } from "@/lib/lang";

// Historical territory sizes in km² (approximate, based on scholarly estimates)
const TERRITORY_DATA: { year: number; km2: number; label: string; label_hy: string; color: string }[] = [
  { year: -800, km2: 180_000, label: "Kingdom of Urartu", label_hy: "Ուրարտու", color: "#6c3483" },
  { year: -590, km2: 90_000,  label: "Post-Urartu",       label_hy: "Վաղ Հայաստան", color: "#9b59b6" },
  { year: -570, km2: 140_000, label: "Satrapy of Armenia", label_hy: "Հայաստանի Սատրապություն", color: "#8e44ad" },
  { year: -321, km2: 220_000, label: "Orontid Kingdom",   label_hy: "Երվանդունի", color: "#2980b9" },
  { year: -189, km2: 350_000, label: "Artaxiad Kingdom",  label_hy: "Արտաշեսյան", color: "#c0392b" },
  { year: -83,  km2: 600_000, label: "Tigranes the Great — Peak", label_hy: "Տիգրան Մեծ — Գագաթ", color: "#e74c3c" },
  { year: -66,  km2: 250_000, label: "After Roman Defeat", label_hy: "Հռոմեական պարտությունից հետո", color: "#c0392b" },
  { year: 12,   km2: 200_000, label: "Arsacid Armenia",   label_hy: "Արշակունի", color: "#e67e22" },
  { year: 301,  km2: 180_000, label: "Christian Armenia", label_hy: "Քրիստոնյա Հայաստան", color: "#e67e22" },
  { year: 428,  km2: 100_000, label: "Marzpanate",        label_hy: "Մարզպանություն", color: "#7f8c8d" },
  { year: 636,  km2: 60_000,  label: "Arab Rule",         label_hy: "Արաբական տիրապետություն", color: "#95a5a6" },
  { year: 885,  km2: 170_000, label: "Bagratid Kingdom",  label_hy: "Բագրատունի", color: "#27ae60" },
  { year: 1045, km2: 65_000,  label: "Fragmented",        label_hy: "Մասնատված թագավ.", color: "#f39c12" },
  { year: 1198, km2: 35_000,  label: "Armenian Cilicia",  label_hy: "Կիլիկյան Հայաստան", color: "#16a085" },
  { year: 1375, km2: 0,       label: "No Armenian State", label_hy: "Անկախ պետություն չկա", color: "#7f8c8d" },
  { year: 1828, km2: 68_000,  label: "Russian Armenia",   label_hy: "Ռուսական Հայաստան", color: "#2c3e50" },
  { year: 1918, km2: 72_000,  label: "First Republic",    label_hy: "Առաջին Հանրապետություն", color: "#e74c3c" },
  { year: 1920, km2: 29_800,  label: "Soviet Armenia",    label_hy: "Խորհրդային Հայաստան", color: "#c0392b" },
  { year: 1991, km2: 29_800,  label: "Republic of Armenia", label_hy: "Հայաստանի Հանրապետություն", color: "#f39c12" },
  { year: 2025, km2: 29_800,  label: "Republic of Armenia", label_hy: "Հայաստանի Հանրապետություն", color: "#f39c12" },
];

const MIN_YEAR = -800;
const MAX_YEAR = 2025;
const MAX_KM2 = 650_000;

function interpolate(year: number): { km2: number; color: string; label: string; label_hy: string } {
  const data = TERRITORY_DATA;
  if (year <= data[0].year) return data[0];
  if (year >= data[data.length - 1].year) return data[data.length - 1];
  for (let i = 0; i < data.length - 1; i++) {
    if (year >= data[i].year && year <= data[i + 1].year) {
      const t = (year - data[i].year) / (data[i + 1].year - data[i].year);
      const km2 = Math.round(data[i].km2 + t * (data[i + 1].km2 - data[i].km2));
      return { km2, color: data[i].color, label: data[i].label, label_hy: data[i].label_hy };
    }
  }
  return data[data.length - 1];
}

const W = 240;
const H = 90;
const PAD_L = 4;
const PAD_R = 4;
const PAD_T = 8;
const PAD_B = 20;

function xOf(year: number) {
  return PAD_L + ((year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * (W - PAD_L - PAD_R);
}
function yOf(km2: number) {
  return PAD_T + (1 - km2 / MAX_KM2) * (H - PAD_T - PAD_B);
}

interface Props {
  year: number;
}

export default function TerritoryChart({ year }: Props) {
  const { lang } = useLang();
  const [open, setOpen] = useState(true);
  const [hoverYear, setHoverYear] = useState<number | null>(null);

  const current = useMemo(() => interpolate(year), [year]);
  const hovered = useMemo(() => hoverYear !== null ? interpolate(hoverYear) : null, [hoverYear]);

  // Build SVG path
  const points = useMemo(() => {
    const pts: [number, number][] = TERRITORY_DATA.map((d) => [xOf(d.year), yOf(d.km2)]);
    return pts;
  }, []);

  const areaPath = useMemo(() => {
    if (points.length === 0) return "";
    const line = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
    const bottom = `L${points[points.length - 1][0].toFixed(1)},${(H - PAD_B).toFixed(1)} L${points[0][0].toFixed(1)},${(H - PAD_B).toFixed(1)} Z`;
    return line + " " + bottom;
  }, [points]);

  const linePath = useMemo(() => {
    return points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  }, [points]);

  const curX = xOf(year);
  const curY = yOf(current.km2);

  const formatKm2 = (n: number) =>
    n === 0 ? (lang === "hy" ? "Անկախ պետ. չկա" : "No state") :
    n >= 1000 ? `${(n / 1000).toFixed(0)}k km²` : `${n} km²`;

  const displayInfo = hovered ?? current;
  const displayYear = hoverYear ?? year;

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="absolute bottom-4 right-4 z-10 bg-stone-950/90 backdrop-blur border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-400 hover:text-white transition-colors shadow-lg flex items-center gap-2"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
        {lang === "hy" ? "Տարածք" : "Territory"}
      </button>
    );
  }

  return (
    <div className="absolute bottom-4 right-4 z-10 bg-stone-950/92 backdrop-blur border border-stone-700 rounded-xl shadow-2xl overflow-hidden w-64">
      {/* Header */}
      <div className="flex items-center justify-between px-3 pt-2.5 pb-1">
        <span className="text-[10px] uppercase tracking-widest text-stone-500 font-medium">
          {lang === "hy" ? "Տարածք պատմ. մեջ" : "Territory through history"}
        </span>
        <button
          onClick={() => setOpen(false)}
          className="text-stone-600 hover:text-stone-400 transition-colors text-xs leading-none"
        >✕</button>
      </div>

      {/* Current value */}
      <div className="px-3 pb-1">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold tabular-nums" style={{ color: displayInfo.color }}>
            {formatKm2(displayInfo.km2)}
          </span>
          <span className="text-[10px] text-stone-500">{fmt(displayYear, lang)}</span>
        </div>
        <div className="text-[10px] text-stone-400 truncate leading-tight mt-0.5">
          {lang === "hy" ? displayInfo.label_hy : displayInfo.label}
        </div>
      </div>

      {/* SVG chart */}
      <div className="px-2 pb-2.5">
        <svg
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
          className="block w-full"
          style={{ cursor: "crosshair" }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const px = ((e.clientX - rect.left) / rect.width) * W;
            const yr = Math.round(MIN_YEAR + ((px - PAD_L) / (W - PAD_L - PAD_R)) * (MAX_YEAR - MIN_YEAR));
            setHoverYear(Math.max(MIN_YEAR, Math.min(MAX_YEAR, yr)));
          }}
          onMouseLeave={() => setHoverYear(null)}
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((f) => (
            <line
              key={f}
              x1={PAD_L} y1={yOf(MAX_KM2 * f)}
              x2={W - PAD_R} y2={yOf(MAX_KM2 * f)}
              stroke="#292524" strokeWidth="1"
            />
          ))}

          {/* Area fill */}
          <path d={areaPath} fill={current.color} fillOpacity={0.12} />

          {/* Line */}
          <path d={linePath} fill="none" stroke={current.color} strokeWidth={1.5} strokeOpacity={0.8} />

          {/* Peak annotation */}
          <line x1={xOf(-83)} y1={yOf(600_000)} x2={xOf(-83)} y2={H - PAD_B}
            stroke="#e74c3c" strokeWidth="1" strokeDasharray="2 2" strokeOpacity={0.5} />
          <text x={xOf(-83) + 2} y={PAD_T + 6} fill="#e74c3c" fontSize={7} fontFamily="monospace" opacity={0.7}>
            ★
          </text>

          {/* Current year marker */}
          <line x1={curX} y1={PAD_T} x2={curX} y2={H - PAD_B}
            stroke="#ffffff" strokeWidth="1" strokeOpacity={0.25} />
          <circle cx={curX} cy={curY} r={3} fill={current.color} stroke="#fff" strokeWidth={1.5} />

          {/* Hover marker */}
          {hoverYear !== null && (
            <>
              <line x1={xOf(hoverYear)} y1={PAD_T} x2={xOf(hoverYear)} y2={H - PAD_B}
                stroke="#ffffff" strokeWidth="1" strokeOpacity={0.4} strokeDasharray="2 2" />
              <circle cx={xOf(hoverYear)} cy={yOf(displayInfo.km2)} r={2.5}
                fill="#fff" stroke={displayInfo.color} strokeWidth={1.5} />
            </>
          )}

          {/* X-axis labels — anchor edge ticks inward so they don't clip at the viewBox */}
          {[-800, -300, 500, 1000, 1500, 2000].map((y, i, arr) => (
            <text key={y} x={xOf(y)} y={H - 4}
              textAnchor={i === 0 ? "start" : i === arr.length - 1 ? "end" : "middle"}
              fill="#57534e" fontSize={7} fontFamily="monospace">
              {y < 0 ? `${Math.abs(y)}BC` : y}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}
