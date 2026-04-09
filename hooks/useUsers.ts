"use client";

import { useState, useEffect } from "react";
import { UserWithRole } from "@/types";
import { getAllUsers } from "@/lib/adminService";

interface UseUsersOptions {
  autoRefreshMs?: number;
}

export function useUsers(options: UseUsersOptions = {}) {
  const { autoRefreshMs = 0 } = options;
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }

    const { data, error: err } = await getAllUsers();

    if (err) {
      setError(err);
      setUsers([]);
    } else {
      setUsers(data || []);
      setError(null);
    }

    if (showLoading) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(true);

    if (!autoRefreshMs || autoRefreshMs <= 0) {
      return;
    }

    const timer = setInterval(() => {
      void fetchUsers(false);
    }, autoRefreshMs);

    return () => clearInterval(timer);
  }, []);

  return {
    users,
    loading,
    error,
    refetch: () => fetchUsers(true),
  };
}
