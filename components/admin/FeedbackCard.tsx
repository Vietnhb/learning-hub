"use client";

import React from "react";
import { FeedbackWithUser } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, User, Calendar } from "lucide-react";

interface FeedbackCardProps {
  feedback: FeedbackWithUser;
  onClick?: () => void;
}

const categoryColors = {
  bug: "destructive",
  feature: "info",
  improvement: "success",
  general: "secondary",
  other: "outline",
} as const;

const statusColors = {
  pending: "warning",
  in_progress: "info",
  resolved: "success",
  closed: "secondary",
} as const;

export default function FeedbackCard({ feedback, onClick }: FeedbackCardProps) {
  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">
              {feedback.subject}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{feedback.user?.full_name || feedback.user?.email}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Badge variant={statusColors[feedback.status]}>
              {feedback.status}
            </Badge>
            <Badge variant={categoryColors[feedback.category]}>
              {feedback.category}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {feedback.message}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(feedback.created_at).toLocaleDateString()}</span>
          </div>
          {feedback.admin_reply && (
            <div className="flex items-center gap-1 text-green-600">
              <MessageSquare className="h-3 w-3" />
              <span>Admin replied</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
