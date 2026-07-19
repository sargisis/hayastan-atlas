"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import useSWR from "swr";
import type { User } from "@/lib/types";
import SearchModal from "./SearchModal";
import LangToggle from "./LangToggle";

const fetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then((r) => {
    if (!r.ok) return null;
    return r.json();
  });

export default function Navbar() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const { data: user } = useSWR<User | null>("/api/me", fetcher);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const navLink = (href: string, label: string) => {
    const active = pathname.startsWith(href);
    return (
      <Link
        href={href}
        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
          active
            ? "bg-armenia-red text-white shadow-lg shadow-red-900/40"
            : "text-stone-400 hover:text-white hover:bg-stone-800"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className="h-14 flex items-center px-6 gap-4 bg-stone-950 border-b border-stone-800/60 shadow-lg">
      {/* Logo */}
      <Link href="/map" className="flex items-center gap-2 mr-4 group">
        <span className="text-armenia-orange font-bold text-lg tracking-tight group-hover:opacity-80 transition-opacity">
          Հայաստան
        </span>
        <span className="text-stone-400 text-sm font-light tracking-widest uppercase">Atlas</span>
      </Link>

      {navLink("/map", "Map")}
      {navLink("/kings", "Kings")}
      {navLink("/events", "Events")}
      {navLink("/bookmarks", "Bookmarks")}

      {/* Search button */}
      <button
        onClick={() => setSearchOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-stone-500 hover:text-stone-300 hover:bg-stone-800 transition-all border border-stone-800"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
        </svg>
        <span className="hidden sm:block">Search</span>
        <kbd className="hidden sm:block text-[10px] text-stone-600 border border-stone-700 rounded px-1 py-0.5">⌘K</kbd>
      </button>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      <div className="ml-auto flex items-center gap-3">
        <LangToggle />
        {user ? (
          <>
            {user.avatar_url && (
              <img src={user.avatar_url} alt={user.name} className="w-7 h-7 rounded-full border border-stone-700" />
            )}
            <span className="text-sm text-stone-300">{user.name}</span>
            <button
              onClick={() =>
                fetch("/auth/logout", { method: "POST", credentials: "include" }).then(() =>
                  window.location.reload()
                )
              }
              className="text-xs text-stone-600 hover:text-stone-400 transition-colors"
            >
              Sign out
            </button>
          </>
        ) : (
          <a
            href="/auth/google"
            className="flex items-center gap-2 text-sm bg-white hover:bg-stone-100 transition-colors text-stone-900 font-medium px-4 py-1.5 rounded-md shadow"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </a>
        )}
      </div>
    </nav>
  );
}
