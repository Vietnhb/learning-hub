"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bell,
  Home,
  BookOpen,
  Library,
  FolderOpen,
  User,
  LogOut,
  LogIn,
  LayoutDashboard,
  MessageSquare,
  MessagesSquare,
  CheckCheck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { isUserAdmin } from "@/lib/authHelper";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useUserNotifications } from "@/hooks/useUserNotifications";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const [profileDisplayName, setProfileDisplayName] = useState<string | null>(
    null,
  );
  const { notifications } = useUserNotifications(user?.id);

  useEffect(() => {
    let mounted = true;

    async function checkAdmin() {
      if (!user) {
        if (mounted) setIsAdmin(false);
        return;
      }

      const adminStatus = await isUserAdmin();
      if (mounted) setIsAdmin(adminStatus);
    }

    void checkAdmin();

    return () => {
      mounted = false;
    };
  }, [user]);

  useEffect(() => {
    let mounted = true;

    const loadProfileDisplayName = async () => {
      if (!user?.id) {
        setProfileDisplayName(null);
        return;
      }

      const { data } = await supabase
        .from("users")
        .select("full_name")
        .eq("id", user.id)
        .single();

      if (!mounted) return;

      setProfileDisplayName(data?.full_name?.trim() || null);
    };

    void loadProfileDisplayName();

    const handleProfileUpdated = () => {
      void loadProfileDisplayName();
    };

    window.addEventListener("learning-hub:user-profile-updated", handleProfileUpdated);

    return () => {
      mounted = false;
      window.removeEventListener(
        "learning-hub:user-profile-updated",
        handleProfileUpdated,
      );
    };
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) {
      setHiddenIds([]);
      return;
    }

    const raw = window.localStorage.getItem(
      `user_notification_hidden_ids:${user.id}`,
    );
    if (!raw) {
      setHiddenIds([]);
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setHiddenIds(parsed.filter((item) => typeof item === "string"));
      }
    } catch {
      setHiddenIds([]);
    }
  }, [user?.id]);

  const persistHiddenIds = (ids: string[]) => {
    const deduped = Array.from(new Set(ids)).slice(-200);
    setHiddenIds(deduped);
    if (user?.id) {
      window.localStorage.setItem(
        `user_notification_hidden_ids:${user.id}`,
        JSON.stringify(deduped),
      );
    }
  };

  const visibleNotifications = useMemo(
    () => notifications.filter((item) => !hiddenIds.includes(item.id)),
    [notifications, hiddenIds],
  );

  const dismissNotification = async (id: string) => {
    if (hiddenIds.includes(id)) return;
    persistHiddenIds([...hiddenIds, id]);

    if (!user?.id || !id.startsWith("message:")) return;

    const messageId = id.replace("message:", "");
    await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("id", messageId)
      .eq("receiver_id", user.id);
  };

  const markAllAsSeen = () => {
    const toHide = visibleNotifications.map((item) => item.id);
    persistHiddenIds([...hiddenIds, ...toHide]);

    if (!user?.id) return;

    const messageIds = visibleNotifications
      .filter((item) => item.type === "message")
      .map((item) => item.id.replace("message:", ""));

    if (messageIds.length > 0) {
      void supabase
        .from("messages")
        .update({ is_read: true })
        .in("id", messageIds)
        .eq("receiver_id", user.id);
    }
  };

  const unreadCount = useMemo(
    () => visibleNotifications.filter((item) => item.isUnread).length,
    [visibleNotifications],
  );

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 shadow-md backdrop-blur-md dark:border-gray-700 dark:bg-gray-800/80"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 whitespace-nowrap text-xl font-bold text-gray-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400 lg:text-2xl"
          >
            <img
              src="/android-chrome-192x192.png"
              alt=""
              aria-hidden="true"
              className="h-9 w-9 rounded-md bg-white object-contain p-0.5 shadow-sm"
            />
            <span>Learning Hub</span>
          </Link>

          <div className="flex items-center gap-2 lg:gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 whitespace-nowrap px-1 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            >
              <Home className="h-4 w-4" />
              Trang chủ
            </Link>
            <Link
              href="/resources"
              className="flex items-center gap-1.5 whitespace-nowrap px-1 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            >
              <Library className="h-4 w-4" />
              Tài nguyên
            </Link>
            <Link
              href="/courses"
              className="flex items-center gap-1.5 whitespace-nowrap px-1 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            >
              <BookOpen className="h-4 w-4" />
              Khóa học
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-1.5 whitespace-nowrap px-1 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            >
              <FolderOpen className="h-4 w-4" />
              Giới thiệu
            </Link>

            {user && (
              <Link
                href="/feedback"
                className="flex items-center gap-1.5 whitespace-nowrap px-1 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              >
                <MessageSquare className="h-4 w-4" />
                Feedback
              </Link>
            )}

            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 whitespace-nowrap px-1 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            )}

            <ThemeToggle />

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Thông báo</span>
                    {visibleNotifications.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={markAllAsSeen}
                      >
                        <CheckCheck className="mr-1 h-3.5 w-3.5" />
                        Đánh dấu đã đọc
                      </Button>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {visibleNotifications.length === 0 && (
                    <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                      Chưa có thông báo mới
                    </div>
                  )}

                  {visibleNotifications.map((item) => {
                    return (
                      <DropdownMenuItem
                        key={item.id}
                        className="cursor-pointer items-start gap-3 py-3"
                        onSelect={async () => {
                          await dismissNotification(item.id);
                          router.push(item.href);
                        }}
                      >
                        <div className="mt-0.5">
                          {item.type === "feedback" ? (
                            <MessageSquare className="h-4 w-4 text-blue-500" />
                          ) : (
                            <MessagesSquare className="h-4 w-4 text-emerald-500" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-1 text-sm font-medium">{item.title}</p>
                          <p className="line-clamp-1 text-xs text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                        <span className="mt-1 h-2 w-2 rounded-full bg-primary"></span>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <div className="ml-2 border-l border-gray-300 pl-3 dark:border-gray-600">
              {loading ? (
                <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
              ) : user ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/profile"
                    className="flex items-center gap-1.5 text-sm transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="max-w-[120px] truncate whitespace-nowrap font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                      {profileDisplayName || user.email}
                    </span>
                  </Link>
                  <Button
                    onClick={signOut}
                    variant="outline"
                    size="sm"
                    className="gap-1 hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:hover:border-red-700 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                  >
                    <LogOut className="h-4 w-4" />
                    Đăng xuất
                  </Button>
                </div>
              ) : (
                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
                  >
                    <LogIn className="h-4 w-4" />
                    Đăng nhập
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
