"use client";

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/UserAvatar";
import { Username } from "@/components/community/Username";
import { useAuth } from "@/contexts/AuthContext";
import {
  AVATAR_FRAMES,
  getAllFrames,
  type AvatarFrameId,
  type RarityType,
} from "@/lib/designSystem";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronDown,
  Crown,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";

interface AvatarFrameShopProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userRole?: number | null;
  inventory?: string[] | null;
  currentFrameId?: AvatarFrameId | null;
  onFrameSelected?: (frameId: AvatarFrameId) => void;
}

const rarityOptions: Array<{ value: "all" | RarityType; label: string }> = [
  { value: "all", label: "Tất cả" },
  { value: "common", label: "Common" },
  { value: "uncommon", label: "Uncommon" },
  { value: "rare", label: "Rare" },
  { value: "epic", label: "Epic" },
  { value: "legendary", label: "Legendary" },
];

const rarityStyles: Record<RarityType, string> = {
  common: "border-slate-200 bg-slate-100 text-slate-600",
  uncommon: "border-emerald-200 bg-emerald-50 text-emerald-700",
  rare: "border-blue-200 bg-blue-50 text-blue-700",
  epic: "border-violet-200 bg-violet-50 text-violet-700",
  legendary: "border-amber-200 bg-amber-50 text-amber-700",
};

const themeStyles = {
  warm: "from-amber-500 to-rose-500",
  cool: "from-cyan-500 to-blue-600",
} as const;

// Per-frame card accent: [accentBarGradient, selectedBorderColor, selectedRingColor, hoverShadowColor]
const frameCardAccents: Record<string, [string, string, string, string]> = {
  admin:            ["from-rose-500 via-red-500 to-red-700",          "border-rose-400",    "ring-rose-200 dark:ring-rose-500/30",    "hover:shadow-rose-100 dark:hover:shadow-rose-900/30"],
  moderator:        ["from-amber-400 via-orange-500 to-orange-700",   "border-amber-400",   "ring-amber-200 dark:ring-amber-500/30",  "hover:shadow-amber-100 dark:hover:shadow-amber-900/30"],
  premium:          ["from-amber-300 via-yellow-400 to-amber-600",    "border-yellow-400",  "ring-yellow-200 dark:ring-yellow-500/30","hover:shadow-yellow-100 dark:hover:shadow-yellow-900/30"],
  "top-contributor":["from-pink-400 via-rose-500 to-fuchsia-600",     "border-pink-400",    "ring-pink-200 dark:ring-pink-500/30",    "hover:shadow-pink-100 dark:hover:shadow-pink-900/30"],
  verified:         ["from-cyan-300 via-sky-400 to-blue-600",          "border-cyan-400",    "ring-cyan-200 dark:ring-cyan-500/30",    "hover:shadow-cyan-100 dark:hover:shadow-cyan-900/30"],
  "vip-member":     ["from-violet-400 via-purple-500 to-indigo-700",  "border-violet-400",  "ring-violet-200 dark:ring-violet-500/30","hover:shadow-violet-100 dark:hover:shadow-violet-900/30"],
  "ai-expert":      ["from-slate-300 via-cyan-300 to-slate-500",      "border-cyan-300",    "ring-cyan-100 dark:ring-cyan-400/20",    "hover:shadow-cyan-100 dark:hover:shadow-slate-800/50"],
  developer:        ["from-sky-400 via-blue-500 to-cyan-600",          "border-sky-400",     "ring-sky-200 dark:ring-sky-500/30",      "hover:shadow-sky-100 dark:hover:shadow-sky-900/30"],
  "void-sovereign": ["from-fuchsia-400 via-violet-600 to-slate-950", "border-fuchsia-400", "ring-fuchsia-200 dark:ring-fuchsia-500/30","hover:shadow-fuchsia-100 dark:hover:shadow-fuchsia-900/30"],
  "inferno-core":   ["from-yellow-300 via-orange-500 to-red-800",     "border-orange-500",  "ring-orange-200 dark:ring-orange-500/30", "hover:shadow-orange-100 dark:hover:shadow-orange-900/30"],
  "frost-monarch":  ["from-white via-cyan-200 to-blue-700",           "border-blue-300",    "ring-blue-200 dark:ring-blue-400/30",    "hover:shadow-blue-100 dark:hover:shadow-blue-900/30"],
  "thunder-pulse":  ["from-yellow-300 via-cyan-300 to-blue-700",      "border-yellow-400",  "ring-yellow-200 dark:ring-yellow-400/30","hover:shadow-yellow-100 dark:hover:shadow-yellow-900/30"],
  "emerald-aegis":  ["from-emerald-300 via-green-500 to-teal-800",    "border-emerald-400", "ring-emerald-200 dark:ring-emerald-500/30","hover:shadow-emerald-100 dark:hover:shadow-emerald-900/30"],
  "arcane-rift":    ["from-pink-300 via-purple-500 to-indigo-800",    "border-purple-400",  "ring-purple-200 dark:ring-purple-500/30","hover:shadow-purple-100 dark:hover:shadow-purple-900/30"],
  "cyber-phantom":  ["from-lime-300 via-cyan-400 to-slate-900",       "border-lime-400",    "ring-lime-200 dark:ring-lime-400/30",    "hover:shadow-lime-100 dark:hover:shadow-lime-900/30"],
  "aurora-crown":   ["from-teal-200 via-fuchsia-300 to-indigo-700",   "border-fuchsia-300", "ring-fuchsia-100 dark:ring-fuchsia-400/30","hover:shadow-fuchsia-100 dark:hover:shadow-fuchsia-900/30"],
  "obsidian-eclipse":["from-zinc-950 via-stone-700 to-amber-400",    "border-amber-500",   "ring-amber-200 dark:ring-amber-500/30",  "hover:shadow-amber-100 dark:hover:shadow-amber-900/30"],
  "quantum-orbit":  ["from-sky-300 via-blue-500 to-violet-800",       "border-blue-400",    "ring-blue-200 dark:ring-blue-400/30",    "hover:shadow-blue-100 dark:hover:shadow-blue-900/30"],
  "ruby-overdrive": ["from-red-300 via-rose-600 to-fuchsia-900",      "border-rose-500",    "ring-rose-200 dark:ring-rose-500/30",    "hover:shadow-rose-100 dark:hover:shadow-rose-900/30"],
  "mythic-trophy":  ["from-yellow-200 via-amber-400 to-orange-700",   "border-amber-400",   "ring-amber-200 dark:ring-amber-400/30",  "hover:shadow-amber-100 dark:hover:shadow-amber-900/30"],
};

export const AvatarFrameShop: React.FC<AvatarFrameShopProps> = ({
  open,
  onOpenChange,
  userId,
  userRole,
  inventory = [],
  currentFrameId,
  onFrameSelected,
}) => {
  const { user } = useAuth();
  const [selectedFrame, setSelectedFrame] = useState<AvatarFrameId | null>(
    currentFrameId || null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRarity, setFilterRarity] = useState<"all" | RarityType>("all");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [profilePreview, setProfilePreview] = useState<{
    avatarUrl: string | null;
    userName: string;
  }>({ avatarUrl: null, userName: "User" });

  useEffect(() => {
    setSelectedFrame(currentFrameId || null);
    setMessage("");
  }, [currentFrameId, open]);

  useEffect(() => {
    if (!open || !userId) return;

    let mounted = true;

    const loadPreviewProfile = async () => {
      const { data } = await supabase
        .from("users")
        .select("full_name, avatar_url")
        .eq("id", userId)
        .single();

      if (!mounted) return;

      setProfilePreview({
        avatarUrl:
          data?.avatar_url ||
          (user?.user_metadata?.avatar_url as string | undefined) ||
          null,
        userName:
          data?.full_name?.trim() ||
          (user?.user_metadata?.full_name as string | undefined) ||
          (user?.user_metadata?.name as string | undefined) ||
          user?.email ||
          "User",
      });
    };

    void loadPreviewProfile();

    return () => {
      mounted = false;
    };
  }, [open, user?.email, user?.user_metadata, userId]);

  const isAdmin = userRole === 1;
  const userInventory = inventory || [];
  const ownedFrameIds = useMemo(
    () =>
      new Set(
        isAdmin
          ? getAllFrames().map((frame) => frame.id)
          : userInventory.filter((id): id is AvatarFrameId => id in AVATAR_FRAMES),
      ),
    [isAdmin, userInventory],
  );

  const rarityRank: Record<string, number> = {
    legendary: 0,
    epic: 1,
    rare: 2,
    uncommon: 3,
    common: 4,
  };

  const filteredFrames = useMemo(
    () =>
      getAllFrames()
        .filter((frame) => {
          const matchesSearch = frame.name
            .toLowerCase()
            .includes(searchTerm.trim().toLowerCase());
          const matchesRarity =
            filterRarity === "all" || frame.rarity === filterRarity;
          const isOwned = ownedFrameIds.has(frame.id);

          return matchesSearch && matchesRarity && isOwned;
        })
        .sort((a, b) => (rarityRank[a.rarity] ?? 9) - (rarityRank[b.rarity] ?? 9)),
    [filterRarity, ownedFrameIds, searchTerm],
  );

  const selectedFrameData = selectedFrame ? AVATAR_FRAMES[selectedFrame] : null;
  const activeTheme =
    selectedFrameData?.theme === "warm" ? themeStyles.warm : themeStyles.cool;

  const handleSelectFrame = async () => {
    if (!selectedFrame || !userId) return;

    try {
      setLoading(true);
      setMessage("");

      const { error } = await supabase
        .from("users")
        .update({ avatar_frame_id: selectedFrame })
        .eq("id", userId);

      if (error) throw error;

      setMessage("Đã cập nhật avatar frame.");
      onFrameSelected?.(selectedFrame);
      window.dispatchEvent(new Event("learning-hub:user-profile-updated"));

      setTimeout(() => {
        onOpenChange(false);
        setMessage("");
      }, 1000);
    } catch (error: any) {
      setMessage(`Không thể cập nhật frame: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-5xl overflow-hidden border-0 bg-white p-0 shadow-2xl shadow-slate-950/20 dark:bg-slate-950">
        <div className="grid max-h-[92vh] lg:grid-cols-[320px_minmax(0,1fr)]">
          <section
            className={cn(
              "relative flex min-h-[360px] flex-col justify-between bg-gradient-to-br p-6 text-white",
              activeTheme,
            )}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.18),transparent_20%)]" />
            <div className="relative">
              <DialogHeader>
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/18 backdrop-blur">
                  <Sparkles className="h-5 w-5" />
                </div>
                <DialogTitle className="text-2xl font-bold text-white">
                  Avatar Frame Shop
                </DialogTitle>
                <DialogDescription className="mt-2 text-sm leading-6 text-white/78">
                  Chọn khung avatar để làm nổi bật hồ sơ của bạn trong cộng
                  đồng Learning Hub.
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="relative mt-6 rounded-2xl border border-white/20 bg-white/14 p-5 backdrop-blur-md">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/60">
                Preview
              </p>
              {selectedFrameData ? (
                <div className="flex flex-col items-center gap-4">
                  {/* Avatar centered */}
                  <UserAvatar
                    userId={userId}
                    avatarUrl={profilePreview.avatarUrl || undefined}
                    userName={profilePreview.userName}
                    frameId={selectedFrame}
                    size="xl"
                    animated={true}
                    showFrameEffects={true}
                    className="avatar-frame-shop-preview"
                  />
                  {/* Info below */}
                  <div className="w-full text-center">
                    <div className="text-lg font-bold leading-tight">
                      <Username
                        userId={userId}
                        name={profilePreview.userName}
                        frameId={selectedFrame}
                        className="text-lg"
                      />
                    </div>
                    <p className="mt-1 text-sm font-semibold text-white/75">
                      {selectedFrameData.name}
                    </p>
                    <p className="mt-1.5 text-xs leading-5 text-white/60">
                      {selectedFrameData.description}
                    </p>
                    <div className="mt-3 flex flex-wrap justify-center gap-2">
                      <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold capitalize">
                        {selectedFrameData.icon} {selectedFrameData.rarity}
                      </span>
                      <span className="rounded-full bg-white/14 px-3 py-1 text-xs font-semibold capitalize">
                        {selectedFrameData.theme}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 py-4 text-center text-sm text-white/60">
                  <Sparkles className="h-8 w-8 opacity-40" />
                  Chọn một frame để xem trước.
                </div>
              )}
            </div>
          </section>

          <section className="flex min-h-0 flex-col bg-slate-50 dark:bg-slate-950">
            <div className="border-b border-slate-200 bg-white px-5 py-4 dark:border-white/10 dark:bg-slate-900">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                    Bộ sưu tập của bạn
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {isAdmin
                      ? "Admin có thể xem và dùng toàn bộ frame."
                      : `${ownedFrameIds.size} frame đã mở khóa.`}
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-200">
                  {isAdmin ? (
                    <Crown className="h-4 w-4" />
                  ) : (
                    <ShieldCheck className="h-4 w-4" />
                  )}
                  {isAdmin ? "Full access" : "Inventory only"}
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_180px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Tìm kiếm frame..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 text-slate-950 placeholder:text-slate-400 focus-visible:ring-cyan-500 dark:border-white/10 dark:bg-slate-950 dark:text-white"
                  />
                </div>
                <div className="relative">
                  <select
                    value={filterRarity}
                    onChange={(e) =>
                      setFilterRarity(e.target.value as "all" | RarityType)
                    }
                    aria-label="Lọc frame theo độ hiếm"
                    className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 pr-9 text-sm font-medium text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 dark:border-white/10 dark:bg-slate-950 dark:text-slate-100"
                  >
                    {rarityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>

            {message ? (
              <div
                className={cn(
                  "mx-5 mt-4 rounded-xl border px-4 py-3 text-sm font-medium",
                  message.startsWith("Đã")
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200"
                    : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200",
                )}
              >
                {message}
              </div>
            ) : null}

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6">
              {filteredFrames.length > 0 ? (
                <div className="grid grid-cols-1 gap-x-3 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredFrames.map((frame) => {
                    const frameId = frame.id as AvatarFrameId;
                    const selected = selectedFrame === frameId;
                    const active = currentFrameId === frameId;
                    const accent = frameCardAccents[frame.id] ?? [
                      "from-slate-400 to-slate-600",
                      "border-slate-400",
                      "ring-slate-200 dark:ring-slate-500/30",
                      "hover:shadow-slate-100 dark:hover:shadow-black/30",
                    ];
                    const [accentBar, selBorder, selRing, hoverShadow] = accent;

                    return (
                      <button
                        key={frame.id}
                        type="button"
                        onClick={() => setSelectedFrame(frameId)}
                        className={cn(
                          "group relative overflow-visible rounded-2xl border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-slate-900",
                          hoverShadow,
                          selected
                            ? cn(selBorder, "ring-2", selRing)
                            : "border-slate-200 dark:border-white/10",
                        )}
                      >
                        {/* Per-frame unique accent bar */}
                        <div
                          className={cn(
                            "absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r opacity-0 transition group-hover:opacity-100",
                            accentBar,
                            selected && "opacity-100",
                          )}
                        />

                        <div className="flex items-start justify-between gap-3">
                          <div className="shrink-0 p-3">
                            <UserAvatar
                              userId={userId}
                              avatarUrl={profilePreview.avatarUrl || undefined}
                              userName={profilePreview.userName}
                              frameId={frameId}
                              size="lg"
                              animated={true}
                              showFrameEffects={true}
                              className="avatar-frame-shop-preview"
                            />
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {active ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500 px-2 py-1 text-[11px] font-semibold text-white">
                                <Star className="h-3 w-3" />
                                Đang dùng
                              </span>
                            ) : null}
                            {selected ? (
                              <span
                                className={cn(
                                  "flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br text-white",
                                  accentBar,
                                )}
                              >
                                <Check className="h-4 w-4" />
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <div className="mt-4 line-clamp-1 text-sm font-bold">
                          <Username
                            userId={userId}
                            name={profilePreview.userName}
                            frameId={frameId}
                            className="text-sm"
                          />
                        </div>
                        <h3 className="mt-1 line-clamp-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {frame.name}
                        </h3>
                        <p className="mt-1 line-clamp-2 min-h-10 text-xs leading-5 text-slate-500 dark:text-slate-400">
                          {frame.description}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {/* Icon badge riêng của từng frame */}
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-semibold",
                              rarityStyles[frame.rarity],
                            )}
                          >
                            <span className="text-[10px]">{frame.icon}</span>
                            <span className="capitalize">{frame.rarity}</span>
                          </span>
                          <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold capitalize text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                            {frame.theme}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-white/10 dark:bg-slate-900">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-white/10">
                    <Sparkles className="h-8 w-8" />
                  </div>
                  <h3 className="text-base font-bold text-slate-950 dark:text-white">
                    Chưa có frame phù hợp
                  </h3>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Thử đổi bộ lọc hoặc tham gia thêm hoạt động cộng đồng để mở
                    khóa frame mới.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 bg-white p-5 sm:flex-row dark:border-white/10 dark:bg-slate-900">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-11 flex-1 rounded-xl"
              >
                Hủy
              </Button>
              <Button
                onClick={handleSelectFrame}
                disabled={!selectedFrame || loading}
                className="h-11 flex-1 rounded-xl bg-slate-950 text-white hover:bg-cyan-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
              >
                {loading ? "Đang lưu..." : "Dùng frame này"}
              </Button>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};
