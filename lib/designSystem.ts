/**
 * Premium Community Design System
 * Discord Nitro + Threads + Modern Gaming Aesthetic
 */

export const AVATAR_FRAMES = {
  admin: {
    id: "admin",
    name: "Crimson Authority",
    description: "Admin red glow with cinematic edge lighting",
    borderClass: "spark-border-admin",
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
    borderClass: "spark-border-moderator",
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
    borderClass: "spark-border-premium",
    glowClass:
      "shadow-[0_0_24px_rgba(251,191,36,0.5),0_0_56px_rgba(245,158,11,0.32)]",
    shimmerClass: "spark-shimmer-gold",
    particleClass: "spark-particles-gold",
    accentColor: "from-yellow-300 to-amber-500",
    icon: "💎",
    rarity: "rare",
    theme: "warm",
  },
  "top-contributor": {
    id: "top-contributor",
    name: "Rose Momentum",
    description: "Top contributor pink sparkle with soft drift",
    borderClass: "spark-border-contributor",
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
    borderClass: "spark-border-verified",
    glowClass:
      "shadow-[0_0_24px_rgba(34,211,238,0.46),0_0_52px_rgba(59,130,246,0.28)]",
    shimmerClass: "spark-shimmer-cyan",
    particleClass: "spark-particles-cyan",
    accentColor: "from-cyan-300 to-blue-500",
    icon: "✅",
    rarity: "uncommon",
    theme: "cool",
  },
  "vip-member": {
    id: "vip-member",
    name: "Nebula Halo",
    description: "Purple nebula aura with holographic edge",
    borderClass: "spark-border-vip",
    glowClass:
      "shadow-[0_0_26px_rgba(167,139,250,0.48),0_0_56px_rgba(99,102,241,0.3)]",
    shimmerClass: "spark-shimmer-violet",
    particleClass: "spark-particles-violet",
    accentColor: "from-violet-300 to-indigo-500",
    icon: "⭐",
    rarity: "epic",
    theme: "cool",
  },
  "ai-expert": {
    id: "ai-expert",
    name: "Holo Matrix",
    description: "Silver holographic edge with AI shimmer",
    borderClass: "spark-border-ai",
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
    borderClass: "spark-border-developer",
    glowClass:
      "shadow-[0_0_22px_rgba(56,189,248,0.45),0_0_50px_rgba(14,116,144,0.3)]",
    shimmerClass: "spark-shimmer-blue",
    particleClass: "spark-particles-blue",
    accentColor: "from-sky-300 to-cyan-500",
    icon: "💻",
    rarity: "uncommon",
    theme: "cool",
  },
  "void-sovereign": {
    id: "void-sovereign",
    name: "Void Sovereign",
    description: "Black-violet sovereign aura with deep space bloom",
    borderClass: "spark-border-void",
    glowClass:
      "shadow-[0_0_30px_rgba(168,85,247,0.58),0_0_70px_rgba(15,23,42,0.42)]",
    shimmerClass: "spark-shimmer-violet",
    particleClass: "spark-particles-violet",
    accentColor: "from-fuchsia-300 to-violet-700",
    icon: "✦",
    rarity: "legendary",
    theme: "cool",
  },
  "inferno-core": {
    id: "inferno-core",
    name: "Inferno Core",
    description: "Molten red-orange ring with volcanic impact glow",
    borderClass: "spark-border-inferno",
    glowClass:
      "shadow-[0_0_30px_rgba(249,115,22,0.62),0_0_76px_rgba(185,28,28,0.36)]",
    shimmerClass: "spark-shimmer-red",
    particleClass: "spark-particles-warm",
    accentColor: "from-orange-300 to-red-700",
    icon: "◆",
    rarity: "legendary",
    theme: "warm",
  },
  "frost-monarch": {
    id: "frost-monarch",
    name: "Frost Monarch",
    description: "Icy royal frame with silver-blue crystal bloom",
    borderClass: "spark-border-frost",
    glowClass:
      "shadow-[0_0_28px_rgba(125,211,252,0.62),0_0_68px_rgba(37,99,235,0.34)]",
    shimmerClass: "spark-shimmer-cyan",
    particleClass: "spark-particles-cyan",
    accentColor: "from-cyan-100 to-blue-600",
    icon: "❄",
    rarity: "legendary",
    theme: "cool",
  },
  "thunder-pulse": {
    id: "thunder-pulse",
    name: "Thunder Pulse",
    description: "Electric yellow-cyan pulse with charged neon edge",
    borderClass: "spark-border-thunder",
    glowClass:
      "shadow-[0_0_26px_rgba(250,204,21,0.52),0_0_62px_rgba(34,211,238,0.36)]",
    shimmerClass: "spark-shimmer-blue",
    particleClass: "spark-particles-blue",
    accentColor: "from-yellow-300 to-cyan-500",
    icon: "⚡",
    rarity: "epic",
    theme: "cool",
  },
  "emerald-aegis": {
    id: "emerald-aegis",
    name: "Emerald Aegis",
    description: "Protective emerald ring with tactical shield glow",
    borderClass: "spark-border-emerald",
    glowClass:
      "shadow-[0_0_24px_rgba(16,185,129,0.5),0_0_56px_rgba(20,184,166,0.28)]",
    shimmerClass: "spark-shimmer-cyan",
    particleClass: "spark-particles-cyan",
    accentColor: "from-emerald-300 to-teal-600",
    icon: "⬟",
    rarity: "epic",
    theme: "cool",
  },
  "arcane-rift": {
    id: "arcane-rift",
    name: "Arcane Rift",
    description: "Magenta arcane edge with spellburst particles",
    borderClass: "spark-border-arcane",
    glowClass:
      "shadow-[0_0_26px_rgba(217,70,239,0.5),0_0_58px_rgba(99,102,241,0.32)]",
    shimmerClass: "spark-shimmer-pink",
    particleClass: "spark-particles-rose",
    accentColor: "from-pink-300 to-indigo-600",
    icon: "✧",
    rarity: "epic",
    theme: "cool",
  },
  "cyber-phantom": {
    id: "cyber-phantom",
    name: "Cyber Phantom",
    description: "Neon matrix frame with stealthy cyber glow",
    borderClass: "spark-border-cyber",
    glowClass:
      "shadow-[0_0_24px_rgba(132,204,22,0.46),0_0_58px_rgba(34,211,238,0.3)]",
    shimmerClass: "spark-shimmer-silver",
    particleClass: "spark-particles-cyan",
    accentColor: "from-lime-300 to-cyan-500",
    icon: "▣",
    rarity: "rare",
    theme: "cool",
  },
  "aurora-crown": {
    id: "aurora-crown",
    name: "Aurora Crown",
    description: "Aurora gradient crown with premium polar shimmer",
    borderClass: "spark-border-aurora",
    glowClass:
      "shadow-[0_0_28px_rgba(45,212,191,0.48),0_0_64px_rgba(168,85,247,0.34)]",
    shimmerClass: "spark-shimmer-violet",
    particleClass: "spark-particles-violet",
    accentColor: "from-teal-200 to-fuchsia-500",
    icon: "★",
    rarity: "legendary",
    theme: "cool",
  },
  "obsidian-eclipse": {
    id: "obsidian-eclipse",
    name: "Obsidian Eclipse",
    description: "Dark eclipse frame with razor gold highlights",
    borderClass: "spark-border-obsidian",
    glowClass:
      "shadow-[0_0_24px_rgba(251,191,36,0.38),0_0_70px_rgba(24,24,27,0.55)]",
    shimmerClass: "spark-shimmer-gold",
    particleClass: "spark-particles-gold",
    accentColor: "from-zinc-800 to-amber-400",
    icon: "◉",
    rarity: "legendary",
    theme: "warm",
  },
  "quantum-orbit": {
    id: "quantum-orbit",
    name: "Quantum Orbit",
    description: "Scientific orbit halo with high-energy blue sweep",
    borderClass: "spark-border-quantum",
    glowClass:
      "shadow-[0_0_24px_rgba(59,130,246,0.5),0_0_58px_rgba(124,58,237,0.3)]",
    shimmerClass: "spark-shimmer-blue",
    particleClass: "spark-particles-blue",
    accentColor: "from-sky-300 to-violet-600",
    icon: "◎",
    rarity: "rare",
    theme: "cool",
  },
  "ruby-overdrive": {
    id: "ruby-overdrive",
    name: "Ruby Overdrive",
    description: "Hyper red ruby frame with aggressive speed glow",
    borderClass: "spark-border-ruby",
    glowClass:
      "shadow-[0_0_26px_rgba(244,63,94,0.54),0_0_58px_rgba(190,24,93,0.34)]",
    shimmerClass: "spark-shimmer-red",
    particleClass: "spark-particles-rose",
    accentColor: "from-red-300 to-fuchsia-700",
    icon: "◇",
    rarity: "epic",
    theme: "warm",
  },
  "mythic-trophy": {
    id: "mythic-trophy",
    name: "Mythic Trophy",
    description: "Champion gold frame with victorious mythic shine",
    borderClass: "spark-border-mythic",
    glowClass:
      "shadow-[0_0_30px_rgba(251,191,36,0.58),0_0_70px_rgba(234,88,12,0.35)]",
    shimmerClass: "spark-shimmer-gold",
    particleClass: "spark-particles-gold",
    accentColor: "from-yellow-200 to-orange-600",
    icon: "▲",
    rarity: "legendary",
    theme: "warm",
  },
  "cat-walking": {
    id: "cat-walking",
    name: "Cat Stroll",
    description: "Adorable walking cat around your avatar",
    borderClass: "spark-border-cat-walking",
    glowClass: "shadow-[0_0_20px_rgba(255,255,255,0.3)]",
    shimmerClass: "spark-shimmer-silver",
    particleClass: "spark-particles-cyan",
    accentColor: "from-slate-200 to-slate-400",
    icon: "🐱",
    rarity: "epic",
    theme: "cool",
  },
  "dog-walking": {
    id: "dog-walking",
    name: "Shiba Walk",
    description: "Friendly shiba walking around",
    borderClass: "spark-border-dog-walking",
    glowClass: "shadow-[0_0_20px_rgba(251,191,36,0.3)]",
    shimmerClass: "spark-shimmer-gold",
    particleClass: "spark-particles-gold",
    accentColor: "from-amber-200 to-yellow-500",
    icon: "🐶",
    rarity: "epic",
    theme: "warm",
  },
  "hamster-spin": {
    id: "hamster-spin",
    name: "Hamster Wheel",
    description: "Energetic hamster running fast",
    borderClass: "spark-border-hamster",
    glowClass: "shadow-[0_0_20px_rgba(245,158,11,0.3)]",
    shimmerClass: "spark-shimmer-amber",
    particleClass: "spark-particles-gold",
    accentColor: "from-orange-200 to-amber-500",
    icon: "🐹",
    rarity: "epic",
    theme: "warm",
  },
  "pink-bling": {
    id: "pink-bling",
    name: "Pink Diamond",
    description: "Luxurious pink sparkles and gems",
    borderClass: "spark-border-pink-bling",
    glowClass: "shadow-[0_0_25px_rgba(236,72,153,0.4)]",
    shimmerClass: "spark-shimmer-pink",
    particleClass: "spark-particles-rose",
    accentColor: "from-pink-300 to-rose-500",
    icon: "💖",
    rarity: "legendary",
    theme: "warm",
  },
  "small-bling": {
    id: "small-bling",
    name: "Star Dust",
    description: "Subtle and elegant stardust sparkles",
    borderClass: "spark-border-small-bling",
    glowClass: "shadow-[0_0_20px_rgba(34,211,238,0.3)]",
    shimmerClass: "spark-shimmer-cyan",
    particleClass: "spark-particles-cyan",
    accentColor: "from-cyan-200 to-blue-400",
    icon: "✨",
    rarity: "rare",
    theme: "cool",
  },
} as const;

export const ROLE_BADGES = {
  admin: {
    id: "admin",
    label: "Admin",
    icon: "👑",
    bgGradient: "from-rose-600 via-red-600 to-red-700",
    textColor: "text-white",
    borderColor: "border-rose-400",
    glowClass: "shadow-[0_0_15px_rgba(244,63,94,0.5)]",
    shimmerClass: "spark-shimmer-red",
  },
  moderator: {
    id: "moderator",
    label: "Moderator",
    icon: "🛡️",
    bgGradient: "from-amber-500 via-orange-500 to-orange-600",
    textColor: "text-white",
    borderColor: "border-amber-400",
    glowClass: "shadow-[0_0_12px_rgba(251,146,60,0.4)]",
    shimmerClass: "spark-shimmer-amber",
  },
  topContributor: {
    id: "top-contributor",
    label: "Top Contributor",
    icon: "🔥",
    bgGradient: "from-pink-500 via-rose-500 to-red-600",
    textColor: "text-white",
    borderColor: "border-pink-400",
    glowClass: "shadow-[0_0_12px_rgba(244,114,182,0.4)]",
    shimmerClass: "spark-shimmer-pink",
  },
  verified: {
    id: "verified",
    label: "Verified",
    icon: "✅",
    bgGradient: "from-cyan-500 via-sky-500 to-blue-600",
    textColor: "text-white",
    borderColor: "border-cyan-400",
    glowClass: "shadow-[0_0_10px_rgba(34,211,238,0.3)]",
    shimmerClass: "spark-shimmer-cyan",
  },
  vipMember: {
    id: "vip-member",
    label: "VIP Member",
    icon: "⭐",
    bgGradient: "from-violet-600 via-purple-600 to-indigo-700",
    textColor: "text-white",
    borderColor: "border-violet-400",
    glowClass: "shadow-[0_0_15px_rgba(139,92,246,0.5)]",
    shimmerClass: "spark-shimmer-violet",
  },
  aiExpert: {
    id: "ai-expert",
    label: "AI Expert",
    icon: "🤖",
    bgGradient: "from-teal-500 via-cyan-500 to-blue-600",
    textColor: "text-white",
    borderColor: "border-teal-400",
    glowClass: "shadow-[0_0_10px_rgba(20,184,166,0.3)]",
    shimmerClass: "spark-shimmer-silver",
  },
  developer: {
    id: "developer",
    label: "Developer",
    icon: "💻",
    bgGradient: "from-emerald-500 via-teal-500 to-cyan-600",
    textColor: "text-white",
    borderColor: "border-emerald-400",
    glowClass: "shadow-[0_0_12px_rgba(16,185,129,0.4)]",
    shimmerClass: "spark-shimmer-blue",
  },
  activeMember: {
    id: "active-member",
    label: "Active Member",
    icon: "⚡",
    bgGradient: "from-blue-500 via-cyan-500 to-sky-600",
    textColor: "text-white",
    borderColor: "border-blue-400",
    glowClass: "shadow-[0_0_8px_rgba(59,130,246,0.3)]",
    shimmerClass: "spark-shimmer-blue",
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
    bubbleClass: "spark-chat-bubble-admin",
  },
  moderator: {
    id: "moderator",
    nameClass: "spark-username-gradient-moderator",
    glowClass: "spark-username-glow-moderator",
    shimmerClass: "spark-username-shimmer",
    hoverEffect: "hover:spark-username-hover-moderator",
    nameplateClass: "spark-nameplate-moderator",
    bubbleClass: "spark-chat-bubble-moderator",
  },
  premium: {
    id: "premium",
    nameClass: "spark-username-gradient-premium",
    glowClass: "spark-username-glow-premium",
    shimmerClass: "spark-username-shimmer",
    hoverEffect: "hover:spark-username-hover-premium",
    nameplateClass: "spark-nameplate-premium",
    bubbleClass: "spark-chat-bubble-premium",
  },
  "top-contributor": {
    id: "top-contributor",
    nameClass: "spark-username-gradient-contributor",
    glowClass: "spark-username-glow-contributor",
    shimmerClass: "spark-username-shimmer",
    hoverEffect: "hover:spark-username-hover-contributor",
    nameplateClass: "spark-nameplate-contributor",
    bubbleClass: "spark-chat-bubble-contributor",
  },
  verified: {
    id: "verified",
    nameClass: "spark-username-gradient-verified",
    glowClass: "spark-username-glow-verified",
    shimmerClass: "spark-username-shimmer",
    hoverEffect: "hover:spark-username-hover-verified",
    nameplateClass: "spark-nameplate-verified",
    bubbleClass: "spark-chat-bubble-verified",
  },
  "vip-member": {
    id: "vip-member",
    nameClass: "spark-username-gradient-vip",
    glowClass: "spark-username-glow-vip",
    shimmerClass: "spark-username-shimmer",
    hoverEffect: "hover:spark-username-hover-vip",
    nameplateClass: "spark-nameplate-vip",
    bubbleClass: "spark-chat-bubble-vip",
  },
  "ai-expert": {
    id: "ai-expert",
    nameClass: "spark-username-gradient-ai",
    glowClass: "spark-username-glow-ai",
    shimmerClass: "spark-username-shimmer",
    hoverEffect: "hover:spark-username-hover-ai",
    nameplateClass: "spark-nameplate-ai",
    bubbleClass: "spark-chat-bubble-ai",
  },
  developer: {
    id: "developer",
    nameClass: "spark-username-gradient-developer",
    glowClass: "spark-username-glow-developer",
    shimmerClass: "spark-username-shimmer",
    hoverEffect: "hover:spark-username-hover-developer",
    nameplateClass: "spark-nameplate-developer",
    bubbleClass: "spark-chat-bubble-developer",
  },
  legendary: {
    id: "legendary",
    nameClass: "spark-username-gradient-legendary",
    glowClass: "spark-username-glow-legendary",
    shimmerClass: "spark-username-shimmer",
    auraClass: "spark-username-legendary-aura",
    hoverEffect: "spark-username-hover-legendary",
    nameplateClass: "spark-nameplate-legendary",
    bubbleClass: "spark-chat-bubble-legendary",
  },
  "cat-walking": {
    id: "cat-walking",
    nameClass: "spark-username-gradient-cat",
    glowClass: "spark-username-glow-verified",
    shimmerClass: "spark-username-shimmer",
    hoverEffect: "hover:spark-username-hover-verified",
    nameplateClass: "spark-nameplate-verified",
    bubbleClass: "spark-chat-bubble-verified",
  },
  "dog-walking": {
    id: "dog-walking",
    nameClass: "spark-username-gradient-dog",
    glowClass: "spark-username-glow-moderator",
    shimmerClass: "spark-username-shimmer",
    hoverEffect: "hover:spark-username-hover-moderator",
    nameplateClass: "spark-nameplate-moderator",
    bubbleClass: "spark-chat-bubble-moderator",
  },
  "pink-bling": {
    id: "pink-bling",
    nameClass: "spark-username-gradient-pink",
    glowClass: "spark-username-glow-vip",
    shimmerClass: "spark-username-shimmer",
    hoverEffect: "hover:spark-username-hover-vip",
    nameplateClass: "spark-nameplate-vip",
    bubbleClass: "spark-chat-bubble-vip",
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

/**
 * Maps Avatar Frame to Username Style
 */
export const getUsernameStyleByFrame = (frameId?: string | null) => {
  if (!frameId) return null;

  const frame = AVATAR_FRAMES[frameId as AvatarFrameId];
  
  // High precedence for Legendary rarity (Gold/Solar Flare)
  if (frame?.rarity === ("legendary" as any) || frameId === "legendary") {
    return USERNAME_STYLES.legendary;
  }

  // Role based mappings
  if (frameId === "admin") return USERNAME_STYLES.admin;
  if (frameId === "moderator") return USERNAME_STYLES.moderator;
  if (frameId === "developer") return USERNAME_STYLES.developer;
  if (frameId === "premium") return USERNAME_STYLES.premium;
  if (frameId === "verified") return USERNAME_STYLES.verified;
  if (frameId === "vip-member") return USERNAME_STYLES["vip-member"];
  if (frameId === "ai-expert") return USERNAME_STYLES["ai-expert"];
  if (frameId === "top-contributor") return USERNAME_STYLES["top-contributor"];

  // Fallback rarity based mappings
  if (frame?.rarity === ("epic" as any)) return USERNAME_STYLES["vip-member"];
  if (frame?.rarity === ("rare" as any)) return USERNAME_STYLES.premium;

  if (frameId === "cat-walking") return USERNAME_STYLES["cat-walking"];
  if (frameId === "dog-walking") return USERNAME_STYLES["dog-walking"];
  if (frameId === "pink-bling") return USERNAME_STYLES["pink-bling"];
  if (frameId === "small-bling") return USERNAME_STYLES.premium;
  if (frameId === "hamster-spin") return USERNAME_STYLES.premium;

  return null;
};
