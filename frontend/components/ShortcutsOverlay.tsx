"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/lang";

const SHORTCUTS = [
  { keys: ["Space"], en: "Play / Pause timeline", hy: "Նվագել / Դադարեցնել" },
  { keys: ["←", "→"], en: "Jump to previous / next era", hy: "Նախ. / Հաջ. դարաշրջան" },
  { keys: ["1", "2", "3", "4"], en: "Set playback speed (0.5× – 5×)", hy: "Արագություն (0.5× – 5×)" },
  { keys: ["F"], en: "Toggle fullscreen", hy: "Լիաէկրան" },
  { keys: ["?"], en: "Show / hide this panel", hy: "Ցույց տալ / Թաքցնել" },
  { keys: ["Ctrl", "K"], en: "Open search", hy: "Բացել որոնումը" },
  { keys: ["Esc"], en: "Close panels & popups", hy: "Փակել վահանակները" },
];

export default function ShortcutsOverlay() {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "?") setOpen((v) => !v);
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      {/* Help button */}
      <button
        onClick={() => setOpen((v) => !v)}
        title={lang === "hy" ? "Ստeghnik (?) " : "Keyboard shortcuts (?)"}
        className="absolute bottom-4 left-4 z-10 w-7 h-7 rounded-full bg-stone-950/80 backdrop-blur border border-stone-700 text-stone-500 hover:text-white hover:border-stone-500 transition-all text-xs font-bold shadow-lg flex items-center justify-center"
      >
        ?
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative bg-stone-950 border border-stone-700 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800">
              <div>
                <h2 className="text-base font-bold text-white">
                  {lang === "hy" ? "Ստեղնաշարի դյուրանցումներ" : "Keyboard Shortcuts"}
                </h2>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  {lang === "hy" ? "Սեղմեք ? ցուցադրելու/թաքցնելու" : "Press ? to toggle this panel"}
                </p>
              </div>
              <button onClick={() => setOpen(false)} className="text-stone-600 hover:text-white transition-colors text-lg leading-none">✕</button>
            </div>

            {/* Shortcuts list */}
            <div className="px-5 py-4 space-y-3">
              {SHORTCUTS.map((s, i) => (
                <div key={i} className="flex items-center justify-between gap-4">
                  <span className="text-sm text-stone-300">
                    {lang === "hy" ? s.hy : s.en}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    {s.keys.map((k) => (
                      <kbd
                        key={k}
                        className="px-2 py-1 rounded-md bg-stone-800 border border-stone-600 text-stone-200 text-[11px] font-mono font-bold shadow-sm"
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-5 py-3 border-t border-stone-800 text-[10px] text-stone-600 text-center">
              Hayastan Atlas · {lang === "hy" ? "Baghner" : "Shortcuts"}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
