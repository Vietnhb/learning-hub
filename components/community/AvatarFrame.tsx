"use client";

import React from "react";
import { AVATAR_FRAMES, type AvatarFrameId } from "@/lib/designSystem";

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

  return (
    <div className="relative inline-block spark-frame-root">
      {/* Aura layer */}
      <div
        className={`absolute -inset-1 rounded-full ${frame.glowClass} ${animated ? "spark-frame-pulse" : ""}`}
      />

      {/* Cinematic bloom ring */}
      {animated ? (
        <div className="pointer-events-none absolute -inset-[7px] rounded-full spark-frame-bloom" />
      ) : null}

      {/* Edge shimmer sweep */}
      <div
        className={`pointer-events-none absolute -inset-[3px] rounded-full ${frame.shimmerClass ?? "spark-shimmer-cyan"} ${animated ? "spark-frame-sweep" : ""}`}
      />

      {/* Counter sweep for richer motion */}
      {animated ? (
        <div
          className={`pointer-events-none absolute -inset-[2px] rounded-full ${frame.shimmerClass ?? "spark-shimmer-cyan"} spark-frame-sweep-reverse opacity-70`}
        />
      ) : null}

      {/* Outer rotating light ring */}
      {animated ? (
        <div className="pointer-events-none absolute -inset-[5px] rounded-full spark-frame-orbit-ring" />
      ) : null}

      {/* Floating particles */}
      {animated ? (
        <>
          <span
            className={`pointer-events-none absolute -top-1 left-1/4 h-1.5 w-1.5 rounded-full ${frame.particleClass ?? "spark-particles-cyan"} spark-frame-particle-a`}
          />
          <span
            className={`pointer-events-none absolute bottom-0 right-2 h-1 w-1 rounded-full ${frame.particleClass ?? "spark-particles-cyan"} spark-frame-particle-b`}
          />
          <span
            className={`pointer-events-none absolute top-1/3 -right-1 h-1.5 w-1.5 rounded-full ${frame.particleClass ?? "spark-particles-cyan"} spark-frame-particle-c`}
          />
          <span
            className={`pointer-events-none absolute top-1 left-1 h-1 w-1 rounded-full ${frame.particleClass ?? "spark-particles-cyan"} spark-frame-particle-d`}
          />
          <span
            className={`pointer-events-none absolute bottom-1 left-1/3 h-1 w-1 rounded-full ${frame.particleClass ?? "spark-particles-cyan"} spark-frame-particle-e`}
          />
        </>
      ) : null}

      {/* Border container */}
      <div
        className={`relative ${sizeClass} rounded-full p-[2px] flex items-center justify-center overflow-hidden flex-shrink-0 ${
          frame.borderClass
        }`}
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
