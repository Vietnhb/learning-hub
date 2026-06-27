# 🤖 Automated Farming System - MLN122

## Tổng quan

Hệ thống **Automated Farming** mô phỏng nông trang tự động với AI nhân vật thực hiện các công việc như trong Stardew Valley, nhưng **hoàn toàn tự động** - không cần người chơi tương tác.

## Cách hoạt động

### 🎮 Logic tự động

Nhân vật AI tự động thực hiện chu trình farming:

```
1. Setup → 2. Tilling (Cày đất) → 3. Planting (Gieo hạt) 
   → 4. Growing (Phát triển) → 5. Harvesting (Thu hoạch) → Lặp lại
```

### 👷 Nhân vật Worker

- **Số lượng**: Theo `investment.workers` (tối đa 6 hiển thị)
- **Di chuyển**: Tự động pathfinding đến tile cần làm việc
- **Hành động**: 
  - 🔨 Hoeing (Cày đất)
  - 💧 Watering (Tưới nước)
  - 🌱 Planting (Gieo hạt)
  - ✂️ Harvesting (Thu hoạch)

### 🌾 Tile States

```typescript
type TileState = 
  | "grass"        // Cỏ ban đầu
  | "tilled"       // Đất đã cày
  | "watered"      // Đất đã tưới
  | "seeded"       // Vừa gieo hạt
  | "growing"      // Đang phát triển
  | "harvestable"  // Có thể thu hoạch
```

### 🎨 Asset Mapping

Dựa theo cấu trúc Stardew Valley:

1. **HoeDirt** (Đất cày):
   - `soil-dry.png` - Đất thường
   - `soil-dark.png` - Đất màu tối
   
2. **Crops** (Cây trồng):
   - `crop-row-{N}-stage-{1|2|3}.png`
   - Stage 1: Mới mọc
   - Stage 2: Đang lớn
   - Stage 3: Thu hoạch

3. **Workers** (Công nhân):
   - `worker-v2-male-{N}.png`
   - `worker-v2-female-{N}.png`

## So sánh với Stardew Valley

### Giống Stardew Valley:
✅ Logic HoeDirt + Crop overlay  
✅ Sprite animation theo giai đoạn  
✅ Worker di chuyển và làm việc  
✅ Chu trình canh tác hoàn chỉnh  

### Khác biệt:
❌ Stardew: Người chơi điều khiển trực tiếp  
✅ MLN122: AI tự động hoàn toàn (như gif)  

❌ Stardew: Realtime với thời gian game  
✅ MLN122: Animation loop nhanh để demo  

## Cấu hình

### Animation Speed
```typescript
const ANIMATION_SPEED = 600;      // ms per action
const WORKER_MOVE_SPEED = 150;    // ms per tile movement
```

### Farm Area
```typescript
const FARM_AREA = {
  startX: 3,
  startY: 4,
  cols: 14,   // 14 tiles wide
  rows: 8,    // 8 tiles tall
};
// Total: 112 tiles (14×8)
```

## Sử dụng

### Trong page.tsx

```tsx
import { AutomatedFarmingScene } from "./automated-farming";

// Trong component
<AutomatedFarmingScene 
  plot={selectedPlot} 
  investment={investment} 
/>
```

### Toggle automation

Button trong header cho phép switch giữa:
- 🤖 **Automated mode**: AI tự động làm việc
- 📺 **Static mode**: Scene tĩnh (FarmScene cũ)

## Performance

- **60 FPS** animation smooth
- **Optimized rendering**: Chỉ render tiles thay đổi
- **Worker pooling**: Tái sử dụng worker entities
- **Lazy loading**: Chỉ load assets khi cần

## Future Enhancements

Có thể mở rộng:

1. **Weather effects**: Mưa, tuyết ảnh hưởng crops
2. **Seasons**: Spring/Summer/Fall/Winter sprites
3. **Tools upgrade**: Hoe → Iron Hoe → Gold Hoe
4. **Fertilizer**: Speed-Gro, Quality Fertilizer
5. **Animals**: Chickens, cows đi dạo tự động
6. **Market cycle**: Tự động bán harvest, mua seeds mới

## Technical Stack

- **React Hooks**: useState, useEffect cho animation loop
- **TypeScript**: Type-safe tile và worker states
- **CSS Animations**: Smooth sprite transitions
- **Pixel Art**: 16×16 tiles, 16×32 crops, pixelated rendering

## Credits

- **Inspired by**: Stardew Valley (ConcernedApe)
- **Game logic**: MLN122 Economic Theory Model
- **Assets**: Cropped from Stardew Valley content (educational use)
