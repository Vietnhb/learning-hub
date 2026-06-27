/**
 * Farm Maps Configuration
 * Metadata for all 7 farm types from Stardew Valley
 */

export type FarmType =
  | "standard"
  | "hilltop"
  | "riverland"
  | "forest"
  | "wilderness"
  | "four-corners"
  | "beach";

export interface FarmMapConfig {
  id: FarmType;
  name: string;
  nameVi: string;
  description: string;
  descriptionVi: string;
  tmxFile: string;
  width: number; // tiles
  height: number; // tiles
  farmingZones: FarmingZone[];
  buildings: BuildingLocation[];
  recommended?: boolean;
}

export interface FarmingZone {
  id: string;
  x: number; // grid position
  y: number;
  cols: number;
  rows: number;
  soilType?: "dry" | "dark" | "sand";
}

export interface BuildingLocation {
  type: "farmhouse" | "greenhouse" | "shipping-bin" | "grandpa-shrine";
  x: number;
  y: number;
}

export const FARM_MAPS: Record<FarmType, FarmMapConfig> = {
  standard: {
    id: "standard",
    name: "Standard Farm",
    nameVi: "Trang trại Tiêu chuẩn",
    description: "Largest crop area - perfect for farming focus",
    descriptionVi: "Diện tích trồng trọt lớn nhất - hoàn hảo cho nông nghiệp",
    tmxFile: "Farm.tmx",
    width: 80,
    height: 65,
    recommended: true,
    farmingZones: [
      // Main central farm area
      {
        id: "main",
        x: 15,
        y: 15,
        cols: 50,
        rows: 35,
      },
      // Upper left area
      {
        id: "upper-left",
        x: 5,
        y: 8,
        cols: 25,
        rows: 12,
      },
    ],
    buildings: [
      { type: "farmhouse", x: 64, y: 14 },
      { type: "greenhouse", x: 25, y: 11 },
      { type: "shipping-bin", x: 71, y: 14 },
      { type: "grandpa-shrine", x: 9, y: 7 },
    ],
  },

  hilltop: {
    id: "hilltop",
    name: "Hill-top Farm (Mining)",
    nameVi: "Trang trại Đồi núi (Khai mỏ)",
    description: "Good for crops + mining ore deposits",
    descriptionVi: "Tốt cho cây trồng + khai thác quặng",
    tmxFile: "Farm_Mining.tmx",
    width: 100,
    height: 75,
    farmingZones: [
      // Main plateau
      {
        id: "plateau",
        x: 10,
        y: 18,
        cols: 35,
        rows: 25,
      },
      // Upper plateau
      {
        id: "upper",
        x: 55,
        y: 12,
        cols: 25,
        rows: 15,
      },
    ],
    buildings: [
      { type: "farmhouse", x: 81, y: 19 },
      { type: "greenhouse", x: 37, y: 19 },
      { type: "shipping-bin", x: 88, y: 18 },
      { type: "grandpa-shrine", x: 14, y: 9 },
    ],
  },

  riverland: {
    id: "riverland",
    name: "Riverland Farm (Fishing)",
    nameVi: "Trang trại Ven sông (Câu cá)",
    description: "Limited crop space, great for fishing",
    descriptionVi: "Diện tích trồng trọt hạn chế, tuyệt vời cho câu cá",
    tmxFile: "Farm_Fishing.tmx",
    width: 100,
    height: 75,
    farmingZones: [
      // Small islands
      {
        id: "island-1",
        x: 12,
        y: 20,
        cols: 18,
        rows: 12,
      },
      {
        id: "island-2",
        x: 45,
        y: 15,
        cols: 22,
        rows: 14,
      },
      {
        id: "island-3",
        x: 70,
        y: 25,
        cols: 15,
        rows: 18,
      },
    ],
    buildings: [
      { type: "farmhouse", x: 81, y: 19 },
      { type: "greenhouse", x: 37, y: 19 },
      { type: "shipping-bin", x: 88, y: 18 },
      { type: "grandpa-shrine", x: 14, y: 9 },
    ],
  },

  forest: {
    id: "forest",
    name: "Forest Farm (Foraging)",
    nameVi: "Trang trại Rừng (Hái lượm)",
    description: "Trees and forageable items, moderate crop space",
    descriptionVi: "Cây cối và vật phẩm hái lượm, diện tích trồng trọt vừa phải",
    tmxFile: "Farm_Foraging.tmx",
    width: 100,
    height: 75,
    farmingZones: [
      // Central clearing
      {
        id: "clearing",
        x: 15,
        y: 20,
        cols: 40,
        rows: 30,
      },
      // Small patches
      {
        id: "patch-1",
        x: 60,
        y: 15,
        cols: 20,
        rows: 15,
      },
    ],
    buildings: [
      { type: "farmhouse", x: 81, y: 19 },
      { type: "greenhouse", x: 37, y: 19 },
      { type: "shipping-bin", x: 88, y: 18 },
      { type: "grandpa-shrine", x: 14, y: 9 },
    ],
  },

  wilderness: {
    id: "wilderness",
    name: "Wilderness Farm (Combat)",
    nameVi: "Trang trại Hoang dã (Chiến đấu)",
    description: "Monsters spawn at night, good crop space",
    descriptionVi: "Quái vật xuất hiện vào đêm, diện tích trồng trọt tốt",
    tmxFile: "Farm_Combat.tmx",
    width: 100,
    height: 75,
    farmingZones: [
      // Main area
      {
        id: "main",
        x: 15,
        y: 18,
        cols: 45,
        rows: 32,
      },
      // Upper clearing
      {
        id: "upper",
        x: 10,
        y: 8,
        cols: 30,
        rows: 15,
      },
    ],
    buildings: [
      { type: "farmhouse", x: 81, y: 19 },
      { type: "greenhouse", x: 37, y: 19 },
      { type: "shipping-bin", x: 88, y: 18 },
      { type: "grandpa-shrine", x: 14, y: 9 },
    ],
  },

  "four-corners": {
    id: "four-corners",
    name: "Four Corners Farm",
    nameVi: "Trang trại Bốn góc",
    description: "Four distinct areas for co-op play",
    descriptionVi: "Bốn khu vực riêng biệt cho chơi cùng nhau",
    tmxFile: "Farm_FourCorners.tmx",
    width: 100,
    height: 75,
    farmingZones: [
      // Top-left (standard)
      {
        id: "quadrant-1",
        x: 8,
        y: 8,
        cols: 35,
        rows: 25,
      },
      // Top-right (forest)
      {
        id: "quadrant-2",
        x: 55,
        y: 8,
        cols: 30,
        rows: 25,
      },
      // Bottom-left (mining)
      {
        id: "quadrant-3",
        x: 8,
        y: 42,
        cols: 35,
        rows: 25,
      },
      // Bottom-right (fishing)
      {
        id: "quadrant-4",
        x: 55,
        y: 42,
        cols: 30,
        rows: 25,
      },
    ],
    buildings: [
      { type: "farmhouse", x: 81, y: 19 },
      { type: "greenhouse", x: 37, y: 19 },
      { type: "shipping-bin", x: 88, y: 18 },
      { type: "grandpa-shrine", x: 14, y: 9 },
    ],
  },

  beach: {
    id: "beach",
    name: "Beach Farm (Hilltop Ranching)",
    nameVi: "Trang trại Bãi biển (Chăn nuôi)",
    description: "Sandy soil, perfect for animals",
    descriptionVi: "Đất cát, hoàn hảo cho chăn nuôi",
    tmxFile: "Farm_Ranching.tmx",
    width: 100,
    height: 75,
    farmingZones: [
      // Central grassy area
      {
        id: "main",
        x: 15,
        y: 18,
        cols: 45,
        rows: 32,
        soilType: "dark",
      },
      // Upper plateau
      {
        id: "upper",
        x: 70,
        y: 10,
        cols: 20,
        rows: 15,
        soilType: "dark",
      },
    ],
    buildings: [
      { type: "farmhouse", x: 81, y: 19 },
      { type: "greenhouse", x: 37, y: 19 },
      { type: "shipping-bin", x: 88, y: 18 },
      { type: "grandpa-shrine", x: 14, y: 9 },
    ],
  },
};

/**
 * Get farming zone by farm type and zone ID
 */
export function getFarmingZone(
  farmType: FarmType,
  zoneId?: string,
): FarmingZone {
  const farmConfig = FARM_MAPS[farmType];
  if (!zoneId) {
    return farmConfig.farmingZones[0]; // Default to first zone
  }
  const zone = farmConfig.farmingZones.find((z) => z.id === zoneId);
  return zone || farmConfig.farmingZones[0];
}

/**
 * Get all farmable tiles for a farm type
 */
export function getAllFarmableTiles(farmType: FarmType): Array<{ x: number; y: number }> {
  const config = FARM_MAPS[farmType];
  const tiles: Array<{ x: number; y: number }> = [];

  for (const zone of config.farmingZones) {
    for (let row = 0; row < zone.rows; row++) {
      for (let col = 0; col < zone.cols; col++) {
        tiles.push({
          x: zone.x + col,
          y: zone.y + row,
        });
      }
    }
  }

  return tiles;
}

/**
 * Check if a position is within any farming zone
 */
export function isFarmablePosition(
  farmType: FarmType,
  x: number,
  y: number,
): boolean {
  const config = FARM_MAPS[farmType];

  return config.farmingZones.some(
    (zone) =>
      x >= zone.x &&
      x < zone.x + zone.cols &&
      y >= zone.y &&
      y < zone.y + zone.rows,
  );
}
