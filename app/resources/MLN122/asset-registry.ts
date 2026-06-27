/**
 * Asset Registry for MLN122 Pixel Farm Game
 * Centralized asset management with organized categories
 */

const ASSET_BASE = "/resources/MLN122/asset";

export type AssetCategory = 
  | "characters"
  | "terrain"
  | "crops"
  | "buildings"
  | "ui"
  | "icons"
  | "effects"
  | "technology_ai";

export interface AssetDefinition {
  name: string;
  file: string;
  category: AssetCategory;
  width?: number;
  height?: number;
  spriteX?: number;
  spriteY?: number;
  description?: string;
}

/**
 * Organized asset registry with clear categorization
 */
export const ASSET_REGISTRY: Record<string, AssetDefinition> = {
  // ===== CHARACTERS =====
  worker_male: {
    name: "Worker (Male)",
    file: "Characters__Farmer__farmer_base.png",
    category: "characters",
    width: 16,
    height: 32,
    description: "Agricultural worker sprite"
  },
  worker_female: {
    name: "Worker (Female)",
    file: "Characters__Farmer__farmer_girl_base.png",
    category: "characters",
    width: 16,
    height: 32,
    description: "Agricultural worker sprite"
  },
  
  // ===== BUILDINGS =====
  landlord_barn: {
    name: "Landlord Estate (Barn)",
    file: "Buildings__Barn.png",
    category: "buildings",
    description: "Fertile land landlord building"
  },
  landlord_big_barn: {
    name: "Landlord Estate (Big Barn)",
    file: "Buildings__Big Barn.png",
    category: "buildings",
    description: "Average land landlord building"
  },
  landlord_coop: {
    name: "Landlord Estate (Coop)",
    file: "Buildings__Coop.png",
    category: "buildings",
    description: "Poor land landlord building"
  },
  market_shed: {
    name: "Market Building",
    file: "Buildings__Shed.png",
    category: "buildings",
    description: "Village market where crops are sold"
  },
  shipping_bin: {
    name: "Shipping Container",
    file: "Buildings__Shipping Bin.png",
    category: "buildings",
    description: "Crop shipping container at market"
  },
  warehouse: {
    name: "Warehouse",
    file: "Buildings__Big Shed.png",
    category: "buildings",
    description: "Storage and tool warehouse"
  },
  silo: {
    name: "Silo",
    file: "Buildings__Silo.png",
    category: "buildings",
    description: "Grain storage silo"
  },
  
  // ===== TERRAIN =====
  grass_tuft: {
    name: "Grass",
    file: "TerrainFeatures__grass.png",
    category: "terrain",
    width: 16,
    height: 16,
    description: "Decorative grass tufts"
  },
  hoe_dirt: {
    name: "Tilled Soil",
    file: "TerrainFeatures__hoeDirt.png",
    category: "terrain",
    width: 16,
    height: 16,
    description: "Prepared farmland"
  },
  hoe_dirt_dark: {
    name: "Tilled Soil (Dark)",
    file: "TerrainFeatures__hoeDirtDark.png",
    category: "terrain",
    width: 16,
    height: 16,
    description: "Dark variant farmland"
  },
  tree_oak_summer: {
    name: "Oak Tree (Summer)",
    file: "TerrainFeatures__tree1_summer.png",
    category: "terrain",
    description: "Background decoration tree"
  },
  tree_maple_summer: {
    name: "Maple Tree (Summer)",
    file: "TerrainFeatures__tree2_summer.png",
    category: "terrain",
    description: "Background decoration tree"
  },
  tree_pine_summer: {
    name: "Pine Tree (Summer)",
    file: "TerrainFeatures__tree3_spring.png",
    category: "terrain",
    description: "Background decoration tree"
  },
  fence_wood: {
    name: "Wooden Fence",
    file: "LooseSprites__Fence1.png",
    category: "terrain",
    description: "Field boundary fence"
  },
  
  // ===== CROPS =====
  crop_stage_1: {
    name: "Crop Seedling",
    file: "TileSheets__crops.png",
    category: "crops",
    width: 16,
    height: 32,
    spriteX: 0,
    spriteY: 0,
    description: "Early growth stage"
  },
  crop_stage_2: {
    name: "Crop Growing",
    file: "TileSheets__crops.png",
    category: "crops",
    width: 16,
    height: 32,
    spriteX: -16,
    spriteY: 0,
    description: "Mid growth stage"
  },
  crop_stage_3: {
    name: "Crop Mature",
    file: "TileSheets__crops.png",
    category: "crops",
    width: 16,
    height: 32,
    spriteX: -32,
    spriteY: 0,
    description: "Harvest ready stage"
  },
  seed_bag: {
    name: "Seeds",
    file: "TileSheets__crops.png",
    category: "crops",
    width: 16,
    height: 16,
    spriteX: 0,
    spriteY: 0,
    description: "Seed package icon"
  },
  
  // ===== UI & ICONS =====
  icon_coin: {
    name: "Coin",
    file: "LooseSprites__Cursors.png",
    category: "icons",
    width: 16,
    height: 16,
    spriteX: -280,
    spriteY: -410,
    description: "Money/currency icon"
  },
  icon_worker: {
    name: "Worker Icon",
    file: "LooseSprites__Cursors.png",
    category: "icons",
    width: 16,
    height: 16,
    description: "Labor/worker icon"
  },
  ui_button_panel: {
    name: "Button Panel",
    file: "LooseSprites__Cursors.png",
    category: "ui",
    description: "UI button background"
  },
  ui_textbox: {
    name: "Text Box",
    file: "LooseSprites__textBox.png",
    category: "ui",
    description: "Dialogue and info box"
  },
  
  // ===== TECHNOLOGY & AI =====
  ai_robot_body: {
    name: "AI Farming Robot",
    file: "TileSheets__companions.png",
    category: "technology_ai",
    width: 16,
    height: 24,
    description: "AI agricultural assistant robot"
  },
  
  // ===== EFFECTS =====
  particles_sparkle: {
    name: "Sparkle Effect",
    file: "TileSheets__animations.png",
    category: "effects",
    width: 16,
    height: 16,
    description: "Productivity boost visual"
  },
  shadow_small: {
    name: "Small Shadow",
    file: "LooseSprites__shadow.png",
    category: "effects",
    description: "Character shadow"
  },
  
  // ===== BACKGROUND & ENVIRONMENT =====
  panorama_sky: {
    name: "Sky Panorama",
    file: "LooseSprites__stardewPanorama.png",
    category: "terrain",
    description: "Background sky"
  },
  farm_map_fertile: {
    name: "Fertile Plot Map",
    file: "LooseSprites__Farm_ranching_map.png",
    category: "terrain",
    description: "Plot A visualization"
  },
  farm_map_average: {
    name: "Average Plot Map",
    file: "LooseSprites__Farm_ranching_map_summer.png",
    category: "terrain",
    description: "Plot B visualization"
  },
  farm_map_poor: {
    name: "Poor Plot Map",
    file: "LooseSprites__Farm_ranching_map_fall.png",
    category: "terrain",
    description: "Plot C visualization"
  },
  
  // ===== ANIMALS (decorative) =====
  animal_cow: {
    name: "Cow",
    file: "Animals__Brown Cow.png",
    category: "effects",
    description: "Farm animal decoration"
  },
  animal_chicken: {
    name: "Chicken",
    file: "Animals__White Chicken.png",
    category: "effects",
    description: "Farm animal decoration"
  },
  animal_horse: {
    name: "Horse",
    file: "Animals__horse.png",
    category: "effects",
    description: "Farm animal decoration"
  },
  
  // ===== TOOLS =====
  tool_hoe: {
    name: "Hoe",
    file: "TileSheets__tools.png",
    category: "icons",
    width: 16,
    height: 16,
    spriteX: 0,
    spriteY: -16,
    description: "Farming tool icon"
  },
  tool_watering_can: {
    name: "Watering Can",
    file: "TileSheets__tools.png",
    category: "icons",
    width: 16,
    height: 16,
    spriteX: -16,
    spriteY: -16,
    description: "Farming tool icon"
  },
  craftable_hay_crate: {
    name: "Hay Crate",
    file: "TileSheets__Craftables.png",
    category: "effects",
    width: 16,
    height: 32,
    spriteX: -16,
    spriteY: -336,
    description: "Farm storage decoration"
  },
};

/**
 * Get full URL for an asset file
 */
export function getAssetUrl(fileName: string): string {
  return `${ASSET_BASE}/${encodeURIComponent(fileName)}`;
}

/**
 * Get asset definition by ID
 */
export function getAsset(id: string): AssetDefinition | undefined {
  return ASSET_REGISTRY[id];
}

/**
 * Get all assets in a category
 */
export function getAssetsByCategory(category: AssetCategory): AssetDefinition[] {
  return Object.values(ASSET_REGISTRY).filter(asset => asset.category === category);
}

/**
 * Preload critical assets for the game
 */
export function preloadGameAssets(): Promise<void[]> {
  const criticalAssets = [
    // Characters
    "worker_male",
    "worker_female",
    // Buildings
    "landlord_barn",
    "landlord_big_barn",
    "landlord_coop",
    "market_shed",
    "shipping_bin",
    // Terrain
    "panorama_sky",
    "farm_map_fertile",
    "farm_map_average",
    "farm_map_poor",
    "grass_tuft",
    "tree_oak_summer",
    "tree_maple_summer",
    // Crops
    "crop_stage_1",
    "crop_stage_2",
    "crop_stage_3",
    // Effects
    "shadow_small",
  ];

  const promises = criticalAssets.map(id => {
    const asset = getAsset(id);
    if (!asset) return Promise.resolve();
    
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load ${asset.file}`));
      img.src = getAssetUrl(asset.file);
    });
  });

  return Promise.all(promises);
}

/**
 * Asset categories for documentation
 */
export const ASSET_CATEGORIES: Record<AssetCategory, string> = {
  characters: "Character sprites (workers, capitalist, landlord)",
  terrain: "Environment and landscape elements",
  crops: "Agricultural products and growth stages",
  buildings: "Structures (houses, market, warehouse)",
  ui: "User interface components",
  icons: "Small icons for UI elements",
  effects: "Visual effects and decorations",
  technology_ai: "Technology and AI robot assets",
};
