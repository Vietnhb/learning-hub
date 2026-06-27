/**
 * Map Selector Component
 * Allow switching between different Stardew Valley farm maps
 */

import { useState } from "react";
import { Check, Home, Mountain, Fish, Pickaxe, Trees, Swords, Grid3X3 } from "lucide-react";
import { Button } from "@/components/ui/button";

export type MapType = 
  | "farm-standard" 
  | "farm-ranching" 
  | "farm-fishing"
  | "farm-mining"
  | "farm-foraging"
  | "farm-combat"
  | "farm-four-corners";

interface MapOption {
  id: MapType;
  name: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  cropArea: "large" | "medium" | "small";
  recommended: boolean;
  color: string;
  // Screenshot preview (to be added)
  previewImage?: string;
}

const MAP_OPTIONS: MapOption[] = [
  {
    id: "farm-standard",
    name: "Standard Farm",
    description: "Balanced farm với crop area lớn, farmhouse, barn, và shipping bin",
    icon: <Home className="h-5 w-5" />,
    features: ["🟩 Large crop area", "🏠 Farmhouse", "🚪 Shipping bin", "🐄 Barn", "🐔 Coop"],
    cropArea: "large",
    recommended: true,
    color: "#7fc66a",
    previewImage: "/resources/MLN122/map-previews/farm-standard.png",
  },
  {
    id: "farm-ranching",
    name: "Hilltop Farm",
    description: "Tập trung chăn nuôi, có mining area và cliffs",
    icon: <Mountain className="h-5 w-5" />,
    features: ["🐄 Large barn area", "⛏️ Mining spots", "🏔️ Cliffs", "🟩 Medium crop area"],
    cropArea: "medium",
    recommended: false,
    color: "#9ed7ef",
    previewImage: "/resources/MLN122/map-previews/farm-ranching.png",
  },
  {
    id: "farm-fishing",
    name: "Riverland Farm",
    description: "Map với nhiều sông, tốt cho fishing nhưng crop area nhỏ",
    icon: <Fish className="h-5 w-5" />,
    features: ["🌊 Rivers", "🐟 Fishing spots", "🦀 Crab pots", "🏝️ Islands"],
    cropArea: "small",
    recommended: false,
    color: "#5eb3d6",
    previewImage: "/resources/MLN122/map-previews/farm-fishing.png",
  },
  {
    id: "farm-mining",
    name: "Hill-top Farm",
    description: "Có quarry và mining deposits, crop area medium",
    icon: <Pickaxe className="h-5 w-5" />,
    features: ["⛰️ Quarry", "💎 Ore deposits", "🪨 Rocks", "🟩 Medium crops"],
    cropArea: "medium",
    recommended: false,
    color: "#a89279",
    previewImage: "/resources/MLN122/map-previews/farm-mining.png",
  },
  {
    id: "farm-foraging",
    name: "Forest Farm",
    description: "Thick forest với forageable items, crop area nhỏ",
    icon: <Trees className="h-5 w-5" />,
    features: ["🌲 Dense forest", "🍄 Forageable", "🌰 Berries", "🌳 Hardwood"],
    cropArea: "small",
    recommended: false,
    color: "#5ca545",
    previewImage: "/resources/MLN122/map-previews/farm-foraging.png",
  },
  {
    id: "farm-combat",
    name: "Wilderness Farm",
    description: "Monsters spawn at night, combat theme",
    icon: <Swords className="h-5 w-5" />,
    features: ["👾 Monsters", "⚔️ Combat", "💎 Treasures", "🟩 Medium crops"],
    cropArea: "medium",
    recommended: false,
    color: "#d94b35",
    previewImage: "/resources/MLN122/map-previews/farm-combat.png",
  },
  {
    id: "farm-four-corners",
    name: "Four Corners Farm",
    description: "4 quadrants với specialties khác nhau, multiplayer friendly",
    icon: <Grid3X3 className="h-5 w-5" />,
    features: ["🎯 4 quadrants", "👥 Multiplayer", "🌲🏔️🌊🟩 Mixed", "⚖️ Balanced"],
    cropArea: "medium",
    recommended: false,
    color: "#f5cf72",
    previewImage: "/resources/MLN122/map-previews/farm-four-corners.png",
  },
];

interface MapSelectorProps {
  currentMap: MapType;
  onMapChange: (mapId: MapType) => void;
  className?: string;
}

export function MapSelector({ currentMap, onMapChange, className = "" }: MapSelectorProps) {
  const [hoveredMap, setHoveredMap] = useState<MapType | null>(null);

  return (
    <div className={`map-selector ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-black text-white">Chọn Farm Map</h3>
        <p className="text-sm text-[#fff5cf]/70">
          Thử các map khác nhau từ Stardew Valley
        </p>
      </div>

      <div className="grid gap-3">
        {MAP_OPTIONS.map((map) => (
          <MapCard
            key={map.id}
            map={map}
            isSelected={currentMap === map.id}
            isHovered={hoveredMap === map.id}
            onSelect={() => onMapChange(map.id)}
            onHover={() => setHoveredMap(map.id)}
            onLeave={() => setHoveredMap(null)}
          />
        ))}
      </div>
    </div>
  );
}

function MapCard({
  map,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  onLeave,
}: {
  map: MapOption;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`map-card group relative grid gap-3 border-4 p-3 text-left transition-all ${
        isSelected
          ? "border-[#f5cf72] bg-[#2d4c28]"
          : "border-[#0b1209] bg-[#10190d] hover:border-[#fff5cf]/30 hover:bg-[#20361d]"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full border-2"
            style={{
              borderColor: map.color,
              backgroundColor: `${map.color}20`,
            }}
          >
            <span style={{ color: map.color }}>{map.icon}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-base font-black text-white">{map.name}</h4>
              {map.recommended && (
                <span className="rounded-none border border-[#f5cf72] bg-[#f5cf72]/20 px-2 py-0.5 text-[10px] font-black uppercase text-[#f5cf72]">
                  ⭐ Best
                </span>
              )}
            </div>
            <p className="text-xs font-bold" style={{ color: map.color }}>
              Crop Area: {map.cropArea}
            </p>
          </div>
        </div>

        {isSelected && (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f5cf72]">
            <Check className="h-4 w-4 text-[#2d2114]" />
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-sm leading-relaxed text-[#fff5cf]/80">{map.description}</p>

      {/* Features */}
      <div className="flex flex-wrap gap-2">
        {map.features.map((feature, i) => (
          <span
            key={i}
            className="rounded-none border border-[#0b1209] bg-[#20361d] px-2 py-1 text-xs font-bold text-[#fff5cf]/90"
          >
            {feature}
          </span>
        ))}
      </div>

      {/* Preview hint on hover */}
      {isHovered && !isSelected && (
        <div className="absolute inset-0 flex items-center justify-center border-4 border-[#f5cf72] bg-[#0b1209]/90">
          <span className="text-sm font-black text-[#f5cf72]">
            Click để xem map này
          </span>
        </div>
      )}
    </button>
  );
}

/**
 * Compact map selector for sidebar
 */
export function CompactMapSelector({
  currentMap,
  onMapChange,
}: {
  currentMap: MapType;
  onMapChange: (mapId: MapType) => void;
}) {
  const currentMapData = MAP_OPTIONS.find((m) => m.id === currentMap);

  return (
    <div className="compact-map-selector pixel-card border-[#0b1209] bg-[#10190d] p-3">
      <p className="pixel-eyebrow mb-2">Current Map</p>
      
      {currentMapData && (
        <div className="mb-3 flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full border-2"
            style={{
              borderColor: currentMapData.color,
              backgroundColor: `${currentMapData.color}20`,
            }}
          >
            <span style={{ color: currentMapData.color }}>{currentMapData.icon}</span>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-black text-white">{currentMapData.name}</h4>
            <p className="text-xs text-[#fff5cf]/60">
              {currentMapData.cropArea} crops
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-1">
        {MAP_OPTIONS.map((map) => (
          <button
            key={map.id}
            type="button"
            onClick={() => onMapChange(map.id)}
            title={map.name}
            className={`flex h-10 w-10 items-center justify-center border-2 transition-all ${
              currentMap === map.id
                ? "border-[#f5cf72] bg-[#f5cf72]/20"
                : "border-[#0b1209] bg-[#20361d] hover:border-[#fff5cf]/30"
            }`}
            style={{
              color: currentMap === map.id ? map.color : "#fff5cf80",
            }}
          >
            {map.icon}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Map preview modal (for future implementation)
 */
export function MapPreviewModal({
  map,
  onClose,
  onSelect,
}: {
  map: MapOption;
  onClose: () => void;
  onSelect: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1209]/90 p-4">
      <div className="pixel-card max-w-4xl border-4 border-[#f5cf72] bg-[#10190d] p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">{map.name}</h2>
            <p className="text-sm text-[#fff5cf]/70">{map.description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="pixel-button bg-[#d94b35] px-4 py-2 text-white"
          >
            ✕
          </button>
        </div>

        {/* Map preview image placeholder */}
        <div className="mb-4 h-96 border-4 border-[#0b1209] bg-[#20361d] flex items-center justify-center">
          {map.previewImage ? (
            <img
              src={map.previewImage}
              alt={map.name}
              className="h-full w-full object-contain pixelated"
            />
          ) : (
            <p className="text-[#fff5cf]/50">
              Preview coming soon...
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="pixel-button border-2 border-[#0b1209] bg-[#20361d] text-white"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => {
              onSelect();
              onClose();
            }}
            className="pixel-button border-2 border-[#f5cf72] bg-[#f5cf72] text-[#2d2114]"
          >
            Use This Map
          </Button>
        </div>
      </div>
    </div>
  );
}
