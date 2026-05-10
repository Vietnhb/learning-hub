"use client";

import React from "react";
import { USERNAME_STYLES, type UsernameStyleId } from "@/lib/designSystem";

interface UsernameTextProps {
  username: string;
  styleId?: UsernameStyleId;
  customTitle?: string;
  className?: string;
  showTitle?: boolean;
}

export const UsernameText: React.FC<UsernameTextProps> = ({
  username,
  styleId,
  customTitle,
  className = "",
  showTitle = false,
}) => {
  const style = styleId ? USERNAME_STYLES[styleId] : null;

  if (!style) {
    return (
      <div className={`font-semibold text-gray-100 ${className}`}>
        {username}
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div
        className={`inline-flex w-fit items-center rounded-full px-3 py-1 ${style.nameplateClass ?? ""}`}
      >
        <span
          className={`font-bold text-lg ${style.nameClass} ${style.glowClass} ${style.shimmerClass ?? ""} ${style.hoverEffect} transition-all duration-300 cursor-default`}
        >
          {username}
        </span>
      </div>
      {showTitle && customTitle && (
        <span className="text-xs text-gray-400 font-medium">{customTitle}</span>
      )}
    </div>
  );
};

// Animated glowing text variant
interface GlowingUsernameProps {
  username: string;
  glowColor?: "red" | "cyan" | "gold" | "purple" | "green";
  intensity?: "subtle" | "medium" | "intense";
  className?: string;
}

const glowColorMap = {
  red: "drop-shadow-[0_0_8px_rgba(239,68,68,0.5)] hover:drop-shadow-[0_0_16px_rgba(239,68,68,0.8)]",
  cyan: "drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] hover:drop-shadow-[0_0_16px_rgba(34,211,238,0.8)]",
  gold: "drop-shadow-[0_0_8px_rgba(251,146,60,0.5)] hover:drop-shadow-[0_0_16px_rgba(251,146,60,0.8)]",
  purple:
    "drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] hover:drop-shadow-[0_0_16px_rgba(168,85,247,0.8)]",
  green:
    "drop-shadow-[0_0_8px_rgba(16,185,129,0.5)] hover:drop-shadow-[0_0_16px_rgba(16,185,129,0.8)]",
};

const intensityMap = {
  subtle: "opacity-70",
  medium: "opacity-85",
  intense: "opacity-100",
};

export const GlowingUsername: React.FC<GlowingUsernameProps> = ({
  username,
  glowColor = "cyan",
  intensity = "medium",
  className = "",
}) => {
  return (
    <span
      className={`font-bold text-lg bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent ${glowColorMap[glowColor]} ${intensityMap[intensity]} transition-all duration-300 ${className}`}
    >
      {username}
    </span>
  );
};

// Username with animated shimmer effect
interface ShimmeringUsernameProps {
  username: string;
  className?: string;
  duration?: number;
}

export const ShimmeringUsername: React.FC<ShimmeringUsernameProps> = ({
  username,
  className = "",
  duration = 3,
}) => {
  return (
    <span
      className={`font-bold text-lg spark-username-gradient-legendary spark-username-glow-legendary spark-username-shimmer ${className}`}
      data-shimmer-duration={duration}
    >
      {username}
    </span>
  );
};

interface HolographicNameplateProps {
  username: string;
  styleId?: UsernameStyleId;
  subtitle?: string;
  className?: string;
}

export const HolographicNameplate: React.FC<HolographicNameplateProps> = ({
  username,
  styleId = "verified",
  subtitle,
  className = "",
}) => {
  return (
    <div className={`spark-holo-plate ${className}`}>
      <UsernameText username={username} styleId={styleId} />
      {subtitle ? (
        <p className="mt-1 text-xs text-slate-300/80">{subtitle}</p>
      ) : null}
    </div>
  );
};
