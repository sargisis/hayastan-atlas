"use client";

import Link from "next/link";
import { useLang } from "@/lib/lang";

export default function AboutPage() {
  const { lang } = useLang();
  const hy = lang === "hy";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 w-full">
      {/* Header */}
      <div className="anim-fade-up text-center mb-14">
        <div className="text-5xl mb-4">🗺️</div>
        <h1 className="text-4xl font-bold text-white tracking-tight mb-3">
          {hy ? (
            <><span className="text-armenia-orange">Հայաստան</span> Atlas</>
          ) : (
            <>Hayastan <span className="text-armenia-orange">Atlas</span></>
          )}
        </h1>
        <p className="text-stone-400 max-w-xl mx-auto leading-relaxed">
          {hy
            ? "Հայաստանի 2800-ամյա պատմության ինտերակտիվ ուղեցույց՝ ժամանակային շերտերով, ճակատամարտերով, թագավորներով և տարածքային փոփոխություններով։"
            : "An interactive guide to 2,800 years of Armenian history — with territorial changes, battles, rulers, and eras brought to life on a live map."}
        </p>
      </div>

      {/* What is this */}
      <section className="anim-fade-up mb-12" style={{ animationDelay: "50ms" }}>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-armenia-orange">01.</span>
          {hy ? "Ի՞նչ է սա" : "What is this?"}
        </h2>
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 text-stone-300 leading-relaxed space-y-3 text-[15px]">
          <p>
            {hy
              ? "Hayastan Atlas-ը ժամանակի ընթացքում Հայաստանի տարածքների ինտերակտիվ քարտեզ է։ Ժամանակագիծը Ուրարտուից (800 թ. մ.թ.ա.) մինչ Հայաստանի Հանրապետություն (1991 թ.) ձգվում է՝ յուրաքանչյուր դարաշրջանի համար ցույց տալով Հայկական պետության ճշգրիտ սահմաններ, հարևան պետություններ, մայրաքաղաք-քաղաքներ ու կարևոր իրադարձություններ։"
              : "Hayastan Atlas is an interactive map of Armenia's territory through time. The timeline spans from Urartu (800 BC) to the Republic of Armenia (1991 AD), showing accurate borders of the Armenian state, neighbouring powers, capital cities, and key historical events for each era."}
          </p>
          <p>
            {hy
              ? "Ժամանակային գծի ցանկացած կետ ընտրելով՝ քարտեզը ակնթարթորեն թարմանում է` ցույց տալով, թե ինչ տեսք ուներ Հայաստանն ու դրա շրջակայքը ճիշտ այդ պահին։"
              : "Drag the timeline to any point and the map instantly updates to show what Armenia and its surroundings looked like at that exact moment."}
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="anim-fade-up mb-12" style={{ animationDelay: "100ms" }}>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-armenia-orange">02.</span>
          {hy ? "Հնարավորություններ" : "Features"}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: "🗺️", title: hy ? "Ինտերակտիվ քարտեզ" : "Interactive Map", desc: hy ? "MapLibre GL — ՀՀ-ի տարածքների GeoJSON շերտեր" : "MapLibre GL with GeoJSON territorial layers" },
            { icon: "⏱️", title: hy ? "Ժամանակային գիծ" : "Timeline", desc: hy ? "Ձգեք 800 մ.թ.ա.-ից մինչ 2025 թ." : "Drag from 800 BC to 2025 AD" },
            { icon: "♔", title: hy ? "Կառավարիչներ" : "Rulers", desc: hy ? "7 արքայատոհմ, 100+ թագավոր" : "7 dynasties, 100+ monarchs" },
            { icon: "⚡", title: hy ? "Իրադարձություններ" : "Events", desc: hy ? "Ճակատամարտեր, պայմանագրեր, հիմնում" : "Battles, treaties, foundings" },
            { icon: "🔍", title: hy ? "Որոնում" : "Search", desc: hy ? "Ctrl+K — կառավարիչ, իրադարձություն" : "Ctrl+K — rulers and events" },
            { icon: "⚖️", title: hy ? "Համեմատություն" : "Compare", desc: hy ? "Կողք կողքի երկու դարաշրջան" : "Two eras side by side" },
            { icon: "🔖", title: hy ? "Էջանիշ" : "Bookmarks", desc: hy ? "Պահպանեք հետաքրքիր տարիներ" : "Save interesting years" },
            { icon: "🌐", title: hy ? "Երկլեզու" : "Bilingual", desc: hy ? "Անգլերեն և Հայերեն" : "English and Armenian" },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex gap-3 bg-stone-900 border border-stone-800 rounded-xl p-4">
              <span className="text-2xl shrink-0">{icon}</span>
              <div>
                <div className="font-semibold text-white text-sm">{title}</div>
                <div className="text-stone-400 text-xs mt-0.5">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sources */}
      <section className="anim-fade-up mb-12" style={{ animationDelay: "150ms" }}>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-armenia-orange">03.</span>
          {hy ? "Աղբյուրներ" : "Sources"}
        </h2>
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-3 text-sm text-stone-300">
          {[
            { label: hy ? "Պատմական սահմաններ" : "Historical borders", value: "R. Hewsen — Armenia: A Historical Atlas (2001)" },
            { label: hy ? "Կառավարիչների ցուցակ" : "Ruler lists", value: "Encyclopædia Iranica · Encyclopædia Britannica" },
            { label: hy ? "Իրադարձություններ" : "Events", value: "Cyril Toumanoff — Studies in Christian Caucasian History" },
            { label: hy ? "Բազային քարտեզ" : "Base map", value: "CartoDB Dark Matter (OpenStreetMap contributors)" },
            { label: hy ? "Ժամանակագրություն" : "Chronology", value: "Movses Khorenatsi · Ghazar Parpetsi · Sebeos" },
          ].map(({ label, value }) => (
            <div key={label} className="flex gap-3">
              <span className="text-stone-600 shrink-0 w-36 text-xs uppercase tracking-wide mt-0.5">{label}</span>
              <span className="text-stone-400 text-xs leading-relaxed">{value}</span>
            </div>
          ))}
          <p className="text-stone-600 text-xs pt-2 border-t border-stone-800">
            {hy
              ? "Ամսաթվերը հիմնված են գիտական կոնսենսուսի վրա։ Վաղ ժամանակաշրջանի սահմանները մոտավոր են։"
              : "Dates follow scholarly consensus. Early-period borders are approximate reconstructions."}
          </p>
        </div>
      </section>

      {/* Stack */}
      <section className="anim-fade-up mb-12" style={{ animationDelay: "200ms" }}>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-armenia-orange">04.</span>
          {hy ? "Տեխնոլոգիա" : "Tech Stack"}
        </h2>
        <div className="flex flex-wrap gap-2">
          {["Next.js 14", "TypeScript", "MapLibre GL JS", "Tailwind CSS", "Go (net/http)", "PostgreSQL + PostGIS", "Google OAuth2"].map((t) => (
            <span key={t} className="px-3 py-1.5 bg-stone-900 border border-stone-800 rounded-full text-xs font-medium text-stone-300">
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="anim-fade-up text-center pt-4" style={{ animationDelay: "250ms" }}>
        <Link
          href="/map"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-armenia-red text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-red-900/30"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          {hy ? "Բացել Քարտեզը" : "Open the Map"}
        </Link>
      </div>
    </div>
  );
}
