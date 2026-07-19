"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Lang = "en" | "hy";

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LangContext = createContext<LangCtx>({ lang: "en", setLang: () => {} });

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved === "en" || saved === "hy") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

export function fmt(year: number, lang: Lang = "en") {
  if (lang === "hy") {
    return year < 0 ? `${Math.abs(year)} մ.թ.ա.` : `${year} մ.թ.`;
  }
  return year < 0 ? `${Math.abs(year)} BC` : `${year} AD`;
}
