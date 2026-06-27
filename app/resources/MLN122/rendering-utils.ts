/**
 * Rendering Utilities
 * Z-index layering, y-sorting, and visual ordering utilities
 */

/**
 * Z-index layers for consistent rendering order
 */
export const Z_LAYERS = {
  BACKGROUND: 1,
  TERRAIN_BACKGROUND: 5,
  TERRAIN_DECORATIONS: 8,
  BUILDINGS_BACK: 10,
  CROPS: 15,
  CHARACTERS_BASE: 20,
  CHARACTERS_DYNAMIC: 25, // Y-sorted characters
  BUILDINGS_FRONT: 27,
  EFFECTS: 30,
  TERRAIN_FOREGROUND: 32,
  UI_ELEMENTS: 35,
  OVERLAY: 40,
  MODAL: 50,
} as const;

export type ZLayer = typeof Z_LAYERS[keyof typeof Z_LAYERS];

/**
 * Calculate z-index for y-sorted objects
 * Objects further down (higher y) should render in front
 */
export function calculateYSortedZIndex(
  yPosition: number,
  baseLayer: ZLayer = Z_LAYERS.CHARACTERS_BASE
): number {
  // Normalize y to 0-100 range and add to base layer
  // This gives us fine-grained control within a layer
  const yOffset = Math.floor((yPosition / 1000) * 100);
  return baseLayer + yOffset;
}

/**
 * Position object for y-sorting
 */
export interface PositionedObject {
  id: string;
  x: number;
  y: number;
  element: React.ReactNode;
  layer?: ZLayer;
}

/**
 * Sort objects by Y position for correct rendering order
 */
export function sortByYPosition(objects: PositionedObject[]): PositionedObject[] {
  return [...objects].sort((a, b) => {
    // First sort by layer if specified
    if (a.layer !== undefined && b.layer !== undefined && a.layer !== b.layer) {
      return a.layer - b.layer;
    }
    // Then sort by y position
    return a.y - b.y;
  });
}

/**
 * Shadow configuration based on object type and position
 */
export interface ShadowConfig {
  width: number;
  height: number;
  opacity: number;
  blur: number;
  offsetY: number;
}

export function getShadowConfig(
  objectType: "character" | "building" | "object",
  yPosition: number
): ShadowConfig {
  const baseConfigs: Record<string, ShadowConfig> = {
    character: {
      width: 16,
      height: 8,
      opacity: 0.3,
      blur: 2,
      offsetY: -2,
    },
    building: {
      width: 32,
      height: 16,
      opacity: 0.25,
      blur: 4,
      offsetY: -4,
    },
    object: {
      width: 12,
      height: 6,
      opacity: 0.2,
      blur: 2,
      offsetY: -1,
    },
  };

  const config = { ...baseConfigs[objectType] };
  
  // Adjust shadow based on y position (perspective)
  // Objects further back (lower y) have smaller, lighter shadows
  const perspectiveFactor = Math.min(1, yPosition / 500);
  config.opacity *= 0.5 + perspectiveFactor * 0.5;
  config.blur *= 0.7 + perspectiveFactor * 0.3;

  return config;
}

/**
 * Render layer helper - wraps content with proper z-index
 */
export function getRenderStyle(layer: ZLayer, yPosition?: number): React.CSSProperties {
  const zIndex = yPosition !== undefined
    ? calculateYSortedZIndex(yPosition, layer)
    : layer;

  return {
    zIndex,
    position: "absolute",
  };
}

/**
 * Grid position to pixel coordinates converter
 */
export interface GridPosition {
  row: number;
  col: number;
}

export interface PixelPosition {
  x: number;
  y: number;
}

export function gridToPixel(
  grid: GridPosition,
  tileSize: number,
  offset: PixelPosition = { x: 0, y: 0 }
): PixelPosition {
  return {
    x: grid.col * tileSize + offset.x,
    y: grid.row * tileSize + offset.y,
  };
}

/**
 * Pixel coordinates to grid position converter
 */
export function pixelToGrid(
  pixel: PixelPosition,
  tileSize: number,
  offset: PixelPosition = { x: 0, y: 0 }
): GridPosition {
  return {
    row: Math.floor((pixel.y - offset.y) / tileSize),
    col: Math.floor((pixel.x - offset.x) / tileSize),
  };
}

/**
 * Check if object is within viewport bounds
 */
export function isInViewport(
  position: PixelPosition,
  objectSize: { width: number; height: number },
  viewport: { width: number; height: number }
): boolean {
  return (
    position.x + objectSize.width > 0 &&
    position.x < viewport.width &&
    position.y + objectSize.height > 0 &&
    position.y < viewport.height
  );
}

/**
 * Render order groups for batch rendering
 */
export const RENDER_ORDER = [
  "background",
  "terrain",
  "shadows",
  "buildings",
  "crops",
  "characters",
  "effects",
  "ui",
] as const;

export type RenderGroup = typeof RENDER_ORDER[number];

/**
 * Get render order priority (lower = rendered first)
 */
export function getRenderPriority(group: RenderGroup): number {
  return RENDER_ORDER.indexOf(group);
}

/**
 * Depth-based opacity calculator for atmospheric perspective
 */
export function calculateDepthOpacity(
  yPosition: number,
  maxY: number,
  minOpacity: number = 0.3,
  maxOpacity: number = 1
): number {
  const depth = yPosition / maxY;
  return minOpacity + (maxOpacity - minOpacity) * depth;
}

/**
 * Scale based on depth for pseudo-3D perspective
 */
export function calculateDepthScale(
  yPosition: number,
  maxY: number,
  minScale: number = 0.6,
  maxScale: number = 1
): number {
  const depth = yPosition / maxY;
  return minScale + (maxScale - minScale) * depth;
}

/**
 * Layered rendering context
 */
export interface LayerContext {
  layer: ZLayer;
  opacity?: number;
  scale?: number;
  ySort?: boolean;
}

/**
 * Create layered rendering context
 */
export function createLayerContext(
  layer: ZLayer,
  options: Partial<LayerContext> = {}
): LayerContext {
  return {
    layer,
    opacity: options.opacity ?? 1,
    scale: options.scale ?? 1,
    ySort: options.ySort ?? false,
  };
}

/**
 * Apply render context to style object
 */
export function applyRenderContext(
  context: LayerContext,
  yPosition?: number
): React.CSSProperties {
  const style: React.CSSProperties = {
    zIndex: yPosition !== undefined && context.ySort
      ? calculateYSortedZIndex(yPosition, context.layer)
      : context.layer,
    position: "absolute",
  };

  if (context.opacity !== undefined && context.opacity !== 1) {
    style.opacity = context.opacity;
  }

  if (context.scale !== undefined && context.scale !== 1) {
    style.transform = `scale(${context.scale})`;
    style.transformOrigin = "center bottom";
  }

  return style;
}
