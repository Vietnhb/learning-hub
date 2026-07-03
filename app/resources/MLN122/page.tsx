"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
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
  INVESTMENT_COSTS,
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
} from "./core/game-model";

import { VillageHero } from "./scenes/village-scene";
import { FarmingScene } from "./scenes/farming-scene";
import { type FarmType } from "./core/farm-types";
import { MLN122_SPRITE_BASE } from "./core/paths";
import { ScreenTransition } from "./ui/animations";
import { ResultScreen as NewResultScreen } from "./screens/result-screen";
import { InvestmentScreen as NewInvestmentScreen } from "./screens/investment-screen";
import { TheoryExplanation, ValueFlowDiagram } from "./screens/theory-content";
import { LeaderboardScreen } from "./screens/leaderboard-screen";
import {
  resetMln122LeaderboardEntry,
  saveMln122LeaderboardEntry,
} from "./screens/leaderboard-db";
import {
  QUIZ_QUESTIONS,
  type QuizAnswers,
  QuizScreen,
  getQuizScore,
} from "./screens/quiz-screen";
import {
  ScreenHeading,
  RoleCard,
  TheoryNote,
  SummaryStat,
  PanelLine,
  Metric,
  LoadingSpinner,
} from "./ui/components";

// Import CSS
import "./styles/game.css";

const QUIZ_DURATION_MS = 30 * 60 * 1000;

export default function PixelRentFarmGame() {
  const { user, loading } = useAuth();
  const [screen, setScreen] = useState<Screen>("title");
  const [selectedPlotId, setSelectedPlotId] = useState<PlotId>("fertile");
  const selectedFarmType: FarmType = "standard";
  const [investment, setInvestment] =
    useState<InvestmentState>(DEFAULT_INVESTMENT);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizStartedAt, setQuizStartedAt] = useState(() => Date.now());
  const [quizRemainingMs, setQuizRemainingMs] = useState(QUIZ_DURATION_MS);
  const [submittedQuizDurationMs, setSubmittedQuizDurationMs] = useState<
    number | null
  >(null);
  const [leaderboardRefreshKey, setLeaderboardRefreshKey] = useState(0);

  const selectedPlot = getPlot(selectedPlotId);
  const result = useMemo(
    () => calculateSeason(selectedPlot, investment),
    [selectedPlot, investment],
  );
  const screenIndex = screenOrder.indexOf(screen);
  const quizScore = getQuizScore(quizAnswers);
  const submittedQuizScore = quizSubmitted ? quizScore : 0;
  const refreshLeaderboard = useCallback(() => {
    setLeaderboardRefreshKey((current) => current + 1);
  }, []);

  const removeCurrentLeaderboardEntry = () => {
    if (!user?.id) return;

    void resetMln122LeaderboardEntry(user.id)
      .catch((error) => {
        console.error("Could not reset MLN122 leaderboard entry:", error);
      })
      .finally(refreshLeaderboard);
  };

  const resetQuizAttempt = () => {
    const startedAt = Date.now();
    setQuizAnswers({});
    setQuizStarted(false);
    setQuizSubmitted(false);
    setSubmittedQuizDurationMs(null);
    setQuizStartedAt(startedAt);
    setQuizRemainingMs(QUIZ_DURATION_MS);
    removeCurrentLeaderboardEntry();
  };

  const submitQuizAttempt = useCallback(() => {
    if (quizSubmitted) return;

    const durationMs = Math.min(
      QUIZ_DURATION_MS,
      Math.max(1, Date.now() - quizStartedAt),
    );
    const score = getQuizScore(quizAnswers);

    setQuizSubmitted(true);
    setQuizStarted(false);
    setSubmittedQuizDurationMs(durationMs);
    setQuizRemainingMs(Math.max(0, QUIZ_DURATION_MS - durationMs));
    setScreen("leaderboard");

    if (!user?.id) return;

    void saveMln122LeaderboardEntry({
      userId: user.id,
      displayName: getUserDisplayName(user),
      score,
      totalQuestions: QUIZ_QUESTIONS.length,
      durationMs,
    })
      .catch((error) => {
        console.error("Could not save MLN122 leaderboard entry:", error);
      })
      .finally(refreshLeaderboard);
  }, [quizAnswers, quizStartedAt, quizSubmitted, refreshLeaderboard, user]);

  const startQuizAttempt = () => {
    const startedAt = Date.now();
    setQuizStartedAt(startedAt);
    setQuizRemainingMs(QUIZ_DURATION_MS);
    setQuizStarted(true);
    setQuizSubmitted(false);
    setSubmittedQuizDurationMs(null);
  };

  useEffect(() => {
    if (!quizStarted || quizSubmitted) return;

    const updateRemainingTime = () => {
      const nextRemainingMs = Math.max(
        0,
        QUIZ_DURATION_MS - (Date.now() - quizStartedAt),
      );

      setQuizRemainingMs(nextRemainingMs);

      if (nextRemainingMs <= 0) {
        submitQuizAttempt();
      }
    };

    updateRemainingTime();
    const timerId = window.setInterval(updateRemainingTime, 1000);

    return () => window.clearInterval(timerId);
  }, [quizStarted, quizStartedAt, quizSubmitted, submitQuizAttempt]);

  const goNext = () => {
    if (screenIndex < 0) return;
    const next = screenOrder[Math.min(screenIndex + 1, screenOrder.length - 1)];
    setScreen(next);
  };

  const openQuizScreen = () => {
    setScreen("quiz");
  };

  const resetGame = () => {
    setScreen("title");
    setSelectedPlotId("fertile");
    setInvestment(DEFAULT_INVESTMENT);
    resetQuizAttempt();
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

          <div className="grid justify-items-start gap-2 md:justify-items-end">
            <div className="grid grid-cols-8 gap-1">
              {screenOrder.map((item, index) => (
                <button
                  key={item}
                  type="button"
                  title={getScreenTitle(item)}
                  aria-label={`Đi tới ${getScreenTitle(item)}`}
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
            <div className="flex flex-wrap justify-start gap-2 md:justify-end">
              <button
                type="button"
                onClick={openQuizScreen}
                className={`h-9 border-2 border-[#0b1209] px-4 font-black shadow-[3px_3px_0_#0b1209] transition ${
                  screen === "quiz"
                    ? "bg-[#f5cf72] text-[#2d2114]"
                    : "bg-[#10190d] text-[#f5cf72] hover:bg-[#20361d]"
                }`}
              >
                Làm Quiz
              </button>
              <button
                type="button"
                onClick={() => setScreen("leaderboard")}
                className={`h-9 border-2 border-[#0b1209] px-4 font-black shadow-[3px_3px_0_#0b1209] transition ${
                  screen === "leaderboard"
                    ? "bg-[#f5cf72] text-[#2d2114]"
                    : "bg-[#10190d] text-[#f5cf72] hover:bg-[#20361d]"
                }`}
              >
                Bảng xếp hạng
              </button>
            </div>
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
                <FarmingScreen
                  plot={selectedPlot}
                  investment={investment}
                  farmType={selectedFarmType}
                />
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
              {screen === "quiz" && (
                <QuizScreen
                  answers={quizAnswers}
                  submitted={quizSubmitted}
                  started={quizStarted}
                  remainingMs={quizRemainingMs}
                  onAnswer={(questionId, selectedAnswers) => {
                    setQuizAnswers((current) => {
                      if (selectedAnswers.length === 0) {
                        const next = { ...current };
                        delete next[questionId];
                        return next;
                      }

                      return {
                        ...current,
                        [questionId]: selectedAnswers,
                      };
                    });
                    setQuizSubmitted(false);
                    setSubmittedQuizDurationMs(null);
                  }}
                  onClear={resetQuizAttempt}
                  onStart={startQuizAttempt}
                  onSubmit={submitQuizAttempt}
                  onGoLeaderboard={() => setScreen("leaderboard")}
                />
              )}
              {screen === "leaderboard" && (
                <LeaderboardScreen
                  currentUserId={user.id}
                  currentScore={submittedQuizScore}
                  totalQuestions={QUIZ_QUESTIONS.length}
                  currentDurationMs={submittedQuizDurationMs}
                  refreshKey={leaderboardRefreshKey}
                  onRestartQuiz={() => {
                    resetQuizAttempt();
                    setScreen("quiz");
                  }}
                />
              )}
            </ScreenTransition>
          </section>

          <aside className="grid content-start gap-4">
            <ControlPanel
              screen={screen}
              plot={selectedPlot}
              investment={investment}
              result={result}
              quizScore={submittedQuizScore}
              onNext={goNext}
              onReset={resetGame}
              nextDisabled={
                screen === "summary" ||
                screen === "quiz" ||
                screen === "leaderboard"
              }
            />

            {screenIndex >= screenOrder.indexOf("land") && (
              <MiniMap plot={selectedPlot} />
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}

function getUserDisplayName(user: User) {
  const metadata = user.user_metadata ?? {};
  const metadataName =
    metadata.full_name ??
    metadata.name ??
    metadata.user_name ??
    metadata.username;

  if (typeof metadataName === "string" && metadataName.trim()) {
    return metadataName.trim();
  }

  if (user.email) return user.email.split("@")[0];

  return "Bạn";
}

function TitleScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="grid h-full content-center gap-6">
      <VillageHero />
      <div className="mx-auto max-w-3xl text-center">
        <p className="pixel-eyebrow">Trò chơi mô phỏng</p>
        <h2 className="pixel-heading mt-3 text-4xl md:text-6xl">
          Nông trang tô điền
        </h2>
        <p className="pixel-text mx-auto mt-4 max-w-2xl text-sm md:text-base">
          Tô điền không tự sinh ra từ đất. Trong game này, đó là phần lợi nhuận
          chủ đất nhận được vì họ nắm quyền cho thuê ruộng đất. Đất tốt hoặc đầu
          tư thâm canh có thể tạo thêm lợi nhuận phụ trội.
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
      <div className="grid gap-4 md:grid-cols-3">
        <RoleCard
          icon={<Landmark />}
          title="Địa chủ"
          text="Sở hữu đất và thu tô điền."
        />
        <RoleCard
          icon={<BriefcaseBusiness />}
          title="Bạn"
          text="Thuê đất và tổ chức sản xuất."
        />
        <RoleCard
          icon={<Users />}
          title="Công nhân"
          text="Tạo ra giá trị mới qua lao động sống."
        />
      </div>
      <TheoryNote>
        Ý tưởng chính: giá trị thặng dư đến từ lao động sống trong sản xuất.
        Quản lý thuê ngoài cũng là lao động sống tổ chức sản xuất; công cụ và
        AI chỉ hỗ trợ nâng năng suất, không thay thế lao động làm nguồn giá trị
        mới.
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
                src={`${MLN122_SPRITE_BASE}/${plot.mapAsset}`}
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
              <Metric
                label="Năng suất"
                value={`${Math.round(plot.productivity * 100)}%`}
              />
              <Metric
                label="Thị trường"
                value={`${Math.round(plot.marketBonus * 100)}%`}
              />
              <Metric label="Tô cơ sở" value={money(plot.absoluteRent)} />
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
  farmType,
}: {
  plot: Plot;
  investment: InvestmentState;
  farmType: FarmType;
}) {
  return (
    <div className="grid gap-5">
      <ScreenHeading
        eyebrow="Trồng trọt và thu hoạch"
        title="Nông sản phát triển qua lao động và đầu tư"
        text="Xem quá trình sản xuất. Công nhân tạo ra giá trị, đầu tư định hình năng suất."
      />

      <FarmingScene plot={plot} investment={investment} farmType={farmType} />
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
          Công nhân tạo ra giá trị mới. Vốn và công nghệ định hình năng suất.
          Địa chủ nhận được tô điền vì sở hữu đất đai.
        </p>
      </div>
      <div className="mx-auto grid w-full max-w-3xl gap-3 md:grid-cols-3">
        <SummaryStat
          label="Giá trị thặng dư"
          value={money(result.surplusValue)}
        />
        <SummaryStat label="Tô điền" value={money(result.groundRent)} />
        <SummaryStat
          label="Nhà tư bản giữ lại"
          value={money(result.remainingProfit)}
        />
      </div>
    </div>
  );
}

function ControlPanel({
  screen,
  plot,
  investment,
  result,
  quizScore,
  onNext,
  onReset,
  nextDisabled,
}: {
  screen: Screen;
  plot: Plot;
  investment: InvestmentState;
  result: Calculation;
  quizScore: number;
  onNext: () => void;
  onReset: () => void;
  nextDisabled: boolean;
}) {
  const screenTitle = getScreenTitle(screen);
  const panelLines = getControlPanelLines(
    screen,
    plot,
    investment,
    result,
    quizScore,
  );

  return (
    <div className="pixel-panel bg-[#f5cf72] p-4 text-[#2d2114]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="pixel-eyebrow text-[#2d2114]">Màn hình hiện tại</p>
          <h2 className="mt-1 text-2xl font-black">{screenTitle}</h2>
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
        {panelLines.map((line) => (
          <PanelLine key={line.label} label={line.label} value={line.value} />
        ))}
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

function getScreenTitle(screen: Screen) {
  const titles: Record<Screen, string> = {
    title: "Bắt đầu",
    story: "Bối cảnh",
    land: "Chọn đất",
    investment: "Đầu tư",
    farming: "Canh tác",
    result: "Kết quả",
    theory: "Lý thuyết",
    summary: "Tổng kết",
    quiz: "Quiz",
    leaderboard: "Bảng xếp hạng",
  };

  return titles[screen];
}

function getControlPanelLines(
  screen: Screen,
  plot: Plot,
  investment: InvestmentState,
  result: Calculation,
  quizScore: number,
) {
  const totalCapital = result.constantCapital + result.variableCapital;
  const constantCapital = result.constantCapital;

  switch (screen) {
    case "title":
      return [
        { label: "Vai trò", value: "Nhà tư bản" },
        { label: "Mục tiêu", value: "Bắt đầu mùa vụ" },
      ];
    case "story":
      return [
        { label: "Địa chủ", value: "Thu tô" },
        { label: "Công nhân", value: "Tạo giá trị" },
        { label: "Bạn", value: "Tổ chức sản xuất" },
      ];
    case "land":
      return [
        { label: "Đất đang xem", value: plot.title },
        { label: "Vị trí", value: plot.location },
        { label: "Tô cơ sở", value: money(plot.absoluteRent) },
      ];
    case "investment":
      return [
        { label: "Công nhân", value: String(investment.workers) },
        { label: "Quản lý", value: investment.manager ? "Lao động sống" : "Không thuê" },
        { label: "Vốn không đổi", value: money(constantCapital) },
        { label: "Tổng vốn", value: money(totalCapital) },
      ];
    case "farming":
      return [
        { label: "Đất", value: plot.title },
        { label: "Công nhân", value: String(investment.workers) },
        { label: "AI", value: investment.aiRobot ? "Đang dùng" : "Không dùng" },
      ];
    case "result":
    case "theory":
    case "summary":
      return [
        { label: "Giá trị thặng dư", value: money(result.surplusValue) },
        { label: "Tô điền", value: money(result.groundRent) },
        { label: "Còn lại", value: money(result.remainingProfit) },
      ];
    case "quiz":
      return [
        { label: "Số câu", value: `${QUIZ_QUESTIONS.length}` },
        { label: "Điểm", value: `${quizScore}/${QUIZ_QUESTIONS.length}` },
      ];
    case "leaderboard":
      return [
        { label: "Bảng", value: "Điểm quiz" },
        {
          label: "Điểm của bạn",
          value: `${quizScore}/${QUIZ_QUESTIONS.length}`,
        },
        { label: "Cách tăng điểm", value: "Làm Quiz" },
      ];
  }
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
              src={`${MLN122_SPRITE_BASE}/${item.mapAsset}`}
              alt={item.title}
              className="pixelated h-full w-full border border-black/20 object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
