/**
 * Premium Community Design System
 * Discord Nitro + Threads + Modern Gaming Aesthetic
 */

export const AVATAR_FRAMES = {
  admin: {
    id: "admin",
    name: "Crimson Authority",
    description: "Admin red glow with cinematic edge lighting",
    borderClass: "bg-gradient-to-br from-rose-500 via-red-500 to-red-700",
    glowClass:
      "shadow-[0_0_22px_rgba(244,63,94,0.48),0_0_48px_rgba(220,38,38,0.28)]",
    shimmerClass: "spark-shimmer-red",
    particleClass: "spark-particles-warm",
    accentColor: "from-rose-400 to-red-600",
    icon: "👑",
    rarity: "legendary",
    theme: "warm",
  },
  moderator: {
    id: "moderator",
    name: "Solar Sentinel",
    description: "Amber guard ring with soft glow sweep",
    borderClass:
      "bg-gradient-to-br from-amber-400 via-orange-500 to-orange-700",
    glowClass:
      "shadow-[0_0_20px_rgba(251,146,60,0.45),0_0_42px_rgba(245,158,11,0.24)]",
    shimmerClass: "spark-shimmer-amber",
    particleClass: "spark-particles-gold",
    accentColor: "from-amber-300 to-orange-500",
    icon: "🛡️",
    rarity: "epic",
    theme: "warm",
  },
  premium: {
    id: "premium",
    name: "Golden Luxe",
    description: "Gold premium shimmer with polished bloom",
    borderClass: "bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600",
    glowClass:
      "shadow-[0_0_24px_rgba(251,191,36,0.5),0_0_56px_rgba(245,158,11,0.32)]",
    shimmerClass: "spark-shimmer-gold",
    particleClass: "spark-particles-gold",
    accentColor: "from-yellow-300 to-amber-500",
    icon: "💎",
    rarity: "rare",
    theme: "warm",
  },
  topContributor: {
    id: "top-contributor",
    name: "Rose Momentum",
    description: "Top contributor pink sparkle with soft drift",
    borderClass: "bg-gradient-to-br from-pink-400 via-rose-500 to-fuchsia-600",
    glowClass:
      "shadow-[0_0_22px_rgba(244,114,182,0.46),0_0_44px_rgba(236,72,153,0.28)]",
    shimmerClass: "spark-shimmer-pink",
    particleClass: "spark-particles-rose",
    accentColor: "from-pink-300 to-rose-500",
    icon: "🔥",
    rarity: "epic",
    theme: "warm",
  },
  verified: {
    id: "verified",
    name: "Cyan Crystal",
    description: "Verified crystal edge with cyan shimmer",
    borderClass: "bg-gradient-to-br from-cyan-300 via-sky-400 to-blue-600",
    glowClass:
      "shadow-[0_0_24px_rgba(34,211,238,0.46),0_0_52px_rgba(59,130,246,0.28)]",
    shimmerClass: "spark-shimmer-cyan",
    particleClass: "spark-particles-cyan",
    accentColor: "from-cyan-300 to-blue-500",
    icon: "✅",
    rarity: "uncommon",
    theme: "cool",
  },
  vipMember: {
    id: "vip-member",
    name: "Nebula Halo",
    description: "Purple nebula aura with holographic edge",
    borderClass:
      "bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-700",
    glowClass:
      "shadow-[0_0_26px_rgba(167,139,250,0.48),0_0_56px_rgba(99,102,241,0.3)]",
    shimmerClass: "spark-shimmer-violet",
    particleClass: "spark-particles-violet",
    accentColor: "from-violet-300 to-indigo-500",
    icon: "⭐",
    rarity: "epic",
    theme: "cool",
  },
  aiExpert: {
    id: "ai-expert",
    name: "Holo Matrix",
    description: "Silver holographic edge with AI shimmer",
    borderClass: "bg-gradient-to-br from-slate-300 via-cyan-300 to-slate-500",
    glowClass:
      "shadow-[0_0_18px_rgba(148,163,184,0.45),0_0_44px_rgba(34,211,238,0.24)]",
    shimmerClass: "spark-shimmer-silver",
    particleClass: "spark-particles-cyan",
    accentColor: "from-slate-300 to-cyan-400",
    icon: "🤖",
    rarity: "epic",
    theme: "cool",
  },
  developer: {
    id: "developer",
    name: "Blue Energy Ring",
    description: "Developer energy ring with dark neon outline",
    borderClass: "bg-gradient-to-br from-sky-400 via-blue-500 to-cyan-600",
    glowClass:
      "shadow-[0_0_22px_rgba(56,189,248,0.45),0_0_50px_rgba(14,116,144,0.3)]",
    shimmerClass: "spark-shimmer-blue",
    particleClass: "spark-particles-blue",
    accentColor: "from-sky-300 to-cyan-500",
    icon: "💻",
    rarity: "uncommon",
    theme: "cool",
  },
} as const;

export const ROLE_BADGES = {
  admin: {
    id: "admin",
    label: "Admin",
    icon: "👑",
    bgGradient: "from-red-600 to-red-700",
    textColor: "text-white",
    borderColor: "border-red-500",
  },
  moderator: {
    id: "moderator",
    label: "Moderator",
    icon: "🛡️",
    bgGradient: "from-orange-600 to-orange-700",
    textColor: "text-white",
    borderColor: "border-orange-500",
  },
  topContributor: {
    id: "top-contributor",
    label: "Top Contributor",
    icon: "🔥",
    bgGradient: "from-pink-600 to-red-600",
    textColor: "text-white",
    borderColor: "border-pink-500",
  },
  verified: {
    id: "verified",
    label: "Verified",
    icon: "✅",
    bgGradient: "from-cyan-600 to-blue-600",
    textColor: "text-white",
    borderColor: "border-cyan-500",
  },
  vipMember: {
    id: "vip-member",
    label: "VIP Member",
    icon: "⭐",
    bgGradient: "from-purple-600 to-indigo-700",
    textColor: "text-white",
    borderColor: "border-purple-500",
  },
  aiExpert: {
    id: "ai-expert",
    label: "AI Expert",
    icon: "🤖",
    bgGradient: "from-teal-600 to-cyan-600",
    textColor: "text-white",
    borderColor: "border-teal-500",
  },
  developer: {
    id: "developer",
    label: "Developer",
    icon: "💻",
    bgGradient: "from-emerald-600 to-teal-600",
    textColor: "text-white",
    borderColor: "border-emerald-500",
  },
  activeMember: {
    id: "active-member",
    label: "Active Member",
    icon: "⚡",
    bgGradient: "from-blue-600 to-cyan-600",
    textColor: "text-white",
    borderColor: "border-blue-500",
  },
} as const;

export const USERNAME_STYLES = {
  admin: {
    id: "admin",
    nameClass: "spark-username-gradient-admin",
    glowClass: "spark-username-glow-admin",
    shimmerClass: "spark-username-shimmer",
    hoverEffect: "hover:spark-username-hover-admin",
    nameplateClass: "spark-nameplate-admin",
  },
  verified: {
    id: "verified",
    nameClass: "spark-username-gradient-verified",
    glowClass: "spark-username-glow-verified",
    shimmerClass: "spark-username-shimmer",
    hoverEffect: "hover:spark-username-hover-verified",
    nameplateClass: "spark-nameplate-verified",
  },
  premium: {
    id: "premium",
    nameClass: "spark-username-gradient-premium",
    glowClass: "spark-username-glow-premium",
    shimmerClass: "spark-username-shimmer",
    hoverEffect: "hover:spark-username-hover-premium",
    nameplateClass: "spark-nameplate-premium",
  },
  developer: {
    id: "developer",
    nameClass: "spark-username-gradient-developer",
    glowClass: "spark-username-glow-developer",
    shimmerClass: "spark-username-shimmer",
    hoverEffect: "hover:spark-username-hover-developer",
    nameplateClass: "spark-nameplate-developer",
  },
  vip: {
    id: "vip",
    nameClass: "spark-username-gradient-vip",
    glowClass: "spark-username-glow-vip",
    shimmerClass: "spark-username-shimmer",
    hoverEffect: "hover:spark-username-hover-vip",
    nameplateClass: "spark-nameplate-vip",
  },
  legendary: {
    id: "legendary",
    nameClass: "spark-username-gradient-legendary",
    glowClass: "spark-username-glow-legendary",
    shimmerClass: "spark-username-shimmer",
    hoverEffect: "hover:spark-username-hover-legendary",
    nameplateClass: "spark-nameplate-legendary",
  },
} as const;

export const PREMIUM_DECORATIONS = {
  sparkles: {
    id: "sparkles",
    name: "Sparkle Corners",
    animationClass: "spark-decoration-corners",
  },
  shimmer: {
    id: "shimmer",
    name: "Shimmer Sweep",
    animationClass: "spark-decoration-shimmer",
  },
  pulse: {
    id: "pulse",
    name: "Pulse Bloom",
    animationClass: "spark-decoration-pulse",
  },
  flame: {
    id: "flame",
    name: "Floating Stars",
    animationClass: "spark-decoration-stars",
  },
  orbit: {
    id: "orbit",
    name: "Particle Orbit",
    animationClass: "spark-decoration-orbit",
  },
} as const;

export const RARITY_COLORS = {
  common: { bg: "from-gray-600 to-gray-700", text: "text-gray-200" },
  uncommon: { bg: "from-green-600 to-green-700", text: "text-green-200" },
  rare: { bg: "from-blue-600 to-blue-700", text: "text-blue-200" },
  epic: { bg: "from-purple-600 to-purple-700", text: "text-purple-200" },
  legendary: { bg: "from-orange-600 to-red-700", text: "text-orange-200" },
} as const;

export type AvatarFrameId = keyof typeof AVATAR_FRAMES;
export type RoleBadgeId = keyof typeof ROLE_BADGES;
export type UsernameStyleId = keyof typeof USERNAME_STYLES;
export type RarityType = keyof typeof RARITY_COLORS;

export interface UserCommunityProfile {
  frameId?: AvatarFrameId;
  roleIds?: RoleBadgeId[];
  usernameStyle?: UsernameStyleId;
  decorations?: Array<keyof typeof PREMIUM_DECORATIONS>;
  customTitle?: string;
}

// Helper function to get all frames
export const getAllFrames = () => Object.values(AVATAR_FRAMES);

// Helper function to get frame by id
export const getFrameById = (id: AvatarFrameId) => AVATAR_FRAMES[id];

// Helper function to get role badge
export const getRoleBadgeById = (id: RoleBadgeId) => ROLE_BADGES[id];
