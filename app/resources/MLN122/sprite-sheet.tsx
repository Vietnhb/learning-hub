/**
 * Sprite Sheet Utilities
 * Proper sprite cutting from large sprite sheets
 */

import { getAssetUrl } from "./asset-registry";
import { CSSProperties } from "react";

export interface SpriteConfig {
  /** Sprite sheet file name */
  sheet: string;
  /** Sprite width in pixels */
  width: number;
  /** Sprite height in pixels */
  height: number;
  /** X position in sprite sheet (in sprite units). Use x for pixel-exact sheets. */
  frameX?: number;
  /** Y position in sprite sheet (in sprite units). Use y for pixel-exact sheets. */
  frameY?: number;
  /** Pixel-exact source X coordinate in the sheet */
  x?: number;
  /** Pixel-exact source Y coordinate in the sheet */
  y?: number;
  /** Scale multiplier (default: 1) */
  scale?: number;
  /** Animation frame count (default: 1) */
  frameCount?: number;
  /** Current animation frame (default: 0) */
  currentFrame?: number;
}

/**
 * Extract a single sprite from a sprite sheet
 */
export function Sprite({
  sheet,
  width,
  height,
  frameX,
  frameY,
  x,
  y,
  scale = 1,
  frameCount = 1,
  currentFrame = 0,
  className = "",
  style = {},
}: SpriteConfig & { className?: string; style?: CSSProperties }) {
  const sourceX = x ?? ((frameX ?? 0) * width + currentFrame * width);
  const sourceY = y ?? ((frameY ?? 0) * height);
  
  const spriteStyle: CSSProperties = {
    width: `${width * scale}px`,
    height: `${height * scale}px`,
    overflow: "hidden",
    display: "inline-block",
    imageRendering: "pixelated",
    ...style,
  };

  const innerStyle: CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    transform: `scale(${scale})`,
    transformOrigin: "top left",
    backgroundImage: `url(${getAssetUrl(sheet)})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: `-${sourceX}px -${sourceY}px`,
    imageRendering: "pixelated",
  };

  return (
    <div className={`sprite-container ${className}`} style={spriteStyle}>
      <div className="pixelated" style={innerStyle} />
    </div>
  );
}

// ===== STARDEW VALLEY SPRITE CONFIGURATIONS =====

/**
 * Crops from TileSheets__crops.png
 * Each crop has 5 growth stages arranged horizontally
 * Sprite size: 16x32
 */
export const CROP_SPRITES = {
  // Parsnip (row 0)
  parsnip: (stage: number, scale = 2) => ({
    sheet: "TileSheets__crops.png",
    width: 16,
    height: 32,
    frameX: stage,
    frameY: 0,
    scale,
  }),
  // Wheat (row 2)
  wheat: (stage: number, scale = 2) => ({
    sheet: "TileSheets__crops.png",
    width: 16,
    height: 32,
    frameX: stage,
    frameY: 2,
    scale,
  }),
  // Potato (row 4)
  potato: (stage: number, scale = 2) => ({
    sheet: "TileSheets__crops.png",
    width: 16,
    height: 32,
    frameX: stage,
    frameY: 4,
    scale,
  }),
  // Cauliflower (row 6)
  cauliflower: (stage: number, scale = 2) => ({
    sheet: "TileSheets__crops.png",
    width: 16,
    height: 32,
    frameX: stage,
    frameY: 6,
    scale,
  }),
  // Kale (row 8)
  kale: (stage: number, scale = 2) => ({
    sheet: "TileSheets__crops.png",
    width: 16,
    height: 32,
    frameX: stage,
    frameY: 8,
    scale,
  }),
};

/**
 * Bushes from TileSheets__bushes.png
 * Multiple bush types and growth stages
 * Sprite size: 65x80 (approx) per bush
 */
export const BUSH_SPRITES = {
  small: (scale = 1) => ({
    sheet: "TileSheets__bushes.png",
    width: 32,
    height: 32,
    x: 0,
    y: 0,
    scale,
  }),
  medium: (scale = 1) => ({
    sheet: "TileSheets__bushes.png",
    width: 32,
    height: 32,
    x: 32,
    y: 0,
    scale,
  }),
  large: (scale = 1) => ({
    sheet: "TileSheets__bushes.png",
    width: 64,
    height: 64,
    x: 0,
    y: 96,
    scale,
  }),
};

/**
 * Grass from TerrainFeatures__grass.png
 * Different grass types arranged in rows
 * Sprite size: 16x16
 */
export const GRASS_SPRITES = {
  type1: (variant: number, scale = 1) => ({
    sheet: "TerrainFeatures__grass.png",
    width: 16,
    height: 16,
    x: (variant % 4) * 16,
    y: 0,
    scale,
  }),
  type2: (variant: number, scale = 1) => ({
    sheet: "TerrainFeatures__grass.png",
    width: 16,
    height: 16,
    x: (variant % 4) * 16,
    y: 16,
    scale,
  }),
};

/**
 * Tools from TileSheets__tools.png
 * Grid of 16x16 tool icons
 */
export const TOOL_SPRITES = {
  hoe: (scale = 1) => ({
    sheet: "TileSheets__tools.png",
    width: 16,
    height: 16,
    frameX: 0,
    frameY: 0,
    scale,
  }),
  wateringCan: (scale = 1) => ({
    sheet: "TileSheets__tools.png",
    width: 16,
    height: 16,
    frameX: 8,
    frameY: 0,
    scale,
  }),
  axe: (scale = 1) => ({
    sheet: "TileSheets__tools.png",
    width: 16,
    height: 16,
    frameX: 6,
    frameY: 0,
    scale,
  }),
  pickaxe: (scale = 1) => ({
    sheet: "TileSheets__tools.png",
    width: 16,
    height: 16,
    frameX: 7,
    frameY: 0,
    scale,
  }),
};

/**
 * Craftables from TileSheets__Craftables.png
 * Grid of 16x32 craftable objects
 */
export const CRAFTABLE_SPRITES = {
  chest: (scale = 1) => ({
    sheet: "TileSheets__Craftables.png",
    width: 16,
    height: 32,
    x: 0,
    y: 288,
    scale,
  }),
  furnace: (scale = 1) => ({
    sheet: "TileSheets__Craftables.png",
    width: 16,
    height: 32,
    x: 48,
    y: 0,
    scale,
  }),
  scarecrow: (scale = 1) => ({
    sheet: "TileSheets__Craftables.png",
    width: 16,
    height: 32,
    x: 16,
    y: 0,
    scale,
  }),
  beeHouse: (scale = 1) => ({
    sheet: "TileSheets__Craftables.png",
    width: 16,
    height: 32,
    x: 64,
    y: 32,
    scale,
  }),
  keg: (scale = 1) => ({
    sheet: "TileSheets__Craftables.png",
    width: 16,
    height: 32,
    x: 0,
    y: 384,
    scale,
  }),
  preservesJar: (scale = 1) => ({
    sheet: "TileSheets__Craftables.png",
    width: 16,
    height: 32,
    x: 64,
    y: 384,
    scale,
  }),
};

/**
 * Debris (rocks, twigs, etc.) from TileSheets__debris.png
 * Small decorative objects: 16x16
 */
export const DEBRIS_SPRITES = {
  stone: (scale = 1) => ({
    sheet: "TileSheets__debris.png",
    width: 16,
    height: 16,
    frameX: 0,
    frameY: 0,
    scale,
  }),
  twig: (scale = 1) => ({
    sheet: "TileSheets__debris.png",
    width: 16,
    height: 16,
    frameX: 1,
    frameY: 0,
    scale,
  }),
  weed: (scale = 1) => ({
    sheet: "TileSheets__debris.png",
    width: 16,
    height: 16,
    frameX: 0,
    frameY: 1,
    scale,
  }),
};

/**
 * Critters from TileSheets__critters.png
 * Small animated creatures: varies by critter
 */
export const CRITTER_SPRITES = {
  butterfly: (frame: number, scale = 1) => ({
    sheet: "TileSheets__critters.png",
    width: 16,
    height: 16,
    frameX: frame,
    frameY: 0,
    scale,
    frameCount: 4,
  }),
  frog: (frame: number, scale = 1) => ({
    sheet: "TileSheets__critters.png",
    width: 16,
    height: 16,
    frameX: frame,
    frameY: 2,
    scale,
    frameCount: 3,
  }),
  squirrel: (frame: number, scale = 1) => ({
    sheet: "TileSheets__critters.png",
    width: 16,
    height: 16,
    frameX: frame,
    frameY: 4,
    scale,
    frameCount: 2,
  }),
};

/**
 * Birds from LooseSprites__birds.png
 * Flying birds: 16x16 each
 */
export const BIRD_SPRITES = {
  bird1: (frame: number, scale = 1) => ({
    sheet: "LooseSprites__birds.png",
    width: 16,
    height: 16,
    frameX: frame,
    frameY: 0,
    scale,
    frameCount: 4,
  }),
  bird2: (frame: number, scale = 1) => ({
    sheet: "LooseSprites__birds.png",
    width: 16,
    height: 16,
    frameX: frame,
    frameY: 1,
    scale,
    frameCount: 4,
  }),
};

/**
 * Hoedirt (tilled soil) from TerrainFeatures__hoeDirt.png
 * Different states of tilled soil: 16x16
 */
export const HOEDIRT_SPRITES = {
  dry: (variant: number, scale = 1) => ({
    sheet: "TerrainFeatures__hoeDirt.png",
    width: 16,
    height: 16,
    frameX: variant % 4,
    frameY: 0,
    scale,
  }),
  watered: (variant: number, scale = 1) => ({
    sheet: "TerrainFeatures__hoeDirt.png",
    width: 16,
    height: 16,
    frameX: variant % 4,
    frameY: 1,
    scale,
  }),
};

/**
 * Fences from LooseSprites__FenceX.png
 * Note: These are individual files, not sprite sheets
 */
export const FENCE_SPRITES = {
  wood: (scale = 1) => ({
    sheet: "LooseSprites__Fence1.png",
    width: 16,
    height: 32,
    frameX: 0,
    frameY: 0,
    scale,
  }),
  stone: (scale = 1) => ({
    sheet: "LooseSprites__Fence2.png",
    width: 16,
    height: 32,
    frameX: 0,
    frameY: 0,
    scale,
  }),
  iron: (scale = 1) => ({
    sheet: "LooseSprites__Fence3.png",
    width: 16,
    height: 32,
    frameX: 0,
    frameY: 0,
    scale,
  }),
  hardwood: (scale = 1) => ({
    sheet: "LooseSprites__Fence5.png",
    width: 16,
    height: 32,
    frameX: 0,
    frameY: 0,
    scale,
  }),
};

/**
 * Generic sprite extractor with intelligent defaults
 */
export function SpriteFromSheet({
  sheet,
  spriteWidth = 16,
  spriteHeight = 16,
  row = 0,
  col = 0,
  scale = 1,
  className = "",
}: {
  sheet: string;
  spriteWidth?: number;
  spriteHeight?: number;
  row?: number;
  col?: number;
  scale?: number;
  className?: string;
}) {
  return (
    <Sprite
      sheet={sheet}
      width={spriteWidth}
      height={spriteHeight}
      frameX={col}
      frameY={row}
      scale={scale}
      className={className}
    />
  );
}
