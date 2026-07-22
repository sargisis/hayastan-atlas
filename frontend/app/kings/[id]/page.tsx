"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import useSWR from "swr";
import type { King, Event } from "@/lib/types";
import { useLang, fmt, t } from "@/lib/lang";

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
  const { data: allKings } = useSWR<King[]>("/api/kings", fetcher);
  const { data: allEvents } = useSWR<Event[]>("/api/events?year=9999", fetcher);

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
            ← {t("all_rulers", lang)}
          </Link>
        </div>
      </div>
    );
  }

  const color = DYNASTY_COLORS[king.dynasty_name] ?? "#a8a29e";
  const reignEnd = king.reign_end;
  const reignYears = reignEnd != null ? reignEnd - king.reign_start : null;

  // Prev / next within the same dynasty, sorted by reign_start
  const dynastyKings = (allKings ?? [])
    .filter((k) => k.dynasty_name === king.dynasty_name)
    .sort((a, b) => a.reign_start - b.reign_start);
  const idx = dynastyKings.findIndex((k) => k.id === king.id);
  const prevKing = idx > 0 ? dynastyKings[idx - 1] : null;
  const nextKing = idx !== -1 && idx < dynastyKings.length - 1 ? dynastyKings[idx + 1] : null;

  // Events that fall within this king's reign
  const reignEnd2 = reignEnd ?? king.reign_start + 50;
  const relatedEvents = (allEvents ?? [])
    .filter((ev) => ev.year >= king.reign_start && ev.year <= reignEnd2)
    .sort((a, b) => a.year - b.year);

  const bioText = lang === "hy" && king.bio_hy ? king.bio_hy : king.bio;
  const dynastyLabel = lang === "hy"
    ? ({ Urartian: "Ուրարտական", Orontid: "Երվանդունի", Artaxiad: "Արտաշեսյան", Arsacid: "Արշակունի", Bagratid: "Բագրատունի", Rubenid: "Ռուբինյան", Hethumid: "Հեթումյան" } as Record<string, string>)[king.dynasty_name] ?? king.dynasty_name
    : king.dynasty_name;

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
        {t("all_rulers", lang)}
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
                  {dynastyLabel} {t("dynasty_word", lang)}
                </span>
                <span className="text-stone-400 text-sm tabular-nums">
                  {fmt(king.reign_start, lang)} – {reignEnd != null ? fmt(reignEnd, lang) : t("unknown", lang)}
                  {reignYears != null && (
                    <span className="text-stone-600 ml-2">({reignYears} {t("years_abbr", lang)})</span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {bioText && (
            <p className="mt-8 text-stone-300 leading-relaxed text-[15px]">{bioText}</p>
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
          {t("view_on_map", lang)} — {fmt(king.reign_start, lang)}
        </Link>

        {reignEnd != null && (
          <Link
            href={`/map?year=${Math.floor((king.reign_start + reignEnd) / 2)}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border border-stone-700 text-stone-300 hover:border-stone-500 hover:text-white transition-all"
          >
            {t("mid_reign_map", lang)}
          </Link>
        )}
      </div>

      {/* Stats row */}
      <div className="anim-fade-up mt-6 grid grid-cols-3 gap-4" style={{ animationDelay: "150ms" }}>
        {[
          { label: t("reign_start_label", lang), value: fmt(king.reign_start, lang) },
          { label: t("reign_end_label", lang), value: reignEnd != null ? fmt(reignEnd, lang) : "—" },
          { label: t("duration_label", lang), value: reignYears != null ? `${reignYears} ${t("years_abbr", lang)}` : "—" },
        ].map(({ label, value }) => (
          <div key={label} className="bg-stone-900 border border-stone-800 rounded-xl p-4 text-center">
            <div className="text-stone-500 text-xs uppercase tracking-widest mb-1">{label}</div>
            <div className="text-white font-bold tabular-nums">{value}</div>
          </div>
        ))}
      </div>

      {/* Related events */}
      <div className="anim-fade-up mt-10" style={{ animationDelay: "200ms" }}>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-stone-500 mb-4">
          {t("related_events", lang)}
        </h2>
        {relatedEvents.length === 0 ? (
          <p className="text-stone-600 text-sm">{t("no_related_events", lang)}</p>
        ) : (
          <div className="space-y-3">
            {relatedEvents.map((ev) => (
              <div
                key={ev.id}
                className="flex gap-4 bg-stone-900 border border-stone-800 rounded-xl p-4 hover:border-stone-700 transition-colors"
              >
                <span
                  className="shrink-0 text-xs font-bold tabular-nums px-2 py-0.5 rounded self-start mt-0.5"
                  style={{ backgroundColor: color + "22", color }}
                >
                  {fmt(ev.year, lang)}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-stone-100">
                    {lang === "hy" && ev.title_hy ? ev.title_hy : ev.title}
                  </div>
                  {ev.description && (
                    <p className="text-xs text-stone-400 mt-1 leading-relaxed line-clamp-2">
                      {lang === "hy" && ev.description_hy ? ev.description_hy : ev.description}
                    </p>
                  )}
                </div>
                <Link
                  href={`/map?year=${ev.year}`}
                  className="shrink-0 self-center text-stone-600 hover:text-armenia-orange transition-colors"
                  title={t("jump_to_map", lang)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dynasty succession tree */}
      <div className="anim-fade-up mt-10" style={{ animationDelay: "250ms" }}>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-stone-500 mb-4">
          {lang === "hy" ? "Դինաստիայի հաջորդականություն" : "Dynasty Succession"}
        </h2>
        <div className="overflow-x-auto pb-2 -mx-2 px-2">
          <div className="flex gap-2 min-w-max">
            {dynastyKings.map((k, i) => {
              const isCurrent = k.id === king.id;
              return (
                <Link
                  key={k.id}
                  href={`/kings/${k.id}`}
                  className={`flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl border transition-all min-w-[80px] text-center ${
                    isCurrent
                      ? "border-[var(--col)] bg-[var(--col)]/10 shadow-lg"
                      : "border-stone-800 bg-stone-900 hover:border-stone-600"
                  }`}
                  style={{ "--col": color } as React.CSSProperties}
                >
                  {/* Connector line */}
                  <div className="flex items-center w-full gap-1 justify-center">
                    {i > 0 && <div className="h-px flex-1 bg-stone-700" />}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${
                        isCurrent ? "text-stone-950" : "text-stone-400"
                      }`}
                      style={isCurrent ? { backgroundColor: color } : { backgroundColor: "#292524" }}
                    >
                      {i + 1}
                    </div>
                    {i < dynastyKings.length - 1 && <div className="h-px flex-1 bg-stone-700" />}
                  </div>
                  <span className={`text-[11px] font-semibold leading-tight ${isCurrent ? "text-white" : "text-stone-400"}`}>
                    {lang === "hy" && k.name_hy ? k.name_hy : k.name}
                  </span>
                  <span className="text-[10px] tabular-nums text-stone-600">{fmt(k.reign_start, lang)}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Territory during reign */}
      <div className="anim-fade-up mt-10" style={{ animationDelay: "300ms" }}>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-stone-500 mb-4">
          {lang === "hy" ? "Տարածք թագավորության ընթացքում" : "Territory During Reign"}
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { labelEn: "At accession", labelHy: "Գահ բարձրանալ.", year: king.reign_start },
            ...(reignEnd != null ? [{ labelEn: "Mid-reign", labelHy: "Թ. կես", year: Math.floor((king.reign_start + reignEnd) / 2) }] : []),
            ...(reignEnd != null ? [{ labelEn: "End of reign", labelHy: "Թ. վերջ", year: reignEnd }] : []),
          ].map(({ labelEn, labelHy, year: y }) => (
            <Link
              key={y}
              href={`/map?year=${y}`}
              className="group flex flex-col items-center gap-2 bg-stone-900 border border-stone-800 hover:border-stone-600 rounded-xl p-4 transition-all text-center"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                style={{ backgroundColor: color + "22", color }}
              >
                🗺️
              </div>
              <span className="text-xs text-stone-400 group-hover:text-stone-200 transition-colors leading-tight">
                {lang === "hy" ? labelHy : labelEn}
              </span>
              <span className="text-xs font-bold tabular-nums" style={{ color }}>{fmt(y, lang)}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Prev / Next navigation */}
      {(prevKing || nextKing) && (
        <div className="anim-fade-up mt-10 grid grid-cols-2 gap-4" style={{ animationDelay: "350ms" }}>
          {prevKing ? (
            <Link
              href={`/kings/${prevKing.id}`}
              className="flex flex-col gap-1 bg-stone-900 border border-stone-800 rounded-xl p-4 hover:border-stone-600 transition-colors group"
            >
              <span className="text-xs text-stone-600 uppercase tracking-widest">← {lang === "hy" ? "Նախորդ" : "Previous"}</span>
              <span className="text-sm font-semibold text-stone-300 group-hover:text-white transition-colors">
                {lang === "hy" && prevKing.name_hy ? prevKing.name_hy : prevKing.name}
              </span>
              <span className="text-xs text-stone-600 tabular-nums">{fmt(prevKing.reign_start, lang)}</span>
            </Link>
          ) : <div />}

          {nextKing ? (
            <Link
              href={`/kings/${nextKing.id}`}
              className="flex flex-col gap-1 bg-stone-900 border border-stone-800 rounded-xl p-4 hover:border-stone-600 transition-colors group text-right"
            >
              <span className="text-xs text-stone-600 uppercase tracking-widest">{lang === "hy" ? "Հաջ." : "Next"} →</span>
              <span className="text-sm font-semibold text-stone-300 group-hover:text-white transition-colors">
                {lang === "hy" && nextKing.name_hy ? nextKing.name_hy : nextKing.name}
              </span>
              <span className="text-xs text-stone-600 tabular-nums">{fmt(nextKing.reign_start, lang)}</span>
            </Link>
          ) : <div />}
        </div>
      )}
    </div>
  );
}
