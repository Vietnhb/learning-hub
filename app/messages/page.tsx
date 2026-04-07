"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useChat } from "@/hooks/useChat";
import { getOrCreateConversation } from "@/lib/chatService";
import ChatMessage from "@/components/admin/ChatMessage";
import MessageInput from "@/components/admin/MessageInput";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function UserMessagesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    loading: loadingMessages,
    send,
    sending,
  } = useChat(conversationId);

  useEffect(() => {
    async function initConversation() {
      if (!user) {
        router.push("/auth/login?redirect=/messages");
        return;
      }

      const { data, error } = await getOrCreateConversation();
      if (data) {
        setConversationId(data.id);
        // Get admin_id from conversation or fetch first admin
        setAdminId(data.admin_id || null);
      } else {
        console.error("Failed to get conversation:", error);
      }
      setLoading(false);
    }

    initConversation();
  }, [user, router]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (message: string) => {
    if (!conversationId) return;

    // If we have an admin_id from the conversation, use it
    // Otherwise, the message will be sent and admin can reply
    const receiverId = adminId || user!.id; // Fallback to self for now

    await send(message, receiverId);
  };

  if (!user) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <Alert>
          <AlertDescription>
            Please{" "}
            <a href="/auth/login" className="underline">
              login
            </a>{" "}
            to chat with admin.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Message Admin</h1>
          <p className="text-muted-foreground mt-1">
            Get help and support from our team
          </p>
        </div>
      </div>

      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Chat with Admin
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4">
            {loadingMessages ? (
              <div className="flex justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">
                  No messages yet. Start the conversation!
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

          {/* Message Input */}
          <div className="border-t p-4">
            <MessageInput
              onSend={handleSend}
              disabled={sending}
              placeholder="Type your message to admin..."
            />
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 text-sm text-muted-foreground text-center">
        <p>Our admin team typically responds within 24 hours</p>
      </div>
    </div>
  );
}
