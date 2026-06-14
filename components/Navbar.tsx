"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Bell,
  CheckCheck,
  FolderOpen,
  Home,
  LayoutDashboard,
  Library,
  LogIn,
  LogOut,
  Menu,
  MessageSquare,
  MessagesSquare,
  Sparkles,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NavbarAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useUserNotifications } from "@/hooks/useUserNotifications";
import { isUserAdmin } from "@/lib/authHelper";
import { supabase } from "@/lib/supabase";

type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const navLinks: NavLink[] = [
  { href: "/", label: "Trang chủ", icon: Home },
  { href: "/resources", label: "Tài nguyên", icon: Library },
  { href: "/forum", label: "Diễn đàn", icon: MessagesSquare },
  { href: "/about", label: "Giới thiệu", icon: FolderOpen },
];

const navLinkClass =
  "flex items-center gap-1.5 whitespace-nowrap px-1 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400";

export default function Navbar() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileDisplayName, setProfileDisplayName] = useState<string | null>(
    null,
  );
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const {
    visibleNotifications,
    unreadCount,
    dismissNotification,
    markAllAsSeen,
  } = useUserNotifications(user?.id);

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
        setAvatarUrl(null);
        return;
      }

      const { data } = await supabase
        .from("users")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .single();

      if (!mounted) return;

      setProfileDisplayName(data?.full_name?.trim() || null);
      if (data?.avatar_url) {
        setAvatarUrl(data.avatar_url);
      } else {
        setAvatarUrl(user?.user_metadata?.avatar_url || null);
      }
    };

    void loadProfileDisplayName();

    const handleProfileUpdated = () => {
      void loadProfileDisplayName();
    };

    window.addEventListener(
      "learning-hub:user-profile-updated",
      handleProfileUpdated,
    );

    return () => {
      mounted = false;
      window.removeEventListener(
        "learning-hub:user-profile-updated",
        handleProfileUpdated,
      );
    };
  }, [user?.id]);

  const profileName = profileDisplayName || user?.email || "User";

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 shadow-md backdrop-blur-md dark:border-gray-700 dark:bg-gray-800/80"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          <Link
            href="/"
            className="flex min-w-0 shrink-0 items-center gap-2 whitespace-nowrap text-xl font-bold text-gray-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400 lg:text-2xl"
          >
            <img
              src="/android-chrome-192x192.png"
              alt=""
              aria-hidden="true"
              className="h-9 w-9 rounded-md bg-white object-contain p-0.5 shadow-sm"
            />
            <span>Learning Hub</span>
          </Link>

          <div className="hidden items-center gap-2 md:flex lg:gap-3">
            {navLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link key={item.href} href={item.href} className={navLinkClass}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}

            {user && (
              <Link href="/feedback" className={navLinkClass}>
                <MessageSquare className="h-4 w-4" />
                Feedback
              </Link>
            )}

            {isAdmin && (
              <Link href="/admin" className={navLinkClass}>
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
                        Đã đọc
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
                          ) : item.type === "reward" ? (
                            <Sparkles className="h-4 w-4 text-amber-500" />
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

            <div className="ml-2 border-l border-gray-300 pl-3 dark:border-gray-600">
              {loading ? (
                <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
              ) : user ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <NavbarAvatar
                      userId={user.id}
                      avatarUrl={avatarUrl || undefined}
                      userName={profileName}
                    />
                    <span className="max-w-[120px] truncate whitespace-nowrap text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                      {profileName}
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

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Mở menu điều hướng"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel>Menu</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {navLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="gap-2">
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}

                {user && (
                  <DropdownMenuItem asChild>
                    <Link href="/feedback" className="gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Feedback
                    </Link>
                  </DropdownMenuItem>
                )}

                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                {loading ? (
                  <DropdownMenuItem disabled>Đang tải...</DropdownMenuItem>
                ) : user ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="gap-2">
                        <User className="h-4 w-4" />
                        Hồ sơ
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="gap-2 text-red-600 focus:text-red-600"
                      onSelect={(event) => {
                        event.preventDefault();
                        void signOut();
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Đăng xuất
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link href="/auth/login" className="gap-2">
                      <LogIn className="h-4 w-4" />
                      Đăng nhập
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
