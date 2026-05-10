"use client";

import React from "react";
import { AVATAR_FRAMES, type AvatarFrameId } from "@/lib/designSystem";
import { cn } from "@/lib/utils";

interface AvatarFrameProps {
  frameId?: AvatarFrameId;
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
}

const sizeClasses = {
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
            size === "sm" ? "-inset-[3px]" : "-inset-[7px]"
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
            size === "sm" ? "-inset-[2px]" : "-inset-[5px]"
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
