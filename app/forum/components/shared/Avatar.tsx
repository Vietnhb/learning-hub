"use client";

import React from "react";
import { UserAvatar } from "@/components/UserAvatar";
import { getInitials } from "../../utils/formatters";

export function Avatar({
  name,
  src,
  size = "md",
  online = false,
  userId,
  showFrameEffects = true,
}: {
  name: string;
  src?: string | null;
  size?: "xs" | "sm" | "md";
  online?: boolean;
  userId?: string | null;
  showFrameEffects?: boolean;
}) {
  // Map forum sizes to UserAvatar sizes
  const sizeMap: Record<string, "xs" | "sm" | "md" | "lg" | "xl"> = {
    xs: "xs",
    sm: "sm",
    md: "md",
  };

  const userAvatarSize = sizeMap[size];

  // If userId is provided and showFrameEffects is true, use UserAvatar with frame
  if (userId && showFrameEffects) {
    return (
      <div className="relative shrink-0">
        <UserAvatar
          userId={userId}
          avatarUrl={src || undefined}
          userName={name}
          size={userAvatarSize}
          animated={true}
          showFrameEffects={true}
        />
      </div>
    );
  }

  // Fallback: use simple Avatar without frame effects
  const sizeClass =
    size === "xs"
      ? "h-6 w-6 text-[10px]"
      : size === "sm"
        ? "h-9 w-9 text-xs"
        : "h-12 w-12 text-sm";

  return (
    <div className="relative shrink-0">
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizeClass} rounded-full object-cover ring-2 ring-white/80 dark:ring-white/10`}
        />
      ) : (
        <div
          className={`${sizeClass} flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 font-bold text-white shadow-lg shadow-cyan-500/20`}
        >
          {getInitials(name)}
        </div>
      )}
    </div>
  );
}
