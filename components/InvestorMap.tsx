"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";

export type MapSite = {
  id: string;
  name: string;
  place: string;
  address: string;
  lat: number;
  lng: number;
  status: string;
  progress: number;
};

// Real-geography map of the portfolio: Leaflet + OpenStreetMap tiles, custom
// brand pins. Leaflet touches `window` at import time, so it is loaded
// dynamically inside the effect — this component never runs it during SSR.
export function InvestorMap({
  sites,
  selectedId,
  onSelect,
}: {
  sites: MapSite[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    const markers = markersRef.current;
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        scrollWheelZoom: false,
        attributionControl: true,
      });
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const bounds = L.latLngBounds(sites.map((s) => [s.lat, s.lng]));
      map.fitBounds(bounds.pad(0.25));

      for (const site of sites) {
        const marker = L.marker([site.lat, site.lng], {
          icon: L.divIcon({
            className: "",
            html: `<div class="satis-pin" data-site="${site.id}"><span></span></div>`,
            iconSize: [22, 22],
            iconAnchor: [11, 11],
          }),
          alt: site.name,
        })
          .addTo(map)
          .bindTooltip(
            `<strong>${site.name}</strong><br/>${site.address}`,
            { direction: "top", offset: [0, -10] }
          )
          .on("click", () => onSelectRef.current(site.id));
        markersRef.current.set(site.id, marker);
      }
      mapRef.current = map;
      highlight(selectedId);
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markers.clear();
    };
    // The site list is stable for the life of the page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function highlight(id: string) {
    markersRef.current.forEach((marker, siteId) => {
      const el = marker.getElement()?.querySelector(".satis-pin");
      el?.classList.toggle("satis-pin-active", siteId === id);
    });
  }

  useEffect(() => {
    highlight(selectedId);
    const marker = markersRef.current.get(selectedId);
    const map = mapRef.current;
    if (marker && map) map.panTo(marker.getLatLng(), { animate: true });
  }, [selectedId]);

  return (
    <div className="relative h-full min-h-[520px]">
      <div ref={containerRef} className="absolute inset-0" aria-label="Map of Satis Group developments" role="application" />
      <style>{`
        .satis-pin{width:22px;height:22px;border-radius:9999px;background:#b18c4d;border:3px solid #ffffff;box-shadow:0 1px 6px rgba(0,0,0,.4);cursor:pointer;transition:transform .15s ease,background .15s ease;}
        .satis-pin:hover{transform:scale(1.2);}
        .satis-pin-active{background:#121212;transform:scale(1.35);}
        .leaflet-container{font:inherit;background:#e8e5dd;}
        .leaflet-tooltip{font-size:12px;line-height:1.4;}
      `}</style>
    </div>
  );
}
