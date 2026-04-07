"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createFeedback } from "@/lib/feedbackService";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useMyFeedback } from "@/hooks/useMyFeedback";
import {
  MessageSquare,
  Send,
  CheckCircle2,
  MessagesSquare,
} from "lucide-react";
import { FeedbackCategory } from "@/types";

export default function FeedbackPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { feedback, loading: loadingFeedback, refetch } = useMyFeedback();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<FeedbackCategory>("general");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const categoryLabel: Record<FeedbackCategory, string> = {
    bug: "Lỗi",
    feature: "Tính năng",
    improvement: "Cải thiện",
    general: "Chung",
    other: "Khác",
  };

  const statusLabel: Record<string, string> = {
    pending: "Đang chờ xử lý",
    in_progress: "Đang xử lý",
    resolved: "Đã giải quyết",
    closed: "Đã đóng",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      router.push("/auth/login?redirect=/feedback");
      return;
    }

    setSubmitting(true);
    setSuccess(false);

    const { success: submitSuccess, error } = await createFeedback({
      subject: subject.trim(),
      message: message.trim(),
      category,
    });

    if (submitSuccess) {
      setSuccess(true);
      setSubject("");
      setMessage("");
      setCategory("general");
      refetch();
      setTimeout(() => setSuccess(false), 5000);
    } else {
      alert(error || "Gửi phản hồi thất bại");
    }

    setSubmitting(false);
  };

  if (authLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <Alert>
          <AlertDescription>
            Vui lòng{" "}
            <a href="/auth/login" className="underline">
              đăng nhập
            </a>{" "}
            để gửi phản hồi.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Phản Hồi & Góp Ý</h1>
        <p className="text-muted-foreground mt-2">
          Chúng tôi trân trọng đóng góp của bạn. Hãy cho chúng tôi biết điều cần
          cải thiện.
        </p>
      </div>

      <Link href="/messages" className="block">
        <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors cursor-pointer">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <MessagesSquare className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                  Nhắn tin
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Nhắn tin trực tiếp với đội ngũ hỗ trợ
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Gửi Phản Hồi Mới
          </CardTitle>
          <CardDescription>
            Chia sẻ lỗi, đề xuất tính năng hoặc góp ý cải thiện.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="category">Danh mục</Label>
              <div className="flex gap-2 mt-2 flex-wrap">
                {(
                  [
                    "bug",
                    "feature",
                    "improvement",
                    "general",
                    "other",
                  ] as FeedbackCategory[]
                ).map((cat) => (
                  <Button
                    key={cat}
                    type="button"
                    variant={category === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategory(cat)}
                  >
                    {categoryLabel[cat]}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="subject">Tiêu đề</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Mô tả ngắn gọn nội dung phản hồi"
                required
                minLength={3}
                maxLength={200}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="message">Nội dung</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Vui lòng cung cấp thông tin chi tiết"
                required
                minLength={10}
                maxLength={5000}
                className="mt-2 min-h-[150px]"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {message.length}/5000 ký tự
              </p>
            </div>

            {success && (
              <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-400">
                  Cảm ơn bạn! Phản hồi đã được gửi thành công.
                </AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? (
                <>Đang gửi...</>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Gửi phản hồi
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lịch Sử Phản Hồi</CardTitle>
          <CardDescription>
            Theo dõi trạng thái các phản hồi đã gửi
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingFeedback ? (
            <div className="flex justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            </div>
          ) : feedback.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Bạn chưa gửi phản hồi nào
            </p>
          ) : (
            <div className="space-y-4">
              {feedback.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-medium">{item.subject}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {item.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Badge variant="outline">
                          {categoryLabel[item.category]}
                        </Badge>
                        <Badge
                          variant={
                            item.status === "pending"
                              ? "warning"
                              : item.status === "resolved"
                                ? "success"
                                : "info"
                          }
                        >
                          {statusLabel[item.status] || item.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.created_at).toLocaleDateString(
                            "vi-VN",
                          )}
                        </span>
                      </div>
                      {item.admin_reply && (
                        <div className="mt-3 rounded bg-muted p-3">
                          <p className="text-xs font-medium mb-1">
                            Phản hồi từ quản trị viên:
                          </p>
                          <p className="text-sm">{item.admin_reply}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
