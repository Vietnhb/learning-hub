# MLN122 Map Rendering System

## Overview

The MLN122 farming simulation now renders **real Stardew Valley farm maps** from TMX files with actual tilesheet graphics. Each of the 7 farm types (Standard, Hilltop, Riverland, Forest, Wilderness, Four-Corners, Beach) has its own unique terrain rendered from game data.

## Architecture

### 1. TMX Files (`/public/resources/MLN122/assets/farms/<farm-id>/`)
- `Farm.tmx` - Standard farm
- `Farm_Mining.tmx` - Hilltop farm (with ore veins)
- `Farm_Fishing.tmx` - Riverland farm (with rivers and islands)
- `Farm_Foraging.tmx` - Forest farm (with trees and forageables)
- `Farm_Combat.tmx` - Wilderness farm (with monster spawns)
- `Farm_FourCorners.tmx` - Four-Corners farm (divided into quadrants)
- `Farm_Ranching.tmx` - Beach farm (with sand and ocean)

Each TMX file is an XML document containing:
- Map dimensions (width/height in tiles)
- Tileset references (which spritesheets to use)
- Layer data (tile IDs for each position)
- Tile properties (walkable, buildable, diggable, etc.)

### 2. Tilesheet Images (`/public/resources/MLN122/assets/shared/tilesheets/`)
- `Maps__spring_outdoorsTileSheet.png` (400×1264) - Main terrain tiles
- `Maps__spring_outdoorTileSheet_extra.png` (128×128) - Extra tiles
- `Maps__spring_outdoorsTileSheet2.png` (400×576) - Additional terrain
- `Maps__spring_island_tilesheet_1.png` (400×528) - Island/beach tiles
- `Maps__spring_Waterfalls.png` (80×352) - Animated water tiles

These are sprite sheets where each 16×16 tile is clipped using CSS `background-position`.

### 3. TMX Parser & Renderer (`tmx-map-renderer.tsx`)

**Key Components:**

#### `TmxMapRenderer`
- Fetches and parses TMX XML files
- Extracts map dimensions, tilesets, and layer data
- Renders tiles using viewport system
- Supports multiple layers (Back, Buildings, Front, etc.)

#### `TmxLayerRenderer`
- Renders individual map layers
- Clips tiles from tilesheets using CSS background-position
- Handles tile lookup by global ID (GID)
- Supports pixel-perfect scaling

#### `FarmMapView`
- High-level wrapper for rendering farms
- Maps farm type → TMX file
- Configures viewport and scale automatically
- 7 pre-configured farm viewports

### 4. Multi-Map Farming Scene (`multi-map-farming.tsx`)

The main game scene that combines TMX rendering with gameplay:

```
┌─────────────────────────────────────┐
│  FarmMapView (TMX Background)       │ ← z-index: 0
│  - Renders actual farm terrain      │
│  - Grass, water, cliffs, trees      │
│  - Buildings, decorations    │
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│  Overlay Layer (Game Objects)       │ ← z-index: 10
│  - Tilled soil tiles                │
│  - Planted crops                    │
│  - Workers & animations             │
│  - AI robots                        │
└─────────────────────────────────────┘
```

**Coordinate System:**
- TMX map uses tile coordinates (e.g., x=42, y=6)
- Each tile = 16×16 pixels
- Viewport defines visible area (e.g., 38 cols × 30 rows)
- Overlay offset calculated to align workers with map

**Worker Positioning:**
- Workers use map-space coordinates
- Position scaled by viewport scale factor
- Z-index based on Y position (Y-sorting for depth)

## How It Works

### Rendering Pipeline

1. **Load TMX File**
   ```typescript
   fetchAndParseTmx("/resources/MLN122/assets/farms/standard/map.tmx")
   ```

2. **Parse XML**
   - Extract `<tileset>` definitions
   - Extract `<layer>` tile data (CSV format)
   - Map tileset names to image URLs

3. **Render Layers**
   - Back layers (terrain foundation)
   - Buildings (structures)
   - Front layers (overlay decorations)

4. **Render Each Tile**
   ```css
   background-image: url("/resources/MLN122/assets/shared/tilesheets/Maps__spring_outdoorsTileSheet.png");
   background-position: -32px -64px; /* Clips specific tile */
   background-size: 800px 2528px; /* Scaled 2× */
   ```

5. **Overlay Game Objects**
   - Soil tiles (tilled/watered states)
   - Crops (4 growth stages)
   - Workers (animated sprites)
   - Particles and effects

### Viewport System

Each farm type has a recommended viewport:

```typescript
const FARM_VIEWPORTS = {
  standard: { x: 42, y: 6, cols: 38, rows: 30 },  // Center farmable area
  hilltop: { x: 5, y: 8, cols: 40, rows: 32 },    // Mining quarry area
  riverland: { x: 5, y: 8, cols: 40, rows: 32 },  // Main islands
  // ... etc
};
```

The viewport defines:
- **x, y**: Top-left tile coordinate
- **cols, rows**: How many tiles to show
- **scale**: Auto-calculated to fit pixel dimensions

### Tile Lookup

Tiles are referenced by **Global ID (GID)**:

```
GID = firstgid + local_tile_id

Example:
- Tileset "spring_outdoorsTileSheet" has firstgid = 129
- Local tile 50 → GID = 179
- Row = 50 / 25 columns = 2
- Col = 50 % 25 = 0
- Background-position = -0px -32px
```

## Features

✅ **7 Unique Farm Maps** - Each with distinct terrain  
✅ **Real Tilesheet Rendering** - Uses actual Stardew Valley assets  
✅ **Multi-Layer Support** - Back, Buildings, Front layers  
✅ **Viewport System** - Shows relevant farming area for each map  
✅ **Performance Optimized** - Only renders visible tiles  
✅ **Pixel-Perfect Scaling** - Maintains crisp pixel art at 2-3× scale  
✅ **Automated Farming** - Workers till, plant, grow, harvest on real terrain  

## File Structure

```
/public/resources/MLN122/
assets/
  farms/
    standard/map.tmx
    hilltop/map.tmx
    riverland/map.tmx
    ...
  shared/
    tilesheets/
      Maps__spring_outdoorsTileSheet.png
    scene/
      crops/
      characters/
      map-tiles/
└── asset/                 # UI preview images

/app/resources/MLN122/
├── tmx-map-renderer.tsx   # TMX parser & renderer
├── multi-map-farming.tsx  # Main game scene
├── farm-maps-config.ts    # Farm type configs
└── page.tsx               # Main game controller
```

## Usage Example

```tsx
import { FarmMapView } from "./tmx-map-renderer";

<FarmMapView
  farmType="riverland"
  pixelWidth={640}
  pixelHeight={480}
  style={{ position: "absolute", inset: 0 }}
/>
```

This will:
1. Load `/resources/MLN122/assets/farms/riverland/map.tmx`
2. Parse tileset references and layer data
3. Render visible tiles from viewport (x=5, y=8, 40×32 tiles)
4. Scale to fit 640×480 pixel canvas

## Performance Notes

- **Tile Count**: Each viewport renders ~1200 tiles
- **Layer Count**: 5-8 layers per map
- **Render Method**: CSS background-position (GPU-accelerated)
- **No Canvas**: Pure HTML/CSS for better React integration
- **Lazy Loading**: Only visible tiles are rendered

## Economic Theory Integration

The farm rendering supports the MLN122 economic concepts:

1. **Land Quality** (Differential Rent I)
   - Fertile land has more grass tiles
   - Poor land has more rock/cliff tiles
   - Affects crop yield visually

2. **Capital Investment** (Differential Rent II)
   - Workers till and plant on real farmable terrain
   - AI robots appear as visual upgrades
   - Infrastructure builds on actual map

3. **Labor Theory of Value**
   - Workers create visible transformation
   - Crops grow through labor stages
   - Harvest yields from planted seeds

---

## Summary

The MLN122 game now renders **authentic Stardew Valley farm maps** instead of simple colored backgrounds. Each farm type has unique terrain features (rivers, cliffs, forests, beaches) that affect gameplay and economic outcomes. The TMX rendering system parses XML map data and clips tiles from sprite sheets, creating a pixel-perfect farming simulation that teaches economic theory through interactive gameplay.

**No more static green backgrounds** — you're farming on real maps! 🌾🗺️
