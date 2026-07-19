"use client";

import useSWR from "swr";
import KingCard from "@/components/KingCard";
import type { King } from "@/lib/types";
import { useLang, fmt, t } from "@/lib/lang";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface DynastyMeta {
  color: string;
  period: { en: string; hy: string };
  name: { en: string; hy: string };
  blurb: { en: string; hy: string };
}

const DYNASTY_META: Record<string, DynastyMeta> = {
  Urartian: {
    color: "#8e5bb5",
    period: { en: "800 – 590 BC", hy: "800 – 590 մ.թ.ա." },
    name: { en: "Urartian", hy: "Ուրարտական" },
    blurb: {
      en: "Kings of Urartu (Kingdom of Van) — the Iron Age power around Lake Van and Mount Ararat, predecessor of Armenia. Founded Erebuni, the future Yerevan.",
      hy: "Ուրարտուի (Վանի Թագավորության) թագավորներ — Վանա լճի և Արարատ լեռան շուրջ երկաթի դարի հզոր պետություն, Հայաստանի նախատիպ։ Հիմնադրեցին Էրեբունին՝ ապագա Երևանը։",
    },
  },
  Orontid: {
    color: "#2980b9",
    period: { en: "570 – 200 BC", hy: "570 – 200 մ.թ.ա." },
    name: { en: "Orontid", hy: "Երվանդունի" },
    blurb: {
      en: "The first Armenian royal house — satraps under Persia, then independent kings after Alexander the Great.",
      hy: "Հայաստանի առաջին արքայատոհմը — Պարսկաստանի ներքո сатrapներ, ապա Ալեքսանդր Մեծից հետո անկախ թագավորներ։",
    },
  },
  Artaxiad: {
    color: "#e74c3c",
    period: { en: "189 BC – 1 AD", hy: "189 մ.թ.ա. – 1 մ.թ." },
    name: { en: "Artaxiad", hy: "Արտաշեսյան" },
    blurb: {
      en: "Dynasty of Artaxias and Tigranes the Great, when Armenia stretched from the Caspian to the Mediterranean.",
      hy: "Արտաշեսի և Տիգրան Մեծի արքայատոհմ, երբ Հայաստանը տարածվում էր Կասպից ծովից մինչ Միջերկրական ծով։",
    },
  },
  Arsacid: {
    color: "#e67e22",
    period: { en: "12 – 428 AD", hy: "12 – 428 մ.թ." },
    name: { en: "Arsacid", hy: "Արշակունի" },
    blurb: {
      en: "The royal house under which Armenia became the first Christian nation in the world (301 AD) and received its alphabet (405 AD).",
      hy: "Արքայատոհմ, որի ժամանակ Հայաստանը դարձավ աշխարհի առաջին քրիստոնյա պետությունը (301 թ.) և ստացավ հայկական այբուբենը (405 թ.)։",
    },
  },
  Bagratid: {
    color: "#27ae60",
    period: { en: "885 – 1045 AD", hy: "885 – 1045 մ.թ." },
    name: { en: "Bagratid", hy: "Բագրատունի" },
    blurb: {
      en: 'The medieval golden age. Their capital Ani, "the city of 1001 churches," rivaled the greatest cities of its time.',
      hy: "Միջնադարյան ոսկե դար։ Անի մայրաքաղաքը՝ «1001 եկեղեցիների քաղաքը», մրցակցում էր ժամանակի մեծ քաղաքների հետ։",
    },
  },
  Rubenid: {
    color: "#16a085",
    period: { en: "1080 – 1226 AD", hy: "1080 – 1226 մ.թ." },
    name: { en: "Rubenid", hy: "Ռուբինյան" },
    blurb: {
      en: "Founders of Armenian Cilicia on the Mediterranean coast — a new Armenian state born after the fall of Ani.",
      hy: "Կիլիկյան Հայաստանի հիմնադիրներ Միջերկրական ծովի ափին — Անիի անկումից հետո ծնված նոր հայկական պետություն։",
    },
  },
  Hethumid: {
    color: "#1abc9c",
    period: { en: "1226 – 1341 AD", hy: "1226 – 1341 մ.թ." },
    name: { en: "Hethumid", hy: "Հեթումյան" },
    blurb: {
      en: "Kings of Cilicia allied with the Mongol Empire, holding out against the Mamluks until 1375.",
      hy: "Կիլիկիայի թագավորներ, որոնք դաշնակցեցին Մոնղոլական կայսրության հետ՝ 1375 թ. մինչ Մամլուքներին դիմադրելու համար։",
    },
  },
};

export default function KingsPage() {
  const { lang } = useLang();
  const { data: kings, isLoading } = useSWR<King[]>("/api/kings", fetcher);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center flex-1 text-stone-500">
        <div className="anim-fade text-center">
          <div className="text-3xl mb-2 animate-pulse">♔</div>
          {t("loading_rulers", lang)}
        </div>
      </div>
    );
  }

  const byDynasty: Record<string, King[]> = {};
  for (const k of kings ?? []) {
    (byDynasty[k.dynasty_name] ??= []).push(k);
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 w-full">
      <div className="anim-fade-up mb-14 text-center">
        <h1 className="text-4xl font-bold text-white tracking-tight">
          {lang === "hy" ? (
            <>Հայաստանի Թագավորներն ու <span className="text-armenia-orange">Կառավարիչները</span></>
          ) : (
            <>Kings &amp; Rulers of <span className="text-armenia-orange">Armenia</span></>
          )}
        </h1>
        <p className="text-stone-400 mt-3 max-w-2xl mx-auto leading-relaxed">
          {lang === "hy"
            ? "Քսանութ դար — Ուրարտուի թագավորներից, ովքեր հիմնադրեցին Երևանը, Տիգրան Մեծ ու Տրդատ Ա-ի, մինչ Կիլիկիայի վերջին թագավորը։"
            : "Twenty-eight centuries of monarchs — from the kings of Urartu who founded Yerevan, through Tigranes the Great whose empire touched three seas, to the last king of Cilicia."}
        </p>
      </div>

      {Object.entries(byDynasty).map(([dynasty, dynastyKings]) => {
        const meta = DYNASTY_META[dynasty];
        const color = meta?.color ?? "#a8a29e";
        const dStart = Math.min(...dynastyKings.map((k) => k.reign_start));
        const dEnd = Math.max(...dynastyKings.map((k) => k.reign_end ?? k.reign_start));
        const displayName = meta ? meta.name[lang] : dynasty;
        const displayPeriod = meta ? meta.period[lang] : `${fmt(dStart, lang)} – ${fmt(dEnd, lang)}`;
        const displayBlurb = meta ? meta.blurb[lang] : "";

        return (
          <section key={dynasty} className="mb-16">
            <div className="anim-fade-up mb-6">
              <div className="flex items-baseline gap-4 flex-wrap">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="inline-block w-3 h-8 rounded" style={{ backgroundColor: color }} />
                  {displayName} {t("dynasty_word", lang)}
                </h2>
                <span className="text-sm font-medium tabular-nums" style={{ color }}>
                  {displayPeriod}
                </span>
                <span className="text-stone-500 text-sm">
                  {dynastyKings.length} {t("rulers_count", lang)}
                </span>
              </div>
              {displayBlurb && (
                <p className="text-stone-400 text-sm mt-2 max-w-3xl leading-relaxed">{displayBlurb}</p>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {dynastyKings.map((k, i) => (
                <KingCard
                  key={k.id}
                  king={k}
                  color={color}
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
        {t("reign_disclaimer", lang)}
      </p>
    </div>
  );
}
