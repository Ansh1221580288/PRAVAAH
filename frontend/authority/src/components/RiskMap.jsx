import { MapContainer, TileLayer, Circle, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function RiskMap({ mode }) {
  const mapCenter = [28.6139, 77.209];

  const mapData = {
    normal: {
      zoom: 12,
      floodRadius: 700,
      floodOpacity: 0.15,
      color: "#22c55e",
      label: "LOW FLOOD RISK",
    },
    heavy: {
      zoom: 12,
      floodRadius: 1800,
      floodOpacity: 0.3,
      color: "#f59e0b",
      label: "HIGH FLOOD RISK",
    },
    critical: {
      zoom: 11,
      floodRadius: 3500,
      floodOpacity: 0.45,
      color: "#ef4444",
      label: "CRITICAL FLOOD",
    },
  };

  const current = mapData[mode];

  const criticalSectors = [
    [28.625, 77.215],
    [28.605, 77.225],
    [28.618, 77.195],
    [28.595, 77.205],
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Live Risk Map
          </h2>

          <p className="text-xs text-slate-400">
            Flood extent and priority sectors
          </p>
        </div>

        <span
          className="rounded-full px-3 py-1 text-xs font-semibold"
          style={{
            backgroundColor: `${current.color}22`,
            color: current.color,
          }}
        >
          {current.label}
        </span>
      </div>

      <div className="h-[480px]">
        <MapContainer
          center={mapCenter}
          zoom={current.zoom}
          className="h-full w-full"
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Flood extent */}
          <Circle
            center={mapCenter}
            radius={current.floodRadius}
            pathOptions={{
              color: current.color,
              fillColor: current.color,
              fillOpacity: current.floodOpacity,
            }}
          />

          {/* Critical / priority sectors */}
          {criticalSectors.map((position, index) => (
            <Circle
              key={index}
              center={position}
              radius={350}
              pathOptions={{
                color: "#ef4444",
                fillColor: "#ef4444",
                fillOpacity: 0.7,
              }}
            />
          ))}

          {/* Flood extent polygon */}
          <Polygon
            positions={[
              [28.64, 77.18],
              [28.65, 77.24],
              [28.60, 77.26],
              [28.58, 77.20],
              [28.60, 77.17],
            ]}
            pathOptions={{
              color: current.color,
              fillColor: current.color,
              fillOpacity: mode === "normal" ? 0.05 : 0.18,
            }}
          />
        </MapContainer>
      </div>

      <div className="flex flex-wrap gap-5 border-t border-slate-800 px-5 py-3 text-xs text-slate-400">
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          Priority Sector
        </span>

        <span className="flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: current.color }}
          />
          Flood Extent
        </span>
      </div>
    </div>
  );
}