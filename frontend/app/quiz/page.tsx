"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import useSWR from "swr";
import type { Era, Event } from "@/lib/types";
import { useLang, fmt } from "@/lib/lang";
import Link from "next/link";
import { LOCATION_QUESTIONS, haversineKm, locationScore } from "@/lib/quizQuestions";

const HistoryMap = dynamic(() => import("@/components/HistoryMap"), { ssr: false });

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const MIN_YEAR = -800;
const MAX_YEAR = 1375;

function pickRandom(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Phase = "guessing" | "result";
type Mode = "year" | "location";

// ── Year Quiz ────────────────────────────────────────────────────────────────
function YearQuiz({ totalScore, onScore }: { totalScore: number; onScore: (pts: number) => void }) {
  const { lang } = useLang();
  const hy = lang === "hy";
  const { data: eras } = useSWR<Era[]>("/api/eras", fetcher);

  const [targetYear, setTargetYear] = useState(() => pickRandom(MIN_YEAR, MAX_YEAR));
  const [guess, setGuess] = useState(0);
  const [phase, setPhase] = useState<Phase>("guessing");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
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
    onScore(pts);
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

  return (
    <div className="flex flex-1 min-h-0">
      {/* Map */}
      <div className="flex-1 relative min-h-0">
        <HistoryMap year={targetYear} onEraLoad={handleEra} onEventsLoad={handleEvents} />
        <div className="absolute top-3 left-3 z-10 px-3 py-1.5 rounded-lg bg-stone-950/90 backdrop-blur border border-stone-800 text-xs font-semibold text-stone-100">
          {phase === "guessing" ? (hy ? "??? թ." : "??? AD/BC") : fmt(targetYear, lang)}
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 shrink-0 bg-stone-950 border-l border-stone-800 flex flex-col p-6 gap-6">
        <div className="text-xs text-stone-500 uppercase tracking-widest">
          {hy ? "Փ." : "Round"} {round} · {hy ? "Հ.:" : "Score:"}{" "}
          <span className="text-armenia-orange font-bold">{totalScore}</span>
        </div>

        {phase === "guessing" ? (
          <>
            <div>
              <label className="text-xs text-stone-500 uppercase tracking-widest mb-3 block">
                {hy ? "Ձ. գուշ." : "Your guess"}
              </label>
              <div className="text-center mb-4">
                <span className="text-3xl font-bold text-armenia-orange tabular-nums">
                  {guess === 0 ? "—" : fmt(guess, lang)}
                </span>
              </div>
              <input
                type="range" min={MIN_YEAR} max={MAX_YEAR} step={5}
                value={guess || MIN_YEAR}
                onChange={(e) => setGuess(parseInt(e.target.value, 10))}
                className="w-full accent-armenia-orange cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-600 mt-1">
                <span>{fmt(MIN_YEAR, lang)}</span>
                <span>{fmt(MAX_YEAR, lang)}</span>
              </div>
            </div>

            {eras && (
              <div>
                <div className="text-xs text-stone-600 uppercase tracking-widest mb-2">
                  {hy ? "Արագ ցատ." : "Quick jump"}
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
              {hy ? "Հաստ." : "Submit Guess"}
            </button>
          </>
        ) : (
          <>
            <div className="text-center">
              <div className="text-5xl mb-3">
                {score >= 80 ? "🎯" : score >= 50 ? "👍" : score >= 20 ? "😅" : "😬"}
              </div>
              <div className="text-3xl font-bold text-white mb-1">{score} pts</div>
              <div className="text-stone-400 text-sm">
                {hy ? `Ձ.գ.: ${fmt(guess, lang)}` : `Guessed: ${fmt(guess, lang)}`}
              </div>
              <div className="text-stone-400 text-sm">
                {hy ? `Ճ.: ${fmt(targetYear, lang)}` : `Correct: ${fmt(targetYear, lang)}`}
              </div>
              <div className={`text-sm font-semibold mt-1 ${diff <= 10 ? "text-green-400" : diff <= 50 ? "text-yellow-400" : "text-red-400"}`}>
                {diff === 0 ? (hy ? "Կատ.!" : "Perfect!") : `±${diff} ${hy ? "տ." : "yrs"}`}
              </div>
            </div>

            {revealed && (
              <div className="rounded-xl p-4 border" style={{ backgroundColor: revealed.color + "11", borderColor: revealed.color + "44" }}>
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
              <button onClick={next} className="flex-1 py-3 rounded-xl bg-armenia-red text-white font-semibold hover:opacity-90 transition-opacity">
                {hy ? "Հջ. →" : "Next →"}
              </button>
              <Link href="/map" className="px-4 py-3 rounded-xl border border-stone-700 text-stone-400 hover:text-white hover:border-stone-500 transition-colors text-sm font-medium flex items-center">
                {hy ? "Qtrt." : "Map"}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Location Quiz ─────────────────────────────────────────────────────────────
function LocationQuiz({ totalScore, onScore }: { totalScore: number; onScore: (pts: number) => void }) {
  const { lang } = useLang();
  const hy = lang === "hy";

  const [questions] = useState(() => shuffled(LOCATION_QUESTIONS));
  const [qIdx, setQIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("guessing");
  const [guess, setGuess] = useState<{ lat: number; lng: number } | null>(null);
  const [score, setScore] = useState(0);
  const [km, setKm] = useState(0);
  const [round, setRound] = useState(1);
  const [finished, setFinished] = useState(false);

  const q = questions[qIdx];

  const handleMapClick = useCallback((lat: number, lng: number) => {
    if (phase === "guessing") setGuess({ lat, lng });
  }, [phase]);

  const handleEra = useCallback((_: Era) => {}, []);
  const handleEvents = useCallback((_: Event[]) => {}, []);

  const submit = () => {
    if (!guess) return;
    const dist = haversineKm(guess.lat, guess.lng, q.lat, q.lng);
    const pts = locationScore(dist);
    setKm(Math.round(dist));
    setScore(pts);
    onScore(pts);
    setPhase("result");
  };

  const next = () => {
    const nextIdx = qIdx + 1;
    if (nextIdx >= questions.length) { setFinished(true); return; }
    setQIdx(nextIdx);
    setGuess(null);
    setPhase("guessing");
    setRound((r) => r + 1);
  };

  if (finished) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-2xl font-bold text-white mb-2">{hy ? "Ավ.!" : "Finished!"}</h2>
          <p className="text-stone-400 mb-6">{hy ? `Ընդ. հ.: ${totalScore}` : `Total score: ${totalScore}`}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { setQIdx(0); setGuess(null); setPhase("guessing"); setRound(1); setFinished(false); }}
              className="px-6 py-3 rounded-xl bg-armenia-red text-white font-semibold hover:opacity-90 transition-opacity"
            >
              {hy ? "Կրկ." : "Play Again"}
            </button>
            <Link href="/map" className="px-6 py-3 rounded-xl border border-stone-700 text-stone-300 hover:text-white transition-colors font-medium">
              {hy ? "Qtrt." : "Map"}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 min-h-0">
      {/* Map */}
      <div className="flex-1 relative min-h-0">
        <HistoryMap
          year={q.year}
          onEraLoad={handleEra}
          onEventsLoad={handleEvents}
          onMapClick={handleMapClick}
          quizMode
        />

        {/* Instruction */}
        {phase === "guessing" && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            <div className="px-4 py-2 rounded-full bg-stone-950/90 backdrop-blur border border-stone-700 text-xs text-stone-300">
              {guess
                ? (hy ? "📍 Dzer nishann drvel e · Klick-el texasharzhelu hamar" : "📍 Pin placed · Click again to move it")
                : (hy ? "👆 Klick-el kartezi vra" : "👆 Click on the map to place your answer")}
            </div>
          </div>
        )}

        {/* Result location banner */}
        {phase === "result" && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
            <div className="px-4 py-2 rounded-xl bg-stone-950/95 border border-green-800 text-xs text-stone-300 text-center max-w-xs shadow-2xl">
              <div className="text-green-400 font-semibold mb-1">✓ {hy ? "Ճ. Tel." : "Correct location"}:</div>
              <div className="text-white font-medium">{hy ? q.region_hy : q.region}</div>
              <div className="text-stone-500 text-[10px] mt-0.5">{q.lat.toFixed(2)}°N {q.lng.toFixed(2)}°E</div>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="w-80 shrink-0 bg-stone-950 border-l border-stone-800 flex flex-col p-6 gap-5">
        <div className="text-xs text-stone-500 uppercase tracking-widest">
          {hy ? "Հ." : "Q"} {round}/{questions.length} ·{" "}
          <span className="text-armenia-orange font-bold">{totalScore}</span> pts
        </div>

        {/* Question card */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-armenia-orange mb-2">
            {fmt(q.year, lang)}
          </div>
          <p className="text-sm font-semibold text-white leading-snug">
            {hy ? q.question_hy : q.question}
          </p>
          <p className="text-xs text-stone-500 mt-2 leading-relaxed">
            💡 {hy ? q.hint_hy : q.hint}
          </p>
        </div>

        {phase === "guessing" ? (
          <>
            {/* Pin status */}
            <div className={`rounded-xl p-4 border text-center transition-all ${guess ? "border-armenia-orange/50 bg-armenia-orange/10" : "border-stone-800 bg-stone-900/40"}`}>
              {guess ? (
                <>
                  <div className="text-2xl mb-1">📍</div>
                  <div className="text-xs text-stone-300 font-mono">
                    {guess.lat.toFixed(3)}°N, {guess.lng.toFixed(3)}°E
                  </div>
                  <div className="text-[10px] text-stone-500 mt-1">
                    {hy ? "Klick-el kartezi vra nshan texasharzhelu hamar" : "Click again to reposition"}
                  </div>
                </>
              ) : (
                <div className="text-xs text-stone-600">
                  {hy ? "Klick-el kartezi vra Dzez pataskhane" : "Click the map to place your answer"}
                </div>
              )}
            </div>

            <button
              onClick={submit}
              disabled={!guess}
              className="mt-auto w-full py-3 rounded-xl bg-armenia-red text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              {hy ? "Hast." : "Submit Answer"}
            </button>
          </>
        ) : (
          <>
            {/* Score result */}
            <div className="text-center">
              <div className="text-4xl mb-2">
                {score >= 80 ? "🎯" : score >= 50 ? "👍" : score >= 20 ? "😅" : "😬"}
              </div>
              <div className="text-3xl font-bold text-white mb-1">{score} pts</div>
              <div className={`text-lg font-semibold ${km <= 80 ? "text-green-400" : km <= 300 ? "text-yellow-400" : "text-red-400"}`}>
                {km === 0 ? (hy ? "Կat.!" : "Bull's-eye!") : `${km} km ${hy ? "հ." : "off"}`}
              </div>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-2">
              <div>
                <div className="text-[10px] text-stone-500 uppercase tracking-widest mb-0.5">{hy ? "Ճ. Tel." : "Correct location"}</div>
                <div className="text-sm font-semibold text-white">{hy ? q.region_hy : q.region}</div>
              </div>
              {guess && (
                <div>
                  <div className="text-[10px] text-stone-500 uppercase tracking-widest mb-0.5">{hy ? "Ձ. Nish." : "Your pin"}</div>
                  <div className="text-xs text-stone-400 font-mono">
                    {guess.lat.toFixed(3)}°N, {guess.lng.toFixed(3)}°E
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={next}
              className="mt-auto w-full py-3 rounded-xl bg-armenia-red text-white font-semibold hover:opacity-90 transition-opacity"
            >
              {qIdx + 1 >= questions.length ? (hy ? "Avartacnel →" : "See Results →") : (hy ? "Hj. →" : "Next →")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Main Quiz Page ────────────────────────────────────────────────────────────
export default function QuizPage() {
  const { lang } = useLang();
  const hy = lang === "hy";
  const [mode, setMode] = useState<Mode>("year");
  const [totalScore, setTotalScore] = useState(0);

  const addScore = useCallback((pts: number) => setTotalScore((s) => s + pts), []);

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-56px)]">
      {/* Header */}
      <div className="bg-stone-950 border-b border-stone-800 px-6 py-3 flex items-center gap-4 shrink-0">
        <div>
          <h1 className="text-sm font-bold text-white">
            {hy ? "Պ. Viktorina 2.0" : "History Quiz 2.0"}
          </h1>
          <p className="text-xs text-stone-500">
            {mode === "year"
              ? (hy ? "Gushakir tarine kartezi vra" : "Guess the year shown on the map")
              : (hy ? "Klickacel kartezi vra pataskhane" : "Click on the map to answer")}
          </p>
        </div>

        {/* Mode tabs */}
        <div className="flex items-center gap-1 ml-auto bg-stone-900 border border-stone-800 rounded-xl p-1">
          <button
            onClick={() => setMode("year")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === "year" ? "bg-armenia-red text-white shadow" : "text-stone-400 hover:text-white"
            }`}
          >
            {hy ? "📅 Tarer" : "📅 Year Quiz"}
          </button>
          <button
            onClick={() => setMode("location")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === "location" ? "bg-armenia-red text-white shadow" : "text-stone-400 hover:text-white"
            }`}
          >
            {hy ? "📍 Venky" : "📍 Location Quiz"}
          </button>
        </div>

        <div className="text-center shrink-0">
          <div className="text-[10px] text-stone-600 uppercase tracking-widest">{hy ? "Yndh." : "Total"}</div>
          <div className="font-bold text-armenia-orange text-sm">{totalScore}</div>
        </div>
      </div>

      {mode === "year"
        ? <YearQuiz key="year" totalScore={totalScore} onScore={addScore} />
        : <LocationQuiz key="location" totalScore={totalScore} onScore={addScore} />}
    </div>
  );
}
