"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Flame,
  Heart,
  ImageIcon,
  Loader2,
  MessageCircle,
  Plus,
  Send,
  Share2,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { storage } from "@/lib/firebase";
import { supabase } from "@/lib/supabase";

type PostRow = {
  id: string;
  user_id?: string | null;
  username?: string | null;
  avatar_url?: string | null;
  content?: string | null;
  image_url?: string | null;
  created_at?: string | null;
};

type CommentRow = {
  id: string;
  post_id: string;
  user_id?: string | null;
  username?: string | null;
  content?: string | null;
  created_at?: string | null;
};

type LikeRow = {
  id?: string;
  post_id: string;
  user_id?: string | null;
};

type FeedPost = PostRow & {
  comments: CommentRow[];
  likeCount: number;
  likedByMe: boolean;
};

const formatTimeAgo = (value?: string | null) => {
  if (!value) return "vừa xong";

  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.max(1, Math.floor(diff / 60000));

  if (minutes < 60) return `${minutes} phút trước`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)} giờ trước`;
  return `${Math.floor(minutes / 1440)} ngày trước`;
};

const getDisplayName = (email?: string | null) => {
  if (!email) return "Learning Hub member";
  return email.split("@")[0] ?? "Learning Hub member";
};

const getInitials = (name?: string | null) =>
  (name || "LH")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function ForumPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const username =
    (user?.user_metadata?.full_name as string | undefined) ??
    (user?.user_metadata?.name as string | undefined) ??
    getDisplayName(user?.email);
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;

  const loadFeed = async () => {
    setLoading(true);
    setError(null);

    const { data: postRows, error: postsError } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (postsError) {
      setError("Chưa thể tải community feed. Hãy kiểm tra bảng posts/comments/likes trong Supabase.");
      setLoading(false);
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
    const likes = (likeRows ?? []) as LikeRow[];

    setPosts(
      normalizedPosts.map((post) => {
        const postLikes = likes.filter((like) => like.post_id === post.id);

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
          likedByMe: Boolean(user?.id && postLikes.some((like) => like.user_id === user.id)),
        };
      }),
    );
    setLoading(false);
  };

  useEffect(() => {
    void loadFeed();
  }, [user?.id]);

  useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl(null);
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(selectedImage);
    setPreviewUrl(nextPreviewUrl);

    return () => URL.revokeObjectURL(nextPreviewUrl);
  }, [selectedImage]);

  const trendingTopics = useMemo(() => {
    const tags = posts.flatMap((post) => post.content?.match(/#[^\s#.,!?;:()]+/g) ?? []);
    const tagCounts = tags.reduce<Record<string, number>>((acc, tag) => {
      acc[tag] = (acc[tag] ?? 0) + 1;
      return acc;
    }, {});

    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));

    return topTags.length > 0
      ? topTags
      : [
          { tag: "#NextJS", count: 12 },
          { tag: "#Supabase", count: 9 },
          { tag: "#Japanese", count: 7 },
          { tag: "#StudyTips", count: 6 },
        ];
  }, [posts]);

  const activeMembers = useMemo(() => {
    const members = posts.reduce<Record<string, { name: string; avatar?: string | null; score: number }>>(
      (acc, post) => {
        const key = post.user_id || post.username || post.id;
        const name = post.username || "Learning Hub member";
        acc[key] = {
          name,
          avatar: post.avatar_url,
          score: (acc[key]?.score ?? 0) + 1 + post.comments.length,
        };
        return acc;
      },
      {},
    );

    return Object.values(members)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [posts]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setSelectedImage(file);
  };

  const uploadPostImage = async () => {
    if (!selectedImage || !user?.id) return null;

    const extension = selectedImage.name.split(".").pop() || "jpg";
    const imageRef = ref(
      storage,
      `community-posts/${user.id}/${Date.now()}.${extension}`,
    );

    await uploadBytes(imageRef, selectedImage);
    return getDownloadURL(imageRef);
  };

  const createPost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user?.id) {
      setError("Bạn cần đăng nhập để tạo bài viết.");
      return;
    }

    if (!content.trim() && !selectedImage) return;

    setSubmitting(true);
    setError(null);

    const imageUrl = await uploadPostImage();
    const { error: insertError } = await supabase.from("posts").insert({
      user_id: user.id,
      username,
      avatar_url: avatarUrl ?? null,
      content: content.trim(),
      image_url: imageUrl,
    });

    if (insertError) {
      setError("Không thể tạo bài viết lúc này.");
    } else {
      setContent("");
      setSelectedImage(null);
      await loadFeed();
    }

    setSubmitting(false);
  };

  const toggleLike = async (post: FeedPost) => {
    if (!user?.id) {
      setError("Bạn cần đăng nhập để like bài viết.");
      return;
    }

    setPosts((currentPosts) =>
      currentPosts.map((item) =>
        item.id === post.id
          ? {
              ...item,
              likedByMe: !item.likedByMe,
              likeCount: item.likeCount + (item.likedByMe ? -1 : 1),
            }
          : item,
      ),
    );

    if (post.likedByMe) {
      await supabase.from("likes").delete().match({ post_id: post.id, user_id: user.id });
    } else {
      await supabase.from("likes").insert({ post_id: post.id, user_id: user.id });
    }
  };

  const addComment = async (postId: string) => {
    if (!user?.id) {
      setError("Bạn cần đăng nhập để bình luận.");
      return;
    }

    const draft = commentDrafts[postId]?.trim();
    if (!draft) return;

    const { error: commentError } = await supabase.from("comments").insert({
      post_id: postId,
      user_id: user.id,
      username,
      content: draft,
    });

    if (commentError) {
      setError("Không thể gửi bình luận lúc này.");
      return;
    }

    setCommentDrafts((drafts) => ({ ...drafts, [postId]: "" }));
    await loadFeed();
  };

  const sharePost = async (postId: string) => {
    const url = `${window.location.origin}/forum#post-${postId}`;

    if (navigator.share) {
      await navigator.share({ title: "Learning Hub Community", url });
      return;
    }

    await navigator.clipboard.writeText(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 transition-colors dark:bg-slate-950">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/70 bg-white/70 px-4 py-2 text-sm font-medium text-cyan-700 shadow-sm backdrop-blur dark:border-cyan-400/20 dark:bg-white/5 dark:text-cyan-200">
            <Sparkles className="h-4 w-4" />
            Community Feed
          </div>
          <h1 className="mt-4 text-4xl font-bold text-slate-950 dark:text-white">
            Cộng Đồng
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Nơi mọi người chia sẻ kiến thức, tán gẫu và kết nối.
          </p>
        </motion.div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm text-rose-700 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <main className="space-y-6">
            <motion.form
              onSubmit={createPost}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="rounded-3xl border border-white/70 bg-white/75 p-5 shadow-xl shadow-slate-200/60 backdrop-blur-xl transition-all dark:border-white/10 dark:bg-white/[0.06] dark:shadow-black/30"
            >
              <div className="flex gap-4">
                <Avatar name={username} src={avatarUrl} />
                <div className="min-w-0 flex-1">
                  <Textarea
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    placeholder="Chia sẻ điều bạn vừa học được..."
                    className="min-h-28 resize-none rounded-2xl border-slate-200 bg-white/70 text-base transition focus-visible:ring-cyan-500 dark:border-white/10 dark:bg-slate-950/40"
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
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:text-cyan-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:text-cyan-200">
                      <ImageIcon className="h-4 w-4" />
                      Upload ảnh
                      <input
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

            {loading ? (
              <div className="rounded-3xl border border-white/70 bg-white/70 p-8 text-center text-slate-500 shadow-lg backdrop-blur dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300">
                <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin" />
                Đang tải bài đăng cộng đồng...
              </div>
            ) : posts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white/60 p-8 text-center text-slate-500 backdrop-blur dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
                Chưa có bài đăng nào. Hãy là người mở màn cuộc trò chuyện.
              </div>
            ) : (
              posts.map((post, index) => (
                <motion.article
                  id={`post-${post.id}`}
                  key={post.id}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.06 }}
                  className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-lg shadow-slate-200/60 backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-2xl dark:border-white/10 dark:bg-white/[0.06] dark:shadow-black/30"
                >
                  <div className="flex gap-4">
                    <Avatar
                      name={post.username || "Learning Hub member"}
                      src={post.avatar_url}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-semibold text-slate-950 dark:text-white">
                          {post.username || "Learning Hub member"}
                        </h2>
                        <span className="text-sm text-slate-400">•</span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {formatTimeAgo(post.created_at)}
                        </span>
                      </div>

                      <p className="mt-3 whitespace-pre-wrap text-slate-700 dark:text-slate-200">
                        {post.content}
                      </p>

                      {post.image_url ? (
                        <div className="mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-slate-900">
                          <img
                            src={post.image_url}
                            alt="Ảnh bài đăng cộng đồng"
                            className="max-h-[520px] w-full object-cover transition duration-500 hover:scale-[1.02]"
                          />
                        </div>
                      ) : null}

                      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-4 dark:border-white/10">
                        <ActionButton
                          active={post.likedByMe}
                          icon={<Heart className="h-4 w-4" />}
                          label={`Like ${post.likeCount}`}
                          onClick={() => void toggleLike(post)}
                        />
                        <ActionButton
                          icon={<MessageCircle className="h-4 w-4" />}
                          label={`Comment ${post.comments.length}`}
                          onClick={() =>
                            setOpenComments((current) => ({
                              ...current,
                              [post.id]: !current[post.id],
                            }))
                          }
                        />
                        <ActionButton
                          icon={<Share2 className="h-4 w-4" />}
                          label="Share"
                          onClick={() => void sharePost(post.id)}
                        />
                      </div>

                      {openComments[post.id] ? (
                        <div className="mt-4 space-y-3 rounded-2xl bg-slate-100/70 p-4 dark:bg-slate-950/40">
                          {post.comments.map((comment) => (
                            <div key={comment.id} className="flex gap-3">
                              <Avatar
                                name={comment.username || "Member"}
                                size="sm"
                              />
                              <div className="rounded-2xl bg-white px-4 py-2 text-sm shadow-sm dark:bg-white/10">
                                <div className="font-medium text-slate-900 dark:text-white">
                                  {comment.username || "Member"}
                                </div>
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
              ))
            )}
          </main>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <SidebarPanel
              title="Trending topics"
              icon={<Flame className="h-5 w-5 text-orange-500" />}
            >
              <div className="space-y-3">
                {trendingTopics.map((topic) => (
                  <div
                    key={topic.tag}
                    className="flex items-center justify-between rounded-2xl bg-slate-100/80 px-4 py-3 transition hover:-translate-y-0.5 hover:bg-cyan-50 dark:bg-white/[0.06] dark:hover:bg-cyan-400/10"
                  >
                    <span className="font-medium text-slate-800 dark:text-slate-100">
                      {topic.tag}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {topic.count} bài
                    </span>
                  </div>
                ))}
              </div>
            </SidebarPanel>

            <SidebarPanel
              title="Active members"
              icon={<Users className="h-5 w-5 text-cyan-500" />}
            >
              <div className="space-y-3">
                {activeMembers.length > 0 ? (
                  activeMembers.map((member) => (
                    <div key={member.name} className="flex items-center gap-3">
                      <Avatar name={member.name} src={member.avatar} size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium text-slate-900 dark:text-white">
                          {member.name}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {member.score} tương tác
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Thành viên tích cực sẽ xuất hiện khi feed có bài đăng.
                  </p>
                )}
              </div>
            </SidebarPanel>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Avatar({
  name,
  src,
  size = "md",
}: {
  name: string;
  src?: string | null;
  size?: "sm" | "md";
}) {
  const sizeClass = size === "sm" ? "h-9 w-9 text-xs" : "h-12 w-12 text-sm";

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClass} shrink-0 rounded-full object-cover ring-2 ring-white/80 dark:ring-white/10`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-fuchsia-500 font-bold text-white shadow-lg shadow-cyan-500/20`}
    >
      {getInitials(name)}
    </div>
  );
}

function ActionButton({
  active,
  icon,
  label,
  onClick,
}: {
  active?: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all hover:-translate-y-0.5 ${
        active
          ? "bg-rose-100 text-rose-600 dark:bg-rose-400/15 dark:text-rose-300"
          : "bg-slate-100 text-slate-600 hover:bg-cyan-50 hover:text-cyan-700 dark:bg-white/[0.06] dark:text-slate-300 dark:hover:bg-cyan-400/10 dark:hover:text-cyan-200"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function SidebarPanel({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ x: 30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="rounded-3xl border border-white/70 bg-white/75 p-5 shadow-lg shadow-slate-200/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] dark:shadow-black/30"
    >
      <div className="mb-4 flex items-center gap-2">
        {icon}
        <h2 className="font-semibold text-slate-950 dark:text-white">{title}</h2>
      </div>
      {children}
    </motion.section>
  );
}
