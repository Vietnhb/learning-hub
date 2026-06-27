# 🗺️ Stardew Valley Farm Maps Analysis

## Available Farm Types in Game

Dựa vào các file map trong `C:\Users\kemin\Downloads\gameDemo\Content\Maps`:

### 1. **Farm.xnb** - Standard Farm ⭐ RECOMMENDED
**Layout:**
```
┌─────────────────────────────────────┐
│  🌲 Forest      🌲 Trees           │
│                                     │
│     🏠 Farmhouse    🚪 Shipping     │
│                                     │
│  🟩🟩🟩🟩🟩  Crop Area (Large)       │
│  🟩🟩🟩🟩🟩                          │
│  🟩🟩🟩🟩🟩                          │
│                                     │
│     🐄 Barn    🐔 Coop              │
│                                     │
│  💎 Cave    🏞️ Pond   🌳 Trees     │
└─────────────────────────────────────┘
```

**Features:**
- ✅ Large central crop area (perfect for farming automation)
- ✅ Farmhouse với front door
- ✅ Shipping bin (cửa hàng bán nông sản)
- ✅ Space for Barn & Coop
- ✅ Cave entrance
- ✅ Fishing pond
- ✅ Balanced layout

**Best for:** General farming, có đầy đủ elements

---

### 2. **Farm_Ranching.xnb** - Hilltop Farm (Currently Using)
**Layout:**
```
┌─────────────────────────────────────┐
│  🏔️ Mountains  🏔️ Cliffs           │
│                                     │
│         🏠 Farmhouse                │
│                                     │
│  🐄🐄 Large Barn Area              │
│  🐔🐔 Large Coop Area              │
│                                     │
│  🟩🟩 Crop Area (Smaller)           │
│                                     │
│  ⛏️ Mining spots   💎 Ores         │
└─────────────────────────────────────┘
```

**Features:**
- ✅ Best for ranching (animals)
- ⚠️ Smaller crop area
- ✅ Mining resources
- ✅ Multi-level terrain (hills)

**Issue:** Crop area nhỏ hơn, không ideal cho farming automation showcase

---

### 3. **Farm_Fishing.xnb** - Riverland Farm
**Layout:**
```
┌─────────────────────────────────────┐
│  🌊🌊🌊  Rivers everywhere          │
│                                     │
│  🏝️ 🏠 Farmhouse on island        │
│                                     │
│  🟩🟩 Small crop patches (islands)  │
│  🌊 ~ 🟩🟩 ~ 🌊                    │
│                                     │
│  🐟 Fishing spots   🦀 Crab pots   │
└─────────────────────────────────────┘
```

**Features:**
- ✅ Best for fishing
- ❌ Very fragmented crop area (không phù hợp automation)
- ✅ Beautiful water scenery

**Issue:** Crop area bị chia nhỏ thành nhiều island, khó làm automation liền mạch

---

### 4. **Farm_Mining.xnb** - Hill-top Farm
**Layout:**
```
┌─────────────────────────────────────┐
│  ⛰️ Quarry    💎 Mining area       │
│                                     │
│      🏠 Farmhouse                   │
│                                     │
│  🟩🟩🟩 Crop area (Medium)          │
│                                     │
│  ⛏️ Rock deposits   🪨 Ores        │
│                                     │
│  🌊 Small pond                      │
└─────────────────────────────────────┘
```

**Features:**
- ✅ Quarry with renewable ores
- ⚠️ Medium crop area
- ✅ Good for mining + farming mix

---

### 5. **Farm_Combat.xnb** - Wilderness Farm
**Layout:**
```
┌─────────────────────────────────────┐
│  🌲🌲 Dense forest                  │
│                                     │
│      🏠 Farmhouse                   │
│                                     │
│  🟩🟩🟩 Crop area                   │
│                                     │
│  👾 Monster spawns at night        │
│  ⚔️ Combat area                    │
│                                     │
│  💎 Treasure drops                  │
└─────────────────────────────────────┘
```

**Features:**
- ✅ Monsters spawn (combat gameplay)
- ⚠️ Medium crop area
- ✅ Unique wilderness theme

**Issue:** Monsters có thể làm rối automation

---

### 6. **Farm_Foraging.xnb** - Forest Farm
**Layout:**
```
┌─────────────────────────────────────┐
│  🌲🌲🌲🌲 Thick forest              │
│                                     │
│      🏠 Farmhouse                   │
│                                     │
│  🟩🟩 Crop patches (Small, scattered)│
│  🌲 ~ 🟩 ~ 🌲                       │
│                                     │
│  🍄 Forageable items                │
│  🌰 Berry bushes   🌳 Hardwood     │
└─────────────────────────────────────┘
```

**Features:**
- ✅ Lots of forageable items
- ❌ Crop area nhỏ và scattered
- ✅ Renewable hardwood

**Issue:** Không đủ space cho large-scale crop automation

---

### 7. **Farm_FourCorners.xnb** - Four Corners Farm
**Layout:**
```
┌───────────┬───────────────────────┐
│ 🌲 Forest │  🟩🟩🟩 Standard      │
│ Quadrant  │  Crop quadrant        │
│           │                       │
├───────────┼───────────────────────┤
│ 🏔️ Mining │  🌊 Fishing          │
│ Quadrant  │  Quadrant             │
│           │                       │
└───────────┴───────────────────────┘
      🏠 Farmhouse (center)
```

**Features:**
- ✅ Combines all farm types
- ✅ Each corner has different specialty
- ⚠️ Each quadrant is smaller
- ✅ Good for multiplayer (4 players)

---

## 🎯 Recommendation for MLN122 Automated Farming

### Best Choice: **Farm.xnb (Standard Farm)**

**Reasons:**
1. ✅ **Largest contiguous crop area** - Perfect cho automation showcase
2. ✅ **Clear farmhouse + shipping bin** - Có đầy đủ buildings như yêu cầu
3. ✅ **Balanced layout** - Không quá phức tạp, dễ visualize
4. ✅ **Classic Stardew experience** - Người dùng quen thuộc
5. ✅ **Optimal viewport** - Dễ crop viewport có farm + house + crops

### Viewport Suggestion for Farm.xnb

```typescript
// Standard Farm optimal viewport
{
  "source": "Maps/Farm",
  "x": 48,      // Start từ bên trái farmhouse
  "y": 8,       // Start từ trên farmhouse
  "width": 40,  // Wide enough cho farmhouse + crop area
  "height": 36, // Tall enough cho full view
}
```

**This viewport will include:**
- 🏠 Farmhouse (top-center)
- 🚪 Shipping bin (bên cạnh farmhouse)
- 🟩 Large crop area (bottom half)
- 🐄 Barn area (if needed)
- 🌳 Trees as decoration
- 🛤️ Paths connecting everything

---

## 📦 How to Extract & Use

### Option 1: Use xnbcli tool (if available)
```bash
xnbcli unpack "Content\Maps\Farm.xnb" "output\Farm.tbin"
```

### Option 2: Use Stardew modding tools
- **SMAPI Content Patcher**: Access game maps directly
- **Tiled Map Editor**: Edit .tbin files
- **StardewXnbHack**: Convert xnb to readable format

### Option 3: For MLN122 (Recommended)
Create new viewport JSON similar to `farm-ranching-viewport.json` but from **Farm.xnb** instead:

```typescript
// Steps:
1. Extract Farm.xnb to get tile data
2. Crop viewport around farmhouse + crop area
3. Export individual tiles to `/scene-assets/map-tiles/`
4. Create `farm-standard-viewport.json`
5. Update automated-farming.tsx to use new map
```

---

## 🎨 Visual Comparison

### Current (Farm_Ranching):
```
Pros: ✅ Has buildings
Cons: ❌ Crop area small, ❌ Focus on animals not crops
```

### Recommended (Farm):
```
Pros: ✅ Large crop area, ✅ Clear layout, ✅ All buildings, ✅ Balanced
Cons: None for farming automation purpose
```

---

## 🔧 Implementation Steps

1. **Extract Farm.xnb map data**
2. **Identify optimal viewport** (48, 8, 40, 36)
3. **Crop individual tiles** to scene-assets
4. **Create farm-standard-viewport.json**
5. **Update automated-farming.tsx** import
6. **Adjust FARM_AREA coordinates** for new crop positions
7. **Test & verify** all layers render correctly

---

## 📝 Summary

**Current:** Farm_Ranching (animal-focused, small crops)  
**Recommended:** Farm Standard (crop-focused, large area, has all buildings)  

**Benefit of switching:**
- 🌾 Larger automation showcase area
- 🏠 Better farmhouse visibility
- 🚪 Shipping bin included
- 🎯 More suitable for "farming economics" theme
- 👥 More recognizable to players

**Next action:** Extract Farm.xnb and create new viewport?
