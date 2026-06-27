# Sprite Cutting - How It Actually Works

## Problem: Sprite Sheets Are Not Single Images

❌ **WRONG Thinking:**
```
"TileSheets__crops.png is a crop image"
→ Load and display it
```

✅ **CORRECT Understanding:**
```
"TileSheets__crops.png is a GRID of 40+ crops"
→ Need to CUT out the specific 16×32 sprite we want
→ Display only that one sprite
```

## Visual Example

```
Sprite Sheet (256×512px):
┌────────────────────────────────┐
│ [0] [1] [2] [3] [4] ← Row 0    │
│ [5] [6] [7] [8] [9] ← Row 1    │
│ [10][11][12][13][14] ← Row 2   │
│ ... (40+ crops total)          │
└────────────────────────────────┘

We want sprite [7]:
- Position: Column 2, Row 1
- Location: X = 2 × 16px = 32px
           Y = 1 × 32px = 32px
- Size: 16px × 32px
```

## CSS Sprite Cutting Method

### Step 1: Container with Exact Size
```css
.sprite-container {
  width: 16px;          /* Sprite width */
  height: 32px;         /* Sprite height */
  overflow: hidden;     /* CRITICAL: Crop everything outside */
  position: relative;
}
```

### Step 2: Image Inside with Negative Offset
```css
.sprite-container img {
  position: absolute;
  left: -32px;          /* Move LEFT to show column 2 */
  top: -32px;           /* Move UP to show row 1 */
  /* Now sprite [7] is visible in the 16×32 window */
}
```

### Step 3: Scale Everything
```css
.sprite-container {
  width: 16px × 2.5 = 40px;
  height: 32px × 2.5 = 80px;
}

.sprite-container img {
  left: -32px × 2.5 = -80px;
  top: -32px × 2.5 = -80px;
}
```

## Character Layering: The Complex Part

### Character Sprite Sheets Structure

#### 1. Base Character (farmer_base.png)
```
Size: 96px wide × 128px tall
Grid: 6 columns × 4 rows
Each sprite: 16px × 32px

Layout:
Row 0: Walking down animation (4 frames)
Row 1: Walking right animation (4 frames)
Row 2: Walking up animation (4 frames)
Row 3: Walking left animation (4 frames)

We want: Row 0, Column 0 (standing down)
Position: X = 0px, Y = 0px
```

#### 2. Shirts (shirts.png)
```
Size: 128px wide × (128 × 112)px tall
Structure: Each shirt is 128px tall block

Shirt 0: Rows 0-3 (Y: 0-128px)
Shirt 1: Rows 4-7 (Y: 128-256px)
Shirt 2: Rows 8-11 (Y: 256-384px)
...
Shirt N: Y = N × 128px

Within each shirt block:
- Same layout as base character
- 4 directions × 4 frames

We want shirt 5, standing down:
Position: X = 0px, Y = 5 × 128px = 640px
```

#### 3. Pants (pants.png)
```
Size: 192px wide × 688px tall
Structure: Multiple pants per row

Grid: 12 columns × many rows
Each pants: 4 direction sprites = 64px wide
Pants per row: 3 (192px / 64px)

Pants 0: Row 0, Col 0 (X: 0px, Y: 0px)
Pants 1: Row 0, Col 1 (X: 64px, Y: 0px)
Pants 2: Row 0, Col 2 (X: 128px, Y: 0px)
Pants 3: Row 1, Col 0 (X: 0px, Y: 32px)
...

Formula:
row = floor(pantsIndex / 3)
col = pantsIndex % 3
X = col × 64px
Y = row × 32px
```

## Implementation in Code

### Fixed Character Composer

```tsx
// CORRECT sprite cutting
function getBaseSpritePosition() {
  return { x: 0, y: 0 };  // Standing down pose
}

function getShirtSpritePosition(shirtIndex: number) {
  return {
    x: 0,                    // Standing down column
    y: shirtIndex * 128      // Each shirt is 128px tall
  };
}

function getPantsSpritePosition(pantsIndex: number) {
  const pantsPerRow = 3;
  const row = Math.floor(pantsIndex / pantsPerRow);
  const col = pantsIndex % pantsPerRow;
  
  return {
    x: col * 64,   // 64px per pants (4 directions × 16px)
    y: row * 32    // 32px per row
  };
}
```

### CSS Application

```tsx
const imgStyle = (offsetX: number, offsetY: number): CSSProperties => ({
  display: "block",
  position: "absolute",
  left: -offsetX * scale,     // Negative to move image
  top: -offsetY * scale,      // Negative to move image
  imageRendering: "pixelated",
});

// Layer 1: Base (0, 0)
<img src="farmer_base.png" style={imgStyle(0, 0)} />

// Layer 2: Pants index 5
// → row=1, col=2 → X=128px, Y=32px
<img src="pants.png" style={imgStyle(128, 32)} />

// Layer 3: Shirt index 3
// → X=0px, Y=384px
<img src="shirts.png" style={imgStyle(0, 384)} />
```

## Why Previous Attempts Failed

### Attempt 1: Load Full Image
```tsx
<img src="TileSheets__crops.png" className="h-16 w-16" />
```
❌ Result: Shows entire sprite sheet squished into 16×16
❌ Reason: No cropping, just resizing

### Attempt 2: Wrong Object-Position
```tsx
<img 
  src="TileSheets__bushes.png"
  style={{ objectPosition: "-65px 0" }}
/>
```
❌ Result: Wrong offset, wrong sprite shown
❌ Reason: Guessed offset, didn't calculate from grid

### Attempt 3: Wrong Clothing Offset
```tsx
// OLD CODE
style={imgStyle(
  pos.x + (pantsIndex * 192),  // WRONG: 192px is sheet width
  pos.y
)}
```
❌ Result: Shows wrong pants or nothing
❌ Reason: Pants are arranged in grid, not linear

## Correct Implementation ✅

```tsx
<div style={{ width: 16 * scale, height: 32 * scale, overflow: "hidden" }}>
  {/* Base: Standing down (0, 0) */}
  <img 
    src="farmer_base.png"
    style={{ left: 0, top: 0 }}
  />
  
  {/* Pants index 5: Row 1, Col 2 */}
  <img 
    src="pants.png"
    style={{ left: -(2 * 64 * scale), top: -(1 * 32 * scale) }}
  />
  
  {/* Shirt index 3: Row 0, Col 0 of shirt 3 */}
  <img 
    src="shirts.png"
    style={{ left: 0, top: -(3 * 128 * scale) }}
  />
</div>
```

Result: ✅ Character with base + pants + shirt, perfectly aligned!

## Testing Tools

### 1. SpriteSheetViewer
```tsx
<SpriteSheetViewer
  sheet="Characters__Farmer__farmer_base.png"
  spriteWidth={16}
  spriteHeight={32}
  row={0}
  col={0}
  scale={3}
/>
```
Shows: Exactly one 16×32 sprite with red border for verification

### 2. CharacterDebugPanel
- Slider for shirt index (0-20)
- Slider for pants index (0-10)
- Real-time preview
- Raw sprite viewer

### 3. Visual Verification
```
If correct:
✅ Character looks normal, dressed, proportional
✅ Clothing aligns with body
✅ No weird overlaps or gaps

If wrong:
❌ Character looks naked/partial
❌ Clothing offset or misaligned
❌ Shows multiple sprites at once
❌ Shows wrong part of sprite sheet
```

## Key Takeaways

1. **Sprite sheets are grids**, not single images
2. **Must calculate position** from row/column
3. **Each sheet has different structure** - don't assume
4. **Use overflow:hidden** to crop
5. **Negative positioning** to move sprite into view
6. **Scale both container AND offset**
7. **Test with debug tools** before deploying

## Files Updated

- ✅ `character-composer.tsx` - Fixed offset calculations
- ✅ `character-test.tsx` - Debug panel with sliders
- ✅ `SPRITE-CUTTING-EXPLAINED.md` - This document
