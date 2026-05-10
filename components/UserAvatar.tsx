"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { AvatarFrame } from "@/components/community/AvatarFrame";
import { type AvatarFrameId } from "@/lib/designSystem";
import { User } from "lucide-react";
import { getCachedUser, setCachedUser, clearUserCache } from "@/lib/userCache";

interface UserAvatarProps {
  userId?: string;
  avatarUrl?: string;
  userName?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  showFrameEffects?: boolean;
  onClick?: () => void;
  animated?: boolean;
  frameId?: AvatarFrameId | null;
  premiumBorderUnlocked?: boolean;
}

/**
 * Centralized User Avatar Component
 * Quản lý hiển thị avatar với frame effects, glow, shimmer, etc
 *
 * Usage:
 * - Forum posts: <UserAvatar userId={author.id} size="md" />
 * - Navbar: <UserAvatar userId={user.id} size="sm" />
 * - Profile: <UserAvatar userId={user.id} size="xl" />
 */
export const UserAvatar: React.FC<UserAvatarProps> = ({
  userId,
  avatarUrl,
  userName = "User",
  size = "md",
  className = "",
  showFrameEffects = true,
  onClick,
  animated = true,
  frameId: frameIdOverride,
  premiumBorderUnlocked,
}) => {
  const [frameId, setFrameId] = useState<AvatarFrameId | null>(null);
  const [dbAvatarUrl, setDbAvatarUrl] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      // Check cache first
      const cached = getCachedUser(userId);
      if (cached && refreshToken === 0) {
        if (dbAvatarUrl !== cached.avatarUrl) setDbAvatarUrl(cached.avatarUrl);
        if (frameIdOverride === undefined && frameId !== cached.frameId) {
          setFrameId(cached.frameId);
        }
        // Still need to check premium flag if not cached or if we want to be safe
      }

      try {
        const { data, error } = await supabase
          .from("users")
          .select("avatar_frame_id, avatar_url")
          .eq("id", userId)
          .single();

        if (error) throw error;

        const fetchedFrameId = (data?.avatar_frame_id || null) as AvatarFrameId | null;
        const fetchedAvatarUrl = data?.avatar_url || null;

        if (fetchedAvatarUrl) setDbAvatarUrl(fetchedAvatarUrl);
        if (frameIdOverride === undefined) setFrameId(fetchedFrameId);

        // Update cache
        setCachedUser(userId, {
          frameId: fetchedFrameId,
          avatarUrl: fetchedAvatarUrl
        });
      } catch (err) {
        console.error("Error fetching user avatar data:", err);
      }

      // Query premium flag separately to stay compatible with DBs that have not run migration yet.
      if (premiumBorderUnlocked === undefined) {
        const { data: premiumData, error: premiumError } = await supabase
          .from("users")
          .select("premium_avatar_border")
          .eq("id", userId)
          .single();

        if (!premiumError) {
          setIsPremium(Boolean(premiumData?.premium_avatar_border));
        }
      }
    };

    void fetchUserData();

    const handleProfileUpdated = () => {
      if (userId) {
        clearUserCache(userId);
        setRefreshToken((value) => value + 1);
      }
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
  }, [userId, frameIdOverride, premiumBorderUnlocked, refreshToken]);

  useEffect(() => {
    if (frameIdOverride !== undefined) {
      setFrameId(frameIdOverride ?? null);
    }
  }, [frameIdOverride]);

  useEffect(() => {
    if (premiumBorderUnlocked !== undefined) {
      setIsPremium(premiumBorderUnlocked);
    }
  }, [premiumBorderUnlocked]);

  // Determine if should show shimmer effect
  const showShimmer = showFrameEffects && !!frameId;

  // Prioritize DB avatar URL if available
  const effectiveAvatarUrl = dbAvatarUrl || avatarUrl;

  // Base avatar content
  const avatarContent = effectiveAvatarUrl ? (
    <img
      src={effectiveAvatarUrl}
      alt={userName}
      className="w-full h-full object-cover"
    />
  ) : (
    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
      {userName.charAt(0).toUpperCase() ? (
        <span className="text-white font-bold">
          {userName.charAt(0).toUpperCase()}
        </span>
      ) : (
        <User className="w-1/2 h-1/2 text-white" />
      )}
    </div>
  );

  // If frame should be shown, wrap in AvatarFrame
  if (showFrameEffects && frameId) {
    return (
      <div
        className={`${className} ${onClick ? "cursor-pointer" : "cursor-default"}`}
        onClick={onClick}
      >
        <AvatarFrame
          frameId={frameId}
          size={size}
          animated={animated && showShimmer}
        >
          {avatarContent}
        </AvatarFrame>
      </div>
    );
  }

  // Fallback: simple avatar without frame
  const sizeClasses = {
    xs: "h-6 w-6",
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-24 w-24",
    xl: "h-36 w-36",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-300 dark:border-gray-600 ${className} ${onClick ? "cursor-pointer" : "cursor-default"}`}
      onClick={onClick}
    >
      {avatarContent}
    </div>
  );
};

/**
 * Avatar component with default styling for Navbar
 */
export const NavbarAvatar: React.FC<Omit<UserAvatarProps, "size">> = (
  props,
) => (
  <UserAvatar {...props} size="sm" animated={true} showFrameEffects={true} />
);

/**
 * Avatar component for Forum posts
 */
export const ForumAvatar: React.FC<Omit<UserAvatarProps, "size">> = (props) => (
  <UserAvatar {...props} size="lg" animated={true} showFrameEffects={true} />
);

/**
 * Avatar component for Profile pages
 */
export const ProfileAvatar: React.FC<Omit<UserAvatarProps, "size">> = (
  props,
) => (
  <UserAvatar {...props} size="lg" animated={true} showFrameEffects={true} />
);

/**
 * Avatar component for Comments/Replies
 */
export const CommentAvatar: React.FC<Omit<UserAvatarProps, "size">> = (
  props,
) => (
  <UserAvatar {...props} size="sm" animated={false} showFrameEffects={true} />
);
