"use client";

import {
  ChangeEvent,
  FormEvent,
  ReactNode,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import {
  AtSign,
  Bell,
  Bookmark,
  Flame,
  Heart,
  ImageIcon,
  Loader2,
  Megaphone,
  MessageCircle,
  MessagesSquare,
  Pin,
  Plus,
  Radio,
  Reply,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Users,
  X,
  Zap,
} from "lucide-react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useOnlineUsers } from "@/hooks/useOnlineUsers";
import { useUserNotifications } from "@/hooks/useUserNotifications";
import { isUserAdmin } from "@/lib/authHelper";
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
  created_at?: string | null;
};

type ChatMessageRow = {
  id: string;
  user_id?: string | null;
  username?: string | null;
  avatar_url?: string | null;
  content?: string | null;
  created_at?: string | null;
};

type AnnouncementRow = {
  id: string;
  title?: string | null;
  content?: string | null;
  author_name?: string | null;
  created_at?: string | null;
};

type FeedPost = PostRow & {
  comments: CommentRow[];
  likeCount: number;
  likedByMe: boolean;
};

type ActiveMember = {
  key: string;
  userId?: string | null;
  name: string;
  avatar?: string | null;
  score: number;
  badge: string;
};

const fallbackAnnouncements: AnnouncementRow[] = [
  {
    id: "fallback-announcement-1",
    title: "Realtime community hub đã sẵn sàng",
    content:
      "Bạn có thể chat nhanh, đăng bài dài hơn và theo dõi hoạt động mới nhất trong một không gian chung.",
    author_name: "Learning Hub",
    created_at: new Date().toISOString(),
  },
];

const fallbackChatMessages: ChatMessageRow[] = [
  {
    id: "welcome-chat-1",
    username: "Learning Hub",
    content: "Chào mừng mọi người vào lounge chung. Có câu hỏi gì cứ thả vào đây nhé.",
    created_at: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
  },
  {
    id: "welcome-chat-2",
    username: "Community",
    content: "Ai đang ôn NextJS hoặc Supabase thì cùng trao đổi trong hub này.",
    created_at: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
  },
];

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
  const { onlineCount, connectionStatus, isOnline } = useOnlineUsers();
  const { notifications } = useUserNotifications(user?.id);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [likes, setLikes] = useState<LikeRow[]>([]);
  const [chatMessages, setChatMessages] =
    useState<ChatMessageRow[]>(fallbackChatMessages);
  const [announcements, setAnnouncements] =
    useState<AnnouncementRow[]>(fallbackAnnouncements);
  const [content, setContent] = useState("");
  const [chatDraft, setChatDraft] = useState("");
  const [announcementDraft, setAnnouncementDraft] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [savedPostIds, setSavedPostIds] = useState<Set<string>>(new Set());
  const [visiblePostCount, setVisiblePostCount] = useState(6);
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sendingChat, setSendingChat] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatNotice, setChatNotice] = useState<string | null>(null);

  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const postComposerRef = useRef<HTMLFormElement>(null);
  const postFileInputRef = useRef<HTMLInputElement>(null);
  const notificationRef = useRef<HTMLElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const username =
    (user?.user_metadata?.full_name as string | undefined) ??
    (user?.user_metadata?.name as string | undefined) ??
    getDisplayName(user?.email);
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const unreadCount = notifications.filter((item) => item.isUnread).length;

  const loadFeed = async () => {
    setLoading(true);
    setError(null);

    const { data: postRows, error: postsError } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (postsError) {
      setError(
        "Chưa thể tải bài đăng cộng đồng. Hãy kiểm tra bảng posts/comments/likes trong Supabase.",
      );
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
            user?.id && postLikes.some((like) => like.user_id === user.id),
          ),
        };
      }),
    );
    setLoading(false);
  };

  const loadChat = async () => {
    setChatLoading(true);
    const { data, error: chatError } = await supabase
      .from("community_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(60);

    if (chatError) {
      setChatNotice("Chat sẽ hoạt động sau khi tạo bảng community_messages.");
      setChatMessages(fallbackChatMessages);
    } else {
      setChatNotice(null);
      setChatMessages(((data ?? []) as ChatMessageRow[]).reverse());
    }

    setChatLoading(false);
  };

  const loadAnnouncements = async () => {
    const { data, error: announcementError } = await supabase
      .from("community_announcements")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(2);

    if (!announcementError && data?.length) {
      setAnnouncements(data as AnnouncementRow[]);
    }
  };

  useEffect(() => {
    void loadFeed();
    void loadChat();
    void loadAnnouncements();
  }, [user?.id]);

  useEffect(() => {
    let mounted = true;

    async function checkAdmin() {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      const adminStatus = await isUserAdmin();
      if (mounted) setIsAdmin(adminStatus);
    }

    void checkAdmin();

    return () => {
      mounted = false;
    };
  }, [user]);

  useEffect(() => {
    const channel = supabase
      .channel("community-hub-live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "community_messages" },
        (payload) => {
          setChatMessages((current) =>
            [...current, payload.new as ChatMessageRow].slice(-80),
          );
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        () => void loadFeed(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comments" },
        () => void loadFeed(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "likes" },
        () => void loadFeed(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "community_announcements" },
        () => void loadAnnouncements(),
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [user?.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chatMessages.length]);

  useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl(null);
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(selectedImage);
    setPreviewUrl(nextPreviewUrl);

    return () => URL.revokeObjectURL(nextPreviewUrl);
  }, [selectedImage]);

  useEffect(() => {
    const raw = window.localStorage.getItem("learning-hub:saved-forum-posts");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setSavedPostIds(new Set(parsed.filter((item) => typeof item === "string")));
      }
    } catch {
      setSavedPostIds(new Set());
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "learning-hub:saved-forum-posts",
      JSON.stringify(Array.from(savedPostIds)),
    );
  }, [savedPostIds]);

  useEffect(() => {
    setVisiblePostCount(6);
  }, [posts.length]);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setVisiblePostCount((count) => Math.min(count + 4, posts.length));
      }
    });

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [posts.length]);

  const activeMembers = useMemo(() => {
    const members: Record<string, ActiveMember> = {};

    const addMember = (
      key: string | null | undefined,
      name: string | null | undefined,
      avatar: string | null | undefined,
      score: number,
      userId?: string | null,
    ) => {
      const memberKey = key || name || "member";
      const existing = members[memberKey];
      members[memberKey] = {
        key: memberKey,
        userId,
        name: name || "Learning Hub member",
        avatar,
        score: (existing?.score ?? 0) + score,
        badge: existing?.badge ?? "Active now",
      };
    };

    posts.forEach((post) => {
      addMember(post.user_id || post.username, post.username, post.avatar_url, 3, post.user_id);
      post.comments.forEach((comment) => {
        addMember(
          comment.user_id || comment.username,
          comment.username,
          null,
          2,
          comment.user_id,
        );
      });
    });

    chatMessages.forEach((message) => {
      addMember(
        message.user_id || message.username,
        message.username,
        message.avatar_url,
        1,
        message.user_id,
      );
    });

    if (user?.id) {
      addMember(user.id, username, avatarUrl, 4, user.id);
    }

    return Object.values(members)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((member, index) => ({
        ...member,
        badge:
          index === 0
            ? "Top Contributor"
            : isOnline(member.userId || "")
              ? "Active now"
              : "Member",
      }));
  }, [avatarUrl, chatMessages, isOnline, posts, user?.id, username]);

  const onlineMembers = activeMembers.filter((member) =>
    member.userId ? isOnline(member.userId) : false,
  );
  const visibleOnlineMembers =
    onlineMembers.length > 0 ? onlineMembers : activeMembers.slice(0, 5);
  const displayedOnlineCount = Math.max(onlineCount, user?.id ? 1 : 0);

  const trendingTopics = useMemo(() => {
    const textBlocks = [
      ...posts.map((post) => post.content ?? ""),
      ...chatMessages.map((message) => message.content ?? ""),
    ];
    const tags = textBlocks.flatMap((text) => text.match(/#[^\s#.,!?;:()]+/g) ?? []);
    const tagCounts = tags.reduce<Record<string, number>>((acc, tag) => {
      acc[tag] = (acc[tag] ?? 0) + 1;
      return acc;
    }, {});

    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([tag, count]) => ({ tag, count }));

    return topTags.length > 0
      ? topTags
      : [
          { tag: "#NextJS", count: 12 },
          { tag: "#Supabase", count: 9 },
          { tag: "#AI", count: 7 },
          { tag: "#StudyTips", count: 6 },
        ];
  }, [chatMessages, posts]);

  const communityNotifications = useMemo(() => {
    const latestComment = posts
      .flatMap((post) =>
        post.comments.map((comment) => ({
          id: `comment-${comment.id}`,
          icon: <MessageCircle className="h-4 w-4 text-cyan-500" />,
          title: `${comment.username || "Một thành viên"} vừa bình luận`,
          description: post.content || "Một bài đăng có hoạt động mới",
          createdAt: comment.created_at,
          href: `#post-${post.id}`,
        })),
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() -
          new Date(a.createdAt ?? 0).getTime(),
      )[0];

    const latestLike = likes
      .slice()
      .sort(
        (a, b) =>
          new Date(b.created_at ?? 0).getTime() -
          new Date(a.created_at ?? 0).getTime(),
      )[0];
    const likedPost = latestLike
      ? posts.find((post) => post.id === latestLike.post_id)
      : null;

    return [
      announcements[0]
        ? {
            id: `announcement-${announcements[0].id}`,
            icon: <Megaphone className="h-4 w-4 text-amber-500" />,
            title: "Thông báo mới từ admin",
            description: announcements[0].title || announcements[0].content || "",
            createdAt: announcements[0].created_at,
            href: "#announcement",
          }
        : null,
      latestComment,
      latestLike && likedPost
        ? {
            id: `like-${latestLike.id || latestLike.post_id}`,
            icon: <Heart className="h-4 w-4 text-rose-500" />,
            title: "Một bài viết vừa được thích",
            description: likedPost.content || "Có người vừa tương tác với feed",
            createdAt: latestLike.created_at,
            href: `#post-${likedPost.id}`,
          }
        : null,
      posts[0]
        ? {
            id: `post-${posts[0].id}`,
            icon: <Sparkles className="h-4 w-4 text-violet-500" />,
            title: `${posts[0].username || "Một thành viên"} vừa đăng bài`,
            description: posts[0].content || "Bài đăng mới trong cộng đồng",
            createdAt: posts[0].created_at,
            href: `#post-${posts[0].id}`,
          }
        : null,
      notifications[0]
        ? {
            id: notifications[0].id,
            icon: <Bell className="h-4 w-4 text-blue-500" />,
            title: notifications[0].title,
            description: notifications[0].description,
            createdAt: notifications[0].createdAt,
            href: notifications[0].href,
          }
        : null,
    ].filter(Boolean).slice(0, 5) as Array<{
      id: string;
      icon: ReactNode;
      title: string;
      description: string;
      createdAt?: string | null;
      href: string;
    }>;
  }, [announcements, likes, notifications, posts]);

  const visiblePosts = posts.slice(0, visiblePostCount);

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

  const sendChatMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user?.id) {
      setChatNotice("Bạn cần đăng nhập để nhắn trong community chat.");
      return;
    }

    const draft = chatDraft.trim();
    if (!draft) return;

    setSendingChat(true);
    const { error: sendError } = await supabase.from("community_messages").insert({
      user_id: user.id,
      username,
      avatar_url: avatarUrl ?? null,
      content: draft,
    });

    if (sendError) {
      setChatNotice("Chưa thể gửi tin nhắn. Hãy kiểm tra bảng community_messages.");
    } else {
      setChatDraft("");
      setChatNotice(null);
    }

    setSendingChat(false);
  };

  const createAnnouncement = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isAdmin || !user?.id || !announcementDraft.trim()) return;

    const { error: announcementError } = await supabase
      .from("community_announcements")
      .insert({
        created_by: user.id,
        author_name: username,
        title: "Community update",
        content: announcementDraft.trim(),
      });

    if (!announcementError) {
      setAnnouncementDraft("");
      await loadAnnouncements();
    }
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
              likeCount: Math.max(0, item.likeCount + (item.likedByMe ? -1 : 1)),
            }
          : item,
      ),
    );

    if (post.likedByMe) {
      await supabase
        .from("likes")
        .delete()
        .match({ post_id: post.id, user_id: user.id });
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
    setOpenComments((current) => ({ ...current, [postId]: true }));
    await loadFeed();
  };

  const toggleSave = (postId: string) => {
    setSavedPostIds((current) => {
      const next = new Set(current);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  };

  const sharePost = async (postId: string) => {
    const url = `${window.location.origin}/forum#post-${postId}`;

    if (navigator.share) {
      await navigator.share({ title: "Learning Hub Community", url });
      return;
    }

    await navigator.clipboard.writeText(url);
  };

  const scrollToPostComposer = () => {
    postComposerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const triggerImageUpload = () => {
    scrollToPostComposer();
    window.setTimeout(() => postFileInputRef.current?.click(), 300);
  };

  const focusChat = () => {
    chatInputRef.current?.focus();
    chatInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <div className="mx-auto max-w-[1500px]">
        <motion.div
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6 flex flex-col justify-between gap-4 rounded-[2rem] border border-white/70 bg-white/75 p-5 shadow-xl shadow-slate-200/70 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] dark:shadow-black/30 md:flex-row md:items-end"
        >
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.18)]" />
              Community Hub
            </div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Cộng Đồng
            </h1>
            <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
              Nơi mọi người chia sẻ kiến thức, tán gẫu và kết nối.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 dark:bg-white/10">
              <Radio className="h-4 w-4 text-emerald-500" />
              {displayedOnlineCount} online now
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 dark:bg-white/10">
              <MessagesSquare className="h-4 w-4 text-cyan-500" />
              {chatMessages.length} tin nhắn
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 dark:bg-white/10">
              <Sparkles className="h-4 w-4 text-violet-500" />
              {posts.length} bài viết
            </div>
          </div>
        </motion.div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm text-rose-700 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[260px_minmax(0,1fr)_310px]">
          <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
            <HubCard className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Online now
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_5px_rgba(16,185,129,0.16)]" />
                    <span className="text-2xl font-bold">{displayedOnlineCount}</span>
                  </div>
                </div>
                <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300">
                  <Users className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-5 flex -space-x-2">
                {visibleOnlineMembers.slice(0, 6).map((member) => (
                  <Avatar
                    key={member.key}
                    name={member.name}
                    src={member.avatar}
                    size="sm"
                    online={Boolean(member.userId && isOnline(member.userId))}
                  />
                ))}
              </div>

              <div className="mt-5 rounded-2xl bg-slate-100/80 px-4 py-3 text-sm text-slate-600 dark:bg-white/[0.06] dark:text-slate-300">
                {connectionStatus === "connected"
                  ? "Hub đang nhận presence realtime."
                  : "Đang đồng bộ trạng thái online..."}
              </div>
            </HubCard>

            <HubCard className="p-3">
              <button
                type="button"
                onClick={scrollToPostComposer}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium transition hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <Plus className="h-4 w-4 text-cyan-500" />
                Create Post
              </button>
              <button
                type="button"
                onClick={triggerImageUpload}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium transition hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <ImageIcon className="h-4 w-4 text-violet-500" />
                Upload Image
              </button>
              <button
                type="button"
                onClick={focusChat}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium transition hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <Reply className="h-4 w-4 text-emerald-500" />
                Start Discussion
              </button>
              <button
                type="button"
                onClick={() =>
                  notificationRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  })
                }
                className="flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm font-medium transition hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <span className="inline-flex items-center gap-3">
                  <Bell className="h-4 w-4 text-amber-500" />
                  Notifications
                </span>
                {unreadCount > 0 ? (
                  <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                ) : null}
              </button>
            </HubCard>
          </aside>

          <main className="space-y-5">
            <section id="announcement">
              <HubCard className="overflow-hidden p-0">
                <div className="border border-transparent bg-gradient-to-r from-amber-200/70 via-cyan-200/70 to-violet-200/70 p-[1px] dark:from-amber-400/30 dark:via-cyan-400/30 dark:to-violet-400/30">
                  <div className="rounded-[1.4rem] bg-white/90 p-5 dark:bg-slate-950/85">
                    <div className="flex items-start gap-4">
                      <div className="rounded-2xl bg-amber-100 p-3 text-amber-700 dark:bg-amber-400/15 dark:text-amber-200">
                        <Pin className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-300">
                            Admin announcement
                          </span>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-white/10 dark:text-slate-300">
                            pinned
                          </span>
                        </div>
                        <h2 className="mt-2 text-lg font-bold text-slate-950 dark:text-white">
                          {announcements[0]?.title || "Community update"}
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                          {announcements[0]?.content ||
                            "Mọi thông báo quan trọng của cộng đồng sẽ xuất hiện ở đây."}
                        </p>
                        <p className="mt-3 text-xs text-slate-400">
                          {announcements[0]?.author_name || "Admin"} ·{" "}
                          {formatTimeAgo(announcements[0]?.created_at)}
                        </p>
                      </div>
                    </div>

                    {isAdmin ? (
                      <form
                        onSubmit={createAnnouncement}
                        className="mt-4 flex gap-2 rounded-2xl bg-slate-100/80 p-2 dark:bg-white/[0.06]"
                      >
                        <Textarea
                          value={announcementDraft}
                          onChange={(event) => setAnnouncementDraft(event.target.value)}
                          placeholder="Đăng thông báo cho toàn cộng đồng..."
                          className="min-h-10 resize-none rounded-xl border-0 bg-transparent focus-visible:ring-1 focus-visible:ring-amber-400"
                        />
                        <Button
                          type="submit"
                          size="icon"
                          className="h-10 w-10 shrink-0 rounded-xl bg-amber-500 text-white hover:bg-amber-600"
                          aria-label="Đăng announcement"
                        >
                          <Megaphone className="h-4 w-4" />
                        </Button>
                      </form>
                    ) : null}
                  </div>
                </div>
              </HubCard>
            </section>

            <HubCard className="overflow-hidden p-0">
              <div className="flex items-center justify-between border-b border-slate-200/80 px-5 py-4 dark:border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <h2 className="font-semibold">Realtime community chat</h2>
                  </div>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Lounge chung cho hỏi nhanh, tán gẫu và phản hồi tức thì.
                  </p>
                </div>
                <div className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-white/10 dark:text-slate-300 sm:block">
                  {displayedOnlineCount} active
                </div>
              </div>

              <div className="max-h-[460px] overflow-y-auto px-5 py-4">
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

                    return (
                      <div
                        key={message.id}
                        className={`group flex gap-3 rounded-2xl px-2 py-2 transition hover:bg-slate-100/80 dark:hover:bg-white/[0.06] ${
                          grouped ? "mt-0" : "mt-3"
                        }`}
                      >
                        {grouped ? (
                          <div className="w-9 shrink-0" />
                        ) : (
                          <Avatar
                            name={message.username || "Member"}
                            src={message.avatar_url}
                            size="sm"
                            online={Boolean(message.user_id && isOnline(message.user_id))}
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          {!grouped ? (
                            <div className="mb-1 flex flex-wrap items-center gap-2">
                              <span className="font-medium text-slate-950 dark:text-white">
                                {message.username || "Learning Hub member"}
                              </span>
                              <span className="text-xs text-slate-400">
                                {formatTimeAgo(message.created_at)}
                              </span>
                            </div>
                          ) : null}
                          <p className="inline-block rounded-2xl bg-slate-100 px-3 py-2 text-sm leading-6 text-slate-700 transition group-hover:bg-white dark:bg-white/[0.07] dark:text-slate-200 dark:group-hover:bg-white/[0.1]">
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

            <section className="space-y-4">
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

              <motion.form
                ref={postComposerRef}
                onSubmit={createPost}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="rounded-[1.5rem] border border-white/70 bg-white/85 p-4 shadow-lg shadow-slate-200/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] dark:shadow-black/30"
              >
                <div className="flex gap-3">
                  <Avatar name={username} src={avatarUrl} />
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

              {loading ? (
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
                  <motion.article
                    id={`post-${post.id}`}
                    key={post.id}
                    initial={{ y: 24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.04 }}
                    className="rounded-[1.5rem] border border-white/70 bg-white/85 p-5 shadow-lg shadow-slate-200/60 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:shadow-xl dark:border-white/10 dark:bg-white/[0.06] dark:shadow-black/30"
                  >
                    <div className="flex gap-4">
                      <Avatar
                        name={post.username || "Learning Hub member"}
                        src={post.avatar_url}
                        online={Boolean(post.user_id && isOnline(post.user_id))}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-slate-950 dark:text-white">
                            {post.username || "Learning Hub member"}
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
                                <Avatar
                                  name={comment.username || "Member"}
                                  size="xs"
                                />
                                <div className="min-w-0">
                                  <span className="font-medium text-slate-900 dark:text-white">
                                    {comment.username || "Member"}
                                  </span>{" "}
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
            </section>
          </main>

          <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
            <HubCard ref={notificationRef} className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-blue-500" />
                  <h2 className="font-semibold">Notification Center</h2>
                </div>
                {unreadCount > 0 ? (
                  <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs text-white">
                    {unreadCount}
                  </span>
                ) : null}
              </div>

              <div className="space-y-3">
                {communityNotifications.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    className="group flex gap-3 rounded-2xl p-2 transition hover:bg-slate-100 dark:hover:bg-white/10"
                  >
                    <div className="mt-0.5 rounded-xl bg-white p-2 shadow-sm dark:bg-white/10">
                      {item.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="line-clamp-1 text-sm font-medium">
                          {item.title}
                        </p>
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                      </div>
                      <p className="line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        {item.description}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-400">
                        {formatTimeAgo(item.createdAt)}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </HubCard>

            <HubCard className="p-5">
              <div className="mb-4 flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <h2 className="font-semibold">Trending Topics</h2>
              </div>
              <div className="space-y-2">
                {trendingTopics.map((topic) => (
                  <div
                    key={topic.tag}
                    className="flex items-center justify-between rounded-2xl bg-slate-100/80 px-3 py-2 transition hover:bg-cyan-50 dark:bg-white/[0.06] dark:hover:bg-cyan-400/10"
                  >
                    <span className="font-medium text-slate-800 dark:text-slate-100">
                      {topic.tag}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {topic.count}
                    </span>
                  </div>
                ))}
              </div>
            </HubCard>

            <HubCard className="p-5">
              <div className="mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-emerald-500" />
                <h2 className="font-semibold">Active Members</h2>
              </div>
              <div className="space-y-3">
                {activeMembers.slice(0, 6).map((member, index) => (
                  <div key={member.key} className="flex items-center gap-3">
                    <Avatar
                      name={member.name}
                      src={member.avatar}
                      size="sm"
                      online={Boolean(member.userId && isOnline(member.userId))}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">
                        {member.name}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                        {index === 0 ? (
                          <ShieldCheck className="h-3 w-3 text-amber-500" />
                        ) : member.badge === "Active now" ? (
                          <Zap className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <AtSign className="h-3 w-3" />
                        )}
                        {index === 0 ? "Top Contributor" : member.badge}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </HubCard>
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
  online = false,
}: {
  name: string;
  src?: string | null;
  size?: "xs" | "sm" | "md";
  online?: boolean;
}) {
  const sizeClass =
    size === "xs"
      ? "h-6 w-6 text-[10px]"
      : size === "sm"
        ? "h-9 w-9 text-xs"
        : "h-12 w-12 text-sm";

  return (
    <div className="relative shrink-0">
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizeClass} rounded-full object-cover ring-2 ring-white/80 dark:ring-white/10`}
        />
      ) : (
        <div
          className={`${sizeClass} flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 font-bold text-white shadow-lg shadow-cyan-500/20`}
        >
          {getInitials(name)}
        </div>
      )}
      {online ? (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-950" />
      ) : null}
    </div>
  );
}

const HubCard = forwardRef<HTMLElement, {
  children: ReactNode;
  className?: string;
}>(function HubCard({ children, className = "" }, ref) {
  return (
    <section
      ref={ref}
      className={`rounded-[1.5rem] border border-white/70 bg-white/80 shadow-lg shadow-slate-200/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] dark:shadow-black/30 ${className}`}
    >
      {children}
    </section>
  );
});

function ActionButton({
  active,
  icon,
  label,
  text,
  onClick,
}: {
  active?: boolean;
  icon: ReactNode;
  label?: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-all hover:-translate-y-0.5 ${
        active
          ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-200"
          : "bg-slate-100 text-slate-600 hover:bg-cyan-50 hover:text-cyan-700 dark:bg-white/[0.06] dark:text-slate-300 dark:hover:bg-cyan-400/10 dark:hover:text-cyan-200"
      }`}
    >
      {icon}
      <span>{text}</span>
      {label ? <span className="text-xs opacity-70">{label}</span> : null}
    </button>
  );
}
