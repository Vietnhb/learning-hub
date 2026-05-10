"use client";

import React from "react";
import { ROLE_BADGES, type RoleBadgeId } from "@/lib/designSystem";

interface RoleBadgeProps {
  roleId: RoleBadgeId;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  showIcon?: boolean;
}

const sizeClasses = {
  sm: "px-2 py-1 text-xs gap-1",
  md: "px-3 py-1.5 text-sm gap-1.5",
  lg: "px-4 py-2 text-base gap-2",
};

const iconSizes = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export const RoleBadge: React.FC<RoleBadgeProps> = ({
  roleId,
  size = "md",
  animated = true,
  showIcon = true,
}) => {
  const badge = ROLE_BADGES[roleId];
  const sizeClass = sizeClasses[size];
  const iconSize = iconSizes[size];

  return (
    <div
      className={`relative inline-flex items-center rounded-full border ${badge.borderColor} bg-gradient-to-r ${badge.bgGradient} ${badge.textColor} font-semibold ${sizeClass} ${
        animated
          ? "hover:shadow-lg hover:drop-shadow-[0_0_8px_rgba(0,0,0,0.3)]"
          : ""
      } transition-all duration-300 overflow-hidden group`}
    >
      {/* Glassmorphism shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />

      {/* Content */}
      <span className="relative flex items-center gap-1">
        {showIcon && <span className={iconSize}>{badge.icon}</span>}
        <span className="font-medium">{badge.label}</span>
      </span>

      {/* Animated glow on hover */}
      {animated && (
        <div className="absolute inset-0 rounded-full border border-current opacity-0 group-hover:opacity-50 animate-pulse" />
      )}
    </div>
  );
};

// Component to display multiple role badges
interface RoleBadgesProps {
  roleIds: RoleBadgeId[];
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  maxDisplay?: number;
}

export const RoleBadges: React.FC<RoleBadgesProps> = ({
  roleIds,
  size = "md",
  animated = true,
  maxDisplay = 3,
}) => {
  const displayRoles = roleIds.slice(0, maxDisplay);
  const remainingCount = Math.max(0, roleIds.length - maxDisplay);

  return (
    <div className="flex flex-wrap gap-2">
      {displayRoles.map((roleId) => (
        <RoleBadge
          key={roleId}
          roleId={roleId}
          size={size}
          animated={animated}
        />
      ))}
      {remainingCount > 0 && (
        <div
          className={`inline-flex items-center rounded-full border border-gray-600 bg-gradient-to-r from-gray-700 to-gray-800 text-gray-200 font-semibold ${sizeClasses[size]} opacity-75`}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};
