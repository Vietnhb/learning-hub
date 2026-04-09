"use client";

import React, { useMemo, useState } from "react";
import AdminHeader from "../components/AdminHeader";
import UserTable from "@/components/admin/UserTable";
import { useUsers } from "@/hooks/useUsers";
import { useOnlineUsers } from "@/hooks/useOnlineUsers";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UsersPage() {
  const { users, loading, refetch } = useUsers();
  const { onlineUserIds, onlineCount, connectionStatus } = useOnlineUsers();
  const [searchQuery, setSearchQuery] = useState("");

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (user) =>
          user.email.toLowerCase().includes(normalizedQuery) ||
          user.full_name?.toLowerCase().includes(normalizedQuery),
      ),
    [users, normalizedQuery],
  );

  const stats = useMemo(
    () => ({
      total: users.length,
      admins: users.filter((u) => u.role_name === "admin").length,
      regular: users.filter((u) => u.role_name === "user").length,
      banned: users.filter((u) => u.is_banned).length,
    }),
    [users],
  );

  return (
    <div className="flex flex-col h-full">
      <AdminHeader
        title="User Management"
        description="Manage all users and their roles"
      />

      <div className="flex-1 p-6 space-y-6">
        {/* Search and Actions */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users by email or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={refetch}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-5">
          <div className="rounded-lg border p-4">
            <div className="text-sm font-medium text-muted-foreground">
              Total Users
            </div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm font-medium text-muted-foreground">
              Admins
            </div>
            <div className="text-2xl font-bold">{stats.admins}</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm font-medium text-muted-foreground">
              Regular Users
            </div>
            <div className="text-2xl font-bold">{stats.regular}</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm font-medium text-muted-foreground">
              Banned Users
            </div>
            <div className="text-2xl font-bold">{stats.banned}</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm font-medium text-muted-foreground">
              Online Now
            </div>
            <div className="text-2xl font-bold text-emerald-600">
              {onlineCount}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Realtime: {connectionStatus}
            </div>
          </div>
        </div>

        {/* User Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <UserTable
            users={filteredUsers}
            onlineUserIds={onlineUserIds}
            onUpdate={refetch}
          />
        )}
      </div>
    </div>
  );
}
