# 🎨 Asset Extraction Guide - Từ Game Stardew Valley

## Cấu trúc Assets trong Game

### 📦 Các file XNB quan trọng

```
C:\Users\kemin\Downloads\gameDemo\Content\
├── TerrainFeatures/
│   ├── hoeDirt.xnb           ← Đất cày (khô)
│   ├── hoeDirtDark.xnb       ← Đất cày (tối)
│   ├── hoeDirtSnow.xnb       ← Đất cày (tuyết)
│   └── grass.xnb             ← Cỏ
│
├── TileSheets/
│   ├── crops.xnb             ← TẤT CẢ crops sprites
│   ├── tools.xnb             ← Cuốc, xẻng, vv
│   └── Craftables.xnb        ← Các vật có thể craft
│
├── Buildings/
│   ├── houses.xnb            ← Farmhouse sprites
│   ├── Barn.xnb              ← Barn building
│   ├── Coop.xnb              ← Coop building
│   ├── Shipping Bin.xnb      ← Shipping bin
│   └── Greenhouse.xnb        ← Greenhouse
│
└── Maps/
    ├── Farm.xnb              ← Standard farm map
    ├── Farm_Ranching.xnb     ← Ranching farm
    ├── Farm_Combat.xnb       ← Wilderness farm
    └── ...                    ← Các farm maps khác
```

---

## 🔧 Tools cần thiết

### Option 1: xnbcli (Recommended)
```bash
# Install via npm
npm install -g @xnb/cli

# Unpack single file
xnbcli unpack hoeDirt.xnb hoeDirt.png

# Unpack folder
xnbcli unpack Content/TerrainFeatures/ output/
```

**Download:** https://github.com/LeonBlade/xnbcli

### Option 2: StardewXnbHack (Có sẵn trong game folder)
```bash
cd C:\Users\kemin\Downloads\gameDemo
.\StardewXnbHack.exe

# Tool sẽ tự động unpack tất cả vào:
# Content (unpacked)/
```

### Option 3: XNB Extract (GUI Tool)
- Download: https://community.playstarbound.com/resources/xnb-extract.2633/
- Drag & drop XNB files vào tool
- Export as PNG

---

## 📐 Sprite Sheet Structures

### hoeDirt.xnb Structure
```
Dimensions: 64px × 64px (4 frames in 2×2 grid)
Each frame: 16px × 16px

┌─────┬─────┬─────┬─────┐
│ Dry │Wat. │ Dry │Wat. │  Row 0: Normal soil
│  0  │  1  │  2  │  3  │
├─────┼─────┼─────┼─────┤
│ Dry │Wat. │ Dry │Wat. │  Row 1: Fertilized soil
│  4  │  5  │  6  │  7  │
└─────┴─────┴─────┴─────┘

State mapping:
- 0, 2: Dry soil (different corners)
- 1, 3: Watered soil
- 4-7: With fertilizer
```

### crops.xnb Structure
```
Dimensions: 256px × 672px (large sprite sheet)
Grid: 16 columns × 21 rows
Each sprite: 16px × 32px (taller than tile!)

Row 0:  Parsnip   [Seed][Phase1][Phase2][Phase3][Harvest]
Row 1:  Cauliflower
Row 2:  Green Bean
Row 3:  Potato
...
Row 20: Coffee Bean

Phase columns:
- Col 0: Seed/Stage 0
- Col 1: Growth phase 1
- Col 2: Growth phase 2  
- Col 3: Growth phase 3
- Col 4: Harvestable
- Col 5+: Dead/regrowth states
```

### houses.xnb Structure
```
Dimensions: 288px × 512px
Contains: All farmhouse upgrade stages

Layout:
- Rows 0-3: Starter house (4 seasons)
- Rows 4-7: House upgrade 1
- Rows 8-11: House upgrade 2
- Rows 12-15: House upgrade 3 (max)

Each house sprite: ~72px × 128px
```

---

## 🎯 Extraction Process

### Step 1: Unpack XNB files
```bash
cd C:\Users\kemin\Downloads\gameDemo

# Run Python script
python unpack_assets.py

# Or manual with xnbcli
xnbcli unpack Content/TerrainFeatures/hoeDirt.xnb unpacked/hoeDirt.png
xnbcli unpack Content/TileSheets/crops.xnb unpacked/crops.png
xnbcli unpack Content/Buildings/houses.xnb unpacked/houses.png
```

**Output:** PNG files với full sprite sheets

### Step 2: Crop individual sprites
```bash
# Use ImageMagick hoặc script
magick hoeDirt.png -crop 16x16 hoeDirt_%d.png
magick crops.png -crop 16x32 +repage crops_%d.png
```

**Or use Python:**
```python
from PIL import Image

# Crop hoeDirt tiles
img = Image.open('hoeDirt.png')
for i in range(8):
    x = (i % 4) * 16
    y = (i // 4) * 16
    tile = img.crop((x, y, x+16, y+16))
    tile.save(f'hoeDirt_{i}.png')

# Crop crop sprites
crops = Image.open('crops.png')
for row in range(21):  # 21 crop types
    for col in range(8):  # 8 phases
        x = col * 16
        y = row * 32
        sprite = crops.crop((x, y, x+16, y+32))
        sprite.save(f'crop_row{row}_phase{col}.png')
```

### Step 3: Organize for MLN122
```
d:\Project\learning-hub\public\resources\MLN122\scene-assets\
├── crops/
│   ├── soil-dry.png          ← hoeDirt frame 0
│   ├── soil-dark.png         ← hoeDirtDark frame 0
│   ├── soil-watered.png      ← hoeDirt frame 1
│   ├── crop-row-0-stage-1.png
│   ├── crop-row-0-stage-2.png
│   └── ...
│
├── buildings/
│   ├── farmhouse-standard.png
│   ├── barn.png
│   ├── coop.png
│   └── shipping-bin.png
│
└── map-tiles/
    ├── grass/
    ├── paths/
    └── decorations/
```

---

## 🧩 Logic ghép Assets (như trong game)

### Rendering Order (Z-Index)
```typescript
const Z_LAYERS = {
  TERRAIN_BACKGROUND: 0,    // Grass, dirt base
  TERRAIN_FEATURES: 100,    // HoeDirt tiles
  CROPS: 200,               // Crop sprites
  BUILDINGS_BACK: 300,      // Building back layers
  CHARACTERS: 400,          // Players, NPCs, animals
  BUILDINGS_FRONT: 500,     // Building front layers (roofs)
  EFFECTS: 600,             // Sparkles, animations
};
```

### Tile Composition Example
```typescript
// Render 1 farm tile với crops
function renderFarmTile(x: number, y: number, tileData: TileData) {
  // Layer 1: Grass background (nếu chưa cày)
  if (!tileData.tilled) {
    drawSprite('grass.png', x, y);
  }
  
  // Layer 2: HoeDirt (nếu đã cày)
  if (tileData.tilled) {
    const soilSprite = tileData.watered 
      ? 'soil-watered.png' 
      : 'soil-dry.png';
    drawSprite(soilSprite, x, y);
  }
  
  // Layer 3: Crop (nếu có trồng)
  if (tileData.crop) {
    const cropSprite = `crop-row-${tileData.crop.type}-stage-${tileData.crop.phase}.png`;
    // Crop cao hơn tile, offset lên trên
    drawSprite(cropSprite, x, y - 16);  // -16px offset
  }
}
```

### Map Composition
```typescript
// Full farm map
function renderFarmMap(viewport: Viewport) {
  // 1. Background layer (grass pattern)
  renderLayer('Back');
  
  // 2. Paths and flooring
  renderLayer('Paths');
  
  // 3. Buildings (back)
  renderLayer('Buildings');
  
  // 4. Farm tiles (dynamic - player controlled)
  for (let y = 0; y < farmHeight; y++) {
    for (let x = 0; x < farmWidth; x++) {
      renderFarmTile(x, y, farmData[y][x]);
    }
  }
  
  // 5. Characters (Y-sorted for proper overlap)
  renderCharacters();
  
  // 6. Buildings (front - roofs, chimneys)
  renderLayer('Front');
}
```

---

## 📊 Crop Data Structure (từ Data/Crops.xnb)

```json
{
  "472": "Parsnip/0/2/0/0/0/0/0/0/0/1/.01/0/.02/4",
  
  Format: "Name/GrowthDays/Seasons/SpriteRow/Harvest/MinHarvest/MaxHarvest/..."
  
  Example:
  - Name: "Parsnip"
  - Days to grow: [1, 1, 1, 1] = 4 days total
  - Seasons: "spring"
  - Sprite row: 0 (row 0 in crops.xnb)
}
```

---

## 🎬 Animation Timings

### Crop Growth
```typescript
// Mỗi ngày check và tăng phase
function dailyUpdate() {
  for (let crop of allCrops) {
    crop.daysInCurrentPhase++;
    
    if (crop.daysInCurrentPhase >= crop.phaseDurations[crop.phase]) {
      crop.phase++;
      crop.daysInCurrentPhase = 0;
      
      // Update sprite
      updateCropSprite(crop);
    }
  }
}
```

### Watering Animation
```typescript
// Khi player tưới nước
function waterTile(x: number, y: number) {
  const tile = farmData[y][x];
  
  // Transition animation
  animateTransition(
    from: 'soil-dry.png',
    to: 'soil-watered.png',
    duration: 200ms
  );
  
  tile.watered = true;
}
```

---

## ✅ Checklist

### Extraction
- [ ] Install xnbcli tool
- [ ] Unpack hoeDirt.xnb → PNG
- [ ] Unpack crops.xnb → PNG
- [ ] Unpack houses.xnb → PNG
- [ ] Unpack map files → TBIN/JSON

### Cropping
- [ ] Crop soil tiles (16×16)
- [ ] Crop crop sprites (16×32)
- [ ] Crop building sprites
- [ ] Crop map tiles

### Organization
- [ ] Copy to scene-assets/crops/
- [ ] Copy to scene-assets/buildings/
- [ ] Copy to scene-assets/map-tiles/
- [ ] Update file references in code

### Implementation
- [ ] Update TileView component với new sprites
- [ ] Test soil rendering
- [ ] Test crop growth stages
- [ ] Test building placement
- [ ] Test full map rendering

---

## 🚀 Quick Start Commands

```bash
# 1. Navigate to game folder
cd C:\Users\kemin\Downloads\gameDemo

# 2. Run extraction script
python unpack_assets.py

# 3. Crop sprites (manual or script)
# Use Python PIL or online tool

# 4. Copy to project
xcopy unpacked_assets\* d:\Project\learning-hub\public\resources\MLN122\scene-assets\ /E /I

# 5. Update code references
# Edit automated-farming.tsx, farm-scene.tsx
```

---

## 💡 Tips

1. **Pixel Perfect**: Dùng `imageRendering: "pixelated"` trong CSS
2. **Z-Index**: Luôn render theo thứ tự đúng (back to front)
3. **Crop Offset**: Crops cao hơn tile, cần offset -14px
4. **Seasons**: Mỗi season có tilesheet riêng (spring_, summer_, fall_, winter_)
5. **Performance**: Crop tiles một lần, không crop mỗi frame
6. **Caching**: Load sprites vào memory, reuse

---

Xong! Giờ bạn có đầy đủ thông tin để extract và sử dụng assets từ game.
