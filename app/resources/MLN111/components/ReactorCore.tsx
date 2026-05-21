"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap, CheckCircle2, Flame } from "lucide-react";
import { PLANET_THEMES } from "../data";
import type { Sector, ReactorState } from "../data";

type Props = {
  sector: Sector;
  sectorIndex: number;
  totalSectors: number;
  selectedCrystals: string[];
  reactorState: ReactorState;
  shakeActive: boolean;
};

const ReactorCore = ({
  sector,
  sectorIndex,
  totalSectors,
  selectedCrystals,
  reactorState,
  shakeActive,
}: Props) => {
  const borderClass =
    reactorState === "success"
      ? "border-emerald-500/40"
      : reactorState === "error"
        ? "border-rose-500/40"
        : "border-slate-800/80";

  const auraClass =
    reactorState === "success"
      ? "scale-150 opacity-100"
      : reactorState === "error"
        ? "scale-150 opacity-100"
        : "scale-100 opacity-60";

  const auraColor =
    reactorState === "success"
      ? "bg-emerald-500/15"
      : reactorState === "error"
        ? "bg-rose-500/20"
        : `bg-gradient-to-r ${sector.nebulaGlow}`;

  return (
    <div
      className={`relative min-h-[430px] overflow-hidden bg-slate-950/75 rounded-3xl p-6 border transition-all duration-500 flex flex-col justify-between shadow-2xl backdrop-blur-xl ${borderClass} ${
        shakeActive ? "animate-[shake_0.45s_ease-in-out_infinite]" : ""
      }`}
    >
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.16)_1px,transparent_1.5px)] bg-[size:32px_32px]" />
      <div className="absolute -left-24 top-12 h-64 w-64 rounded-full border border-indigo-400/10" />
      <div className="absolute -right-16 bottom-12 h-72 w-72 rounded-full border border-cyan-300/10" />

      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-[110px] transition-all duration-1000 pointer-events-none ${auraColor} ${auraClass}`}
      />
      <div className="absolute left-1/2 top-[58%] h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 animate-spin-slow pointer-events-none" />
      <div className="absolute left-1/2 top-[58%] h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-indigo-300/10 animate-[spin_28s_linear_infinite_reverse] pointer-events-none" />

      <div className="flex justify-between items-start z-10">
        <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-full text-xs font-semibold tracking-wider">
          Tinh Hệ: {sectorIndex + 1}&nbsp;/&nbsp;{totalSectors}
        </span>
        <span
          className={`px-3 py-1 bg-gradient-to-r ${sector.color} text-white text-xs font-bold rounded-full tracking-wider shadow-lg`}
        >
          {sector.badge}
        </span>
      </div>

      <div className="my-6 text-center px-2 md:px-8 z-10">
        <p className="text-slate-500 text-xs tracking-widest uppercase mb-2.5 font-bold flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          Hồ sơ hiện tượng không gian
        </p>
        <blockquote className="relative rounded-2xl border border-slate-800/80 bg-slate-950/45 px-4 py-5 text-base md:text-lg text-slate-200 leading-relaxed font-serif italic font-medium shadow-inner">
          <span className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${sector.color} opacity-70`} />
          &ldquo;{sector.scenario}&rdquo;
        </blockquote>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 items-center z-10 pt-5 border-t border-slate-900/60">
        <Slot
          id="reactor-slot-0"
          crystal={selectedCrystals[0]}
          label="Quỹ Đạo Tây"
        />

        <PowerCore reactorState={reactorState} />

        <Slot
          id="reactor-slot-1"
          crystal={selectedCrystals[1]}
          label="Quỹ Đạo Đông"
        />
      </div>
    </div>
  );
};

export default React.memo(ReactorCore);

function Slot({
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
      className="relative h-16 w-full max-w-[210px] sm:w-40 rounded-2xl flex items-center justify-center overflow-hidden border border-dashed border-slate-700 bg-slate-900/40 backdrop-blur transition-all shadow-inner"
    >
      {crystal ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute inset-0.5 bg-indigo-600/20 border border-indigo-400/30 rounded-[14px] flex items-center justify-center text-xs font-bold text-indigo-100 gap-2 shadow-lg"
        >
          {theme && (
            <span className="relative h-9 w-9 shrink-0">
              <span className={`absolute inset-0 rounded-full blur-md opacity-60 ${theme.gradient}`} />
              {theme.ring && (
                <span className="absolute left-1/2 top-1/2 h-[28%] w-[145%] -translate-x-1/2 -translate-y-1/2 rotate-[-22deg] rounded-full border border-white/25" />
              )}
              <span className={`absolute inset-1 rounded-full ${theme.gradient}`}>
                <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_24%,rgba(255,255,255,0.65),transparent_48%)]" />
              </span>
            </span>
          )}
          <span className="leading-tight">{crystal}</span>
        </motion.div>
      ) : (
        <>
          <span className="absolute inset-3 rounded-xl border border-slate-700/50" />
          <span className="text-slate-600 text-[10px] uppercase font-bold tracking-wider animate-pulse">
            {label}
          </span>
        </>
      )}
    </div>
  );
}

function PowerCore({ reactorState }: { reactorState: ReactorState }) {
  const cls =
    reactorState === "success"
      ? "bg-emerald-500/20 border-emerald-400 text-emerald-400 shadow-[0_0_20px_#10b981]"
      : reactorState === "error"
        ? "bg-rose-500/20 border-rose-400 text-rose-400 animate-bounce shadow-[0_0_20px_#f43f5e]"
        : reactorState === "synthesizing"
          ? "bg-indigo-500/20 border-indigo-400 text-indigo-400 animate-spin shadow-[0_0_26px_#6366f1]"
          : "bg-slate-900 border-slate-700 text-slate-500";

  return (
    <div
      className={`relative w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all ${cls}`}
    >
      <span className="absolute inset-[-10px] rounded-full border border-white/10" />
      <span className="absolute inset-[-18px] rounded-full border border-dashed border-white/10 animate-spin-slow" />
      {reactorState === "success" ? (
        <CheckCircle2 className="w-5 h-5" />
      ) : reactorState === "error" ? (
        <Flame className="w-5 h-5" />
      ) : (
        <Zap className="w-5 h-5" />
      )}
    </div>
  );
}
