import { Bell, Flame, Zap, ShieldCheck, AtSign } from "lucide-react";
import { RefObject, ReactNode } from "react";
import { Avatar } from "../shared/Avatar";
import { Username } from "@/components/community/Username";
import { HubCard } from "../shared/HubCard";
import { ActiveMember } from "../../types";
import { formatTimeAgo } from "../../utils/formatters";

export function RightSidebar({
  notificationRef,
  unreadCount,
  communityNotifications,
  trendingTopics,
  activeMembers,
  isOnline,
}: {
  notificationRef: RefObject<HTMLElement>;
  unreadCount: number;
  communityNotifications: Array<{
    id: string;
    icon: ReactNode;
    title: string;
    description: string;
    createdAt?: string | null;
    href: string;
  }>;
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
          {communityNotifications.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="group flex gap-3 rounded-2xl p-2 transition hover:bg-slate-100 dark:hover:bg-white/10"
            >
              <div className="mt-0.5 rounded-xl bg-white p-2 shadow-sm dark:bg-white/10">
                {item.icon}
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
                size="sm"
                online={Boolean(member.userId && isOnline(member.userId))}
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">
                  <Username userId={member.userId} name={member.name} />
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  {index === 0 ? (
                    <ShieldCheck className="h-3 w-3 text-amber-500" />
                  ) : member.badge === "Active now" ? (
                    <Zap className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <AtSign className="h-3 w-3" />
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
