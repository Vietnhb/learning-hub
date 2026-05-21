"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Info, Award, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ALL_CRYSTALS, PLANET_THEMES, SANDBOX_SYNTHESIS, SECTORS } from "../data";

type Props = {
  isWon: boolean;
  onBackToCampaign: () => void;
};

export default function SandboxMode({ isWon, onBackToCampaign }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<{ text: string; success: boolean } | null>(null);
  const [syncing, setSyncing] = useState(false);

  const handlePlanet = (crystal: string) => {
    if (syncing) return;

    if (selected.includes(crystal)) {
      setSelected((p) => p.filter((c) => c !== crystal));
      setResult(null);
      return;
    }

    if (selected.length >= 2) return;

    const next = [...selected, crystal];
    setSelected(next);

    if (next.length === 2) {
      setSyncing(true);
      setTimeout(() => {
        const key1 = `${next[0]} + ${next[1]}`;
        const key2 = `${next[1]} + ${next[0]}`;
        const explanation = SANDBOX_SYNTHESIS[key1] || SANDBOX_SYNTHESIS[key2];
        setResult(
          explanation
            ? { text: explanation, success: true }
            : {
                text: "Hai tinh cầu này không tạo thành cặp phạm trù biện chứng cơ bản trong hệ thống triết học Mác – Lênin. Tuy vậy, chúng vẫn liên kết với nhau qua các quy luật vận động gián tiếp.",
                success: false,
              }
        );
        setSyncing(false);
      }, 900);
    }
  };

  const clearSlots = () => {
    setSelected([]);
    setResult(null);
  };

  return (
    <div className="bg-slate-950/40 rounded-3xl p-6 md:p-8 border border-slate-800/80 backdrop-blur-xl">
      {/* Top stripe */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-indigo-500 to-rose-500 rounded-t-3xl" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-slate-900 pb-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-extrabold uppercase rounded-full tracking-wider">
              Chế Độ Mở Rộng
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white font-serif">
              Lõi Thử Nghiệm Tự Do
            </h2>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Hợp nhất tùy ý năng lượng từ các tinh cầu để giải mã các liên kết biện chứng ẩn sâu.
          </p>
        </div>
        {!isWon && (
          <Button
            onClick={onBackToCampaign}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-5 rounded-full transition-all shrink-0"
          >
            Quay lại cốt truyện
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Reactor + result */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Slot display */}
          <div className="bg-slate-950/80 rounded-2xl p-6 border border-slate-900 flex flex-col gap-6">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              Buồng Thử Nghiệm Tự Do
            </span>

            <div className="flex justify-center items-center gap-8">
              <SandboxSlot id="reactor-slot-0" crystal={selected[0]} />
              <div className="w-9 h-9 rounded-full border border-slate-700 bg-slate-950 flex items-center justify-center">
                <Zap className={`w-4 h-4 ${syncing ? "text-indigo-400 animate-pulse" : "text-slate-600"}`} />
              </div>
              <SandboxSlot id="reactor-slot-1" crystal={selected[1]} />
            </div>

            {/* Result panel */}
            <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 min-h-[60px] flex items-center">
              {result ? (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-sm leading-relaxed font-medium flex items-start gap-2 ${result.success ? "text-slate-300" : "text-slate-400"}`}
                >
                  <Info className={`w-4 h-4 mt-0.5 shrink-0 ${result.success ? "text-emerald-400" : "text-rose-400"}`} />
                  {result.text}
                </motion.p>
              ) : (
                <p className="text-xs text-slate-600 italic mx-auto text-center w-full">
                  Chọn 2 tinh cầu để xem kết quả hợp nhất biện chứng.
                </p>
              )}
            </div>
          </div>

          {/* Won badge */}
          {isWon && (
            <div className="bg-gradient-to-r from-indigo-950/30 via-purple-950/30 to-indigo-950/30 border border-indigo-500/20 rounded-2xl p-5 text-center flex flex-col items-center gap-2">
              <Award className="w-10 h-10 text-yellow-400 animate-bounce" />
              <h4 className="text-yellow-400 font-bold text-sm tracking-wider uppercase">
                Danh Hiệu Tối Cao Biện Chứng Học
              </h4>
              <p className="text-slate-400 text-xs max-w-md">
                Bạn đã xuất sắc lập lại sự ổn định cho cả 6 tinh vân. Trí tuệ biện chứng của bạn đã đạt đến cảnh giới tối cao!
              </p>
            </div>
          )}
        </div>

        {/* Right: Planet picker */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3">
            {ALL_CRYSTALS.map((crystal) => {
              const isActive = selected.includes(crystal);
              const theme = PLANET_THEMES[crystal];
              const safeId = crystal.replace(/\s+/g, "-");

              return (
                <button
                  key={crystal}
                  id={`planet-${safeId}`}
                  type="button"
                  onClick={() => handlePlanet(crystal)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${
                    isActive
                      ? "border-white/30 bg-white/5"
                      : "border-transparent hover:border-slate-700 hover:bg-slate-900/40"
                  }`}
                >
                  <div className={`relative rounded-full w-12 h-12 ${isActive ? "ring-4 ring-white/60 shadow-[0_0_18px_rgba(255,255,255,0.4)] scale-110" : "opacity-75 hover:opacity-100"} transition-all`}>
                    <div className={`absolute inset-0 rounded-full ${theme.gradient}`} />
                    <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_28%,rgba(255,255,255,0.4),transparent_52%)]" />
                    {theme.ring && (
                      <div className="absolute w-[145%] h-[28%] border border-white/20 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-22deg]" />
                    )}
                  </div>
                  <span className="text-[9px] font-serif font-bold text-slate-400 text-center leading-tight block">
                    {crystal}
                  </span>
                </button>
              );
            })}
          </div>

          <Button
            onClick={clearSlots}
            variant="outline"
            className="border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-slate-200 font-semibold py-2.5 rounded-xl transition-all"
          >
            Xóa Lõi Phản Ứng
          </Button>

          {/* Quick reference */}
          <div className="bg-slate-950/60 rounded-xl border border-slate-900 p-4">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-3">6 Cặp Chính Thức</p>
            <div className="space-y-1.5">
              {SECTORS.map((s) => (
                <div key={s.id} className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${s.color} shrink-0`} />
                  <span className="text-[10px] text-slate-400 font-serif">
                    {s.concept1} &amp; {s.concept2}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SandboxSlot({ id, crystal }: { id: string; crystal?: string }) {
  return (
    <div
      id={id}
      className="w-32 h-14 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-center text-xs font-bold shadow-inner"
    >
      {crystal ? (
        <span className="text-indigo-300 font-serif text-sm font-bold">{crystal}</span>
      ) : (
        <span className="text-slate-700 font-mono tracking-widest text-[10px]">LÕI TRỐNG</span>
      )}
    </div>
  );
}
