"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bot,
  BriefcaseBusiness,
  Factory,
  Landmark,
  Play,
  RotateCcw,
  ScrollText,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthRequiredModal } from "@/components/AuthRequiredModal";
import { useAuth } from "@/contexts/AuthContext";
import {
  DEFAULT_INVESTMENT,
  PLOTS,
  calculateSeason,
  getPlot,
  money,
  screenOrder,
  type Calculation,
  type InvestmentState,
  type Plot,
  type PlotId,
  type Screen,
} from "./game-model";

// Import new polished components
import { VillageHero } from "./village-scene";
import { FarmScene } from "./farm-scene";
import { ScreenTransition } from "./animations";
import { ResultScreen as NewResultScreen } from "./result-screen";
import { InvestmentScreen as NewInvestmentScreen } from "./investment-screen";
import { TheoryExplanation, ValueFlowDiagram } from "./economic-storytelling";
import { 
  ScreenHeading, 
  RoleCard, 
  TheoryNote,
  SummaryStat,
  PanelLine,
  Metric,
  LoadingSpinner
} from "./ui-components";

// Import CSS
import "./game-styles.css";

export default function PixelRentFarmGame() {
  const { user, loading } = useAuth();
  const [screen, setScreen] = useState<Screen>("title");
  const [selectedPlotId, setSelectedPlotId] = useState<PlotId>("fertile");
  const [investment, setInvestment] =
    useState<InvestmentState>(DEFAULT_INVESTMENT);

  const selectedPlot = getPlot(selectedPlotId);
  const result = useMemo(
    () => calculateSeason(selectedPlot, investment),
    [selectedPlot, investment],
  );
  const screenIndex = screenOrder.indexOf(screen);

  const goNext = () => {
    const next = screenOrder[Math.min(screenIndex + 1, screenOrder.length - 1)];
    setScreen(next);
  };

  const resetGame = () => {
    setScreen("title");
    setSelectedPlotId("fertile");
    setInvestment(DEFAULT_INVESTMENT);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <AuthRequiredModal show={true} />;
  }

  return (
    <main className="pixel-game-root min-h-screen overflow-x-hidden">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-4 px-4 py-5 lg:px-6">
        <header className="grid gap-4 border-4 border-[#0b1209] bg-[#24381d] p-4 shadow-[6px_6px_0_#0b1209] md:grid-cols-[auto_1fr_auto] md:items-center">
          <Link href="/resources">
            <Button
              type="button"
              variant="ghost"
              className="gap-2 rounded-none border-2 border-[#0b1209] bg-[#f5cf72] font-black text-[#2d2114] shadow-[3px_3px_0_#0b1209] hover:bg-[#ffe08c]"
            >
              <ArrowLeft className="h-4 w-4" />
              Tài nguyên
            </Button>
          </Link>

          <div className="min-w-0">
            <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-[#f5cf72]">
              MLN122 - Trò chơi mô phỏng kinh tế
            </p>
            <h1 className="mt-1 text-2xl font-black leading-tight text-white md:text-4xl">
              Nông trang tô điền: Một mùa thu hoạch
            </h1>
          </div>

          <div className="grid grid-cols-8 gap-1">
            {screenOrder.map((item, index) => (
              <button
                key={item}
                type="button"
                title={item}
                aria-label={`Đi tới ${item}`}
                onClick={() => setScreen(item)}
                className={`h-8 w-8 border-2 border-[#0b1209] font-mono text-[10px] font-black uppercase ${
                  index === screenIndex
                    ? "bg-[#f5cf72] text-[#2d2114]"
                    : index < screenIndex
                      ? "bg-[#7fc66a] text-[#0b1209]"
                      : "bg-[#10190d] text-[#fff5cf]/50"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </header>

        <div className="grid flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="pixel-panel min-h-[640px] p-4">
            <ScreenTransition screenKey={screen}>
              {screen === "title" && <TitleScreen onStart={goNext} />}
              {screen === "story" && <StoryScreen />}
              {screen === "land" && (
                <LandScreen
                  selectedPlotId={selectedPlotId}
                  onSelect={setSelectedPlotId}
                />
              )}
              {screen === "investment" && (
                <NewInvestmentScreen
                  investment={investment}
                  onChange={setInvestment}
                />
              )}
              {screen === "farming" && (
                <FarmingScreen plot={selectedPlot} investment={investment} />
              )}
              {screen === "result" && (
                <NewResultScreen result={result} plot={selectedPlot} />
              )}
              {screen === "theory" && (
                <TheoryScreen
                  plot={selectedPlot}
                  investment={investment}
                  result={result}
                />
              )}
              {screen === "summary" && <SummaryScreen result={result} />}
            </ScreenTransition>
          </section>

          <aside className="grid content-start gap-4">
            <ControlPanel
              screen={screen}
              plot={selectedPlot}
              investment={investment}
              result={result}
              onNext={goNext}
              onReset={resetGame}
              nextDisabled={screen === "summary"}
            />
            <MiniMap plot={selectedPlot} />
          </aside>
        </div>
      </div>
    </main>
  );
}

function TitleScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="grid h-full content-center gap-6">
      <VillageHero />
      <div className="mx-auto max-w-3xl text-center">
        <p className="pixel-eyebrow">
          Trò chơi mô phỏng
        </p>
        <h2 className="pixel-heading mt-3 text-4xl md:text-6xl">
          Nông trang tô điền
        </h2>
        <p className="pixel-text mx-auto mt-4 max-w-2xl text-sm md:text-base">
          Tô điền không phải xuất hiện thần kỳ từ đất đai. Nó là một phần của giá trị thặng dư được các công nhân nông nghiệp trả công tạo ra, rồi chuyển cho địa chủ vì địa chủ sở hữu đất đai.
        </p>
        <Button
          type="button"
          onClick={onStart}
          className="pixel-button mt-6 gap-2 bg-[#d94b35] px-8 py-6 text-base font-black text-white hover:bg-[#ef634b]"
        >
          <Play className="h-5 w-5" />
          Bắt đầu mùa vụ
        </Button>
      </div>
    </div>
  );
}

function StoryScreen() {
  return (
    <div className="grid gap-5">
      <ScreenHeading
        eyebrow="Phần giới thiệu"
        title="Ba giai cấp gặp nhau trong làng"
        text="Bạn vào vai nhà tư bản nông nghiệp. Bạn thuê đất, thuê công nhân, đầu tư vốn, bán nông sản, rồi trả tô điền cho địa chủ."
      />
      <div className="grid gap-4 md:grid-cols-5">
        <RoleCard icon={<Landmark />} title="Địa chủ" text="Sở hữu đất và thu tô điền." />
        <RoleCard icon={<BriefcaseBusiness />} title="Bạn" text="Thuê đất và tổ chức sản xuất." />
        <RoleCard icon={<Users />} title="Công nhân" text="Tạo ra giá trị mới qua lao động sống." />
        <RoleCard icon={<Factory />} title="Quản lý" text="Cải thiện điều phối và hiệu quả." />
        <RoleCard icon={<Bot />} title="Công cụ AI" text="Nâng cao năng suất, nhưng không phải nguồn giá trị." />
      </div>
      <TheoryNote>
        Ý tưởng chính: giá trị thặng dư đến từ lao động sống trong sản xuất. Công cụ, quản lý và AI có thể nâng cao năng suất, nhưng chúng không thay thế vai trò của lao động làm nguồn giá trị thặng dư.
      </TheoryNote>
    </div>
  );
}

function LandScreen({
  selectedPlotId,
  onSelect,
}: {
  selectedPlotId: PlotId;
  onSelect: (id: PlotId) => void;
}) {
  return (
    <div className="grid gap-5">
      <ScreenHeading
        eyebrow="Chọn đất"
        title="Chọn một mảnh đất để thuê"
        text="Độ phì nhiêu của đất và vị trí định hình lợi nhuận thêm. Sở hữu đất nghĩa là tô điền cơ bản vẫn cần được trả."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {PLOTS.map((plot) => (
          <button
            key={plot.id}
            type="button"
            onClick={() => onSelect(plot.id)}
            className={`pixel-card grid gap-3 p-3 text-left ${
              selectedPlotId === plot.id
                ? "border-[#f5cf72] bg-[#20361d]"
                : "border-[#0b1209] bg-[#263f22]"
            }`}
          >
            <div className="relative h-32 overflow-hidden border-2 border-[#0b1209]">
              <img 
                src={`/resources/MLN122/asset/${plot.mapAsset}`}
                alt={plot.title}
                className="pixelated h-full w-full object-cover"
              />
            </div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="pixel-eyebrow">Mảnh {plot.short}</p>
                <h3 className="text-xl font-black text-white">{plot.title}</h3>
                <p className="text-xs font-bold text-[#fff5cf]/70">
                  {plot.location}
                </p>
              </div>
              <span className="border-2 border-[#0b1209] bg-[#f5cf72] px-3 py-2 font-mono text-xl font-black text-[#2d2114]">
                {plot.short}
              </span>
            </div>
            <p className="min-h-[48px] text-sm leading-relaxed text-[#fff5cf]/78">
              {plot.description}
            </p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <Metric label="Năng suất" value={`${Math.round(plot.productivity * 100)}%`} />
              <Metric label="Thị trường" value={`${Math.round(plot.marketBonus * 100)}%`} />
              <Metric label="Tô điền" value={money(plot.absoluteRent)} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function FarmingScreen({
  plot,
  investment,
}: {
  plot: Plot;
  investment: InvestmentState;
}) {
  return (
    <div className="grid gap-5">
      <ScreenHeading
        eyebrow="Trồng trọt và thu hoạch"
        title="Nông sản phát triển qua lao động và đầu tư"
        text="Xem quá trình sản xuất. Công nhân tạo ra giá trị, đầu tư định hình năng suất."
      />
      <FarmScene plot={plot} investment={investment} animated={true} />
    </div>
  );
}

function TheoryScreen({
  plot,
  investment,
  result,
}: {
  plot: Plot;
  investment: InvestmentState;
  result: Calculation;
}) {
  return (
    <div className="grid gap-5">
      <ValueFlowDiagram result={result} />
      <TheoryExplanation plot={plot} investment={investment} result={result} />
    </div>
  );
}

function SummaryScreen({ result }: { result: Calculation }) {
  return (
    <div className="grid h-full content-center gap-6">
      <div className="mx-auto max-w-3xl text-center">
        <ScrollText className="mx-auto h-14 w-14 text-[#f5cf72]" />
        <p className="mt-4 font-mono text-xs font-black uppercase tracking-[0.22em] text-[#f5cf72]">
          Tóm tắt cuối cùng
        </p>
        <h2 className="mt-3 text-4xl font-black leading-tight text-white">
          Mùa vụ hoàn thành
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-[#fff5cf]/82">
          Công nhân tạo ra giá trị mới. Vốn và công nghệ định hình năng suất. Địa chủ nhận được tô điền vì sở hữu đất đai.
        </p>
      </div>
      <div className="mx-auto grid w-full max-w-3xl gap-3 md:grid-cols-3">
        <SummaryStat label="Giá trị thặng dư" value={money(result.surplusValue)} />
        <SummaryStat label="Tô điền" value={money(result.groundRent)} />
        <SummaryStat label="Nhà tư bản giữ lại" value={money(result.remainingProfit)} />
      </div>
    </div>
  );
}

function ControlPanel({
  screen,
  plot,
  investment,
  result,
  onNext,
  onReset,
  nextDisabled,
}: {
  screen: Screen;
  plot: Plot;
  investment: InvestmentState;
  result: Calculation;
  onNext: () => void;
  onReset: () => void;
  nextDisabled: boolean;
}) {
  return (
    <div className="pixel-panel bg-[#f5cf72] p-4 text-[#2d2114]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="pixel-eyebrow text-[#2d2114]">Màn hình hiện tại</p>
          <h2 className="mt-1 text-2xl font-black capitalize">{screen}</h2>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onReset}
          title="Khởi động lại"
          aria-label="Khởi động lại"
          className="pixel-button bg-white/45 text-[#2d2114] hover:bg-white"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-4 grid gap-2">
        <PanelLine label="Đất" value={plot.title} />
        <PanelLine label="Công nhân" value={String(investment.workers)} />
        <PanelLine label="Công cụ AI" value={investment.aiRobot ? "Bật" : "Tắt"} />
        <PanelLine label="Tô điền" value={money(result.groundRent)} />
      </div>

      <Button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className="pixel-button mt-5 w-full gap-2 bg-[#d94b35] py-6 text-base font-black text-white hover:bg-[#ef634b] disabled:opacity-60"
      >
        <Play className="h-5 w-5" />
        {nextDisabled ? "Hoàn thành" : "Tiếp theo"}
      </Button>
    </div>
  );
}

function MiniMap({ plot }: { plot: Plot }) {
  return (
    <div className="pixel-panel bg-[#20361d] p-4">
      <p className="pixel-eyebrow mb-3">Sơ đồ làng</p>
      <div className="grid grid-cols-3 gap-2">
        {PLOTS.map((item) => (
          <div
            key={item.id}
            className={`h-20 border-2 border-[#0b1209] p-1 ${
              item.id === plot.id ? "bg-[#f5cf72]" : "bg-[#35582f]"
            }`}
          >
            <img
              src={`/resources/MLN122/asset/${item.mapAsset}`}
              alt={item.title}
              className="pixelated h-full w-full border border-black/20 object-cover"
            />
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="scale-75 origin-top-left">
          <img 
            src={`/resources/MLN122/asset/${plot.buildingAsset}`}
            alt="Địa chủ"
            className="pixelated h-16 w-20 object-contain"
          />
        </div>
        <div className="scale-75 origin-top-right">
          <img 
            src="/resources/MLN122/asset/Buildings__Shed.png"
            alt="Chợ"
            className="pixelated h-16 w-20 object-contain"
          />
        </div>
      </div>
    </div>
  );
}
