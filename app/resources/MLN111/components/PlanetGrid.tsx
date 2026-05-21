"use client";

import React from "react";
import { Orbit, Sparkles } from "lucide-react";
import { ALL_CRYSTALS, PLANET_THEMES } from "../data";

type Props = {
  selected: string[];
  disabled: boolean;
  onSelect: (crystal: string) => void;
};

const PlanetGrid = ({ selected, disabled, onSelect }: Props) => {
  return (
    <div className="relative overflow-hidden bg-slate-950/55 rounded-3xl p-4 border border-slate-800/80 backdrop-blur-xl h-full flex flex-col shadow-2xl">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_10%,rgba(99,102,241,0.18),transparent_34%),radial-gradient(circle_at_80%_35%,rgba(20,184,166,0.12),transparent_30%)]" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.08] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:28px_28px]" />

      <div className="relative z-10 mb-4">
        <h3 className="text-sm font-bold text-slate-300 tracking-wider flex items-center gap-2 uppercase">
          <Orbit className="w-4 h-4 text-cyan-300 animate-spin-slow" />
          Hệ Tinh Cầu Biện Chứng
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Truyền dẫn năng lượng từ 2 tinh cầu tương sinh để tái lập quỹ đạo.
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-3 gap-2.5 overflow-y-auto flex-grow pr-0.5">
        {ALL_CRYSTALS.map((crystal, index) => {
          const isActive = selected.includes(crystal);
          const theme = PLANET_THEMES[crystal];
          const safeId = crystal.replace(/\s+/g, "-");

          return (
            <div key={crystal} className="flex flex-col items-center">
              <button
                id={`planet-${safeId}`}
                type="button"
                title={`${theme.name} - ${theme.tagline}`}
                disabled={disabled && !isActive}
                onClick={() => onSelect(crystal)}
                className={`group relative min-h-[96px] w-full overflow-hidden rounded-2xl border px-2 py-2 text-center transition-all duration-300 ${
                  isActive
                    ? "border-cyan-200/45 bg-white/[0.09] text-white shadow-[0_0_24px_rgba(125,211,252,0.24)] scale-[1.02]"
                    : disabled
                      ? "border-slate-800 bg-slate-900/25 text-slate-500 cursor-not-allowed opacity-45"
                      : "border-slate-800/80 bg-slate-900/45 text-slate-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-slate-900/80 hover:text-white hover:shadow-[0_0_24px_rgba(34,211,238,0.12)]"
                }`}
              >
                <span
                  className={`absolute inset-x-2 top-2 h-7 rounded-full blur-xl transition-opacity ${
                    isActive ? "opacity-80" : "opacity-0 group-hover:opacity-40"
                  } ${theme.gradient}`}
                />

                <span className="relative mx-auto mb-1.5 flex h-12 w-12 items-center justify-center">
                  <span
                    className={`absolute inset-0 rounded-full blur-md transition-all duration-300 ${
                      isActive ? "opacity-70 scale-125" : "opacity-20 group-hover:opacity-45"
                    } ${theme.gradient}`}
                  />
                  <PlanetOrb
                    active={isActive}
                    gradient={theme.gradient}
                    floatClass={theme.floatClass}
                    ring={theme.ring}
                    surfaceIndex={index}
                  />
                </span>

                <span className={`relative block text-[11px] font-sans font-bold leading-tight ${isActive ? "text-white" : "text-slate-200"}`}>
                  {crystal}
                </span>
                <span className="relative mt-0.5 block truncate text-[8px] font-semibold uppercase leading-tight tracking-wide text-slate-500 group-hover:text-cyan-200/70">
                  {theme.tagline}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(PlanetGrid);

function PlanetOrb({
  active,
  gradient,
  floatClass,
  ring,
  surfaceIndex,
}: {
  active: boolean;
  gradient: string;
  floatClass: string;
  ring: boolean;
  surfaceIndex: number;
}) {
  const bandTilt = surfaceIndex % 2 === 0 ? "-18deg" : "14deg";
  const stormTilt = surfaceIndex % 3 === 0 ? "22deg" : "-28deg";

  return (
    <span className={`relative h-11 w-11 transition-transform duration-300 group-hover:scale-110 ${floatClass}`}>
      {ring && (
        <span className="absolute left-1/2 top-1/2 z-0 h-[30%] w-[166%] -translate-x-1/2 -translate-y-1/2 rotate-[-22deg] rounded-full border border-cyan-100/25 bg-gradient-to-r from-transparent via-white/20 to-transparent shadow-[0_0_12px_rgba(255,255,255,0.14)]" />
      )}

      <span
        className={`absolute inset-0 z-10 overflow-hidden rounded-full ${gradient} shadow-[inset_-10px_-12px_18px_rgba(0,0,0,0.42),inset_7px_7px_12px_rgba(255,255,255,0.16),0_10px_18px_rgba(0,0,0,0.28)]`}
      >
        <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_22%,rgba(255,255,255,0.72),rgba(255,255,255,0.22)_18%,transparent_42%)]" />
        <span className="absolute inset-0 rounded-full opacity-35 mix-blend-screen bg-[conic-gradient(from_120deg,transparent_0deg,rgba(255,255,255,0.2)_34deg,transparent_72deg,rgba(255,255,255,0.12)_138deg,transparent_210deg,rgba(255,255,255,0.18)_286deg,transparent_360deg)]" />
        <span
          className="absolute -left-2 top-[36%] h-1.5 w-16 rounded-full bg-white/18 blur-[1px]"
          style={{ transform: `rotate(${bandTilt})` }}
        />
        <span
          className="absolute -left-1 top-[55%] h-1 w-14 rounded-full bg-black/16 blur-[1px]"
          style={{ transform: `rotate(${stormTilt})` }}
        />
        <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_72%_78%,rgba(0,0,0,0.52),transparent_58%)]" />
        <span className="absolute inset-px rounded-full ring-1 ring-white/20" />
      </span>

      {ring && (
        <span className="absolute left-1/2 top-1/2 z-20 h-[30%] w-[166%] -translate-x-1/2 -translate-y-1/2 rotate-[-22deg] rounded-full border-b border-cyan-100/45 [clip-path:inset(50%_0_0_0)]" />
      )}

      {active && (
        <span className="absolute -right-1 -top-1 z-30 flex h-4 w-4 items-center justify-center rounded-full bg-white text-cyan-600 shadow-lg">
          <Sparkles className="h-2.5 w-2.5" />
        </span>
      )}
    </span>
  );
}
