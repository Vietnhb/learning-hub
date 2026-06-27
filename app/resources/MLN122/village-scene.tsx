/**
 * Village Scene Components
 * Hero scenes showing the village, economic relationships, and story context
 */

import { AssetImage, LandlordEstate, MarketBuilding, TreeSprite } from "./pixel-components";
import { type Plot } from "./game-model";
import {
  FlyingBirds,
  Bush,
  Fence,
  GrassPatch,
  Debris,
  Craftable,
  LightRays,
  MovingClouds,
  Well,
  Critter,
} from "./depth-decorations";
import { Z_LAYERS } from "./rendering-utils";

/**
 * Hero village panorama for title and story screens
 */
export function VillageHero() {
  return (
    <div className="village-hero relative mx-auto w-full max-w-4xl overflow-hidden border-4 border-[#0b1209] bg-gradient-to-b from-[#9ed7ef] to-[#5c8d52] shadow-[6px_6px_0_#0b1209]">
      <div className="relative min-h-[320px]">
        {/* Sky Background */}
        <div className="absolute inset-0" style={{ zIndex: Z_LAYERS.BACKGROUND }}>
          <AssetImage
            fileName="LooseSprites__stardewPanorama.png"
            alt=""
            className="h-full w-full object-cover opacity-85"
          />
        </div>

        {/* Atmospheric gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#20361d]/40 to-transparent" style={{ zIndex: Z_LAYERS.TERRAIN_BACKGROUND }} />

        {/* Background Trees */}
        <div className="absolute bottom-[35%] left-[5%] opacity-35" style={{ zIndex: Z_LAYERS.TERRAIN_DECORATIONS }}>
          <TreeSprite variant="pine" scale={0.85} />
        </div>
        <div className="absolute bottom-[35%] right-[8%] opacity-35" style={{ zIndex: Z_LAYERS.TERRAIN_DECORATIONS }}>
          <TreeSprite variant="oak" scale={0.9} />
        </div>

        {/* Main Village Layout */}
        <div className="relative grid h-full min-h-[320px] grid-cols-3 items-end gap-6 p-6" style={{ zIndex: Z_LAYERS.BUILDINGS_BACK }}>
          {/* Left: Plot Preview */}
          <div className="justify-self-start">
            <PlotMiniPreview
              title="Fertile Land"
              soil="#7a4a2a"
              mapAsset="LooseSprites__Farm_ranching_map.png"
            />
          </div>

          {/* Center: Key Buildings */}
          <div className="grid justify-items-center gap-4">
            <LandlordEstate plotId="fertile" size="medium" />
            <div className="hidden text-center md:block">
              <AssetImage
                fileName="LooseSprites__farm_ranching_icon.png"
                alt=""
                className="mx-auto h-12 w-12 object-contain drop-shadow-[2px_2px_0_#0b1209]"
              />
              <p className="mt-1 text-xs font-black uppercase text-white drop-shadow-[1px_1px_0_#0b1209]">
                Village
              </p>
            </div>
          </div>

          {/* Right: Market */}
          <div className="justify-self-end">
            <MarketBuilding size="medium" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Mini plot preview for village scenes
 */
function PlotMiniPreview({
  title,
  soil,
  mapAsset,
}: {
  title: string;
  soil: string;
  mapAsset: string;
}) {
  return (
    <div className="grid gap-2 border-2 border-[#0b1209] bg-[#6aad62] p-2 shadow-[3px_3px_0_#0b1209]">
      <div className="relative h-20 w-24 overflow-hidden border-2 border-[#0b1209] bg-[#274a24]">
        <AssetImage fileName={mapAsset} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="grid grid-cols-3 gap-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-6 border border-black/20"
            style={{ backgroundColor: soil }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Three-plot village overview (minimap style)
 */
export function VillageMinimap({ currentPlot }: { currentPlot: Plot }) {
  const plots = [
    {
      id: "fertile",
      mapAsset: "LooseSprites__Farm_ranching_map.png",
      buildingAsset: "Buildings__Barn.png",
    },
    {
      id: "average",
      mapAsset: "LooseSprites__Farm_ranching_map_summer.png",
      buildingAsset: "Buildings__Big Barn.png",
    },
    {
      id: "poor",
      mapAsset: "LooseSprites__Farm_ranching_map_fall.png",
      buildingAsset: "Buildings__Coop.png",
    },
  ];

  return (
    <div className="village-minimap border-4 border-[#0b1209] bg-[#20361d] p-4 shadow-[6px_6px_0_#0b1209]">
      <p className="pixel-eyebrow mb-3">Village Map</p>
      
      <div className="grid grid-cols-3 gap-2">
        {plots.map((plot) => (
          <div
            key={plot.id}
            className={`relative h-20 border-2 p-1 transition-all ${
              plot.id === currentPlot.id
                ? "border-[#f5cf72] bg-[#f5cf72]/20"
                : "border-[#0b1209] bg-[#35582f]"
            }`}
          >
            <AssetImage
              fileName={plot.mapAsset}
              alt=""
              className="h-full w-full border border-black/20 object-cover"
            />
            {plot.id === currentPlot.id && (
              <div className="absolute inset-0 border-2 border-[#f5cf72] bg-[#f5cf72]/10 animate-pulse" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="scale-75 origin-top-left">
          <LandlordEstate plotId={currentPlot.id} size="small" />
        </div>
        <div className="scale-75 origin-top-right">
          <MarketBuilding size="small" />
        </div>
      </div>
    </div>
  );
}

/**
 * Economic relationship diagram for story screen
 */
export function EconomicRelationshipDiagram() {
  return (
    <div className="economic-diagram relative mx-auto max-w-2xl">
      <svg
        viewBox="0 0 600 200"
        className="h-auto w-full"
        style={{ imageRendering: "auto" }}
      >
        {/* Connecting Lines */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#f5cf72" />
          </marker>
        </defs>

        {/* Worker -> Production */}
        <path
          d="M 100 100 L 250 100"
          stroke="#7fc66a"
          strokeWidth="3"
          fill="none"
          markerEnd="url(#arrowhead)"
        />
        <text x="140" y="90" fill="#fff5cf" fontSize="12" fontWeight="bold">
          Living Labor
        </text>

        {/* Production -> Capitalist */}
        <path
          d="M 350 100 L 450 100"
          stroke="#f5cf72"
          strokeWidth="3"
          fill="none"
          markerEnd="url(#arrowhead)"
        />
        <text x="370" y="90" fill="#fff5cf" fontSize="12" fontWeight="bold">
          Surplus Value
        </text>

        {/* Capitalist -> Landlord */}
        <path
          d="M 500 100 Q 500 50, 300 50"
          stroke="#d94b35"
          strokeWidth="3"
          fill="none"
          markerEnd="url(#arrowhead)"
          strokeDasharray="5,5"
        />
        <text x="360" y="40" fill="#fff5cf" fontSize="12" fontWeight="bold">
          Ground Rent
        </text>

        {/* Nodes */}
        <circle cx="100" cy="100" r="8" fill="#7fc66a" />
        <circle cx="300" cy="100" r="8" fill="#f5cf72" />
        <circle cx="500" cy="100" r="8" fill="#d94b35" />
        <circle cx="300" cy="50" r="8" fill="#d94b35" />
      </svg>
    </div>
  );
}

/**
 * Path decoration for visual interest
 */
export function FarmPath() {
  return (
    <div className="farm-path relative h-12 w-full">
      <svg viewBox="0 0 800 48" className="h-full w-full" preserveAspectRatio="none">
        <path
          d="M 0 24 Q 200 12, 400 24 T 800 24"
          stroke="#6a4b34"
          strokeWidth="8"
          fill="none"
          opacity="0.3"
        />
        <path
          d="M 0 28 Q 200 16, 400 28 T 800 28"
          stroke="#5a3b24"
          strokeWidth="6"
          fill="none"
          opacity="0.4"
        />
      </svg>
    </div>
  );
}

/**
 * Season indicator banner
 */
export function SeasonBanner({ season = "Growing Season" }: { season?: string }) {
  return (
    <div className="season-banner relative mx-auto w-fit">
      <div className="border-4 border-[#0b1209] bg-gradient-to-r from-[#d94b35] to-[#ef634b] px-8 py-3 shadow-[5px_5px_0_#0b1209]">
        <p className="pixel-eyebrow text-white/80">Current Phase</p>
        <h3 className="mt-1 text-2xl font-black text-white drop-shadow-[2px_2px_0_rgba(11,18,9,0.5)]">
          {season}
        </h3>
      </div>
      {/* Decorative corners */}
      <div className="absolute -left-2 -top-2 h-4 w-4 border-l-4 border-t-4 border-[#f5cf72]" />
      <div className="absolute -right-2 -top-2 h-4 w-4 border-r-4 border-t-4 border-[#f5cf72]" />
      <div className="absolute -bottom-2 -left-2 h-4 w-4 border-b-4 border-l-4 border-[#f5cf72]" />
      <div className="absolute -bottom-2 -right-2 h-4 w-4 border-b-4 border-r-4 border-[#f5cf72]" />
    </div>
  );
}
