"use client";

import React from "react";
import {
  AVATAR_FRAMES,
  ROLE_BADGES,
  USERNAME_STYLES,
  PREMIUM_DECORATIONS,
} from "@/lib/designSystem";
import {
  AvatarFrame,
  AVATAR_PRESETS,
} from "@/components/community/AvatarFrame";
import { RoleBadge, RoleBadges } from "@/components/community/RoleBadge";
import {
  UsernameText,
  GlowingUsername,
  ShimmeringUsername,
  HolographicNameplate,
} from "@/components/community/UsernameText";
import {
  PremiumProfileCard,
  ProfileDecoration,
  NotificationBadge,
} from "@/components/community/ProfileDecoration";
import { Card } from "@/components/ui/card";
import { Sparkles, Zap, Flame, Star } from "lucide-react";

export default function DesignSystemShowcase() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-bold mb-4 flex items-center justify-center gap-3">
            <Sparkles className="w-12 h-12 text-cyan-400" />
            Premium Community Design System
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discord Nitro + Threads + Modern Gaming Aesthetic
          </p>
          <p className="text-gray-500 text-sm mt-4">
            Hệ thống thiết kế toàn diện cho nền tảng cộng đồng hiện đại
          </p>
        </div>

        {/* Section 1: Avatar Frames */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Star className="w-8 h-8 text-yellow-400" />
            Avatar Frames
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.values(AVATAR_FRAMES).map((frame) => (
              <Card
                key={frame.id}
                className="p-6 bg-gray-800 border-gray-700 hover:border-cyan-500/50 transition-all cursor-pointer"
              >
                <div className="flex flex-col items-center gap-4">
                  <AvatarFrame frameId={frame.id as any} size="lg" animated>
                    {AVATAR_PRESETS[
                      Object.keys(AVATAR_PRESETS).find((k) =>
                        k.toLowerCase().includes(frame.id.split("-")[0]),
                      ) as keyof typeof AVATAR_PRESETS
                    ] || (
                      <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-2xl font-bold">
                        {frame.icon}
                      </div>
                    )}
                  </AvatarFrame>
                  <div className="text-center">
                    <h3 className="font-semibold text-lg">{frame.name}</h3>
                    <p className="text-sm text-gray-400">{frame.description}</p>
                    <div className="flex gap-2 justify-center mt-2">
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-700 capitalize">
                        {frame.rarity}
                      </span>
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-700 capitalize">
                        {frame.theme}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Section 2: Username Styles */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Zap className="w-8 h-8 text-cyan-400" />
            Username Styles
          </h2>
          <Card className="p-8 bg-gray-800 border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(USERNAME_STYLES).map(([key, style]) => (
                <div key={key} className="flex flex-col gap-4">
                  <div className="p-4 bg-gray-900 rounded-lg">
                    <UsernameText
                      username="Username"
                      styleId={key as any}
                      showTitle
                      customTitle={`${key.charAt(0).toUpperCase() + key.slice(1)} Member`}
                    />
                  </div>
                  <div className="text-sm text-gray-400">
                    Style ID: <code className="text-cyan-300">{key}</code>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">Sparkling Name Concepts</h2>
          <Card className="p-8 bg-gray-800 border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-white/10 bg-gray-900/70 p-4">
                <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">
                  Glow
                </p>
                <GlowingUsername
                  username="NebulaAdmin"
                  glowColor="red"
                  intensity="intense"
                />
              </div>
              <div className="rounded-2xl border border-white/10 bg-gray-900/70 p-4">
                <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">
                  Shimmer
                </p>
                <ShimmeringUsername username="CrystalVerified" duration={3} />
              </div>
              <div className="rounded-2xl border border-white/10 bg-gray-900/70 p-4">
                <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">
                  Holographic Plate
                </p>
                <HolographicNameplate
                  username="PrimeDeveloper"
                  styleId="developer"
                  subtitle="Sparkling Profile System"
                />
              </div>
            </div>
          </Card>
        </section>

        {/* Section 3: Role Badges */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Flame className="w-8 h-8 text-orange-400" />
            Role Badges
          </h2>
          <Card className="p-8 bg-gray-800 border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(ROLE_BADGES).map(([key, badge]) => (
                <div
                  key={key}
                  className="flex flex-col items-center gap-4 p-4 bg-gray-900 rounded-lg"
                >
                  <RoleBadge roleId={key as any} size="lg" animated />
                  <p className="text-xs text-gray-400 text-center">
                    {badge.label}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Section 4: Multiple Badges */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">Multiple Role Badges</h2>
          <Card className="p-8 bg-gray-800 border-gray-700">
            <div className="space-y-6">
              <div>
                <p className="text-gray-400 mb-3">User with 3 roles:</p>
                <RoleBadges
                  roleIds={["admin", "topContributor", "developer"]}
                  size="md"
                />
              </div>
              <div>
                <p className="text-gray-400 mb-3">
                  User with 5 roles (showing 3 + 2):
                </p>
                <RoleBadges
                  roleIds={[
                    "admin",
                    "moderator",
                    "topContributor",
                    "verified",
                    "developer",
                  ]}
                  size="md"
                  maxDisplay={3}
                />
              </div>
              <div>
                <p className="text-gray-400 mb-3">
                  User with premium + AI expert:
                </p>
                <RoleBadges roleIds={["vipMember", "aiExpert"]} size="lg" />
              </div>
            </div>
          </Card>
        </section>

        {/* Section 5: Premium Profile Cards */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">Premium Profile Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                username: "Admin User",
                role: "Community Administrator",
                frameType: "admin" as const,
                customTitle: "Platform Guardian",
                decorationType: "flame" as const,
              },
              {
                username: "Dev Master",
                role: "Lead Developer",
                frameType: "developer" as const,
                customTitle: "Code Architect",
                decorationType: "sparkles" as const,
              },
              {
                username: "Premium Star",
                role: "VIP Member",
                frameType: "premium" as const,
                customTitle: "Exclusive Member",
                decorationType: "aurora" as const,
              },
              {
                username: "AI Expert",
                role: "AI Specialist",
                frameType: "verified" as const,
                customTitle: "Machine Learning Expert",
                decorationType: "orbit" as const,
              },
            ].map((profile, idx) => (
              <PremiumProfileCard
                key={idx}
                username={profile.username}
                role={profile.role}
                frameType={profile.frameType}
                customTitle={profile.customTitle}
                decorationType={profile.decorationType}
              />
            ))}
          </div>
        </section>

        {/* Section 6: Profile Decorations */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">Profile Decorations</h2>
          <Card className="p-8 bg-gray-800 border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(
                [
                  "sparkles",
                  "shimmer",
                  "pulse",
                  "flame",
                  "aurora",
                  "orbit",
                ] as const
              ).map((type) => (
                <div key={type} className="flex flex-col items-center gap-4">
                  <ProfileDecoration type={type}>
                    <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg" />
                  </ProfileDecoration>
                  <p className="text-sm text-gray-400 capitalize">{type}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Section 7: Notification Badges */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">Notification Badges</h2>
          <Card className="p-8 bg-gray-800 border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center gap-4">
                <NotificationBadge count={3} variant="primary" />
                <p className="text-xs text-gray-400">Primary</p>
              </div>
              <div className="flex flex-col items-center gap-4">
                <NotificationBadge count={5} variant="success" />
                <p className="text-xs text-gray-400">Success</p>
              </div>
              <div className="flex flex-col items-center gap-4">
                <NotificationBadge count={2} variant="danger" />
                <p className="text-xs text-gray-400">Danger</p>
              </div>
              <div className="flex flex-col items-center gap-4">
                <NotificationBadge count={99} variant="warning" pulse={true} />
                <p className="text-xs text-gray-400">Warning</p>
              </div>
            </div>
          </Card>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">
            Premium Aura Effect Catalog
          </h2>
          <Card className="p-8 bg-gray-800 border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.values(PREMIUM_DECORATIONS).map((effect) => (
                <div
                  key={effect.id}
                  className="rounded-xl border border-white/10 bg-gray-900/70 px-3 py-2 text-center"
                >
                  <p className="text-sm text-slate-200">{effect.name}</p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    {effect.animationClass}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Section 8: Combined Example */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">Complete Profile Example</h2>
          <Card className="p-8 bg-gray-800 border-gray-700">
            <div className="flex flex-col md:flex-row items-start gap-8">
              {/* Avatar + Frame */}
              <div className="flex flex-col items-center gap-4">
                <AvatarFrame frameId="premium" size="xl" animated>
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-4xl font-bold text-white">
                    P
                  </div>
                </AvatarFrame>
                <NotificationBadge count={1} variant="danger" />
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="mb-4">
                  <UsernameText
                    username="Premium Member"
                    styleId="premium"
                    showTitle
                    customTitle="VIP Community Member"
                  />
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-400 mb-3">Roles</p>
                  <RoleBadges
                    roleIds={["vipMember", "topContributor", "verified"]}
                    size="sm"
                  />
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-3">Bio</p>
                  <p className="text-gray-300">
                    Active community member with premium status. Passionate
                    about contributing to the platform and helping other
                    members.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Footer */}
        <section className="pt-12 border-t border-gray-700">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Use</h3>
            <p className="text-gray-400 mb-6">
              All components are production-ready and optimized for dark mode
            </p>
            <div className="inline-block bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-3 rounded-lg font-semibold">
              ✨ Design System Complete
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
