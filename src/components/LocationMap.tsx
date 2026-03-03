import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  is_flagship: boolean | null;
}

interface LocationMapProps {
  locations: MapLocation[];
  className?: string;
}

export function LocationMap({ locations, className = "" }: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([8.98, 38.75], 6);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) map.removeLayer(layer);
    });

    const bounds: L.LatLngExpression[] = [];

    locations.forEach((loc) => {
      if (loc.latitude && loc.longitude) {
        const icon = L.divIcon({
          className: "custom-marker",
          html: `<div style="
            width: 32px; height: 32px; border-radius: 50%; 
            background: ${loc.is_flagship ? "hsl(36, 60%, 50%)" : "hsl(25, 40%, 35%)"};
            border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex; align-items: center; justify-content: center;
            color: white; font-size: 14px;
          ">☕</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        L.marker([loc.latitude, loc.longitude], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family: sans-serif; min-width: 150px;">
              <strong>${loc.name}</strong>
              ${loc.is_flagship ? '<span style="color: hsl(36,60%,50%); font-size: 11px;"> ★ Flagship</span>' : ""}
              <br/><span style="color: #666; font-size: 12px;">${loc.address}, ${loc.city}</span>
            </div>
          `);

        bounds.push([loc.latitude, loc.longitude]);
      }
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds as L.LatLngBoundsExpression, { padding: [50, 50], maxZoom: 12 });
    }
  }, [locations]);

  return (
    <div
      ref={mapRef}
      className={`rounded-2xl overflow-hidden border border-border ${className}`}
      style={{ height: "400px", width: "100%" }}
    />
  );
}
