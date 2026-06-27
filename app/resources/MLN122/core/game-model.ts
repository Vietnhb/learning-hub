export type Screen =
  | "title"
  | "story"
  | "land"
  | "investment"
  | "farming"
  | "result"
  | "theory"
  | "summary";

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
  surplusValue: number;
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
    title: "Fertile Land",
    short: "A",
    location: "Near the market",
    productivity: 1.42,
    marketBonus: 1.18,
    absoluteRent: 90,
    rentPressure: "High rent",
    soil: "#7a4a2a",
    crop: "#6bbf45",
    description:
      "Better natural fertility and a shorter road to market raise extra profit.",
    mapAsset: "LooseSprites__Farm_ranching_map.png",
    buildingAsset: "Buildings__Barn.png",
  },
  {
    id: "average",
    title: "Average Land",
    short: "B",
    location: "Normal road",
    productivity: 1,
    marketBonus: 1,
    absoluteRent: 60,
    rentPressure: "Normal rent",
    soil: "#9a6236",
    crop: "#91c949",
    description: "This plot is the classroom baseline for ordinary production.",
    mapAsset: "LooseSprites__Farm_ranching_map_summer.png",
    buildingAsset: "Buildings__Big Barn.png",
  },
  {
    id: "poor",
    title: "Poor Land",
    short: "C",
    location: "Far from market",
    productivity: 0.74,
    marketBonus: 0.86,
    absoluteRent: 35,
    rentPressure: "Basic rent still due",
    soil: "#6a4b34",
    crop: "#b6b06a",
    description:
      "Even weak land must pay basic rent because the landlord owns the land.",
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
  const seedCost = investment.seeds * INVESTMENT_COSTS.seedCost;
  const toolCost = investment.tools * INVESTMENT_COSTS.toolCost;
  const managerCost = investment.manager ? INVESTMENT_COSTS.managerCost : 0;
  const aiCost = investment.aiRobot ? INVESTMENT_COSTS.aiRobotCost : 0;
  const constantCapital = seedCost + toolCost + managerCost + aiCost;

  const variableCapital = investment.workers * INVESTMENT_COSTS.workerWage;

  const managerMultiplier = investment.manager ? 1.14 : 1;
  const aiMultiplier = investment.aiRobot ? 1.22 : 1;
  const toolMultiplier = 1 + investment.tools * 0.06;
  const seedMultiplier = 1 + investment.seeds * 0.04;
  const productivityMultiplier =
    plot.productivity *
    plot.marketBonus *
    managerMultiplier *
    aiMultiplier *
    toolMultiplier *
    seedMultiplier;

  const output = Math.round(investment.workers * 28 * productivityMultiplier);
  const revenue = output * 8;

  const livingLaborValue = Math.round(
    investment.workers * 88 * managerMultiplier * aiMultiplier,
  );
  const surplusValue = Math.max(0, livingLaborValue - variableCapital);
  const averageProfit = Math.round((constantCapital + variableCapital) * 0.22);

  const baselineInvestment: InvestmentState = {
    workers: investment.workers,
    seeds: investment.seeds,
    tools: investment.tools,
    manager: false,
    aiRobot: false,
  };
  const poorBaseline = calculateSimpleProfit(getPlot("poor"), baselineInvestment);
  const currentNaturalProfit = calculateSimpleProfit(plot, baselineInvestment);
  const currentFullProfit = revenue - constantCapital - variableCapital;

  const differentialRentI = Math.max(0, currentNaturalProfit - poorBaseline);
  const differentialRentII = Math.max(
    0,
    currentFullProfit - currentNaturalProfit - averageProfit,
  );
  const absoluteRent = plot.absoluteRent;
  const groundRent = absoluteRent + differentialRentI + differentialRentII;
  const remainingProfit = currentFullProfit - groundRent;

  return {
    output,
    revenue,
    constantCapital,
    variableCapital,
    livingLaborValue,
    surplusValue,
    averageProfit,
    differentialRentI,
    differentialRentII,
    absoluteRent,
    groundRent,
    remainingProfit,
    productivityMultiplier,
  };
}

function calculateSimpleProfit(plot: Plot, investment: InvestmentState) {
  const constantCapital =
    investment.seeds * INVESTMENT_COSTS.seedCost +
    investment.tools * INVESTMENT_COSTS.toolCost +
    (investment.manager ? INVESTMENT_COSTS.managerCost : 0) +
    (investment.aiRobot ? INVESTMENT_COSTS.aiRobotCost : 0);
  const variableCapital = investment.workers * INVESTMENT_COSTS.workerWage;
  const managerMultiplier = investment.manager ? 1.14 : 1;
  const aiMultiplier = investment.aiRobot ? 1.22 : 1;
  const toolMultiplier = 1 + investment.tools * 0.06;
  const seedMultiplier = 1 + investment.seeds * 0.04;
  const output = Math.round(
    investment.workers *
      28 *
      plot.productivity *
      plot.marketBonus *
      managerMultiplier *
      aiMultiplier *
      toolMultiplier *
      seedMultiplier,
  );
  return output * 8 - constantCapital - variableCapital;
}

export const money = (value: number) => `${value}c`;
