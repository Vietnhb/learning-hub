import {
  Bell,
  CheckCheck,
  Flame,
  MessageSquare,
  MessagesSquare,
  Zap,
  ShieldCheck,
  AtSign,
  Sparkles,
} from "lucide-react";
import { RefObject } from "react";
import { Avatar } from "../shared/Avatar";
import { Username } from "@/components/community/Username";
import { HubCard } from "../shared/HubCard";
import { ActiveMember } from "../../types";
import { formatTimeAgo } from "../../utils/formatters";
import { cn } from "@/lib/utils";
import { UserNotification } from "@/hooks/useUserNotifications";

export function RightSidebar({
  notificationRef,
  unreadCount,
  notifications,
  dismissNotification,
  markAllAsSeen,
  trendingTopics,
  activeMembers,
  isOnline,
}: {
  notificationRef: RefObject<HTMLElement>;
  unreadCount: number;
  notifications: UserNotification[];
  dismissNotification: (id: string) => Promise<void>;
  markAllAsSeen: () => void;
  trendingTopics: Array<{ tag: string; count: number }>;
  activeMembers: ActiveMember[];
  isOnline: (id: string) => boolean;
}) {
  return (
    <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
      <HubCard ref={notificationRef} className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-500" />
            <h2 className="font-semibold">Notification Center</h2>
          </div>
          {unreadCount > 0 ? (
            <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs text-white">
              {unreadCount}
            </span>
          ) : null}
        </div>

        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="rounded-2xl bg-slate-100/70 px-3 py-6 text-center text-sm text-slate-500 dark:bg-white/[0.06] dark:text-slate-400">
              Chưa có thông báo mới
            </div>
          ) : null}

          {notifications.length > 0 ? (
            <button
              type="button"
              onClick={markAllAsSeen}
              className="mb-1 inline-flex items-center gap-2 rounded-xl px-2 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-50 dark:text-cyan-300 dark:hover:bg-cyan-400/10"
            >
              <CheckCheck className="h-4 w-4" />
              Đánh dấu đã đọc
            </button>
          ) : null}

          {notifications.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={() => void dismissNotification(item.id)}
              className="group flex gap-3 rounded-2xl p-2 transition hover:bg-slate-100 dark:hover:bg-white/10"
            >
              <div className="mt-0.5 rounded-xl bg-white p-2 shadow-sm dark:bg-white/10">
                {item.type === "feedback" ? (
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                ) : item.type === "reward" ? (
                  <Sparkles className="h-4 w-4 text-amber-500" />
                ) : (
                  <MessagesSquare className="h-4 w-4 text-emerald-500" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="line-clamp-1 text-sm font-medium">
                    {item.title}
                  </p>
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                </div>
                <p className="line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  {item.description}
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  {formatTimeAgo(item.createdAt)}
                </p>
              </div>
            </a>
          ))}
        </div>
      </HubCard>

      <HubCard className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          <h2 className="font-semibold">Trending Topics</h2>
        </div>
        <div className="space-y-2">
          {trendingTopics.map((topic) => (
            <div
              key={topic.tag}
              className="flex items-center justify-between rounded-2xl bg-slate-100/80 px-3 py-2 transition hover:bg-cyan-50 dark:bg-white/[0.06] dark:hover:bg-cyan-400/10"
            >
              <span className="font-medium text-slate-800 dark:text-slate-100">
                {topic.tag}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {topic.count}
              </span>
            </div>
          ))}
        </div>
      </HubCard>

      <HubCard className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-emerald-500" />
          <h2 className="font-semibold">Active Members</h2>
        </div>
        <div className="space-y-3">
          {activeMembers.slice(0, 6).map((member, index) => (
            <div key={member.key} className="flex items-center gap-3">
              <Avatar
                name={member.name}
                src={member.avatar}
                userId={member.userId}
                size="sm"
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">
                  <Username userId={member.userId} name={member.name} />
                </div>
                  {/* Premium Role Badge */}
                  <div className={cn(
                    "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm",
                    index === 0 
                      ? "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-[0_0_10px_rgba(245,158,11,0.4)]"
                      : member.badge === "Active now"
                        ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                        : "bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400"
                  )}>
                    {index === 0 ? (
                      <ShieldCheck className="h-2.5 w-2.5" />
                    ) : member.badge === "Active now" ? (
                      <Zap className="h-2.5 w-2.5" />
                    ) : (
                      <AtSign className="h-2.5 w-2.5" />
                    )}
                    {index === 0 ? "Top Contributor" : member.badge}
                  </div>
                </div>
              </div>
          ))}
        </div>
      </HubCard>
    </aside>
  );
}
