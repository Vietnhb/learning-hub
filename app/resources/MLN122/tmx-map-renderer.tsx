/**
 * TMX Map Renderer
 *
 * Parses .tmx (XML) files and renders tiles using the actual
 * tilesheet PNG images via CSS background-position clipping.
 *
 * Supports all 7 Stardew Valley farm map types.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { FARM_TMX_PATHS, MLN122_TILESET_BASE } from "./asset-paths";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TmxTileset {
  firstgid: number;
  name: string;
  tilewidth: number;
  tileheight: number;
  columns: number;
  tilecount: number;
  imageSource: string; // Original source from TMX
  imagePath: string;   // URL we'll use to load
  imageWidth: number;
  imageHeight: number;
}

export interface TmxLayer {
  id: number;
  name: string;
  width: number;
  height: number;
  data: number[]; // Global tile IDs (0 = empty)
}

export interface ParsedTmxMap {
  width: number;
  height: number;
  tilewidth: number;
  tileheight: number;
  tilesets: TmxTileset[];
  layers: TmxLayer[];
}

// ─── Tilesheet mapping ────────────────────────────────────────────────────────
// Maps the "source" field from TMX <tileset><image> to our public asset URLs.
// The TMX files reference tilesheets by base name (no extension, relative path).

const TILESHEET_BASE = MLN122_TILESET_BASE;

/** Map from the tileset "source" attribute (lowercase, no extension) → public URL + dimensions */
const TILESET_IMAGE_MAP: Record<string, { url: string; width: number; height: number }> = {
  // Farm.tmx / Farm_*.tmx share the same tilesheets
  spring_outdoortilesheet_extra:     { url: `${TILESHEET_BASE}/Maps__spring_outdoorTileSheet_extra.png`, width: 128,  height: 128  },
  paths:                             { url: `${TILESHEET_BASE}/Maps__paths.png`,                         width: 64,   height: 256  },
  spring_outdoorstilesheet:          { url: `${TILESHEET_BASE}/Maps__spring_outdoorsTileSheet.png`,      width: 400,  height: 1264 },
  "untitled tile sheet":             { url: `${TILESHEET_BASE}/Maps__spring_outdoorsTileSheet.png`,      width: 400,  height: 1264 },
  spring_outdoorstilesheet2:         { url: `${TILESHEET_BASE}/Maps__spring_outdoorsTileSheet2.png`,     width: 256,  height: 1120 },
  spring_island_tilesheet_1:         { url: `${TILESHEET_BASE}/Maps__spring_island_tilesheet_1.png`,    width: 512,  height: 640  },
  spring_waterfalls:                 { url: `${TILESHEET_BASE}/Maps__spring_Waterfalls.png`,             width: 576,  height: 400  },
};

/** Normalize a tileset image source string to a lookup key */
function normalizeTilesetSource(source: string): string {
  return source
    .split(/[/\\]/).pop()!   // basename
    .replace(/\.[^.]+$/, "") // remove extension
    .toLowerCase()
    .trim();
}

// ─── Layer rendering order ────────────────────────────────────────────────────

const RENDER_LAYER_ORDER = [
  "Back",
  "Back2",
  "Buildings",
  "Buildings2",
  "Front",
  "AlwaysFront",
  "AlwaysFront2",
];

const HIDDEN_LAYER_NAMES = new Set(["Paths"]);

// ─── Farmable tile extraction ─────────────────────────────────────────────────

/**
 * Parse a TMX file and return every (col, row) grid position whose Back-layer
 * tile has the Stardew property  Diggable = "T".
 *
 * The algorithm:
 *  1. Parse all <tileset> elements and collect, per tileset, the set of
 *     local tile-IDs that carry <property name="Diggable" value="T"/>.
 *  2. Walk the "Back" layer data; for each global-ID look up its tileset and
 *     check whether the local-ID is in that tileset's diggable set.
 *  3. Return the matching (col, row) pairs.
 */
export async function fetchFarmableTilePositions(
  tmxUrl: string
): Promise<Array<{ x: number; y: number }>> {
  const res = await fetch(tmxUrl);
  if (!res.ok) return [];
  const text = await res.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/xml");

  const mapEl = doc.querySelector("map");
  if (!mapEl) return [];

  const mapWidth = parseInt(mapEl.getAttribute("width") ?? "80", 10);

  // ── Step 1: build a per-tileset set of diggable localIds ──────────────────
  interface TilesetDigInfo {
    firstgid: number;
    /** local tile IDs (0-based) that have Diggable=T */
    diggableIds: Set<number>;
    /** total tile count – used to compute upper bound of this tileset */
    tilecount: number;
  }
  const tilesets: TilesetDigInfo[] = [];

  for (const tsEl of Array.from(doc.querySelectorAll("map > tileset"))) {
    const firstgid = parseInt(tsEl.getAttribute("firstgid") ?? "1", 10);
    const tilecount = parseInt(tsEl.getAttribute("tilecount") ?? "0", 10);
    const diggableIds = new Set<number>();

    for (const tileEl of Array.from(tsEl.querySelectorAll("tile"))) {
      const localId = parseInt(tileEl.getAttribute("id") ?? "-1", 10);
      if (localId < 0) continue;
      const diggableProp = tileEl.querySelector(
        'properties > property[name="Diggable"]'
      );
      if (diggableProp?.getAttribute("value") === "T") {
        diggableIds.add(localId);
      }
    }

    tilesets.push({ firstgid, diggableIds, tilecount });
  }
  tilesets.sort((a, b) => a.firstgid - b.firstgid);

  function isGidDiggable(gid: number): boolean {
    const cleanGid = gid & 0x1fffffff;
    if (cleanGid === 0) return false;
    // find tileset
    for (let i = tilesets.length - 1; i >= 0; i--) {
      if (cleanGid >= tilesets[i].firstgid) {
        const localId = cleanGid - tilesets[i].firstgid;
        return tilesets[i].diggableIds.has(localId);
      }
    }
    return false;
  }

  // ── Step 2: read "Back" layer ─────────────────────────────────────────────
  function parseLayerData(layerEl: Element) {
    const dataEl = layerEl.querySelector("data");
    const encoding = dataEl?.getAttribute("encoding") ?? "csv";
    const rawData = dataEl?.textContent ?? "";

    if (encoding !== "csv") return [];

    return rawData
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));
  }

  const backLayerEl = Array.from(doc.querySelectorAll("map > layer")).find(
    (l) => l.getAttribute("name") === "Back"
  );
  if (!backLayerEl) return [];

  const layerWidth = parseInt(
    backLayerEl.getAttribute("width") ?? String(mapWidth),
    10
  );
  const gids = parseLayerData(backLayerEl);
  const blockingLayerNames = new Set([
    "Buildings",
    "Buildings2",
    "Front",
    "AlwaysFront",
    "AlwaysFront2",
  ]);
  const blockingLayers = Array.from(doc.querySelectorAll("map > layer"))
    .filter((layerEl) => blockingLayerNames.has(layerEl.getAttribute("name") ?? ""))
    .map(parseLayerData);

  // ── Step 3: collect diggable positions ────────────────────────────────────
  const result: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < gids.length; i++) {
    const hasBlockingTile = blockingLayers.some((layer) => (layer[i] ?? 0) !== 0);
    if (isGidDiggable(gids[i]) && !hasBlockingTile) {
      result.push({ x: i % layerWidth, y: Math.floor(i / layerWidth) });
    }
  }
  return result;
}

/**
 * React hook: fetches farmable positions for a given TMX URL.
 * Returns an empty array while loading.
 */
export function useFarmableTiles(tmxUrl: string): Array<{ x: number; y: number }> {
  const [positions, setPositions] = useState<Array<{ x: number; y: number }>>([]);

  useEffect(() => {
    setPositions([]);
    fetchFarmableTilePositions(tmxUrl).then(setPositions).catch(() => setPositions([]));
  }, [tmxUrl]);

  return positions;
}

// ─── TMX Parser ───────────────────────────────────────────────────────────────

async function fetchAndParseTmx(tmxUrl: string): Promise<ParsedTmxMap> {
  const response = await fetch(tmxUrl);
  if (!response.ok) throw new Error(`Failed to fetch TMX: ${tmxUrl}`);
  const text = await response.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/xml");

  const mapEl = doc.querySelector("map");
  if (!mapEl) throw new Error("No <map> element found");

  const mapWidth = parseInt(mapEl.getAttribute("width") ?? "80", 10);
  const mapHeight = parseInt(mapEl.getAttribute("height") ?? "65", 10);
  const tilewidth = parseInt(mapEl.getAttribute("tilewidth") ?? "16", 10);
  const tileheight = parseInt(mapEl.getAttribute("tileheight") ?? "16", 10);

  // Parse tilesets
  const tilesets: TmxTileset[] = [];
  for (const tsEl of Array.from(doc.querySelectorAll("map > tileset"))) {
    const firstgid = parseInt(tsEl.getAttribute("firstgid") ?? "1", 10);
    const name = tsEl.getAttribute("name") ?? "";
    const tw = parseInt(tsEl.getAttribute("tilewidth") ?? "16", 10);
    const th = parseInt(tsEl.getAttribute("tileheight") ?? "16", 10);
    const columns = parseInt(tsEl.getAttribute("columns") ?? "0", 10);
    const tilecount = parseInt(tsEl.getAttribute("tilecount") ?? "0", 10);

    const imgEl = tsEl.querySelector("image");
    const rawSource = imgEl?.getAttribute("source") ?? "";
    const key = normalizeTilesetSource(rawSource);
    const imgInfo = TILESET_IMAGE_MAP[key] ?? TILESET_IMAGE_MAP[name.toLowerCase()] ?? null;

    if (!imgInfo) {
      // Unknown tileset – still add a placeholder so gid math still works
      tilesets.push({
        firstgid,
        name,
        tilewidth: tw,
        tileheight: th,
        columns: columns || 1,
        tilecount,
        imageSource: rawSource,
        imagePath: "",
        imageWidth: 0,
        imageHeight: 0,
      });
      continue;
    }

    tilesets.push({
      firstgid,
      name,
      tilewidth: tw,
      tileheight: th,
      columns: columns || Math.floor(imgInfo.width / tw),
      tilecount,
      imageSource: rawSource,
      imagePath: imgInfo.url,
      imageWidth: imgInfo.width,
      imageHeight: imgInfo.height,
    });
  }

  // Sort tilesets by firstgid ascending (should already be, but be safe)
  tilesets.sort((a, b) => a.firstgid - b.firstgid);

  // Parse layers
  const layers: TmxLayer[] = [];
  for (const layerEl of Array.from(doc.querySelectorAll("map > layer"))) {
    const id = parseInt(layerEl.getAttribute("id") ?? "0", 10);
    const name = layerEl.getAttribute("name") ?? "";
    const w = parseInt(layerEl.getAttribute("width") ?? String(mapWidth), 10);
    const h = parseInt(layerEl.getAttribute("height") ?? String(mapHeight), 10);

    const dataEl = layerEl.querySelector("data");
    const encoding = dataEl?.getAttribute("encoding") ?? "csv";
    const rawData = dataEl?.textContent ?? "";

    let tileIds: number[] = [];
    if (encoding === "csv") {
      tileIds = rawData
        .split(",")
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !isNaN(n));
    }
    // (base64 and zlib variants are not needed for these maps)

    layers.push({ id, name, width: w, height: h, data: tileIds });
  }

  return { width: mapWidth, height: mapHeight, tilewidth, tileheight, tilesets, layers };
}

// ─── Tile lookup helpers ──────────────────────────────────────────────────────

/** Given a global tile ID, find which tileset it belongs to */
function getTilesetForGid(gid: number, tilesets: TmxTileset[]): TmxTileset | null {
  // Strip flip bits (bits 31, 30, 29)
  const cleanGid = gid & 0x1FFFFFFF;
  if (cleanGid === 0) return null;

  for (let i = tilesets.length - 1; i >= 0; i--) {
    if (cleanGid >= tilesets[i].firstgid) {
      return tilesets[i];
    }
  }
  return null;
}

/** Get the local tile index within a tileset */
function getLocalTileId(gid: number, tileset: TmxTileset): number {
  return (gid & 0x1FFFFFFF) - tileset.firstgid;
}

/** Calculate background-position CSS values for a tile within its spritesheet */
function getTileBackgroundPosition(
  localId: number,
  tileset: TmxTileset
): { x: number; y: number } {
  const col = localId % tileset.columns;
  const row = Math.floor(localId / tileset.columns);
  return {
    x: -(col * tileset.tilewidth),
    y: -(row * tileset.tileheight),
  };
}

// ─── React Component ──────────────────────────────────────────────────────────

interface TmxMapRendererProps {
  /** Public URL, e.g. "/resources/MLN122/assets/farms/standard/map.tmx" */
  tmxPath: string;
  /** Viewport in tile coordinates */
  viewportX: number;
  viewportY: number;
  viewportCols: number;
  viewportRows: number;
  /** Display scale (default 2) */
  scale?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function TmxMapRenderer({
  tmxPath,
  viewportX,
  viewportY,
  viewportCols,
  viewportRows,
  scale = 2,
  className = "",
  style,
}: TmxMapRendererProps) {
  const [map, setMap] = useState<ParsedTmxMap | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setMap(null);

    fetchAndParseTmx(tmxPath)
      .then(setMap)
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, [tmxPath]);

  const tileSize = (map?.tilewidth ?? 16) * scale;
  const canvasW = viewportCols * tileSize;
  const canvasH = viewportRows * tileSize;

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center bg-[#4f8547] ${className}`}
        style={{ width: canvasW, height: canvasH, ...style }}
      >
        <div className="text-center">
          <div
            className="mx-auto mb-2 animate-spin"
            style={{
              width: 24,
              height: 24,
              border: "3px solid #7fc66a",
              borderTopColor: "transparent",
              borderRadius: "50%",
            }}
          />
          <span className="font-mono text-xs font-bold text-[#7fc66a]">
            Đang tải bản đồ...
          </span>
        </div>
      </div>
    );
  }

  if (error || !map) {
    return (
      <div
        className={`flex items-center justify-center bg-[#4f8547] ${className}`}
        style={{ width: canvasW, height: canvasH, ...style }}
      >
        <span className="font-mono text-xs font-bold text-[#d94b35]">
          {error ?? "Không thể tải bản đồ"}
        </span>
      </div>
    );
  }

  // Clamp viewport to map bounds
  const startCol = Math.max(0, viewportX);
  const startRow = Math.max(0, viewportY);
  const endCol = Math.min(map.width, viewportX + viewportCols);
  const endRow = Math.min(map.height, viewportY + viewportRows);

  // Determine which layers to render and in what order
  const orderedLayers = RENDER_LAYER_ORDER
    .map((name) => map.layers.find((l) => l.name === name))
    .filter(
      (layer): layer is TmxLayer =>
        layer !== undefined && !HIDDEN_LAYER_NAMES.has(layer.name),
    );

  // Also include any layers not in our explicit order
  const extraLayers = map.layers.filter(
    (l) => !RENDER_LAYER_ORDER.includes(l.name) && !HIDDEN_LAYER_NAMES.has(l.name)
  );
  const allLayers = [...orderedLayers, ...extraLayers];

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ width: canvasW, height: canvasH, ...style }}
    >
      {allLayers.map((layer, layerIndex) => (
        <TmxLayerRenderer
          key={layer.id}
          layer={layer}
          tilesets={map.tilesets}
          startCol={startCol}
          startRow={startRow}
          endCol={endCol}
          endRow={endRow}
          tileSize={tileSize}
          rawTileSize={map.tilewidth}
          scale={scale}
          zIndex={layerIndex}
        />
      ))}
    </div>
  );
}

// ─── Layer renderer ───────────────────────────────────────────────────────────

interface TmxLayerRendererProps {
  layer: TmxLayer;
  tilesets: TmxTileset[];
  startCol: number;
  startRow: number;
  endCol: number;
  endRow: number;
  tileSize: number;      // scaled tile size in px
  rawTileSize: number;   // original tile size (16)
  scale: number;
  zIndex: number;
}

function TmxLayerRenderer({
  layer,
  tilesets,
  startCol,
  startRow,
  endCol,
  endRow,
  tileSize,
  rawTileSize,
  scale,
  zIndex,
}: TmxLayerRendererProps) {
  // We batch tiles by tileset to minimise unique background-image references
  const tiles: Array<{
    screenX: number;
    screenY: number;
    tileset: TmxTileset;
    localId: number;
  }> = [];

  for (let row = startRow; row < endRow; row++) {
    for (let col = startCol; col < endCol; col++) {
      const dataIndex = row * layer.width + col;
      const gid = layer.data[dataIndex] ?? 0;
      if (gid === 0) continue;

      const tileset = getTilesetForGid(gid, tilesets);
      if (!tileset || !tileset.imagePath) continue;

      const localId = getLocalTileId(gid, tileset);
      tiles.push({
        screenX: (col - startCol) * tileSize,
        screenY: (row - startRow) * tileSize,
        tileset,
        localId,
      });
    }
  }

  if (tiles.length === 0) return null;

  return (
    <div className="absolute inset-0" style={{ zIndex }}>
      {tiles.map(({ screenX, screenY, tileset, localId }, i) => {
        const { x: bpX, y: bpY } = getTileBackgroundPosition(localId, tileset);
        return (
          <div
            key={i}
            className="absolute"
            style={{
              left: screenX,
              top: screenY,
              width: tileSize,
              height: tileSize,
              backgroundImage: `url(${tileset.imagePath})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: `${bpX * scale}px ${bpY * scale}px`,
              backgroundSize: `${tileset.imageWidth * scale}px ${tileset.imageHeight * scale}px`,
              imageRendering: "pixelated",
            }}
          />
        );
      })}
    </div>
  );
}

// ─── Convenience wrappers ─────────────────────────────────────────────────────

/** Farm type → TMX path mapping */
/** Recommended viewport for each farm type (in tile coordinates) */
export const FARM_VIEWPORTS: Record<
  string,
  { x: number; y: number; cols: number; rows: number }
> = {
  standard:       { x: 42, y: 6,  cols: 38, rows: 30 },
  hilltop:        { x: 5,  y: 8,  cols: 40, rows: 32 },
  riverland:      { x: 5,  y: 8,  cols: 40, rows: 32 },
  forest:         { x: 5,  y: 8,  cols: 40, rows: 32 },
  wilderness:     { x: 5,  y: 8,  cols: 40, rows: 32 },
  "four-corners": { x: 5,  y: 5,  cols: 40, rows: 32 },
  beach:          { x: 5,  y: 8,  cols: 40, rows: 32 },
};

interface FarmMapViewProps {
  farmType: string;
  /** Pixel width of rendered viewport (scale is derived from this + cols) */
  pixelWidth?: number;
  pixelHeight?: number;
  className?: string;
  style?: React.CSSProperties;
  overrideViewport?: { x: number; y: number; cols: number; rows: number };
}

/**
 * Renders a farm map from its TMX file, using the recommended viewport
 * for the given farm type.
 */
export function FarmMapView({
  farmType,
  pixelWidth = 640,
  pixelHeight = 480,
  className = "",
  style,
  overrideViewport,
}: FarmMapViewProps) {
  const tmxPath = FARM_TMX_PATHS[farmType] ?? FARM_TMX_PATHS.standard;
  const vp = overrideViewport ?? FARM_VIEWPORTS[farmType] ?? FARM_VIEWPORTS.standard;

  // Derive scale from desired pixel dimensions
  const scaleX = pixelWidth  / (vp.cols * 16);
  const scaleY = pixelHeight / (vp.rows * 16);
  const scale = Math.min(scaleX, scaleY, 3); // cap at 3× to avoid huge images

  return (
    <TmxMapRenderer
      tmxPath={tmxPath}
      viewportX={vp.x}
      viewportY={vp.y}
      viewportCols={vp.cols}
      viewportRows={vp.rows}
      scale={scale}
      className={className}
      style={{ width: pixelWidth, height: pixelHeight, ...style }}
    />
  );
}
