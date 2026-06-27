# 🗺️ Guide: Extract Maps từ Stardew Valley Game

## Cách 1: Dùng xnbcli (Recommended)

### Install xnbcli
```bash
npm install -g @xnb/cli
```

### Extract maps
```bash
cd C:\Users\kemin\Downloads\gameDemo\Content\Maps

# Extract Farm.xnb
xnbcli unpack Farm.xnb Farm.tbin

# Extract tất cả farm maps
xnbcli unpack Farm*.xnb output-folder/
```

### Convert .tbin to JSON (with Tiled)
```bash
# Install Tiled Map Editor
# Open .tbin file
# Export as JSON
```

---

## Cách 2: Dùng StardewXnbHack (Có sẵn trong game folder)

```bash
cd C:\Users\kemin\Downloads\gameDemo
.\StardewXnbHack.exe
# Tool sẽ tự động unpack tất cả content
```

**Output:** `Content (unpacked)/Maps/`

---

## Cách 3: Chụp screenshots từ game (Easiest!)

### Steps:
1. Mở Stardew Valley game
2. Start new game
3. Chọn farm type khi create character
4. Vào game
5. Press F12 (screenshot) hoặc dùng tool capture
6. Crop ảnh để lấy map area
7. Save vào: `d:\Project\learning-hub\public\resources\MLN122\map-previews\`

### Farm types in character creation:
- Standard Farm
- Riverland Farm (Fishing)
- Forest Farm (Foraging)
- Hill-top Farm (Mining)
- Wilderness Farm (Combat)
- Four Corners Farm
- Beach Farm (Island)

---

## Cách 4: Download từ Stardew Valley Wiki

### Links:
- https://stardewvalleywiki.com/Farm_Maps
- https://stardewcommunitywiki.com/Farm_Maps

### Screenshots available:
- Farm_Standard.png
- Farm_Riverland.png
- Farm_Forest.png
- Farm_Hilltop.png
- Farm_Wilderness.png
- Farm_FourCorners.png

**Download và save to:**
```
d:\Project\learning-hub\public\resources\MLN122\map-previews\
├── farm-standard.png
├── farm-fishing.png
├── farm-foraging.png
├── farm-mining.png
├── farm-combat.png
├── farm-four-corners.png
└── farm-ranching.png
```

---

## Recommended Approach for MLN122

### Quick Solution (30 minutes):
1. Download screenshots từ wiki
2. Crop để lấy farm area
3. Resize to 800x600px
4. Save to map-previews folder
5. Update MapSelector component với preview images

### Full Solution (2-3 hours):
1. Extract XNB files với xnbcli
2. Convert .tbin to JSON
3. Create viewport extractors cho mỗi map
4. Generate tile assets
5. Create JSON viewport files cho tất cả maps
6. Implement map switching logic

---

## Current Status

### Có sẵn:
- ✅ Farm_Ranching viewport JSON (hand-made)
- ✅ Scene assets cropped from ranching farm
- ✅ MapSelector UI component
- ✅ Map switching logic

### Cần thêm:
- ❌ Preview images cho tất cả maps
- ❌ Viewport JSON cho các maps khác
- ❌ Scene assets cho các maps khác (optional)

---

## Action Plan

### Phase 1: Quick Preview (Do Now) ⚡
```bash
# Download screenshots từ wiki
wget https://stardewvalleywiki.com/mediawiki/images/Standard_Farm.png
wget https://stardewvalleywiki.com/mediawiki/images/Riverland_Farm.png
# ... etc

# Hoặc manual download và rename
```

### Phase 2: Functional Switching (Later) 🔄
```typescript
// Create viewport JSONs cho mỗi map
// Extract tiles nếu cần animated backgrounds
// Implement map data loading
```

### Phase 3: Full Integration (Optional) ✨
```typescript
// Extract full tile data
// Create dynamic map loader
// Support custom viewports
```

---

## Quick Command List

```bash
# Navigate to game folder
cd C:\Users\kemin\Downloads\gameDemo

# List all farm maps
dir Content\Maps\Farm*.xnb

# Copy maps to workspace (already done)
copy Content\Maps\Farm*.xnb unpacked-maps\

# Next: Use xnbcli or screenshot method
```

---

## Result Structure

```
d:\Project\learning-hub\public\resources\MLN122\
├── map-previews\              # Screenshots/previews
│   ├── farm-standard.png
│   ├── farm-fishing.png
│   ├── farm-foraging.png
│   ├── farm-mining.png
│   ├── farm-combat.png
│   ├── farm-four-corners.png
│   └── farm-ranching.png
│
├── map-data\                  # Viewport JSONs
│   ├── farm-standard-viewport.json
│   ├── farm-fishing-viewport.json
│   └── ...
│
└── scene-assets\              # Tiles (if needed)
    └── map-tiles\
        ├── farm-standard\
        ├── farm-fishing\
        └── ...
```

---

## Fastest Path Forward

**For demo purposes (TODAY):**
1. Use placeholder images hoặc text labels
2. Map selector shows names + descriptions only
3. Clicking map just logs "Map changed to X"
4. Keep using farm-ranching for now

**For production (LATER):**
1. Add screenshot previews
2. Create viewport JSONs
3. Implement actual map switching
