"use client";

import Link from "next/link";
import { LESSONS } from "@/lib/lessons";
import { useLang, fmt } from "@/lib/lang";

export default function LessonsPage() {
  const { lang } = useLang();
  const hy = lang === "hy";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 w-full">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">
          {hy ? "Դ. Ուrokner" : "History Lessons"}
        </h1>
        <p className="text-stone-400 text-sm">
          {hy
            ? "Uh. ketor. Hayastani patmoutchian karokyan zargatcman yeranelic paternery"
            : "Guided step-by-step tours through the key moments of Armenian history"}
        </p>
      </div>

      <div className="grid gap-4">
        {LESSONS.map((lesson, i) => (
          <Link
            key={lesson.id}
            href={`/lessons/${lesson.id}`}
            className="group relative flex items-center gap-5 bg-stone-900 border border-stone-800 hover:border-stone-600 rounded-2xl p-5 transition-all overflow-hidden"
          >
            {/* Color accent */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
              style={{ backgroundColor: lesson.color }}
            />

            {/* Number + icon */}
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-transform group-hover:scale-110"
              style={{ backgroundColor: lesson.color + "22", border: `1.5px solid ${lesson.color}44` }}
            >
              {lesson.icon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: lesson.color }}>
                  {hy ? "Դ." : "Lesson"} {i + 1}
                </span>
                <span className="text-[10px] text-stone-600">·</span>
                <span className="text-[10px] text-stone-600">{lesson.steps.length} {hy ? "Qa." : "steps"}</span>
                <span className="text-[10px] text-stone-600">·</span>
                <span className="text-[10px] text-stone-600 tabular-nums">
                  {fmt(lesson.steps[0].year, lang)} – {fmt(lesson.steps[lesson.steps.length - 1].year, lang)}
                </span>
              </div>
              <h2 className="text-base font-bold text-white group-hover:text-armenia-orange transition-colors leading-snug">
                {hy ? lesson.title_hy : lesson.title}
              </h2>
              <p className="text-xs text-stone-500 mt-1 line-clamp-1">
                {hy ? lesson.subtitle_hy : lesson.subtitle}
              </p>
            </div>

            {/* Arrow */}
            <svg className="w-5 h-5 text-stone-600 group-hover:text-armenia-orange transition-colors shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
