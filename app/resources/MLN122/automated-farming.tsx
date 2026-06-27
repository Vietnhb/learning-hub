/**
 * Automated Farming Animation
 * AI nhân vật tự động cày đất, gieo hạt giống như trong Stardew Valley
 * Tự động chạy không cần tương tác của người chơi
 * 
 * Uses FULL MAP from farm-scene with all buildings, paths, trees
 */

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import farmRanchingViewport from "./farm-ranching-viewport.json";
import { type InvestmentState, type Plot } from "./game-model";
import { Z_LAYERS, calculateYSortedZIndex } from "./rendering-utils";
import { MLN122_SHARED_SCENE_BASE } from "./asset-paths";

const SCENE_ASSET_BASE = MLN122_SHARED_SCENE_BASE;
const TILE_SIZE = 16;
const SCENE_WIDTH = 576;
const SCENE_HEIGHT = 512;
const ANIMATION_SPEED = 600; // ms per action
const WORKER_MOVE_SPEED = 150; // ms per tile

// Map layers configuration (same as farm-scene.tsx)
const FARM_MAP_LAYER_ORDER = [
  "Back",
  "Back2",
  "Paths",
  "Buildings",
  "Buildings2",
  "Front",
  "AlwaysFront",
  "AlwaysFront2",
];

const UNUSED_PATH_TILE_INDEXES = new Set([
  7, 9, 10, 11, 21, 22, 24, 25, 26, 29, 30, 36, 18,
]);

type FarmMapTile = {
  Sheet: string;
  Index: number;
};

type FarmMapLayer = {
  id: string;
  tiles: Array<Array<FarmMapTile | null>>;
};

type FarmMapSheet = {
  Id: string;
  SheetWidth: number;
};

const FARM_MAP = farmRanchingViewport as {
  width: number;
  height: number;
  tileSize: number;
  tileSheets: FarmMapSheet[];
  layers: FarmMapLayer[];
};

const FARM_MAP_SHEETS = new Map(
  FARM_MAP.tileSheets.map((sheet) => [sheet.Id, sheet]),
);

// Trạng thái tile trên map
type TileState = "grass" | "tilled" | "watered" | "seeded" | "growing" | "harvestable";

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
  action: "idle" | "walking" | "hoeing" | "watering" | "planting" | "harvesting";
  sprite: string;
  facing: "down" | "right" | "up" | "left";
  animationFrame: number;
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

// Vùng farm có thể canh tác (14x8 tiles)
const FARM_AREA = {
  startX: 3,
  startY: 4,
  cols: 14,
  rows: 8,
};

function sceneAsset(path: string) {
  return `${SCENE_ASSET_BASE}/${path.split("/").map(encodeURIComponent).join("/")}`;
}

function mapTileAsset(sheetId: string, tileIndex: number) {
  const sheetFolder = sheetId
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return sceneAsset(`map-tiles/${sheetFolder}/${tileIndex}.png`);
}

export function AutomatedFarmingScene({
  plot,
  investment,
}: {
  plot: Plot;
  investment: InvestmentState;
}) {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [cyclePhase, setCyclePhase] = useState<"setup" | "tilling" | "planting" | "growing" | "harvesting">("setup");
  const [dayCounter, setDayCounter] = useState(0);

  // Initialize farm tiles
  useEffect(() => {
    const initialTiles: Tile[] = [];
    for (let row = 0; row < FARM_AREA.rows; row++) {
      for (let col = 0; col < FARM_AREA.cols; col++) {
        initialTiles.push({
          x: FARM_AREA.startX + col,
          y: FARM_AREA.startY + row,
          state: "grass",
          growthStage: 0,
          hasWorker: false,
        });
      }
    }
    setTiles(initialTiles);
  }, []);

  // Initialize workers
  useEffect(() => {
    const initialWorkers: Worker[] = [];
    const workerCount = Math.min(investment.workers, 6);
    
    for (let i = 0; i < workerCount; i++) {
      const startX = FARM_AREA.startX + (i % 7) * 2;
      const startY = FARM_AREA.startY + Math.floor(i / 7) * 4;
      
      initialWorkers.push({
        id: i,
        x: startX * TILE_SIZE + 56, // Offset to scene
        y: startY * TILE_SIZE + 240,
        targetTileX: startX,
        targetTileY: startY,
        action: "idle",
        sprite: WORKER_SPRITES[i % WORKER_SPRITES.length],
        facing: "down",
        animationFrame: 0,
      });
    }
    setWorkers(initialWorkers);
  }, [investment.workers]);

  // Main automation loop
  useEffect(() => {
    if (tiles.length === 0 || workers.length === 0) return;

    const interval = setInterval(() => {
      setTiles((prevTiles) => {
        const updatedTiles = [...prevTiles];
        
        // Automation logic based on cycle phase
        switch (cyclePhase) {
          case "setup":
            setCyclePhase("tilling");
            break;

          case "tilling":
            // Workers cày đất
            const untilledTiles = updatedTiles.filter((t) => t.state === "grass");
            if (untilledTiles.length === 0) {
              setCyclePhase("planting");
            } else {
              // Assign workers to till random tiles
              workers.forEach((worker) => {
                const randomTile = untilledTiles[Math.floor(Math.random() * untilledTiles.length)];
                if (randomTile) {
                  const tileIndex = updatedTiles.findIndex(
                    (t) => t.x === randomTile.x && t.y === randomTile.y
                  );
                  if (tileIndex !== -1 && !updatedTiles[tileIndex].hasWorker) {
                    updatedTiles[tileIndex].state = "tilled";
                    updatedTiles[tileIndex].hasWorker = true;
                    
                    // Move worker to this tile
                    setWorkers((prevWorkers) => {
                      const newWorkers = [...prevWorkers];
                      const workerIdx = newWorkers.findIndex((w) => w.id === worker.id);
                      if (workerIdx !== -1) {
                        newWorkers[workerIdx].action = "hoeing";
                        newWorkers[workerIdx].targetTileX = randomTile.x;
                        newWorkers[workerIdx].targetTileY = randomTile.y;
                      }
                      return newWorkers;
                    });

                    setTimeout(() => {
                      setTiles((t) => {
                        const copy = [...t];
                        const idx = copy.findIndex((tile) => tile.x === randomTile.x && tile.y === randomTile.y);
                        if (idx !== -1) copy[idx].hasWorker = false;
                        return copy;
                      });
                    }, ANIMATION_SPEED);
                  }
                }
              });
            }
            break;

          case "planting":
            // Workers gieo hạt
            const tilledTiles = updatedTiles.filter((t) => t.state === "tilled");
            if (tilledTiles.length === 0) {
              setCyclePhase("growing");
              setDayCounter(0);
            } else {
              workers.forEach((worker) => {
                const randomTile = tilledTiles[Math.floor(Math.random() * tilledTiles.length)];
                if (randomTile) {
                  const tileIndex = updatedTiles.findIndex(
                    (t) => t.x === randomTile.x && t.y === randomTile.y
                  );
                  if (tileIndex !== -1 && !updatedTiles[tileIndex].hasWorker) {
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
                      }
                      return newWorkers;
                    });

                    setTimeout(() => {
                      setTiles((t) => {
                        const copy = [...t];
                        const idx = copy.findIndex((tile) => tile.x === randomTile.x && tile.y === randomTile.y);
                        if (idx !== -1) copy[idx].hasWorker = false;
                        return copy;
                      });
                    }, ANIMATION_SPEED);
                  }
                }
              });
            }
            break;

          case "growing":
            // Cây phát triển theo thời gian
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

            // Check if all crops are harvestable
            const allHarvestable = updatedTiles.every(
              (t) => t.state === "harvestable" || t.state === "grass"
            );
            if (allHarvestable) {
              setCyclePhase("harvesting");
            }
            break;

          case "harvesting":
            // Workers thu hoạch
            const harvestableTiles = updatedTiles.filter((t) => t.state === "harvestable");
            if (harvestableTiles.length === 0) {
              // Reset cycle
              setCyclePhase("tilling");
              setDayCounter(0);
            } else {
              workers.forEach((worker) => {
                const randomTile = harvestableTiles[Math.floor(Math.random() * harvestableTiles.length)];
                if (randomTile) {
                  const tileIndex = updatedTiles.findIndex(
                    (t) => t.x === randomTile.x && t.y === randomTile.y
                  );
                  if (tileIndex !== -1 && !updatedTiles[tileIndex].hasWorker) {
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
                      }
                      return newWorkers;
                    });

                    setTimeout(() => {
                      setTiles((t) => {
                        const copy = [...t];
                        const idx = copy.findIndex((tile) => tile.x === randomTile.x && tile.y === randomTile.y);
                        if (idx !== -1) copy[idx].hasWorker = false;
                        return copy;
                      });
                    }, ANIMATION_SPEED);
                  }
                }
              });
            }
            break;
        }

        return updatedTiles;
      });
    }, ANIMATION_SPEED);

    return () => clearInterval(interval);
  }, [tiles.length, workers.length, cyclePhase]);

  // Worker movement animation
  useEffect(() => {
    const moveInterval = setInterval(() => {
      setWorkers((prevWorkers) => {
        return prevWorkers.map((worker) => {
          const targetX = worker.targetTileX * TILE_SIZE + 56;
          const targetY = worker.targetTileY * TILE_SIZE + 240;

          let newX = worker.x;
          let newY = worker.y;
          let newAction = worker.action;
          let newFacing = worker.facing;

          // Move towards target
          const dx = targetX - worker.x;
          const dy = targetY - worker.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance > 2) {
            // Still moving
            const moveSpeed = 2;
            newX += (dx / distance) * moveSpeed;
            newY += (dy / distance) * moveSpeed;
            newAction = "walking";

            // Update facing direction
            if (Math.abs(dx) > Math.abs(dy)) {
              newFacing = dx > 0 ? "right" : "left";
            } else {
              newFacing = dy > 0 ? "down" : "up";
            }
          } else {
            // Reached target
            newX = targetX;
            newY = targetY;
            if (worker.action === "walking") {
              newAction = "idle";
            }
          }

          return {
            ...worker,
            x: newX,
            y: newY,
            action: newAction,
            facing: newFacing,
            animationFrame: (worker.animationFrame + 1) % 4,
          };
        });
      });
    }, WORKER_MOVE_SPEED);

    return () => clearInterval(moveInterval);
  }, []);

  return (
    <div className="automated-farming-scene border-4 border-[#0b1209] bg-[#4f8547] p-4 shadow-[6px_6px_0_#0b1209]">
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
            {workers.length} Công nhân
          </span>
        </div>
      </div>

      {/* Farm viewport with FULL MAP */}
      <div className="relative h-[512px] overflow-hidden border-4 border-[#0b1209] bg-[#4f8547]">
        <div
          className="absolute left-1/2 top-1/2 overflow-hidden"
          style={{
            width: SCENE_WIDTH,
            height: SCENE_HEIGHT,
            transform: "translate(-50%, -50%)",
            zIndex: Z_LAYERS.BACKGROUND,
          }}
        >
          {/* Full map background with all layers */}
          <ProductionFarmGround />

          {/* Farm tiles overlay on crop areas */}
          <div className="absolute inset-0" style={{ zIndex: Z_LAYERS.CROPS }}>
            {tiles.map((tile, index) => (
              <TileView
                key={index}
                tile={tile}
                soilType={plot.id === "poor" ? "dark" : "dry"}
              />
            ))}
          </div>

          {/* Workers */}
          <div className="absolute inset-0" style={{ zIndex: Z_LAYERS.CHARACTERS_BASE }}>
            {workers.map((worker) => (
              <WorkerView key={worker.id} worker={worker} />
            ))}
          </div>

          {/* Farm animals (static decorations) */}
          <FarmAnimals />

          {/* Robot if enabled */}
          {investment.aiRobot && (
            <div
              className="absolute"
              style={{
                left: 520,
                top: 432,
                zIndex: calculateYSortedZIndex(432, Z_LAYERS.CHARACTERS_BASE),
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
        <LegendItem color="#7fc66a" label="Hạt giống" />
        <LegendItem color="#5ca545" label="Đang lớn" />
        <LegendItem color="#f5cf72" label="Thu hoạch" />
        <div className="ml-auto text-xs text-[#fff5cf]/60">
          💡 Map hoàn chỉnh từ Stardew Valley
        </div>
      </div>
    </div>
  );
}

// ===== MAP RENDERING COMPONENTS (from farm-scene.tsx) =====

/**
 * Production farm ground with all map layers
 */
function ProductionFarmGround() {
  return (
    <div
      className="absolute inset-0"
      style={{ zIndex: Z_LAYERS.TERRAIN_BACKGROUND }}
    >
      {FARM_MAP_LAYER_ORDER.map((layerId, index) => {
        const layer = FARM_MAP.layers.find((item) => item.id === layerId);

        return layer ? (
          <FarmMapLayerView key={layerId} layer={layer} zIndex={index} />
        ) : null;
      })}
    </div>
  );
}

/**
 * Render a single map layer
 */
function FarmMapLayerView({
  layer,
  zIndex,
}: {
  layer: FarmMapLayer;
  zIndex: number;
}) {
  return (
    <div className="absolute inset-0" style={{ zIndex }}>
      {layer.tiles.map((row, y) =>
        row.map((tile, x) =>
          tile ? (
            <FarmMapTileSprite key={`${x}-${y}`} tile={tile} x={x} y={y} />
          ) : null,
        ),
      )}
    </div>
  );
}

/**
 * Render a single map tile sprite
 */
function FarmMapTileSprite({
  tile,
  x,
  y,
}: {
  tile: FarmMapTile;
  x: number;
  y: number;
}) {
  if (tile.Sheet === "Paths" && UNUSED_PATH_TILE_INDEXES.has(tile.Index)) {
    return null;
  }

  const sheet = FARM_MAP_SHEETS.get(tile.Sheet);

  if (!sheet) {
    return null;
  }

  return (
    <div
      className="absolute"
      style={{
        left: x * TILE_SIZE,
        top: y * TILE_SIZE,
        width: TILE_SIZE,
        height: TILE_SIZE,
        backgroundImage: `url(${mapTileAsset(tile.Sheet, tile.Index)})`,
        backgroundRepeat: "no-repeat",
        imageRendering: "pixelated",
      }}
    />
  );
}

/**
 * Static farm animals for decoration
 */
function FarmAnimals() {
  return (
    <>
      <Positioned
        left={80}
        top={160}
        zIndex={calculateYSortedZIndex(188, Z_LAYERS.CHARACTERS_BASE)}
      >
        <SceneImage
          src="animals/white-chicken.png"
          width={16}
          height={16}
          alt="Chicken"
        />
      </Positioned>
      <Positioned
        left={512}
        top={352}
        zIndex={calculateYSortedZIndex(384, Z_LAYERS.CHARACTERS_BASE)}
      >
        <SceneImage
          src="animals/brown-cow.png"
          width={32}
          height={32}
          alt="Cow"
        />
      </Positioned>
    </>
  );
}

function Positioned({
  left,
  top,
  zIndex,
  children,
}: {
  left: number;
  top: number;
  zIndex?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="absolute" style={{ left, top, zIndex }}>
      {children}
    </div>
  );
}

function SceneImage({
  src,
  width,
  height,
  scale = 1,
  alt,
  className = "",
}: {
  src: string;
  width: number;
  height: number;
  scale?: number;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={sceneAsset(src)}
      alt={alt}
      className={`pixelated block select-none ${className}`}
      draggable={false}
      style={{
        width: width * scale,
        height: height * scale,
        imageRendering: "pixelated",
      }}
    />
  );
}

// ===== TILE RENDERING =====

function TileView({ tile, soilType }: { tile: Tile; soilType: "dry" | "dark" }) {
  let showSoilTile = false;
  let cropSprite = null;

  switch (tile.state) {
    case "grass":
      // Don't render anything - show map background
      return null;
      
    case "tilled":
    case "watered":
      showSoilTile = true;
      break;
      
    case "seeded":
    case "growing":
    case "harvestable":
      showSoilTile = true;
      const stage = Math.min(tile.growthStage + 1, 3); // Stage 0->1, 1->2, 2->3, 3->3
      if (stage >= 1) {
        cropSprite = `crops/crop-row-${Math.floor(tile.x % 5) * 2}-stage-${stage}.png`;
      }
      break;
  }

  return (
    <div
      className="absolute"
      style={{
        left: tile.x * TILE_SIZE + 56,
        top: tile.y * TILE_SIZE + 240,
        width: TILE_SIZE,
        height: TILE_SIZE,
      }}
    >
      {/* Soil tile - only show when tilled */}
      {showSoilTile && (
        <img
          src={sceneAsset(`crops/soil-${soilType}.png`)}
          alt=""
          className="pixelated absolute left-0 top-0"
          style={{
            width: TILE_SIZE,
            height: TILE_SIZE,
            imageRendering: "pixelated",
          }}
        />
      )}

      {/* Crop */}
      {cropSprite && (
        <img
          src={sceneAsset(cropSprite)}
          alt=""
          className="pixelated absolute left-0"
          style={{
            top: -14,
            width: TILE_SIZE,
            height: 32,
            imageRendering: "pixelated",
            animation: "growCrop 1.6s ease-in-out infinite",
          }}
        />
      )}

      {/* Worker indicator */}
      {tile.hasWorker && (
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: 4,
            height: 4,
            backgroundColor: "#f5cf72",
            borderRadius: "50%",
            boxShadow: "0 0 4px #f5cf72",
            zIndex: Z_LAYERS.EFFECTS,
          }}
        />
      )}
    </div>
  );
}

function WorkerView({ worker }: { worker: Worker }) {
  const actionClass = worker.action === "walking" ? "worker-walking" : "";
  
  return (
    <div
      className={`absolute transition-all duration-150 ${actionClass}`}
      style={{
        left: worker.x,
        top: worker.y,
        zIndex: calculateYSortedZIndex(worker.y, Z_LAYERS.CHARACTERS_BASE),
        transform: worker.facing === "left" ? "scaleX(-1)" : "scaleX(1)",
      }}
    >
      <div className="relative" style={{ width: 20, height: 38 }}>
        <img
          src={sceneAsset(worker.sprite)}
          alt="Worker"
          className="pixelated"
          style={{
            width: 20,
            height: 38,
            imageRendering: "pixelated",
          }}
        />
        
        {/* Action indicator */}
        {worker.action !== "idle" && worker.action !== "walking" && (
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2"
            style={{ fontSize: 12 }}
          >
            {worker.action === "hoeing" && "🔨"}
            {worker.action === "watering" && "💧"}
            {worker.action === "planting" && "🌱"}
            {worker.action === "harvesting" && "✂️"}
          </div>
        )}

        {/* Shadow */}
        <div
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
      
      {/* Shadow */}
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
  bordered = false,
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
