"use client";

import React, { useEffect, useRef, useState } from "react";
import AdminHeader from "../components/AdminHeader";
import { useConversations } from "@/hooks/useConversations";
import { useChat } from "@/hooks/useChat";
import { assignConversationToCurrentAdmin } from "@/lib/chatService";
import ChatMessage from "@/components/admin/ChatMessage";
import MessageInput from "@/components/admin/MessageInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminMessagesPage() {
  const { user } = useAuth();
  const { conversations, loading: loadingConvs, refetch } = useConversations();
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [claimingConvId, setClaimingConvId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedConv = conversations.find((c) => c.id === selectedConvId);
  const {
    messages,
    loading: loadingMessages,
    send,
    sending,
  } = useChat(selectedConvId);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredConversations = conversations.filter((conv) => {
    if (!normalizedQuery) return true;

    const name = conv.user?.full_name?.toLowerCase() || "";
    const email = conv.user?.email?.toLowerCase() || "";
    return name.includes(normalizedQuery) || email.includes(normalizedQuery);
  });

  useEffect(() => {
    if (selectedConvId && conversations.some((c) => c.id === selectedConvId)) {
      return;
    }

    if (conversations.length === 0) {
      setSelectedConvId(null);
      return;
    }

    const unreadConversation = conversations.find((c) => c.unread_count > 0);
    setSelectedConvId(unreadConversation?.id || conversations[0].id);
  }, [conversations, selectedConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStartChat = async (conversationId: string) => {
    setClaimingConvId(conversationId);

    const { success } = await assignConversationToCurrentAdmin(conversationId);
    if (success) {
      setSelectedConvId(conversationId);
      await refetch();
      setClaimingConvId(null);
      return true;
    }

    setClaimingConvId(null);
    return false;
  };

  const handleSend = async (message: string) => {
    if (!selectedConv) return;

    if (!selectedConv.admin_id) {
      const claimed = await handleStartChat(selectedConv.id);
      if (!claimed) return;
    }

    await send(message, selectedConv.user_id);
  };

  return (
    <div className="flex h-full flex-col">
      <AdminHeader
        title="Messages"
        description="Chat với người dùng theo thời gian thực"
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex w-80 flex-col border-r">
          <div className="border-b p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm cuộc trò chuyện..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingConvs ? (
              <div className="flex justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              </div>
            ) : filteredConversations.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Chưa có cuộc trò chuyện nào
              </p>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = selectedConvId === conv.id;
                const isMine = !!user?.id && conv.admin_id === user.id;
                const isAssignedToOtherAdmin = !!conv.admin_id && !isMine;

                return (
                  <div
                    key={conv.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedConvId(conv.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedConvId(conv.id);
                      }
                    }}
                    className={cn(
                      "w-full border-b p-4 text-left transition-colors hover:bg-accent",
                      isSelected && "bg-accent",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate font-medium">
                            {conv.user?.full_name || conv.user?.email}
                          </p>
                          {conv.unread_count > 0 && (
                            <Badge variant="destructive" className="flex-shrink-0">
                              {conv.unread_count}
                            </Badge>
                          )}
                        </div>

                        <p className="truncate text-xs text-muted-foreground">
                          {conv.user?.email}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {new Date(conv.last_message_at).toLocaleString("vi-VN")}
                        </p>

                        <div className="mt-2 flex items-center gap-2">
                          <Button
                            size="sm"
                            variant={isSelected ? "default" : "outline"}
                            disabled={claimingConvId === conv.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              void handleStartChat(conv.id);
                            }}
                          >
                            {claimingConvId === conv.id
                              ? "Đang nhận..."
                              : isSelected
                                ? "Đang chat"
                                : "Bắt đầu chat"}
                          </Button>

                          {isMine && (
                            <Badge variant="secondary">Bạn phụ trách</Badge>
                          )}
                          {isAssignedToOtherAdmin && (
                            <Badge variant="outline">Đã gán admin khác</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col">
          {selectedConv ? (
            <>
              <div className="border-b p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {selectedConv.user?.full_name || selectedConv.user?.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedConv.user?.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {loadingMessages ? (
                  <div className="flex justify-center py-8">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">
                    Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện.
                  </p>
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
                <MessageInput onSend={handleSend} disabled={sending} />
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-muted-foreground">
              <div className="text-center">
                <User className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <p>Chọn cuộc trò chuyện và bấm "Bắt đầu chat"</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
