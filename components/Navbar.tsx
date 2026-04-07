"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bell,
  Home,
  BookOpen,
  Library,
  FolderOpen,
  GraduationCap,
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
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <GraduationCap className="w-7 h-7" />
            Learning Hub
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:scale-110"
            >
              <Home className="w-4 h-4" />
              Trang chủ
            </Link>
            <Link
              href="/resources"
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:scale-110"
            >
              <Library className="w-4 h-4" />
              Tài nguyên
            </Link>
            <Link
              href="/courses"
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:scale-110"
            >
              <BookOpen className="w-4 h-4" />
              Khóa học
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:scale-110"
            >
              <FolderOpen className="w-4 h-4" />
              Giới thiệu
            </Link>

            {user && (
              <>
                <Link
                  href="/feedback"
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:scale-110"
                >
                  <MessageSquare className="w-4 h-4" />
                  Feedback
                </Link>
              </>
            )}

            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:scale-110"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            )}

            <ThemeToggle />

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5" />
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
                          <p className="line-clamp-1 text-sm font-medium">
                            {item.title}
                          </p>
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

            <div className="ml-4 pl-4 border-l border-gray-300 dark:border-gray-600 dark:border-gray-600">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              ) : user ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium hover:text-blue-600 dark:hover:text-blue-400">
                      {user.user_metadata?.full_name || user.email}
                    </span>
                  </Link>
                  <Button
                    onClick={signOut}
                    variant="outline"
                    size="sm"
                    className="gap-1 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng xuất
                  </Button>
                </div>
              ) : (
                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <LogIn className="w-4 h-4" />
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
