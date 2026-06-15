"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useChat } from "@/hooks/useChat";
import { useAdminConversation } from "@/hooks/useAdminConversation";
import ChatMessage from "@/components/admin/ChatMessage";
import MessageInput from "@/components/admin/MessageInput";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function UserMessagesPage() {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    user,
    authLoading,
    conversationId,
    loadingConversation,
    getReceiverId,
  } = useAdminConversation({ redirectUnauthenticatedTo: "/messages" });

  const {
    messages,
    loading: loadingMessages,
    send,
    sending,
  } = useChat(conversationId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (message: string) => {
    const receiverId = getReceiverId();
    if (!conversationId || !receiverId) return;

    await send(message, receiverId);
  };

  if (authLoading || loadingConversation) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <Alert>
          <AlertDescription>
            Vui lòng{" "}
            <a href="/auth/login" className="underline">
              đăng nhập
            </a>{" "}
            để nhắn tin với quản trị viên.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Nhắn Tin Với Quản Trị Viên</h1>
          <p className="mt-1 text-muted-foreground">
            Nhận hỗ trợ trực tiếp từ đội ngũ quản trị
          </p>
        </div>
      </div>

      <Card className="flex h-[600px] flex-col">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Trò chuyện với quản trị viên
          </CardTitle>
        </CardHeader>

        <CardContent className="flex min-h-0 flex-1 flex-col p-0">
          <div className="h-0 flex-1 overflow-y-auto p-4">
            {loadingMessages ? (
              <div className="flex justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : messages.length === 0 ? (
              <div className="py-12 text-center">
                <MessageCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">
                  Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
                </p>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <div className="border-t p-4">
            <MessageInput
              onSend={handleSend}
              disabled={sending}
              placeholder="Nhập tin nhắn gửi quản trị viên..."
            />
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>Đội ngũ quản trị thường phản hồi trong vòng 24 giờ</p>
      </div>
    </div>
  );
}
