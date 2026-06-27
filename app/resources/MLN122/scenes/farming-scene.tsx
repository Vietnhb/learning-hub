/**
 * Farming scene with real TMX map rendering
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
import type { CSSProperties, ReactNode } from "react";
import { Sprout, Users } from "lucide-react";
import { type InvestmentState, type Plot } from "../core/game-model";
import { Z_LAYERS, calculateYSortedZIndex } from "../core/rendering";
import {
  FARM_MAPS,
  type FarmType,
  getFarmingZone,
} from "../core/farm-types";
import { FarmMapView, FARM_VIEWPORTS, useFarmableTiles } from "../maps/tmx-renderer";
import { MLN122_SHARED_SCENE_BASE, FARM_TMX_PATHS } from "../core/paths";

const SCENE_ASSET_BASE = MLN122_SHARED_SCENE_BASE;
const TILE_SIZE = 16;
const PHASE_CYCLE_SPEED = 1200; // ms between checking for new work (slower to see actions)
const WORKER_ACTION_DURATION = 2000; // ms per work action (hoeing, watering, etc.)
const WORKER_MOVE_SPEED = 80; // ms per movement frame
const GROWTH_SPEED = 1500; // ms per growth stage update

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

function getVisibleZone(
  zone: { x: number; y: number; cols: number; rows: number; soilType?: "dry" | "dark" | "sand" },
  viewport: { x: number; y: number; cols: number; rows: number },
) {
  const x = Math.max(zone.x, viewport.x);
  const y = Math.max(zone.y, viewport.y);
  const right = Math.min(zone.x + zone.cols, viewport.x + viewport.cols);
  const bottom = Math.min(zone.y + zone.rows, viewport.y + viewport.rows);
  const cols = right - x;
  const rows = bottom - y;

  if (cols > 4 && rows > 4) {
    return { ...zone, x, y, cols, rows };
  }

  return {
    ...zone,
    x: viewport.x + 3,
    y: viewport.y + 3,
    cols: Math.max(6, viewport.cols - 6),
    rows: Math.max(6, viewport.rows - 6),
  };
}

export function FarmingScene({
  plot,
  investment,
  farmType,
}: {
  plot: Plot;
  investment: InvestmentState;
  farmType: FarmType;
}) {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [cyclePhase, setCyclePhase] = useState<
    "thiết lập" | "đào đất" | "tưới nước" | "trồng hạt" | "đang lớn" | "thu hoạch"
  >("thiết lập");
  const [dayCounter, setDayCounter] = useState(0);
  const farmConfig = FARM_MAPS[farmType];
  const mainZone = getFarmingZone(farmType);
  const viewportWidth = 640;
  const viewportHeight = 480;
  const vpDef = FARM_VIEWPORTS[farmType] ?? FARM_VIEWPORTS.standard;
  const visibleZone = getVisibleZone(mainZone, vpDef);

  // Fetch real farmable positions from TMX Diggable tile properties
  const tmxUrl = FARM_TMX_PATHS[farmType] ?? FARM_TMX_PATHS.standard;
  const allDiggable = useFarmableTiles(tmxUrl);

  // Initialize farm tiles when TMX diggable positions are loaded
  useEffect(() => {
    if (allDiggable.length === 0) return;

    // Filter to visible viewport only
    const vx0 = vpDef.x;
    const vy0 = vpDef.y;
    const vx1 = vpDef.x + vpDef.cols;
    const vy1 = vpDef.y + vpDef.rows;

    const visible = allDiggable.filter(
      (p) => p.x >= vx0 && p.x < vx1 && p.y >= vy0 && p.y < vy1
    );

    if (visible.length === 0) return;

    const diggableSet = new Set(visible.map((p) => `${p.x},${p.y}`));
    const centerX = vpDef.x + vpDef.cols / 2;
    const centerY = vpDef.y + vpDef.rows / 2;
    const blockSizes = [
      { cols: 4, rows: 4 },
      { cols: 4, rows: 3 },
      { cols: 3, rows: 3 },
      { cols: 3, rows: 2 },
      { cols: 2, rows: 2 },
    ];

    let initialTiles: Tile[] = [];

    for (const size of blockSizes) {
      const candidates: Array<{ x: number; y: number; score: number }> = [];

      for (const p of visible) {
        let isFullBlock = true;
        for (let dy = 0; dy < size.rows && isFullBlock; dy++) {
          for (let dx = 0; dx < size.cols; dx++) {
            if (!diggableSet.has(`${p.x + dx},${p.y + dy}`)) {
              isFullBlock = false;
              break;
            }
          }
        }

        if (isFullBlock) {
          const blockCenterX = p.x + size.cols / 2;
          const blockCenterY = p.y + size.rows / 2;
          candidates.push({
            x: p.x,
            y: p.y,
            score: (blockCenterX - centerX) ** 2 + (blockCenterY - centerY) ** 2,
          });
        }
      }

      const best = candidates.sort((a, b) => a.score - b.score)[0];
      if (!best) continue;

      initialTiles = [];
      for (let dy = 0; dy < size.rows; dy++) {
        for (let dx = 0; dx < size.cols; dx++) {
          initialTiles.push({
            x: best.x + dx,
            y: best.y + dy,
            state: "grass",
            growthStage: 0,
            hasWorker: false,
          });
        }
      }
      break;
    }

    if (initialTiles.length === 0) return;

    setTiles(initialTiles);
    setCyclePhase("thiết lập");
    setDayCounter(0);
  }, [farmType, allDiggable.length]);

  // Initialize workers
  useEffect(() => {
    const initialWorkers: Worker[] = [];
    const workerCount = Math.min(investment.workers, 6);
    const spawnTiles = tiles.length > 0 ? tiles : [];

    for (let i = 0; i < workerCount; i++) {
      const spawnTile = spawnTiles[i % Math.max(1, spawnTiles.length)];
      const startX = spawnTile?.x ?? visibleZone.x;
      const startY = spawnTile?.y ?? visibleZone.y;

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
  }, [investment.workers, farmType, tiles.length]);

  // Main automation loop
  useEffect(() => {
    if (tiles.length === 0 || workers.length === 0) return;

    const interval = setInterval(() => {
      setTiles((prevTiles) => {
        const updatedTiles = [...prevTiles];

        switch (cyclePhase) {
          case "thiết lập":
            setCyclePhase("đào đất");
            break;

          case "đào đất": {
            const untilledTiles = updatedTiles.filter((t) => t.state === "grass" && !t.hasWorker);
            if (untilledTiles.length === 0) {
              setCyclePhase("tưới nước");
            } else {
              // Sort tiles by position (left to right, top to bottom) for organized farming
              untilledTiles.sort((a, b) => {
                if (a.y !== b.y) return a.y - b.y; // Top to bottom
                return a.x - b.x; // Left to right
              });

              const availableWorkers = workers.filter((w) => w.action === "idle" || w.action === "walking");
              
              // Assign workers to nearest tiles
              availableWorkers.slice(0, Math.min(2, untilledTiles.length)).forEach((worker, workerIndex) => {
                // Get the next tile in order
                const targetTile = untilledTiles[workerIndex];
                if (targetTile) {
                  const tileIndex = updatedTiles.findIndex(
                    (t) => t.x === targetTile.x && t.y === targetTile.y
                  );
                  if (tileIndex !== -1) {
                    updatedTiles[tileIndex].state = "tilled";
                    updatedTiles[tileIndex].hasWorker = true;

                    setWorkers((prevWorkers) => {
                      const newWorkers = [...prevWorkers];
                      const workerIdx = newWorkers.findIndex((w) => w.id === worker.id);
                      if (workerIdx !== -1) {
                        newWorkers[workerIdx].action = "hoeing";
                        newWorkers[workerIdx].targetTileX = targetTile.x;
                        newWorkers[workerIdx].targetTileY = targetTile.y;
                        newWorkers[workerIdx].actionProgress = 0;
                      }
                      return newWorkers;
                    });

                    // Clear worker marker after animation completes
                    setTimeout(() => {
                      setTiles((t) => {
                        const copy = [...t];
                        const idx = copy.findIndex(
                          (tile) => tile.x === targetTile.x && tile.y === targetTile.y
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
                    }, WORKER_ACTION_DURATION);
                  }
                }
              });
            }
            break;
          }

          case "tưới nước": {
            const tilledTiles = updatedTiles.filter((t) => t.state === "tilled" && !t.hasWorker);
            if (tilledTiles.length === 0) {
              setCyclePhase("trồng hạt");
            } else {
              // Sort tiles by position for organized watering
              tilledTiles.sort((a, b) => {
                if (a.y !== b.y) return a.y - b.y;
                return a.x - b.x;
              });

              const availableWorkers = workers.filter((w) => w.action === "idle" || w.action === "walking");
              availableWorkers.slice(0, Math.min(2, tilledTiles.length)).forEach((worker, workerIndex) => {
                const targetTile = tilledTiles[workerIndex];
                if (targetTile) {
                  const tileIndex = updatedTiles.findIndex(
                    (t) => t.x === targetTile.x && t.y === targetTile.y
                  );
                  if (tileIndex !== -1) {
                    updatedTiles[tileIndex].state = "watered";
                    updatedTiles[tileIndex].hasWorker = true;

                    setWorkers((prevWorkers) => {
                      const newWorkers = [...prevWorkers];
                      const workerIdx = newWorkers.findIndex((w) => w.id === worker.id);
                      if (workerIdx !== -1) {
                        newWorkers[workerIdx].action = "watering";
                        newWorkers[workerIdx].targetTileX = targetTile.x;
                        newWorkers[workerIdx].targetTileY = targetTile.y;
                        newWorkers[workerIdx].actionProgress = 0;
                      }
                      return newWorkers;
                    });

                    setTimeout(() => {
                      setTiles((t) => {
                        const copy = [...t];
                        const idx = copy.findIndex(
                          (tile) => tile.x === targetTile.x && tile.y === targetTile.y
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
                    }, WORKER_ACTION_DURATION);
                  }
                }
              });
            }
            break;
          }

          case "trồng hạt": {
            const wateredTiles = updatedTiles.filter((t) => t.state === "watered" && !t.hasWorker);
            if (wateredTiles.length === 0) {
              setCyclePhase("đang lớn");
              setDayCounter(0);
            } else {
              // Sort tiles by position for organized planting
              wateredTiles.sort((a, b) => {
                if (a.y !== b.y) return a.y - b.y;
                return a.x - b.x;
              });

              const availableWorkers = workers.filter((w) => w.action === "idle" || w.action === "walking");
              availableWorkers.slice(0, Math.min(2, wateredTiles.length)).forEach((worker, workerIndex) => {
                const targetTile = wateredTiles[workerIndex];
                if (targetTile) {
                  const tileIndex = updatedTiles.findIndex(
                    (t) => t.x === targetTile.x && t.y === targetTile.y
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
                        newWorkers[workerIdx].targetTileX = targetTile.x;
                        newWorkers[workerIdx].targetTileY = targetTile.y;
                        newWorkers[workerIdx].actionProgress = 0;
                      }
                      return newWorkers;
                    });

                    setTimeout(() => {
                      setTiles((t) => {
                        const copy = [...t];
                        const idx = copy.findIndex(
                          (tile) => tile.x === targetTile.x && tile.y === targetTile.y
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
                    }, WORKER_ACTION_DURATION);
                  }
                }
              });
            }
            break;
          }

          case "đang lớn": {
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
              setCyclePhase("thu hoạch");
            }
            break;
          }

          case "thu hoạch": {
            const harvestableTiles = updatedTiles.filter(
              (t) => t.state === "harvestable" && !t.hasWorker
            );
            if (harvestableTiles.length === 0) {
              setCyclePhase("đào đất");
              setDayCounter(0);
            } else {
              // Sort tiles by position for organized harvesting
              harvestableTiles.sort((a, b) => {
                if (a.y !== b.y) return a.y - b.y;
                return a.x - b.x;
              });

              const availableWorkers = workers.filter((w) => w.action === "idle" || w.action === "walking");
              availableWorkers.slice(0, Math.min(2, harvestableTiles.length)).forEach((worker, workerIndex) => {
                const targetTile = harvestableTiles[workerIndex];
                if (targetTile) {
                  const tileIndex = updatedTiles.findIndex(
                    (t) => t.x === targetTile.x && t.y === targetTile.y
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
                        newWorkers[workerIdx].targetTileX = targetTile.x;
                        newWorkers[workerIdx].targetTileY = targetTile.y;
                        newWorkers[workerIdx].actionProgress = 0;
                      }
                      return newWorkers;
                    });

                    setTimeout(() => {
                      setTiles((t) => {
                        const copy = [...t];
                        const idx = copy.findIndex(
                          (tile) => tile.x === targetTile.x && tile.y === targetTile.y
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
                    }, WORKER_ACTION_DURATION);
                  }
                }
              });
            }
            break;
          }
        }

        return updatedTiles;
      });
    }, PHASE_CYCLE_SPEED);

    return () => clearInterval(interval);
  }, [tiles.length, workers.length, cyclePhase, farmType]);

  useEffect(() => {
    const moveInterval = setInterval(() => {
      setWorkers((prevWorkers) =>
        prevWorkers.map((worker) => {
          const targetX = worker.targetTileX * TILE_SIZE;
          const targetY = worker.targetTileY * TILE_SIZE;
          const dx = targetX - worker.x;
          const dy = targetY - worker.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const step = 4;

          let nextX = worker.x;
          let nextY = worker.y;
          if (distance > step) {
            nextX += (dx / distance) * step;
            nextY += (dy / distance) * step;
          } else {
            nextX = targetX;
            nextY = targetY;
          }

          let facing = worker.facing;
          if (Math.abs(dx) > Math.abs(dy)) {
            facing = dx > 0 ? "right" : "left";
          } else if (Math.abs(dy) > 0.5) {
            facing = dy > 0 ? "down" : "up";
          }

          return {
            ...worker,
            x: nextX,
            y: nextY,
            facing,
            animationFrame: (worker.animationFrame + 1) % 4,
            actionProgress:
              worker.action === "idle"
                ? 0
                : Math.min(1, worker.actionProgress + 0.08),
          };
        }),
      );
    }, WORKER_MOVE_SPEED);

    return () => clearInterval(moveInterval);
  }, []);

  const vpScale = Math.min(
    viewportWidth / (vpDef.cols * TILE_SIZE),
    viewportHeight / (vpDef.rows * TILE_SIZE),
    3,
  );
  const overlayOffsetX = -(vpDef.x * TILE_SIZE * vpScale);
  const overlayOffsetY = -(vpDef.y * TILE_SIZE * vpScale);

  return (
    <div className="farming-scene grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="border-4 border-[#0b1209] bg-[#4f8547] p-4 shadow-[6px_6px_0_#0b1209]">
        <div
          className="relative max-w-full overflow-hidden border-4 border-[#0b1209]"
          style={{
            width: viewportWidth,
            height: viewportHeight,
            background: "#4f8547",
          }}
        >
          <FarmMapView
            farmType={farmType}
            pixelWidth={viewportWidth}
            pixelHeight={viewportHeight}
            style={{ position: "absolute", inset: 0, zIndex: 0 }}
          />

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
            {tiles.map((tile, index) => (
              <TileView
                key={index}
                tile={tile}
                soilType={mainZone.soilType || (plot.id === "poor" ? "dark" : "dry")}
                scale={vpScale}
              />
            ))}

            {workers.map((worker) => (
              <WorkerView key={worker.id} worker={worker} scale={vpScale} />
            ))}

            {investment.aiRobot && (
              <div
                className="absolute"
                style={{
                  left: (visibleZone.x + 5) * TILE_SIZE * vpScale,
                  top: (visibleZone.y + 5) * TILE_SIZE * vpScale,
                  zIndex: Z_LAYERS.CHARACTERS_BASE + 1,
                }}
              >
                <RobotView />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid content-start gap-3">
        <FarmStatusCard
          icon={<Users className="h-5 w-5 text-[#f5cf72]" />}
          title={investment.workers + " Cong nhan"}
          text="Lao dong song tao ra gia tri moi thong qua lao dong nong nghiep."
        />
        <FarmStatusCard
          icon={<Sprout className="h-5 w-5 text-[#7fc66a]" />}
          title={investment.seeds + " Goi hat giong"}
          text="Hat giong va cong cu chuyen giao gia tri, dong thoi nang cao nang suat."
        />
        <div className="border-4 border-[#0b1209] bg-[#10190d] p-4 shadow-[4px_4px_0_#0b1209]">
          <p className="text-xs font-black uppercase tracking-wide text-[#f5cf72]">
            Chat luong lo dat
          </p>
          <h3 className="mt-3 text-2xl font-black leading-tight text-white">
            {plot.title}
          </h3>
          <div className="mt-4 grid grid-cols-2 gap-3 text-center">
            <div>
              <p className="text-[10px] font-bold text-[#fff5cf]/60">
                Nang suat
              </p>
              <p className="font-mono text-lg font-black text-[#7fc66a]">
                {Math.round(plot.productivity * 100)}%
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#fff5cf]/60">
                Thi truong
              </p>
              <p className="font-mono text-lg font-black text-[#f5cf72]">
                {Math.round(plot.marketBonus * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function FarmStatusCard({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="border-4 border-[#0b1209] bg-[#10190d] p-4 shadow-[4px_4px_0_#0b1209]">
      <div>{icon}</div>
      <h3 className="mt-3 text-lg font-black text-white">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-[#fff5cf]/78">{text}</p>
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
        // Swing motion: raise up, then down (more dramatic arc)
        const hoeAngle = -60 + (progress * 120); // -60° to +60°
        const hoeY = -12 - (Math.sin(progress * Math.PI) * 12); // Bigger arc motion
        const hoeX = 6 + (Math.sin(progress * Math.PI * 2) * 4); // Side-to-side
        return {
          visible: true,
          tool: "hoe",
          x: hoeX * scale,
          y: hoeY * scale,
          rotation: hoeAngle,
        };
      
      case "watering":
        // Tilt motion for watering (smooth pour)
        const waterAngle = Math.sin(progress * Math.PI) * 75; // 0° to 75° and back
        const waterY = -6 + (progress * 4); // Lower as pouring
        return {
          visible: true,
          tool: "watering",
          x: 10 * scale,
          y: waterY * scale,
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
        // Cutting motion (side sweep)
        const harvestAngle = -45 + (Math.sin(progress * Math.PI * 2) * 45); // Swing motion
        const harvestX = 8 + (progress * 6); // Sweep forward
        return {
          visible: true,
          tool: "hoe", // Reuse hoe as scythe
          x: harvestX * scale,
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
  
  // Body bob animation during working (more pronounced)
  const bodyOffsetY = ["hoeing", "planting", "harvesting"].includes(worker.action)
    ? Math.sin(worker.actionProgress * Math.PI) * 4 * scale
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
              transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)", // Smooth easing
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

        {/* Action indicator icon above head */}
        {worker.action !== "idle" && worker.action !== "walking" && (
          <div
            className="absolute -top-6 left-1/2 -translate-x-1/2 animate-bounce"
            style={{ 
              fontSize: 14 * scale,
              animationDuration: "1s",
              textShadow: "0 0 3px rgba(0,0,0,0.5)",
            }}
          >
            {worker.action === "hoeing" && "🔨"}
            {worker.action === "watering" && "💧"}
            {worker.action === "planting" && "🌱"}
            {worker.action === "harvesting" && "✂️"}
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
                backgroundColor: worker.actionProgress > 0.8 ? "#f5cf72" : "#7fc66a",
                transition: "width 0.1s linear, background-color 0.3s ease",
              }}
            />
          </div>
        )}

        {/* Completion sparkle */}
        {["hoeing", "watering", "planting", "harvesting"].includes(worker.action) && 
         worker.actionProgress > 0.9 && (
          <div
            className="absolute left-1/2 top-0 -translate-x-1/2 animate-ping"
            style={{
              width: 8 * scale,
              height: 8 * scale,
              backgroundColor: "#f5cf72",
              borderRadius: "50%",
              opacity: 0.6,
            }}
          />
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
