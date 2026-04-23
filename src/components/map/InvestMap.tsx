"use client";
import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { HOLAT_COLORS, type InvestObyekt } from "@/data/investObyektlar";

const SAMARQAND: [number, number] = [39.6542, 66.9597];

/* ── Light-theme CSS ─── */
const MAP_CSS = `
.leaflet-container { background:#f1f5f9 !important; font-family:system-ui,sans-serif; }
.leaflet-popup-content-wrapper {
  background:#ffffff !important;
  border:1px solid #e2e8f0 !important;
  border-radius:14px !important;
  box-shadow:0 8px 30px rgba(0,0,0,0.12) !important;
  color:#1e293b !important;
  padding:0 !important;
}
.leaflet-popup-content { margin:0 !important; padding:14px 16px !important; }
.leaflet-popup-tip-container { display:none !important; }
.leaflet-popup-close-button { color:#94a3b8 !important; top:8px !important; right:10px !important; font-size:18px !important; }
.leaflet-control-zoom a { background:#ffffff !important; color:#475569 !important; border-color:#e2e8f0 !important; }
.leaflet-control-zoom a:hover { background:#f8fafc !important; color:#0f172a !important; }
.leaflet-bar { border:1px solid #e2e8f0 !important; border-radius:10px !important; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08) !important; }
.leaflet-control-attribution { background:rgba(255,255,255,0.9) !important; color:#94a3b8 !important; font-size:10px !important; }
`;

/* ── Pin marker (same style as LeafletMap) ─── */
function makeInvestIcon(color: string, emoji: string, holatColor: string, selected: boolean) {
  const w = selected ? 48 : 42;
  const h = w + 14;
  const boxShadow = selected
    ? `0 0 0 3px ${color}, 0 0 22px ${color}70`
    : `0 2px 12px ${color}50, 0 0 0 2.5px ${color}22`;
  return L.divIcon({
    className: "",
    iconSize:  [w, h],
    iconAnchor:[w / 2, h],
    html: `
      <div style="position:relative;width:${w}px;height:${h}px;filter:drop-shadow(0 4px 12px ${color}55)">
        <div style="
          width:${w}px;height:${w}px;
          background:${color};
          border:2.5px solid #fff;
          border-radius:${selected ? 14 : 12}px;
          display:flex;align-items:center;justify-content:center;
          font-size:${selected ? 22 : 19}px;
          box-shadow:${boxShadow};
          transition:all 0.2s ease;
        ">${emoji}</div>
        <div style="
          position:absolute;bottom:0;left:50%;transform:translateX(-50%);
          width:0;height:0;
          border-left:7px solid transparent;border-right:7px solid transparent;
          border-top:14px solid ${color};
        "></div>
        <div style="
          position:absolute;top:-5px;right:-5px;
          width:13px;height:13px;border-radius:50%;
          background:${holatColor};border:2.5px solid #fff;
          box-shadow:0 0 6px ${holatColor}80;
        "></div>
      </div>`,
  });
}

/* ── Markers layer ── */
function MarkersLayer({
  objects,
  selected,
  onSelect,
}: {
  objects:  InvestObyekt[];
  selected: string | null;
  onSelect: (obj: InvestObyekt) => void;
}) {
  const map    = useMap();
  const layers = useRef<L.Marker[]>([]);

  useEffect(() => {
    layers.current.forEach(m => m.remove());
    layers.current = [];

    objects.forEach(obj => {
      const isSelected = obj.id === selected;
      const holatColor = HOLAT_COLORS[obj.holat];
      const icon = makeInvestIcon(obj.color, obj.icon, holatColor, isSelected);
      const marker = L.marker([obj.lat, obj.lng], { icon });

      /* Popup */
      marker.bindPopup(`
        <div style="font-family:system-ui,sans-serif;min-width:200px">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
            <span style="font-size:22px">${obj.icon}</span>
            <div>
              <p style="font-size:13px;font-weight:700;color:#0f172a;margin:0">${obj.nomi}</p>
              <p style="font-size:10px;color:#94a3b8;margin:2px 0 0;font-family:monospace">${obj.id}</p>
            </div>
          </div>
          <div style="font-size:12px;color:#475569;margin-bottom:8px">📍 ${obj.tuman}</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            <span style="display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;background:${holatColor}18;border:1.5px solid ${holatColor}40;font-size:11px;font-weight:600;color:${holatColor}">
              <span style="width:6px;height:6px;border-radius:50%;background:${holatColor};display:inline-block"></span>
              ${obj.holat === "ishlamoqda" ? "Ishlamoqda" : obj.holat === "qurilmoqda" ? "Qurilmoqda" : obj.holat === "rejalashtirilgan" ? "Rejalashtirilgan" : "To'xtatilgan"}
            </span>
            <span style="display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;background:#eff6ff;border:1.5px solid #bfdbfe;font-size:11px;font-weight:600;color:#2563eb">
              💰 ${obj.qiymat}
            </span>
          </div>
        </div>
      `, { closeButton: true, maxWidth: 260 });

      marker.on("click", () => {
        map.flyTo([obj.lat, obj.lng], 13, { duration: 0.7 });
        onSelect(obj);
      });

      marker.addTo(map);
      layers.current.push(marker);
    });

    return () => { layers.current.forEach(m => m.remove()); };
  }, [objects, selected, map, onSelect]);

  return null;
}

/* ── Samarqand city boundary ── */
function SamarqandBorder() {
  const layerRef   = useRef<L.GeoJSON | null>(null);
  const leafletMap = useMap();

  useEffect(() => {
    fetch("/samarqandsh.json")
      .then(r => r.json())
      .then(data => {
        layerRef.current = L.geoJSON(data, {
          style: { color:"#16a34a", weight:2.5, opacity:0.8, fillColor:"#22c55e", fillOpacity:0.06 },
        }).addTo(leafletMap);

        const center = layerRef.current.getBounds().getCenter();
        L.marker(center, {
          icon: L.divIcon({
            html: `<span style="font-size:11px;font-weight:800;color:#15803d;background:rgba(255,255,255,0.9);padding:2px 7px;border-radius:6px;border:1px solid #bbf7d0;white-space:nowrap;box-shadow:0 1px 4px rgba(0,0,0,0.1)">Samarqand shahri</span>`,
            className: "", iconAnchor: [55, 10],
          }),
          interactive: false, zIndexOffset: -200,
        }).addTo(leafletMap);
      })
      .catch(() => {});
    return () => { layerRef.current?.remove(); };
  }, [leafletMap]);

  return null;
}


/* ── CSS injector ── */
function CSSInjector() {
  const map = useMap();
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = MAP_CSS;
    document.head.appendChild(style);
    return () => style.remove();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

/* ── Main component ── */
export default function InvestMap({
  objects,
  selected,
  onSelect,
}: {
  objects:  InvestObyekt[];
  selected: string | null;
  onSelect: (obj: InvestObyekt) => void;
}) {
  return (
    <MapContainer
      center={SAMARQAND}
      zoom={10}
      style={{ width: "100%", height: "100%" }}
      zoomControl={true}
      attributionControl={false}
    >
      <CSSInjector />
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={19}
      />
      <SamarqandBorder />
      <MarkersLayer objects={objects} selected={selected} onSelect={onSelect} />
    </MapContainer>
  );
}
