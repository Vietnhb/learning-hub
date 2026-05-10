import {
  AlignLeft,
  Bold,
  Code2,
  Eraser,
  FunctionSquare,
  ImageIcon,
  Italic,
  Link,
  List,
  Loader2,
  Maximize2,
  MoreVertical,
  Paperclip,
  Palette,
  Pilcrow,
  Quote,
  Redo2,
  Reply,
  Smile,
  TextCursorInput,
  Type,
  Undo2,
  X,
  Minimize2,
} from "lucide-react";
import React, { ChangeEvent, FormEvent, RefObject, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "../shared/Avatar";
import { cn } from "@/lib/utils";

interface ToolbarButton {
  icon: React.ElementType;
  label: string;
  prefix?: string;
  suffix?: string;
}

const toolbarGroups: ToolbarButton[][] = [
  [
    { icon: Eraser, label: "Clear formatting" },
    { icon: Bold, label: "Bold", prefix: "**", suffix: "**" },
    { icon: Italic, label: "Italic", prefix: "_", suffix: "_" },
    { icon: Type, label: "Text style" },
    { icon: Palette, label: "Text color" },
    { icon: TextCursorInput, label: "Insert variable" },
    { icon: FunctionSquare, label: "Formula" },
    { icon: Code2, label: "Code", prefix: "`", suffix: "`" },
  ],
  [
    { icon: List, label: "List", prefix: "- " },
    { icon: AlignLeft, label: "Alignment" },
    { icon: Pilcrow, label: "Paragraph" },
  ],
  [
    { icon: Link, label: "Link", prefix: "[", suffix: "](url)" },
    { icon: ImageIcon, label: "Image" },
    { icon: Smile, label: "Emoji" },
    { icon: Quote, label: "Quote", prefix: "> " },
    { icon: ImageIcon, label: "Gallery" },
  ],
];

export function PostComposer({
  postComposerRef,
  createPost,
  username,
  avatarUrl,
  userId,
  content,
  setContent,
  previewUrl,
  setSelectedImage,
  postFileInputRef,
  handleImageChange,
  submitting,
  selectedImage,
}: {
  postComposerRef: RefObject<HTMLFormElement>;
  createPost: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  username: string;
  avatarUrl?: string;
  userId?: string;
  content: string;
  setContent: (val: string) => void;
  previewUrl: string | null;
  setSelectedImage: (file: File | null) => void;
  postFileInputRef: RefObject<HTMLInputElement>;
  handleImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  submitting: boolean;
  selectedImage: File | null;
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const applyFormatting = (prefix: string = "", suffix: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selection = content.substring(start, end);
    const before = content.substring(0, start);
    const after = content.substring(end);

    const newContent = before + prefix + selection + suffix + after;
    setContent(newContent);

    // Reset focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        end + prefix.length
      );
    }, 0);
  };

  return (
    <motion.form
      ref={postComposerRef}
      onSubmit={createPost}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        "overflow-hidden rounded-lg border border-blue-200 bg-white shadow-lg transition-all duration-300 dark:border-cyan-500/25 dark:bg-slate-950",
        isFullscreen ? "fixed inset-4 z-[100] flex flex-col rounded-2xl" : "relative shadow-slate-200/70 dark:shadow-black/30"
      )}
    >
      {isFullscreen && (
        <div className="flex items-center justify-between border-b border-blue-100 bg-blue-50 px-6 py-4 dark:border-white/10 dark:bg-slate-900">
          <h2 className="text-lg font-bold">Viết bài đăng</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFullscreen(false)}
            className="rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}

      <div className={cn(
        "flex gap-3 bg-sky-50/70 p-2 dark:bg-cyan-950/20",
        isFullscreen ? "flex-1 overflow-y-auto p-4" : ""
      )}>
        <aside className={cn(
          "flex shrink-0 justify-center rounded-xl border border-blue-100 bg-indigo-50 px-3 py-3 dark:border-white/10 dark:bg-white/[0.06]",
          isFullscreen ? "h-fit w-32" : "w-[104px]"
        )}>
          <Avatar
            name={username}
            src={avatarUrl}
            userId={userId}
            showFrameEffects={true}
          />
        </aside>

        <div className="min-w-0 flex-1 flex flex-col">
          <div className={cn(
            "overflow-hidden rounded-xl border border-blue-200 bg-white dark:border-cyan-500/25 dark:bg-slate-950/80 flex flex-col",
            isFullscreen ? "flex-1" : ""
          )}>
            <div className="flex min-h-14 items-center justify-between gap-3 border-b border-blue-100 px-2 py-1.5 dark:border-white/10">
              <div className="flex min-w-0 flex-wrap items-center gap-1">
                {toolbarGroups.map((group, groupIndex) => (
                  <div
                    key={groupIndex}
                    className="flex items-center gap-1 rounded-xl border border-blue-100 bg-sky-50/50 px-2 py-1 dark:border-cyan-500/20 dark:bg-cyan-950/20"
                  >
                    {group.map(({ icon: Icon, label, prefix, suffix }) => (
                      <button
                        key={label}
                        type="button"
                        title={label}
                        onClick={() => applyFormatting(prefix, suffix)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-emerald-800 transition hover:bg-white hover:text-emerald-950 dark:text-cyan-200 dark:hover:bg-white/10"
                        aria-label={label}
                      >
                        <Icon className="h-5 w-5" />
                      </button>
                    ))}
                    <button
                      type="button"
                      title="More"
                      className="inline-flex h-8 w-6 items-center justify-center rounded-md text-slate-400 transition hover:bg-white hover:text-slate-600 dark:hover:bg-white/10"
                      aria-label="More formatting options"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="hidden shrink-0 items-center gap-2 text-slate-300 sm:flex">
                <button
                  type="button"
                  title="Undo"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-slate-50 hover:text-slate-500 dark:hover:bg-white/10"
                  aria-label="Undo"
                >
                  <Undo2 className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  title="Redo"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-slate-50 hover:text-slate-500 dark:hover:bg-white/10"
                  aria-label="Redo"
                >
                  <Redo2 className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-emerald-800 transition hover:bg-slate-50 dark:text-cyan-200 dark:hover:bg-white/10"
                  aria-label="Fullscreen"
                >
                  {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Textarea
              ref={textareaRef}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Cập nhật trạng thái..."
              className={cn(
                "resize-none rounded-none border-0 bg-white px-4 py-4 text-base shadow-none outline-none ring-0 transition placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-slate-950/80 dark:placeholder:text-slate-500",
                isFullscreen ? "flex-1 min-h-0" : "min-h-[200px]"
              )}
            />
          </div>

          {previewUrl ? (
            <div className="relative mt-3 overflow-hidden rounded-xl border border-blue-100 bg-white dark:border-white/10 dark:bg-white/[0.04]">
              <img
                src={previewUrl}
                alt="Ảnh xem trước"
                className={cn("w-full object-cover", isFullscreen ? "max-h-96" : "max-h-72")}
              />
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="absolute right-3 top-3 rounded-full bg-slate-950/70 p-2 text-white transition hover:bg-slate-950"
                aria-label="Xóa ảnh"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : null}

          <div className={cn(
            "mt-3 flex flex-wrap items-center gap-2",
            isFullscreen ? "pb-4" : ""
          )}>
            <Button
              type="submit"
              disabled={submitting || (!content.trim() && !selectedImage)}
              className="h-12 rounded-xl bg-blue-600 px-8 text-base font-bold text-white shadow-lg transition hover:bg-blue-700 active:scale-95 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
            >
              {submitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Reply className="h-5 w-5 mr-2" />
              )}
              Đăng bài ngay
            </Button>

            <label className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 text-base font-semibold text-slate-950 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 dark:border-cyan-500/25 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-cyan-950/30">
              <Paperclip className="h-5 w-5" />
              Đính kèm tập tin
              <input
                ref={postFileInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>
      </div>
    </motion.form>
  );
}
