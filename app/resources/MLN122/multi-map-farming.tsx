/**
 * Multi-Map Automated Farming with Real TMX Rendering
 *
 * ✅ Renders ACTUAL Stardew Valley farm maps from .tmx files
 * ✅ Parses XML tile data and renders using real tilesheet PNGs
 * ✅ Each of the 7 farm types has unique terrain (rivers, cliffs, forests, etc.)
 * ✅ Workers can farm on any of the 7 farm types
 * ✅ Automatically switches between tilling, planting, growing, harvesting cycles
 *
 * The TMX files (Farm.tmx, Farm_Fishing.tmx, etc.) define the actual map layout.
 * Tilesheets (spring_outdoorsTileSheet.png, paths.png, etc.) provide the visual tiles.
 */

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { type InvestmentState, type Plot } from "./game-model";
import { Z_LAYERS, calculateYSortedZIndex } from "./rendering-utils";
import {
  FARM_MAPS,
  type FarmType,
  getAllFarmableTiles,
  getFarmingZone,
} from "./farm-maps-config";
import { FarmMapSelector, MapInfoCard } from "./farm-map-selector";
import { FarmMapView, FARM_VIEWPORTS } from "./tmx-map-renderer";

const SCENE_ASSET_BASE = "/resources/MLN122/scene-assets";
const TILE_SIZE = 16;
const ANIMATION_SPEED = 400; // ms per action
const WORKER_MOVE_SPEED = 100; // ms per tile
const GROWTH_SPEED = 800; // ms per growth stage

type TileState =
  | "grass"
  | "tilled"
  | "watered"
  | "seeded"
  | "growing"
  | "harvestable";

interface Tile {
  x: number;
  y: number;
  state: TileState;
  growthStage: number; // 0-3
  hasWorker: boolean;
}

interface Worker {
  id: number;
  x: number; // pixel position
  y: number;
  targetTileX: number; // grid position
  targetTileY: number;
  action:
    | "idle"
    | "walking"
    | "hoeing"
    | "watering"
    | "planting"
    | "harvesting";
  sprite: string;
  facing: "down" | "right" | "up" | "left";
  animationFrame: number;
  actionProgress: number; // 0-1, tracks animation progress for current action
}

const WORKER_SPRITES = [
  "characters/worker-v3-0.png",
  "characters/worker-v3-1.png",
  "characters/worker-v3-2.png",
  "characters/worker-v3-3.png",
  "characters/worker-v3-4.png",
  "characters/worker-v3-5.png",
  "characters/worker-v3-6.png",
  "characters/worker-v3-7.png",
];

function sceneAsset(path: string) {
  return `${SCENE_ASSET_BASE}/${path.split("/").map(encodeURIComponent).join("/")}`;
}

export function MultiMapFarmingScene({
  plot,
  investment,
}: {
  plot: Plot;
  investment: InvestmentState;
}) {
  const [farmType, setFarmType] = useState<FarmType>("standard");
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [cyclePhase, setCyclePhase] = useState<
    "setup" | "tilling" | "watering" | "planting" | "growing" | "harvesting"
  >("setup");
  const [dayCounter, setDayCounter] = useState(0);
  const [showMapInfo, setShowMapInfo] = useState(false);

  const farmConfig = FARM_MAPS[farmType];
  const mainZone = getFarmingZone(farmType);

  // Initialize farm tiles when map changes
  useEffect(() => {
    const farmableTiles = getAllFarmableTiles(farmType);
    
    // Use only first zone for demo (to keep it manageable)
    const zone = mainZone;
    const initialTiles: Tile[] = [];
    
    // Create a smaller subset for demo
    const maxTiles = 80; // Limit tiles for performance
    const step = Math.max(1, Math.floor((zone.cols * zone.rows) / maxTiles));
    
    let tileCount = 0;
    for (let row = 0; row < zone.rows && tileCount < maxTiles; row += step) {
      for (let col = 0; col < zone.cols && tileCount < maxTiles; col += step) {
        initialTiles.push({
          x: zone.x + col,
          y: zone.y + row,
          state: "grass",
          growthStage: 0,
          hasWorker: false,
        });
        tileCount++;
      }
    }

    setTiles(initialTiles);
    setCyclePhase("setup");
    setDayCounter(0);
  }, [farmType]);

  // Initialize workers
  useEffect(() => {
    const initialWorkers: Worker[] = [];
    const workerCount = Math.min(investment.workers, 6);
    const zone = mainZone;

    for (let i = 0; i < workerCount; i++) {
      const startX = zone.x + (i % 5) * 3;
      const startY = zone.y + Math.floor(i / 5) * 3;

      initialWorkers.push({
        id: i,
        x: startX * TILE_SIZE,
        y: startY * TILE_SIZE,
        targetTileX: startX,
        targetTileY: startY,
        action: "idle",
        sprite: WORKER_SPRITES[i % WORKER_SPRITES.length],
        facing: "down",
        animationFrame: 0,
        actionProgress: 0,
      });
    }
    setWorkers(initialWorkers);
  }, [investment.workers, farmType]);

  // Main automation loop
  useEffect(() => {
    if (tiles.length === 0 || workers.length === 0) return;

    const interval = setInterval(() => {
      setTiles((prevTiles) => {
        const updatedTiles = [...prevTiles];

        switch (cyclePhase) {
          case "setup":
            setCyclePhase("tilling");
            break;

          case "tilling": {
            const untilledTiles = updatedTiles.filter((t) => t.state === "grass" && !t.hasWorker);
            if (untilledTiles.length === 0) {
              setCyclePhase("watering");
            } else {
              // Each worker picks a random untilled tile
              const availableWorkers = workers.filter((w) => w.action === "idle" || w.action === "walking");
              availableWorkers.slice(0, Math.min(3, untilledTiles.length)).forEach((worker) => {
                const randomTile = untilledTiles[Math.floor(Math.random() * untilledTiles.length)];
                if (randomTile) {
                  const tileIndex = updatedTiles.findIndex(
                    (t) => t.x === randomTile.x && t.y === randomTile.y
                  );
                  if (tileIndex !== -1) {
                    updatedTiles[tileIndex].state = "tilled";
                    updatedTiles[tileIndex].hasWorker = true;

                    setWorkers((prevWorkers) => {
                      const newWorkers = [...prevWorkers];
                      const workerIdx = newWorkers.findIndex((w) => w.id === worker.id);
                      if (workerIdx !== -1) {
                        newWorkers[workerIdx].action = "hoeing";
                        newWorkers[workerIdx].targetTileX = randomTile.x;
                        newWorkers[workerIdx].targetTileY = randomTile.y;
                        newWorkers[workerIdx].actionProgress = 0;
                      }
                      return newWorkers;
                    });

                    // Clear worker marker after animation completes
                    setTimeout(() => {
                      setTiles((t) => {
                        const copy = [...t];
                        const idx = copy.findIndex(
                          (tile) => tile.x === randomTile.x && tile.y === randomTile.y
                        );
                        if (idx !== -1) copy[idx].hasWorker = false;
                        return copy;
                      });
                      
                      setWorkers((prevWorkers) => {
                        const newWorkers = [...prevWorkers];
                        const workerIdx = newWorkers.findIndex((w) => w.id === worker.id);
                        if (workerIdx !== -1) {
                          newWorkers[workerIdx].action = "idle";
                        }
                        return newWorkers;
                      });
                    }, ANIMATION_SPEED * 2); // Give time for animation to complete

                    // Remove from available
                    const idx = untilledTiles.indexOf(randomTile);
                    if (idx > -1) untilledTiles.splice(idx, 1);
                  }
                }
              });
            }
            break;
          }

          case "watering": {
            const tilledTiles = updatedTiles.filter((t) => t.state === "tilled" && !t.hasWorker);
            if (tilledTiles.length === 0) {
              setCyclePhase("planting");
            } else {
              const availableWorkers = workers.filter((w) => w.action === "idle" || w.action === "walking");
              availableWorkers.slice(0, Math.min(3, tilledTiles.length)).forEach((worker) => {
                const randomTile = tilledTiles[Math.floor(Math.random() * tilledTiles.length)];
                if (randomTile) {
                  const tileIndex = updatedTiles.findIndex(
                    (t) => t.x === randomTile.x && t.y === randomTile.y
                  );
                  if (tileIndex !== -1) {
                    updatedTiles[tileIndex].state = "watered";
                    updatedTiles[tileIndex].hasWorker = true;

                    setWorkers((prevWorkers) => {
                      const newWorkers = [...prevWorkers];
                      const workerIdx = newWorkers.findIndex((w) => w.id === worker.id);
                      if (workerIdx !== -1) {
                        newWorkers[workerIdx].action = "watering";
                        newWorkers[workerIdx].targetTileX = randomTile.x;
                        newWorkers[workerIdx].targetTileY = randomTile.y;
                        newWorkers[workerIdx].actionProgress = 0;
                      }
                      return newWorkers;
                    });

                    setTimeout(() => {
                      setTiles((t) => {
                        const copy = [...t];
                        const idx = copy.findIndex(
                          (tile) => tile.x === randomTile.x && tile.y === randomTile.y
                        );
                        if (idx !== -1) copy[idx].hasWorker = false;
                        return copy;
                      });
                      
                      setWorkers((prevWorkers) => {
                        const newWorkers = [...prevWorkers];
                        const workerIdx = newWorkers.findIndex((w) => w.id === worker.id);
                        if (workerIdx !== -1) {
                          newWorkers[workerIdx].action = "idle";
                        }
                        return newWorkers;
                      });
                    }, ANIMATION_SPEED * 2);

                    const idx = tilledTiles.indexOf(randomTile);
                    if (idx > -1) tilledTiles.splice(idx, 1);
                  }
                }
              });
            }
            break;
          }

          case "planting": {
            const wateredTiles = updatedTiles.filter((t) => t.state === "watered" && !t.hasWorker);
            if (wateredTiles.length === 0) {
              setCyclePhase("growing");
              setDayCounter(0);
            } else {
              const availableWorkers = workers.filter((w) => w.action === "idle" || w.action === "walking");
              availableWorkers.slice(0, Math.min(3, wateredTiles.length)).forEach((worker) => {
                const randomTile = wateredTiles[Math.floor(Math.random() * wateredTiles.length)];
                if (randomTile) {
                  const tileIndex = updatedTiles.findIndex(
                    (t) => t.x === randomTile.x && t.y === randomTile.y
                  );
                  if (tileIndex !== -1) {
                    updatedTiles[tileIndex].state = "seeded";
                    updatedTiles[tileIndex].growthStage = 0;
                    updatedTiles[tileIndex].hasWorker = true;

                    setWorkers((prevWorkers) => {
                      const newWorkers = [...prevWorkers];
                      const workerIdx = newWorkers.findIndex((w) => w.id === worker.id);
                      if (workerIdx !== -1) {
                        newWorkers[workerIdx].action = "planting";
                        newWorkers[workerIdx].targetTileX = randomTile.x;
                        newWorkers[workerIdx].targetTileY = randomTile.y;
                        newWorkers[workerIdx].actionProgress = 0;
                      }
                      return newWorkers;
                    });

                    setTimeout(() => {
                      setTiles((t) => {
                        const copy = [...t];
                        const idx = copy.findIndex(
                          (tile) => tile.x === randomTile.x && tile.y === randomTile.y
                        );
                        if (idx !== -1) copy[idx].hasWorker = false;
                        return copy;
                      });
                      
                      setWorkers((prevWorkers) => {
                        const newWorkers = [...prevWorkers];
                        const workerIdx = newWorkers.findIndex((w) => w.id === worker.id);
                        if (workerIdx !== -1) {
                          newWorkers[workerIdx].action = "idle";
                        }
                        return newWorkers;
                      });
                    }, ANIMATION_SPEED * 2);

                    const idx = wateredTiles.indexOf(randomTile);
                    if (idx > -1) wateredTiles.splice(idx, 1);
                  }
                }
              });
            }
            break;
          }

          case "growing": {
            setDayCounter((prev) => prev + 1);

            updatedTiles.forEach((tile, index) => {
              if (tile.state === "seeded" || tile.state === "growing") {
                if (tile.growthStage < 3) {
                  updatedTiles[index].growthStage += 1;
                  updatedTiles[index].state = "growing";
                } else {
                  updatedTiles[index].state = "harvestable";
                }
              }
            });

            const allHarvestable = updatedTiles.every(
              (t) => t.state === "harvestable" || t.state === "grass"
            );
            if (allHarvestable) {
              setCyclePhase("harvesting");
            }
            break;
          }

          case "harvesting": {
            const harvestableTiles = updatedTiles.filter(
              (t) => t.state === "harvestable" && !t.hasWorker
            );
            if (harvestableTiles.length === 0) {
              setCyclePhase("tilling");
              setDayCounter(0);
            } else {
              const availableWorkers = workers.filter((w) => w.action === "idle" || w.action === "walking");
              availableWorkers.slice(0, Math.min(3, harvestableTiles.length)).forEach((worker) => {
                const randomTile = harvestableTiles[Math.floor(Math.random() * harvestableTiles.length)];
                if (randomTile) {
                  const tileIndex = updatedTiles.findIndex(
                    (t) => t.x === randomTile.x && t.y === randomTile.y
                  );
                  if (tileIndex !== -1) {
                    updatedTiles[tileIndex].state = "grass";
                    updatedTiles[tileIndex].growthStage = 0;
                    updatedTiles[tileIndex].hasWorker = true;

                    setWorkers((prevWorkers) => {
                      const newWorkers = [...prevWorkers];
                      const workerIdx = newWorkers.findIndex((w) => w.id === worker.id);
                      if (workerIdx !== -1) {
                        newWorkers[workerIdx].action = "harvesting";
                        newWorkers[workerIdx].targetTileX = randomTile.x;
                        newWorkers[workerIdx].targetTileY = randomTile.y;
                        newWorkers[workerIdx].actionProgress = 0;
                      }
                      return newWorkers;
                    });

                    setTimeout(() => {
                      setTiles((t) => {
                        const copy = [...t];
                        const idx = copy.findIndex(
                          (tile) => tile.x === randomTile.x && tile.y === randomTile.y
                        );
                        if (idx !== -1) copy[idx].hasWorker = false;
                        return copy;
                      });
                      
                      setWorkers((prevWorkers) => {
                        const newWorkers = [...prevWorkers];
                        const workerIdx = newWorkers.findIndex((w) => w.id === worker.id);
                        if (workerIdx !== -1) {
                          newWorkers[workerIdx].action = "idle";
                        }
                        return newWorkers;
                      });
                    }, ANIMATION_SPEED * 2);

                    const idx = harvestableTiles.indexOf(randomTile);
                    if (idx > -1) harvestableTiles.splice(idx, 1);
                  }
                }
              });
            }
            break;
          }
        }

        return updatedTiles;
      });
    }, ANIMATION_SPEED);

    return () => clearInterval(interval);
  }, [tiles.length, workers.length, cyclePhase, farmType]);

  // Worker movement and action animation
  useEffect(() => {
    const moveInterval = setInterval(() => {
      setWorkers((prevWorkers) => {
        return prevWorkers.map((worker) => {
          const targetX = worker.targetTileX * TILE_SIZE;
          const targetY = worker.targetTileY * TILE_SIZE;

          let newX = worker.x;
          let newY = worker.y;
          let newAction = worker.action;
          let newFacing = worker.facing;
          let newActionProgress = worker.actionProgress;

          const dx = targetX - worker.x;
          const dy = targetY - worker.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Movement logic
          if (distance > 2) {
            const moveSpeed = 2;
            newX += (dx / distance) * moveSpeed;
            newY += (dy / distance) * moveSpeed;
            newAction = "walking";
            newActionProgress = 0;

            if (Math.abs(dx) > Math.abs(dy)) {
              newFacing = dx > 0 ? "right" : "left";
            } else {
              newFacing = dy > 0 ? "down" : "up";
            }
          } else {
            // Reached target
            newX = targetX;
            newY = targetY;
            
            // Update action progress for working actions
            if (["hoeing", "watering", "planting", "harvesting"].includes(worker.action)) {
              newActionProgress = Math.min(1, worker.actionProgress + 0.05);
              
              // Action complete
              if (newActionProgress >= 1) {
                newAction = "idle";
                newActionProgress = 0;
              }
            } else if (worker.action === "walking") {
              newAction = "idle";
              newActionProgress = 0;
            }
          }

          return {
            ...worker,
            x: newX,
            y: newY,
            action: newAction,
            facing: newFacing,
            actionProgress: newActionProgress,
            animationFrame: (worker.animationFrame + 1) % 8,
          };
        });
      });
    }, WORKER_MOVE_SPEED);

    return () => clearInterval(moveInterval);
  }, []);

  // Calculate overlay offset so workers appear correctly on top of the TMX background.
  // FarmMapView renders starting at FARM_VIEWPORTS[farmType] tile origin.
  // We must shift the overlay div so that map pixel (vpOriginX * 16, vpOriginY * 16)
  // maps to screen pixel (0, 0).
  const viewportWidth = 640;
  const viewportHeight = 480;

  const vpDef = FARM_VIEWPORTS[farmType] ?? FARM_VIEWPORTS.standard;
  // Pixel scale that FarmMapView uses (same formula as FarmMapView)
  const vpScale = Math.min(
    viewportWidth  / (vpDef.cols * TILE_SIZE),
    viewportHeight / (vpDef.rows * TILE_SIZE),
    3
  );
  // Offset = -(viewport origin in map pixels) × scale
  const overlayOffsetX = -(vpDef.x * TILE_SIZE * vpScale);
  const overlayOffsetY = -(vpDef.y * TILE_SIZE * vpScale);

  return (
    <div className="multi-map-farming border-4 border-[#0b1209] bg-[#4f8547] p-4 shadow-[6px_6px_0_#0b1209]">
      {/* Header with map selector */}
      <div className="mb-3 flex items-center gap-3">
        <div className="flex-1">
          <FarmMapSelector
            currentMap={farmType}
            onMapChange={(newMap) => setFarmType(newMap)}
          />
        </div>
        <button
          onClick={() => setShowMapInfo(!showMapInfo)}
          className="rounded-none border-2 border-[#0b1209] bg-[#10190d] px-3 py-2 text-sm font-bold text-[#fff5cf] shadow-[2px_2px_0_#0b1209] transition-all hover:shadow-[4px_4px_0_#0b1209]"
        >
          {showMapInfo ? "Ẩn" : "Chi tiết"}
        </button>
      </div>

      {/* Map info card */}
      {showMapInfo && (
        <div className="mb-3">
          <MapInfoCard mapType={farmType} />
        </div>
      )}

      {/* Status bar */}
      <div className="mb-3 flex items-center justify-between rounded-none border-2 border-[#0b1209] bg-[#f5cf72] px-4 py-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-black text-[#2d2114]">
            Giai đoạn: <span className="capitalize">{cyclePhase}</span>
          </span>
          {cyclePhase === "growing" && (
            <span className="font-mono text-sm font-black text-[#2d2114]">
              Ngày: {dayCounter}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-[#2d2114]">
            {workers.length} Công nhân | {tiles.length} tiles
          </span>
        </div>
      </div>

      {/* Farm viewport - renders real TMX tiles */}
      <div
        className="relative overflow-hidden border-4 border-[#0b1209]"
        style={{
          width: viewportWidth,
          height: viewportHeight,
          background: "#4f8547",
        }}
      >
        {/* Real TMX map background - parsed from TMX files with actual tiles */}
        <FarmMapView
          farmType={farmType}
          pixelWidth={viewportWidth}
          pixelHeight={viewportHeight}
          style={{ position: "absolute", inset: 0, zIndex: 0 }}
        />

        {/* Overlay: farm tiles (soil / crop states)
             Positioned so map pixel (0,0) → screen pixel (overlayOffsetX, overlayOffsetY)
             Workers and tiles use map-space coords (tile × TILE_SIZE), scaled by vpScale. */}
        <div
          className="absolute"
          style={{
            left: overlayOffsetX,
            top: overlayOffsetY,
            width: farmConfig.width * TILE_SIZE * vpScale,
            height: farmConfig.height * TILE_SIZE * vpScale,
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          {/* Farm tiles (soil + crops) */}
          {tiles.map((tile, index) => (
            <TileView
              key={index}
              tile={tile}
              soilType={mainZone.soilType || (plot.id === "poor" ? "dark" : "dry")}
              scale={vpScale}
            />
          ))}

          {/* Workers */}
          {workers.map((worker) => (
            <WorkerView key={worker.id} worker={worker} scale={vpScale} />
          ))}

          {/* Robot if enabled */}
          {investment.aiRobot && (
            <div
              className="absolute"
              style={{
                left: (mainZone.x + 5) * TILE_SIZE * vpScale,
                top: (mainZone.y + 5) * TILE_SIZE * vpScale,
                zIndex: Z_LAYERS.CHARACTERS_BASE + 1,
              }}
            >
              <RobotView />
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-3 rounded-none border-2 border-[#0b1209] bg-[#10190d] px-4 py-2">
        <LegendItem color="#7a5c3e" label="Đất cày" />
        <LegendItem color="#4a3a2e" label="Tưới nước" />
        <LegendItem color="#7fc66a" label="Hạt giống" />
        <LegendItem color="#5ca545" label="Đang lớn" />
        <LegendItem color="#f5cf72" label="Thu hoạch" />
        <div className="ml-auto text-xs text-[#fff5cf]/60">
          💡 Chu trình: Đào → Tưới → Trồng → Lớn → Thu hoạch
        </div>
      </div>
    </div>
  );
}

// ===== RENDERING COMPONENTS =====
// These components render on TOP of the real TMX map background

function TileView({
  tile,
  soilType,
  scale = 1,
}: {
  tile: Tile;
  soilType: "dry" | "dark" | "sand";
  scale?: number;
}) {
  if (tile.state === "grass") return null;

  const ts = TILE_SIZE * scale;

  let showSoilTile = false;
  let soilVariant = soilType; // default to dry/dark/sand
  let cropSprite = null;

  switch (tile.state) {
    case "tilled":
      showSoilTile = true;
      soilVariant = soilType; // Dry soil
      break;

    case "watered":
      showSoilTile = true;
      soilVariant = "dark"; // Always use dark soil for watered state
      break;

    case "seeded":
    case "growing":
    case "harvestable":
      showSoilTile = true;
      soilVariant = "dark"; // Keep dark for planted crops
      const stage = Math.min(tile.growthStage + 1, 3);
      if (stage >= 1) {
        cropSprite = `crops/crop-row-${Math.floor(tile.x % 5) * 2}-stage-${stage}.png`;
      }
      break;
  }

  return (
    <div
      className="absolute"
      style={{
        left: tile.x * ts,
        top: tile.y * ts,
        width: ts,
        height: ts,
      }}
    >
      {showSoilTile && (
        <img
          src={sceneAsset(`crops/soil-${soilVariant}.png`)}
          alt=""
          className="pixelated absolute left-0 top-0"
          style={{
            width: ts,
            height: ts,
            imageRendering: "pixelated",
          }}
        />
      )}

      {cropSprite && (
        <img
          src={sceneAsset(cropSprite)}
          alt=""
          className="pixelated absolute left-0"
          style={{
            top: -14 * scale,
            width: ts,
            height: 32 * scale,
            imageRendering: "pixelated",
          }}
        />
      )}

      {/* Water droplet effect for watered tiles */}
      {tile.state === "watered" && (
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: 6 * scale,
            height: 6 * scale,
            backgroundColor: "#5ca1d8",
            borderRadius: "50%",
            opacity: 0.7,
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      )}

      {tile.hasWorker && (
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: 4 * scale,
            height: 4 * scale,
            backgroundColor: "#f5cf72",
            borderRadius: "50%",
            boxShadow: `0 0 ${4 * scale}px #f5cf72`,
          }}
        />
      )}
    </div>
  );
}

function WorkerView({ worker, scale = 1 }: { worker: Worker; scale?: number }) {
  const ws = 20 * scale;
  const hs = 38 * scale;
  
  // Calculate tool position and rotation based on action progress
  const getToolTransform = () => {
    const progress = worker.actionProgress;
    
    switch (worker.action) {
      case "hoeing":
        // Swing motion: raise up, then down
        const hoeAngle = -45 + (progress * 90); // -45° to +45°
        const hoeY = -8 - (Math.sin(progress * Math.PI) * 8); // Arc motion
        return {
          visible: true,
          tool: "hoe",
          x: 8 * scale,
          y: hoeY * scale,
          rotation: hoeAngle,
        };
      
      case "watering":
        // Tilt motion for watering
        const waterAngle = progress * 60; // 0° to 60° tilt
        return {
          visible: true,
          tool: "watering",
          x: 10 * scale,
          y: -6 * scale,
          rotation: waterAngle,
        };
      
      case "planting":
        // Bend down motion (no tool, just body animation)
        return {
          visible: false,
          tool: null,
          x: 0,
          y: 0,
          rotation: 0,
        };
      
      case "harvesting":
        // Cutting motion
        const harvestAngle = -30 + (progress * 60); // -30° to +30°
        return {
          visible: true,
          tool: "hoe", // Reuse hoe as scythe
          x: 8 * scale,
          y: -4 * scale,
          rotation: harvestAngle,
        };
      
      default:
        return {
          visible: false,
          tool: null,
          x: 0,
          y: 0,
          rotation: 0,
        };
    }
  };
  
  const toolTransform = getToolTransform();
  
  // Body bob animation during working
  const bodyOffsetY = ["hoeing", "planting", "harvesting"].includes(worker.action)
    ? Math.sin(worker.actionProgress * Math.PI) * 3 * scale
    : 0;

  return (
    <div
      className="absolute transition-all duration-100"
      style={{
        left: worker.x * scale,
        top: worker.y * scale,
        zIndex: calculateYSortedZIndex(worker.y * scale, Z_LAYERS.CHARACTERS_BASE),
        transform: worker.facing === "left" ? "scaleX(-1)" : "scaleX(1)",
      }}
    >
      <div className="relative" style={{ width: ws, height: hs }}>
        {/* Worker sprite with body bob */}
        <div
          style={{
            position: "relative",
            transform: `translateY(${bodyOffsetY}px)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          <img
            src={sceneAsset(worker.sprite)}
            alt="Worker"
            className="pixelated"
            style={{
              width: ws,
              height: hs,
              imageRendering: "pixelated",
            }}
          />
        </div>

        {/* Tool overlay */}
        {toolTransform.visible && toolTransform.tool && (
          <div
            style={{
              position: "absolute",
              left: toolTransform.x,
              top: toolTransform.y,
              width: 16 * scale,
              height: 16 * scale,
              transform: `rotate(${toolTransform.rotation}deg)`,
              transformOrigin: "bottom center",
              transition: "all 0.1s ease-out",
              zIndex: worker.action === "hoeing" ? 1 : -1, // Hoe in front, watering behind
            }}
          >
            {toolTransform.tool === "hoe" ? (
              <img
                src={sceneAsset("objects/hoe.png")}
                alt="Hoe"
                className="pixelated"
                style={{
                  width: "100%",
                  height: "100%",
                  imageRendering: "pixelated",
                }}
              />
            ) : toolTransform.tool === "watering" ? (
              // Simple watering can visual (since we don't have the asset)
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                }}
              >
                {/* Can body */}
                <div
                  style={{
                    position: "absolute",
                    left: "25%",
                    top: "40%",
                    width: "50%",
                    height: "45%",
                    backgroundColor: "#6b8b5a",
                    border: `${Math.max(1, scale)}px solid #4a6a3a`,
                    borderRadius: "20%",
                  }}
                />
                {/* Spout */}
                <div
                  style={{
                    position: "absolute",
                    left: "65%",
                    top: "50%",
                    width: "30%",
                    height: `${2 * scale}px`,
                    backgroundColor: "#6b8b5a",
                    border: `${Math.max(1, scale)}px solid #4a6a3a`,
                  }}
                />
                {/* Water drops when action is active */}
                {worker.actionProgress > 0.3 && (
                  <>
                    <div
                      style={{
                        position: "absolute",
                        left: "85%",
                        top: "55%",
                        width: `${3 * scale}px`,
                        height: `${3 * scale}px`,
                        backgroundColor: "#5ca1d8",
                        borderRadius: "50%",
                        opacity: 0.8,
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        left: "90%",
                        top: "60%",
                        width: `${2 * scale}px`,
                        height: `${2 * scale}px`,
                        backgroundColor: "#5ca1d8",
                        borderRadius: "50%",
                        opacity: 0.6,
                      }}
                    />
                  </>
                )}
              </div>
            ) : null}
          </div>
        )}

        {/* Action indicator text (for planting which has no tool) */}
        {worker.action === "planting" && (
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2 text-center"
            style={{ fontSize: 10 * scale }}
          >
            <span
              className="inline-block animate-bounce"
              style={{ animationDuration: "0.6s" }}
            >
              🌱
            </span>
          </div>
        )}

        {/* Action progress bar */}
        {["hoeing", "watering", "planting", "harvesting"].includes(worker.action) && (
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              top: -8 * scale,
              width: 20 * scale,
              height: 3 * scale,
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${worker.actionProgress * 100}%`,
                height: "100%",
                backgroundColor: "#7fc66a",
                transition: "width 0.1s linear",
              }}
            />
          </div>
        )}

        {/* Shadow */}
        <div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2"
          style={{
            width: 16 * scale,
            height: 8 * scale,
            backgroundColor: "rgba(11, 18, 9, 0.3)",
            borderRadius: "50%",
            filter: "blur(2px)",
          }}
        />
      </div>
    </div>
  );
}

function RobotView() {
  return (
    <div
      className="relative inline-block"
      style={{
        width: 13.5,
        height: 20.25,
        animation: "pulse 2s ease-in-out infinite",
      }}
    >
      <span style={robotBlock(1, 0, 8, 7, "#b9d7e8", 1.35, true)} />
      <span style={robotBlock(2, 7, 6, 4, "#6f8fa3", 1.35, true)} />
      <span style={robotBlock(4.5, -2, 1, 2, "#6f8fa3", 1.35)} />
      <span style={robotBlock(4, -3, 2, 2, "#f5cf72", 1.35)} />
      <span style={robotBlock(2.5, 2, 1.5, 1.5, "#2d2114", 1.35)} />
      <span style={robotBlock(6, 2, 1.5, 1.5, "#2d2114", 1.35)} />

      <span
        className="absolute -bottom-1 left-1/2 -translate-x-1/2"
        style={{
          width: 16,
          height: 8,
          backgroundColor: "rgba(11, 18, 9, 0.3)",
          borderRadius: "50%",
          filter: "blur(2px)",
        }}
      />
    </div>
  );
}

function robotBlock(
  left: number,
  top: number,
  width: number,
  height: number,
  color: string,
  scale: number,
  bordered = false
): CSSProperties {
  return {
    position: "absolute",
    left: left * scale,
    top: top * scale,
    width: width * scale,
    height: height * scale,
    backgroundColor: color,
    border: bordered ? `${Math.max(1, scale)}px solid #0b1209` : undefined,
  };
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="h-4 w-4 border-2 border-[#0b1209]"
        style={{ backgroundColor: color }}
      />
      <span className="text-xs font-bold text-[#fff5cf]/80">{label}</span>
    </div>
  );
}

/**
 * Add decorative elements to make each map unique
 * These are rendered on top of the TMX map for extra visual flair
 */
function MapDecorations({ farmType }: { farmType: FarmType }) {
  const config = FARM_MAPS[farmType];

  // Different decorations for each map
  switch (farmType) {
    case "hilltop":
      return (
        <>
          {/* Rocks scattered */}
          <div
            className="absolute"
            style={{
              left: "15%",
              top: "20%",
              width: 32,
              height: 32,
              backgroundColor: "#6b5d52",
              border: "2px solid #4a4038",
              boxShadow: "inset -2px -2px 4px rgba(0,0,0,0.3)",
            }}
          />
          <div
            className="absolute"
            style={{
              left: "75%",
              top: "60%",
              width: 24,
              height: 24,
              backgroundColor: "#6b5d52",
              border: "2px solid #4a4038",
            }}
          />
        </>
      );

    case "riverland":
      return (
        <>
          {/* Water patches */}
          <div
            className="absolute"
            style={{
              left: "10%",
              top: "30%",
              width: 80,
              height: 60,
              backgroundColor: "rgba(92, 161, 216, 0.6)",
              borderRadius: "50%",
              border: "2px solid rgba(74, 129, 173, 0.8)",
            }}
          />
          <div
            className="absolute"
            style={{
              left: "60%",
              top: "15%",
              width: 100,
              height: 70,
              backgroundColor: "rgba(92, 161, 216, 0.6)",
              borderRadius: "40%",
              border: "2px solid rgba(74, 129, 173, 0.8)",
            }}
          />
        </>
      );

    case "forest":
      return (
        <>
          {/* Trees */}
          <div
            className="absolute"
            style={{
              left: "20%",
              top: "25%",
              width: 24,
              height: 40,
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: 8,
                height: 16,
                backgroundColor: "#5d4a3a",
                border: "1px solid #3d2a1a",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: 24,
                height: 24,
                backgroundColor: "#4a7c3e",
                borderRadius: "50%",
                border: "2px solid #2a5c1e",
              }}
            />
          </div>
          <div
            className="absolute"
            style={{
              left: "70%",
              top: "40%",
              width: 20,
              height: 36,
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: 6,
                height: 14,
                backgroundColor: "#5d4a3a",
                border: "1px solid #3d2a1a",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: 20,
                height: 20,
                backgroundColor: "#4a7c3e",
                borderRadius: "50%",
                border: "2px solid #2a5c1e",
              }}
            />
          </div>
        </>
      );

    case "beach":
      return (
        <>
          {/* Grass patches on sand */}
          <div
            className="absolute"
            style={{
              left: "25%",
              top: "35%",
              width: 60,
              height: 50,
              backgroundColor: "rgba(127, 198, 106, 0.7)",
              borderRadius: "40%",
              border: "2px solid rgba(93, 138, 79, 0.8)",
            }}
          />
          <div
            className="absolute"
            style={{
              left: "65%",
              top: "50%",
              width: 50,
              height: 45,
              backgroundColor: "rgba(127, 198, 106, 0.7)",
              borderRadius: "50%",
              border: "2px solid rgba(93, 138, 79, 0.8)",
            }}
          />
        </>
      );

    case "wilderness":
      return (
        <>
          {/* Weeds and rocks */}
          <div
            className="absolute"
            style={{
              left: "30%",
              top: "20%",
              width: 16,
              height: 16,
              backgroundColor: "#8a9a5a",
              transform: "rotate(45deg)",
              border: "1px solid #6a7a3a",
            }}
          />
          <div
            className="absolute"
            style={{
              left: "55%",
              top: "65%",
              width: 20,
              height: 20,
              backgroundColor: "#6d6d52",
              border: "2px solid #4d4d32",
            }}
          />
        </>
      );

    case "four-corners":
      return (
        <>
          {/* Divider lines to show 4 quadrants */}
          <div
            className="absolute"
            style={{
              left: "50%",
              top: 0,
              bottom: 0,
              width: 4,
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              transform: "translateX(-50%)",
            }}
          />
          <div
            className="absolute"
            style={{
              left: 0,
              right: 0,
              top: "50%",
              height: 4,
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              transform: "translateY(-50%)",
            }}
          />
        </>
      );

    default:
      // Standard farm - simple decorations
      return (
        <>
          <div
            className="absolute"
            style={{
              left: "12%",
              top: "15%",
              width: 20,
              height: 20,
              backgroundColor: "#6b8b5a",
              borderRadius: "50%",
              border: "2px solid #4b6b3a",
              opacity: 0.6,
            }}
          />
        </>
      );
  }
}
