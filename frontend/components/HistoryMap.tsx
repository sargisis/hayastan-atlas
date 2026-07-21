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
        paint: {
          "fill-color": ["get", "color"],
          "fill-opacity": 0.32,
          "fill-color-transition": { duration: 600 },
        },
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

    const controller = new AbortController();

    async function load() {
      try {
        // Era + events (for the panels and map pins)
        const res = await fetch(`/api/timeline?year=${year}`, { signal: controller.signal });
        if (res.ok) {
          const data: TimelineResponse = await res.json();
          onEraLoad(data.era);
          onEventsLoad(data.events);

          // Update event pins on the map (only events with coordinates)
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
        const cityRes = await fetch(`/api/cities?year=${year}`, { signal: controller.signal });
        if (cityRes.ok) {
          const cities: { name: string; name_hy: string; lat: number; lng: number; is_capital: boolean }[] =
            (await cityRes.json()) ?? [];
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

        // Territory phase for this exact year
        const terrRes = await fetch(`/api/territory?year=${year}`, { signal: controller.signal });
        const source = map!.getSource("territory") as maplibregl.GeoJSONSource | undefined;
        if (!source) return;

        if (!terrRes.ok) {
          source.setData({ type: "FeatureCollection", features: [] });
          return;
        }

        const terr: { phase: number; label: string; fc: any } = await terrRes.json();
        // Inject name_hy into each feature for Armenian map labels
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
        if (e instanceof Error && e.name !== "AbortError") console.error(e);
      }
    }

    load();
    return () => controller.abort();
  }, [year, lang, styleReady, onEraLoad, onEventsLoad, onPhaseLoad]);

  return (
    <div style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }} />
      {styleReady && <MapControls mapRef={mapRef} containerRef={containerRef} lang={lang} />}
    </div>
  );
}

// Layer visibility state
const LAYERS = [
  { id: "cities", ids: ["city-dots", "city-stars", "city-labels"], labelEn: "Cities", labelHy: "Քաղաքներ", icon: "🏙️" },
  { id: "events", ids: ["event-pins", "event-pin-labels"], labelEn: "Events", labelHy: "Իրադ.", icon: "⚡" },
  { id: "arrows", ids: ["arrow-line", "arrow-head", "arrow-label"], labelEn: "Campaigns", labelHy: "Արշ.", icon: "⚔️" },
  { id: "neighbors", ids: ["neighbor-fill", "neighbor-outline"], labelEn: "Neighbors", labelHy: "Հարև.", icon: "🏳️" },
] as const;

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
            ].map(({ color, label, type }) => (
              <div key={label} className="flex items-center gap-2.5 text-stone-300">
                {type === "fill" && <span className="w-5 h-3 rounded shrink-0 opacity-70" style={{ backgroundColor: color, border: `1.5px solid ${color}` }} />}
                {type === "dash" && <span className="w-5 h-0 border-t-2 border-dashed shrink-0" style={{ borderColor: color }} />}
                {type === "dot" && <span className="w-3.5 h-3.5 rounded-full shrink-0 mx-[3px]" style={{ backgroundColor: color }} />}
                {type === "star" && <span className="text-base leading-none shrink-0" style={{ color }}>★</span>}
                {type === "circle" && <span className="w-3 h-3 rounded-full border-2 shrink-0 mx-[1px]" style={{ borderColor: color }} />}
                {type === "arrow" && <span className="text-xs shrink-0 mx-[1px]" style={{ color }}>➤</span>}
                <span className="leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
