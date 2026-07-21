"use client";

import { useState } from "react";
import { fmt } from "@/lib/lang";
import { useLang } from "@/lib/lang";

interface Props {
  year: number;
}

export default function ExportButton({ year }: Props) {
  const { lang } = useLang();
  const [exporting, setExporting] = useState(false);

  const download = () => {
    const canvas = document.querySelector<HTMLCanvasElement>(".maplibregl-canvas");
    if (!canvas) return;

    setExporting(true);
    try {
      const link = document.createElement("a");
      link.download = `armenia-${year < 0 ? `${Math.abs(year)}bc` : `${year}ad`}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setTimeout(() => setExporting(false), 800);
    }
  };

  return (
    <button
      onClick={download}
      title={lang === "hy" ? "Ներբեռնել PNG" : "Download map as PNG"}
      className="absolute bottom-28 left-14 z-10 flex items-center gap-2 px-3 py-2 rounded-lg bg-stone-950/80 backdrop-blur border border-stone-800 text-stone-400 hover:text-white hover:border-stone-600 transition-all text-xs font-medium shadow-xl"
    >
      {exporting ? (
        <>
          <svg className="w-3.5 h-3.5 text-green-400 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-green-400">{lang === "hy" ? "Ներբեռնվում…" : "Saving…"}</span>
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {lang === "hy" ? "PNG" : "Export"}
        </>
      )}
    </button>
  );
}
