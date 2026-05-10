"use client";

import React from "react";
import { Sparkles, Zap, Flame } from "lucide-react";

interface ProfileDecorationProps {
  type?: "sparkles" | "shimmer" | "pulse" | "flame" | "aurora" | "orbit";
  children?: React.ReactNode;
  className?: string;
}

export const ProfileDecoration: React.FC<ProfileDecorationProps> = ({
  type = "sparkles",
  children,
  className = "",
}) => {
  const getDecorationClass = () => {
    switch (type) {
      case "sparkles":
        return "spark-decoration-corners";
      case "shimmer":
        return "spark-decoration-shimmer";
      case "pulse":
        return "spark-decoration-pulse";
      case "flame":
        return "spark-decoration-stars";
      case "aurora":
        return "animate-aurora-glow";
      case "orbit":
        return "spark-decoration-orbit";
      default:
        return "";
    }
  };

  const renderDecoration = () => {
    switch (type) {
      case "sparkles":
        return (
          <div className="pointer-events-none absolute inset-0">
            <span className="spark-corner spark-corner-tl" />
            <span className="spark-corner spark-corner-tr" />
            <span className="spark-corner spark-corner-bl" />
            <span className="spark-corner spark-corner-br" />
          </div>
        );
      case "pulse":
        return (
          <div className="absolute inset-0 border-2 border-cyan-400/30 rounded-full animate-pulse" />
        );
      case "flame":
        return (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <Flame className="h-5 w-5 text-amber-300/70 spark-float-y" />
            <Sparkles className="absolute -top-1 right-4 h-3 w-3 text-cyan-300/80 spark-float-y-delayed" />
            <Zap className="absolute bottom-1 left-3 h-3 w-3 text-violet-300/70 spark-float-y-slow" />
          </div>
        );
      case "aurora":
        return (
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-xl opacity-0 animate-pulse" />
        );
      case "orbit":
        return (
          <div className="pointer-events-none absolute inset-0">
            <span className="spark-orbit spark-orbit-a" />
            <span className="spark-orbit spark-orbit-b" />
            <span className="spark-orbit spark-orbit-c" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className={getDecorationClass()}>{children}</div>
      {renderDecoration()}
    </div>
  );
};

// Premium member profile card
interface PremiumProfileCardProps {
  username: string;
  role: string;
  avatarUrl?: string;
  frameType?: "admin" | "moderator" | "premium" | "verified" | "developer";
  customTitle?: string;
  decorationType?:
    | "sparkles"
    | "shimmer"
    | "pulse"
    | "flame"
    | "aurora"
    | "orbit";
  className?: string;
}

export const PremiumProfileCard: React.FC<PremiumProfileCardProps> = ({
  username,
  role,
  avatarUrl,
  frameType = "verified",
  customTitle,
  decorationType = "sparkles",
  className = "",
}) => {
  const frameColors = {
    admin: "from-red-600 to-red-700",
    moderator: "from-orange-600 to-orange-700",
    premium: "from-yellow-500 to-amber-600",
    verified: "from-cyan-600 to-blue-600",
    developer: "from-emerald-600 to-teal-600",
  };

  return (
    <div
      className={`relative group rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-6 hover:border-cyan-500/50 transition-all duration-300 ${className}`}
    >
      {/* Animated border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />

      <div className="flex items-center gap-4">
        {/* Avatar with frame */}
        <ProfileDecoration type={decorationType}>
          <div
            className={`relative w-16 h-16 rounded-full bg-gradient-to-br ${frameColors[frameType]} p-1 flex-shrink-0`}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-gray-300">
                  {username.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>
        </ProfileDecoration>

        {/* User info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white truncate">
              {username}
            </h3>
            <span className="text-sm text-yellow-400">⭐</span>
          </div>
          <p className="text-sm text-gray-400 truncate">{role}</p>
          {customTitle && (
            <p className="text-xs text-cyan-400 italic mt-1">{customTitle}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Animated notification badge
interface NotificationBadgeProps {
  count?: number;
  animated?: boolean;
  variant?: "primary" | "success" | "danger" | "warning";
  pulse?: boolean;
}

const variantColors = {
  primary: "bg-blue-600 text-white",
  success: "bg-emerald-600 text-white",
  danger: "bg-red-600 text-white",
  warning: "bg-yellow-600 text-white",
};

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  animated = true,
  variant = "primary",
  pulse = true,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs ${variantColors[variant]} ${
        animated ? "shadow-lg shadow-current/50" : ""
      }`}
    >
      {pulse && (
        <span
          className={`absolute inset-0 rounded-full bg-current opacity-20 ${animated ? "animate-pulse" : ""}`}
        />
      )}
      <span className="relative">{count ?? "1"}</span>
    </div>
  );
};
