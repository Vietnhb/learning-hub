"use client";

import React, { useState, useRef, useEffect } from "react";
import AdminHeader from "../components/AdminHeader";
import { useConversations } from "@/hooks/useConversations";
import { useChat } from "@/hooks/useChat";
import ChatMessage from "@/components/admin/ChatMessage";
import MessageInput from "@/components/admin/MessageInput";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function AdminMessagesPage() {
  const { conversations, loading: loadingConvs, refetch } = useConversations();
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedConv = conversations.find((c) => c.id === selectedConvId);
  const {
    messages,
    loading: loadingMessages,
    send,
    sending,
  } = useChat(selectedConvId);

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.user?.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (message: string) => {
    if (!selectedConv) return;
    await send(message, selectedConv.user_id);
  };

  return (
    <div className="flex flex-col h-full">
      <AdminHeader
        title="Messages"
        description="Chat with users in real-time"
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Conversations List */}
        <div className="w-80 border-r flex flex-col">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
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
              <p className="text-center text-sm text-muted-foreground py-8">
                No conversations found
              </p>
            ) : (
              filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={cn(
                    "w-full p-4 border-b text-left hover:bg-accent transition-colors",
                    selectedConvId === conv.id && "bg-accent",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium truncate">
                          {conv.user?.full_name || conv.user?.email}
                        </p>
                        {conv.unread_count > 0 && (
                          <Badge
                            variant="destructive"
                            className="flex-shrink-0"
                          >
                            {conv.unread_count}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {conv.user?.email}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(conv.last_message_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConv ? (
            <>
              {/* Chat Header */}
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

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4">
                {loadingMessages ? (
                  <div className="flex justify-center py-8">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No messages yet. Start the conversation!
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

              {/* Message Input */}
              <div className="border-t p-4">
                <MessageInput onSend={handleSend} disabled={sending} />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
