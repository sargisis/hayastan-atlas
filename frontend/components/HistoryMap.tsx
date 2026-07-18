"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import type { Era, Event, TimelineResponse } from "@/lib/types";

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

      setStyleReady(true);
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      setStyleReady(false);
    };
  }, []);

  // Update era info, events list, and territory phase when year changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !styleReady) return;

    const controller = new AbortController();

    async function load() {
      try {
        // Era + events (for the panels)
        const res = await fetch(`/api/timeline?year=${year}`, { signal: controller.signal });
        if (res.ok) {
          const data: TimelineResponse = await res.json();
          onEraLoad(data.era);
          onEventsLoad(data.events);
        }

        // Cities existing at this year
        const cityRes = await fetch(`/api/cities?year=${year}`, { signal: controller.signal });
        if (cityRes.ok) {
          const cities: { name: string; lat: number; lng: number; is_capital: boolean }[] =
            (await cityRes.json()) ?? [];
          const citySource = map!.getSource("cities") as maplibregl.GeoJSONSource | undefined;
          citySource?.setData({
            type: "FeatureCollection",
            features: cities.map((c) => ({
              type: "Feature" as const,
              properties: { name: c.name, capital: c.is_capital },
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
        source.setData(terr.fc);
        onPhaseLoad?.(terr.label);

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
  }, [year, styleReady, onEraLoad, onEventsLoad, onPhaseLoad]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }} />;
}
