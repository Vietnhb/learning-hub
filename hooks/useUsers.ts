"use client";

import { useState, useEffect } from "react";
import { UserWithRole } from "@/types";
import { getAllUsers } from "@/lib/adminService";

export function useUsers() {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error: err } = await getAllUsers();

    if (err) {
      setError(err);
      setUsers([]);
    } else {
      setUsers(data || []);
      setError(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
  };
}
