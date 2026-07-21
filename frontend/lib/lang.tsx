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

const translations: Record<string, Record<Lang, string>> = {
  // Navbar
  map: { en: "Map", hy: "Քարտեզ" },
  kings: { en: "Kings", hy: "Թագավորներ" },
  events: { en: "Events", hy: "Իրադարձություններ" },
  bookmarks: { en: "Bookmarks", hy: "Էջանիշեր" },
  search: { en: "Search", hy: "Որոնում" },
  // EraPanel
  capital: { en: "Capital", hy: "Մայրաքաղաք" },
  move_timeline: { en: "Move the timeline to explore Armenian history", hy: "Շարժեք ժամանակագծը հայոց պատմությունն ուսումնասիրելու համար" },
  // EventsPanel
  events_around: { en: "Events around", hy: "Իրադարձություններ" },
  no_events_nearby: { en: "No events nearby", hy: "Մոտ իրադարձություններ չկան" },
  // Events page
  historical_events: { en: "Historical Events", hy: "Պատմական Իրադարձություններ" },
  events_subtitle: { en: "Milestones, battles, and turning points across three thousand years of Armenian history.", hy: "Հայոց եռահազարամյա պատմության կարևոր իրադարձություններ, ճակատամարտեր և շրջադարձային պահեր։" },
  all_eras: { en: "All eras", hy: "Բոլոր դարաշրջանները" },
  other_events: { en: "Other Events", hy: "Այլ Իրադարձություններ" },
  jump_to_map: { en: "Jump to map", hy: "Անցնել քարտեզ" },
  no_events_found: { en: "No events found.", hy: "Իրադարձություններ չեն գտնվել։" },
  // Kings page
  rulers_of_armenia: { en: "Rulers of Armenia", hy: "Հայաստանի Կառավարիչները" },
  view_details: { en: "View details →", hy: "Մանրամասներ →" },
  // Search modal
  search_placeholder: { en: "Search rulers, events…", hy: "Փնտրեք կառավարիչ, իրադարձություն…" },
  rulers: { en: "Rulers", hy: "Կառավարիչներ" },
  ruler: { en: "ruler", hy: "կառավարիչ" },
  event: { en: "event", hy: "իրադարձություն" },
  enter_to_navigate: { en: "↵ to navigate", hy: "↵ անցնելու համար" },
  esc_to_close: { en: "Esc to close", hy: "Esc փակելու համար" },
  type_to_search: { en: "Type at least 2 characters…", hy: "Մուտքագրեք առնվազն 2 նիշ…" },
  no_results: { en: "No results for", hy: "Արդյունք չկա" },
  // Bookmarks
  my_bookmarks: { en: "My Bookmarks", hy: "Իմ Էջանիշերը" },
  loading: { en: "Loading…", hy: "Բեռնում…" },
  sign_in_to_view: { en: "Sign in to view your bookmarks", hy: "Մուտք գործեք ձեր էջանիշերը տեսնելու համար" },
  no_bookmarks: { en: "No bookmarks yet", hy: "Էջանիշեր չկան" },
  sign_in: { en: "Sign in with Google", hy: "Մուտք Google-ով" },
  // Kings page
  kings_title: { en: "Kings & Rulers of Armenia", hy: "Հայաստանի Թագավորներն ու Կառավարիչները" },
  kings_subtitle: { en: "Twenty-eight centuries of monarchs — from the kings of Urartu who founded Yerevan, through Tigranes the Great whose empire touched three seas, to the last king of Cilicia.", hy: "Քսանութ դարերի միապետներ — Ուրարտուի թագավորներից մինչ Կիլիկիայի վերջին թագավորը, Տիգրան Մեծ ու Տրդատ Ա՝ Հայոց պատմության հսկաները։" },
  loading_rulers: { en: "Loading rulers…", hy: "Բեռնում…" },
  dynasty_word: { en: "Dynasty", hy: "Արքայատոհմ" },
  rulers_count: { en: "rulers", hy: "կառավարիչ" },
  yrs: { en: "yrs", hy: "տ." },
  map_at: { en: "Map at", hy: "Քարտեզ" },
  reign_disclaimer: { en: "Reign dates are based on scholarly consensus; some early dates are approximate.", hy: "Թագավորության ամսաթվերը հիմնված են գիտական կոնսենսուսի վրա, որոշ վաղ ամսաթվեր մոտավոր են։" },
  // Compare page
  compare: { en: "Compare", hy: "Համեմատել" },
  compare_title: { en: "Compare Two Eras", hy: "Համեմատել Երկու Դարաշրջան" },
  compare_subtitle: { en: "Place two years side by side to see how Armenia's territory changed.", hy: "Կողք կողքի դրեք երկու տարի՝ տեսնելու Հայաստանի տարածքի փոփոխությունը։" },
  // King detail page
  all_rulers: { en: "All rulers", hy: "Բոլոր կառավարիչները" },
  view_on_map: { en: "View on map", hy: "Տեսնել քարտեզում" },
  mid_reign_map: { en: "Mid-reign map", hy: "Կեսի քարտեզ" },
  reign_start_label: { en: "Reign start", hy: "Սկիզբ" },
  reign_end_label: { en: "Reign end", hy: "Ավարտ" },
  duration_label: { en: "Duration", hy: "Տևողություն" },
  years_abbr: { en: "yrs", hy: "տ." },
  unknown: { en: "unknown", hy: "անհայտ" },
  related_events: { en: "Events during this reign", hy: "Թագավորության ժամանակ տեղի ունեցած իրադարձություններ" },
  no_related_events: { en: "No recorded events for this period.", hy: "Այս ժամանակաշրջանի համար գրանցված իրադարձություններ չկան։" },
};

export function t(key: string, lang: Lang): string {
  return translations[key]?.[lang] ?? translations[key]?.en ?? key;
}
