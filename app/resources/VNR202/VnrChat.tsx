"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, BookOpen, Loader2, MessageCircleQuestion, Send, X } from "lucide-react";

interface Source {
  n: number;
  kind: "giao-trinh" | "slide" | "kich-ban" | "trang-web";
  label: string;
  excerpt: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  unverified?: string[];
  grounded?: boolean;
  error?: boolean;
}

const KIND_TAG: Record<Source["kind"], string> = {
  "giao-trinh": "Giáo trình",
  slide: "Slide nhóm",
  "kich-ban": "Kịch bản nhóm",
  "trang-web": "Trang VNR202",
};

const SUGGESTIONS = [
  "Chỉ thị Kháng chiến kiến quốc xác định kẻ thù chính là ai?",
  "Hiệp định Sơ bộ 6/3/1946 có nội dung gì?",
  "Đường lối kháng chiến toàn dân, toàn diện là gì?",
  "Chiến dịch Biên giới 1950 có ý nghĩa gì?",
];

function renderAnswer(text: string) {
  return text.split(/\n+/).map((para, i) => (
    <p key={i} className="leading-7">
      {para.split(/(\[\d+\])/g).map((part, j) =>
        /^\[\d+\]$/.test(part) ? (
          <sup key={j} className="mx-0.5 rounded bg-[#c9a45c]/20 px-1 text-[11px] font-bold text-[#f3d9a4]">
            {part.slice(1, -1)}
          </sup>
        ) : (
          <span key={j}>{part.replace(/\*\*/g, "")}</span>
        ),
      )}
    </p>
  ));
}

export default function VnrChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const ask = async (question: string) => {
    const q = question.trim();
    if (!q || loading) return;
    const history = messages
      .filter((m) => !m.error)
      .map((m) => ({ role: m.role, content: m.content }));
    setMessages((m) => [...m, { role: "user", content: q }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/vnr202/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, history }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Có lỗi xảy ra.");
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: data.answer,
          sources: data.sources,
          unverified: data.unverified,
          grounded: data.grounded,
        },
      ]);
    } catch (error) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: error instanceof Error ? error.message : "Có lỗi xảy ra.", error: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!open && (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-[55] inline-flex items-center gap-2 rounded-full border border-[#c9a45c]/60 bg-[#17130f] px-5 py-3 text-sm font-semibold text-[#f3d9a4] shadow-[0_12px_32px_rgba(0,0,0,0.5)] transition hover:-translate-y-0.5 hover:bg-[#221b14]"
        aria-label="Mở hỏi đáp theo giáo trình"
      >
        <MessageCircleQuestion className="h-5 w-5" />
        Hỏi đáp theo giáo trình
      </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-x-2 bottom-2 top-16 z-[66] flex flex-col overflow-hidden rounded-2xl border border-[#3a3128] bg-[#14110d] text-[#efe6d6] shadow-2xl sm:inset-x-auto sm:right-5 sm:top-auto sm:h-[640px] sm:max-h-[calc(100vh-40px)] sm:w-[440px]"
            aria-label="Hỏi đáp theo giáo trình"
          >
            <header className="flex items-start justify-between gap-3 border-b border-[#2a231b] px-5 py-4">
              <div>
                <p className="font-[family-name:var(--font-vnr-serif)] text-lg font-bold text-[#f6eedf]">Hỏi đáp theo giáo trình</p>
                <p className="mt-1 text-xs leading-5 text-[#a89a83]">
                  Chỉ trả lời từ giáo trình LSĐ (2019) Chương 2, trang in 61–77 và tài liệu thuyết trình của nhóm. Luôn kiểm tra lại đoạn được trích.
                </p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Đóng" className="rounded-md p-1.5 text-[#bfb29c] hover:bg-[#2a231b]">
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4 text-sm">
              {messages.length === 0 && (
                <div className="space-y-2">
                  <p className="text-[#bfb29c]">Gợi ý câu hỏi:</p>
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => ask(s)}
                      className="block w-full rounded-lg border border-[#3a3128] bg-[#191510] px-3 py-2 text-left text-[#e2d7c4] transition hover:border-[#c9a45c]/60"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((m, i) =>
                m.role === "user" ? (
                  <div key={i} className="ml-8 rounded-xl rounded-br-sm bg-[#c9a45c] px-4 py-2.5 text-[#1a140c]">
                    {m.content}
                  </div>
                ) : (
                  <div key={i} className="mr-4 space-y-3">
                    <div
                      className={`rounded-xl rounded-bl-sm border px-4 py-3 ${
                        m.error ? "border-[#9e2b25]/60 bg-[#9e2b25]/10 text-[#f3d9d4]" : "border-[#2a231b] bg-[#1b1611] text-[#e2d7c4]"
                      }`}
                    >
                      {renderAnswer(m.content)}
                    </div>
                    {!!m.unverified?.length && (
                      <p className="flex gap-2 rounded-lg border border-[#c9a45c]/40 bg-[#c9a45c]/10 px-3 py-2 text-xs leading-5 text-[#e6d3ad]">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                        Các số liệu sau không thấy trong đoạn được trích, hãy kiểm tra lại: {m.unverified.join(", ")}
                      </p>
                    )}
                    {!!m.sources?.length && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9d8f78]">
                          {m.grounded ? "Căn cứ" : "Đoạn tài liệu liên quan"}
                        </p>
                        {m.sources.map((s) => (
                          <details key={s.n} className="rounded-lg border border-[#2a231b] bg-[#17130f] px-3 py-2">
                            <summary className="cursor-pointer list-none text-xs text-[#d9ccb5]">
                              <span className="mr-1.5 rounded bg-[#c9a45c]/20 px-1.5 font-bold text-[#f3d9a4]">{s.n}</span>
                              <span className="mr-1.5 inline-flex items-center gap-1 text-[#c9a45c]">
                                <BookOpen className="h-3 w-3" />
                                {KIND_TAG[s.kind]}
                              </span>
                              {s.label}
                            </summary>
                            <p className="mt-2 text-xs leading-5 text-[#bfb29c]">{s.excerpt}</p>
                          </details>
                        ))}
                      </div>
                    )}
                  </div>
                ),
              )}

              {loading && (
                <p className="inline-flex items-center gap-2 text-[#a89a83]">
                  <Loader2 className="h-4 w-4 animate-spin" /> Đang tra giáo trình…
                </p>
              )}
              <div ref={endRef} />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
              className="flex items-end gap-2 border-t border-[#2a231b] px-4 py-3"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    ask(input);
                  }
                }}
                rows={2}
                maxLength={500}
                placeholder="Hỏi về giai đoạn 1945–1950…"
                className="flex-1 resize-none rounded-lg border border-[#3a3128] bg-[#0f0c09] px-3 py-2 text-sm text-[#f6eedf] placeholder:text-[#7d715f] focus:border-[#c9a45c] focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Gửi câu hỏi"
                className="rounded-lg bg-[#c9a45c] p-2.5 text-[#1a140c] transition hover:bg-[#d8b26a] disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
