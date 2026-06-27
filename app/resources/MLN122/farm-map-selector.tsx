/**
 * Farm Map Selector
 * UI for switching between 7 farm types
 */

import { useState } from "react";
import { FARM_MAPS, type FarmType } from "./farm-maps-config";

interface FarmMapSelectorProps {
  currentMap: FarmType;
  onMapChange: (mapType: FarmType) => void;
  className?: string;
}

export function FarmMapSelector({
  currentMap,
  onMapChange,
  className = "",
}: FarmMapSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentConfig = FARM_MAPS[currentMap];

  return (
    <div className={`relative ${className}`}>
      {/* Current map display button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-3 rounded-none border-2 border-[#0b1209] bg-[#f5cf72] px-4 py-2 shadow-[2px_2px_0_#0b1209] transition-all hover:shadow-[4px_4px_0_#0b1209] hover:translate-x-[-2px] hover:translate-y-[-2px]"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🗺️</span>
          <div className="text-left">
            <div className="font-mono text-sm font-black text-[#2d2114]">
              {currentConfig.nameVi}
            </div>
            <div className="text-xs text-[#2d2114]/60">
              {currentConfig.farmingZones.length} khu vực canh tác
            </div>
          </div>
        </div>
        <span
          className={`text-xl transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute top-full left-0 z-50 mt-2 w-full rounded-none border-2 border-[#0b1209] bg-[#10190d] shadow-[4px_4px_0_#0b1209] max-h-[500px] overflow-y-auto">
            {(Object.keys(FARM_MAPS) as FarmType[]).map((mapType) => {
              const config = FARM_MAPS[mapType];
              const isSelected = mapType === currentMap;

              return (
                <button
                  key={mapType}
                  onClick={() => {
                    onMapChange(mapType);
                    setIsOpen(false);
                  }}
                  className={`w-full border-b border-[#0b1209]/20 px-4 py-3 text-left transition-colors hover:bg-[#4f8547] ${
                    isSelected ? "bg-[#4f8547]" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Map icon */}
                    <div className="flex-shrink-0 text-2xl">
                      {mapType === "standard" && "🌾"}
                      {mapType === "hilltop" && "⛰️"}
                      {mapType === "riverland" && "🎣"}
                      {mapType === "forest" && "🌲"}
                      {mapType === "wilderness" && "⚔️"}
                      {mapType === "four-corners" && "✨"}
                      {mapType === "beach" && "🐄"}
                    </div>

                    {/* Map info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-black text-[#fff5cf]">
                          {config.nameVi}
                        </span>
                        {config.recommended && (
                          <span className="rounded-none border border-[#f5cf72] bg-[#f5cf72]/20 px-1.5 py-0.5 text-xs font-bold text-[#f5cf72]">
                            Đề xuất
                          </span>
                        )}
                        {isSelected && (
                          <span className="text-sm">✓</span>
                        )}
                      </div>
                      <div className="mt-1 text-xs text-[#fff5cf]/60">
                        {config.descriptionVi}
                      </div>
                      <div className="mt-1.5 flex items-center gap-3 text-xs text-[#fff5cf]/40">
                        <span>📏 {config.width}×{config.height}</span>
                        <span>🌱 {config.farmingZones.length} vùng</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Compact inline selector for toolbar
 */
export function CompactMapSelector({
  currentMap,
  onMapChange,
  className = "",
}: FarmMapSelectorProps) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span className="text-xs font-bold text-[#fff5cf]/60">Map:</span>
      <select
        value={currentMap}
        onChange={(e) => onMapChange(e.target.value as FarmType)}
        className="rounded-none border border-[#0b1209] bg-[#10190d] px-2 py-1 text-xs font-bold text-[#fff5cf] shadow-inner"
      >
        {(Object.keys(FARM_MAPS) as FarmType[]).map((mapType) => {
          const config = FARM_MAPS[mapType];
          return (
            <option key={mapType} value={mapType}>
              {config.nameVi}
              {config.recommended ? " ⭐" : ""}
            </option>
          );
        })}
      </select>
    </div>
  );
}

/**
 * Map info card for current selected map
 */
export function MapInfoCard({
  mapType,
  className = "",
}: {
  mapType: FarmType;
  className?: string;
}) {
  const config = FARM_MAPS[mapType];

  return (
    <div
      className={`rounded-none border-2 border-[#0b1209] bg-[#10190d] p-4 ${className}`}
    >
      <div className="mb-3 flex items-center gap-3">
        <span className="text-3xl">
          {mapType === "standard" && "🌾"}
          {mapType === "hilltop" && "⛰️"}
          {mapType === "riverland" && "🎣"}
          {mapType === "forest" && "🌲"}
          {mapType === "wilderness" && "⚔️"}
          {mapType === "four-corners" && "✨"}
          {mapType === "beach" && "🐄"}
        </span>
        <div>
          <h3 className="font-mono text-lg font-black text-[#fff5cf]">
            {config.nameVi}
          </h3>
          <p className="text-sm text-[#fff5cf]/60">{config.descriptionVi}</p>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-[#fff5cf]/60">Kích thước:</span>
          <span className="font-mono font-bold text-[#fff5cf]">
            {config.width} × {config.height} tiles
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#fff5cf]/60">Vùng canh tác:</span>
          <span className="font-mono font-bold text-[#fff5cf]">
            {config.farmingZones.length} khu vực
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#fff5cf]/60">Tổng diện tích:</span>
          <span className="font-mono font-bold text-[#fff5cf]">
            {config.farmingZones.reduce(
              (sum, zone) => sum + zone.cols * zone.rows,
              0
            )}{" "}
            tiles
          </span>
        </div>
      </div>

      {/* Farming zones preview */}
      <div className="mt-4 border-t border-[#fff5cf]/10 pt-3">
        <div className="mb-2 text-xs font-bold text-[#fff5cf]/60">
          CÁC KHU VỰC:
        </div>
        <div className="space-y-1.5">
          {config.farmingZones.map((zone, index) => (
            <div
              key={zone.id}
              className="flex items-center justify-between text-xs"
            >
              <span className="text-[#fff5cf]/80">
                {index + 1}. Vùng {zone.id}
              </span>
              <span className="font-mono text-[#fff5cf]/60">
                {zone.cols}×{zone.rows}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
