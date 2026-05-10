import { ImageIcon, Loader2, Plus, X } from "lucide-react";
import { ChangeEvent, FormEvent, RefObject } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "../shared/Avatar";

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
  return (
    <motion.form
      ref={postComposerRef}
      onSubmit={createPost}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="rounded-[1.5rem] border border-white/70 bg-white/85 p-4 shadow-lg shadow-slate-200/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] dark:shadow-black/30"
    >
      <div className="flex gap-3">
        <Avatar
          name={username}
          src={avatarUrl}
          userId={userId}
          showFrameEffects={true}
        />
        <div className="min-w-0 flex-1">
          <Textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Chia sẻ kiến thức, câu hỏi hoặc project của bạn..."
            className="min-h-24 resize-none rounded-2xl border-slate-200 bg-slate-50 text-base transition focus-visible:ring-cyan-500 dark:border-white/10 dark:bg-slate-950/40"
          />

          {previewUrl ? (
            <div className="relative mt-4 overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10">
              <img
                src={previewUrl}
                alt="Ảnh xem trước"
                className="max-h-72 w-full object-cover"
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

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:text-cyan-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:text-cyan-200">
              <ImageIcon className="h-4 w-4" />
              Upload ảnh
              <input
                ref={postFileInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleImageChange}
              />
            </label>

            <Button
              type="submit"
              disabled={submitting || (!content.trim() && !selectedImage)}
              className="rounded-full bg-slate-950 px-5 text-white transition hover:-translate-y-0.5 hover:bg-cyan-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Create Post
            </Button>
          </div>
        </div>
      </div>
    </motion.form>
  );
}
