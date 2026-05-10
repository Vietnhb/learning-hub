import { Loader2 } from "lucide-react";
import { RefObject } from "react";
import { HubCard } from "../shared/HubCard";
import { PostCard } from "./PostCard";
import { FeedPost } from "../../types";

export function CommunityFeed({
  posts,
  loading,
  visiblePosts,
  visiblePostCount,
  loadMoreRef,
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
  posts: FeedPost[];
  loading: boolean;
  visiblePosts: FeedPost[];
  visiblePostCount: number;
  loadMoreRef: RefObject<HTMLDivElement>;
  isOnline: (id: string) => boolean;
  toggleLike: (post: FeedPost) => Promise<void>;
  openComments: Record<string, boolean>;
  setOpenComments: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  sharePost: (id: string) => Promise<void>;
  savedPostIds: Set<string>;
  toggleSave: (id: string) => void;
  commentDrafts: Record<string, string>;
  setCommentDrafts: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  addComment: (id: string) => Promise<void>;
}) {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Community posts</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Bài dài hơn, hình ảnh, showcase project và thảo luận sâu.
          </p>
        </div>
        <span className="rounded-full bg-slate-200 px-3 py-1 text-sm text-slate-600 dark:bg-white/10 dark:text-slate-300">
          {posts.length} bài mới
        </span>
      </div>

      {loading && posts.length === 0 ? (
        <HubCard className="p-8 text-center text-slate-500 dark:text-slate-300">
          <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin" />
          Đang tải bài đăng cộng đồng...
        </HubCard>
      ) : posts.length === 0 ? (
        <HubCard className="border-dashed p-8 text-center text-slate-500 dark:text-slate-300">
          Chưa có bài đăng nào. Hãy là người mở màn cuộc trò chuyện.
        </HubCard>
      ) : (
        visiblePosts.map((post, index) => (
          <PostCard
            key={post.id}
            post={post}
            index={index}
            isOnline={isOnline}
            toggleLike={toggleLike}
            openComments={openComments}
            setOpenComments={setOpenComments}
            sharePost={sharePost}
            savedPostIds={savedPostIds}
            toggleSave={toggleSave}
            commentDrafts={commentDrafts}
            setCommentDrafts={setCommentDrafts}
            addComment={addComment}
          />
        ))
      )}

      {visiblePostCount < posts.length ? (
        <div
          ref={loadMoreRef}
          className="py-4 text-center text-sm text-slate-500 dark:text-slate-400"
        >
          Đang tải thêm bài viết...
        </div>
      ) : (
        <div ref={loadMoreRef} />
      )}
    </>
  );
}
