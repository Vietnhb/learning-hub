/**
 * Character Composer
 * Layered character system with CORRECT sprite sheet cutting
 */

import { getAssetUrl } from "./asset-registry";
import { CSSProperties } from "react";

// ===== CHARACTER SPRITE STRUCTURE =====

/**
 * IMPORTANT: Sprite sheet structures
 * 
 * farmer_base.png & farmer_girl_base.png:
 * - Total size: 96px wide × 128px tall
 * - Grid: 6 columns × 4 rows
 * - Each sprite: 16px wide × 32px tall
 * - Layout: Each row = 1 animation, columns = different frames/directions
 * - We use: Row 0 (standing down), Column 0 (frame 0)
 * 
 * shirts.png:
 * - Total size: 128px wide × 32px tall (each shirt row)
 * - Grid: 8 columns × 4 rows (per shirt set)
 * - Each sprite: 16px wide × 32px tall
 * - Layout: Each shirt has 4 animation frames × 4 directions = 16 sprites
 * - Shirts are stacked vertically, each shirt = 128px tall block
 * - To get shirt N: offsetY = N × 128px, then same column layout as base
 * 
 * pants.png:
 * - Total size: 192px wide × 688px tall (total)
 * - Each pants style: 192px wide × 4px tall block
 * - Layout: 4 direction sprites (16px each) × 4 frames = 16 sprites per pants
 * - Grid per pants: 12 columns (3 sets of 4 directions) × variable rows
 * - To get pants N: offsetY = complex calculation based on row position
 */

export type CharacterDirection = "down" | "right" | "up" | "left";
export type CharacterGender = "male" | "female";

interface CharacterFrame {
  direction: CharacterDirection;
  frame: number; // 0-3
}

// Direction to column mapping for base character
const DIRECTION_COLS = {
  down: 0,
  right: 1,
  up: 2,
  left: 3,
};

/**
 * Get sprite position for base character (standing pose, down direction)
 */
function getBaseSpritePosition() {
  // Always use standing down pose (column 0, row 0)
  return {
    x: 0,
    y: 0,
  };
}

/**
 * Get sprite position for shirt
 * Shirts are stacked vertically, each shirt set is 128px tall
 */
function getShirtSpritePosition(shirtIndex: number) {
  // Each shirt occupies 128px height (4 rows × 32px)
  // We want the standing down pose from each shirt
  return {
    x: (shirtIndex % 16) * 16,
    y: Math.floor(shirtIndex / 16) * 32,
  };
}

/**
 * Get sprite position for pants
 * Pants sheet is complex - multiple pants per row
 */
function getPantsSpritePosition(pantsIndex: number) {
  // Pants sheet structure: 12 columns × many rows
  // Each row contains 3 complete pants (4 directions each)
  // So: pantsIndex 0,1,2 = row 0; pantsIndex 3,4,5 = row 1, etc.
  
  const row = pantsIndex;
  
  return {
    x: 0,
    y: row * 32,
  };
}

// ===== LAYERED CHARACTER COMPONENT =====

interface LayeredCharacterProps {
  gender?: CharacterGender;
  shirtIndex?: number; // 0-111 (shirts.png has 112 shirts)
  pantsIndex?: number; // 0-42 (pants.png structure)
  hatIndex?: number;
  scale?: number;
  className?: string;
}

/**
 * Layered character with base, pants, and shirt
 * Uses CSS clip/overflow to show ONLY the 16×32 sprite needed
 */
export function LayeredCharacter({
  gender = "male",
  shirtIndex = 0,
  pantsIndex = 0,
  hatIndex,
  scale = 2.5,
  className = "",
}: LayeredCharacterProps) {
  const baseFile = gender === "male" 
    ? "Characters__Farmer__farmer_base.png"
    : "Characters__Farmer__farmer_girl_base.png";

  const basePos = getBaseSpritePosition();
  const shirtPos = getShirtSpritePosition(shirtIndex);
  const pantsPos = getPantsSpritePosition(pantsIndex);
  const hatPos = typeof hatIndex === "number"
    ? { x: (hatIndex % 12) * 20, y: Math.floor(hatIndex / 12) * 20 }
    : null;

  // Container clips to exactly 16×32 (scaled)
  const containerStyle: CSSProperties = {
    width: 16 * scale,
    height: 32 * scale,
    position: "relative",
    display: "inline-block",
    overflow: "visible",
  };

  // Each layer: absolute positioned, clipped to container
  const layerStyle: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: 16 * scale,
    height: 32 * scale,
    overflow: "hidden",
  };

  const spriteLayerStyle = (
    file: string,
    offsetX: number,
    offsetY: number,
    width = 16,
    height = 32,
  ): CSSProperties => ({
    display: "block",
    width,
    height,
    transform: `scale(${scale})`,
    transformOrigin: "top left",
    backgroundImage: `url(${getAssetUrl(file)})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: `-${offsetX}px -${offsetY}px`,
    imageRendering: "pixelated",
  });

  return (
    <div className={`layered-character ${className}`} style={containerStyle}>
      {/* Layer 1: Base body */}
      <div className="character-layer-base" style={layerStyle}>
        <span style={spriteLayerStyle(baseFile, basePos.x, basePos.y)} />
      </div>

      {/* Layer 2: Pants */}
      <div className="character-layer-pants" style={layerStyle}>
        <span style={spriteLayerStyle("Characters__Farmer__pants.png", pantsPos.x, pantsPos.y)} />
      </div>

      {/* Layer 3: Shirt */}
      <div className="character-layer-shirt" style={layerStyle}>
        <span style={spriteLayerStyle("Characters__Farmer__shirts.png", shirtPos.x, shirtPos.y)} />
      </div>

      {hatPos && (
        <div
          className="character-layer-hat"
          style={{
            position: "absolute",
            top: -6 * scale,
            left: -2 * scale,
            width: 20 * scale,
            height: 20 * scale,
            overflow: "hidden",
          }}
        >
          <span style={spriteLayerStyle("Characters__Farmer__hats.png", hatPos.x, hatPos.y, 20, 20)} />
        </div>
      )}
    </div>
  );
}

// ===== UTILITY TESTING =====

/**
 * Test grid to verify sprite cutting
 */
export function CharacterTestGrid() {
  return (
    <div className="grid grid-cols-6 gap-4 p-4 bg-[#20361d] border-4 border-[#0b1209]">
      <div className="text-center">
        <LayeredCharacter gender="male" shirtIndex={0} pantsIndex={0} scale={2} />
        <p className="text-xs text-white mt-1">M S0 P0</p>
      </div>
      <div className="text-center">
        <LayeredCharacter gender="female" shirtIndex={0} pantsIndex={0} scale={2} />
        <p className="text-xs text-white mt-1">F S0 P0</p>
      </div>
      <div className="text-center">
        <LayeredCharacter gender="male" shirtIndex={1} pantsIndex={1} scale={2} />
        <p className="text-xs text-white mt-1">M S1 P1</p>
      </div>
      <div className="text-center">
        <LayeredCharacter gender="male" shirtIndex={3} pantsIndex={2} scale={2} />
        <p className="text-xs text-white mt-1">M S3 P2</p>
      </div>
      <div className="text-center">
        <WorkerCharacter gender="male" variant={0} scale={2} />
        <p className="text-xs text-white mt-1">Worker 0</p>
      </div>
      <div className="text-center">
        <WorkerCharacter gender="female" variant={1} scale={2} />
        <p className="text-xs text-white mt-1">Worker 1</p>
      </div>
    </div>
  );
}

/**
 * Simple sprite viewer for debugging
 */
export function SpriteSheetViewer({ 
  sheet, 
  spriteWidth, 
  spriteHeight, 
  row, 
  col, 
  scale = 2 
}: {
  sheet: string;
  spriteWidth: number;
  spriteHeight: number;
  row: number;
  col: number;
  scale?: number;
}) {
  return (
    <div 
      style={{
        width: spriteWidth * scale,
        height: spriteHeight * scale,
        overflow: "hidden",
        border: "2px solid red",
        display: "inline-block",
        imageRendering: "pixelated",
      }}
    >
      <img
        src={getAssetUrl(sheet)}
        alt=""
        style={{
          display: "block",
          position: "relative",
          left: -(col * spriteWidth * scale),
          top: -(row * spriteHeight * scale),
          imageRendering: "pixelated",
        }}
        draggable={false}
      />
    </div>
  );
}

// ===== PRESET CHARACTER TYPES =====

/**
 * Worker character with work clothes
 */
export function WorkerCharacter({
  gender = "male",
  variant = 0,
  scale = 2.5,
  animated = false,
}: {
  gender?: CharacterGender;
  variant?: number;
  scale?: number;
  animated?: boolean;
}) {
  const workerPresets = [
    { shirt: "#2f6fb4", pants: "#315a8f", hat: 4 },
    { shirt: "#2f8a56", pants: "#61442e", hat: 0 },
    { shirt: "#b85739", pants: "#315a8f", hat: 4 },
    { shirt: "#d0a03f", pants: "#5c5f66", hat: 0 },
  ];

  const preset = workerPresets[variant % workerPresets.length];

  const containerStyle: CSSProperties = animated ? {
    animation: "walkPixel 1.4s ease-in-out infinite",
    animationDelay: `${variant * 0.2}s`,
  } : {};

  return (
    <div style={containerStyle}>
      <FarmWorkerAvatar
        gender={gender}
        shirtColor={preset.shirt}
        pantsColor={preset.pants}
        hatIndex={preset.hat}
        scale={scale}
      />
    </div>
  );
}

function FarmWorkerAvatar({
  gender,
  shirtColor,
  pantsColor,
  hatIndex,
  scale,
}: {
  gender: CharacterGender;
  shirtColor: string;
  pantsColor: string;
  hatIndex: number;
  scale: number;
}) {
  const baseFile = gender === "male"
    ? "Characters__Farmer__farmer_base.png"
    : "Characters__Farmer__farmer_girl_base.png";
  const hatPos = { x: (hatIndex % 12) * 20, y: Math.floor(hatIndex / 12) * 20 };
  const px = (value: number) => value * scale;

  const pixelBlock = (
    left: number,
    top: number,
    width: number,
    height: number,
    color: string,
    extra: CSSProperties = {},
  ): CSSProperties => ({
    position: "absolute",
    left: px(left),
    top: px(top),
    width: px(width),
    height: px(height),
    backgroundColor: color,
    imageRendering: "pixelated",
    ...extra,
  });

  return (
    <div
      className="farm-worker-avatar relative"
      style={{
        width: px(16),
        height: px(32),
        overflow: "visible",
        imageRendering: "pixelated",
      }}
    >
      <span
        style={{
          position: "absolute",
          inset: 0,
          display: "block",
          width: 16,
          height: 32,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          backgroundImage: `url(${getAssetUrl(baseFile)})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "0 0",
          imageRendering: "pixelated",
        }}
      />

      <span style={pixelBlock(4, 12, 8, 8, shirtColor)} />
      <span style={pixelBlock(3, 13, 2, 6, shirtColor)} />
      <span style={pixelBlock(11, 13, 2, 6, shirtColor)} />
      <span style={pixelBlock(5, 19, 6, 3, pantsColor)} />
      <span style={pixelBlock(5, 22, 3, 7, pantsColor)} />
      <span style={pixelBlock(9, 22, 3, 7, pantsColor)} />
      <span style={pixelBlock(6, 12, 1, 8, pantsColor, { opacity: 0.9 })} />
      <span style={pixelBlock(10, 12, 1, 8, pantsColor, { opacity: 0.9 })} />

      <span
        style={{
          position: "absolute",
          left: px(-2),
          top: px(-6),
          display: "block",
          width: 20,
          height: 20,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          backgroundImage: `url(${getAssetUrl("Characters__Farmer__hats.png")})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: `-${hatPos.x}px -${hatPos.y}px`,
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}

/**
 * Manager character with professional attire
 */
export function ManagerCharacter({
  scale = 2.5,
}: {
  scale?: number;
}) {
  return (
    <LayeredCharacter
      gender="male"
      shirtIndex={10} // Formal shirt
      pantsIndex={8}  // Dress pants
      scale={scale}
    />
  );
}

/**
 * Landlord character with wealthy appearance
 */
export function LandlordCharacter({
  scale = 2.5,
}: {
  scale?: number;
}) {
  return (
    <LayeredCharacter
      gender="male"
      shirtIndex={15} // Fancy shirt
      pantsIndex={10} // Formal pants
      scale={scale}
    />
  );
}

/**
 * Capitalist character (player)
 */
export function CapitalistCharacter({
  scale = 2.5,
}: {
  scale?: number;
}) {
  return (
    <LayeredCharacter
      gender="male"
      shirtIndex={8}  // Business casual
      pantsIndex={5}  // Nice pants
      scale={scale}
    />
  );
}

// ===== ANIMATED WORKER GROUP =====

interface WorkerGroupProps {
  count: number;
  gender?: CharacterGender;
  scale?: number;
  animated?: boolean;
}

/**
 * Group of workers with variety
 */
export function WorkerGroup({
  count,
  gender = "male",
  scale = 2.5,
  animated = true,
}: WorkerGroupProps) {
  return (
    <div className="worker-group flex gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <WorkerCharacter
          key={i}
          gender={i % 2 === 0 ? "male" : "female"}
          variant={i}
          scale={scale}
          animated={animated}
        />
      ))}
    </div>
  );
}

// ===== SHIRT & PANTS REFERENCE =====

/**
 * Shirts sprite sheet structure:
 * - Grid: 8px width per shirt × 128px height (4 directions × 32px)
 * - Total: 112 shirts (columns 0-111)
 * - Each shirt shows in 4 directions aligned with base character
 */

export const SHIRT_PRESETS = {
  // Basic shirts (0-9)
  blue: 0,
  red: 1,
  purple: 2,
  green: 3,
  white: 4,
  yellow: 5,
  orange: 6,
  teal: 7,
  
  // Work shirts (10-19)
  business: 8,
  plaid: 9,
  formal: 10,
  vest: 11,
  
  // Special (20+)
  farmer: 20,
  miner: 21,
  fisher: 22,
};

/**
 * Pants sprite sheet structure:
 * - Grid: 192px width per pants × 688px height
 * - Total: 154 pants styles
 * - Each pants set: 192px wide (4 directions × 48px per sprite frame)
 */

export const PANTS_PRESETS = {
  // Basic pants (0-9)
  brown: 0,
  gray: 1,
  blue: 2,
  green: 3,
  tan: 4,
  black: 5,
  
  // Formal (6-12)
  dress: 8,
  suit: 10,
  
  // Work pants (13+)
  jeans: 15,
  overalls: 20,
};

// ===== UTILITY: CHARACTER PREVIEW GRID =====

/**
 * Preview grid for testing character combinations
 */
export function CharacterPreviewGrid() {
  return (
    <div className="character-preview-grid grid grid-cols-4 gap-4 p-4 bg-[#20361d] border-4 border-[#0b1209]">
      {[0, 1, 2, 3].map((shirt) => (
        <div key={shirt} className="text-center">
          <LayeredCharacter
            gender="male"
            shirtIndex={shirt}
            pantsIndex={shirt}
            scale={2}
          />
          <p className="mt-1 text-xs text-white">Shirt {shirt}</p>
        </div>
      ))}
    </div>
  );
}
