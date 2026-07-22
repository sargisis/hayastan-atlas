"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import useSWR from "swr";
import type { User } from "@/lib/types";
import SearchModal from "./SearchModal";
import LangToggle from "./LangToggle";
import { useLang, t } from "@/lib/lang";

const fetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then((r) => {
    if (!r.ok) return null;
    return r.json();
  });

const PRIMARY_LINKS = [
  { href: "/map", key: "map" },
  { href: "/kings", key: "kings" },
  { href: "/events", key: "events" },
  { href: "/compare", key: "compare" },
];

const MORE_LINKS = [
  { href: "/dynasties", labelEn: "Dynasties", labelHy: "Արքայատոհմ", icon: "🏛️" },
  { href: "/stats", labelEn: "Statistics", labelHy: "Վիճակագրություն", icon: "📊" },
  { href: "/lessons", labelEn: "Lessons", labelHy: "Դ. Ур.", icon: "🎓" },
  { href: "/quiz", labelEn: "Quiz", labelHy: "Վикт.", icon: "🎯" },
  { href: "/bookmarks", labelEn: "Bookmarks", labelHy: "Էջանիշ", icon: "🔖" },
  { href: "/about", labelEn: "About", labelHy: "Մեր մասին", icon: "ℹ️" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const { data: user } = useSWR<User | null>("/api/me", fetcher);
  const { lang } = useLang();
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
      if (e.key === "Escape") setMoreOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navLink = (href: string, label: string) => {
    const active = pathname === href || (href !== "/" && pathname.startsWith(href));
    return (
      <Link
        href={href}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          active
            ? "bg-armenia-red text-white shadow-lg shadow-red-900/40"
            : "text-stone-400 hover:text-white hover:bg-stone-800"
        }`}
      >
        {label}
      </Link>
    );
  };

  const moreActive = MORE_LINKS.some((l) => pathname.startsWith(l.href));

  return (
    <>
      <nav className="h-14 flex items-center px-4 gap-2 bg-stone-950 border-b border-stone-800/60 shadow-lg">
        {/* Logo */}
        <Link href="/map" className="flex items-center gap-2 mr-3 group shrink-0">
          <span className="text-armenia-orange font-bold text-lg tracking-tight group-hover:opacity-80 transition-opacity">
            Հայաստան
          </span>
          <span className="text-stone-400 text-sm font-light tracking-widest uppercase hidden sm:block">Atlas</span>
        </Link>

        {/* Primary links */}
        <div className="hidden md:flex items-center gap-1">
          {PRIMARY_LINKS.map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                pathname === href || (href !== "/" && pathname.startsWith(href))
                  ? "bg-armenia-red text-white shadow-lg shadow-red-900/40"
                  : "text-stone-400 hover:text-white hover:bg-stone-800"
              }`}
            >
              {t(key, lang)}
            </Link>
          ))}
        </div>

        {/* More dropdown */}
        <div className="hidden md:block relative" ref={moreRef}>
          <button
            onClick={() => setMoreOpen((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              moreActive
                ? "bg-armenia-red text-white"
                : "text-stone-400 hover:text-white hover:bg-stone-800"
            }`}
          >
            {lang === "hy" ? "Ավելին" : "More"}
            <svg className={`w-3.5 h-3.5 transition-transform ${moreOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {moreOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-52 bg-stone-900 border border-stone-700 rounded-xl shadow-2xl overflow-hidden z-50">
              {MORE_LINKS.map(({ href, labelEn, labelHy, icon }) => {
                const active = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMoreOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                      active ? "bg-armenia-red/20 text-white" : "text-stone-300 hover:bg-stone-800 hover:text-white"
                    }`}
                  >
                    <span className="text-base">{icon}</span>
                    {lang === "hy" ? labelHy : labelEn}
                    {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-armenia-orange" />}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Search */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-stone-500 hover:text-stone-300 hover:bg-stone-800 transition-all border border-stone-800 ml-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
          </svg>
          <span className="hidden sm:block">{t("search", lang)}</span>
          <kbd className="hidden lg:block text-[10px] text-stone-600 border border-stone-700 rounded px-1 py-0.5">⌘K</kbd>
        </button>

        {/* Keyboard shortcuts hint */}
        <button
          onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "?" }))}
          title={lang === "hy" ? "Ստ. դյուր. (？)" : "Keyboard shortcuts (?)"}
          className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md text-stone-600 hover:text-stone-300 hover:bg-stone-800 transition-all border border-stone-800 text-xs font-mono"
        >
          ?
        </button>

        <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

        {/* Auth + Lang */}
        <div className="ml-auto flex items-center gap-2">
          <LangToggle />
          {user ? (
            <div className="flex items-center gap-2">
              {user.avatar_url && (
                <img src={user.avatar_url} alt={user.name} className="w-7 h-7 rounded-full border border-stone-700" />
              )}
              <span className="text-sm text-stone-300 hidden sm:block">{user.name}</span>
              <button
                onClick={() =>
                  fetch("/auth/logout", { method: "POST", credentials: "include" }).then(() => window.location.reload())
                }
                className="text-xs text-stone-600 hover:text-stone-400 transition-colors"
              >
                {lang === "hy" ? "Ելք" : "Sign out"}
              </button>
            </div>
          ) : (
            <a
              href="/auth/google"
              className="hidden sm:flex items-center gap-2 text-sm bg-white hover:bg-stone-100 transition-colors text-stone-900 font-medium px-3 py-1.5 rounded-md shadow"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {lang === "hy" ? "Մուտք" : "Sign in"}
            </a>
          )}
        </div>
      </nav>

      {/* Mobile bottom navigation */}
      <MobileNav pathname={pathname} lang={lang} />
    </>
  );
}

function MobileNav({ pathname, lang }: { pathname: string; lang: string }) {
  const ALL_LINKS = [
    { href: "/map", icon: "🗺️", labelEn: "Map", labelHy: "Քարտ." },
    { href: "/kings", icon: "♔", labelEn: "Kings", labelHy: "Թագ." },
    { href: "/events", icon: "⚡", labelEn: "Events", labelHy: "Իրադ." },
    { href: "/compare", icon: "⚖️", labelEn: "Compare", labelHy: "Համ." },
    { href: "/stats", icon: "📊", labelEn: "Stats", labelHy: "Վիճ." },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-950/95 backdrop-blur border-t border-stone-800 flex">
      {ALL_LINKS.map(({ href, icon, labelEn, labelHy }) => {
        const active = pathname === href || (href !== "/" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
              active ? "text-armenia-orange" : "text-stone-500 hover:text-stone-300"
            }`}
          >
            <span className="text-lg leading-none">{icon}</span>
            {lang === "hy" ? labelHy : labelEn}
          </Link>
        );
      })}
    </div>
  );
}
