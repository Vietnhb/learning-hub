/**
 * Pixel-Perfect Component Library
 * Reusable visual components with consistent styling and sharp rendering
 */

import { getAssetUrl, getAsset, type AssetDefinition } from "../sprites/sprite-registry";
import type { Plot } from "../core/game-model";
import { WorkerCharacter } from "../sprites/character-composer";

// ===== BASE COMPONENTS =====

interface AssetImageProps {
  assetId?: string;
  fileName?: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Base image component with pixel-perfect rendering
 */
export function AssetImage({ assetId, fileName, alt, className = "", style }: AssetImageProps) {
  const file = assetId ? getAsset(assetId)?.file : fileName;
  if (!file) return null;

  return (
    <img
      src={getAssetUrl(file)}
      alt={alt}
      className={`pixelated ${className}`}
      style={style}
      draggable={false}
    />
  );
}

interface SpriteProps {
  assetId?: string;
  fileName?: string;
  width?: number;
  height?: number;
  spriteX?: number;
  spriteY?: number;
  scale?: number;
  className?: string;
}

interface AnimatedSpriteProps extends SpriteProps {
  frameCount: number;
  frameDuration?: number;
  delay?: number;
  paused?: boolean;
}

/**
 * Sprite component for extracting specific regions from sprite sheets
 */
export function Sprite({
  assetId,
  fileName,
  width,
  height,
  spriteX,
  spriteY,
  scale = 1,
  className = "",
}: SpriteProps) {
  const asset = assetId ? getAsset(assetId) : undefined;
  const file = asset?.file ?? fileName;
  const spriteWidth = width ?? asset?.width;
  const spriteHeight = height ?? asset?.height;
  const backgroundX = spriteX ?? asset?.spriteX ?? 0;
  const backgroundY = spriteY ?? asset?.spriteY ?? 0;
  if (!file || !spriteWidth || !spriteHeight) return null;

  return (
    <span
      className={`sprite-container ${className}`}
      style={{
        display: "block",
        width: spriteWidth * scale,
        height: spriteHeight * scale,
        overflow: "hidden",
        imageRendering: "pixelated",
      }}
    >
      <span
        className="sprite-inner"
        style={{
          display: "block",
          width: spriteWidth,
          height: spriteHeight,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          backgroundImage: `url(${getAssetUrl(file)})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: `${backgroundX}px ${backgroundY}px`,
          imageRendering: "pixelated",
        }}
      />
    </span>
  );
}

/**
 * Sprite animation for sheets where frames are placed horizontally.
 * The outer box stays fixed; only background-position steps through frames.
 */
export function AnimatedSprite({
  assetId,
  fileName,
  width,
  height,
  spriteX,
  spriteY,
  scale = 1,
  className = "",
  frameCount,
  frameDuration = 0.8,
  delay = 0,
  paused = false,
}: AnimatedSpriteProps) {
  const asset = assetId ? getAsset(assetId) : undefined;
  const file = asset?.file ?? fileName;
  const spriteWidth = width ?? asset?.width;
  const spriteHeight = height ?? asset?.height;
  const backgroundX = spriteX ?? asset?.spriteX ?? 0;
  const backgroundY = spriteY ?? asset?.spriteY ?? 0;
  if (!file || !spriteWidth || !spriteHeight) return null;

  const vars = {
    "--sprite-start-x": `${backgroundX}px`,
    "--sprite-end-x": `${backgroundX - spriteWidth * frameCount}px`,
    "--sprite-y": `${backgroundY}px`,
  } as React.CSSProperties;

  return (
    <span
      className={`sprite-container ${className}`}
      style={{
        display: "block",
        width: spriteWidth * scale,
        height: spriteHeight * scale,
        overflow: "hidden",
        imageRendering: "pixelated",
      }}
    >
      <span
        className="sprite-inner"
        style={{
          ...vars,
          display: "block",
          width: spriteWidth,
          height: spriteHeight,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          backgroundImage: `url(${getAssetUrl(file)})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: `${backgroundX}px ${backgroundY}px`,
          imageRendering: "pixelated",
          animation: paused
            ? "none"
            : `spriteFrameX ${frameDuration}s steps(${frameCount}) infinite`,
          animationDelay: `${delay}s`,
        }}
      />
    </span>
  );
}

// ===== CHARACTER COMPONENTS =====

interface WorkerSpriteProps {
  variant?: "male" | "female";
  delay?: number;
  scale?: number;
  animated?: boolean;
}

/**
 * Animated worker assembled from aligned farmer base, shirt, and pants layers.
 */
export function WorkerSprite({ 
  variant = "male", 
  delay = 0, 
  scale = 2.5, 
  animated = true 
}: WorkerSpriteProps) {
  const animationStyle = animated ? {
    animation: `workerFieldStep 1.4s steps(2) infinite`,
    animationDelay: `${delay}s`,
  } : {};

  const clothingVariant = Math.floor(delay * 5) % 4;

  return (
    <div
      className="worker-sprite relative inline-block"
      style={{
        ...animationStyle,
        width: 16 * scale,
        height: 32 * scale,
      }}
    >
      <WorkerCharacter
        gender={variant}
        variant={clothingVariant}
        scale={scale}
        animated={false}
      />
      <Shadow size="small" />
    </div>
  );
}

interface ManagerSpriteProps {
  scale?: number;
}

/**
 * Manager character (distinguished from workers)
 */
export function ManagerSprite({ scale = 2.5 }: ManagerSpriteProps) {
  return (
    <div className="manager-sprite relative" style={{ width: 16 * scale, height: 32 * scale }}>
      <AnimatedSprite
        fileName="Characters__Farmer__farmer_base.png"
        width={16}
        height={32}
        spriteX={-32}
        spriteY={0}
        scale={scale}
        frameCount={4}
        frameDuration={0.9}
      />
      {/* Manager has a hat or different outfit */}
      <Shadow size="small" />
    </div>
  );
}

interface RobotSpriteProps {
  scale?: number;
  animated?: boolean;
}

/**
 * AI Robot sprite with subtle animation
 */
export function RobotSprite({ scale = 2.2, animated = true }: RobotSpriteProps) {
  const pulseStyle = animated ? { animation: "pulse 2s ease-in-out infinite" } : {};
  
  return (
    <div
      className="robot-sprite relative inline-block flex flex-col items-center"
      style={{ ...pulseStyle }}
    >
      {/* Custom pixel robot design */}
      <div style={{ width: 10 * scale, height: 12 * scale, position: "relative" }}>
        {/* Head */}
        <div
          className="absolute"
          style={{
            left: scale * 1,
            top: 0,
            width: scale * 8,
            height: scale * 7,
            backgroundColor: "#b9d7e8",
            border: `${scale}px solid #0b1209`,
          }}
        >
          {/* Eyes */}
          <div
            className="absolute"
            style={{
              left: scale * 1.5,
              top: scale * 2,
              width: scale * 2,
              height: scale * 2,
              backgroundColor: "#2d2114",
            }}
          />
          <div
            className="absolute"
            style={{
              right: scale * 1.5,
              top: scale * 2,
              width: scale * 2,
              height: scale * 2,
              backgroundColor: "#2d2114",
            }}
          />
        </div>
        {/* Body */}
        <div
          className="absolute"
          style={{
            left: scale * 2,
            top: scale * 7,
            width: scale * 6,
            height: scale * 4,
            backgroundColor: "#6f8fa3",
            border: `${scale}px solid #0b1209`,
          }}
        />
        {/* Antenna */}
        <div
          className="absolute"
          style={{
            left: scale * 4.5,
            top: -scale * 2,
            width: scale * 1,
            height: scale * 2,
            backgroundColor: "#6f8fa3",
          }}
        />
        <div
          className="absolute"
          style={{
            left: scale * 4,
            top: -scale * 3,
            width: scale * 2,
            height: scale * 2,
            backgroundColor: "#f5cf72",
            borderRadius: "50%",
          }}
        />
      </div>
      <Shadow size="small" />
    </div>
  );
}

// ===== BUILDING COMPONENTS =====

interface BuildingProps {
  assetId: string;
  label: string;
  size?: "small" | "medium" | "large";
  showLabel?: boolean;
}

/**
 * Generic building component with label
 */
export function Building({
  assetId,
  label,
  size = "medium",
  showLabel = true,
}: BuildingProps) {
  const dimensions = {
    small: { width: 124, height: 128 },
    medium: { width: 164, height: 148 },
    large: { width: 204, height: 176 },
  };

  const dim = dimensions[size];

  return (
    <div className="building-container grid justify-items-center gap-1" style={{ width: dim.width }}>
      <div className="relative isolate overflow-visible" style={{ width: dim.width, height: dim.height }}>
        <span className="absolute bottom-1 left-1/2 h-5 w-[82%] -translate-x-1/2 rounded-[50%] bg-[#0b1209]/28 blur-[1px]" />
        <AssetImage
          assetId={assetId}
          alt={label}
          className="absolute bottom-0 left-1/2 max-h-full max-w-full -translate-x-1/2 object-contain object-bottom drop-shadow-[3px_3px_0_rgba(11,18,9,0.45)]"
        />
      </div>
      {showLabel && (
        <span className="building-label border-2 border-[#0b1209] bg-[#10190d] px-2 py-0.5 text-[10px] font-black uppercase text-[#fff5cf]">
          {label}
        </span>
      )}
    </div>
  );
}

/**
 * Landlord estate building
 */
export function LandlordEstate({
  plotId,
  size = "medium",
  showLabel = true,
}: {
  plotId: string;
  size?: "small" | "medium" | "large";
  showLabel?: boolean;
}) {
  const assetMap: Record<string, string> = {
    fertile: "landlord_barn",
    average: "landlord_big_barn",
    poor: "landlord_coop",
  };

  return (
    <Building
      assetId={assetMap[plotId] || "landlord_big_barn"}
      label="Landlord"
      size={size}
      showLabel={showLabel}
    />
  );
}

/**
 * Village market building
 */
export function MarketBuilding({
  size = "medium",
  showLabel = true,
}: {
  size?: "small" | "medium" | "large";
  showLabel?: boolean;
}) {
  const dimensions = {
    small: { width: 124, height: 128, binSize: 20 },
    medium: { width: 164, height: 148, binSize: 32 },
    large: { width: 204, height: 176, binSize: 40 },
  };

  const dim = dimensions[size];

  return (
    <div className="market-container grid justify-items-center gap-1" style={{ width: dim.width }}>
      <div className="relative isolate overflow-visible" style={{ width: dim.width, height: dim.height }}>
        <span className="absolute bottom-1 left-1/2 h-5 w-[82%] -translate-x-1/2 rounded-[50%] bg-[#0b1209]/28 blur-[1px]" />
        <AssetImage
          assetId="market_shed"
          alt="Market"
          className="absolute bottom-0 left-1/2 max-h-full max-w-full -translate-x-1/2 object-contain object-bottom drop-shadow-[3px_3px_0_rgba(11,18,9,0.45)]"
        />
        <div className="absolute bottom-2 left-3" style={{ width: dim.binSize, height: dim.binSize }}>
          <AssetImage assetId="shipping_bin" alt="" className="h-full w-full object-contain" />
        </div>
      </div>
      {showLabel && (
        <span className="market-label border-2 border-[#0b1209] bg-[#10190d] px-2 py-0.5 text-[10px] font-black uppercase text-[#fff5cf]">
          Market
        </span>
      )}
    </div>
  );
}

export function FarmHouse({ size = "large" }: { size?: "small" | "medium" | "large" }) {
  return <Building assetId="market_shed" label="Farm House" size={size} showLabel={false} />;
}

// ===== CROP COMPONENTS =====

interface CropSpriteProps {
  stage?: 1 | 2 | 3;
  cropRow?: number;
  scale?: number;
}

/**
 * Crop growth stages
 */
export function CropSprite({ stage = 1, cropRow = 0, scale = 2 }: CropSpriteProps) {
  const stagePositions = {
    1: { x: 0, y: 0 },
    2: { x: -16, y: 0 },
    3: { x: -32, y: 0 },
  };

  const pos = stagePositions[stage];

  return (
    <Sprite
      fileName="TileSheets__crops.png"
      width={16}
      height={32}
      spriteX={pos.x}
      spriteY={pos.y - cropRow * 32}
      scale={scale}
    />
  );
}

// ===== TERRAIN & DECORATION COMPONENTS =====

interface TerrainTileProps {
  kind?: "grass" | "dirtPath" | "stonePath" | "wood";
  variant?: number;
  scale?: number;
  className?: string;
}

export function TerrainTile({ kind = "grass", variant = 0, scale = 2, className = "" }: TerrainTileProps) {
  if (kind === "grass") {
    return (
      <span
        className={`relative block overflow-hidden ${className}`}
        style={{
          width: 16 * scale,
          height: 16 * scale,
          backgroundColor: "#68b95a",
          imageRendering: "pixelated",
        }}
      >
        {variant % 11 === 0 && (
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 opacity-75">
            <Sprite
              fileName="TerrainFeatures__grass.png"
              width={16}
              height={16}
              spriteX={-((variant % 4) * 16)}
              spriteY={0}
              scale={scale}
            />
          </span>
        )}
      </span>
    );
  }

  const tileMap = {
    dirtPath: { x: 6, y: 5 },
    stonePath: { x: variant % 4, y: 8 + (Math.floor(variant / 4) % 4) },
    wood: { x: 13 + (variant % 3), y: 8 + (Math.floor(variant / 3) % 4) },
  } satisfies Record<Exclude<TerrainTileProps["kind"], "grass" | undefined>, { x: number; y: number }>;
  const tile = tileMap[kind];

  return (
    <Sprite
      fileName="TerrainFeatures__Flooring.png"
      width={16}
      height={16}
      spriteX={-tile.x * 16}
      spriteY={-tile.y * 16}
      scale={scale}
      className={className}
    />
  );
}

interface SoilTileProps {
  variant?: "dry" | "dark";
  frame?: number;
  scale?: number;
  className?: string;
}

export function SoilTile({ variant = "dry", frame = 0, scale = 4, className = "" }: SoilTileProps) {
  return (
    <Sprite
      fileName={variant === "dark" ? "TerrainFeatures__hoeDirtDark.png" : "TerrainFeatures__hoeDirt.png"}
      width={16}
      height={16}
      spriteX={-(frame % 12) * 16}
      spriteY={variant === "dark" ? -16 : 0}
      scale={scale}
      className={className}
    />
  );
}

interface SoilPatchProps {
  variant?: "dry" | "dark";
  scale?: number;
  className?: string;
}

export function SoilPatch({ variant = "dry", scale = 2, className = "" }: SoilPatchProps) {
  return (
    <Sprite
      fileName={variant === "dark" ? "TerrainFeatures__hoeDirtDark.png" : "TerrainFeatures__hoeDirt.png"}
      width={32}
      height={32}
      spriteX={variant === "dark" ? -80 : -16}
      spriteY={0}
      scale={scale}
      className={className}
    />
  );
}

interface CropBedProps {
  cols?: number;
  rows?: number;
  crops?: number;
  cropStage?: 1 | 2 | 3;
  cropRow?: number;
  soil?: "dry" | "dark";
  scale?: number;
  animated?: boolean;
  className?: string;
}

export function CropBed({
  cols = 3,
  rows = 3,
  crops = cols * rows,
  cropStage = 2,
  cropRow = 0,
  soil = "dry",
  scale = 2,
  animated = false,
  className = "",
}: CropBedProps) {
  const tileSize = 16 * scale;
  const dirtFile = soil === "dark" ? "TerrainFeatures__hoeDirtDark.png" : "TerrainFeatures__hoeDirt.png";

  return (
    <div
      className={`relative grid ${className}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, ${tileSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${tileSize}px)`,
        width: cols * tileSize,
        height: rows * tileSize,
      }}
    >
      {Array.from({ length: cols * rows }).map((_, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        const sourceX = getHoeDirtSourceX(col, cols);
        const sourceY = getHoeDirtSourceY(row, rows);

        return (
          <div key={index} className="relative" style={{ width: tileSize, height: tileSize }}>
            <Sprite
              fileName={dirtFile}
              width={16}
              height={16}
              spriteX={-sourceX}
              spriteY={-sourceY}
              scale={scale}
            />
            {index < crops && (
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[68%]"
                style={{
                  animation: animated ? `growCrop 1.6s ease-in-out infinite` : "none",
                  animationDelay: `${index * 0.08}s`,
                }}
              >
                <CropSprite stage={cropStage} cropRow={cropRow} scale={scale} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function getHoeDirtSourceX(col: number, cols: number) {
  if (cols <= 1) return 0;
  if (col === 0) return 16;
  if (col === cols - 1) return 64;
  return 32 + ((col - 1) % 2) * 16;
}

function getHoeDirtSourceY(row: number, rows: number) {
  if (rows <= 1) return 16;
  if (row === 0) return 0;
  if (row === rows - 1) return 32;
  return 16;
}

interface TreeSpriteProps {
  variant?: "oak" | "maple" | "pine";
  scale?: number;
}

/**
 * Decorative tree sprites
 */
export function TreeSprite({ variant = "oak", scale = 1 }: TreeSpriteProps) {
  const treeMap = {
    oak: "TerrainFeatures__tree1_summer.png",
    maple: "TerrainFeatures__tree2_summer.png",
    pine: "TerrainFeatures__tree3_spring.png",
  };
  const renderScale = scale * 2;

  return (
    <div className="tree-sprite drop-shadow-[3px_3px_0_rgba(11,18,9,0.5)]">
      <Sprite
        fileName={treeMap[variant]}
        width={48}
        height={80}
        spriteX={0}
        spriteY={0}
        scale={renderScale}
      />
    </div>
  );
}

/**
 * Animal decorations
 */
export function AnimalSprite({ type, scale = 1 }: { type: "cow" | "chicken" | "horse"; scale?: number }) {
  const spriteMap = {
    cow: {
      fileName: "Animals__Brown Cow.png",
      width: 32,
      height: 32,
      spriteX: 0,
      spriteY: -32,
      renderScale: scale * 1.5,
      frameCount: 4,
      frameDuration: 0.9,
    },
    chicken: {
      fileName: "Animals__White Chicken.png",
      width: 16,
      height: 16,
      spriteX: 0,
      spriteY: 0,
      renderScale: scale * 1.7,
      frameCount: 4,
      frameDuration: 0.55,
    },
    horse: {
      fileName: "Animals__horse.png",
      width: 32,
      height: 32,
      spriteX: 0,
      spriteY: -32,
      renderScale: scale * 1.6,
      frameCount: 7,
      frameDuration: 0.95,
    },
  };
  const sprite = spriteMap[type];

  return (
    <AnimatedSprite
      {...sprite}
      scale={sprite.renderScale}
      frameCount={sprite.frameCount}
      frameDuration={sprite.frameDuration}
    />
  );
}

// ===== EFFECTS & UI COMPONENTS =====

/**
 * Shadow effect under characters and objects
 */
export function Shadow({ size = "small" }: { size?: "small" | "medium" | "large" }) {
  const sizeMap = {
    small: { w: 16, h: 8 },
    medium: { w: 24, h: 12 },
    large: { w: 32, h: 16 },
  };

  const dim = sizeMap[size];

  return (
    <div
      className="shadow-effect absolute -bottom-1 left-1/2 -translate-x-1/2"
      style={{
        width: dim.w,
        height: dim.h,
        backgroundColor: "rgba(11, 18, 9, 0.3)",
        borderRadius: "50%",
        filter: "blur(2px)",
      }}
    />
  );
}

/**
 * Productivity sparkle effect
 */
export function SparkleEffect({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="sparkle-effect absolute"
      style={{
        animation: `sparkle 1.5s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <Sprite fileName="TileSheets__animations.png" width={16} height={16} spriteX={0} spriteY={0} scale={1.5} />
    </div>
  );
}

/**
 * Tool icon sprite
 */
export function ToolIcon({ scale = 2 }: { scale?: number }) {
  return <Sprite assetId="tool_hoe" scale={scale} />;
}

/**
 * Seed icon sprite
 */
export function SeedIcon({ scale = 1.8 }: { scale?: number }) {
  return <Sprite assetId="seed_bag" scale={scale} />;
}

/**
 * Coin/Money icon
 */
export function CoinIcon({ scale = 1.5 }: { scale?: number }) {
  return <Sprite assetId="icon_coin" scale={scale} />;
}

// ===== PLOT VISUALIZATION =====

interface PlotVisualizationProps {
  plot: Plot;
  compact?: boolean;
  showCrops?: boolean;
  cropStage?: 1 | 2 | 3;
}

/**
 * Land plot visualization with crops
 */
export function PlotVisualization({ plot, compact = false, showCrops = true, cropStage = 2 }: PlotVisualizationProps) {
  const cols = compact ? 5 : 6;
  const rows = compact ? 4 : 5;

  return (
    <div className="plot-visualization border-2 border-[#0b1209] bg-[#5ca545] p-2">
      <div
        className="relative overflow-hidden border-2 border-[#0b1209]"
        style={{ height: compact ? 128 : 160 }}
      >
        <div
          className="absolute inset-0 grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, 32px)`,
            gridTemplateRows: `repeat(${rows}, 32px)`,
          }}
        >
          {Array.from({ length: cols * rows }).map((_, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            const isPath = row >= Math.floor(rows / 2) || col <= 1;

            return (
              <TerrainTile
                key={index}
                kind={isPath ? "dirtPath" : "grass"}
                variant={(index * 7) % 12}
                scale={2}
              />
            );
          })}
        </div>

        {showCrops && (
          <div className="absolute bottom-4 right-4">
            <CropBed
              cols={3}
              rows={compact ? 2 : 3}
              crops={compact ? 5 : 8}
              cropStage={cropStage}
              soil={plot.id === "poor" ? "dark" : "dry"}
              scale={1}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ===== GLOBAL STYLES =====

/**
 * Inject pixel-perfect CSS styles
 */
export function PixelStyles() {
  return (
    <style jsx global>{`
      .pixelated,
      .sprite-container,
      .sprite-inner {
        image-rendering: pixelated;
        image-rendering: -moz-crisp-edges;
        image-rendering: -webkit-optimize-contrast;
      }

      @keyframes walkPixel {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-4px); }
      }

      @keyframes sparkle {
        0%, 100% { opacity: 0; transform: scale(0.8) rotate(0deg); }
        50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
    `}</style>
  );
}
