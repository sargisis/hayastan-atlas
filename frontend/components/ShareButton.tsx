"use client";

import { useState } from "react";

interface Props {
  year: number;
}

export default function ShareButton({ year }: Props) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = `${window.location.origin}/map?year=${year}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers without clipboard API
      window.prompt("Copy this link:", url);
    }
  };

  return (
    <button
      onClick={share}
      title="Copy link to this year"
      className="absolute bottom-16 left-14 z-10 flex items-center gap-2 px-3 py-2 rounded-lg bg-stone-950/80 backdrop-blur border border-stone-800 text-stone-400 hover:text-white hover:border-stone-600 transition-all text-xs font-medium shadow-xl"
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-green-400">Copied!</span>
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
        </>
      )}
    </button>
  );
}
