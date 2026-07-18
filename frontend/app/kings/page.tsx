"use client";

import useSWR from "swr";
import KingCard from "@/components/KingCard";
import type { King } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function fmt(y: number) {
  return y < 0 ? `${Math.abs(y)} BC` : `${y} AD`;
}

// Dynasty accent colors (match era colors on the map)
const DYNASTY_META: Record<string, { color: string; period: string; blurb: string }> = {
  Urartian: {
    color: "#8e5bb5",
    period: "800 – 590 BC",
    blurb: "Kings of Urartu (Kingdom of Van) — the Iron Age power around Lake Van and Mount Ararat, predecessor of Armenia. Founded Erebuni, the future Yerevan.",
  },
  Orontid: {
    color: "#2980b9",
    period: "570 – 200 BC",
    blurb: "The first Armenian royal house — satraps under Persia, then independent kings after Alexander the Great.",
  },
  Artaxiad: {
    color: "#e74c3c",
    period: "189 BC – 1 AD",
    blurb: "Dynasty of Artaxias and Tigranes the Great, when Armenia stretched from the Caspian to the Mediterranean.",
  },
  Arsacid: {
    color: "#e67e22",
    period: "12 – 428 AD",
    blurb: "The royal house under which Armenia became the first Christian nation in the world (301 AD) and received its alphabet (405 AD).",
  },
  Bagratid: {
    color: "#27ae60",
    period: "885 – 1045 AD",
    blurb: "The medieval golden age. Their capital Ani, \"the city of 1001 churches,\" rivaled the greatest cities of its time.",
  },
  Rubenid: {
    color: "#16a085",
    period: "1080 – 1226 AD",
    blurb: "Founders of Armenian Cilicia on the Mediterranean coast — a new Armenian state born after the fall of Ani.",
  },
  Hethumid: {
    color: "#1abc9c",
    period: "1226 – 1341 AD",
    blurb: "Kings of Cilicia allied with the Mongol Empire, holding out against the Mamluks until 1375.",
  },
};

export default function KingsPage() {
  const { data: kings, isLoading } = useSWR<King[]>("/api/kings", fetcher);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center flex-1 text-stone-500">
        <div className="anim-fade text-center">
          <div className="text-3xl mb-2 animate-pulse">♔</div>
          Loading rulers…
        </div>
      </div>
    );
  }

  // Group by dynasty preserving chronological order
  const byDynasty: Record<string, King[]> = {};
  for (const k of kings ?? []) {
    (byDynasty[k.dynasty_name] ??= []).push(k);
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 w-full">
      {/* Hero */}
      <div className="anim-fade-up mb-14 text-center">
        <h1 className="text-4xl font-bold text-white tracking-tight">
          Kings &amp; Rulers of <span className="text-armenia-orange">Armenia</span>
        </h1>
        <p className="text-stone-400 mt-3 max-w-2xl mx-auto leading-relaxed">
          Twenty-eight centuries of monarchs — from the kings of Urartu who founded Yerevan,
          through Tigranes the Great whose empire touched three seas, to the last king of Cilicia.
        </p>
      </div>

      {Object.entries(byDynasty).map(([dynasty, dynastyKings]) => {
        const meta = DYNASTY_META[dynasty] ?? {
          color: "#a8a29e",
          period: "",
          blurb: "",
        };
        const dStart = Math.min(...dynastyKings.map((k) => k.reign_start));
        const dEnd = Math.max(...dynastyKings.map((k) => k.reign_end ?? k.reign_start));

        return (
          <section key={dynasty} className="mb-16">
            {/* Dynasty header */}
            <div className="anim-fade-up mb-6">
              <div className="flex items-baseline gap-4 flex-wrap">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span
                    className="inline-block w-3 h-8 rounded"
                    style={{ backgroundColor: meta.color }}
                  />
                  {dynasty} Dynasty
                </h2>
                <span className="text-sm font-medium tabular-nums" style={{ color: meta.color }}>
                  {meta.period || `${fmt(dStart)} – ${fmt(dEnd)}`}
                </span>
                <span className="text-stone-500 text-sm">
                  {dynastyKings.length} ruler{dynastyKings.length > 1 ? "s" : ""}
                </span>
              </div>
              {meta.blurb && (
                <p className="text-stone-400 text-sm mt-2 max-w-3xl leading-relaxed">{meta.blurb}</p>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {dynastyKings.map((k, i) => (
                <KingCard
                  key={k.id}
                  king={k}
                  color={meta.color}
                  dynastyStart={dStart}
                  dynastyEnd={dEnd}
                  index={i}
                />
              ))}
            </div>
          </section>
        );
      })}

      <p className="text-stone-600 text-xs text-center mt-4 mb-8">
        Reign dates are based on scholarly consensus; some early dates are approximate.
      </p>
    </div>
  );
}
