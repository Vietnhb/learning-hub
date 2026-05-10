import { Users, Plus, ImageIcon, Reply, Bell } from "lucide-react";
import { RefObject } from "react";
import { Avatar } from "../shared/Avatar";
import { HubCard } from "../shared/HubCard";
import { ActiveMember } from "../../types";

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
              size="sm"
              online={Boolean(member.userId && isOnline(member.userId))}
            />
          ))}
        </div>

        <div className="mt-5 rounded-2xl bg-slate-100/80 px-4 py-3 text-sm text-slate-600 dark:bg-white/[0.06] dark:text-slate-300">
          {connectionStatus === "connected"
            ? "Hub đang Online."
            : "Đang đồng bộ trạng thái online..."}
        </div>
      </HubCard>

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
    </aside>
  );
}
