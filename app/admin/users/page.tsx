"use client";

import React, { useState } from "react";
import AdminHeader from "../components/AdminHeader";
import UserTable from "@/components/admin/UserTable";
import { useUsers } from "@/hooks/useUsers";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UsersPage() {
  const { users, loading, refetch } = useUsers();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()),
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
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border p-4">
            <div className="text-sm font-medium text-muted-foreground">
              Total Users
            </div>
            <div className="text-2xl font-bold">{users.length}</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm font-medium text-muted-foreground">
              Admins
            </div>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.role_name === "admin").length}
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm font-medium text-muted-foreground">
              Regular Users
            </div>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.role_name === "user").length}
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm font-medium text-muted-foreground">
              Banned Users
            </div>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.is_banned).length}
            </div>
          </div>
        </div>

        {/* User Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <UserTable users={filteredUsers} onUpdate={refetch} />
        )}
      </div>
    </div>
  );
}
