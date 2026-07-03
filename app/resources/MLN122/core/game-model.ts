export type Screen =
  | "title"
  | "story"
  | "land"
  | "investment"
  | "farming"
  | "result"
  | "theory"
  | "summary"
  | "quiz"
  | "leaderboard";

export type PlotId = "fertile" | "average" | "poor";

export type Plot = {
  id: PlotId;
  title: string;
  short: string;
  location: string;
  productivity: number;
  marketBonus: number;
  absoluteRent: number;
  rentPressure: string;
  soil: string;
  crop: string;
  description: string;
  mapAsset: string;
  buildingAsset: string;
};

export type InvestmentState = {
  workers: number;
  seeds: number;
  tools: number;
  manager: boolean;
  aiRobot: boolean;
};

export const INVESTMENT_COSTS = {
  workerWage: 45,
  seedCost: 28,
  toolCost: 42,
  managerCost: 70,
  aiRobotCost: 110,
} as const;

export type Calculation = {
  output: number;
  revenue: number;
  constantCapital: number;
  variableCapital: number;
  livingLaborValue: number;
  commodityValue: number;
  surplusValue: number;
  surplusProfit: number;
  differentialSurplusProfitI: number;
  differentialSurplusProfitII: number;
  averageProfit: number;
  differentialRentI: number;
  differentialRentII: number;
  absoluteRent: number;
  groundRent: number;
  remainingProfit: number;
  productivityMultiplier: number;
};

export const PLOTS: Plot[] = [
  {
    id: "fertile",
    title: "Đất tốt",
    short: "A",
    location: "Gần chợ",
    productivity: 1.42,
    marketBonus: 1.18,
    absoluteRent: 90,
    rentPressure: "Tô điền cao",
    soil: "#7a4a2a",
    crop: "#6bbf45",
    description:
      "Độ phì nhiêu tự nhiên tốt và đường ra chợ ngắn làm tăng lợi nhuận phụ trội.",
    mapAsset: "LooseSprites__Farm_ranching_map.png",
    buildingAsset: "Buildings__Barn.png",
  },
  {
    id: "average",
    title: "Đất trung bình",
    short: "B",
    location: "Đường đi bình thường",
    productivity: 1,
    marketBonus: 1,
    absoluteRent: 60,
    rentPressure: "Tô điền trung bình",
    soil: "#9a6236",
    crop: "#91c949",
    description:
      "Mảnh đất này là mức giữa để so sánh trực quan; giá thị trường vẫn lấy đất xấu làm mốc.",
    mapAsset: "LooseSprites__Farm_ranching_map_summer.png",
    buildingAsset: "Buildings__Big Barn.png",
  },
  {
    id: "poor",
    title: "Đất xấu",
    short: "C",
    location: "Xa chợ",
    productivity: 0.74,
    marketBonus: 0.86,
    absoluteRent: 35,
    rentPressure: "Có yêu cầu tô cơ bản",
    soil: "#6a4b34",
    crop: "#b6b06a",
    description:
      "Đất xấu vẫn có yêu cầu tô cơ bản vì địa chủ nắm quyền cho thuê đất.",
    mapAsset: "LooseSprites__Farm_ranching_map_fall.png",
    buildingAsset: "Buildings__Coop.png",
  },
];

export const DEFAULT_INVESTMENT: InvestmentState = {
  workers: 4,
  seeds: 3,
  tools: 2,
  manager: false,
  aiRobot: false,
};

const LIVING_LABOR_VALUE_PER_WORKER = 88;
const MANAGER_LIVING_LABOR_VALUE = 88;
const AVERAGE_PROFIT_RATE = 0.22;
const BASE_OUTPUT_PER_WORKER = 28;

export const screenOrder: Screen[] = [
  "title",
  "story",
  "land",
  "investment",
  "farming",
  "result",
  "theory",
  "summary",
];

export function getPlot(id: PlotId) {
  return PLOTS.find((plot) => plot.id === id) ?? PLOTS[0];
}

export function calculateSeason(
  plot: Plot,
  investment: InvestmentState,
): Calculation {
  const constantCapital = calculateConstantCapital(investment);

  const variableCapital = calculateVariableCapital(investment);

  const productivityMultiplier = calculateProductivityMultiplier(
    plot,
    investment,
  );
  const output = calculateOutput(plot, investment);

  const livingLaborValue = calculateLivingLaborValue(investment);
  const commodityValue = constantCapital + livingLaborValue;
  const surplusValue = Math.max(0, livingLaborValue - variableCapital);
  const {
    differentialSurplusProfitI,
    differentialSurplusProfitII,
    surplusProfit,
  } = calculateDifferentialSurplusProfits(
    plot,
    investment,
    output,
    commodityValue,
  );
  const revenue = commodityValue + surplusProfit;
  const profitBeforeRent = revenue - constantCapital - variableCapital;
  const averageProfit = Math.min(
    profitBeforeRent,
    Math.round((constantCapital + variableCapital) * AVERAGE_PROFIT_RATE),
  );

  const rentBudget = Math.max(0, profitBeforeRent - averageProfit);
  const { absoluteRent, differentialRentI, differentialRentII } =
    calculateRentComponents(
      plot,
      rentBudget,
      differentialSurplusProfitI,
      differentialSurplusProfitII,
    );
  const groundRent = absoluteRent + differentialRentI + differentialRentII;
  const remainingProfit = profitBeforeRent - groundRent;

  return {
    output,
    revenue,
    constantCapital,
    variableCapital,
    livingLaborValue,
    commodityValue,
    surplusValue,
    surplusProfit,
    differentialSurplusProfitI,
    differentialSurplusProfitII,
    averageProfit,
    differentialRentI,
    differentialRentII,
    absoluteRent,
    groundRent,
    remainingProfit,
    productivityMultiplier,
  };
}

function calculateProductivityMultiplier(
  plot: Plot,
  investment: InvestmentState,
) {
  return (
    calculateNaturalProductivity(plot) *
    calculateIntensiveProductivity(investment)
  );
}

function calculateOutput(plot: Plot, investment: InvestmentState) {
  return Math.round(
    investment.workers *
      BASE_OUTPUT_PER_WORKER *
      calculateProductivityMultiplier(plot, investment),
  );
}

function calculateConstantCapital(investment: InvestmentState) {
  return (
    investment.seeds * INVESTMENT_COSTS.seedCost +
    investment.tools * INVESTMENT_COSTS.toolCost +
    (investment.aiRobot ? INVESTMENT_COSTS.aiRobotCost : 0)
  );
}

function calculateVariableCapital(investment: InvestmentState) {
  return (
    investment.workers * INVESTMENT_COSTS.workerWage +
    (investment.manager ? INVESTMENT_COSTS.managerCost : 0)
  );
}

function calculateLivingLaborValue(investment: InvestmentState) {
  return (
    investment.workers * LIVING_LABOR_VALUE_PER_WORKER +
    (investment.manager ? MANAGER_LIVING_LABOR_VALUE : 0)
  );
}

function calculateNaturalProductivity(plot: Plot) {
  return plot.productivity * plot.marketBonus;
}

function calculateIntensiveProductivity(investment: InvestmentState) {
  const managerMultiplier = investment.manager ? 1.14 : 1;
  const aiMultiplier = investment.aiRobot ? 1.22 : 1;
  const toolMultiplier = 1 + investment.tools * 0.06;
  const seedMultiplier = 1 + investment.seeds * 0.04;

  return managerMultiplier * aiMultiplier * toolMultiplier * seedMultiplier;
}

function calculateDifferentialSurplusProfits(
  plot: Plot,
  investment: InvestmentState,
  output: number,
  commodityValue: number,
) {
  const marketUnitValue = calculateMarketUnitValue(investment);
  const marketValue = Math.round(output * marketUnitValue);
  const surplusProfit = Math.max(0, marketValue - commodityValue);
  const rentIReferenceInvestment = getRentIReferenceInvestment(investment);
  const naturalOutput = calculateOutput(plot, rentIReferenceInvestment);
  const naturalCommodityValue =
    calculateConstantCapital(rentIReferenceInvestment) +
    calculateLivingLaborValue(rentIReferenceInvestment);
  const naturalMarketValue = Math.round(naturalOutput * marketUnitValue);
  const naturalSurplusProfit = Math.max(
    0,
    naturalMarketValue - naturalCommodityValue,
  );
  const differentialSurplusProfitI = Math.min(
    surplusProfit,
    naturalSurplusProfit,
  );
  const differentialSurplusProfitII =
    surplusProfit - differentialSurplusProfitI;

  return {
    differentialSurplusProfitI,
    differentialSurplusProfitII,
    surplusProfit,
  };
}

function calculateMarketUnitValue(investment: InvestmentState) {
  const minimumInvestment = getMinimumInvestment(investment);
  const marginalOutput = calculateOutput(getPlot("poor"), minimumInvestment);
  const marginalCommodityValue =
    calculateConstantCapital(minimumInvestment) +
    calculateLivingLaborValue(minimumInvestment);

  return marginalCommodityValue / Math.max(1, marginalOutput);
}

function getMinimumInvestment(investment: InvestmentState): InvestmentState {
  return {
    ...investment,
    seeds: 1,
    tools: 1,
    manager: false,
    aiRobot: false,
  };
}

function getRentIReferenceInvestment(
  investment: InvestmentState,
): InvestmentState {
  return {
    ...investment,
    tools: 1,
    aiRobot: false,
  };
}

function calculateRentComponents(
  plot: Plot,
  rentBudget: number,
  differentialSurplusProfitI: number,
  differentialSurplusProfitII: number,
) {
  if (rentBudget <= 0) {
    return {
      absoluteRent: 0,
      differentialRentI: 0,
      differentialRentII: 0,
    };
  }

  const baseAbsoluteRent = Math.min(plot.absoluteRent, rentBudget);
  const differentialRentBudget = rentBudget - baseAbsoluteRent;
  const [differentialRentI, differentialRentII] = scaleToBudget(
    [differentialSurplusProfitI, differentialSurplusProfitII],
    differentialRentBudget,
  );
  const absoluteRent = rentBudget - differentialRentI - differentialRentII;

  return {
    absoluteRent,
    differentialRentI,
    differentialRentII,
  };
}

function scaleToBudget(values: number[], budget: number) {
  const desiredTotal = values.reduce((sum, value) => sum + value, 0);
  if (desiredTotal <= budget) return values;

  const scale = budget / desiredTotal;
  const scaled = values.map((value) => Math.floor(value * scale));
  let remaining = budget - scaled.reduce((sum, value) => sum + value, 0);
  const remainders = values
    .map((value, index) => ({
      index,
      remainder: value * scale - scaled[index],
    }))
    .sort((a, b) => b.remainder - a.remainder);

  for (const item of remainders) {
    if (remaining <= 0) break;
    scaled[item.index] += 1;
    remaining -= 1;
  }

  return scaled;
}

export const money = (value: number) => `${value}c`;
