"use client";

import React from "react";
import { AVATAR_FRAMES, type AvatarFrameId } from "@/lib/designSystem";
import { cn } from "@/lib/utils";

interface AvatarFrameProps {
  frameId?: AvatarFrameId;
  children?: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  animated?: boolean;
}

const sizeClasses = {
  xs: "h-6 w-6",
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-20 w-20",
  xl: "h-32 w-32",
};

export const AvatarFrame: React.FC<AvatarFrameProps> = ({
  frameId,
  children,
  size = "md",
  animated = true,
}) => {
  const sizeClass = sizeClasses[size];

  // If no frame selected, return simple avatar
  if (!frameId) {
    return (
      <div
        className={`${sizeClass} rounded-full overflow-hidden flex-shrink-0`}
      >
        {children}
      </div>
    );
  }

  const frame = AVATAR_FRAMES[frameId];

  // If frame not found, return simple avatar
  if (!frame) {
    return (
      <div
        className={`${sizeClass} rounded-full overflow-hidden flex-shrink-0`}
      >
        {children}
      </div>
    );
  }

  const isLegendary = frame.rarity === "legendary";

  const insetMap = {
    xs: "-inset-[1px]",
    sm: "-inset-[1px]",
    md: "-inset-[2px]",
    lg: "-inset-[3.5px]",
    xl: "-inset-[5px]",
  };

  return (
    <div className="relative inline-block spark-frame-root">
      {/* Aura layer */}
      <div
        className={cn(
          "absolute rounded-full",
          insetMap[size],
          frame.glowClass,
          animated ? "spark-frame-pulse" : ""
        )}
      />

      {/* Cinematic bloom ring */}
      {animated && (
        <div 
          className={cn(
            "pointer-events-none absolute rounded-full spark-frame-bloom opacity-50",
            size === "xs" ? "-inset-[2px]" : size === "sm" ? "-inset-[3px]" : "-inset-[7px]"
          )} 
        />
      )}

      {/* Edge shimmer sweep */}
      <div
        className={cn(
          "pointer-events-none absolute rounded-full",
          insetMap[size],
          frame.shimmerClass ?? "spark-shimmer-cyan",
          animated ? "spark-frame-sweep" : ""
        )}
      />

      {/* Counter sweep for richer motion */}
      {animated && (
        <div
          className={cn(
            "pointer-events-none absolute rounded-full opacity-60",
            insetMap[size],
            frame.shimmerClass ?? "spark-shimmer-cyan",
            "spark-frame-sweep-reverse"
          )}
        />
      )}

      {/* Outer rotating light ring */}
      {animated && (
        <div 
          className={cn(
            "pointer-events-none absolute rounded-full spark-frame-orbit-ring opacity-40",
            size === "xs" ? "-inset-[1.5px]" : size === "sm" ? "-inset-[2px]" : "-inset-[5px]"
          )} 
        />
      )}

      {/* Floating particles */}
      {animated && (
        <>
          <span
            className={cn(
              "pointer-events-none absolute -top-1 left-1/4 h-1.5 w-1.5 rounded-full spark-frame-particle-a",
              frame.particleClass ?? "spark-particles-cyan"
            )}
          />
          <span
            className={cn(
              "pointer-events-none absolute bottom-0 right-2 h-1 w-1 rounded-full spark-frame-particle-b",
              frame.particleClass ?? "spark-particles-cyan"
            )}
          />
        </>
      )}

      {/* LEGENDARY DRAGON SOUL EFFECTS */}
      {isLegendary && animated && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Main Dragon Soul Aura */}
          <div className={cn("absolute rounded-full spark-dragon-aura", size === "xs" ? "-inset-[5px]" : size === "sm" ? "-inset-[8px]" : "-inset-[15px]")} />
          
          {/* Dragon Tail Particles (3 rotating spirits) */}
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="absolute w-2 h-2 rounded-full spark-dragon-particle" style={{ animation: 'dragon-tail-rotate 2.5s linear infinite' }} />
             <div className="absolute w-1.5 h-1.5 rounded-full spark-dragon-particle opacity-70" style={{ animation: 'dragon-tail-rotate 3s linear infinite 0.5s' }} />
             <div className="absolute w-1 h-1 rounded-full spark-dragon-particle opacity-50" style={{ animation: 'dragon-tail-rotate 3.5s linear infinite 1s' }} />
          </div>

          {/* Crown Icon (Replaced Dragon) */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 text-lg drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">
            👑
          </div>
        </div>
      )}

      {/* Border container */}
      <div
        className={cn(
          "relative rounded-full p-[2px] flex items-center justify-center overflow-hidden flex-shrink-0",
          sizeClass,
          frame.borderClass
        )}
      >
        <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-white/45 via-white/10 to-transparent opacity-70" />

        {/* Inner avatar container */}
        <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
};

// Export preset avatars for showcase
export const AVATAR_PRESETS = {
  adminDefault: (
    <div className="w-full h-full bg-gradient-to-br from-red-600 via-red-700 to-red-800 flex items-center justify-center text-2xl font-bold text-white">
      A
    </div>
  ),
  moderatorDefault: (
    <div className="w-full h-full bg-gradient-to-br from-orange-600 via-orange-700 to-orange-800 flex items-center justify-center text-2xl font-bold text-white">
      M
    </div>
  ),
  premiumDefault: (
    <div className="w-full h-full bg-gradient-to-br from-yellow-500 via-yellow-600 to-amber-700 flex items-center justify-center text-2xl font-bold text-white">
      P
    </div>
  ),
  verifiedDefault: (
    <div className="w-full h-full bg-gradient-to-br from-cyan-600 via-blue-600 to-blue-700 flex items-center justify-center text-2xl font-bold text-white">
      V
    </div>
  ),
  developerDefault: (
    <div className="w-full h-full bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 flex items-center justify-center text-2xl font-bold text-white">
      D
    </div>
  ),
};
