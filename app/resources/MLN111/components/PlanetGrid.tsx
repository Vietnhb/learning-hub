"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { ALL_CRYSTALS, PLANET_THEMES } from "../data";

type Props = {
  selected: string[];
  disabled: boolean;
  onSelect: (crystal: string) => void;
};

const PlanetGrid = ({ selected, disabled, onSelect }: Props) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/55 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-emerald-200">
          <Sparkles className="h-4 w-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Kho tinh cầu
          </span>
        </div>
        <span className="text-[10px] font-bold text-slate-500">
          {selected.length}/2
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {ALL_CRYSTALS.map((crystal) => {
          const isActive = selected.includes(crystal);
          const theme = PLANET_THEMES[crystal] || PLANET_THEMES["Cái riêng"];
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
                onClick={() => !disabled && onSelect(crystal)}
                disabled={disabled}
                className={`group relative min-h-[78px] overflow-hidden rounded-xl border px-1.5 py-2 text-center transition-all duration-200 ${
                  disabled
                    ? "cursor-not-allowed opacity-50"
                    : isActive
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
  );
};

export default React.memo(PlanetGrid);
