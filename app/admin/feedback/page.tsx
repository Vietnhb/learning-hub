"use client";

import React, { useState } from "react";
import AdminHeader from "../components/AdminHeader";
import FeedbackCard from "@/components/admin/FeedbackCard";
import { useFeedback } from "@/hooks/useFeedback";
import { FeedbackStatus, FeedbackWithUser } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { updateFeedback } from "@/lib/adminService";
import { RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { UpdateFeedbackData } from "@/types";

export default function AdminFeedbackPage() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<FeedbackStatus | "all">(
    "all",
  );
  const { feedback, loading, refetch } = useFeedback(
    statusFilter === "all" ? undefined : statusFilter,
  );
  const [selectedFeedback, setSelectedFeedback] =
    useState<FeedbackWithUser | null>(null);
  const [reply, setReply] = useState("");
  const [updating, setUpdating] = useState(false);

  const handleUpdateStatus = async (
    feedbackId: string,
    newStatus: FeedbackStatus,
  ) => {
    setUpdating(true);
    const payload = user?.id
      ? { status: newStatus, admin_id: user.id }
      : { status: newStatus };
    const { success } = await updateFeedback(feedbackId, payload);
    if (success) {
      refetch();
      if (selectedFeedback?.id === feedbackId) {
        setSelectedFeedback(null);
      }
    }
    setUpdating(false);
  };

  const handleReply = async () => {
    if (!selectedFeedback || !reply.trim()) return;

    setUpdating(true);
    const payload: UpdateFeedbackData = {
      admin_reply: reply.trim(),
      status: "resolved",
      ...(user?.id ? { admin_id: user.id } : {}),
    };
    const { success } = await updateFeedback(selectedFeedback.id, payload);

    if (success) {
      setReply("");
      setSelectedFeedback(null);
      refetch();
    }
    setUpdating(false);
  };

  const stats = {
    total: feedback.length,
    pending: feedback.filter((f) => f.status === "pending").length,
    inProgress: feedback.filter((f) => f.status === "in_progress").length,
    resolved: feedback.filter((f) => f.status === "resolved").length,
  };

  return (
    <div className="flex flex-col h-full">
      <AdminHeader
        title="Feedback Management"
        description="Manage user feedback and suggestions"
      />

      <div className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border p-4">
            <div className="text-sm font-medium text-muted-foreground">
              Total Feedback
            </div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </div>
          <div className="rounded-lg border p-4 bg-yellow-50 dark:bg-yellow-900/10">
            <div className="text-sm font-medium text-muted-foreground">
              Pending
            </div>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
          </div>
          <div className="rounded-lg border p-4 bg-blue-50 dark:bg-blue-900/10">
            <div className="text-sm font-medium text-muted-foreground">
              In Progress
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {stats.inProgress}
            </div>
          </div>
          <div className="rounded-lg border p-4 bg-green-50 dark:bg-green-900/10">
            <div className="text-sm font-medium text-muted-foreground">
              Resolved
            </div>
            <div className="text-2xl font-bold text-green-600">
              {stats.resolved}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("all")}
          >
            All
          </Button>
          <Button
            variant={statusFilter === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("pending")}
          >
            Pending
          </Button>
          <Button
            variant={statusFilter === "in_progress" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("in_progress")}
          >
            In Progress
          </Button>
          <Button
            variant={statusFilter === "resolved" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("resolved")}
          >
            Resolved
          </Button>
          <div className="flex-1" />
          <Button
            variant="outline"
            size="icon"
            onClick={refetch}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {/* Feedback Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {feedback.map((item) => (
              <FeedbackCard
                key={item.id}
                feedback={item}
                onClick={() => setSelectedFeedback(item)}
              />
            ))}
            {feedback.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No feedback found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Feedback Detail Dialog */}
      <Dialog
        open={!!selectedFeedback}
        onOpenChange={(open) => !open && setSelectedFeedback(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedFeedback?.subject}</DialogTitle>
            <DialogDescription>
              <div className="space-y-2 mt-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">From:</span>
                  <span>{selectedFeedback?.user?.full_name}</span>
                  <span className="text-xs">({selectedFeedback?.user?.email})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{selectedFeedback?.category}</Badge>
                  <Badge
                    variant={
                      selectedFeedback?.status === "pending"
                        ? "warning"
                        : selectedFeedback?.status === "resolved"
                          ? "success"
                          : "info"
                    }
                  >
                    {selectedFeedback?.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {selectedFeedback?.created_at &&
                      new Date(selectedFeedback.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Message:</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {selectedFeedback?.message}
              </p>
            </div>

            {selectedFeedback?.admin_reply && (
              <div className="rounded-lg bg-muted p-4">
                <h4 className="font-medium mb-2">Admin Reply:</h4>
                <p className="text-sm whitespace-pre-wrap">
                  {selectedFeedback.admin_reply}
                </p>
              </div>
            )}

            {!selectedFeedback?.admin_reply && (
              <div>
                <h4 className="font-medium mb-2">Reply to user:</h4>
                <Textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply..."
                  className="min-h-[100px]"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            {selectedFeedback?.status === "pending" && (
              <Button
                variant="outline"
                onClick={() =>
                  selectedFeedback &&
                  handleUpdateStatus(selectedFeedback.id, "in_progress")
                }
                disabled={updating}
              >
                Mark In Progress
              </Button>
            )}
            {!selectedFeedback?.admin_reply && reply.trim() && (
              <Button onClick={handleReply} disabled={updating}>
                {updating ? "Sending..." : "Send Reply & Resolve"}
              </Button>
            )}
            {selectedFeedback?.status !== "resolved" &&
              selectedFeedback?.admin_reply && (
                <Button
                  onClick={() =>
                    selectedFeedback &&
                    handleUpdateStatus(selectedFeedback.id, "resolved")
                  }
                  disabled={updating}
                >
                  Mark Resolved
                </Button>
              )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
