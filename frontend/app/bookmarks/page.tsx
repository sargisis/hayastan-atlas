"use client";

import Link from "next/link";
import useSWR from "swr";
import type { Bookmark, User } from "@/lib/types";
import { useLang, fmt } from "@/lib/lang";

const fetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then((r) => {
    if (!r.ok) return null;
    return r.json();
  });

export default function BookmarksPage() {
  const { lang } = useLang();
  const { data: user } = useSWR<User | null>("/api/me", fetcher);
  const { data: bookmarks, mutate } = useSWR<Bookmark[] | null>(
    user ? "/api/bookmarks" : null,
    fetcher
  );

  const deleteBookmark = async (id: number) => {
    await fetch(`/api/bookmarks/${id}`, { method: "DELETE", credentials: "include" });
    mutate((prev) => (prev ?? []).filter((b) => b.id !== id), false);
  };

  if (user === undefined) {
    return (
      <div className="flex items-center justify-center flex-1 text-stone-500">
        <div className="anim-fade text-center">
          <div className="text-3xl mb-2 animate-pulse">🔖</div>
          Loading…
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center flex-1">
        <div className="anim-fade text-center max-w-sm">
          <div className="text-5xl mb-4">🔖</div>
          <h2 className="text-xl font-bold text-white mb-2">Sign in to view bookmarks</h2>
          <p className="text-stone-400 text-sm mb-6">
            Save your favourite years on the map and revisit them any time.
          </p>
          <a
            href="/auth/google"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-white text-stone-900 hover:bg-stone-100 transition-colors shadow"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </a>
        </div>
      </div>
    );
  }

  const list = bookmarks ?? [];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 w-full">
      <div className="anim-fade-up mb-10">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Your <span className="text-armenia-orange">Bookmarks</span>
        </h1>
        <p className="text-stone-400 mt-2 text-sm">
          Saved years from the map — jump back in instantly.
        </p>
      </div>

      {list.length === 0 ? (
        <div className="text-center py-20 text-stone-500">
          <div className="text-4xl mb-4">🔖</div>
          <p className="text-base">No bookmarks yet — save your favourite years on the map.</p>
          <Link
            href="/map"
            className="inline-block mt-4 text-sm text-armenia-orange hover:underline"
          >
            Go to map →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((bm, i) => (
            <div
              key={bm.id}
              className="anim-fade-up group flex items-center gap-4 bg-stone-900 border border-stone-800 rounded-xl px-5 py-4 hover:border-stone-600 transition-all"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-armenia-orange tabular-nums mb-0.5">
                  {fmt(bm.year, lang)}
                </div>
                <div className="text-sm font-medium text-stone-100 truncate">
                  {bm.label || "Untitled bookmark"}
                </div>
              </div>

              <Link
                href={`/map?year=${bm.year}`}
                className="shrink-0 flex items-center gap-1.5 text-xs font-medium text-stone-400 hover:text-white transition-colors border border-stone-700 hover:border-stone-500 rounded-lg px-3 py-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Go to map
              </Link>

              <button
                onClick={() => deleteBookmark(bm.id)}
                className="shrink-0 text-stone-600 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-stone-800"
                title="Delete bookmark"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
