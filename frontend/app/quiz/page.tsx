"use client";

import { useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import useSWR from "swr";
import type { Era, Event } from "@/lib/types";
import { useLang, fmt } from "@/lib/lang";
import Link from "next/link";

const HistoryMap = dynamic(() => import("@/components/HistoryMap"), { ssr: false });

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const MIN_YEAR = -800;
const MAX_YEAR = 1375;

function pickRandom(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

type Phase = "guessing" | "result";

export default function QuizPage() {
  const { lang } = useLang();
  const hy = lang === "hy";
  const { data: eras } = useSWR<Era[]>("/api/eras", fetcher);

  const [targetYear, setTargetYear] = useState(() => pickRandom(MIN_YEAR, MAX_YEAR));
  const [guess, setGuess] = useState(0);
  const [phase, setPhase] = useState<Phase>("guessing");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [revealed, setRevealed] = useState<Era | null>(null);

  const handleEra = useCallback((era: Era) => setRevealed(era), []);
  const handleEvents = useCallback((_: Event[]) => {}, []);

  const accuracy = (diff: number) => {
    if (diff <= 5) return 100;
    if (diff <= 20) return Math.round(100 - (diff - 5) * 2);
    if (diff <= 100) return Math.round(70 - (diff - 20) * 0.5);
    if (diff <= 300) return Math.round(30 - (diff - 100) * 0.1);
    return 0;
  };

  const submit = () => {
    const diff = Math.abs(guess - targetYear);
    const pts = accuracy(diff);
    setScore(pts);
    setTotalScore((t) => t + pts);
    setPhase("result");
  };

  const next = () => {
    setTargetYear(pickRandom(MIN_YEAR, MAX_YEAR));
    setGuess(0);
    setPhase("guessing");
    setRevealed(null);
    setRound((r) => r + 1);
  };

  const diff = Math.abs(guess - targetYear);
  const pts = phase === "result" ? score : accuracy(Math.abs(guess - targetYear));

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-56px)]">
      {/* Header bar */}
      <div className="bg-stone-950 border-b border-stone-800 px-6 py-3 flex items-center gap-6 shrink-0">
        <div>
          <h1 className="text-sm font-bold text-white">
            {hy ? "Պատմական Վիկտորինա" : "History Quiz"}
          </h1>
          <p className="text-xs text-stone-500">
            {hy ? "Գուշակի՛ր, թե ո՛ր թվականն է ցուցադրված քարտեզի վրա" : "Guess the year shown on the map"}
          </p>
        </div>
        <div className="flex items-center gap-4 ml-auto text-sm">
          <div className="text-center">
            <div className="text-xs text-stone-600 uppercase tracking-widest">{hy ? "Փուլ" : "Round"}</div>
            <div className="font-bold text-white">{round}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-stone-600 uppercase tracking-widest">{hy ? "Հաշիվ" : "Score"}</div>
            <div className="font-bold text-armenia-orange">{totalScore}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Map (left, 2/3) */}
        <div className="flex-1 relative min-h-0">
          <HistoryMap
            year={targetYear}
            onEraLoad={handleEra}
            onEventsLoad={handleEvents}
          />
          {/* Overlay: hide year label */}
          <div className="absolute top-3 left-3 z-10 px-3 py-1.5 rounded-lg bg-stone-950/90 backdrop-blur border border-stone-800 text-xs font-semibold text-stone-100">
            {phase === "guessing"
              ? (hy ? "??? թ․" : "??? AD/BC")
              : fmt(targetYear, lang)}
          </div>
        </div>

        {/* Sidebar (right) */}
        <div className="w-80 shrink-0 bg-stone-950 border-l border-stone-800 flex flex-col p-6 gap-6">
          {phase === "guessing" ? (
            <>
              <div>
                <label className="text-xs text-stone-500 uppercase tracking-widest mb-3 block">
                  {hy ? "Ձեր գուշակությունը" : "Your guess"}
                </label>
                <div className="text-center mb-4">
                  <span className="text-3xl font-bold text-armenia-orange tabular-nums">
                    {guess === 0 ? "—" : fmt(guess, lang)}
                  </span>
                </div>
                <input
                  type="range"
                  min={MIN_YEAR}
                  max={MAX_YEAR}
                  step={5}
                  value={guess || MIN_YEAR}
                  onChange={(e) => setGuess(parseInt(e.target.value, 10))}
                  className="w-full accent-armenia-orange cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-600 mt-1">
                  <span>{fmt(MIN_YEAR, lang)}</span>
                  <span>{fmt(MAX_YEAR, lang)}</span>
                </div>
              </div>

              {/* Era quick jump hint */}
              {eras && (
                <div>
                  <div className="text-xs text-stone-600 uppercase tracking-widest mb-2">
                    {hy ? "Արագ ցատկ" : "Quick jump"}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {eras.map((e) => (
                      <button
                        key={e.id}
                        onClick={() => setGuess(Math.round((e.start_year + e.end_year) / 2))}
                        className="px-2 py-1 rounded text-[10px] font-medium border transition-colors"
                        style={{ color: e.color, borderColor: e.color + "44", backgroundColor: e.color + "11" }}
                      >
                        {hy && e.name_hy ? e.name_hy : e.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={submit}
                disabled={guess === 0}
                className="mt-auto w-full py-3 rounded-xl bg-armenia-red text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                {hy ? "Հաստատել" : "Submit Guess"}
              </button>
            </>
          ) : (
            <>
              {/* Result */}
              <div className="text-center">
                <div className="text-5xl mb-3">
                  {score >= 80 ? "🎯" : score >= 50 ? "👍" : score >= 20 ? "😅" : "😬"}
                </div>
                <div className="text-3xl font-bold text-white mb-1">{score} {hy ? "pt" : "pts"}</div>
                <div className="text-stone-400 text-sm">
                  {hy ? `Ձեր գուշակությունը ${fmt(guess, lang)}` : `You guessed ${fmt(guess, lang)}`}
                </div>
                <div className="text-stone-400 text-sm">
                  {hy ? `Ճիշտ՝ ${fmt(targetYear, lang)}` : `Correct: ${fmt(targetYear, lang)}`}
                </div>
                <div className={`text-sm font-semibold mt-1 ${diff <= 10 ? "text-green-400" : diff <= 50 ? "text-yellow-400" : "text-red-400"}`}>
                  {diff === 0 ? (hy ? "Կատարյալ!" : "Perfect!") : `±${diff} ${hy ? "տ." : "yrs"}`}
                </div>
              </div>

              {/* Era info */}
              {revealed && (
                <div
                  className="rounded-xl p-4 border"
                  style={{ backgroundColor: revealed.color + "11", borderColor: revealed.color + "44" }}
                >
                  <div className="text-xs font-semibold mb-1" style={{ color: revealed.color }}>
                    {hy && revealed.name_hy ? revealed.name_hy : revealed.name}
                  </div>
                  <div className="text-xs text-stone-400">
                    {fmt(revealed.start_year, lang)} – {fmt(revealed.end_year, lang)}
                  </div>
                  {revealed.description && (
                    <p className="text-xs text-stone-400 mt-2 leading-relaxed line-clamp-4">
                      {hy && revealed.description_hy ? revealed.description_hy : revealed.description}
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-3 mt-auto">
                <button
                  onClick={next}
                  className="flex-1 py-3 rounded-xl bg-armenia-red text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  {hy ? "Հաջորդ →" : "Next →"}
                </button>
                <Link
                  href="/map"
                  className="px-4 py-3 rounded-xl border border-stone-700 text-stone-400 hover:text-white hover:border-stone-500 transition-colors text-sm font-medium flex items-center"
                >
                  {hy ? "Քարտ." : "Map"}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
