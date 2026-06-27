/**
 * Depth Decorations
 * Additional visual elements to create depth, atmosphere, and polish
 * PROPERLY CUTS SPRITES FROM SPRITE SHEETS
 */

import React from "react";
import { getAssetUrl } from "./asset-registry";
import { Z_LAYERS, calculateDepthOpacity } from "./rendering-utils";
import { motion } from "framer-motion";
import {
  Sprite,
  CROP_SPRITES,
  BUSH_SPRITES,
  GRASS_SPRITES,
  TOOL_SPRITES,
  CRAFTABLE_SPRITES,
  DEBRIS_SPRITES,
  CRITTER_SPRITES,
  BIRD_SPRITES,
  HOEDIRT_SPRITES,
  FENCE_SPRITES,
} from "./sprite-sheet";

// ===== BIRDS & CRITTERS (Animated ambiance) =====

interface BirdsProps {
  count?: number;
  animated?: boolean;
}

export function FlyingBirds({ count = 3, animated = true }: BirdsProps) {
  return (
    <div className="flying-birds-container">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${20 + i * 25}%`,
            top: `${10 + i * 5}%`,
            zIndex: Z_LAYERS.EFFECTS,
          }}
          animate={animated ? {
            x: [0, 100, 200],
            y: [0, -10, -5],
          } : {}}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            delay: i * 1.5,
          }}
        >
          <Sprite {...BIRD_SPRITES.bird1(i % 4, 1.5)} />
        </motion.div>
      ))}
    </div>
  );
}

// ===== BUSHES (Foreground and background depth) =====

interface BushProps {
  variant?: number;
  scale?: number;
  depth?: "foreground" | "background";
}

export function Bush({ variant = 0, scale = 1, depth = "background" }: BushProps) {
  const opacity = depth === "background" ? 0.6 : 1;
  const zIndex = depth === "background" ? Z_LAYERS.TERRAIN_DECORATIONS : Z_LAYERS.TERRAIN_FOREGROUND;

  const bushType = variant === 0 ? "small" : variant === 1 ? "medium" : "large";

  return (
    <div
      className="bush-sprite relative inline-block"
      style={{
        opacity,
        zIndex,
      }}
    >
      <Sprite {...BUSH_SPRITES[bushType](scale)} />
    </div>
  );
}

// ===== FENCES (Adds structure and boundaries) =====

interface FenceProps {
  type?: 1 | 2 | 3 | 5;
  length?: number;
  direction?: "horizontal" | "vertical";
}

export function Fence({ type = 1, length = 5, direction = "horizontal" }: FenceProps) {
  const fenceType = type === 1 ? "wood" : type === 2 ? "stone" : type === 3 ? "iron" : "hardwood";
  
  return (
    <div
      className="fence-section flex"
      style={{
        flexDirection: direction === "horizontal" ? "row" : "column",
        zIndex: Z_LAYERS.TERRAIN_DECORATIONS,
      }}
    >
      {Array.from({ length }).map((_, i) => (
        <div key={i} className="fence-piece">
          <Sprite {...FENCE_SPRITES[fenceType](1)} />
        </div>
      ))}
    </div>
  );
}

// ===== GRASS PATCHES (Ground detail) =====

interface GrassPatchProps {
  density?: "sparse" | "normal" | "dense";
  width?: number;
}

export function GrassPatch({ density = "normal", width = 100 }: GrassPatchProps) {
  const count = density === "sparse" ? 3 : density === "dense" ? 8 : 5;
  
  return (
    <div
      className="grass-patch relative"
      style={{
        width: `${width}px`,
        height: "24px",
        zIndex: Z_LAYERS.TERRAIN_DECORATIONS,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${(i / count) * 100}%`,
            bottom: 0,
          }}
        >
          <Sprite {...GRASS_SPRITES.type1(i, 1)} />
        </div>
      ))}
    </div>
  );
}

// ===== FLOORING & PATHS =====

interface PathProps {
  length?: number;
  width?: number;
  type?: "stone" | "wood" | "brick";
}

export function FarmPath({ length = 5, width = 2, type = "stone" }: PathProps) {
  return (
    <div
      className="farm-path grid gap-px"
      style={{
        gridTemplateColumns: `repeat(${length}, 16px)`,
        gridTemplateRows: `repeat(${width}, 16px)`,
        zIndex: Z_LAYERS.TERRAIN_BACKGROUND,
      }}
    >
      {Array.from({ length: length * width }).map((_, i) => (
        <div
          key={i}
          className="path-tile"
          style={{
            width: "16px",
            height: "16px",
            backgroundColor: type === "stone" ? "#8b7355" : type === "wood" ? "#a0826d" : "#9a8478",
            border: "1px solid rgba(0,0,0,0.15)",
          }}
        />
      ))}
    </div>
  );
}

// ===== DEBRIS & DETAILS (Rocks, sticks, etc.) =====

interface DebrisProps {
  type?: "rock" | "stick" | "stone" | "twig";
  scale?: number;
}

export function Debris({ type = "rock", scale = 1 }: DebrisProps) {
  const debrisType = type === "rock" || type === "stone" ? "stone" : "twig";
  
  return (
    <div
      className="debris-sprite inline-block"
      style={{
        zIndex: Z_LAYERS.TERRAIN_DECORATIONS,
      }}
    >
      <Sprite {...DEBRIS_SPRITES[debrisType](scale)} />
    </div>
  );
}

// ===== CRAFTABLES (Hay bales, crates, decorative items) =====

interface CraftableProps {
  type: "hay_bale" | "crate" | "barrel" | "chest";
  scale?: number;
}

export function Craftable({ type, scale = 1 }: CraftableProps) {
  // Map our type names to sprite names
  const spriteMap = {
    hay_bale: "chest", // Placeholder
    crate: "chest",
    barrel: "keg",
    chest: "chest",
  };

  const spriteType = spriteMap[type];

  return (
    <div
      className="craftable-item inline-block"
      style={{
        zIndex: Z_LAYERS.BUILDINGS_BACK,
      }}
    >
      <Sprite {...CRAFTABLE_SPRITES[spriteType as keyof typeof CRAFTABLE_SPRITES](scale)} />
    </div>
  );
}

// ===== LIGHT RAYS (Atmospheric effect) =====

export function LightRays({ opacity = 0.3 }: { opacity?: number }) {
  return (
    <div
      className="light-rays absolute inset-0"
      style={{
        zIndex: Z_LAYERS.EFFECTS,
        pointerEvents: "none",
      }}
    >
      <img
        src={getAssetUrl("LooseSprites__LightRays.png")}
        alt=""
        className="h-full w-full object-cover pixelated"
        style={{
          opacity,
          mixBlendMode: "soft-light",
        }}
      />
    </div>
  );
}

// ===== CLOUDS (Moving background) =====

export function MovingClouds({ animated = true }: { animated?: boolean }) {
  return (
    <div className="moving-clouds absolute inset-0" style={{ zIndex: Z_LAYERS.BACKGROUND }}>
      <motion.div
        className="cloud-layer absolute inset-0"
        animate={animated ? { x: [-100, 0, 100] } : {}}
        transition={{
          duration: 60,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
        }}
      >
        {/* Render cloud shapes using CSS or simple shapes */}
        <div className="absolute left-[10%] top-[15%] h-8 w-16 rounded-full bg-white/20 blur-sm" />
        <div className="absolute left-[25%] top-[20%] h-6 w-12 rounded-full bg-white/15 blur-sm" />
        <div className="absolute left-[45%] top-[12%] h-10 w-20 rounded-full bg-white/18 blur-sm" />
        <div className="absolute left-[70%] top-[18%] h-7 w-14 rounded-full bg-white/16 blur-sm" />
      </motion.div>
    </div>
  );
}

// ===== ATMOSPHERIC FOG (Depth effect) =====

export function AtmosphericFog({ intensity = "light" }: { intensity?: "light" | "medium" | "heavy" }) {
  const opacityMap = {
    light: 0.1,
    medium: 0.2,
    heavy: 0.35,
  };

  return (
    <div
      className="atmospheric-fog absolute inset-0 pointer-events-none"
      style={{
        zIndex: Z_LAYERS.OVERLAY - 5,
        background: `linear-gradient(to top, rgba(255,255,255,${opacityMap[intensity]}) 0%, transparent 60%)`,
      }}
    />
  );
}

// ===== PLOT BORDER (Adds definition to farm plots) =====

export function PlotBorder({ width = 200, height = 120 }: { width?: number; height?: number }) {
  return (
    <div
      className="plot-border absolute"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        border: "3px solid rgba(11, 18, 9, 0.4)",
        borderRadius: "2px",
        zIndex: Z_LAYERS.TERRAIN_DECORATIONS,
        boxShadow: "inset 0 0 8px rgba(0,0,0,0.2)",
      }}
    />
  );
}

// ===== TOOL SPRITES (Visual interest) =====

interface ToolSpriteProps {
  tool: "hoe" | "watering_can" | "axe" | "pickaxe";
  scale?: number;
}

export function ToolSprite({ tool, scale = 1 }: ToolSpriteProps) {
  const toolMap = {
    hoe: "hoe",
    watering_can: "wateringCan",
    axe: "axe",
    pickaxe: "pickaxe",
  };

  return (
    <div
      className="tool-sprite inline-block"
      style={{
        zIndex: Z_LAYERS.EFFECTS,
      }}
    >
      <Sprite {...TOOL_SPRITES[toolMap[tool] as keyof typeof TOOL_SPRITES](scale)} />
    </div>
  );
}

// ===== WELL (Decorative building) =====

export function Well({ scale = 1 }: { scale?: number }) {
  return (
    <div
      className="well-building inline-block"
      style={{
        transform: `scale(${scale})`,
        zIndex: Z_LAYERS.BUILDINGS_BACK,
      }}
    >
      <img
        src={getAssetUrl("Buildings__Well.png")}
        alt="Well"
        className="pixelated h-20 w-16 object-contain drop-shadow-[2px_2px_0_rgba(11,18,9,0.5)]"
      />
    </div>
  );
}

// ===== MAILBOX (Village detail) =====

export function Mailbox({ scale = 1 }: { scale?: number }) {
  return (
    <div
      className="mailbox inline-block"
      style={{
        transform: `scale(${scale})`,
        zIndex: Z_LAYERS.BUILDINGS_FRONT,
      }}
    >
      <img
        src={getAssetUrl("Buildings__Mailbox.png")}
        alt="Mailbox"
        className="pixelated h-12 w-8 object-contain"
      />
    </div>
  );
}

// ===== CRITTERS (Animated small animals) =====

interface CritterProps {
  type?: "butterfly" | "frog" | "squirrel";
  animated?: boolean;
}

export function Critter({ type = "butterfly", animated = true }: CritterProps) {
  const [frame, setFrame] = React.useState(0);

  React.useEffect(() => {
    if (!animated) return;
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % (type === "butterfly" ? 4 : type === "frog" ? 3 : 2));
    }, 200);
    return () => clearInterval(interval);
  }, [animated, type]);

  return (
    <motion.div
      className="critter-sprite inline-block"
      style={{
        zIndex: Z_LAYERS.EFFECTS,
      }}
      animate={animated ? {
        y: type === "butterfly" ? [0, -10, 0] : [0, -5, 0],
        x: type === "butterfly" ? [0, 10, 0] : [0, 5, 0],
      } : {}}
      transition={{
        duration: type === "butterfly" ? 2 : 3,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      }}
    >
      <Sprite {...CRITTER_SPRITES[type](frame, 1)} />
    </motion.div>
  );
}
