"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Award, CheckCircle2, Play, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SECTORS } from "../data";

type Props = {
  show: boolean;
  onSandbox: () => void;
  onReset: () => void;
};

export default function VictoryModal({ show, onSandbox, onReset }: Props) {
  const completedPairs = Array.from(
    new Map(
      SECTORS.map((sector) => [
        `${sector.concept1}-${sector.concept2}`,
        {
          concept1: sector.concept1,
          concept2: sector.concept2,
          color: sector.color,
        },
      ]),
    ).values(),
  );

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#04060b]/95 backdrop-blur-lg flex items-center justify-center p-4 z-50 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.85, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
            className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-cyan-300/20 bg-[#070b18]/95 p-5 text-center shadow-[0_0_70px_-18px_rgba(34,211,238,0.45)] md:p-8"
          >
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.18),transparent_32%),radial-gradient(circle_at_15%_35%,rgba(99,102,241,0.16),transparent_34%),radial-gradient(circle_at_85%_72%,rgba(16,185,129,0.14),transparent_32%)]" />
            <div className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:34px_34px]" />
            <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-cyan-400 via-amber-300 to-emerald-400" />

            <div className="relative z-10 mx-auto mb-6 flex max-w-2xl flex-col items-center">
              <motion.div className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-amber-300/35 bg-amber-300/10">
                <span className="absolute inset-[-12px] rounded-full border border-amber-200/10" />
                <span className="absolute inset-[-22px] rounded-full border border-dashed border-cyan-200/10" />
                <Award className="h-10 w-10 text-amber-300" />
              </motion.div>

              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-200">
                <Sparkles className="h-3.5 w-3.5" />
                Hoàn tất hệ tri thức MLN111
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl font-serif">
                Vũ trụ đã cân bằng
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300 md:text-base">
                Bạn đã truyền dẫn thành công 6 cặp phạm trù cốt lõi, tái lập trật tự cho hệ biện
                chứng và mở khóa lõi thử nghiệm tự do.
              </p>
            </div>

            <div className="relative z-10 mb-7 grid grid-cols-2 gap-2.5 text-left md:grid-cols-3">
              {completedPairs.map((pair, index) => (
                <div
                  key={`${pair.concept1}-${pair.concept2}`}
                  className="group relative overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-950/45 p-3 transition-all hover:-translate-y-0.5 hover:border-cyan-300/35 hover:bg-slate-900/70"
                >
                  <span className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${pair.color}`} />
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-bold text-cyan-200/80">
                      0{index + 1}
                    </span>
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  </div>
                  <h5 className="text-xs font-bold leading-tight text-white font-serif">
                    {pair.concept1} &amp; {pair.concept2}
                  </h5>
                </div>
              ))}
            </div>

            <div className="relative z-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                onClick={onSandbox}
                className="gap-2 rounded-full bg-emerald-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-950/40 transition-all hover:bg-emerald-400"
              >
                Vào Lõi Thử Nghiệm Tự Do
                <Play className="w-4 h-4" />
              </Button>

              <Button
                onClick={onReset}
                variant="outline"
                className="gap-2 rounded-full border-slate-700 bg-slate-950/60 px-8 py-3.5 text-sm font-bold text-slate-300 transition-all hover:bg-slate-900 hover:text-white"
              >
                <RotateCcw className="h-4 w-4" />
                Thử Thách Lại
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}