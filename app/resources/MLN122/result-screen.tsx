/**
 * Result Screen Components
 * Polished economic calculation displays with clear visual hierarchy
 */

import { type Calculation, type Plot, money } from "./game-model";
import { CoinIcon } from "./pixel-components";
import { ResultLine, RentBox, TheoryStep } from "./ui-components";
import { Coins, TrendingUp, TrendingDown, Users, Factory, Sprout } from "lucide-react";

interface ResultScreenProps {
  result: Calculation;
  plot: Plot;
}

/**
 * Main result screen with economic breakdown
 */
export function ResultScreen({ result, plot }: ResultScreenProps) {
  return (
    <div className="result-screen grid gap-5">
      {/* Header */}
      <div className="result-header">
        <p className="pixel-eyebrow">Tính toán kinh tế</p>
        <h2 className="pixel-heading mt-2 text-3xl md:text-4xl">
          Mùa vụ hoàn tất
        </h2>
        <p className="pixel-text mt-2 max-w-3xl text-sm">
          Mảnh {plot.short}: {plot.title}. Bảng kết quả tách biệt chi phí sản xuất,
          giá trị thặng dư, tô điền và lợi nhuận còn lại.
        </p>
      </div>

      {/* Production Summary Card */}
      <ProductionSummary result={result} plot={plot} />

      {/* Revenue and Costs Breakdown */}
      <div className="grid gap-3 md:grid-cols-2">
        <RevenueSection result={result} />
        <CostsSection result={result} />
      </div>

      {/* Surplus Value Highlight */}
      <SurplusValueCard result={result} />

      {/* Ground Rent Breakdown */}
      <GroundRentSection result={result} plot={plot} />

      {/* Final Profit */}
      <FinalProfitCard result={result} />
    </div>
  );
}

/**
 * Production summary card
 */
function ProductionSummary({ result, plot }: { result: Calculation; plot: Plot }) {
  return (
    <div className="pixel-card grid gap-4 bg-[#2d4c28] p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#f5cf72]">
            Sản lượng nông sản
          </p>
          <h3 className="mt-1 text-3xl font-black text-white">
            {result.output} Đơn vị
          </h3>
        </div>
        <Sprout className="h-12 w-12 text-[#7fc66a] opacity-75" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="border-2 border-[#0b1209] bg-[#10190d]/80 p-3 text-center">
          <Coins className="mx-auto mb-1 h-5 w-5 text-[#f5cf72]" />
          <p className="text-[10px] font-bold uppercase text-[#fff5cf]/70">Doanh thu</p>
          <p className="mt-0.5 font-mono text-lg font-black text-[#f5cf72]">
            {money(result.revenue)}
          </p>
        </div>
        <div className="border-2 border-[#0b1209] bg-[#10190d]/80 p-3 text-center">
          <p className="text-[10px] font-bold uppercase text-[#fff5cf]/70">Loại đất</p>
          <p className="mt-0.5 text-base font-black text-white">{plot.short}</p>
          <p className="text-[10px] text-[#fff5cf]/60">{plot.title}</p>
        </div>
        <div className="border-2 border-[#0b1209] bg-[#10190d]/80 p-3 text-center">
          <TrendingUp className="mx-auto mb-1 h-5 w-5 text-[#7fc66a]" />
          <p className="text-[10px] font-bold uppercase text-[#fff5cf]/70">Năng suất</p>
          <p className="mt-0.5 font-mono text-lg font-black text-[#7fc66a]">
            {Math.round(result.productivityMultiplier * 100)}%
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Revenue section
 */
function RevenueSection({ result }: { result: Calculation }) {
  return (
    <div className="pixel-card grid gap-3 bg-[#20361d] p-4">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center border-2 border-[#0b1209] bg-[#7fc66a]">
          <TrendingUp className="h-5 w-5 text-[#0b1209]" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#7fc66a]">
            Doanh thu
          </p>
          <p className="font-mono text-2xl font-black text-white">
            {money(result.revenue)}
          </p>
        </div>
      </div>
      <p className="text-xs leading-relaxed text-[#fff5cf]/75">
        Tổng thu nhập từ bán {result.output} đơn vị sản phẩm với giá thị trường.
      </p>
    </div>
  );
}

/**
 * Costs section
 */
function CostsSection({ result }: { result: Calculation }) {
  const totalCosts = result.constantCapital + result.variableCapital;

  return (
    <div className="pixel-card grid gap-3 bg-[#20361d] p-4">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center border-2 border-[#0b1209] bg-[#d94b35]">
          <TrendingDown className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#d94b35]">
            Tổng chi phí
          </p>
          <p className="font-mono text-2xl font-black text-white">
            {money(totalCosts)}
          </p>
        </div>
      </div>
      
      <div className="grid gap-2">
        <div className="flex justify-between text-xs">
          <span className="text-[#fff5cf]/70">Vốn không đổi (hạt giống, công cụ, công nghệ)</span>
          <span className="font-mono font-bold text-[#fff5cf]">
            {money(result.constantCapital)}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-[#fff5cf]/70">Vốn biến đổi (lương công nhân)</span>
          <span className="font-mono font-bold text-[#fff5cf]">
            {money(result.variableCapital)}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Surplus value highlight card
 */
function SurplusValueCard({ result }: { result: Calculation }) {
  return (
    <div className="relative overflow-hidden border-4 border-[#f5cf72] bg-gradient-to-br from-[#2d4c28] to-[#20361d] p-5 shadow-[6px_6px_0_#0b1209]">
      {/* Decorative corner accents */}
      <div className="absolute left-0 top-0 h-3 w-3 border-l-4 border-t-4 border-[#f5cf72]" />
      <div className="absolute right-0 top-0 h-3 w-3 border-r-4 border-t-4 border-[#f5cf72]" />
      
      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="pixel-eyebrow text-[#f5cf72]">Kết quả kinh tế cốt lõi</p>
            <h3 className="mt-2 text-2xl font-black text-white md:text-3xl">
              Giá trị thặng dư tạo ra
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#fff5cf]/80">
              Giá trị mới tạo ra bởi lao động sống vượt quá chi phí tiền lương.
              Đây là nguồn gốc của lợi nhuận và tô điền.
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-2">
              <CoinIcon scale={3} />
              <p className="font-mono text-5xl font-black text-[#f5cf72]">
                {result.surplusValue}
              </p>
            </div>
            <p className="mt-1 text-xs font-bold text-[#f5cf72]/70">coins</p>
          </div>
        </div>

        {/* Calculation breakdown */}
        <div className="mt-4 grid gap-2 border-t-2 border-[#f5cf72]/30 pt-4 md:grid-cols-3">
          <div className="text-center">
            <Users className="mx-auto mb-1 h-5 w-5 text-[#7fc66a]" />
            <p className="text-[10px] font-bold uppercase text-[#fff5cf]/60">
              Giá trị lao động sống
            </p>
            <p className="mt-1 font-mono text-lg font-black text-white">
              {money(result.livingLaborValue)}
            </p>
          </div>
          <div className="text-center">
            <p className="mb-1 text-2xl font-black text-[#f5cf72]">−</p>
            <p className="text-[10px] font-bold uppercase text-[#fff5cf]/60">
              Tiền lương trả
            </p>
            <p className="mt-1 font-mono text-lg font-black text-white">
              {money(result.variableCapital)}
            </p>
          </div>
          <div className="text-center">
            <p className="mb-1 text-2xl font-black text-[#f5cf72]">=</p>
            <p className="text-[10px] font-bold uppercase text-[#f5cf72]">
              Giá trị thặng dư
            </p>
            <p className="mt-1 font-mono text-lg font-black text-[#f5cf72]">
              {money(result.surplusValue)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Ground rent breakdown section
 */
function GroundRentSection({ result, plot }: { result: Calculation; plot: Plot }) {
  return (
    <div className="ground-rent-section grid gap-3">
      <div className="pixel-card bg-[#10190d] p-4">
        <h3 className="mb-3 text-lg font-black text-[#f5cf72]">
          Phân tích Tô điền
        </h3>
        <p className="mb-4 text-sm leading-relaxed text-[#fff5cf]/80">
          Tô điền được chiết từ giá trị thặng dư vì chủ đất sở hữu đất đai.
          Nó bao gồm tô điền tuyệt đối (mọi loại đất) và tô điền vi phân (đất tốt hơn).
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <RentBox
          title="Differential Rent I"
          value={result.differentialRentI}
          text="Extra profit from better natural fertility and location compared to poor land."
        />
        <RentBox
          title="Differential Rent II"
          value={result.differentialRentII}
          text="Extra profit from additional capital investment on the same plot."
        />
        <RentBox
          title="Absolute Rent"
          value={result.absoluteRent}
          text="Basic rent paid on all land because of private land ownership."
        />
      </div>

      <div className="pixel-card flex items-center justify-between gap-4 bg-[#d94b35] p-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-white/80">
            Tô điền tổng cộng trả cho chủ đất
          </p>
          <p className="mt-1 font-mono text-3xl font-black text-white">
            {money(result.groundRent)}
          </p>
        </div>
        <Factory className="h-12 w-12 text-white/60" />
      </div>
    </div>
  );
}

/**
 * Final profit card
 */
function FinalProfitCard({ result }: { result: Calculation }) {
  const profitColor = result.remainingProfit > 0 ? "#7fc66a" : "#d94b35";

  return (
    <div 
      className="pixel-card grid gap-4 p-5"
      style={{ 
        backgroundColor: "#10190d",
        borderColor: profitColor,
        borderWidth: 4
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide" style={{ color: profitColor }}>
            Lợi nhuận nhà tư bản sau thuê đất
          </p>
          <p className="mt-1 font-mono text-4xl font-black text-white">
            {money(result.remainingProfit)}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[#fff5cf]/75">
            Phần giá trị thặng dư còn lại với nhà tư bản sau khi trả
            tô điền cho chủ đất.
          </p>
        </div>
        <div className="text-center">
          <div 
            className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full border-4"
            style={{ borderColor: profitColor, backgroundColor: `${profitColor}20` }}
          >
            <Coins className="h-8 w-8" style={{ color: profitColor }} />
          </div>
          <p className="text-xs font-bold" style={{ color: profitColor }}>
            {result.remainingProfit > 0 ? "Lợi nhuận" : "Lỗ"}
          </p>
        </div>
      </div>

      {/* Profit breakdown */}
      <div className="grid gap-2 border-t-2 border-[#fff5cf]/20 pt-3 text-sm">
        <div className="flex justify-between">
          <span className="text-[#fff5cf]/70">Giá trị thặng dư tạo ra</span>
          <span className="font-mono font-bold text-white">
            {money(result.surplusValue)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#fff5cf]/70">Tô điền trả</span>
          <span className="font-mono font-bold text-[#d94b35]">
            −{money(result.groundRent)}
          </span>
        </div>
        <div className="flex justify-between border-t-2 border-[#fff5cf]/20 pt-2">
          <span className="font-bold text-white">Lợi nhuận còn lại</span>
          <span className="font-mono font-black" style={{ color: profitColor }}>
            {money(result.remainingProfit)}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact result summary for other screens
 */
export function ResultSummaryCompact({ result }: { result: Calculation }) {
  return (
    <div className="result-summary-compact grid gap-2">
      <div className="grid grid-cols-3 gap-2">
        <div className="pixel-card bg-[#2d4c28] p-3 text-center">
          <p className="text-[10px] font-bold uppercase text-[#7fc66a]">Doanh thu</p>
          <p className="mt-1 font-mono text-lg font-black text-white">
            {money(result.revenue)}
          </p>
        </div>
        <div className="pixel-card bg-[#f5cf72] p-3 text-center">
          <p className="text-[10px] font-bold uppercase text-[#2d2114]">Thặng dư</p>
          <p className="mt-1 font-mono text-lg font-black text-[#2d2114]">
            {money(result.surplusValue)}
          </p>
        </div>
        <div className="pixel-card bg-[#d94b35] p-3 text-center">
          <p className="text-[10px] font-bold uppercase text-white/80">Tô điền</p>
          <p className="mt-1 font-mono text-lg font-black text-white">
            {money(result.groundRent)}
          </p>
        </div>
      </div>
    </div>
  );
}
