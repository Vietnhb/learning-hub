"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { AvatarFrame } from "@/components/community/AvatarFrame";
import { type AvatarFrameId } from "@/lib/designSystem";
import { User } from "lucide-react";

interface UserAvatarProps {
  userId?: string;
  avatarUrl?: string;
  userName?: string;
  size?: "sm" | "md" | "lg" | "xl";
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
  const [isPremium, setIsPremium] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        return;
      }

      try {
        const { data, error } = await supabase
          .from("users")
          .select("avatar_frame_id")
          .eq("id", userId)
          .single();

        if (error) throw error;

        if (frameIdOverride === undefined) {
          setFrameId((data?.avatar_frame_id || null) as AvatarFrameId | null);
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
          } else if ((premiumError as { code?: string }).code !== "42703") {
            console.error("Error fetching premium avatar flag:", premiumError);
          } else {
            setIsPremium(false);
          }
        }
      } catch (err) {
        console.error("Error fetching user avatar data:", err);
      }
    };

    fetchUserData();

    const handleProfileUpdated = () => {
      setRefreshToken((value) => value + 1);
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

  // Base avatar content
  const avatarContent = avatarUrl ? (
    <img
      src={avatarUrl}
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
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-20 w-20",
    xl: "h-32 w-32",
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
  <UserAvatar {...props} size="md" animated={true} showFrameEffects={true} />
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
