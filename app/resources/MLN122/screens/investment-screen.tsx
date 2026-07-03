/**
 * Investment Screen Components
 * Polished capital investment interface with clear costs and choices
 */

import { type InvestmentState, INVESTMENT_COSTS } from "../core/game-model";
import { Stepper, ToggleOption, ScreenHeading } from "../ui/components";
import { CoinIcon } from "../ui/pixel-art";
import {
  Users,
  Sprout,
  Shovel,
  Factory,
  Bot,
  Coins,
  ScrollText,
  X,
} from "lucide-react";
import { type ReactNode, useState } from "react";

interface InvestmentScreenProps {
  investment: InvestmentState;
  onChange: (next: InvestmentState) => void;
}

type InvestmentSummaryItem = {
  label: string;
  count: number;
  unitCost: number;
  total: number;
  icon: ReactNode;
  type: "variable" | "constant";
};

/**
 * Main investment screen
 */
export function InvestmentScreen({
  investment,
  onChange,
}: InvestmentScreenProps) {
  const [showContract, setShowContract] = useState(false);
  const contractPanelId = "investment-contract-audit";
  const contractButtonClass =
    "inline-flex min-h-12 items-center justify-center gap-2 border-4 border-[#0b1209] bg-[#f5cf72] px-4 py-2 text-sm font-black uppercase tracking-wide text-[#2d2114] shadow-[4px_4px_0_#0b1209] transition-transform hover:-translate-y-0.5 active:translate-y-0 md:min-w-48";
  const update = (patch: Partial<InvestmentState>) =>
    onChange({ ...investment, ...patch });

  const totalInvestment = calculateTotalInvestment(investment);

  return (
    <div className="investment-screen grid gap-5">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <ScreenHeading
          eyebrow="Đầu tư vốn"
          title="Chuẩn bị vốn trước sản xuất"
          text="Thuê lao động sống rồi mua tư liệu sản xuất. Hạt giống, công cụ và AI là vốn không đổi. Lương công nhân và quản lý sản xuất là vốn biến đổi."
        />
        <button
          type="button"
          onClick={() => setShowContract((current) => !current)}
          className={contractButtonClass}
        >
          {showContract ? (
            <X className="h-4 w-4" />
          ) : (
            <ScrollText className="h-4 w-4" />
          )}
          Đọc hợp đồng
        </button>
      </div>

      {showContract && <ContractAuditCard id={contractPanelId} />}

      {/* Investment Summary */}
      <InvestmentSummaryBar total={totalInvestment} investment={investment} />

      {/* Variable Capital Section */}
      <div className="grid gap-4">
        <SectionHeader
          title="Vốn biến đổi"
          description="Lao động sống là nguồn duy nhất tạo ra giá trị mới và giá trị thặng dư"
          color="#7fc66a"
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Stepper
            icon={<Users className="h-5 w-5" />}
            label={`Thuê công nhân (${INVESTMENT_COSTS.workerWage}c mỗi người)`}
            value={investment.workers}
            min={2}
            max={8}
            onChange={(workers) => update({ workers })}
          />
          <ToggleOption
            icon={<Factory className="h-6 w-6" />}
            title="Thuê Quản lý sản xuất"
            text="Lao động sống làm thuê để tổ chức và điều phối quá trình sản xuất, tăng hiệu suất tổng thể 14%."
            active={investment.manager}
            onToggle={() => update({ manager: !investment.manager })}
            cost={INVESTMENT_COSTS.managerCost}
          />
        </div>
      </div>

      {/* Constant Capital Section */}
      <div className="grid gap-4">
        <SectionHeader
          title="Vốn không đổi"
          description="Phương tiện sản xuất truyền giá trị và nâng cao năng suất"
          color="#9ed7ef"
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Stepper
            icon={<Sprout className="h-5 w-5" />}
            label={`Mua hạt giống (${INVESTMENT_COSTS.seedCost}c mỗi loại)`}
            value={investment.seeds}
            min={1}
            max={6}
            onChange={(seeds) => update({ seeds })}
          />
          <Stepper
            icon={<Shovel className="h-5 w-5" />}
            label={`Mua công cụ (${INVESTMENT_COSTS.toolCost}c mỗi loại)`}
            value={investment.tools}
            min={1}
            max={5}
            onChange={(tools) => update({ tools })}
          />
        </div>
      </div>

      {/* Technology Section */}
      <div className="grid gap-4">
        <SectionHeader
          title="Công nghệ"
          description="Hỗ trợ sản xuất và nâng năng suất"
          color="#f5cf72"
        />
        <div className="grid gap-4 md:grid-cols-1">
          <ToggleOption
            icon={<Bot className="h-6 w-6" />}
            title="Dùng Robot AI Nông nghiệp"
            text="Nâng cao năng suất lao động 22%. AI không tạo ra giá trị thặng dư."
            active={investment.aiRobot}
            onToggle={() => update({ aiRobot: !investment.aiRobot })}
            cost={INVESTMENT_COSTS.aiRobotCost}
          />
        </div>
      </div>

      {/* Investment Breakdown */}
      <InvestmentBreakdown investment={investment} total={totalInvestment} />
    </div>
  );
}

function ContractAuditCard({ id }: { id: string }) {
  const terms = [
    {
      title: "Tô mùa này",
      text: "Chủ đất thu tô tuyệt đối và tô vi phân I do lợi thế đất.",
    },
    {
      title: "Tô vi phân II",
      text: "Chỉ do công cụ . Có thể bị thu ở mùa vụ tương lai.",
    },
    {
      title: "Không tính vào vi phân II",
      text: "Hạt giống và lao động sống.",
    },
  ];

  return (
    <div
      id={id}
      className="border-4 border-[#0b1209] bg-[#10190d] p-4 shadow-[5px_5px_0_#0b1209]"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-[#0b1209] bg-[#f5cf72] text-[#2d2114]">
          <ScrollText className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-wide text-[#f5cf72]">
            Hợp đồng thuê đất
          </p>
          <h3 className="mt-1 text-xl font-black text-white">
            Logic phân chia địa tô
          </h3>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {terms.map((term) => (
          <div
            key={term.title}
            className="border-2 border-[#0b1209] bg-[#20361d] p-3"
          >
            <p className="text-sm font-black text-[#f5cf72]">{term.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-[#fff5cf]/75">
              {term.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Section header component
 */
function SectionHeader({
  title,
  description,
  color,
}: {
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="border-l-4 pl-4" style={{ borderColor: color }}>
      <h3 className="text-xl font-black text-white">{title}</h3>
      <p className="mt-1 text-sm text-[#fff5cf]/75">{description}</p>
    </div>
  );
}

/**
 * Investment summary bar
 */
function InvestmentSummaryBar({
  total,
  investment,
}: {
  total: number;
  investment: InvestmentState;
}) {
  const constantCapital =
    investment.seeds * INVESTMENT_COSTS.seedCost +
    investment.tools * INVESTMENT_COSTS.toolCost +
    (investment.aiRobot ? INVESTMENT_COSTS.aiRobotCost : 0);

  const variableCapital =
    investment.workers * INVESTMENT_COSTS.workerWage +
    (investment.manager ? INVESTMENT_COSTS.managerCost : 0);

  const constantPercent = (constantCapital / total) * 100;
  const variablePercent = (variableCapital / total) * 100;

  return (
    <div className="pixel-panel p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#f5cf72]">
            Tổng vốn cấp trước
          </p>
          <div className="mt-1 flex items-center gap-2">
            <CoinIcon scale={2.5} />
            <p className="font-mono text-4xl font-black text-white">{total}</p>
            <span className="text-lg font-bold text-[#fff5cf]/60">xu</span>
          </div>
        </div>
        <Coins className="h-16 w-16 text-[#f5cf72] opacity-40" />
      </div>

      <div className="mt-4">
        <div className="mb-2 flex justify-between text-xs font-bold">
          <span className="text-[#7fc66a]">
            Vốn biến đổi: {variableCapital}c
          </span>
          <span className="text-[#9ed7ef]">
            Vốn không đổi: {constantCapital}c
          </span>
        </div>
        <div className="flex h-6 overflow-hidden border-2 border-[#0b1209]">
          <div
            className="bg-[#7fc66a] transition-all duration-300"
            style={{ width: `${variablePercent}%` }}
          />
          <div
            className="bg-[#9ed7ef] transition-all duration-300"
            style={{ width: `${constantPercent}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[10px] font-bold text-[#fff5cf]/50">
          <span>{Math.round(variablePercent)}% vốn biến đổi</span>
          <span>{Math.round(constantPercent)}% vốn không đổi</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Investment breakdown card
 */
function InvestmentBreakdown({
  investment,
  total,
}: {
  investment: InvestmentState;
  total: number;
}) {
  const items: InvestmentSummaryItem[] = [
    {
      label: "Công nhân",
      count: investment.workers,
      unitCost: INVESTMENT_COSTS.workerWage,
      total: investment.workers * INVESTMENT_COSTS.workerWage,
      icon: <Users className="h-4 w-4" />,
      type: "variable",
    },
    {
      label: "Hạt giống",
      count: investment.seeds,
      unitCost: INVESTMENT_COSTS.seedCost,
      total: investment.seeds * INVESTMENT_COSTS.seedCost,
      icon: <Sprout className="h-4 w-4" />,
      type: "constant",
    },
    {
      label: "Công cụ",
      count: investment.tools,
      unitCost: INVESTMENT_COSTS.toolCost,
      total: investment.tools * INVESTMENT_COSTS.toolCost,
      icon: <Shovel className="h-4 w-4" />,
      type: "constant",
    },
  ];

  if (investment.manager) {
    items.push({
      label: "Quản lý sản xuất",
      count: 1,
      unitCost: INVESTMENT_COSTS.managerCost,
      total: INVESTMENT_COSTS.managerCost,
      icon: <Factory className="h-4 w-4" />,
      type: "variable",
    });
  }

  if (investment.aiRobot) {
    items.push({
      label: "Robot AI",
      count: 1,
      unitCost: INVESTMENT_COSTS.aiRobotCost,
      total: INVESTMENT_COSTS.aiRobotCost,
      icon: <Bot className="h-4 w-4" />,
      type: "constant",
    });
  }

  return (
    <div className="pixel-card bg-[#10190d] p-4">
      <h3 className="mb-3 text-lg font-black text-[#f5cf72]">Tóm tắt đầu tư</h3>

      <div className="grid gap-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-b border-[#fff5cf]/10 pb-2"
          >
            <div className="flex items-center gap-2">
              <span
                className={`${item.type === "variable" ? "text-[#7fc66a]" : "text-[#9ed7ef]"}`}
              >
                {item.icon}
              </span>
              <span className="text-sm font-bold text-[#fff5cf]/90">
                {item.label} × {item.count}
              </span>
              <span className="text-xs text-[#fff5cf]/50">
                @ {item.unitCost}c
              </span>
            </div>
            <span className="font-mono text-sm font-black text-white">
              {item.total}c
            </span>
          </div>
        ))}

        <div className="mt-2 flex items-center justify-between border-t-2 border-[#f5cf72] pt-3">
          <span className="text-base font-black text-[#f5cf72]">
            Tổng vốn đầu tư
          </span>
          <span className="font-mono text-2xl font-black text-[#f5cf72]">
            {total}c
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Calculate total investment
 */
function calculateTotalInvestment(investment: InvestmentState): number {
  return (
    investment.workers * INVESTMENT_COSTS.workerWage +
    investment.seeds * INVESTMENT_COSTS.seedCost +
    investment.tools * INVESTMENT_COSTS.toolCost +
    (investment.manager ? INVESTMENT_COSTS.managerCost : 0) +
    (investment.aiRobot ? INVESTMENT_COSTS.aiRobotCost : 0)
  );
}

/**
 * Quick investment preset buttons
 */
export function InvestmentPresets({
  onSelect,
}: {
  onSelect: (investment: InvestmentState) => void;
}) {
  const presets = [
    {
      name: "Tối thiểu",
      description: "Sản xuất cơ bản với đầu tư tối thiểu",
      investment: {
        workers: 2,
        seeds: 1,
        tools: 1,
        manager: false,
        aiRobot: false,
      },
    },
    {
      name: "Cân bằng",
      description: "Đầu tư vừa phải để có sản lượng ổn định",
      investment: {
        workers: 4,
        seeds: 3,
        tools: 2,
        manager: false,
        aiRobot: false,
      },
    },
    {
      name: "Tập trung",
      description: "Đầu tư lớn với công nghệ tiên tiến",
      investment: {
        workers: 6,
        seeds: 5,
        tools: 4,
        manager: true,
        aiRobot: true,
      },
    },
  ];

  return (
    <div className="investment-presets grid gap-3 md:grid-cols-3">
      {presets.map((preset) => (
        <button
          key={preset.name}
          type="button"
          onClick={() => onSelect(preset.investment)}
          className="pixel-card bg-[#263f22] p-3 text-left hover:bg-[#20361d]"
        >
          <h4 className="text-sm font-black text-[#f5cf72]">{preset.name}</h4>
          <p className="mt-1 text-xs text-[#fff5cf]/70">{preset.description}</p>
          <p className="mt-2 text-xs font-bold text-white">
            Chi phí: {calculateTotalInvestment(preset.investment)}c
          </p>
        </button>
      ))}
    </div>
  );
}
