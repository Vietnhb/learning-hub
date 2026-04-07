"use client";

import React from "react";
import { FeedbackStatus } from "@/types";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: FeedbackStatus | "active" | "archived" | "closed";
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const variants = {
    pending: { variant: "warning" as const, label: "Pending" },
    in_progress: { variant: "info" as const, label: "In Progress" },
    resolved: { variant: "success" as const, label: "Resolved" },
    closed: { variant: "secondary" as const, label: "Closed" },
    active: { variant: "success" as const, label: "Active" },
    archived: { variant: "secondary" as const, label: "Archived" },
  };

  const config = variants[status] || {
    variant: "outline" as const,
    label: status,
  };

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
