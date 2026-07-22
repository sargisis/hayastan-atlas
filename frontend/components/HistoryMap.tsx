"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import type { Era, Event, TimelineResponse } from "@/lib/types";
import { useLang, fmt } from "@/lib/lang";
import { featureNameHY, phaseLabelHY } from "@/lib/mapTranslations";

interface Props {
  year: number;
  onEraLoad: (era: Era) => void;
  onEventsLoad: (events: Event[]) => void;
  onPhaseLoad?: (label: string) => void;
}

// Dark basemap without modern country labels — historical borders draw on top
const MAP_STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json";

const INIT_CENTER: [number, number] = [43.5, 39.5];
const INIT_ZOOM = 5.2;

export default function HistoryMap({ year, onEraLoad, onEventsLoad, onPhaseLoad }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const lastPhaseRef = useRef<number | null>(null);
  const [styleReady, setStyleReady] = useState(false);
  const { lang } = useLang();

  // Throttle year fetching so rapid playback doesn't abort every in-flight request
  const [fetchYear, setFetchYear] = useState(year);
  const throttleRef = useRef<{ timer: ReturnType<typeof setTimeout> | null; lastTime: number }>({ timer: null, lastTime: 0 });
  useEffect(() => {
    const THROTTLE_MS = 1500;
    const now = Date.now();
    const t = throttleRef.current;
    if (t.timer !== null) { clearTimeout(t.timer); t.timer = null; }
    const elapsed = now - t.lastTime;
    if (elapsed >= THROTTLE_MS) {
      t.lastTime = now;
      setFetchYear(year);
    } else {
      const cy = year;
      t.timer = setTimeout(() => { t.lastTime = Date.now(); t.timer = null; setFetchYear(cy); }, THROTTLE_MS - elapsed);
    }
    return () => { if (t.timer !== null) { clearTimeout(t.timer); t.timer = null; } };
  }, [year]);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: INIT_CENTER,
      zoom: INIT_ZOOM,
      attributionControl: { compact: true },
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    map.on("load", () => {
      map.addSource("territory", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      // --- Neighbor states: muted fill, dashed outline ---
      map.addLayer({
        id: "neighbor-fill",
        type: "fill",
        source: "territory",
        filter: ["==", ["get", "role"], "neighbor"],
        paint: {
          "fill-color": ["get", "color"],
          "fill-opacity": 0.13,
        },
      });
      map.addLayer({
        id: "neighbor-outline",
        type: "line",
        source: "territory",
        filter: ["==", ["get", "role"], "neighbor"],
        paint: {
          "line-color": ["get", "color"],
          "line-width": 1.2,
          "line-dasharray": [3, 3],
          "line-opacity": 0.7,
        },
      });

      // --- Allied / minor Armenian states: medium emphasis ---
      map.addLayer({
        id: "ally-fill",
        type: "fill",
        source: "territory",
        filter: ["==", ["get", "role"], "ally"],
        paint: {
          "fill-color": ["get", "color"],
          "fill-opacity": 0.24,
        },
      });
      map.addLayer({
        id: "ally-outline",
        type: "line",
        source: "territory",
        filter: ["==", ["get", "role"], "ally"],
        paint: {
          "line-color": ["get", "color"],
          "line-width": 1.6,
        },
      });

      // --- Main Armenian state: strong fill + glowing border ---
      map.addLayer({
        id: "main-fill",
        type: "fill",
        source: "territory",
        filter: ["==", ["get", "role"], "main"],
        // "fill-color-transition" is valid at runtime but missing from maplibre's paint typings
        paint: {
          "fill-color": ["get", "color"],
          "fill-opacity": 0.32,
          "fill-color-transition": { duration: 600 },
        } as any,
      });
      map.addLayer({
        id: "main-glow",
        type: "line",
        source: "territory",
        filter: ["==", ["get", "role"], "main"],
        paint: {
          "line-color": ["get", "color"],
          "line-width": 8,
          "line-opacity": 0.25,
          "line-blur": 6,
        },
      });
      map.addLayer({
        id: "main-outline",
        type: "line",
        source: "territory",
        filter: ["==", ["get", "role"], "main"],
        paint: {
          "line-color": ["get", "color"],
          "line-width": 2.5,
        },
      });

      // --- Campaign arrows ---
      map.addLayer({
        id: "arrow-line",
        type: "line",
        source: "territory",
        filter: ["==", ["get", "role"], "arrow"],
        paint: {
          "line-color": ["get", "color"],
          "line-width": 2.5,
          "line-dasharray": [2, 2],
          "line-opacity": 0.9,
        },
      });
      map.addLayer({
        id: "arrow-label",
        type: "symbol",
        source: "territory",
        filter: ["==", ["get", "role"], "arrow"],
        layout: {
          "symbol-placement": "line",
          "text-field": ["get", "name"],
          "text-size": 11,
          "text-font": ["Open Sans Italic"],
          "text-offset": [0, -0.8],
        },
        paint: {
          "text-color": ["get", "color"],
          "text-halo-color": "#000000",
          "text-halo-width": 1.2,
        },
      });
      map.addLayer({
        id: "arrow-head",
        type: "symbol",
        source: "territory",
        filter: ["==", ["get", "role"], "arrowhead"],
        layout: {
          "text-field": "➤",
          "text-size": 18,
          "text-rotate": ["get", "rotate"],
          "text-rotation-alignment": "map",
          "text-allow-overlap": true,
        },
        paint: {
          "text-color": ["get", "color"],
          "text-halo-color": "#000000",
          "text-halo-width": 1,
        },
      });

      // --- Cities ---
      map.addSource("cities", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
      map.addLayer({
        id: "city-dots",
        type: "circle",
        source: "cities",
        filter: ["!", ["get", "capital"]],
        paint: {
          "circle-radius": 3.5,
          "circle-color": "#e7e5e4",
          "circle-stroke-color": "#000",
          "circle-stroke-width": 1.5,
        },
      });
      map.addLayer({
        id: "city-stars",
        type: "symbol",
        source: "cities",
        filter: ["get", "capital"],
        layout: {
          "text-field": "★",
          "text-size": 16,
          "text-allow-overlap": true,
        },
        paint: {
          "text-color": "#F2A800",
          "text-halo-color": "#000",
          "text-halo-width": 1.5,
        },
      });
      map.addLayer({
        id: "city-labels",
        type: "symbol",
        source: "cities",
        layout: {
          "text-field": ["get", "name"],
          "text-size": ["case", ["get", "capital"], 12, 11],
          "text-font": ["Open Sans Regular"],
          "text-offset": [0, 1.1],
          "text-anchor": "top",
        },
        paint: {
          "text-color": ["case", ["get", "capital"], "#F2A800", "#c9c5c0"],
          "text-halo-color": "#000",
          "text-halo-width": 1.3,
        },
      });

      // --- Event pins ---
      map.addSource("events", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
      map.addLayer({
        id: "event-pins",
        type: "circle",
        source: "events",
        paint: {
          "circle-radius": 7,
          "circle-color": "#F2A800",
          "circle-stroke-color": "#000",
          "circle-stroke-width": 1.5,
          "circle-opacity": 0.9,
        },
      });
      map.addLayer({
        id: "event-pin-labels",
        type: "symbol",
        source: "events",
        layout: {
          "text-field": ["get", "label"],
          "text-size": 10,
          "text-font": ["Open Sans Regular"],
          "text-offset": [0, 1.4],
          "text-anchor": "top",
          "text-optional": true,
        },
        paint: {
          "text-color": "#F2A800",
          "text-halo-color": "#000",
          "text-halo-width": 1.2,
        },
      });

      // --- Historical routes ---
      map.addSource("routes", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
      map.addLayer({
        id: "route-line",
        type: "line",
        source: "routes",
        paint: {
          "line-color": ["get", "color"],
          "line-width": 2,
          "line-dasharray": [4, 3],
          "line-opacity": 0.75,
        },
      });
      map.addLayer({
        id: "route-arrows",
        type: "symbol",
        source: "routes",
        layout: {
          "symbol-placement": "line",
          "symbol-spacing": 80,
          "text-field": "▶",
          "text-size": 10,
          "text-font": ["Open Sans Regular"],
          "text-rotation-alignment": "map",
          "text-allow-overlap": true,
        },
        paint: {
          "text-color": ["get", "color"],
          "text-opacity": 0.85,
        },
      });
      map.addLayer({
        id: "route-labels",
        type: "symbol",
        source: "routes",
        layout: {
          "symbol-placement": "line-center",
          "text-field": ["get", "name"],
          "text-size": 10,
          "text-font": ["Open Sans Italic"],
          "text-offset": [0, -1],
          "text-optional": true,
        },
        paint: {
          "text-color": ["get", "color"],
          "text-halo-color": "#000",
          "text-halo-width": 1.2,
          "text-opacity": 0.9,
        },
      });

      // --- Battle markers ---
      map.addSource("battles", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
      map.addLayer({
        id: "battle-glow",
        type: "circle",
        source: "battles",
        paint: {
          "circle-radius": 14,
          "circle-color": ["get", "color"],
          "circle-opacity": 0.15,
          "circle-blur": 1,
        },
      });
      map.addLayer({
        id: "battle-pins",
        type: "circle",
        source: "battles",
        paint: {
          "circle-radius": 7,
          "circle-color": ["get", "color"],
          "circle-stroke-color": "#000",
          "circle-stroke-width": 1.5,
          "circle-opacity": 0.95,
        },
      });
      map.addLayer({
        id: "battle-icon",
        type: "symbol",
        source: "battles",
        layout: {
          "text-field": "⚔",
          "text-size": 10,
          "text-font": ["Open Sans Regular"],
          "text-allow-overlap": true,
        },
        paint: { "text-color": "#000", "text-opacity": 0.9 },
      });

      // --- State name labels ---
      map.addLayer({
        id: "territory-labels",
        type: "symbol",
        source: "territory",
        filter: ["match", ["get", "role"], ["main", "ally", "neighbor"], true, false],
        layout: {
          "text-field": ["get", "name"],
          "text-size": [
            "case",
            ["==", ["get", "role"], "main"], 18,
            ["==", ["get", "role"], "ally"], 13,
            12,
          ],
          "text-font": ["Open Sans Bold"],
          "text-letter-spacing": 0.15,
          "text-transform": "uppercase",
          "text-allow-overlap": true,
          "text-ignore-placement": true,
        },
        paint: {
          "text-color": [
            "case",
            ["==", ["get", "role"], "main"], "#ffffff",
            ["==", ["get", "role"], "ally"], "#d6d3d1",
            "#8a837c",
          ],
          "text-halo-color": "#000000",
          "text-halo-width": 1.5,
        },
      });

      // --- Event pin click popup ---
      const popup = new maplibregl.Popup({ closeButton: true, maxWidth: "260px", className: "map-event-popup" });

      map.on("click", "event-pins", (e) => {
        const feature = e.features?.[0];
        if (!feature) return;
        const props = feature.properties as { title: string; title_hy?: string; description?: string; description_hy?: string; year: number };
        const coords = (feature.geometry as GeoJSON.Point).coordinates as [number, number];
        const currentLang = (map as any)._currentLang as string ?? "en";
        const title = currentLang === "hy" && props.title_hy ? props.title_hy : props.title;
        const desc = currentLang === "hy" && props.description_hy ? props.description_hy : (props.description ?? "");
        const yearStr = props.year < 0 ? `${Math.abs(props.year)} BC` : `${props.year} AD`;
        const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
        popup
          .setLngLat(coords)
          .setHTML(
            `<div style="font-family:sans-serif;color:#e7e5e4;background:#1c1917;padding:10px 12px;border-radius:8px;border:1px solid #44403c">` +
            `<div style="font-size:10px;color:#F2A800;font-weight:700;letter-spacing:.08em;margin-bottom:4px">${esc(yearStr)}</div>` +
            `<div style="font-size:13px;font-weight:600;margin-bottom:${desc ? "6px" : "0"}">${esc(title)}</div>` +
            (desc ? `<div style="font-size:11px;color:#a8a29e;line-height:1.5">${esc(desc)}</div>` : "") +
            `</div>`
          )
          .addTo(map);
      });

      map.on("mouseenter", "event-pins", () => { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", "event-pins", () => { map.getCanvas().style.cursor = ""; });

      // Battle popup
      const battlePopup = new maplibregl.Popup({ closeButton: true, maxWidth: "280px" });
      map.on("click", "battle-pins", (e) => {
        const feat = e.features?.[0];
        if (!feat) return;
        const p = feat.properties as Record<string, string>;
        const coords = (feat.geometry as GeoJSON.Point).coordinates as [number, number];
        const curLang = (map as any)._currentLang as string ?? "en";
        const hy = curLang === "hy";
        const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
        const outcomeLabel = p.outcome === "victory" ? (hy ? "✅ Հաղ." : "✅ Victory") : p.outcome === "defeat" ? (hy ? "❌ Պ." : "❌ Defeat") : (hy ? "⚖️ Ничья" : "⚖️ Draw");
        battlePopup.setLngLat(coords).setHTML(
          `<div style="font-family:sans-serif;color:#e7e5e4;background:#1c1917;padding:12px 14px;border-radius:8px;border:1px solid #44403c">` +
          `<div style="font-size:10px;color:${p.color};font-weight:700;letter-spacing:.08em;margin-bottom:4px">${esc(+p.year < 0 ? `${Math.abs(+p.year)} BC` : `${p.year} AD`)} · ${outcomeLabel}</div>` +
          `<div style="font-size:13px;font-weight:700;margin-bottom:6px">${esc(hy ? p.name_hy : p.name)}</div>` +
          `<div style="font-size:10px;color:#a8a29e;margin-bottom:2px">🛡 ${esc(hy ? p.armenian_side_hy : p.armenian_side)}</div>` +
          `<div style="font-size:10px;color:#a8a29e;margin-bottom:8px">⚔ ${esc(hy ? p.opponent_hy : p.opponent)}</div>` +
          `<div style="font-size:10px;color:#d6d3d1;line-height:1.5;border-top:1px solid #292524;padding-top:6px">${esc(hy ? p.significance_hy : p.significance)}</div>` +
          `</div>`
        ).addTo(map);
      });
      map.on("mouseenter", "battle-pins", () => { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", "battle-pins", () => { map.getCanvas().style.cursor = ""; });

      setStyleReady(true);
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      setStyleReady(false);
    };
  }, []);

  // Switch map label language when lang changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !styleReady) return;
    const nameField = lang === "hy" ? ["coalesce", ["get", "name_hy"], ["get", "name"]] : ["get", "name"];
    map.setLayoutProperty("city-labels", "text-field", nameField);
    map.setLayoutProperty("territory-labels", "text-field", nameField);
    map.setLayoutProperty("arrow-label", "text-field", nameField);
    // store lang on map for popup handler
    (map as any)._currentLang = lang;
  }, [lang, styleReady]);

  // Update era info, events list, and territory phase when year changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !styleReady) return;

    // Use a cancelled flag instead of AbortController so in-flight requests
    // can complete naturally — only their results are discarded if stale.
    let cancelled = false;

    async function load() {
      try {
        // Era + events (for the panels and map pins)
        const res = await fetch(`/api/timeline?year=${fetchYear}`);
        if (cancelled) return;
        if (res.ok) {
          const data: TimelineResponse = await res.json();
          if (cancelled) return;
          onEraLoad(data.era);
          onEventsLoad(data.events);

          const eventSource = map!.getSource("events") as maplibregl.GeoJSONSource | undefined;
          eventSource?.setData({
            type: "FeatureCollection",
            features: data.events
              .filter((ev) => ev.lat != null && ev.lng != null)
              .map((ev) => ({
                type: "Feature" as const,
                properties: {
                  title: ev.title,
                  title_hy: ev.title_hy,
                  description: ev.description,
                  description_hy: ev.description_hy,
                  year: ev.year,
                  label: fmt(ev.year, "en"),
                },
                geometry: { type: "Point" as const, coordinates: [ev.lng!, ev.lat!] },
              })),
          });
        }

        // Cities existing at this year
        const cityRes = await fetch(`/api/cities?year=${fetchYear}`);
        if (cancelled) return;
        if (cityRes.ok) {
          const cities: { name: string; name_hy: string; lat: number; lng: number; is_capital: boolean }[] =
            (await cityRes.json()) ?? [];
          if (cancelled) return;
          const citySource = map!.getSource("cities") as maplibregl.GeoJSONSource | undefined;
          citySource?.setData({
            type: "FeatureCollection",
            features: cities.map((c) => ({
              type: "Feature" as const,
              properties: { name: c.name, name_hy: c.name_hy || c.name, capital: c.is_capital },
              geometry: { type: "Point" as const, coordinates: [c.lng, c.lat] },
            })),
          });
        }

        // Update historical routes for this year
        if (!cancelled) {
          const routeSource = map!.getSource("routes") as maplibregl.GeoJSONSource | undefined;
          routeSource?.setData(routesToGeoJSON(fetchYear));
          const battleSource = map!.getSource("battles") as maplibregl.GeoJSONSource | undefined;
          const visibleBattles = BATTLES.filter((b) => Math.abs(b.year - fetchYear) <= 15);
          battleSource?.setData(battleToGeoJSON(visibleBattles));
        }

        // Territory phase for this exact year
        const terrRes = await fetch(`/api/territory?year=${fetchYear}`);
        if (cancelled) return;
        const source = map!.getSource("territory") as maplibregl.GeoJSONSource | undefined;
        if (!source) return;

        if (!terrRes.ok) {
          source.setData({ type: "FeatureCollection", features: [] });
          return;
        }

        const terr: { phase: number; label: string; fc: any } = await terrRes.json();
        if (cancelled) return;

        const fc = {
          ...terr.fc,
          features: (terr.fc.features ?? []).map((f: any) => ({
            ...f,
            properties: {
              ...f.properties,
              name_hy: featureNameHY[f.properties?.name] ?? f.properties?.name,
            },
          })),
        };
        source.setData(fc);
        const label = lang === "hy" ? (phaseLabelHY[terr.label] ?? terr.label) : terr.label;
        onPhaseLoad?.(label);

        // Fly the camera to fit the Armenian state's borders on phase change
        if (lastPhaseRef.current !== terr.phase && terr.fc.features?.length) {
          const bounds = new maplibregl.LngLatBounds();
          for (const f of terr.fc.features) {
            const role = f.properties?.role;
            if (role !== "main" && role !== "ally") continue;
            const rings = f.geometry?.type === "Polygon" ? f.geometry.coordinates : [];
            for (const ring of rings) {
              for (const [lng, lat] of ring) bounds.extend([lng, lat]);
            }
          }
          if (!bounds.isEmpty()) {
            map!.fitBounds(bounds, {
              padding: { top: 90, bottom: 70, left: 80, right: 360 },
              duration: 1400,
              maxZoom: 7,
              essential: true,
            });
          }
        }
        lastPhaseRef.current = terr.phase;
      } catch (e: unknown) {
        if (!cancelled) console.error(e);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [fetchYear, lang, styleReady, onEraLoad, onEventsLoad, onPhaseLoad]);

  return (
    <div style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }} />
      {styleReady && <MapControls mapRef={mapRef} containerRef={containerRef} lang={lang} />}
    </div>
  );
}

// Major battles in Armenian history
interface BattleFeature {
  name: string; name_hy: string;
  year: number; lat: number; lng: number;
  armenian_side: string; armenian_side_hy: string;
  opponent: string; opponent_hy: string;
  outcome: "victory" | "defeat" | "draw";
  significance: string; significance_hy: string;
}

const BATTLES: BattleFeature[] = [
  { name: "Battle of Ararat", name_hy: "Արարատի ճ.", year: -782, lat: 39.7, lng: 44.5, armenian_side: "Urartu (Argishti I)", armenian_side_hy: "Ուրարտու (Արգիշտի Ա)", opponent: "Assyrian Empire", opponent_hy: "Ասորական կայսրություն", outcome: "victory", significance: "Urartu repelled the Assyrian invasion, securing the Ararat valley", significance_hy: "Ուրարտուն հետ մղեց ասորական արշավանքը" },
  { name: "Battle of the Araxes", name_hy: "Արաքսի ճ.", year: -521, lat: 39.9, lng: 45.2, armenian_side: "Armenian Satrapy", armenian_side_hy: "Հայ. Սատրապություն", opponent: "Persian Empire (Darius I)", opponent_hy: "Պարսկ. Կայս. (Դարեհ Ա)", outcome: "defeat", significance: "Armenia crushed by Darius I while suppressing empire-wide revolt", significance_hy: "Դարեհ Ա-ն ճնշեց ամբողջ կայսրության ապստամբությունը" },
  { name: "Battle of Tigranocerta", name_hy: "Տիգրանակերտի ճ.", year: -69, lat: 37.9, lng: 41.5, armenian_side: "Tigranes the Great", armenian_side_hy: "Տիգրան Մեծ", opponent: "Rome (Lucullus)", opponent_hy: "Հռոմ (Լուկուլլուս)", outcome: "defeat", significance: "Rome defeated Armenia's vast but ill-disciplined army; empire began to shrink", significance_hy: "Հռոմը ջախջախեց Տիգրանի հսկայական, բայց անկազմ բանակը" },
  { name: "Battle of Artaxata", name_hy: "Արտաշատի ճ.", year: -66, lat: 39.8, lng: 44.5, armenian_side: "Tigranes the Great", armenian_side_hy: "Տիգրան Մեծ", opponent: "Rome (Pompey)", opponent_hy: "Հռոմ (Պոմպեոս)", outcome: "draw", significance: "Tigranes surrendered western conquests but kept core Armenia; treaty signed", significance_hy: "Տիգրանը հանձնեց արևմտյան նվաճումները, պահեց Մեծ Հայքը" },
  { name: "Battle of Avarayr", name_hy: "Ավարայրի ճ.", year: 451, lat: 39.15, lng: 44.72, armenian_side: "Vardan Mamikonian", armenian_side_hy: "Վարդան Մամիկոնյան", opponent: "Sasanid Persia", opponent_hy: "Սասանյան Պարսկաստան", outcome: "defeat", significance: "Armenians lost the battle but preserved Christianity — called a 'holy defeat'", significance_hy: "Հայերը կռվից պարտվեցին, բայց պահեցին Քրիստոնեությունը — «Սուրբ պարտություն»" },
  { name: "Battle of Bagrevand", name_hy: "Բագրևանդի ճ.", year: 775, lat: 39.6, lng: 43.4, armenian_side: "Armenian nobles", armenian_side_hy: "Հայ նախարարներ", opponent: "Arab Caliphate", opponent_hy: "Արաբ. Խալիֆայություն", outcome: "defeat", significance: "Crushing Arab victory; end of Armenian noble resistance for a century", significance_hy: "Ճակատամարտ, որից հետո հայ ազնվականությունը 100 տարի չկռվեց" },
  { name: "Battle of Muş", name_hy: "Մուշի ճ.", year: 863, lat: 38.7, lng: 41.5, armenian_side: "Bagratid Armenia", armenian_side_hy: "Բագրատ. Հայաստան", opponent: "Arab Caliphate", opponent_hy: "Արաբ. Խալիֆայություն", outcome: "victory", significance: "Decisive Bagratid victory, paving way for independent kingdom (885 AD)", significance_hy: "Բագրատունիների հաղթանակ, ճ. բացեց ուղի անկախ թ-ի (885 թ.)" },
  { name: "Battle of Kapetrou", name_hy: "Կապետրուի ճ.", year: 958, lat: 39.4, lng: 36.6, armenian_side: "Bagratid / Byzantine alliance", armenian_side_hy: "Բագրատ. / Բյուզ. դաշ.", opponent: "Hamdanid Emirate", opponent_hy: "Համդ. Էmirship", outcome: "victory", significance: "Joint Armenian-Byzantine forces pushed back Muslim advance in Anatolia", significance_hy: "Հայ-Բյուզ. ուժերը հետ մղեցին մուսուլ. արշ. Անատոլիայում" },
  { name: "Battle of Manzikert", name_hy: "Մանզիկերտի ճ.", year: 1071, lat: 38.95, lng: 42.52, armenian_side: "Byzantine (Armenian generals)", armenian_side_hy: "Բյուզ. (հայ զորավ.)", opponent: "Seljuk Turks (Alp Arslan)", opponent_hy: "Սելջ. թուրք. (Ալփ Արsl.)", outcome: "defeat", significance: "Byzantine collapse opened Armenia to Seljuk conquest; end of Bagratid era", significance_hy: "Բյուզ. կործ. բացեց Հայաստանը Սելջ. նվաճ. Բագրատ. դ. վերջ" },
  { name: "Battle of Sis", name_hy: "Սսի ճ.", year: 1226, lat: 37.2, lng: 35.6, armenian_side: "Armenian Cilicia (Hethumids)", armenian_side_hy: "Կիլ. Հայ. (Հեթ.)", opponent: "Seljuk Sultanate", opponent_hy: "Սելջ. Սուլթ.", outcome: "victory", significance: "Cilician Armenia repelled Seljuk attack, beginning Hethumid alliance with Mongols", significance_hy: "Կիլ. Հայ. հետ մղ. Սելջ. հարձ., սկ. Մոնղ. դաշ." },
  { name: "Battle of Mari", name_hy: "Մարիի ճ.", year: 1266, lat: 33.5, lng: 36.3, armenian_side: "Armenian Cilicia + Mongols", armenian_side_hy: "Կիլ. Հայ. + Մոնղ.", opponent: "Mamluk Egypt", opponent_hy: "Մամluk Եگipт.", outcome: "defeat", significance: "Mamluk forces devastated Cilician Armenia; began the kingdom's long decline", significance_hy: "Մամlukները ավ. Կիլ. Հայ., սկ. թ-ի անկ." },
  { name: "Fall of Sis (End of Cilicia)", name_hy: "Սսի Անկ.", year: 1375, lat: 37.2, lng: 35.6, armenian_side: "Last King Leo VI", armenian_side_hy: "Վերջ. Թagav. Լevon ԶI", opponent: "Mamluk Egypt", opponent_hy: "Մամluk Եg.", outcome: "defeat", significance: "Last Armenian kingdom fell; Leo VI taken prisoner, died in exile in 1393", significance_hy: "Վերջ. հայ. թ-ն ընկ., Լevon ԶI-ն գ. բ., 1393 թ. մ. ատ." },
  { name: "Battle of Sardarapat", name_hy: "Սardarapatի ճ.", year: 1918, lat: 40.0, lng: 43.8, armenian_side: "Armenian Republic forces", armenian_side_hy: "Հայ. Հանr. ուժ.", opponent: "Ottoman Empire", opponent_hy: "Osmanlı Kایs.", outcome: "victory", significance: "Most important Armenian military victory in modern history — saved the Armenian people from extermination", significance_hy: "Ամ. կ. հայ. ռ. հ. արդ. — փ. հ. ժ. ո." },
  { name: "Battle of Bash Abaran", name_hy: "Բաш Աbararanի ճ.", year: 1918, lat: 40.6, lng: 44.0, armenian_side: "Armenian Republic (Dro)", armenian_side_hy: "Հay. Hanr. (Drо)", opponent: "Ottoman Empire", opponent_hy: "Osmanlı Kайс.", outcome: "victory", significance: "Alongside Sardarapat, stopped the Ottoman advance into what remained of Armenia", significance_hy: "Sardarapatի կ. կangeIn հay. naxkndik Osman. arshav." },
];

function battleToGeoJSON(battles: BattleFeature[]) {
  return {
    type: "FeatureCollection" as const,
    features: battles.map((b) => ({
      type: "Feature" as const,
      properties: {
        name: b.name, name_hy: b.name_hy,
        year: b.year,
        armenian_side: b.armenian_side, armenian_side_hy: b.armenian_side_hy,
        opponent: b.opponent, opponent_hy: b.opponent_hy,
        outcome: b.outcome,
        significance: b.significance, significance_hy: b.significance_hy,
        color: b.outcome === "victory" ? "#22c55e" : b.outcome === "defeat" ? "#ef4444" : "#f59e0b",
      },
      geometry: { type: "Point" as const, coordinates: [b.lng, b.lat] },
    })),
  };
}

// Historical trade & military routes (static GeoJSON features)
interface RouteFeature {
  name: string;
  name_hy: string;
  color: string;
  type: "trade" | "military";
  from_year: number;
  to_year: number;
  coords: [number, number][];
}

const HISTORICAL_ROUTES: RouteFeature[] = [
  {
    name: "Silk Road",
    name_hy: "Μεταξοδρόμος",
    color: "#F2A800",
    type: "trade",
    from_year: -200,
    to_year: 1400,
    coords: [[116, 40], [80, 39], [63, 39], [52, 39], [44, 40], [40, 40], [36, 36], [29, 41]],
  },
  {
    name: "Persian Royal Road",
    name_hy: "Պարսկ. Արք. Ճ.",
    color: "#9b59b6",
    type: "trade",
    from_year: -550,
    to_year: -330,
    coords: [[38, 37], [40, 39], [44, 40], [46, 38], [52, 32], [55, 30]],
  },
  {
    name: "Tigranes the Great — Western Campaign",
    name_hy: "Տիգրան Մեծ — Արևմ. Արշ.",
    color: "#e74c3c",
    type: "military",
    from_year: -83,
    to_year: -69,
    coords: [[44, 40], [40, 37], [37, 36], [36, 36], [35, 36], [36, 34]],
  },
  {
    name: "Tigranes — Northern Campaign",
    name_hy: "Տիգրան — Հյուսիս. Արշ.",
    color: "#e74c3c",
    type: "military",
    from_year: -83,
    to_year: -69,
    coords: [[44, 40], [43, 42], [45, 41], [49, 41], [50, 43]],
  },
  {
    name: "Black Sea Trade Route",
    name_hy: "Սև Ծ. Ճ.",
    color: "#3498db",
    type: "trade",
    from_year: -600,
    to_year: 1200,
    coords: [[44, 40], [41, 41], [39, 41], [36, 42], [33, 42], [29, 41]],
  },
  {
    name: "Caspian Route",
    name_hy: "Կասպ. Ճ.",
    color: "#1abc9c",
    type: "trade",
    from_year: -400,
    to_year: 1300,
    coords: [[44, 40], [47, 40], [49, 39], [50, 40], [52, 41], [53, 43]],
  },
];

function routesToGeoJSON(year: number) {
  const features = HISTORICAL_ROUTES
    .filter((r) => year >= r.from_year && year <= r.to_year)
    .map((r) => ({
      type: "Feature" as const,
      properties: { name: r.name, name_hy: r.name_hy, color: r.color, kind: r.type },
      geometry: { type: "LineString" as const, coordinates: r.coords },
    }));
  return { type: "FeatureCollection" as const, features };
}

// Layer visibility state
const LAYERS = [
  { id: "cities", ids: ["city-dots", "city-stars", "city-labels"], labelEn: "Cities", labelHy: "Քաղաքներ", icon: "🏙️" },
  { id: "events", ids: ["event-pins", "event-pin-labels"], labelEn: "Events", labelHy: "Իրադ.", icon: "⚡" },
  { id: "arrows", ids: ["arrow-line", "arrow-head", "arrow-label"], labelEn: "Campaigns", labelHy: "Արշ.", icon: "⚔️" },
  { id: "routes", ids: ["route-line", "route-arrows", "route-labels"], labelEn: "Routes", labelHy: "Ուղ.", icon: "🛤️" },
  { id: "battles", ids: ["battle-glow", "battle-pins", "battle-icon"], labelEn: "Battles", labelHy: "⚔", icon: "⚔️" },
  { id: "neighbors", ids: ["neighbor-fill", "neighbor-outline"], labelEn: "Neighbors", labelHy: "Հարև.", icon: "🏳️" },
] as const;

const TERRAIN_SOURCE = "maplibre-dem";

function MapControls({ mapRef, containerRef, lang }: {
  mapRef: React.RefObject<maplibregl.Map | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  lang: string;
}) {
  const hy = lang === "hy";
  const [layerPanel, setLayerPanel] = useState(false);
  const [legendOpen, setLegendOpen] = useState(false);
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [terrain, setTerrain] = useState(false);

  const toggleTerrain = () => {
    const map = mapRef.current;
    if (!map) return;
    if (!terrain) {
      if (!map.getSource(TERRAIN_SOURCE)) {
        map.addSource(TERRAIN_SOURCE, {
          type: "raster-dem",
          url: "https://demotiles.maplibre.org/terrain-tiles/tiles.json",
          tileSize: 256,
        });
      }
      map.setTerrain({ source: TERRAIN_SOURCE, exaggeration: 1.6 });
      if (!map.getLayer("hillshade")) {
        map.addLayer({
          id: "hillshade",
          type: "hillshade",
          source: TERRAIN_SOURCE,
          paint: { "hillshade-exaggeration": 0.35, "hillshade-shadow-color": "#000" },
        }, map.getLayer("neighbor-fill") ? "neighbor-fill" : undefined);
      }
      map.setLayoutProperty("hillshade", "visibility", "visible");
    } else {
      map.setTerrain(null);
      if (map.getLayer("hillshade")) map.setLayoutProperty("hillshade", "visibility", "none");
    }
    setTerrain((v) => !v);
  };

  const toggleLayer = (layerId: string, ids: readonly string[]) => {
    const map = mapRef.current;
    if (!map) return;
    const nowHidden = !hidden.has(layerId);
    const vis = nowHidden ? "none" : "visible";
    ids.forEach((id) => {
      try { map.setLayoutProperty(id, "visibility", vis); } catch {}
    });
    setHidden((prev) => {
      const next = new Set(prev);
      nowHidden ? next.add(layerId) : next.delete(layerId);
      return next;
    });
  };

  const toggleFullscreen = () => {
    const el = containerRef.current?.parentElement;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // F key → fullscreen
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "f" || e.key === "F") toggleFullscreen();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFullscreen]);

  return (
    <>
      {/* Control buttons — top-left stack */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {/* Layers button */}
        <button
          onClick={() => { setLayerPanel((v) => !v); setLegendOpen(false); }}
          title={hy ? "Շերտեր" : "Layers"}
          className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm shadow-lg border transition-all ${
            layerPanel ? "bg-armenia-orange text-stone-950 border-armenia-orange" : "bg-stone-950/85 backdrop-blur border-stone-700 text-stone-300 hover:text-white"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </button>

        {/* Legend button */}
        <button
          onClick={() => { setLegendOpen((v) => !v); setLayerPanel(false); }}
          title={hy ? "Լեգենդ" : "Legend"}
          className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm shadow-lg border transition-all ${
            legendOpen ? "bg-armenia-orange text-stone-950 border-armenia-orange" : "bg-stone-950/85 backdrop-blur border-stone-700 text-stone-300 hover:text-white"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </button>

        {/* Fullscreen button */}
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? (hy ? "Ելք" : "Exit fullscreen") : (hy ? "Լիաէկ." : "Fullscreen")}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-sm shadow-lg border bg-stone-950/85 backdrop-blur border-stone-700 text-stone-300 hover:text-white transition-all"
        >
          {isFullscreen ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
            </svg>
          )}
        </button>

        {/* Terrain / 3D button */}
        <button
          onClick={toggleTerrain}
          title={terrain ? (hy ? "Անջատ. ռելիեֆ" : "Disable 3D terrain") : (hy ? "3D ռելիեֆ" : "3D Terrain")}
          className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm shadow-lg border transition-all ${
            terrain ? "bg-armenia-orange text-stone-950 border-armenia-orange" : "bg-stone-950/85 backdrop-blur border-stone-700 text-stone-300 hover:text-white"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 18l4-8 4 4 4-6 4 10H3z" />
          </svg>
        </button>
      </div>

      {/* Layers panel */}
      {layerPanel && (
        <div className="absolute top-4 left-14 z-10 bg-stone-950/90 backdrop-blur border border-stone-700 rounded-xl shadow-2xl p-3 w-44">
          <div className="text-[10px] uppercase tracking-widest text-stone-500 mb-2 px-1">{hy ? "Շերտեր" : "Map Layers"}</div>
          {LAYERS.map((layer) => {
            const on = !hidden.has(layer.id);
            return (
              <button
                key={layer.id}
                onClick={() => toggleLayer(layer.id, layer.ids)}
                className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-colors ${on ? "text-white" : "text-stone-600"}`}
              >
                <span className={`w-8 h-4 rounded-full transition-colors flex-shrink-0 ${on ? "bg-armenia-orange" : "bg-stone-700"}`}>
                  <span className={`block w-3.5 h-3.5 rounded-full bg-white shadow transition-transform mt-0.5 ${on ? "translate-x-4" : "translate-x-0.5"}`} />
                </span>
                <span className="text-base leading-none">{layer.icon}</span>
                <span className="text-xs">{hy ? layer.labelHy : layer.labelEn}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Legend panel */}
      {legendOpen && (
        <div className="absolute top-4 left-14 z-10 bg-stone-950/90 backdrop-blur border border-stone-700 rounded-xl shadow-2xl p-4 w-52">
          <div className="text-[10px] uppercase tracking-widest text-stone-500 mb-3">{hy ? "Լեգենդ" : "Legend"}</div>
          <div className="space-y-2.5 text-xs">
            {[
              { color: "#c0392b", opacity: "bg-opacity-30", label: hy ? "Հայկ. հիմն. պետ." : "Main Armenian state", type: "fill" },
              { color: "#2980b9", opacity: "bg-opacity-20", label: hy ? "Դաշնակից/փոքր" : "Allied / minor state", type: "fill" },
              { color: "#78716c", opacity: "bg-opacity-10", label: hy ? "Հարևան պետ." : "Neighbour state", type: "dash" },
              { color: "#F2A800", opacity: "", label: hy ? "Պատմ. իրադ." : "Historical event", type: "dot" },
              { color: "#F2A800", opacity: "", label: hy ? "Մայրաքաղաք" : "Capital city", type: "star" },
              { color: "#e7e5e4", opacity: "", label: hy ? "Քաղաք" : "City", type: "circle" },
              { color: "#a8a29e", opacity: "", label: hy ? "Ռազմ. արշ." : "Military campaign", type: "arrow" },
              { color: "#F2A800", opacity: "", label: hy ? "Առևտ. ուղի" : "Trade route", type: "route-trade" },
              { color: "#e74c3c", opacity: "", label: hy ? "Ռազմ. ուղի" : "Military route", type: "route-military" },
            ].map(({ color, label, type }) => (
              <div key={label} className="flex items-center gap-2.5 text-stone-300">
                {type === "fill" && <span className="w-5 h-3 rounded shrink-0 opacity-70" style={{ backgroundColor: color, border: `1.5px solid ${color}` }} />}
                {type === "dash" && <span className="w-5 h-0 border-t-2 border-dashed shrink-0" style={{ borderColor: color }} />}
                {type === "dot" && <span className="w-3.5 h-3.5 rounded-full shrink-0 mx-[3px]" style={{ backgroundColor: color }} />}
                {type === "star" && <span className="text-base leading-none shrink-0" style={{ color }}>★</span>}
                {type === "circle" && <span className="w-3 h-3 rounded-full border-2 shrink-0 mx-[1px]" style={{ borderColor: color }} />}
                {type === "arrow" && <span className="text-xs shrink-0 mx-[1px]" style={{ color }}>➤</span>}
                {type === "route-trade" && <span className="w-5 h-0 border-t-2 border-dashed shrink-0" style={{ borderColor: color }} />}
                {type === "route-military" && <span className="w-5 h-0 border-t-2 border-dashed shrink-0" style={{ borderColor: color }} />}
                <span className="leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
