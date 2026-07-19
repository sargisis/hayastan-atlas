"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import useSWR from "swr";
import type { King } from "@/lib/types";
import { useLang, fmt } from "@/lib/lang";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const DYNASTY_COLORS: Record<string, string> = {
  Urartian: "#8e5bb5",
  Orontid: "#2980b9",
  Artaxiad: "#e74c3c",
  Arsacid: "#e67e22",
  Bagratid: "#27ae60",
  Rubenid: "#16a085",
  Hethumid: "#1abc9c",
};

export default function KingPage() {
  const { id } = useParams<{ id: string }>();
  const { lang } = useLang();
  const { data: king, isLoading } = useSWR<King>(`/api/kings/${id}`, fetcher);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center flex-1 text-stone-500">
        <div className="anim-fade text-center">
          <div className="text-4xl mb-2 animate-pulse">♔</div>
          Loading…
        </div>
      </div>
    );
  }

  if (!king || (king as any).error) {
    return (
      <div className="flex items-center justify-center flex-1 text-stone-500">
        <div className="text-center">
          <div className="text-4xl mb-2">✕</div>
          <p>Ruler not found.</p>
          <Link href="/kings" className="text-armenia-orange hover:underline mt-2 inline-block text-sm">
            ← Back to all rulers
          </Link>
        </div>
      </div>
    );
  }

  const color = DYNASTY_COLORS[king.dynasty_name] ?? "#a8a29e";
  const reignEnd = king.reign_end;
  const reignYears = reignEnd != null ? reignEnd - king.reign_start : null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 w-full">
      {/* Back */}
      <Link
        href="/kings"
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-300 transition-colors mb-8"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        All rulers
      </Link>

      {/* Hero card */}
      <div
        className="anim-fade-up relative rounded-2xl bg-stone-900 border border-stone-800 overflow-hidden"
        style={{ borderTopColor: color, borderTopWidth: 3 }}
      >
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at top left, ${color}, transparent 60%)` }}
        />

        <div className="relative p-8">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div
              className="w-20 h-20 rounded-full shrink-0 flex items-center justify-center text-4xl border-2"
              style={{ borderColor: color + "66", backgroundColor: color + "18", color }}
            >
              ♔
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-white leading-tight">
                {lang === "hy" && king.name_hy ? king.name_hy : king.name}
              </h1>
              {lang === "en" && king.name_hy && (
                <p className="text-stone-400 text-lg mt-1">{king.name_hy}</p>
              )}
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                <span
                  className="text-sm font-semibold px-3 py-1 rounded-full border"
                  style={{ color, borderColor: color + "55", backgroundColor: color + "18" }}
                >
                  {king.dynasty_name} Dynasty
                </span>
                <span className="text-stone-400 text-sm tabular-nums">
                  {fmt(king.reign_start, lang)} – {reignEnd != null ? fmt(reignEnd, lang) : "unknown"}
                  {reignYears != null && (
                    <span className="text-stone-600 ml-2">({reignYears} years)</span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {king.bio && (
            <p className="mt-8 text-stone-300 leading-relaxed text-[15px]">{king.bio}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="anim-fade-up mt-6 flex flex-wrap gap-3" style={{ animationDelay: "100ms" }}>
        <Link
          href={`/map?year=${king.reign_start}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all hover:opacity-80"
          style={{ backgroundColor: color }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          View on map — {fmt(king.reign_start, lang)}
        </Link>

        {reignEnd != null && (
          <Link
            href={`/map?year=${Math.floor((king.reign_start + reignEnd) / 2)}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border border-stone-700 text-stone-300 hover:border-stone-500 hover:text-white transition-all"
          >
            Mid-reign map
          </Link>
        )}
      </div>

      {/* Stats row */}
      <div
        className="anim-fade-up mt-6 grid grid-cols-3 gap-4"
        style={{ animationDelay: "150ms" }}
      >
        {[
          { label: "Reign start", value: fmt(king.reign_start, lang) },
          { label: "Reign end", value: reignEnd != null ? fmt(reignEnd, lang) : "—" },
          { label: "Duration", value: reignYears != null ? `${reignYears} yrs` : "—" },
        ].map(({ label, value }) => (
          <div key={label} className="bg-stone-900 border border-stone-800 rounded-xl p-4 text-center">
            <div className="text-stone-500 text-xs uppercase tracking-widest mb-1">{label}</div>
            <div className="text-white font-bold tabular-nums">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
