# Character Layering System - Proper Clothing Overlay

## Vấn Đề Trước Đó

**Lỗi:** Characters chỉ hiển thị base body (naked character), không có quần áo.

## Giải Pháp: CSS Layered Character System

### 1. **Character Assets Structure**

Stardew Valley characters gồm nhiều layers:

```
Layer 1: farmer_base.png (Male) hoặc farmer_girl_base.png (Female)
         └─ Base body (naked character)
         └─ 16×32px per sprite
         └─ Grid: 4 cols (directions) × many rows (animations)

Layer 2: pants.png
         └─ Overlay pants on body
         └─ 192px wide per pants style
         └─ 154 pants styles total

Layer 3: shirts.png  
         └─ Overlay shirt on body
         └─ 8px wide per shirt
         └─ 112 shirt styles total

Layer 4: accessories.png (optional)
         └─ Hats, glasses, etc.
```

### 2. **Character Direction & Animation**

Grid structure:
```
Column 0: Down (facing camera)
Column 1: Right (facing right)
Column 2: Up (facing away)
Column 3: Left (facing left)

Each direction has 4 animation frames (rows)
```

### 3. **CSS Layering Method**

```tsx
<div className="character-container" style={{ width: 16 * scale, height: 32 * scale }}>
  
  {/* Layer 1: Base body */}
  <div style={{ position: 'absolute', overflow: 'hidden' }}>
    <img 
      src="farmer_base.png"
      style={{
        transform: 'scale(2.5)',
        position: 'relative',
        left: -(direction_col * 16) + 'px',
        top: -(frame * 32) + 'px'
      }}
    />
  </div>

  {/* Layer 2: Pants */}
  <div style={{ position: 'absolute', overflow: 'hidden' }}>
    <img 
      src="pants.png"
      style={{
        transform: 'scale(2.5)',
        position: 'relative',
        left: -(direction_col * 16 + pants_index * 192) + 'px',
        top: -(frame * 32) + 'px'
      }}
    />
  </div>

  {/* Layer 3: Shirt */}
  <div style={{ position: 'absolute', overflow: 'hidden' }}>
    <img 
      src="shirts.png"
      style={{
        transform: 'scale(2.5)',
        position: 'relative',
        left: -(direction_col * 16 + shirt_index * 8) + 'px',
        top: -(frame * 32) + 'px'
      }}
    />
  </div>
  
</div>
```

**Cách hoạt động:**
1. Container `div` set kích thước chính xác (16×32 scaled)
2. Mỗi layer là `div` với `position: absolute` và `overflow: hidden`
3. Image bên trong dùng `position: relative` + offset để di chuyển đến sprite cần thiết
4. Container crop phần thừa

### 4. **File Mới: character-composer.tsx**

#### Main Component: `LayeredCharacter`
```tsx
<LayeredCharacter
  gender="male"              // male | female
  direction="down"           // down | right | up | left
  frame={0}                  // 0-3 animation frame
  shirtIndex={5}             // 0-111 shirt styles
  pantsIndex={2}             // 0-153 pants styles
  scale={2.5}
/>
```

#### Preset Characters:

**WorkerCharacter** - 4 clothing variants
```tsx
<WorkerCharacter
  gender="male"
  variant={0}      // 0-3: Different clothing combinations
  scale={2.5}
/>
```

Variants:
- Variant 0: Blue shirt, brown pants
- Variant 1: Red shirt, blue pants
- Variant 2: Green shirt, gray pants
- Variant 3: Yellow shirt, tan pants

**ManagerCharacter** - Professional attire
```tsx
<ManagerCharacter scale={2.5} />
```
- Formal shirt (index 10)
- Dress pants (index 8)

**LandlordCharacter** - Wealthy appearance
```tsx
<LandlordCharacter scale={2.5} />
```
- Fancy shirt (index 15)
- Formal pants (index 10)

**CapitalistCharacter** - Business casual
```tsx
<CapitalistCharacter scale={2.5} />
```
- Business shirt (index 8)
- Nice pants (index 5)

### 5. **Updated pixel-components.tsx**

**Trước:**
```tsx
export function WorkerSprite({ variant, scale }) {
  return (
    <Sprite 
      assetId="worker_male"
      width={16}
      height={32}
      scale={scale}
    />
  );
}
```
❌ Chỉ hiển thị naked base character

**Sau:**
```tsx
export function WorkerSprite({ variant, delay, scale }) {
  const clothingVariant = Math.floor(delay * 2) % 4;
  
  return (
    <WorkerCharacter
      gender={variant}
      variant={clothingVariant}
      scale={scale}
    />
  );
}
```
✅ Hiển thị character with base + pants + shirt layers

### 6. **Shirt & Pants Indexes**

#### Popular Shirts (shirts.png):
```
0:  Blue basic
1:  Red basic
2:  Purple basic
3:  Green basic
4:  White basic
5:  Yellow basic
8:  Business shirt
10: Formal white
15: Fancy vest
20: Farmer shirt
22: Fisher vest
```

#### Popular Pants (pants.png):
```
0:  Brown work pants
1:  Gray pants
2:  Blue jeans
3:  Green pants
4:  Tan khakis
5:  Black dress pants
8:  Formal trousers
10: Suit pants
15: Blue jeans (dark)
20: Overalls
```

### 7. **Worker Variety System**

```tsx
// Each worker gets different clothing based on delay
const clothingVariant = Math.floor(delay * 2) % 4;

Workers:
- delay 0.0 → variant 0 → Blue shirt, brown pants
- delay 0.2 → variant 0 → Blue shirt, brown pants
- delay 0.4 → variant 0 → Blue shirt, brown pants
- delay 0.6 → variant 1 → Red shirt, blue pants
- delay 0.8 → variant 1 → Red shirt, blue pants
- delay 1.0 → variant 2 → Green shirt, gray pants
```

Result: Workers have visual variety!

### 8. **Animation System**

Characters use CSS animation for walking:
```css
@keyframes walkPixel {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
```

Layered character stays at frame 0 (standing pose), animation is visual bounce only.

For full walking animation (frame 0→1→2→3), update `frame` prop on interval.

## Kết Quả

### ✅ Trước vs Sau:

**Trước:**
```
👤 Naked base character
❌ No clothing
❌ All workers look identical
❌ Unprofessional appearance
```

**Sau:**
```
👔 Fully dressed characters
✅ Base + Pants + Shirt layers
✅ 4 worker clothing variants
✅ Professional characters (manager, landlord, capitalist)
✅ Proper CSS overlay
✅ Pixel-perfect rendering
```

## Usage Examples

### Example 1: Group of Workers
```tsx
<div className="workers flex gap-2">
  <WorkerCharacter gender="male" variant={0} scale={2.5} />
  <WorkerCharacter gender="female" variant={1} scale={2.5} />
  <WorkerCharacter gender="male" variant={2} scale={2.5} />
  <WorkerCharacter gender="female" variant={3} scale={2.5} />
</div>
```

### Example 2: Manager vs Worker Comparison
```tsx
<div className="comparison flex gap-4">
  <div className="text-center">
    <WorkerCharacter gender="male" variant={0} scale={3} />
    <p>Worker</p>
  </div>
  <div className="text-center">
    <ManagerCharacter scale={3} />
    <p>Manager</p>
  </div>
</div>
```

### Example 3: Custom Clothing
```tsx
<LayeredCharacter
  gender="female"
  direction="down"
  frame={0}
  shirtIndex={22}  // Fisher vest
  pantsIndex={20}  // Overalls
  scale={2.5}
/>
```

## Technical Notes

### Sprite Sheet Coordinates
```
Direction columns (4 total):
0: Down  (16×0 to 16×32)
1: Right (32×0 to 48×32)
2: Up    (48×0 to 64×32)
3: Left  (64×0 to 80×32)

Animation frames (4 per direction):
Frame 0: Y offset 0
Frame 1: Y offset 32
Frame 2: Y offset 64
Frame 3: Y offset 96
```

### Clothing Offsets
```tsx
// Shirts: 8px per shirt, aligned with character grid
shirtOffsetX = (direction * 16) + (shirtIndex * 8)

// Pants: 192px per pants style (48px × 4 directions)
pantsOffsetX = (direction * 16) + (pantsIndex * 192)
```

### Performance
- Each character: 3 images (base + pants + shirt)
- Browser caches sprite sheets
- CSS positioning is GPU-accelerated
- No canvas rendering needed

## Next Steps

- ✅ Layered character system
- ✅ Worker clothing variants
- ✅ Manager/Landlord/Capitalist presets
- 🔄 Add accessories layer (hats, glasses)
- 🔄 Add animation frames (walking cycles)
- 🔄 Add hair styles layer
- 🔄 Character customization UI (optional)
