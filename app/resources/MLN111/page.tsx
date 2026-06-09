"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Info,
  RotateCcw,
  Sparkles,
  Zap,
  ShieldCheck,
  Compass,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { AuthRequiredModal } from "@/components/AuthRequiredModal";

import EnergyBeams from "./components/EnergyBeams";
import ReactorCore from "./components/ReactorCore";
import PlanetGrid from "./components/PlanetGrid";
import InsightOverlay from "./components/InsightOverlay";
import VictoryModal from "./components/VictoryModal";

import {
  SECTORS,
  ALL_CRYSTALS,
  PLANET_THEMES,
  SANDBOX_SYNTHESIS,
  CORE_PRINCIPLES,
  DIALECTICAL_LAWS,
  CATEGORY_PAIR_GUIDES,
  type Connection,
  type ReactorState,
} from "./data";

export default function DialecticalUniverseGame() {
  const { user, loading } = useAuth();

  // Campaign State
  const [currentSector, setCurrentSector] = useState(0);
  const [selectedCrystals, setSelectedCrystals] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [universeStability, setUniverseStability] = useState(0); // 0 to 100%
  const [isWon, setIsWon] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Animation/Feedback States
  const [reactorState, setReactorState] = useState<ReactorState>("idle");
  const [shakeActive, setShakeActive] = useState(false);

  // Connection Beams Coordinates
  const [connections, setConnections] = useState<Connection[]>([]);
  const connectionsKeyRef = useRef("");

  // Sandbox Mode State
  const [sandboxActive, setSandboxActive] = useState(false);
  const [sandboxResult, setSandboxResult] = useState<string | null>(null);

  const [statusMessage, setStatusMessage] = useState(
    "Vũ trụ đang mất cân bằng. Hãy truyền dẫn năng lượng các tinh cầu!",
  );

  useEffect(() => {
    setUniverseStability(0);
  }, []);

  // Update SVG connections when state or window changes
  useEffect(() => {
    const rafId = { current: 0 } as { current: number | null };
    const debounceTimer = { current: 0 } as { current: number | null };

    const updateCoordinates = () => {
      const workspace = document.getElementById("game-workspace");
      if (!workspace) return;
      const workspaceRect = workspace.getBoundingClientRect();

      const newConnections = selectedCrystals
        .map((crystal, index) => {
          const safeId = crystal.replace(/\s+/g, "-");
          const planetEl = document.getElementById(`planet-${safeId}`);
          const slotEl = document.getElementById(`reactor-slot-${index}`);

          if (planetEl && slotEl) {
            const planetRect = planetEl.getBoundingClientRect();
            const slotRect = slotEl.getBoundingClientRect();

            return {
              x1: planetRect.left - workspaceRect.left + planetRect.width / 2,
              y1: planetRect.top - workspaceRect.top + planetRect.height / 2,
              x2: slotRect.left - workspaceRect.left + slotRect.width / 2,
              y2: slotRect.top - workspaceRect.top + slotRect.height / 2,
              color: PLANET_THEMES[crystal]?.beamColor || "#6366f1",
            };
          }
          return null;
        })
        .filter(Boolean) as Connection[];

      const nextKey = newConnections
        .map((connection) =>
          [
            connection.x1,
            connection.y1,
            connection.x2,
            connection.y2,
            connection.color,
          ].join(","),
        )
        .join("|");

      if (nextKey !== connectionsKeyRef.current) {
        connectionsKeyRef.current = nextKey;
        setConnections(newConnections);
      }
    };

    const scheduleUpdate = () => {
      if (!rafId.current) {
        rafId.current = requestAnimationFrame(() => {
          rafId.current = null;
          updateCoordinates();
        });
      }

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      debounceTimer.current = window.setTimeout(() => {
        if (!rafId.current) updateCoordinates();
      }, 120);
    };

    scheduleUpdate();

    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("scroll", scheduleUpdate);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("scroll", scheduleUpdate);
    };
  }, [selectedCrystals, currentSector, sandboxActive]);

  // Run the Dialectical Reactor core logic
  const triggerReactor = useCallback(
    (crystals: string[]) => {
      setReactorState("synthesizing");
      setAttempts((a) => a + 1);
      setStatusMessage(
        "Lưới biện chứng đang cộng hưởng năng lượng các tinh cầu...",
      );

      const targetSector = SECTORS[currentSector];
      const c1 = targetSector.concept1;
      const c2 = targetSector.concept2;

      const hasC1 = crystals.includes(c1);
      const hasC2 = crystals.includes(c2);

      setTimeout(() => {
        if (hasC1 && hasC2) {
          // Success
          setReactorState("success");
          setStatusMessage(
            "Các tinh cầu đã liên kết hoàn hảo! Trạng thái ổn định thiết lập.",
          );
          const nextStability = Math.min(
            100,
            Math.round(((currentSector + 1) / SECTORS.length) * 100),
          );
          setUniverseStability(nextStability);

          setTimeout(() => {
            setShowExplanation(true);
          }, 1000);
        } else {
          // Error / Disruption
          setReactorState("error");
          setShakeActive(true);
          setStatusMessage(
            "Liên kết đứt gãy! Năng lượng tinh cầu không tương hợp.",
          );

          setTimeout(() => {
            setShakeActive(false);
            setSelectedCrystals([]);
            setReactorState("idle");
            setStatusMessage("Từ trường Lõi Phản Ứng đã reset. Hãy chọn lại!");
          }, 1500);
        }
      }, 1500);
    },
    [currentSector],
  );

  // Handle crystal selection
  const handleCrystalClick = useCallback(
    (crystal: string) => {
      if (reactorState === "synthesizing" || reactorState === "success") return;

      setSelectedCrystals((prev) => {
        if (prev.includes(crystal)) {
          setReactorState("idle");
          return prev.filter((c) => c !== crystal);
        }

        if (prev.length >= 2) return prev;
        const next = [...prev, crystal];
        if (next.length === 2) triggerReactor(next);
        return next;
      });
    },
    [reactorState, triggerReactor],
  );

  // Go to next sector
  const handleNextSector = useCallback(() => {
    setShowExplanation(false);
    setSelectedCrystals([]);
    setReactorState("idle");

    if (currentSector < SECTORS.length - 1) {
      setCurrentSector((s) => s + 1);
      setStatusMessage(
        `Tiến nhập vào Tinh hệ thử thách ${currentSector + 2}/${SECTORS.length}. Hãy đọc tình huống và chọn 2 tinh cầu phù hợp.`,
      );
    } else {
      setIsWon(true);
      setSandboxActive(true);
      setStatusMessage(
        "Vũ trụ đã cân bằng hoàn toàn! Bạn đã tiếp thu Biện Chứng Học!",
      );
    }
  }, [currentSector]);

  // Reset entire campaign game
  const resetGame = useCallback(() => {
    setCurrentSector(0);
    setSelectedCrystals([]);
    setAttempts(0);
    setUniverseStability(0);
    setIsWon(false);
    setShowExplanation(false);
    setReactorState("idle");
    setSandboxActive(false);
    setSandboxResult(null);
    setConnections([]);
    connectionsKeyRef.current = "";
    setStatusMessage(
      "Không gian đã khởi tạo lại. Hãy lập lại trật tự lưới vũ trụ!",
    );
  }, []);

  const enterSandbox = useCallback(() => {
    setShowExplanation(false);
    setSelectedCrystals([]);
    setSandboxResult(null);
    setReactorState("idle");
    setSandboxActive(true);
    setStatusMessage(
      "Lõi Thử Nghiệm Tự Do đã mở. Hãy luyện lại 2 nguyên lý, 3 định luật và 6 cặp phạm trù.",
    );
  }, []);

  const backToCampaign = useCallback(() => {
    setSelectedCrystals([]);
    setSandboxResult(null);
    setReactorState("idle");
    setSandboxActive(false);
    setStatusMessage(
      `Quay lại Tinh hệ thử thách ${currentSector + 1}/${SECTORS.length}. Hãy đọc tình huống và chọn 2 tinh cầu phù hợp.`,
    );
  }, [currentSector]);

  // Sandbox Pairing Logic
  const handleSandboxPair = useCallback((crystal: string) => {
    setSelectedCrystals((prev) => {
      if (prev.includes(crystal)) {
        setSandboxResult(null);
        return prev.filter((c) => c !== crystal);
      }

      if (prev.length >= 2) return prev;
      const next = [...prev, crystal];
      if (next.length === 2) {
        const key1 = `${next[0]} + ${next[1]}`;
        const key2 = `${next[1]} + ${next[0]}`;
        const explanation = SANDBOX_SYNTHESIS[key1] || SANDBOX_SYNTHESIS[key2];

        setReactorState("synthesizing");
        setTimeout(() => {
          if (explanation) {
            setReactorState("success");
            setSandboxResult(explanation);
          } else {
            setReactorState("error");
            setSandboxResult(
              "Hai tinh cầu này không tạo thành cặp phạm trù biện chứng cơ bản trong hệ thống triết học Mác - Lênin. Tuy vậy, chúng vẫn liên kết với nhau qua các quy luật vận động gián tiếp.",
            );
            setTimeout(() => {
              setReactorState("idle");
            }, 1500);
          }
        }, 1200);
      }

      return next;
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070A13] flex items-center justify-center">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-4 border-b-emerald-400 border-t-transparent border-r-transparent border-l-transparent animate-spin duration-1000"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthRequiredModal show={true} />;
  }

  const activeSectorData = SECTORS[currentSector];
  const showEnergyBeams = !sandboxActive && !showExplanation && !isWon;

  return (
    <div
      className="min-h-screen bg-[#050814] text-slate-100 py-8 px-4 font-sans selection:bg-indigo-500/30 overflow-x-hidden relative"
      id="game-workspace"
    >
      {/* Dynamic Laser Connections / SVG Bridges */}
      {showEnergyBeams && <EnergyBeams connections={connections} />}

      {/* Premium Space Dust & Nebulas */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(14,165,233,0.18),transparent_34%),radial-gradient(circle_at_15%_35%,rgba(168,85,247,0.16),transparent_34%),radial-gradient(circle_at_82%_70%,rgba(16,185,129,0.12),transparent_32%)]" />
        <div className="absolute top-10 left-1/4 w-[700px] h-[700px] bg-indigo-500/10 rounded-full blur-[140px] animate-pulse [animation-duration:12000ms]" />
        <div className="absolute bottom-10 right-1/4 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[160px] animate-pulse [animation-duration:14000ms]" />
        <div className="absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.03] animate-spin-slow" />
        <div className="absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-cyan-200/[0.04] animate-[spin_42s_linear_infinite_reverse]" />
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:52px_52px]" />
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,8,20,0.1)_48%,rgba(5,8,20,0.88)_100%)]" />
      </div>

      <div
        className={`${sandboxActive ? "max-w-6xl" : "max-w-5xl"} mx-auto relative z-10`}
      >
        {/* Top Controls */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-md"
        >
          <Link href="/resources">
            <Button
              type="button"
              variant="ghost"
              className="gap-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Tài nguyên học tập
            </Button>
          </Link>

          <div className="text-center md:text-left flex items-center gap-3">
            <Compass className="w-7 h-7 text-indigo-400 animate-spin-slow" />
            <div>
              <h1 className="text-xl font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-indigo-200 to-slate-100">
                VŨ TRỤ BIỆN CHỨNG
              </h1>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
                Lập lại cân bằng 6 cặp phạm trù vũ trụ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={sandboxActive ? backToCampaign : enterSandbox}
              variant="outline"
              className={`gap-2 rounded-full border-slate-700 px-4 py-2 text-xs font-bold transition-all ${
                sandboxActive
                  ? "bg-indigo-500/10 text-indigo-200 hover:bg-indigo-500/20"
                  : "bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20"
              }`}
            >
              {sandboxActive ? (
                <>
                  <Compass className="h-4 w-4" />
                  Cốt truyện
                </>
              ) : (
                <>
                  <BookOpen className="h-4 w-4" />
                  Lõi ôn tập
                </>
              )}
            </Button>
            <div className="text-right">
              <span className="text-xs text-slate-500 block">
                Lượt truyền dẫn:
              </span>
              <span className="font-mono text-lg font-bold text-indigo-400">
                {attempts}
              </span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <Button
              onClick={resetGame}
              variant="ghost"
              size="icon"
              className="text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-full transition-all"
              title="Khởi động lại toàn bộ từ trường vũ trụ"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Stability Gauge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8 bg-slate-950/80 rounded-2xl p-5 border border-slate-900 shadow-inner"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-400 tracking-wider flex items-center gap-1.5 uppercase">
              <ShieldCheck className="w-4 h-4 text-emerald-400 animate-pulse" />
              Độ Ổn Định Lưới Từ Trường Biện Chứng
            </span>
            <span className="font-mono text-sm font-bold text-emerald-400">
              {universeStability}%
            </span>
          </div>
          <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800/50 p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${universeStability}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.3)]"
            />
          </div>
        </motion.div>

        {/* Playable Content */}
        <AnimatePresence mode="wait">
          {!sandboxActive ? (
            /* CAMPAIGN GAME MODE */
            <motion.div
              key="campaign-game"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Left Column: Reactor Core & Scenario */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                {/* Nebula Reactor Core (extracted) */}
                <ReactorCore
                  sector={activeSectorData}
                  sectorIndex={currentSector}
                  totalSectors={SECTORS.length}
                  selectedCrystals={selectedCrystals}
                  reactorState={reactorState}
                  shakeActive={shakeActive}
                />

                {/* Status bar */}
                <div className="px-5 py-3.5 bg-slate-950/90 rounded-2xl border border-slate-900 text-center flex items-center justify-center gap-3">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      reactorState === "success"
                        ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                        : reactorState === "error"
                          ? "bg-rose-500 shadow-[0_0_8px_#f43f5e]"
                          : reactorState === "synthesizing"
                            ? "bg-indigo-400 animate-ping"
                            : "bg-slate-700"
                    }`}
                  />
                  <p className="text-xs md:text-sm font-medium tracking-wide text-slate-300">
                    {statusMessage}
                  </p>
                </div>
              </div>

              {/* Right Column: Cosmic Planets Orbit (Selection Panel) */}
              <div className="lg:col-span-4 flex flex-col justify-between">
                <PlanetGrid
                  selected={selectedCrystals}
                  disabled={
                    reactorState === "synthesizing" ||
                    reactorState === "success"
                  }
                  onSelect={handleCrystalClick}
                />
              </div>
            </motion.div>
          ) : (
            /* UNLOCKED DIALECTICAL SANDBOX MODE */
            <motion.div
              key="sandbox-mode"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative overflow-hidden bg-slate-950/70 rounded-2xl p-5 md:p-6 border border-slate-800 shadow-xl"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-indigo-500 to-rose-500" />

              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-900 pb-5">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-extrabold uppercase rounded-full tracking-wider">
                      Phòng ôn tập trực quan
                    </span>
                    <h2 className="text-2xl font-bold tracking-tight text-white font-serif">
                      Lõi Thử Nghiệm Tự Do
                    </h2>
                  </div>
                  <p className="text-slate-400 text-sm mt-1">
                    Ghép tinh cầu để luyện 6 cặp phạm trù, đồng thời xem lại 2
                    nguyên lý cơ bản và 3 quy luật của phép biện chứng duy vật.
                  </p>
                </div>

                {!isWon && (
                  <Button
                    onClick={backToCampaign}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-5 rounded-full transition-all"
                  >
                    Quay lại cốt truyện
                  </Button>
                )}
              </div>

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 flex flex-col gap-5">
                  <div className="relative overflow-hidden bg-slate-950/80 rounded-2xl p-5 border border-slate-800">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400" />
                    <div className="relative z-10 flex items-center justify-between gap-3">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        Buồng ghép cặp phạm trù
                      </span>
                      <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-200">
                        Chọn 2 tinh cầu
                      </span>
                    </div>

                    <div className="relative z-10 my-5 grid grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
                      <SandboxSlot
                        id="reactor-slot-0"
                        crystal={selectedCrystals[0]}
                        label="Tinh cầu 1"
                      />

                      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-indigo-300/30 bg-indigo-500/10">
                        <Zap className="h-5 w-5 text-indigo-300" />
                      </div>

                      <SandboxSlot
                        id="reactor-slot-1"
                        crystal={selectedCrystals[1]}
                        label="Tinh cầu 2"
                      />
                    </div>

                    <div className="relative z-10 bg-slate-900/45 p-4 rounded-xl border border-slate-800">
                      {sandboxResult ? (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium"
                        >
                          <Info className="w-4 h-4 text-emerald-400 inline-block mr-2 shrink-0 align-text-bottom" />
                          {sandboxResult}
                        </motion.div>
                      ) : (
                        <p className="text-xs text-slate-500 text-center italic">
                          Ghép một cặp đúng để xem ý nghĩa, rồi đối chiếu với
                          bản đồ ôn tập bên dưới.
                        </p>
                      )}
                    </div>
                  </div>
                  {isWon && (
                    <div className="bg-gradient-to-r from-indigo-950/20 via-purple-950/20 to-indigo-950/20 border border-indigo-500/20 rounded-2xl p-5 text-center flex flex-col items-center justify-center shadow-lg">
                      <Award className="w-10 h-10 text-yellow-400 mb-2" />
                      <h4 className="text-yellow-400 font-bold text-sm tracking-wider uppercase mb-1">
                        Danh Hiệu Tối Cao Biện Chứng Học Đã Đạt
                      </h4>
                      <p className="text-slate-400 text-xs max-w-md">
                        Bạn đã mở khóa phòng ôn tập đầy đủ để rèn lại các trục
                        kiến thức.
                      </p>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-4 flex flex-col gap-4">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/55 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-emerald-200">
                        <Sparkles className="h-4 w-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          Kho tinh cầu
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">
                        {selectedCrystals.length}/2
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {ALL_CRYSTALS.map((crystal) => {
                        const isActive = selectedCrystals.includes(crystal);
                        const theme =
                          PLANET_THEMES[crystal] || PLANET_THEMES["Cái riêng"];
                        const safeId = crystal.replace(/\s+/g, "-");

                        return (
                          <div
                            key={crystal}
                            className="flex flex-col items-stretch justify-center"
                          >
                            <button
                              id={`planet-${safeId}`}
                              type="button"
                              title={`${theme.name} - ${theme.tagline}`}
                              aria-label={crystal}
                              onClick={() => handleSandboxPair(crystal)}
                              className={`group relative min-h-[78px] overflow-hidden rounded-xl border px-1.5 py-2 text-center transition-colors duration-200 ${
                                isActive
                                  ? "border-cyan-300/50 bg-cyan-300/10 text-white"
                                  : "border-slate-800 bg-slate-900/55 text-slate-300 hover:border-cyan-300/40 hover:bg-slate-900 hover:text-white"
                              }`}
                            >
                              <span className="relative mx-auto mb-1 flex h-8 w-8 items-center justify-center">
                                {theme.ring && (
                                  <span className="absolute left-1/2 top-1/2 h-[28%] w-[140%] -translate-x-1/2 -translate-y-1/2 rotate-[-22deg] rounded-full border border-white/25" />
                                )}
                                <span
                                  className={`relative h-7 w-7 rounded-full ${theme.gradient} shadow-inner`}
                                >
                                  <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_24%,rgba(255,255,255,0.68),rgba(255,255,255,0.15)_18%,transparent_46%)]" />
                                  <span className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,transparent_45%,rgba(0,0,0,0.28))]" />
                                </span>
                              </span>
                              <span className="relative block text-[10px] font-sans font-bold leading-tight text-balance">
                                {crystal}
                              </span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      setSelectedCrystals([]);
                      setSandboxResult(null);
                    }}
                    variant="outline"
                    className="w-full border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-slate-200 font-semibold py-2.5 rounded-xl transition-all"
                  >
                    Xóa lõi phản ứng
                  </Button>
                </div>

                <div className="lg:col-span-12">
                  <DialecticalLearningMap />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Philosophical Insight Overlay (extracted) */}
        <InsightOverlay
          show={showExplanation}
          sector={activeSectorData}
          onContinue={handleNextSector}
        />

        {/* Global Victory Crown Modal (extracted) */}
        <VictoryModal
          show={isWon}
          onSandbox={() => {
            setIsWon(false);
            enterSandbox();
          }}
          onReset={resetGame}
        />
      </div>

      {/* Embedded specific CSS animation styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,456..700;1,456..700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');

        .font-serif {
          font-family: 'Lora', 'Playfair Display', Georgia, serif !important;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0) scale(1); }
          20% { transform: translateX(-6px) rotate(-1.5deg) scale(0.99); }
          40% { transform: translateX(6px) rotate(1.5deg) scale(1.01); }
          60% { transform: translateX(-4px) rotate(-1deg) scale(0.99); }
          80% { transform: translateX(4px) rotate(1deg) scale(1.01); }
        }

        .animate-spin-slow {
          animation: spin 16s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* GPU-Accelerated natural planet floating keyframes */
        @keyframes float1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-7px) rotate(3deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(8px) rotate(-3.5deg); }
        }
        @keyframes float3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-9px) rotate(-2deg); }
        }
        @keyframes float4 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(7px) rotate(4deg); }
        }

        .animate-float-1 { animation: float1 7s ease-in-out infinite; }
        .animate-float-2 { animation: float2 8.5s ease-in-out infinite; }
        .animate-float-3 { animation: float3 9.5s ease-in-out infinite; }
        .animate-float-4 { animation: float4 6.5s ease-in-out infinite; }

        /* Glowing energy lasers flow keyframe */
        @keyframes dash {
          to {
            stroke-dashoffset: -40;
          }
        }
        .animate-dash {
          stroke-dasharray: 10, 5;
          animation: dash 1.6s linear infinite;
        }
      `,
        }}
      />
    </div>
  );
}

function SandboxSlot({
  id,
  crystal,
  label,
}: {
  id: string;
  crystal?: string;
  label: string;
}) {
  const theme = crystal ? PLANET_THEMES[crystal] : null;

  return (
    <div
      id={id}
      className={`relative flex min-h-[82px] items-center justify-center overflow-hidden rounded-2xl border px-4 transition-colors ${
        crystal
          ? "border-indigo-300/35 bg-indigo-500/10"
          : "border-dashed border-slate-700 bg-slate-900/45"
      }`}
    >
      {crystal && theme ? (
        <div className="flex items-center gap-3">
          <span className="relative flex h-11 w-11 shrink-0 items-center justify-center">
            {theme.ring && (
              <span className="absolute left-1/2 top-1/2 h-[28%] w-[145%] -translate-x-1/2 -translate-y-1/2 rotate-[-22deg] rounded-full border border-white/25" />
            )}
            <span
              className={`relative h-9 w-9 rounded-full ${theme.gradient} shadow-inner`}
            >
              <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_24%,rgba(255,255,255,0.65),transparent_48%)]" />
              <span className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,transparent_45%,rgba(0,0,0,0.28))]" />
            </span>
          </span>
          <div className="min-w-0 text-left">
            <span className="block text-[10px] font-bold uppercase tracking-widest text-indigo-200/70">
              Đã nạp
            </span>
            <span className="block truncate text-sm font-bold text-indigo-100 font-serif">
              {crystal}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-600">
            {label}
          </span>
          <span className="mt-1 block text-[11px] text-slate-500">
            Chọn từ kho tinh cầu
          </span>
        </div>
      )}
    </div>
  );
}

function DialecticalLearningMap() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/85 shadow-2xl">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_18%_0%,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_85%_12%,rgba(244,114,182,0.12),transparent_28%)]" />
      <div className="relative border-b border-slate-800 bg-gradient-to-r from-cyan-500/15 via-indigo-500/10 to-rose-500/15 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-200/80">
              Study board
            </span>
            <h3 className="mt-1 text-2xl font-black tracking-tight text-white">
              Bảng ôn tập
            </h3>
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-300">
              Nhớ theo trục <span className="font-bold text-cyan-200">2</span>{" "}
              nguyên lý nền,
              <span className="font-bold text-amber-200"> 3</span> định luật vận
              động,
              <span className="font-bold text-rose-200"> 6</span> cặp phạm trù
              phân tích.
            </p>
          </div>

          <div className="grid w-full max-w-sm grid-cols-3 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 text-center">
            <div className="p-3">
              <span className="block text-3xl font-black text-cyan-200">2</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Nền
              </span>
            </div>
            <div className="border-x border-white/10 p-3">
              <span className="block text-3xl font-black text-amber-200">
                3
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Vận động
              </span>
            </div>
            <div className="p-3">
              <span className="block text-3xl font-black text-rose-200">6</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Phân tích
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative grid gap-4 p-5">
        <section className="grid gap-4 rounded-2xl border border-cyan-300/25 bg-cyan-300/[0.055] p-4 lg:grid-cols-[150px_1fr]">
          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
            <div className="text-6xl font-black leading-none text-cyan-200">
              2
            </div>
            <h4 className="mt-3 text-sm font-black uppercase tracking-wider text-white">
              Nguyên lý nền
            </h4>
            <p className="mt-1 text-xs text-slate-400">Cách nhìn thế giới</p>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {CORE_PRINCIPLES.map((item) => (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-2xl border border-cyan-300/15 bg-slate-950/60 p-4"
              >
                <span className="absolute inset-y-4 left-0 w-1 rounded-r-full bg-cyan-300/70" />
                <h5 className="text-sm font-bold leading-tight text-white">
                  {item.title}
                </h5>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  {item.memoryCue}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 rounded-2xl border border-amber-300/25 bg-amber-300/[0.055] p-4 lg:grid-cols-[150px_1fr]">
          <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
            <div className="text-6xl font-black leading-none text-amber-200">
              3
            </div>
            <h4 className="mt-3 text-sm font-black uppercase tracking-wider text-white">
              Định luật
            </h4>
            <p className="mt-1 text-xs text-slate-400">Cách sự vật đổi thay</p>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {DIALECTICAL_LAWS.map((item, index) => (
              <div
                key={item.title}
                className="relative overflow-hidden rounded-2xl border border-amber-300/15 bg-slate-950/60 p-4"
              >
                <span className="absolute right-3 top-3 font-mono text-3xl font-black text-amber-200/10">
                  0{index + 1}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-200/75">
                  Định luật
                </span>
                <h5 className="mt-1 text-sm font-bold leading-tight text-white">
                  {item.title}
                </h5>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  {item.memoryCue}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 rounded-2xl border border-rose-300/25 bg-rose-300/[0.055] p-4 lg:grid-cols-[150px_1fr]">
          <div className="rounded-2xl border border-rose-300/20 bg-rose-300/10 p-4">
            <div className="text-6xl font-black leading-none text-rose-200">
              6
            </div>
            <h4 className="mt-3 text-sm font-black uppercase tracking-wider text-white">
              Cặp phạm trù
            </h4>
            <p className="mt-1 text-xs text-slate-400">Công cụ phân tích</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORY_PAIR_GUIDES.map((item) => (
              <div
                key={item.title}
                className="relative overflow-hidden rounded-2xl border border-rose-300/15 bg-slate-950/55 p-4"
              >
                <span
                  className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.color}`}
                />
                <div>
                  <h5 className="text-sm font-bold leading-tight text-white">
                    {item.title}
                  </h5>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">
                    {item.memoryCue}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
