"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  AVATAR_FRAMES,
  type AvatarFrameId,
  getUsernameStyleByFrame,
} from "@/lib/designSystem";
import { cn } from "@/lib/utils";

interface UsernameProps {
  userId?: string | null;
  name: string;
  frameId?: AvatarFrameId | null;
  className?: string;
  showEffects?: boolean;
}

/**
 * Premium Username Display Component
 * Match visuals with Avatar Frame System
 */
export const Username: React.FC<UsernameProps> = ({
  userId,
  name,
  frameId: frameIdOverride,
  className,
  showEffects = true,
}) => {
  const [frameId, setFrameId] = useState<AvatarFrameId | null>(null);

  useEffect(() => {
    const fetchUserFrame = async () => {
      if (!userId || frameIdOverride !== undefined) return;

      try {
        const { data } = await supabase
          .from("users")
          .select("avatar_frame_id")
          .eq("id", userId)
          .single();

        setFrameId(data?.avatar_frame_id as AvatarFrameId | null);
      } catch (err) {
        console.error("Error fetching username frame:", err);
      }
    };

    fetchUserFrame();

    const handleProfileUpdated = () => {
      if (userId) fetchUserFrame();
    };

    window.addEventListener(
      "learning-hub:user-profile-updated",
      handleProfileUpdated,
    );

    return () => {
      window.removeEventListener(
        "learning-hub:user-profile-updated",
        handleProfileUpdated,
      );
    };
  }, [userId, frameIdOverride]);

  // Use override if provided
  const effectiveFrameId =
    frameIdOverride !== undefined ? frameIdOverride : frameId;
  const style = showEffects ? getUsernameStyleByFrame(effectiveFrameId) : null;

  if (!style) {
    return (
      <span className={cn("font-semibold text-slate-900 dark:text-white", className)}>
        {name}
      </span>
    );
  }

  const rarity = effectiveFrameId ? AVATAR_FRAMES[effectiveFrameId as keyof typeof AVATAR_FRAMES]?.rarity : null;
  const isLegendary = rarity === "legendary";
  const isEpic = rarity === "epic";
  const isRare = rarity === "rare";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 transition-all duration-300 relative group/username font-bold",
        className
      )}
      style={{ minHeight: "1.2em" }}
    >
      {/* Legendary Aura Particles */}
      {isLegendary && (
        <>
          <span className="absolute -top-1 -left-1 w-1 h-1 bg-white rounded-full animate-ping opacity-75" />
          <span className="absolute -bottom-1 -right-1 w-1 h-1 bg-amber-200 rounded-full animate-pulse opacity-60" />
          <span className="absolute top-1/2 -right-2 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-bounce opacity-40 blur-[1px]" />
        </>
      )}
      
      <span className={cn(
        "relative z-10 flex items-center gap-1.5",
        !style && "text-slate-900 dark:text-white",
        style?.nameClass,
        style?.glowClass,
        style?.shimmerClass,
        (style as any)?.auraClass,
        style?.hoverEffect
      )}>
        {name}
        {style && (
          <img 
            src="/effectBling.gif" 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-40 mix-blend-screen"
          />
        )}
      </span>
    </span>
  );
};
