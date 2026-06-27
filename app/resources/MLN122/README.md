# MLN122 Pixel Farm Game - Production Quality Refactor

## Overview

The Season of Ground Rent is a 5-7 minute classroom simulation teaching capitalist ground rent through an interactive pixel-style farming game. This refactor transforms the prototype into a polished, production-quality educational experience.

## 📁 Project Structure

```
app/resources/MLN122/
├── page.tsx                    # Main game component (screens & orchestration)
├── layout.tsx                  # Next.js metadata
├── game-model.ts              # Economic calculations & game logic
├── game-styles.css            # Pixel-perfect visual system
│
├── Components/
│   ├── asset-registry.ts      # Centralized asset management
│   ├── pixel-components.tsx   # Reusable pixel art sprites
│   ├── ui-components.tsx      # Polished UI elements
│   ├── farm-scene.tsx         # Main farm visualization
│   ├── village-scene.tsx      # Village & overview scenes
│   ├── result-screen.tsx      # Economic result displays
│   ├── investment-screen.tsx  # Capital allocation UI
│   ├── economic-storytelling.tsx # Educational visualizations
│   ├── animations.tsx         # Animation & game feel
│   └── rendering-utils.ts     # Z-index & rendering system
│
└── public/resources/MLN122/asset/
    └── [342 pixel art assets from Stardew Valley]
```

## 🎨 Visual System

### Asset Organization (8 Categories)

1. **characters/** - Worker sprites (male/female), farmer bases
2. **terrain/** - Grass, soil, trees, fences, paths
3. **crops/** - Growth stages (seedling → growing → mature)
4. **buildings/** - Landlord estates, market, warehouse, silo
5. **ui/** - Buttons, panels, text boxes, cursors
6. **icons/** - Money, workers, tools, productivity indicators
7. **effects/** - Sparkles, shadows, particles
8. **technology_ai/** - Robot sprites, automation visuals

### Color Palette

```css
--color-bg-dark: #182614      /* Deep forest green */
--color-bg-medium: #2d4c28    /* Mid forest green */
--color-bg-light: #6aad62     /* Grass green */
--color-border: #0b1209       /* Almost black */
--color-accent: #f5cf72       /* Gold/yellow */
--color-text-light: #fff5cf   /* Cream */
--color-text-dark: #2d2114    /* Dark brown */
--color-danger: #d94b35       /* Red */
--color-success: #7fc66a      /* Light green */

/* Plot-specific soil colors */
--soil-fertile: #7a4a2a       /* Rich brown */
--soil-average: #9a6236       /* Medium brown */
--soil-poor: #6a4b34          /* Dry brown */
```

### Z-Index Layering System

```
BACKGROUND      = 1   # Sky, panorama
TERRAIN         = 5   # Ground, grass base
DECORATIONS     = 8   # Trees, grass tufts (background)
BUILDINGS       = 10  # Landlord house, market, warehouse
CROPS           = 15  # Farm plot grid with growing crops
CHARACTERS      = 20  # Workers, AI robot (Y-sorted)
EFFECTS         = 30  # Sparkles, shadows, particles
UI_ELEMENTS     = 35  # Overlays, indicators
OVERLAY         = 40  # Modals, transitions
MODAL           = 50  # Top-level popups
```

## 🎮 Game Screens (8 Total)

### 1. Title Screen
- **Components**: VillageHero, SeasonBanner
- **Purpose**: Welcome screen with village panorama
- **Animations**: Fade in, floating elements

### 2. Story Screen
- **Components**: RoleCard, TheoryNote, EconomicRelationshipDiagram
- **Purpose**: Introduce 5 characters (Landlord, Capitalist, Workers, Manager, AI)
- **Theory**: Explain that surplus value comes from living labor

### 3. Land Selection
- **Components**: PlotComparisonView, CompactFarmPreview
- **Purpose**: Choose between 3 plots (Fertile A, Average B, Poor C)
- **Visuals**: Show soil quality, productivity, market access, rent levels

### 4. Investment Screen
- **Components**: InvestmentScreen, Stepper, ToggleOption, InvestmentSummaryBar
- **Purpose**: Allocate capital (workers, seeds, tools, manager, AI)
- **Economics**: Distinguish variable capital (wages) from constant capital

### 5. Farming Scene
- **Components**: FarmScene (8-layer composition), CharacterLayer, FarmPlotGrid
- **Purpose**: Visualize production process with workers and crops
- **Visuals**: 18-cell grid, crop growth stages, worker animations, AI robot

### 6. Result Screen
- **Components**: ResultScreen, ProductionSummary, SurplusValueCard, GroundRentSection
- **Purpose**: Calculate and display economic outcomes
- **Data**: Revenue, costs, surplus value, rent breakdown, profit

### 7. Theory Explanation
- **Components**: TheoryExplanation, ValueFlowDiagram, GroundRentExplanation
- **Purpose**: Explain results in educational context
- **Visuals**: Flow charts, rent components, concept cards

### 8. Summary Screen
- **Components**: SummaryStat, ConfettiBurst
- **Purpose**: Final celebration with key takeaways
- **Data**: Total surplus value, ground rent, capitalist profit

## 📊 Economic Model

### Core Calculations

```typescript
// Value Creation
livingLaborValue = workers × 88 × managerMultiplier × aiMultiplier
surplusValue = livingLaborValue - variableCapital

// Productivity Multipliers
managerMultiplier = manager ? 1.14 : 1
aiMultiplier = aiRobot ? 1.22 : 1
toolMultiplier = 1 + tools × 0.06
seedMultiplier = 1 + seeds × 0.04

// Ground Rent Components
differentialRentI = extraProfit from (fertility + location) vs poor land
differentialRentII = extraProfit from intensive investment
absoluteRent = fixed per plot (fertile: 90c, average: 60c, poor: 35c)
groundRent = absoluteRent + differentialRentI + differentialRentII

// Final Distribution
remainingProfit = surplusValue - groundRent
```

### Investment Costs

```typescript
workerWage: 45c      # Variable capital
seedCost: 28c        # Constant capital
toolCost: 42c        # Constant capital
managerCost: 70c     # Organization cost
aiRobotCost: 110c    # Technology cost
```

## 🎨 Animation System

### Transition Animations
- **ScreenTransition**: Smooth page changes (fade + slide)
- **SlideIn**: Directional entry (left/right/up/down)
- **StaggerContainer**: Sequential reveals
- **PopIn**: Spring-based card entrances

### Economic Storytelling Animations
- **CoinTransferAnimation**: Rent payment visualization (capitalist → landlord)
- **HarvestEffect**: Crop value popup
- **ProductivityBoostEffect**: AI/manager activation
- **ValueCreationPulse**: Workers creating value

### UI Feedback
- **AnimatedButton**: Hover/press states (3 variants)
- **PulseHighlight**: Emphasis effect
- **CountUp**: Number counter
- **Shake**: Error feedback
- **ProgressBar**: Smooth transitions

### CSS Animations (15 Keyframes)
- walkPixel, growCrop, sparkle, pulse, coinTransfer, harvestPop
- bounce, shimmer, float, wiggle, fadeInUp, scaleIn, glow, ripple, slideIn

## 🎓 Educational Design

### Learning Objectives

1. **Value Creation**: Workers create new value through living labor
2. **Surplus Value**: Difference between living labor value and wages
3. **Ground Rent**: Transfer of surplus value to landlord (not value creation)
4. **Differential Rent I**: Natural advantages (fertility, location)
5. **Differential Rent II**: Intensive investment
6. **Absolute Rent**: Basic rent from private ownership
7. **AI/Technology Role**: Raise productivity but don't create surplus value

### Pedagogical Approach

- **Visual First**: Use assets and animations to explain concepts
- **Interactive**: Player makes investment decisions and sees outcomes
- **Context-Specific**: Theory adapts to player's choices
- **Short & Clear**: 5-7 minute gameplay, bite-sized explanations
- **Classroom-Ready**: MLN122 vocabulary, appropriate for economics courses

## 🚀 Adding New Features

### Adding New Assets

1. Add asset definition to `asset-registry.ts`:
```typescript
new_asset: {
  name: "Asset Name",
  file: "Category__filename.png",
  category: "category",
  width: 16,
  height: 16,
  description: "Purpose"
}
```

2. Create component in `pixel-components.tsx`:
```typescript
export function NewAssetSprite({ scale = 2 }) {
  return <Sprite assetId="new_asset" width={16} height={16} scale={scale} />;
}
```

3. Use with proper z-index:
```typescript
<div style={{ zIndex: Z_LAYERS.APPROPRIATE_LAYER }}>
  <NewAssetSprite />
</div>
```

### Adding New Animations

1. Define keyframe in `game-styles.css`:
```css
@keyframes newAnimation {
  0% { /* start state */ }
  100% { /* end state */ }
}
```

2. Create component in `animations.tsx`:
```typescript
export function NewAnimation({ children }) {
  return (
    <motion.div animate={{ /* motion config */ }}>
      {children}
    </motion.div>
  );
}
```

### Adding New Screens

1. Create screen component following pattern:
```typescript
function NewScreen() {
  return (
    <div className="grid gap-5">
      <ScreenHeading eyebrow="..." title="..." text="..." />
      {/* Content */}
    </div>
  );
}
```

2. Add to `screenOrder` in `game-model.ts`
3. Add case in main `page.tsx` switch statement
4. Update screen navigation logic

## 🎯 Key Design Decisions

### Why Pixel Art?
- Approachable, game-like aesthetic reduces cognitive load
- Consistent with educational simulation genre
- Stardew Valley assets provide professional quality
- Clear visual metaphors for abstract economic concepts

### Why Component-Based?
- Reusable across 8 screens
- Consistent styling automatically
- Easy to maintain and extend
- Clear separation of concerns

### Why Framer Motion?
- Declarative animation API
- Built-in spring physics
- AnimatePresence for enter/exit
- Production-ready performance

### Why Manual Y-Sorting?
- Precise control over character depth
- Educational clarity (workers in front of buildings)
- Avoids CSS transform performance issues
- Matches game engine patterns

## 📏 Style Guidelines

### Component Naming
- **Screens**: `TitleScreen`, `StoryScreen` (PascalCase + "Screen")
- **Components**: `WorkerSprite`, `CoinIcon` (PascalCase)
- **Utilities**: `calculateYSortedZIndex` (camelCase)

### CSS Class Naming
- **Layout**: `farm-scene`, `plot-cell` (kebab-case)
- **State**: `pixel-button`, `hover-lift` (semantic)
- **Animation**: `animate-bounce`, `animate-fadeInUp` (prefixed)

### Color Usage
- **Green** (#7fc66a): Workers, living labor, growth, success
- **Gold** (#f5cf72): Surplus value, emphasis, highlights
- **Red** (#d94b35): Landlord, ground rent, costs, danger
- **Blue** (#9ed7ef): Technology, constant capital, information

### Typography
- **Headings**: Black weight (900), tight leading
- **Body**: Regular weight, relaxed leading (1.6)
- **Mono**: Numbers, values, code elements
- **Uppercase**: Labels, eyebrows (0.22em tracking)

## 🔧 Technical Notes

### Performance Optimizations
- Asset preloading system
- CSS-based animations (GPU-accelerated)
- Y-sorting only when needed
- Memoized calculations
- Reduced motion support

### Browser Compatibility
- Modern browsers (ES2020+)
- CSS Grid & Flexbox
- CSS custom properties
- Framer Motion requires JavaScript

### Accessibility
- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Reduced motion respect
- Color contrast ratios met (WCAG AA)

## 📝 Asset Attribution

All pixel art assets derived from Stardew Valley (ConcernedApe).
Used for educational purposes in MLN122 classroom simulation.
342 PNG files converted from XNB format, organized by category.

## 🎓 Classroom Usage

### Recommended Flow
1. **Pre-Game** (5 min): Introduce ground rent theory
2. **Gameplay** (5-7 min): Students play individually
3. **Discussion** (10 min): Compare outcomes, discuss theory
4. **Debrief** (5 min): Reinforce key concepts

### Discussion Prompts
- Why did different plots produce different rents?
- How did AI affect surplus value creation?
- What role did workers play vs technology?
- Who benefits most from better land?

### Learning Assessment
- Can explain surplus value origin
- Can distinguish rent types (absolute, differential I/II)
- Can articulate AI's role in productivity vs value creation
- Can connect to MLN122 textbook concepts

## 🐛 Known Limitations

1. **Simplified Model**: Real agriculture is more complex
2. **Fixed Prices**: No market dynamics or competition
3. **Single Season**: No multi-year planning
4. **Binary Choices**: Manager/AI are on/off (no partial adoption)
5. **No Failure State**: Always produces some output

These limitations are intentional for educational clarity.

## 📚 Further Reading

- Marx, K. (1894). *Capital, Volume III*, Chapter 37-47 (Ground Rent)
- Harvey, D. (2018). *The Limits to Capital*, Chapter 11
- MLN122 Course Materials, Unit 4: Capitalist Ground Rent

---

**Version**: 2.0 (Production Quality Refactor)  
**Target**: MLN122 Economics Course  
**Duration**: 5-7 minutes  
**Last Updated**: 2026-06-27
