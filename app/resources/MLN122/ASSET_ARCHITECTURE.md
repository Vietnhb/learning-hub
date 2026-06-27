# Stardew Valley Asset Architecture

## Overview
This document explains how Stardew Valley composes its farm scenes from individual asset sprites.

## Asset Extraction Source
**Source folder**: `C:\Users\kemin\Downloads\gameDemo\Content (unpacked)`
**Extracted using**: `StardewXnbHack.exe` (included in game folder)
**Total files extracted**: 3,550 files

## Layer Architecture (Z-Index)

Stardew Valley renders farm scenes in the following layer order (bottom to top):

### 1. **Base Terrain** (Z: 0)
- **File**: `TerrainFeatures/grass.png`
- **Purpose**: Base grass/dirt texture
- **Tile size**: 16×16 pixels
- **Coverage**: Entire map background

### 2. **Map Tiles** (Z: 1-4)
- **Source**: TMX files (`Maps/Farm_*.tmx`)
- **Tilesheet**: References external spritesheets like:
  - `spring_outdoorsTileSheet.png`
  - `spring_outdoorsTileSheet2.png`
  - `spring_island_tilesheet_1.png`
- **Layers in TMX**:
  1. **Back** - Ground decorations (paths, grass variants, dirt)
  2. **Buildings** - Structures (farmhouse, barn, coop, greenhouse)
  3. **Paths** - Player-built paths and walkways
  4. **Front** - Objects that appear above player (tree tops, building roofs)
  5. **AlwaysFront** - Always render above everything

### 3. **Tilled Soil** (Z: 5)
- **Files**:
  - `TerrainFeatures/hoeDirt.png` - Dry tilled soil
  - `TerrainFeatures/hoeDirtDark.png` - Watered soil
- **Sprite sheet layout** (64×128 pixels):
  ```
  Row 0: Dry soil states (0-3: single tile, 4-15: connected tiles)
  Row 1: Wet soil states (same pattern)
  Row 2: Snow-covered variants
  ```
- **Tile states**:
  - Index 0: Isolated tile
  - Index 1-15: Connected tiles (N, E, S, W combinations)

### 4. **Crops** (Z: 6)
- **File**: `TileSheets/crops.png` (256×1,472 pixels)
- **Layout**: 16 columns × 92 rows
- **Each crop occupies**: 2 rows (16 columns each)
  - **Row 1**: Growth phases 0-7 + harvest states
  - **Row 2**: Additional growth/seasonal variants
- **Sprite size**: 16×16 for most, 16×32 for tall crops
- **Example crops**:
  - Parsnip (rows 0-1)
  - Cauliflower (rows 2-3)
  - Potato (rows 4-5)
  - Melon (rows 8-9)

### 5. **Buildings** (Z: 7)
- **Files**:
  - `Buildings/houses.png` - Farmhouse sprites
  - `Buildings/Barn.png`, `Big Barn.png`, `Deluxe Barn.png`
  - `Buildings/Coop.png`, `Big Coop.png`, `Deluxe Coop.png`
  - `Buildings/Shipping Bin.png` - Where crops are sold
  - `Buildings/Greenhouse.png`
- **Rendering**: Multi-tile structures with shadows

### 6. **Characters/Animals** (Z: 8)
- **Files**: `Animals/*.png`, `Characters/*.png`
- **Animation**: Multiple frames per sprite sheet
- **Size**: 16×16 for small animals, 32×32 for larger

### 7. **UI Overlays** (Z: 9)
- Tool indicators, cursors, health bars

## Asset Composition Rules

### Tile Connection Logic
Stardew Valley uses **autotiling** to blend adjacent tiles seamlessly:

```typescript
// Pseudo-code for tile selection
function getTileIndex(north, east, south, west) {
  return (
    (north ? 1 : 0) +
    (east  ? 2 : 0) +
    (south ? 4 : 0) +
    (west  ? 8 : 0)
  );
}
```

Example:
- No neighbors: Index 0
- North + East: Index 3
- All sides: Index 15

### Crop Growth States
Each crop has 5-8 growth phases:
1. **Phase 0**: Just planted (seeds visible)
2. **Phase 1-2**: Sprout emerging
3. **Phase 3-5**: Growing stages
4. **Phase 6-7**: Fully grown
5. **Phase 8**: Harvestable (glowing/sparkling)

### Building Placement
Buildings are placed on a grid but can occupy multiple tiles:
- **Coop**: 3×2 tiles (96×64 pixels)
- **Barn**: 4×3 tiles (128×96 pixels)  
- **Farmhouse**: Varies by upgrade level

## TMX Map File Structure

TMX files are XML-based Tiled map format:

```xml
<map width="100" height="75" tilewidth="16" tileheight="16">
  <properties>
    <property name="FarmHouseEntry" value="81 19"/>
    <property name="ShippingBinLocation" value="88 18"/>
    <property name="GreenhouseLocation" value="37 19"/>
  </properties>
  
  <tileset firstgid="1" name="Paths" source="paths.png"/>
  <tileset firstgid="65" name="spring_island" source="spring_island_tilesheet_1.png"/>
  
  <layer name="Back" width="100" height="75">
    <data encoding="csv">
      1345,1345,1345,1346,1346,1346,...
    </data>
  </layer>
  
  <layer name="Buildings" width="100" height="75">
    ...
  </layer>
</map>
```

## Asset Coordinates System

- **Origin**: Top-left (0, 0)
- **Tile size**: 16×16 pixels
- **Map size**: Varies by farm type
  - Standard Farm: 100×75 tiles (1600×1200 pixels)
  - Four Corners: 100×75 tiles
  - Other farms: Similar dimensions

## Available Farm Maps

1. **Farm.tmx** (Standard Farm) - Maximum crop area
2. **Farm_Combat.tmx** (Wilderness Farm) - Monster spawns
3. **Farm_Fishing.tmx** (Riverland Farm) - Fishing spots
4. **Farm_Foraging.tmx** (Forest Farm) - Foraging items
5. **Farm_Mining.tmx** (Hill-top Farm) - Mining ore
6. **Farm_Ranching.tmx** (Hilltop Farm) - Grass for animals
7. **Farm_FourCorners.tmx** (Four Corners) - 4 distinct areas

## Next Steps for Implementation

1. **Parse TMX files** to extract layer data
2. **Load tilesheets** and map tile IDs to sprite positions
3. **Render layers** in correct Z-order
4. **Implement autotiling** for HoeDirt
5. **Add crop sprites** with growth animation
6. **Position buildings** from TMX property coordinates

## References
- Game folder: `C:\Users\kemin\Downloads\gameDemo`
- Extracted assets: `d:\Project\learning-hub\public\resources\MLN122`
- Wiki: https://stardewvalleywiki.com/
