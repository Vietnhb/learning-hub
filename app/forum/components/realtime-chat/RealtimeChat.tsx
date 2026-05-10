import { Loader2, Send } from "lucide-react";
import { FormEvent, RefObject } from "react";
import { Avatar } from "../shared/Avatar";
import { HubCard } from "../shared/HubCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessageRow } from "../../types";
import { formatTimeAgo } from "../../utils/formatters";

export function RealtimeChat({
  chatLoading,
  chatMessages,
  chatNotice,
  chatDraft,
  setChatDraft,
  sendChatMessage,
  sendingChat,
  displayedOnlineCount,
  username,
  currentUserId,
  chatInputRef,
  chatEndRef,
  chatContainerRef,
  isOnline,
}: {
  chatLoading: boolean;
  chatMessages: ChatMessageRow[];
  chatNotice: string | null;
  chatDraft: string;
  setChatDraft: (val: string) => void;
  sendChatMessage: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  sendingChat: boolean;
  displayedOnlineCount: number;
  username: string;
  currentUserId?: string;
  chatInputRef: RefObject<HTMLTextAreaElement>;
  chatEndRef: RefObject<HTMLDivElement>;
  chatContainerRef: RefObject<HTMLDivElement>;
  isOnline: (userId: string) => boolean;
}) {
  return (
    <HubCard className="overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-slate-200/80 px-5 py-4 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <h2 className="font-semibold">Tán Gẫu Cùng Đồng Bọn</h2>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Lounge chung cho hỏi nhanh, tán gẫu và phản hồi tức thì.
          </p>
        </div>
        <div className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-white/10 dark:text-slate-300 sm:block">
          {displayedOnlineCount} active
        </div>
      </div>

      <div ref={chatContainerRef} className="max-h-[460px] overflow-y-auto px-5 py-4">
        {chatLoading ? (
          <div className="flex items-center justify-center py-10 text-sm text-slate-500">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Đang tải chat...
          </div>
        ) : null}

        <div className="space-y-1">
          {chatMessages.map((message, index) => {
            const previous = chatMessages[index - 1];
            const grouped =
              previous &&
              previous.user_id === message.user_id &&
              previous.username === message.username;
            const isMe = Boolean(currentUserId && message.user_id === currentUserId);

            return (
              <div
                key={message.id}
                className={`group flex gap-3 rounded-2xl px-2 py-2 transition hover:bg-slate-100/80 dark:hover:bg-white/[0.06] ${
                  grouped ? "mt-0" : "mt-3"
                } ${isMe ? "flex-row-reverse" : ""}`}
              >
                {grouped ? (
                  <div className="w-9 shrink-0" />
                ) : (
                  <Avatar
                    name={message.username || "Member"}
                    src={message.avatar_url}
                    size="sm"
                    online={Boolean(
                      message.user_id && isOnline(message.user_id),
                    )}
                  />
                )}
                <div className={`min-w-0 flex-1 ${isMe ? "text-right" : ""}`}>
                  {!grouped ? (
                    <div className={`mb-1 flex flex-wrap items-center gap-2 ${isMe ? "justify-end" : ""}`}>
                      <span className="font-medium text-slate-950 dark:text-white">
                        {message.username || "Learning Hub member"}
                      </span>
                      <span className="text-xs text-slate-400">
                        {formatTimeAgo(message.created_at)}
                      </span>
                    </div>
                  ) : null}
                  <p className={`inline-block rounded-2xl px-3 py-2 text-sm leading-6 transition ${
                    isMe
                      ? "bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950"
                      : "bg-slate-100 text-slate-700 group-hover:bg-white dark:bg-white/[0.07] dark:text-slate-200 dark:group-hover:bg-white/[0.1]"
                  }`}>
                    {message.content}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>
      </div>

      <form
        onSubmit={sendChatMessage}
        className="sticky bottom-0 border-t border-slate-200/80 bg-white/90 p-4 backdrop-blur dark:border-white/10 dark:bg-slate-950/90"
      >
        <div className="mb-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {chatDraft.trim()
              ? `${username} đang soạn...`
              : `${displayedOnlineCount} người đang ở trong hub`}
          </span>
          {chatNotice ? <span>{chatNotice}</span> : null}
        </div>
        <div className="flex gap-2">
          <Textarea
            ref={chatInputRef}
            value={chatDraft}
            onChange={(event) => setChatDraft(event.target.value)}
            placeholder="Nhắn nhanh vào community chat..."
            className="min-h-12 resize-none rounded-2xl border-slate-200 bg-slate-50 focus-visible:ring-cyan-500 dark:border-white/10 dark:bg-white/[0.06]"
          />
          <Button
            type="submit"
            disabled={sendingChat || !chatDraft.trim()}
            className="h-12 w-12 shrink-0 rounded-2xl bg-cyan-600 p-0 text-white hover:bg-cyan-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
            aria-label="Gửi tin nhắn"
          >
            {sendingChat ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </HubCard>
  );
}
