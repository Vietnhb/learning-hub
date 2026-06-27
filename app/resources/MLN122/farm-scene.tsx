/**
 * Clean MLN122 farm scene.
 *
 * The main scene uses only cropped files from:
 * public/resources/MLN122/assets/shared/scene
 */

import type { CSSProperties, ReactNode } from "react";
import { Bot, Factory, Sprout, Users } from "lucide-react";
import farmRanchingViewport from "./farm-ranching-viewport.json";
import { type InvestmentState, type Plot } from "./game-model";
import { InfoTile } from "./ui-components";
import { Z_LAYERS, calculateYSortedZIndex } from "./rendering-utils";
import { MLN122_SHARED_SCENE_BASE } from "./asset-paths";

interface FarmSceneProps {
  plot: Plot;
  investment: InvestmentState;
  animated?: boolean;
}

const SCENE_ASSET_BASE = MLN122_SHARED_SCENE_BASE;
const TILE_SIZE = 16;
const SCENE_WIDTH = 576;
const SCENE_HEIGHT = 512;
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
const FARM_MAP_LAYER_ORDER = [
  "Back",
  "Back2",
  "Buildings",
  "Buildings2",
  "Front",
  "AlwaysFront",
  "AlwaysFront2",
];

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

export function FarmScene({
  plot,
  investment,
  animated = true,
}: FarmSceneProps) {
  const cropCells = Math.min(
    112,
    Math.max(24, investment.seeds * 8 + investment.workers * 4),
  );

  return (
    <div className="farm-scene-container grid gap-4 lg:grid-cols-[1fr_280px]">
      <div className="farm-scene-wrapper border-4 border-[#0b1209] bg-[#406f3a] p-4 shadow-[5px_5px_0_#0b1209]">
        <div className="farm-scene relative min-h-[560px] overflow-hidden border-4 border-[#0b1209] bg-[#4f8547]">
          <div
            className="absolute left-1/2 top-1/2 overflow-hidden"
            style={{
              width: SCENE_WIDTH,
              height: SCENE_HEIGHT,
              transform: "translate(-50%, -50%)",
              zIndex: Z_LAYERS.BACKGROUND,
            }}
          >
            <ProductionFarmGround />
            <FarmPlotGrid
              plot={plot}
              cropCells={cropCells}
              animated={animated}
            />
            <FarmAnimals />
            <CharacterLayer investment={investment} animated={animated} />
          </div>
        </div>
      </div>

      <div className="farm-info-panel grid content-start gap-3">
        <InfoTile
          icon={<Users className="h-5 w-5 text-[#f5cf72]" />}
          title={`${investment.workers} Công nhân`}
          text="Lao động sống tạo ra giá trị mới thông qua lao động nông nghiệp."
        />

        <InfoTile
          icon={<Sprout className="h-5 w-5 text-[#7fc66a]" />}
          title={`${investment.seeds} Gói hạt giống`}
          text="Hạt giống và công cụ chuyển giao giá trị, đồng thời nâng cao năng suất."
        />

        {investment.manager && (
          <InfoTile
            icon={<Factory className="h-5 w-5 text-[#9ed7ef]" />}
            title="Quản lý đang hoạt động"
            text="Công việc được tổ chức hiệu quả hơn, nâng cao sự phối hợp."
          />
        )}

        {investment.aiRobot && (
          <InfoTile
            icon={<Bot className="h-5 w-5 text-[#b9d7e8]" />}
            title="Robot AI đang hoạt động"
            text="Năng suất tăng lên, nhưng lao động vẫn là nguồn giá trị thặng dư."
          />
        )}

        <div className="mt-2 grid gap-2 border-4 border-[#0b1209] bg-[#10190d] p-3 shadow-[4px_4px_0_#0b1209]">
          <h4 className="text-xs font-black uppercase tracking-wide text-[#f5cf72]">
            Chất lượng lô đất
          </h4>
          <h3 className="text-lg font-black text-white">{plot.title}</h3>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div>
              <p className="text-[10px] font-bold text-[#fff5cf]/60">
                Năng suất
              </p>
              <p className="font-mono text-base font-black text-[#7fc66a]">
                {Math.round(plot.productivity * 100)}%
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#fff5cf]/60">
                Thị trường
              </p>
              <p className="font-mono text-base font-black text-[#f5cf72]">
                {Math.round(plot.marketBonus * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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

function FarmMapTileSprite({
  tile,
  x,
  y,
}: {
  tile: FarmMapTile;
  x: number;
  y: number;
}) {
  if (tile.Sheet === "Paths") {
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

function CharacterLayer({
  investment,
  animated,
}: {
  investment: InvestmentState;
  animated: boolean;
}) {
  const characters: Array<{
    id: string;
    x: number;
    y: number;
    element: ReactNode;
  }> = [];
  const workerPositions = [
    { x: 80, y: 304 },
    { x: 192, y: 304 },
    { x: 384, y: 304 },
    { x: 112, y: 376 },
    { x: 352, y: 376 },
    { x: 496, y: 376 },
  ];

  for (let i = 0; i < Math.min(investment.workers, 6); i++) {
    characters.push({
      id: `worker-${i}`,
      x: workerPositions[i].x,
      y: workerPositions[i].y,
      element: <SceneWorker variant={i} animated={animated} scale={1} />,
    });
  }

  if (investment.manager) {
    characters.push({
      id: "manager",
      x: 464,
      y: 224,
      element: (
        <SceneWorker
          variant={0}
          scale={1}
          sprite="characters/manager-v3.png"
        />
      ),
    });
  }

  if (investment.aiRobot) {
    characters.push({
      id: "robot",
      x: 520,
      y: 432,
      element: (
        <>
          <SceneRobot animated={animated} scale={1.35} />
          {animated && (
            <Positioned left={0} top={-20} zIndex={Z_LAYERS.EFFECTS}>
              <SceneImage
                src="effects/sparkle.png"
                width={16}
                height={16}
                scale={1.4}
                alt=""
              />
            </Positioned>
          )}
        </>
      ),
    });
  }

  return (
    <>
      {[...characters]
        .sort((a, b) => a.y - b.y)
        .map((char) => (
          <Positioned
            key={char.id}
            left={char.x}
            top={char.y}
            zIndex={calculateYSortedZIndex(char.y, Z_LAYERS.CHARACTERS_BASE)}
          >
            {char.element}
          </Positioned>
        ))}
    </>
  );
}

function SceneWorker({
  variant = 0,
  scale = 1.45,
  animated = false,
  sprite,
}: {
  variant?: number;
  scale?: number;
  animated?: boolean;
  sprite?: string;
}) {
  const workerSprite =
    sprite ?? WORKER_SPRITES[variant % WORKER_SPRITES.length];

  return (
    <div
      className="relative"
      style={{
        width: 20 * scale,
        height: 38 * scale,
        animation: animated ? "workerFieldStep 1.4s steps(2) infinite" : "none",
        animationDelay: `${variant * 0.2}s`,
      }}
    >
      <SceneImage
        src={workerSprite}
        width={20}
        height={38}
        scale={scale}
        alt="Worker"
      />
      <Shadow />
    </div>
  );
}

function SceneRobot({
  scale = 1.35,
  animated = true,
}: {
  scale?: number;
  animated?: boolean;
}) {
  return (
    <div
      className="relative inline-block"
      style={{
        width: 10 * scale,
        height: 15 * scale,
        animation: animated ? "pulse 2s ease-in-out infinite" : "none",
      }}
    >
      <span style={robotBlock(1, 0, 8, 7, "#b9d7e8", scale, true)} />
      <span style={robotBlock(2, 7, 6, 4, "#6f8fa3", scale, true)} />
      <span style={robotBlock(4.5, -2, 1, 2, "#6f8fa3", scale)} />
      <span style={robotBlock(4, -3, 2, 2, "#f5cf72", scale)} />
      <span style={robotBlock(2.5, 2, 1.5, 1.5, "#2d2114", scale)} />
      <span style={robotBlock(6, 2, 1.5, 1.5, "#2d2114", scale)} />
      <Shadow />
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

function FarmPlotGrid({
  plot,
  cropCells,
  animated,
}: {
  plot: Plot;
  cropCells: number;
  animated: boolean;
}) {
  const patches = [
    {
      left: 56,
      top: 64,
      cols: 9,
      rows: 5,
      soil: "dry" as const,
      crops: 0,
      tools: 9,
      stage: 1 as const,
      cropRow: 0,
    },
    {
      left: 48,
      top: 240,
      cols: 7,
      rows: 4,
      soil: "dry" as const,
      crops: 28,
      tools: 0,
      stage: 2 as const,
      cropRow: 2,
    },
    {
      left: 176,
      top: 240,
      cols: 7,
      rows: 4,
      soil: "dark" as const,
      crops: 28,
      tools: 0,
      stage: 3 as const,
      cropRow: 4,
    },
    {
      left: 384,
      top: 240,
      cols: 8,
      rows: 4,
      soil: "dry" as const,
      crops: 32,
      tools: 0,
      stage: 2 as const,
      cropRow: 6,
    },
    {
      left: 48,
      top: 432,
      cols: 8,
      rows: 3,
      soil: "dry" as const,
      crops: 24,
      tools: 0,
      stage: 1 as const,
      cropRow: 0,
    },
    {
      left: 320,
      top: 432,
      cols: 8,
      rows: 3,
      soil: "dry" as const,
      crops: 24,
      tools: 0,
      stage: 2 as const,
      cropRow: 8,
    },
  ];
  let remainingCrops = cropCells;

  return (
    <div className="absolute inset-0" style={{ zIndex: Z_LAYERS.CROPS }}>
      {patches.map((patch, index) => {
        const visibleCrops = Math.min(remainingCrops, patch.crops);
        remainingCrops -= visibleCrops;

        return (
          <Positioned key={index} left={patch.left} top={patch.top}>
            <SceneCropBed
              cols={patch.cols}
              rows={patch.rows}
              crops={visibleCrops}
              cropStage={patch.stage}
              cropRow={patch.cropRow}
              soil={
                plot.id === "poor" || patch.soil === "dark" ? "dark" : "dry"
              }
              animated={animated}
            />
            {patch.tools > 0 && (
              <div className="absolute left-1 top-0 flex gap-2">
                {Array.from({ length: patch.tools }).map((_, toolIndex) => (
                  <div key={toolIndex} className="-rotate-3">
                    <SceneImage
                      src="objects/hoe.png"
                      width={16}
                      height={16}
                      scale={0.85}
                      alt=""
                    />
                  </div>
                ))}
              </div>
            )}
          </Positioned>
        );
      })}
    </div>
  );
}

function SceneCropBed({
  cols,
  rows,
  crops,
  cropStage,
  cropRow,
  soil,
  animated = false,
}: {
  cols: number;
  rows: number;
  crops: number;
  cropStage: 1 | 2 | 3;
  cropRow: number;
  soil: "dry" | "dark";
  animated?: boolean;
}) {
  return (
    <div
      className="relative grid"
      style={{
        gridTemplateColumns: `repeat(${cols}, ${TILE_SIZE}px)`,
        gridTemplateRows: `repeat(${rows}, ${TILE_SIZE}px)`,
        width: cols * TILE_SIZE,
        height: rows * TILE_SIZE,
      }}
    >
      {Array.from({ length: cols * rows }).map((_, index) => (
        <div key={index} className="relative h-4 w-4">
          <SceneImage
            src={`crops/soil-${soil}.png`}
            width={16}
            height={16}
            alt=""
          />
          {index < crops && (
            <div
              className="absolute left-0 top-[-14px]"
              style={{
                animation: animated
                  ? "growCrop 1.6s ease-in-out infinite"
                  : "none",
                animationDelay: `${index * 0.08}s`,
              }}
            >
              <SceneImage
                src={`crops/crop-row-${cropRow}-stage-${cropStage}.png`}
                width={16}
                height={32}
                alt=""
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Shadow() {
  return (
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
  children: ReactNode;
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

export function CompactFarmPreview({ plot }: { plot: Plot }) {
  return (
    <div className="compact-farm-preview border-4 border-[#0b1209] bg-[#5ca545] p-2 shadow-[4px_4px_0_#0b1209]">
      <div className="relative h-32 overflow-hidden border-2 border-[#0b1209] bg-[#65b557]">
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{ transform: "scale(0.25)" }}
        >
          <div
            className="relative"
            style={{ width: SCENE_WIDTH, height: SCENE_HEIGHT }}
          >
            <ProductionFarmGround />
          </div>
        </div>
        <div className="absolute bottom-3 right-4">
          <SceneCropBed
            cols={3}
            rows={2}
            crops={5}
            cropStage={2}
            cropRow={2}
            soil={plot.id === "poor" ? "dark" : "dry"}
          />
        </div>
      </div>
    </div>
  );
}

export function PlotComparisonView({
  plots,
  selectedId,
  onSelect,
}: {
  plots: Plot[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="plot-comparison grid gap-4 md:grid-cols-3">
      {plots.map((plot) => (
        <button
          key={plot.id}
          type="button"
          onClick={() => onSelect(plot.id)}
          className={`pixel-card grid gap-3 p-3 text-left transition-all ${
            selectedId === plot.id
              ? "border-[#f5cf72] bg-[#20361d]"
              : "border-[#0b1209] bg-[#263f22]"
          }`}
        >
          <CompactFarmPreview plot={plot} />

          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-xs font-black uppercase text-[#f5cf72]">
                Plot {plot.short}
              </p>
              <h3 className="text-xl font-black text-white">{plot.title}</h3>
              <p className="text-xs font-bold text-[#fff5cf]/70">
                {plot.location}
              </p>
            </div>
            <span className="border-2 border-[#0b1209] bg-[#f5cf72] px-3 py-2 font-mono text-xl font-black text-[#2d2114]">
              {plot.short}
            </span>
          </div>

          <p className="min-h-[48px] text-sm leading-relaxed text-[#fff5cf]/78">
            {plot.description}
          </p>

          <div className="grid grid-cols-3 gap-2 text-center">
            <Metric
              label="Prod."
              value={`${Math.round(plot.productivity * 100)}%`}
            />
            <Metric
              label="Market"
              value={`${Math.round(plot.marketBonus * 100)}%`}
            />
            <Metric label="Rent" value={`${plot.absoluteRent}c`} />
          </div>
        </button>
      ))}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-2 border-[#0b1209] bg-[#10190d]/80 p-2">
      <p className="text-[10px] font-bold uppercase text-[#f5cf72]">{label}</p>
      <p className="font-mono text-sm font-black text-white">{value}</p>
    </div>
  );
}
