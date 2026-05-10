import { Users, Plus, ImageIcon, Reply, Bell, Palette, Sparkles } from "lucide-react";
import { RefObject, useState, useEffect } from "react";
import { Avatar } from "../shared/Avatar";
import { HubCard } from "../shared/HubCard";
import { ActiveMember } from "../../types";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { AvatarFrameShop } from "@/components/community/AvatarFrameShop";
import { AVATAR_FRAMES, type AvatarFrameId } from "@/lib/designSystem";

export function LeftSidebar({
  displayedOnlineCount,
  visibleOnlineMembers,
  isOnline,
  connectionStatus,
  scrollToPostComposer,
  triggerImageUpload,
  focusChat,
  notificationRef,
  unreadCount,
}: {
  displayedOnlineCount: number;
  visibleOnlineMembers: ActiveMember[];
  isOnline: (id: string) => boolean;
  connectionStatus: string;
  scrollToPostComposer: () => void;
  triggerImageUpload: () => void;
  focusChat: () => void;
  notificationRef: RefObject<HTMLElement>;
  unreadCount: number;
}) {
  const { user } = useAuth();
  const [showFrameShop, setShowFrameShop] = useState(false);
  const [currentFrameId, setCurrentFrameId] = useState<AvatarFrameId | null>(null);
  const [userRole, setUserRole] = useState<number | null>(null);
  const [inventory, setInventory] = useState<string[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("users")
        .select("avatar_frame_id, role_id, avatar_frames_inventory")
        .eq("id", user.id)
        .single();
      setCurrentFrameId(data?.avatar_frame_id || null);
      setUserRole(data?.role_id || null);
      setInventory(data?.avatar_frames_inventory || []);
    };

    fetchUserData();

    // Subscribe to profile updates
    const handleUpdate = () => fetchUserData();
    window.addEventListener("learning-hub:user-profile-updated", handleUpdate);
    return () => window.removeEventListener("learning-hub:user-profile-updated", handleUpdate);
  }, [user]);

  return (
    <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
      <HubCard className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Online now
            </p>
            <div className="mt-1 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_5px_rgba(16,185,129,0.16)]" />
              <span className="text-2xl font-bold">
                {displayedOnlineCount}
              </span>
            </div>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-5 flex -space-x-2">
          {visibleOnlineMembers.slice(0, 6).map((member) => (
            <Avatar
              key={member.key}
              name={member.name}
              src={member.avatar}
              userId={member.userId}
              size="sm"
            />
          ))}
        </div>

        <div className="mt-5 rounded-2xl bg-slate-100/80 px-4 py-3 text-sm text-slate-600 dark:bg-white/[0.06] dark:text-slate-300">
          {connectionStatus === "connected"
            ? "Hub đang Online."
            : "Đang đồng bộ trạng thái online..."}
        </div>
      </HubCard>

      {/* Avatar Frame Shop Card */}
      {user && (
        <HubCard className="p-4 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border-cyan-500/20">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-cyan-100 p-2 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400">
              <Palette className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                Kho Avatar Frames
                <Sparkles className="h-3 w-3 text-amber-400 animate-pulse" />
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                {currentFrameId 
                  ? `Đang dùng: ${AVATAR_FRAMES[currentFrameId]?.name || currentFrameId}`
                  : "Chưa chọn khung đại diện"}
              </p>
              <button
                type="button"
                onClick={() => setShowFrameShop(true)}
                className="mt-2.5 w-full rounded-xl bg-cyan-500 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-cyan-600 active:scale-95"
              >
                Mở Kho Frames
              </button>
            </div>
          </div>
        </HubCard>
      )}

      <HubCard className="p-3">
        <button
          type="button"
          onClick={scrollToPostComposer}
          className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium transition hover:bg-slate-100 dark:hover:bg-white/10"
        >
          <Plus className="h-4 w-4 text-cyan-500" />
          Create Post
        </button>
        <button
          type="button"
          onClick={triggerImageUpload}
          className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium transition hover:bg-slate-100 dark:hover:bg-white/10"
        >
          <ImageIcon className="h-4 w-4 text-violet-500" />
          Upload Image
        </button>
        <button
          type="button"
          onClick={focusChat}
          className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium transition hover:bg-slate-100 dark:hover:bg-white/10"
        >
          <Reply className="h-4 w-4 text-emerald-500" />
          Start Discussion
        </button>
        <button
          type="button"
          onClick={() =>
            notificationRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            })
          }
          className="flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm font-medium transition hover:bg-slate-100 dark:hover:bg-white/10"
        >
          <span className="inline-flex items-center gap-3">
            <Bell className="h-4 w-4 text-amber-500" />
            Notifications
          </span>
          {unreadCount > 0 ? (
            <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          ) : null}
        </button>
      </HubCard>

      {/* Avatar Frame Shop Modal */}
      {user && (
        <AvatarFrameShop
          open={showFrameShop}
          onOpenChange={setShowFrameShop}
          userId={user.id}
          userRole={userRole}
          inventory={inventory}
          currentFrameId={currentFrameId}
          onFrameSelected={(frameId) => {
            setCurrentFrameId(frameId);
          }}
        />
      )}
    </aside>
  );
}
