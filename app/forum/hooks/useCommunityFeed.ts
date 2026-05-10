import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { FeedPost, PostRow, CommentRow, LikeRow } from "../types";

export function useCommunityFeed(userId: string | undefined) {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [likes, setLikes] = useState<LikeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFeed = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);

    const { data: postRows, error: postsError } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (postsError) {
      setError(
        "Chưa thể tải bài đăng cộng đồng. Hãy kiểm tra bảng posts/comments/likes trong Supabase.",
      );
      if (showLoading) setLoading(false);
      return;
    }

    const normalizedPosts = (postRows ?? []) as PostRow[];
    const postIds = normalizedPosts.map((post) => post.id);

    const [{ data: commentRows }, { data: likeRows }] =
      postIds.length > 0
        ? await Promise.all([
            supabase.from("comments").select("*").in("post_id", postIds),
            supabase.from("likes").select("*").in("post_id", postIds),
          ])
        : [{ data: [] }, { data: [] }];

    const comments = (commentRows ?? []) as CommentRow[];
    const nextLikes = (likeRows ?? []) as LikeRow[];
    setLikes(nextLikes);

    setPosts(
      normalizedPosts.map((post) => {
        const postLikes = nextLikes.filter((like) => like.post_id === post.id);

        return {
          ...post,
          comments: comments
            .filter((comment) => comment.post_id === post.id)
            .sort(
              (a, b) =>
                new Date(a.created_at ?? 0).getTime() -
                new Date(b.created_at ?? 0).getTime(),
            ),
          likeCount: postLikes.length,
          likedByMe: Boolean(
            userId && postLikes.some((like) => like.user_id === userId),
          ),
        };
      }),
    );
    if (showLoading) setLoading(false);
  }, [userId]);

  useEffect(() => {
    void loadFeed();
  }, [userId]);

  const toggleLike = async (post: FeedPost) => {
    if (!userId) {
      setError("Bạn cần đăng nhập để like bài viết.");
      return;
    }

    setPosts((currentPosts) =>
      currentPosts.map((item) =>
        item.id === post.id
          ? {
              ...item,
              likedByMe: !item.likedByMe,
              likeCount: Math.max(
                0,
                item.likeCount + (item.likedByMe ? -1 : 1),
              ),
            }
          : item,
      ),
    );

    if (post.likedByMe) {
      await supabase
        .from("likes")
        .delete()
        .match({ post_id: post.id, user_id: userId });
    } else {
      await supabase
        .from("likes")
        .insert({ post_id: post.id, user_id: userId });
    }
  };

  return { posts, setPosts, likes, loading, error, setError, loadFeed, toggleLike };
}
