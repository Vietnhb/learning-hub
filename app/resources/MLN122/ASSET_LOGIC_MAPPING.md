# 🎨 Asset Logic Mapping - MLN122 Automated Farming

## Kiến trúc Stardew Valley áp dụng vào MLN122

Dựa trên phân tích từ Stardew Valley game code, đây là logic map asset hiển thị đất trồng cây:

---

## 📦 Cấu trúc Class (Stardew Valley)

```csharp
// Stardew Valley Source Structure
StardewValley.TerrainFeatures.HoeDirt
├── Crop crop                        // Cây trồng (nếu có)
│   ├── int currentPhase             // Giai đoạn hiện tại (0-N)
│   ├── List<int> phaseDays          // Số ngày mỗi giai đoạn
│   ├── int rowInSpriteSheet         // Hàng trong crops.xnb
│   ├── string netSeedIndex          // ID hạt giống
│   └── int indexOfHarvest           // ID vật phẩm thu hoạch
├── string fertilizer                 // Loại phân bón
├── int state                         // 0=dry, 1=watered
└── Vector2 Tile                      // Vị trí trên map
```

---

## 🎯 Logic Render trong Stardew Valley

### Step 1: Render Base (HoeDirt)

```csharp
// Game1.spriteBatch.Draw() trong HoeDirt.draw()
Texture2D hoeDirtTexture = Game1.content.Load<Texture2D>("TerrainFeatures/hoeDirt");

// Source rectangle trong texture
Rectangle sourceRect = new Rectangle(
    state * 16,  // 0 for dry, 16 for watered
    0,
    16,
    16
);

// Vẽ lên màn hình tại vị trí tile
spriteBatch.Draw(
    hoeDirtTexture,
    position,
    sourceRect,
    Color.White
);
```

### Step 2: Render Crop (Overlay)

```csharp
// Nếu có crop
if (this.crop != null)
{
    Texture2D cropsTexture = Game1.content.Load<Texture2D>("TileSheets/crops");
    
    // Tính source rect từ crops.xnb
    int cropRow = crop.rowInSpriteSheet;
    int cropPhase = crop.currentPhase;
    
    Rectangle cropRect = new Rectangle(
        cropPhase * 16,      // Cột = giai đoạn
        cropRow * 32,        // Hàng = loại cây
        16,                  // Width
        32                   // Height (taller than tile)
    );
    
    // Vẽ crop lên trên HoeDirt
    spriteBatch.Draw(
        cropsTexture,
        position + new Vector2(0, -16), // Offset lên trên
        cropRect,
        Color.White
    );
}
```

---

## 🔧 MLN122 Implementation

### TypeScript Equivalent

```typescript
// MLN122 Tile State
interface Tile {
  x: number;
  y: number;
  state: TileState;  // "grass" | "tilled" | "seeded" | "growing" | "harvestable"
  growthStage: number;  // 0-3 (maps to crop phase)
  hasWorker: boolean;
}

// Render logic
function TileView({ tile, soilType }: Props) {
  // 1. Base layer (HoeDirt equivalent)
  const soilSprite = tile.state === "grass" 
    ? null 
    : `crops/soil-${soilType}.png`;
  
  // 2. Crop layer (Crop equivalent)
  const cropSprite = (tile.state === "growing" || tile.state === "harvestable")
    ? `crops/crop-row-${tile.x % 5 * 2}-stage-${tile.growthStage + 1}.png`
    : null;
  
  return (
    <div style={{ position: "absolute", left: tile.x * 16, top: tile.y * 16 }}>
      {/* Base soil */}
      {soilSprite && <img src={soilSprite} style={{ width: 16, height: 16 }} />}
      
      {/* Crop overlay */}
      {cropSprite && (
        <img 
          src={cropSprite} 
          style={{ 
            position: "absolute",
            top: -14,  // Offset lên trên như Stardew
            width: 16, 
            height: 32 
          }} 
        />
      )}
    </div>
  );
}
```

---

## 📊 Asset Sprite Sheet Structure

### HoeDirt Texture (16×16 per frame)

```
soil-dry.png:    [Dry Frame]
soil-dark.png:   [Dark Soil Frame]

Layout: Single 16×16 sprite per file
Usage: Background base cho mỗi farmable tile
```

### Crops Texture (16×32 per sprite)

```
crop-row-0-stage-1.png   ← Parsnip stage 1
crop-row-0-stage-2.png   ← Parsnip stage 2
crop-row-0-stage-3.png   ← Parsnip stage 3 (harvest)

crop-row-2-stage-1.png   ← Cauliflower stage 1
...

Layout: 
- Width: 16px
- Height: 32px (extend above tile)
- Each crop type = 1 row
- Each stage = separate file (simplified from Stardew's atlas)
```

### Stardew Original vs MLN122

| Aspect | Stardew Valley | MLN122 |
|--------|----------------|--------|
| **HoeDirt** | Single texture atlas with frames | Separate files per state |
| **Crops** | Single atlas (8×N grid) | Separate files per crop-stage combo |
| **Animation** | Frame switching in atlas | Image swapping between files |
| **File count** | ~3 files (hoeDirt.xnb, crops.xnb, hoeDirtSnow.xnb) | ~20 files (pre-cropped for simplicity) |

---

## 🎬 Animation Timeline

### Stardew Valley Daily Update

```csharp
// HoeDirt.dayUpdate() - Called each game day
public void dayUpdate(GameLocation environment, Vector2 tileLocation)
{
    // 1. Check if watered
    if (this.state == 1) // watered
    {
        this.state = 0; // Become dry next day
    }
    
    // 2. Grow crop
    if (this.crop != null)
    {
        this.crop.newDay(state, fertilizer, ...);
        // crop.newDay() increments currentPhase if conditions met
    }
}
```

### MLN122 Automation Loop

```typescript
// Auto-farming cycle (simplified, faster for demo)
useEffect(() => {
  const interval = setInterval(() => {
    switch(cyclePhase) {
      case "tilling":
        // Workers cày đất: grass → tilled
        break;
      
      case "planting":
        // Workers gieo hạt: tilled → seeded
        break;
      
      case "growing":
        // Auto grow: seeded → growing (stage++)
        // No worker needed, just time passing
        dayCounter++;
        if (tile.growthStage < 3) {
          tile.growthStage++;
        }
        break;
      
      case "harvesting":
        // Workers thu hoạch: harvestable → grass
        break;
    }
  }, ANIMATION_SPEED);
}, [cyclePhase]);
```

---

## 🔑 Key Differences

### Stardew Valley Approach
- **Tile-based**: Mỗi tile là object trong world grid
- **Event-driven**: Player action → State change → Render update
- **Daily cycle**: Time passes → dayUpdate() → Crop grows
- **Texture atlas**: Efficient với sprite sheet lớn
- **Multiplayer sync**: Network replication of tile states

### MLN122 Automated Approach
- **Animation-driven**: Auto-loop thay vì player input
- **Fast cycle**: ~600ms per action vs 24 real minutes per day
- **Separate sprites**: Dễ debug, dễ customize
- **Educational focus**: Trực quan hóa kinh tế học, không phải gameplay
- **Single-player**: Không cần sync network

---

## 🌱 Growth Stage Mapping

| Stardew `currentPhase` | MLN122 `growthStage` | Visual | State |
|------------------------|----------------------|--------|-------|
| 0 | 0 | Just seeded (invisible or seed sprite) | `seeded` |
| 1 | 1 | Small sprout | `growing` |
| 2 | 2 | Medium plant | `growing` |
| 3 | 3 | Full grown (harvest ready) | `harvestable` |
| 4+ | N/A | Some crops regrow (berries, corn) | Not implemented |

---

## 🚀 Performance Optimization

### Stardew Valley
```csharp
// SpriteBatch batching
spriteBatch.Begin();
foreach (TerrainFeature feature in location.terrainFeatures.Values)
{
    feature.draw(spriteBatch); // Batched draw calls
}
spriteBatch.End();
```

### MLN122 React
```typescript
// Virtual DOM diffing + CSS transforms
{tiles.map(tile => (
  <TileView key={`${tile.x}-${tile.y}`} tile={tile} />
  // React only re-renders changed tiles
))}

// Hardware-accelerated CSS
style={{
  transform: `translate3d(${x}px, ${y}px, 0)`,
  imageRendering: "pixelated"
}}
```

---

## 📝 Conclusion

MLN122's automated farming system áp dụng đúng **core architecture** của Stardew Valley:

✅ **HoeDirt base + Crop overlay**  
✅ **Sprite sheet row/column logic**  
✅ **Growth stages over time**  
✅ **Worker actions modify tile state**  

Nhưng được **simplified** và **automated** cho mục đích giáo dục:

🎓 **Educational goal**: Visualize economic theory  
🤖 **Automation**: No player input required  
⚡ **Fast cycle**: Demo-friendly speed  
🎨 **Clear visuals**: Easy to understand cause-effect  

Kết quả: Một farm simulation **giống gif tự động chạy**, thể hiện quan hệ kinh tế giữa lao động - vốn - tô điền!
