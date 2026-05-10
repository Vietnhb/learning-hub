import { Heart, MessageCircle, Share2, Bookmark, Send } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "../shared/Avatar";
import { Username } from "@/components/community/Username";
import { ActionButton } from "../shared/ActionButton";
import { FeedPost } from "../../types";
import { formatTimeAgo } from "../../utils/formatters";

export function PostCard({
  post,
  index,
  isOnline,
  toggleLike,
  openComments,
  setOpenComments,
  sharePost,
  savedPostIds,
  toggleSave,
  commentDrafts,
  setCommentDrafts,
  addComment,
}: {
  post: FeedPost;
  index: number;
  isOnline: (id: string) => boolean;
  toggleLike: (post: FeedPost) => Promise<void>;
  openComments: Record<string, boolean>;
  setOpenComments: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  sharePost: (id: string) => Promise<void>;
  savedPostIds: Set<string>;
  toggleSave: (id: string) => void;
  commentDrafts: Record<string, string>;
  setCommentDrafts: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
  addComment: (id: string) => Promise<void>;
}) {
  return (
    <motion.article
      id={`post-${post.id}`}
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.04 }}
      className="rounded-[1.5rem] border border-white/70 bg-white/85 p-5 shadow-lg shadow-slate-200/60 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:shadow-xl dark:border-white/10 dark:bg-white/[0.06] dark:shadow-black/30"
    >
      <div className="flex gap-4">
        <Avatar
          name={post.username || "Learning Hub member"}
          src={post.avatar_url}
          userId={post.user_id}
          online={Boolean(post.user_id && isOnline(post.user_id))}
          showFrameEffects={true}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-slate-950 dark:text-white">
              <Username
                userId={post.user_id}
                name={post.username || "Learning Hub member"}
                className="text-base"
              />
            </h3>
            <span className="text-sm text-slate-400">·</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {formatTimeAgo(post.created_at)}
            </span>
          </div>

          <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-700 dark:text-slate-200">
            {post.content}
          </p>

          {post.image_url ? (
            <div className="mt-4 overflow-hidden rounded-[1.4rem] border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-slate-900">
              <img
                src={post.image_url}
                alt="Ảnh bài đăng cộng đồng"
                className="max-h-[520px] w-full object-cover transition duration-500 hover:scale-[1.02]"
              />
            </div>
          ) : null}

          {post.comments.length > 0 ? (
            <div className="mt-4 space-y-2 rounded-2xl bg-slate-100/75 p-3 dark:bg-slate-950/40">
              {post.comments.slice(-2).map((comment) => (
                <div key={comment.id} className="flex gap-2 text-sm">
                  <Avatar name={comment.username || "Member"} size="xs" />
                  <div className="min-w-0">
                    <Username
                      userId={comment.user_id}
                      name={comment.username || "Member"}
                      className="text-sm"
                    />{" "}
                    <span className="text-slate-600 dark:text-slate-300">
                      {comment.content}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-4 dark:border-white/10">
            <ActionButton
              active={post.likedByMe}
              icon={<Heart className="h-4 w-4" />}
              label={`${post.likeCount}`}
              text="Like"
              onClick={() => void toggleLike(post)}
            />
            <ActionButton
              icon={<MessageCircle className="h-4 w-4" />}
              label={`${post.comments.length}`}
              text="Comment"
              onClick={() =>
                setOpenComments((current) => ({
                  ...current,
                  [post.id]: !current[post.id],
                }))
              }
            />
            <ActionButton
              icon={<Share2 className="h-4 w-4" />}
              text="Share"
              onClick={() => void sharePost(post.id)}
            />
            <ActionButton
              active={savedPostIds.has(post.id)}
              icon={<Bookmark className="h-4 w-4" />}
              text="Save"
              onClick={() => toggleSave(post.id)}
            />
          </div>

          {openComments[post.id] ? (
            <div className="mt-4 space-y-3 rounded-2xl bg-slate-100/70 p-4 dark:bg-slate-950/40">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar name={comment.username || "Member"} size="sm" />
                  <div className="rounded-2xl bg-white px-4 py-2 text-sm shadow-sm dark:bg-white/10">
                    <Username
                      userId={comment.user_id}
                      name={comment.username || "Member"}
                      className="text-sm mb-0.5 block"
                    />
                    <p className="text-slate-600 dark:text-slate-200">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}

              <div className="flex gap-2">
                <Textarea
                  value={commentDrafts[post.id] ?? ""}
                  onChange={(event) =>
                    setCommentDrafts((drafts) => ({
                      ...drafts,
                      [post.id]: event.target.value,
                    }))
                  }
                  placeholder="Viết bình luận..."
                  className="min-h-12 resize-none rounded-2xl bg-white dark:bg-slate-950/50"
                />
                <Button
                  type="button"
                  size="icon"
                  className="h-12 w-12 rounded-2xl"
                  onClick={() => void addComment(post.id)}
                  aria-label="Gửi bình luận"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
