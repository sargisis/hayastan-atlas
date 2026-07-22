"use client";

import { useParams } from "next/navigation";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { LESSONS } from "@/lib/lessons";
import type { Era, Event } from "@/lib/types";
import { useLang, fmt } from "@/lib/lang";

const HistoryMap = dynamic(() => import("@/components/HistoryMap"), { ssr: false });

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const { lang } = useLang();
  const hy = lang === "hy";

  const lesson = LESSONS.find((l) => l.id === id);
  const [stepIdx, setStepIdx] = useState(0);

  const handleEraLoad = useCallback((_: Era) => {}, []);
  const handleEventsLoad = useCallback((_: Event[]) => {}, []);

  if (!lesson) {
    return (
      <div className="flex items-center justify-center flex-1 text-stone-500">
        <div className="text-center">
          <div className="text-4xl mb-2">✕</div>
          <p>Lesson not found.</p>
          <Link href="/lessons" className="text-armenia-orange hover:underline mt-2 inline-block text-sm">← {hy ? "Բ. Ур." : "All lessons"}</Link>
        </div>
      </div>
    );
  }

  const step = lesson.steps[stepIdx];
  const isFirst = stepIdx === 0;
  const isLast = stepIdx === lesson.steps.length - 1;

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-56px)]">
      {/* Top bar */}
      <div className="bg-stone-950 border-b border-stone-800 px-5 py-3 flex items-center gap-4 shrink-0">
        <Link href="/lessons" className="text-stone-500 hover:text-stone-300 transition-colors shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <span className="text-lg shrink-0">{lesson.icon}</span>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-bold text-white truncate">{hy ? lesson.title_hy : lesson.title}</h1>
          <p className="text-xs text-stone-500 truncate">{hy ? lesson.subtitle_hy : lesson.subtitle}</p>
        </div>
        {/* Step progress */}
        <div className="hidden sm:flex items-center gap-1 shrink-0">
          {lesson.steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStepIdx(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === stepIdx ? "scale-125" : "opacity-40 hover:opacity-70"}`}
              style={{ backgroundColor: lesson.color }}
            />
          ))}
        </div>
        <span className="text-xs text-stone-500 shrink-0 tabular-nums">
          {stepIdx + 1} / {lesson.steps.length}
        </span>
      </div>

      {/* Main: map + step panel */}
      <div className="flex-1 flex min-h-0">
        {/* Map */}
        <div className="flex-1 relative min-h-0">
          <HistoryMap
            year={step.year}
            onEraLoad={handleEraLoad}
            onEventsLoad={handleEventsLoad}
          />
          {/* Year badge */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            <div
              className="px-4 py-1.5 rounded-full text-sm font-bold text-white shadow-lg border"
              style={{ backgroundColor: lesson.color + "cc", borderColor: lesson.color }}
            >
              {fmt(step.year, lang)}
            </div>
          </div>
        </div>

        {/* Step panel */}
        <div className="w-80 shrink-0 bg-stone-950 border-l border-stone-800 flex flex-col">
          {/* Step content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: lesson.color }}>
              {hy ? "Qa." : "Step"} {stepIdx + 1} · {fmt(step.year, lang)}
            </div>
            <h2 className="text-xl font-bold text-white leading-snug mb-4">
              {hy ? step.title_hy : step.title}
            </h2>
            <p className="text-sm text-stone-300 leading-relaxed">
              {hy ? step.body_hy : step.body}
            </p>
          </div>

          {/* Step nav */}
          <div className="border-t border-stone-800 p-4 flex gap-3">
            <button
              onClick={() => setStepIdx((i) => i - 1)}
              disabled={isFirst}
              className="flex-1 py-2.5 rounded-lg border border-stone-700 text-sm font-medium text-stone-300 hover:border-stone-500 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← {hy ? "Нах." : "Prev"}
            </button>
            {isLast ? (
              <Link
                href="/lessons"
                className="flex-1 py-2.5 rounded-lg text-sm font-bold text-stone-950 text-center transition-all hover:opacity-90"
                style={{ backgroundColor: lesson.color }}
              >
                {hy ? "Ав." : "Finish"} ✓
              </Link>
            ) : (
              <button
                onClick={() => setStepIdx((i) => i + 1)}
                className="flex-1 py-2.5 rounded-lg text-sm font-bold text-stone-950 transition-all hover:opacity-90"
                style={{ backgroundColor: lesson.color }}
              >
                {hy ? "Հ." : "Next"} →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
