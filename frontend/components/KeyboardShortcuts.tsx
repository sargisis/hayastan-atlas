"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/lib/lang";

const SHORTCUTS = [
  { keys: ["?"], descEn: "Open this panel", descHy: "Բացել այս վահանակը" },
  { keys: ["⌘", "K"], descEn: "Search rulers & events", descHy: "Որոնել կառ. / իրադ." },
  { keys: ["Esc"], descEn: "Close modal / panel", descHy: "Փակել" },
  { keys: ["Space"], descEn: "Play / pause timeline", descHy: "Նվ. / դադ. ժամ. գ." },
  { keys: ["←", "→"], descEn: "Previous / next era", descHy: "Նախ. / հաջ. դար." },
  { keys: ["F"], descEn: "Toggle fullscreen map", descHy: "Լիաէկ. քարտ." },
] as const;

export default function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);
  const { lang } = useLang();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "?") { e.preventDefault(); setOpen((v) => !v); }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={() => setOpen(false)}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-sm bg-stone-900 border border-stone-700 rounded-2xl shadow-2xl overflow-hidden anim-fade"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800">
          <h2 className="font-bold text-white text-sm">
            {lang === "hy" ? "Ստեղնաշար. Դյուրանուններ" : "Keyboard Shortcuts"}
          </h2>
          <button onClick={() => setOpen(false)} className="text-stone-500 hover:text-stone-300 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="divide-y divide-stone-800/60">
          {SHORTCUTS.map(({ keys, descEn, descHy }) => (
            <div key={descEn} className="flex items-center justify-between px-5 py-3">
              <span className="text-sm text-stone-300">{lang === "hy" ? descHy : descEn}</span>
              <div className="flex items-center gap-1">
                {keys.map((k) => (
                  <kbd key={k} className="px-2 py-0.5 bg-stone-800 border border-stone-700 rounded text-xs font-mono text-stone-300">
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 py-3 border-t border-stone-800 text-center text-xs text-stone-600">
          {lang === "hy" ? "Սեղմեք ? կրկին փակելու" : "Press ? again to close"}
        </div>
      </div>
    </div>
  );
}
