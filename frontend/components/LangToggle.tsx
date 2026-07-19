"use client";

import { useLang } from "@/lib/lang";

export default function LangToggle() {
  const { lang, setLang } = useLang();

  return (
    <div className="flex items-center rounded-md border border-stone-700 overflow-hidden text-xs font-medium">
      <button
        onClick={() => setLang("en")}
        className={`px-2 py-1 transition-colors ${
          lang === "en" ? "bg-stone-700 text-white" : "text-stone-500 hover:text-stone-300"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang("hy")}
        className={`px-2 py-1 transition-colors ${
          lang === "hy" ? "bg-stone-700 text-white" : "text-stone-500 hover:text-stone-300"
        }`}
      >
        ՀՅ
      </button>
    </div>
  );
}
