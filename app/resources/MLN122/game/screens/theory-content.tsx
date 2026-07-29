/**
 * Các thành phần Kể chuyện kinh tế
 * Các thành phần trực quan giải thích các khái niệm kinh tế MLN122 thông qua các phép ẩn dụ trực quan rõ ràng
 */

import { motion } from "framer-motion";
import { type ReactNode } from "react";
import {
  type Calculation,
  type Plot,
  type InvestmentState,
  money,
} from "../core/game-model";
import { CoinIcon } from "../ui/pixel-art";
import { TheoryStep } from "../ui/components";
import {
  Users,
  Factory,
  TrendingUp,
  ArrowRight,
  Coins,
  Home,
} from "lucide-react";

// ===== VALUE FLOW DIAGRAM =====

/**
 * Visual flow showing how value is created and distributed
 */
export function ValueFlowDiagram({
  result,
  investment,
}: {
  result: Calculation;
  investment: InvestmentState;
}) {
  const livingLaborTitle = investment.manager
    ? "Công nhân + Quản lý SX"
    : "Công nhân";
  const livingLaborDescription = investment.manager
    ? "Tạo ra giá trị mới thông qua lao động trực tiếp và lao động tổ chức sản xuất"
    : "Tạo ra giá trị mới thông qua lao động nông nghiệp";

  return (
    <div className="value-flow-diagram mx-auto max-w-4xl">
      <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
        {/* Giai đoạn 1: Lao động sống tạo ra giá trị */}
        <FlowNode
          icon={<Users className="h-6 w-6" />}
          title={livingLaborTitle}
          subtitle="Lao động sống"
          value={result.livingLaborValue}
          color="#7fc66a"
          description={livingLaborDescription}
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
            description="Phần chủ đất nhận nhờ quyền cho thuê đất"
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
          <strong className="text-[#f5cf72]">Ý tưởng chính:</strong> Lao động
          sống tạo ra {money(result.livingLaborValue)} giá trị mới. Sau khi trả
          lương {money(result.variableCapital)}, {money(result.surplusValue)}{" "}
          giá trị thặng dư còn lại. Lô đất làm ra nhiều hơn mức chuẩn, bạn có
          thêm {money(result.surplusProfit)} lợi nhuận phụ trội. Chủ đất nhận{" "}
          {money(result.groundRent)} làm tô điền trong mùa này. Tô vi phân II
          nếu có thể bị thu vào mùa vụ trong tương lai.
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
          <h4
            className="text-xs font-bold uppercase tracking-wide"
            style={{ color }}
          >
            {subtitle}
          </h4>
          <h3
            className={`font-black text-white ${compact ? "text-base" : "text-lg"}`}
          >
            {title}
          </h3>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <CoinIcon scale={compact ? 1.5 : 2} />
        <p
          className={`font-mono font-black text-white ${compact ? "text-xl" : "text-2xl"}`}
        >
          {value}
        </p>
      </div>

      {!compact && (
        <p className="text-xs leading-relaxed text-[#fff5cf]/70">
          {description}
        </p>
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
export function GroundRentExplanation({
  result,
  plot,
}: {
  result: Calculation;
  plot: Plot;
}) {
  return (
    <div className="ground-rent-explanation grid gap-4">
      <div className="text-center">
        <h3 className="text-2xl font-black text-white">Hiểu về Tô điền</h3>
        <p className="mt-2 text-sm text-[#fff5cf]/80">
          Tô điền mùa này = {money(result.groundRent)}. Tô vi phân II nếu có là
          khoản có thể bị thu vào mùa vụ trong tương lai
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
          explanation="Khoản tô bắt nguồn từ quyền sở hữu đất. Game lấy một mức cơ sở theo từng lô, rồi phần vượt bình quân chưa phân vào tô vi phân cũng được quy về quyền sở hữu đất."
          formula="Cơ sở + phần vượt bình quân"
        />

        {/* Tô điền vi phân I */}
        <RentComponent
          title="Tô điền vi phân I"
          value={result.differentialRentI}
          color="#ef634b"
          icon="🌱"
          explanation="Lợi nhuận thêm từ điều kiện tự nhiên tốt hơn như độ phì nhiêu và vị trí."
          formula="Lợi thế tự nhiên của lô"
        />

        {/* Tô điền vi phân II */}
        <RentComponent
          title="Tô điền vi phân II"
          value={result.differentialRentII}
          color="#f5a65a"
          icon="🔧"
          explanation="Lợi nhuận thêm từ công cụ trên cùng một lô đất. Hạt giống và quản lý sản xuất không được tách vào phần này. Khoản này có thể bị thu vào mùa vụ trong tương lai."
          formula="Công cụ + AI"
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
            "Tô điền là phần lợi nhuận chuyển sang chủ đất, không phải giá trị mới tự sinh ra từ đất",
          ]}
          color="#d94b35"
        />

        <ConceptCard
          title="Nếu như AI và năng suất?"
          points={[
            "AI và máy móc là lao động chết (giá trị trong quá khứ được chuyển)",
            "Lao động sống gồm công nhân trực tiếp và quản lý sản xuất thuê ngoài",
            "AI nâng cao năng suất nhưng không tạo giá trị thặng dư",
            "Năng suất cao hơn có thể tạo lợi nhuận phụ trội, nhưng không tự tạo giá trị mới",
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
          <li
            key={i}
            className="flex gap-2 text-xs leading-relaxed text-[#fff5cf]/80"
          >
            <span
              className="mt-0.5 h-1.5 w-1.5 shrink-0"
              style={{ backgroundColor: color }}
            />
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
      impact:
        "Những người lao động trực tiếp tạo giá trị mới. Công nhân nhiều hơn = nền tảng giá trị thặng dư lớn hơn.",
      contribution: investment.manager
        ? "Cộng với quản lý sản xuất, tạo phần giá trị lao động sống tổng cộng"
        : `Tạo ra ${money(result.livingLaborValue)} giá trị tổng cộng`,
    },
    {
      factor: "Hạt giống & Công cụ",
      count: investment.seeds + investment.tools,
      icon: <TrendingUp className="h-5 w-5" />,
      color: "#9ed7ef",
      impact:
        "Hạt giống và công cụ giúp làm ra nhiều sản phẩm hơn, nhưng chỉ chuyển giá trị sẵn có. Hạt giống không được tách vào tô vi phân II.",
      contribution: `Hệ số năng suất: ${Math.round(result.productivityMultiplier * 100)}%`,
    },
  ];

  if (investment.manager) {
    impacts.push({
      factor: "Quản lý sản xuất",
      count: 1,
      icon: <Factory className="h-5 w-5" />,
      color: "#f5a65a",
      impact:
        "Lao động sống làm thuê để phối hợp công việc, nâng cao hiệu quả 14%.",
      contribution:
        "Tổ chức tốt hơn, vừa là vốn biến đổi vừa làm năng suất cao hơn",
    });
  }

  if (investment.aiRobot) {
    impacts.push({
      factor: "Robot AI",
      count: 1,
      icon: <span className="text-base">🤖</span>,
      color: "#b9d7e8",
      impact:
        "Nâng cao năng suất 22%, nhưng lao động sống vẫn là nguồn duy nhất tạo giá trị thặng dư.",
      contribution: "Năng suất cao hơn",
    });
  }

  return (
    <div className="investment-impact-visualization grid gap-4">
      <div className="text-center">
        <h3 className="text-2xl font-black text-white">
          Cách đầu tư của bạn ảnh hưởng đến sản xuất
        </h3>
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
                style={{
                  borderColor: item.color,
                  backgroundColor: `${item.color}20`,
                }}
              >
                <span style={{ color: item.color }}>{item.icon}</span>
              </div>
              <div className="flex-1">
                <h4 className="text-base font-black text-white">
                  {item.factor}
                </h4>
                <p className="text-xs font-bold" style={{ color: item.color }}>
                  × {item.count}
                </p>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-[#fff5cf]/85">
              {item.impact}
            </p>

            <div
              className="rounded-none border-l-4 bg-[#20361d] px-3 py-2"
              style={{ borderColor: item.color }}
            >
              <p className="text-xs font-bold text-[#fff5cf]/90">
                {item.contribution}
              </p>
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
        <h3 className="text-2xl font-black text-white">
          Tóm tắt Lý thuyết kinh tế
        </h3>
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
              Tô điền nông nghiệp tư bản là phần lợi nhuận chủ đất nhận được vì
              họ nắm quyền cho thuê ruộng đất. Tô vi phân đến từ lợi thế đất đai
              hoặc thâm canh. Tô tuyệt đối đến từ quyền sở hữu đất. Công cụ,
              công nghệ và AI giúp tăng năng suất. Quản lý sản xuất thuê ngoài
              cũng là lao động sống tổ chức sản xuất, và lao động sống vẫn là
              nguồn tạo giá trị mới.
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
  result: Calculation,
): string[] {
  const explanations: string[] = [];

  // Nguồn gốc giá trị thặng dư
  explanations.push(
    investment.manager
      ? `Giá trị thặng dư (${money(result.surplusValue)}) được tạo ra bởi lao động sống: ${investment.workers} công nhân nông nghiệp và quản lý sản xuất thuê ngoài, không phải do công cụ hay công nghệ.`
      : `Giá trị thặng dư (${money(result.surplusValue)}) được tạo ra bởi ${investment.workers} công nhân nông nghiệp thông qua lao động sống, không phải do công cụ hay công nghệ.`,
  );

  if (result.surplusProfit > 0) {
    explanations.push(
      `Lợi nhuận phụ trội (${money(result.surplusProfit)}) xuất hiện vì lô đất này làm ra nhiều sản phẩm hơn điều kiện chuẩn của thị trường. Đây là lợi thế trong bán hàng.`,
    );
  }

  // Tác động chất lượng lô đất
  if (result.differentialRentI > 0) {
    explanations.push(
      `Tô điền vi phân I (${money(result.differentialRentI)}) xuất hiện vì ${plot.title.toLowerCase()} có độ phì nhiêu và vị trí thuận lợi hơn.`,
    );
  } else {
    explanations.push(
      `Tô điền vi phân I thấp (${money(result.differentialRentI)}) vì lô đất này không vượt trội hơn đất xấu về điều kiện tự nhiên.`,
    );
  }

  // Tác động đầu tư
  if (result.differentialRentII > 0) {
    explanations.push(
      `Tô điền vi phân II (${money(result.differentialRentII)}) xuất hiện từ công cụ trên cùng lô đất. Khoản này chưa trừ khỏi lợi nhuận mùa hiện tại, nhưng có thể bị thu vào mùa vụ trong tương lai. `,
    );
  } else {
    explanations.push(
      `Tô điền vi phân II tối thiểu (${money(result.differentialRentII)}) vì đầu tư thâm canh trên lô đất này bị hạn chế.`,
    );
  }

  // Tô điền tuyệt đối
  explanations.push(
    `Tô điền tuyệt đối (${money(result.absoluteRent)}) bắt nguồn từ quyền sở hữu đất.`,
  );

  // AI/công nghệ nếu sử dụng
  if (investment.aiRobot) {
    explanations.push(
      `Robot AI nâng năng suất 22% và làm giảm thời gian lao động cá biệt trên mỗi sản phẩm. Lao động sống vẫn là nguồn tạo giá trị thặng dư.`,
    );
  }

  // Quản lý nếu sử dụng
  if (investment.manager) {
    explanations.push(
      `Quản lý sản xuất là lao động sống làm thuê. Quản lý sản xuất vừa cộng vào giá trị lao động sống vừa cải thiện tổ chức công việc, nâng hiệu quả tổng thể 14%.`,
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
  const maxValue = Math.max(
    ...plots.map((p) => p.result.surplusValue + p.result.surplusProfit),
  );

  return (
    <div className="plot-comparison-chart grid gap-4">
      <h4 className="text-center text-lg font-black text-white">
        So sánh lô đất: Thặng dư và lợi nhuận phụ trội
      </h4>

      <div className="grid gap-3">
        {plots.map(({ plot, result }) => (
          <div
            key={plot.id}
            className={`pixel-card p-4 ${
              plot.id === currentPlot.id
                ? "border-[#f5cf72]"
                : "border-[#0b1209]"
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h5 className="text-base font-black text-white">
                  {plot.title}
                </h5>
                <p className="text-xs text-[#fff5cf]/60">Lô {plot.short}</p>
              </div>
              <span className="font-mono text-xl font-black text-[#f5cf72]">
                {money(result.surplusValue + result.surplusProfit)}
              </span>
            </div>

            {/* Biểu đồ thanh */}
            <div className="relative h-8 overflow-hidden border-2 border-[#0b1209] bg-[#20361d]">
              <motion.div
                className="h-full bg-[#7fc66a]"
                initial={{ width: 0 }}
                animate={{
                  width: `${((result.surplusValue + result.surplusProfit) / maxValue) * 100}%`,
                }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </div>

            {/* Phân tích tô điền */}
            <div className="mt-2 flex justify-between text-xs text-[#fff5cf]/70">
              <span>Tô mùa này: {money(result.groundRent)}</span>
              <span>Lợi nhuận: {money(result.remainingProfit)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
