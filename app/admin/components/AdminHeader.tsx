"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CheckCheck,
  ChevronDown,
  MessageCircle,
  MessageSquare,
  RefreshCcw,
  ShieldCheck,
  User,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useFeedback } from "@/hooks/useFeedback";
import { useConversations } from "@/hooks/useConversations";

type AdminNotification = {
  id: string;
  type: "feedback" | "message";
  title: string;
  description: string;
  href: string;
  createdAt: string;
};

const STORAGE_KEY = "admin_notification_seen_ids";

interface AdminHeaderProps {
  title: string;
  description?: string;
}

function formatRelativeTime(input: string) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.RelativeTimeFormat("vi", { numeric: "auto" }).format(
    -Math.round((Date.now() - date.getTime()) / 60000),
    "minute",
  );
}

export default function AdminHeader({ title, description }: AdminHeaderProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { feedback, refetch: refetchFeedback } = useFeedback();
  const { conversations, refetch: refetchConversations } = useConversations();
  const [seenIds, setSeenIds] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setSeenIds(parsed.filter((item) => typeof item === "string"));
      }
    } catch {
      setSeenIds([]);
    }
  }, []);

  const notifications = useMemo<AdminNotification[]>(() => {
    const pendingFeedback = feedback
      .filter((item) => item.status === "pending")
      .slice(0, 6)
      .map((item) => ({
        id: `feedback:${item.id}`,
        type: "feedback" as const,
        title: "Phản hồi mới cần xử lý",
        description: item.subject,
        href: "/admin/feedback",
        createdAt: item.created_at,
      }));

    const unreadMessages = conversations
      .filter((conv) => conv.unread_count > 0)
      .slice(0, 6)
      .map((conv) => ({
        id: `message:${conv.id}:${conv.last_message_at}`,
        type: "message" as const,
        title: `${conv.unread_count} tin nhắn chưa đọc`,
        description: conv.user?.full_name || conv.user?.email || "Người dùng",
        href: "/admin/messages",
        createdAt: conv.last_message_at,
      }));

    return [...pendingFeedback, ...unreadMessages]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 10);
  }, [feedback, conversations]);

  const unreadCount = notifications.filter(
    (item) => !seenIds.includes(item.id),
  ).length;

  const persistSeenIds = (ids: string[]) => {
    setSeenIds(ids);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids.slice(-200)));
    }
  };

  const markOneAsSeen = (id: string) => {
    if (seenIds.includes(id)) return;
    persistSeenIds([...seenIds, id]);
  };

  const markAllAsSeen = () => {
    persistSeenIds(notifications.map((item) => item.id));
  };

  const handleRefresh = async () => {
    await Promise.all([refetchFeedback(), refetchConversations()]);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-20 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/80">
      <div className="flex min-h-16 items-center gap-4 px-4 py-3 md:px-6">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white md:text-2xl">
              {title}
            </h1>
            <Badge className="rounded-full bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
              <ShieldCheck className="mr-1 h-3.5 w-3.5" />
              Admin
            </Badge>
          </div>
          {description && (
            <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative rounded-xl">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[340px] p-0">
              <DropdownMenuLabel className="flex items-center justify-between px-3 py-2.5">
                <span className="font-semibold">Thông báo quản trị</span>
                {notifications.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 px-2 text-xs"
                    onClick={markAllAsSeen}
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    Đã đọc hết
                  </Button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {notifications.length === 0 && (
                <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                  Không có thông báo mới
                </div>
              )}

              {notifications.map((item) => {
                const isSeen = seenIds.includes(item.id);

                return (
                  <DropdownMenuItem
                    key={item.id}
                    className="cursor-pointer items-start gap-3 rounded-none px-3 py-3"
                    onSelect={() => {
                      markOneAsSeen(item.id);
                      router.push(item.href);
                    }}
                  >
                    <div className="mt-0.5">
                      {item.type === "feedback" ? (
                        <MessageSquare className="h-4 w-4 text-blue-500" />
                      ) : (
                        <MessageCircle className="h-4 w-4 text-emerald-500" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm font-medium">
                        {item.title}
                      </p>
                      <p className="line-clamp-1 text-xs text-muted-foreground">
                        {item.description}
                      </p>
                      <p className="mt-1 text-[11px] text-muted-foreground/80">
                        {formatRelativeTime(item.createdAt)}
                      </p>
                    </div>
                    {!isSeen && (
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                    )}
                  </DropdownMenuItem>
                );
              })}

              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer gap-2 px-3 py-2.5"
                onSelect={() => {
                  void handleRefresh();
                }}
              >
                <RefreshCcw className="h-4 w-4" />
                Làm mới thông báo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="max-w-[260px] gap-2 rounded-xl">
                <User className="h-4.5 w-4.5" />
                <span className="truncate text-sm">
                  {user?.email || "admin@learninghub.local"}
                </span>
                <ChevronDown className="h-4 w-4 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel>Tài khoản quản trị</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                Hồ sơ cá nhân
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/")}>
                Về trang người dùng
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
