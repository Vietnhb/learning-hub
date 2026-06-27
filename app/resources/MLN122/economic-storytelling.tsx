/**
 * Các thành phần Kể chuyện kinh tế
 * Các thành phần trực quan giải thích các khái niệm kinh tế MLN122 thông qua các phép ẩn dụ trực quan rõ ràng
 */

import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { type Calculation, type Plot, type InvestmentState, money } from "./game-model";
import { CoinIcon } from "./pixel-components";
import { TheoryStep } from "./ui-components";
import { Users, Factory, TrendingUp, ArrowRight, Coins, Home } from "lucide-react";

// ===== VALUE FLOW DIAGRAM =====

/**
 * Visual flow showing how value is created and distributed
 */
export function ValueFlowDiagram({ result }: { result: Calculation }) {
  return (
    <div className="value-flow-diagram mx-auto max-w-4xl">
      <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
        {/* Giai đoạn 1: Công nhân tạo ra giá trị */}
        <FlowNode
          icon={<Users className="h-6 w-6" />}
          title="Công nhân"
          subtitle="Lao động sống"
          value={result.livingLaborValue}
          color="#7fc66a"
          description="Tạo ra giá trị mới thông qua lao động nông nghiệp"
        />

        <FlowArrow label="Sản xuất" />

        {/* Giai đoạn 2: Giá trị thặng dư */}
        <FlowNode
          icon={<TrendingUp className="h-6 w-6" />}
          title="Giá trị thặng dư"
          subtitle="Sau lương"
          value={result.surplusValue}
          color="#f5cf72"
          description={`Lao động sống (${result.livingLaborValue}c) trừ lương (${result.variableCapital}c)`}
          highlight
        />

        <FlowArrow label="Phân chia" />

        {/* Giai đoạn 3: Phân phối */}
        <div className="grid gap-3">
          <FlowNode
            icon={<Home className="h-5 w-5" />}
            title="Chủ đất"
            subtitle="Tô điền"
            value={result.groundRent}
            color="#d94b35"
            description="Chiết từ giá trị thặng dư vì chủ đất sở hữu đất"
            compact
          />
          <FlowNode
            icon={<Factory className="h-5 w-5" />}
            title="Nhà tư bản"
            subtitle="Lợi nhuận còn lại"
            value={result.remainingProfit}
            color="#9ed7ef"
            description="Phần còn lại sau khi trả tô điền"
            compact
          />
        </div>
      </div>

      {/* Giải thích */}
      <div className="mt-6 border-l-4 border-[#f5cf72] bg-[#10190d] p-4">
        <p className="text-sm leading-relaxed text-[#fff5cf]/85">
          <strong className="text-[#f5cf72]">Ý tưởng chính:</strong> Công nhân tạo ra{" "}
          {money(result.livingLaborValue)} giá trị mới. Sau khi trả lương{" "}
          {money(result.variableCapital)}, {money(result.surplusValue)} giá trị thặng dư còn lại.
          Chủ đất chiếm {money(result.groundRent)} làm tô điền (vì sở hữu đất),
          để lại nhà tư bản với {money(result.remainingProfit)}.
        </p>
      </div>
    </div>
  );
}

/**
 * Flow node component
 */
function FlowNode({
  icon,
  title,
  subtitle,
  value,
  color,
  description,
  highlight = false,
  compact = false,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  value: number;
  color: string;
  description: string;
  highlight?: boolean;
  compact?: boolean;
}) {
  return (
    <motion.div
      className={`flow-node grid gap-2 border-4 p-3 ${
        highlight
          ? "bg-gradient-to-br from-[#2d4c28] to-[#20361d]"
          : "bg-[#10190d]"
      }`}
      style={{ borderColor: color }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-2">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full border-2"
          style={{ borderColor: color, backgroundColor: `${color}20` }}
        >
          <span style={{ color }}>{icon}</span>
        </div>
        <div className="flex-1">
          <h4 className="text-xs font-bold uppercase tracking-wide" style={{ color }}>
            {subtitle}
          </h4>
          <h3 className={`font-black text-white ${compact ? "text-base" : "text-lg"}`}>
            {title}
          </h3>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <CoinIcon scale={compact ? 1.5 : 2} />
        <p className={`font-mono font-black text-white ${compact ? "text-xl" : "text-2xl"}`}>
          {value}
        </p>
      </div>

      {!compact && (
        <p className="text-xs leading-relaxed text-[#fff5cf]/70">{description}</p>
      )}
    </motion.div>
  );
}

/**
 * Flow arrow between nodes
 */
function FlowArrow({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <ArrowRight className="h-8 w-8 text-[#f5cf72]" />
      <span className="mt-1 text-xs font-bold text-[#f5cf72]">{label}</span>
    </div>
  );
}

// ===== GROUND RENT EXPLANATION =====

/**
 * Visual explanation of ground rent components
 */
export function GroundRentExplanation({ result, plot }: { result: Calculation; plot: Plot }) {
  return (
    <div className="ground-rent-explanation grid gap-4">
      <div className="text-center">
        <h3 className="text-2xl font-black text-white">Hiểu về Tô điền</h3>
        <p className="mt-2 text-sm text-[#fff5cf]/80">
          Tô điền = {money(result.groundRent)} được chiết từ giá trị thặng dư
        </p>
      </div>

      {/* Ba thành phần */}
      <div className="grid gap-3 md:grid-cols-3">
        {/* Tô điền tuyệt đối */}
        <RentComponent
          title="Tô điền tuyệt đối"
          value={result.absoluteRent}
          color="#d94b35"
          icon="🏛️"
          explanation="Tất cả đất đều phải trả tô điền cơ bản này vì đất được sở hữu riêng. Ngay cả đất xấu cũng phải trả tô điền tuyệt đối."
          formula="Cố định theo lô"
        />

        {/* Tô điền vi phân I */}
        <RentComponent
          title="Tô điền vi phân I"
          value={result.differentialRentI}
          color="#ef634b"
          icon="🌱"
          explanation="Lợi nhuận thêm từ điều kiện tự nhiên tốt hơn (độ phì nhiêu, vị trí). Ưu điểm tự nhiên của lô này so với đất xấu."
          formula={`${plot.title} so với Đất xấu`}
        />

        {/* Tô điền vi phân II */}
        <RentComponent
          title="Tô điền vi phân II"
          value={result.differentialRentII}
          color="#f5a65a"
          icon="🔧"
          explanation="Lợi nhuận thêm từ đầu tư vốn bổ sung trên cùng một lô đất. Nông nghiệp thâm canh nâng cao năng suất."
          formula="Từ đầu tư bổ sung"
        />
      </div>

      {/* Tại sao tô điền tồn tại */}
      <div className="grid gap-3 md:grid-cols-2">
        <ConceptCard
          title="Tại sao tô điền tồn tại?"
          points={[
            "Đất là phương tiện sản xuất nhưng được sở hữu riêng",
            "Chủ đất kiểm soát quyền truy cập đất cần thiết cho nông nghiệp",
            "Nhà tư bản phải trả tô điền để sử dụng đất",
            "Tô điền là chuyển giao giá trị thặng dư, không phải tạo ra giá trị mới",
          ]}
          color="#d94b35"
        />

        <ConceptCard
          title="Nếu như AI và năng suất?"
          points={[
            "AI và máy móc là lao động chết (giá trị trong quá khứ được chuyển)",
            "Chỉ lao động sống tạo ra giá trị mới",
            "AI nâng cao năng suất nhưng không tạo giá trị thặng dư",
            "Năng suất cao hơn ảnh hưởng đến phân phối tô điền, không phải tạo giá trị",
          ]}
          color="#9ed7ef"
        />
      </div>
    </div>
  );
}

/**
 * Rent component card
 */
function RentComponent({
  title,
  value,
  color,
  icon,
  explanation,
  formula,
}: {
  title: string;
  value: number;
  color: string;
  icon: string;
  explanation: string;
  formula: string;
}) {
  return (
    <div className="pixel-card grid gap-3 bg-[#10190d] p-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-black" style={{ color }}>
          {title}
        </h4>
        <span className="text-2xl">{icon}</span>
      </div>

      <div className="flex items-center gap-2">
        <CoinIcon scale={2} />
        <p className="font-mono text-3xl font-black" style={{ color }}>
          {value}
        </p>
      </div>

      <div className="rounded-none border-2 border-[#fff5cf]/20 bg-[#20361d] px-2 py-1 text-center">
        <p className="text-xs font-bold text-[#fff5cf]/60">{formula}</p>
      </div>

      <p className="text-xs leading-relaxed text-[#fff5cf]/75">{explanation}</p>
    </div>
  );
}

/**
 * Concept card
 */
function ConceptCard({
  title,
  points,
  color,
}: {
  title: string;
  points: string[];
  color: string;
}) {
  return (
    <div
      className="pixel-card grid gap-3 p-4"
      style={{ backgroundColor: "#10190d", borderColor: color }}
    >
      <h4 className="text-base font-black text-white">{title}</h4>
      <ul className="grid gap-2">
        {points.map((point, i) => (
          <li key={i} className="flex gap-2 text-xs leading-relaxed text-[#fff5cf]/80">
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0" style={{ backgroundColor: color }} />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ===== INVESTMENT IMPACT VISUALIZATION =====

/**
 * Show how investment choices affect outcomes
 */
export function InvestmentImpactVisualization({
  investment,
  result,
}: {
  investment: InvestmentState;
  result: Calculation;
}) {
  const impacts = [
    {
      factor: "Công nhân",
      count: investment.workers,
      icon: <Users className="h-5 w-5" />,
      color: "#7fc66a",
      impact: "Những người sáng tạo trực tiếp giá trị thặng dư. Công nhân nhiều hơn = giá trị thặng dư nhiều hơn.",
      contribution: `Tạo ra ${money(result.livingLaborValue)} giá trị tổng cộng`,
    },
    {
      factor: "Hạt giống & Công cụ",
      count: investment.seeds + investment.tools,
      icon: <TrendingUp className="h-5 w-5" />,
      color: "#9ed7ef",
      impact: "Vốn không đổi cải thiện năng suất nhưng chuyển giao giá trị hiện có.",
      contribution: `Hệ số năng suất: ${Math.round(result.productivityMultiplier * 100)}%`,
    },
  ];

  if (investment.manager) {
    impacts.push({
      factor: "Quản lý",
      count: 1,
      icon: <Factory className="h-5 w-5" />,
      color: "#f5a65a",
      impact: "Phối hợp công việc, nâng cao hiệu quả 14%.",
      contribution: "Phần thưởng tổ chức được áp dụng",
    });
  }

  if (investment.aiRobot) {
    impacts.push({
      factor: "Robot AI",
      count: 1,
      icon: <span className="text-base">🤖</span>,
      color: "#b9d7e8",
      impact: "Nâng cao năng suất 22%, nhưng lao động sống vẫn là nguồn duy nhất tạo giá trị thặng dư.",
      contribution: "Phần thưởng năng suất được áp dụng",
    });
  }

  return (
    <div className="investment-impact-visualization grid gap-4">
      <div className="text-center">
        <h3 className="text-2xl font-black text-white">Cách đầu tư của bạn ảnh hưởng đến sản xuất</h3>
        <p className="mt-2 text-sm text-[#fff5cf]/80">
          Mỗi yếu tố đầu vào có vai trò khác nhau trong tạo giá trị
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {impacts.map((item, i) => (
          <motion.div
            key={item.factor}
            className="pixel-card grid gap-3 bg-[#10190d] p-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full border-2"
                style={{ borderColor: item.color, backgroundColor: `${item.color}20` }}
              >
                <span style={{ color: item.color }}>{item.icon}</span>
              </div>
              <div className="flex-1">
                <h4 className="text-base font-black text-white">{item.factor}</h4>
                <p className="text-xs font-bold" style={{ color: item.color }}>
                  × {item.count}
                </p>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-[#fff5cf]/85">{item.impact}</p>

            <div
              className="rounded-none border-l-4 bg-[#20361d] px-3 py-2"
              style={{ borderColor: item.color }}
            >
              <p className="text-xs font-bold text-[#fff5cf]/90">{item.contribution}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ===== THEORY EXPLANATION SCREENS =====

/**
 * Comprehensive theory explanation with examples
 */
export function TheoryExplanation({
  plot,
  investment,
  result,
}: {
  plot: Plot;
  investment: InvestmentState;
  result: Calculation;
}) {
  const explanations = buildExplanations(plot, investment, result);

  return (
    <div className="theory-explanation grid gap-4">
      <div className="text-center">
        <h3 className="text-2xl font-black text-white">Tóm tắt Lý thuyết kinh tế</h3>
        <p className="mt-2 text-sm text-[#fff5cf]/80">
          Giải thích lớp học ngắn gọn về tô điền và tạo giá trị
        </p>
      </div>

      <div className="grid gap-3">
        {explanations.map((item, i) => (
          <TheoryStep key={i} number={i + 1} text={item} />
        ))}
      </div>

      {/* Ý chính */}
      <div className="pixel-card border-[#f5cf72] bg-gradient-to-br from-[#2d4c28] to-[#20361d] p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#f5cf72] bg-[#f5cf72]/20">
            <Coins className="h-6 w-6 text-[#f5cf72]" />
          </div>
          <div>
            <h4 className="text-base font-black text-[#f5cf72]">Ý chính</h4>
            <p className="mt-2 text-sm leading-relaxed text-[#fff5cf]/90">
              Tô điền nông nghiệp tư bản là một phần giá trị thặng dư được tạo ra bởi công nhân nông nghiệp được thuê, 
              được chuyển giao cho chủ đất thông qua quyền sở hữu đất riêng. Công cụ, công nghệ và AI nâng cao năng suất 
              nhưng không thay thế lao động sống như nguồn giá trị thặng dư.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Build context-specific explanations
 */
function buildExplanations(
  plot: Plot,
  investment: InvestmentState,
  result: Calculation
): string[] {
  const explanations: string[] = [];

  // Nguồn gốc giá trị thặng dư
  explanations.push(
    `Giá trị thặng dư (${money(result.surplusValue)}) được tạo ra bởi ${investment.workers} công nhân nông nghiệp thông qua lao động sống, không phải do công cụ hay công nghệ.`
  );

  // Tác động chất lượng lô đất
  if (result.differentialRentI > 0) {
    explanations.push(
      `Tô điền vi phân I (${money(result.differentialRentI)}) xuất hiện vì ${plot.title.toLowerCase()} có độ phì nhiêu tự nhiên tốt hơn và vị trí tốt hơn so với đất xấu.`
    );
  } else {
    explanations.push(
      `Tô điền vi phân I thấp (${money(result.differentialRentI)}) vì lô đất này không vượt trội hơn đất xấu về điều kiện tự nhiên.`
    );
  }

  // Tác động đầu tư
  if (result.differentialRentII > 0) {
    explanations.push(
      `Tô điền vi phân II (${money(result.differentialRentII)}) xuất hiện vì đầu tư vốn bổ sung nâng cao năng suất trên cùng lô đất.`
    );
  } else {
    explanations.push(
      `Tô điền vi phân II tối thiểu (${money(result.differentialRentII)}) vì đầu tư thâm canh trên lô đất này bị hạn chế.`
    );
  }

  // Tô điền tuyệt đối
  explanations.push(
    `Tô điền tuyệt đối (${money(result.absoluteRent)}) được trả bất kể chất lượng lô đất vì chủ đất sở hữu riêng đất đai.`
  );

  // AI/công nghệ nếu sử dụng
  if (investment.aiRobot) {
    explanations.push(
      `Robot AI nâng cao năng suất 22% và giảm thời gian lao động cần thiết, nhưng lao động sống vẫn là nguồn duy nhất tạo giá trị thặng dư. AI là lao động chết chuyển giao giá trị trong quá khứ.`
    );
  }

  // Quản lý nếu sử dụng
  if (investment.manager) {
    explanations.push(
      `Quản lý cải thiện tổ chức công việc và phối hợp, nâng cao hiệu quả tổng thể 14%. Điều này ảnh hưởng đến năng suất nhưng không tạo ra giá trị mới.`
    );
  }

  return explanations;
}

// ===== COMPARISON VISUALIZATION =====

/**
 * Compare outcomes across different plots
 */
export function PlotComparisonChart({
  plots,
  currentPlot,
}: {
  plots: Array<{ plot: Plot; result: Calculation }>;
  currentPlot: Plot;
}) {
  const maxValue = Math.max(...plots.map((p) => p.result.surplusValue));

  return (
    <div className="plot-comparison-chart grid gap-4">
      <h4 className="text-center text-lg font-black text-white">
        So sánh lô đất: Phân phối giá trị thặng dư
      </h4>

      <div className="grid gap-3">
        {plots.map(({ plot, result }) => (
          <div
            key={plot.id}
            className={`pixel-card p-4 ${
              plot.id === currentPlot.id ? "border-[#f5cf72]" : "border-[#0b1209]"
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h5 className="text-base font-black text-white">{plot.title}</h5>
                <p className="text-xs text-[#fff5cf]/60">Lô {plot.short}</p>
              </div>
              <span className="font-mono text-xl font-black text-[#f5cf72]">
                {money(result.surplusValue)}
              </span>
            </div>

            {/* Biểu đồ thanh */}
            <div className="relative h-8 overflow-hidden border-2 border-[#0b1209] bg-[#20361d]">
              <motion.div
                className="h-full bg-[#7fc66a]"
                initial={{ width: 0 }}
                animate={{ width: `${(result.surplusValue / maxValue) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </div>

            {/* Phân tích tô điền */}
            <div className="mt-2 flex justify-between text-xs text-[#fff5cf]/70">
              <span>Tô điền: {money(result.groundRent)}</span>
              <span>Lợi nhuận: {money(result.remainingProfit)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
