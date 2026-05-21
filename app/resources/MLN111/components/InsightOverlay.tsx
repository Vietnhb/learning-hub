"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Sector } from "../data";

type Props = {
  show: boolean;
  sector: Sector;
  onContinue: () => void;
};

export default function InsightOverlay({ show, sector, onContinue }: Props) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#04060b]/90 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 30 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="bg-slate-950/90 border border-indigo-500/30 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-[0_0_50px_-5px_rgba(99,102,241,0.35)] relative overflow-hidden"
          >
            {/* Top colour stripe */}
            <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${sector.color}`} />

            {/* Title row */}
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">
                  Tinh Hệ Đã Ổn Định
                </span>
                <h3 className="text-xl font-bold font-serif text-white leading-tight">
                  {sector.title}
                </h3>
              </div>
            </div>

            {/* Pair + quote */}
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 mb-5">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                Các Tinh Cầu Hợp Nhất Biện Chứng:
              </span>
              <p className="text-slate-100 font-serif text-base font-bold mb-3">
                {sector.concept1} &amp; {sector.concept2}
              </p>
              <blockquote className="text-sm font-medium leading-relaxed italic text-indigo-300 pl-4 border-l-2 border-indigo-500/40">
                {sector.quote}
              </blockquote>
            </div>

            {/* Explanation */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Phương Pháp Luận Triết Học
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                {sector.explanation}
              </p>
            </div>

            <Button
              onClick={onContinue}
              className="mt-8 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-950/40 text-sm gap-2"
            >
              Tiếp tục hành trình
              <Sparkles className="w-4 h-4" />
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
