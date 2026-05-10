"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import { Radio, MessagesSquare, Sparkles } from "lucide-react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useAuth } from "@/contexts/AuthContext";
import { useOnlineUsers } from "@/hooks/useOnlineUsers";
import { useUserNotifications } from "@/hooks/useUserNotifications";
import { isUserAdmin } from "@/lib/authHelper";
import { storage } from "@/lib/firebase";
import { supabase } from "@/lib/supabase";
import { setRealtimeAuthFromSession } from "@/lib/realtimeAuth";
import { getUserProfile } from "@/lib/userService";

import { ActiveMember, ChatMessageRow } from "./types";
import { getDisplayName } from "./utils/formatters";
import { useCommunityFeed } from "./hooks/useCommunityFeed";
import { useRealtimeChat } from "./hooks/useRealtimeChat";
import { useAnnouncements } from "./hooks/useAnnouncements";

import { LeftSidebar } from "./components/layout/LeftSidebar";
import { RightSidebar } from "./components/layout/RightSidebar";
import { AnnouncementBar } from "./components/announcement/AnnouncementBar";
import { RealtimeChat } from "./components/realtime-chat/RealtimeChat";
import { PostComposer } from "./components/posts/PostComposer";
import { CommunityFeed } from "./components/posts/CommunityFeed";

export default function ForumPage() {
  const { user } = useAuth();
  const { onlineCount, connectionStatus, isOnline } = useOnlineUsers();
  const {
    notifications,
    visibleNotifications,
    unreadCount,
    dismissNotification,
    markAllAsSeen,
  } = useUserNotifications(user?.id);

  const {
    posts,
    setPosts,
    likes,
    loading,
    error,
    setError,
    loadFeed,
    toggleLike,
  } = useCommunityFeed(user?.id);
  const {
    chatMessages,
    setChatMessages,
    chatLoading,
    chatNotice,
    setChatNotice,
    sendingChat,
    setSendingChat,
    loadChat,
  } = useRealtimeChat(user?.id);
  const { announcements, loadAnnouncements } = useAnnouncements();

  // Refs to avoid stale closures in subscription callbacks
  const loadFeedRef = useRef(loadFeed);
  const loadAnnouncementsRef = useRef(loadAnnouncements);
  loadFeedRef.current = loadFeed;
  loadAnnouncementsRef.current = loadAnnouncements;

  // Realtime subscription — single stable channel, authenticated
  useEffect(() => {
    if (!user?.id) return;

    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function setupChannel() {
      // Set auth token first — required for postgres_changes to work
      await setRealtimeAuthFromSession();

      channel = supabase
        .channel("community-hub-live")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "community_messages" },
          (payload) => {
            const msg = payload.new as ChatMessageRow;
            setChatMessages((prev) => {
              if (prev.some((m) => m.id === msg.id)) return prev;
              return [...prev, msg].slice(-80);
            });
          },
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "posts" },
          () => void loadFeedRef.current(false),
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "comments" },
          () => void loadFeedRef.current(false),
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "likes" },
          () => void loadFeedRef.current(false),
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "community_announcements" },
          () => void loadAnnouncementsRef.current(),
        )
        .subscribe((status) => {
          console.log("[Forum Realtime] channel status:", status);
        });
    }

    void setupChannel();

    return () => {
      if (channel) void supabase.removeChannel(channel);
    };
  }, [user?.id]); // Only re-subscribe when user changes

  const [content, setContent] = useState("");
  const [chatDraft, setChatDraft] = useState("");
  const [announcementDraft, setAnnouncementDraft] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>(
    {},
  );
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [savedPostIds, setSavedPostIds] = useState<Set<string>>(new Set());
  const [visiblePostCount, setVisiblePostCount] = useState(6);
  const [submitting, setSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const postComposerRef = useRef<HTMLFormElement>(null);
  const postFileInputRef = useRef<HTMLInputElement>(null);
  const notificationRef = useRef<HTMLElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const [dbFullName, setDbFullName] = useState<string | null>(null);

  // Fetch username from DB (bảng users), fallback to Google metadata
  useEffect(() => {
    if (!user?.id) return;
    getUserProfile(user.id).then((profile) => {
      if (profile?.full_name) setDbFullName(profile.full_name);
    });
  }, [user?.id]);

  const username =
    dbFullName ??
    (user?.user_metadata?.full_name as string | undefined) ??
    (user?.user_metadata?.name as string | undefined) ??
    getDisplayName(user?.email);
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
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

  const initialScrollDoneRef = useRef(false);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    // Nếu mới load xong, force scroll xuống dưới cùng
    if (!chatLoading && !initialScrollDoneRef.current) {
      container.scrollTop = container.scrollHeight;
      if (chatMessages.length > 0) {
        initialScrollDoneRef.current = true;
      }
      return;
    }

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      150;
    if (isNearBottom) {
      container.scrollTop = container.scrollHeight;
    }
  }, [chatMessages.length, chatLoading]);

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
        setSavedPostIds(
          new Set(parsed.filter((item) => typeof item === "string")),
        );
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
      addMember(
        post.user_id || post.username,
        post.username,
        post.avatar_url,
        0,
        post.user_id,
      );
      post.comments.forEach((comment) => {
        addMember(
          comment.user_id || comment.username,
          comment.username,
          null,
          0,
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

    if (user?.id) addMember(user.id, username, avatarUrl, 0, user.id);

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
    const tags = textBlocks.flatMap(
      (text) => text.match(/#[^\s#.,!?;:()]+/g) ?? [],
    );
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
        { tag: "#301 VN Top 1", count: 12 },
        { tag: "#Pass LJPT N6", count: 9 },
        { tag: "#AI", count: 7 },
        { tag: "#StudyTips", count: 6 },
      ];
  }, [chatMessages, posts]);

  const communityNotifications = useMemo(() => {
    const latestComment = posts
      .flatMap((post) =>
        post.comments.map((comment) => ({
          id: `comment-${comment.id}`,
          icon: <span className="text-cyan-500">💬</span>,
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
          icon: <span className="text-amber-500">📢</span>,
          title: "Thông báo mới từ admin",
          description:
            announcements[0].title || announcements[0].content || "",
          createdAt: announcements[0].created_at,
          href: "#announcement",
        }
        : null,
      latestComment,
      latestLike && likedPost
        ? {
          id: `like-${latestLike.id || latestLike.post_id}`,
          icon: <span className="text-rose-500">❤️</span>,
          title: "Một bài viết vừa được thích",
          description: likedPost.content || "Có người vừa tương tác với feed",
          createdAt: latestLike.created_at,
          href: `#post-${likedPost.id}`,
        }
        : null,
      posts[0]
        ? {
          id: `post-${posts[0].id}`,
          icon: <span className="text-violet-500">✨</span>,
          title: `${posts[0].username || "Một thành viên"} vừa đăng bài`,
          description: posts[0].content || "Bài đăng mới trong cộng đồng",
          createdAt: posts[0].created_at,
          href: `#post-${posts[0].id}`,
        }
        : null,
      notifications[0]
        ? {
          id: notifications[0].id,
          icon: <span className="text-blue-500">🔔</span>,
          title: notifications[0].title,
          description: notifications[0].description,
          createdAt: notifications[0].createdAt,
          href: notifications[0].href,
        }
        : null,
    ]
      .filter(Boolean)
      .slice(0, 5) as Array<{
        id: string;
        icon: React.ReactNode;
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
      await loadFeed(false);
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
    setChatDraft("");
    setChatNotice(null);

    const { error: sendError } = await supabase
      .from("community_messages")
      .insert({
        user_id: user.id,
        username,
        avatar_url: avatarUrl ?? null,
        content: draft,
      });

    if (sendError) {
      setChatNotice(
        "Chưa thể gửi tin nhắn. Hãy kiểm tra bảng community_messages.",
      );
      // Khôi phục lại draft nếu lỗi
      setChatDraft(draft);
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
    await loadFeed(false);
  };

  const toggleSave = (postId: string) => {
    setSavedPostIds((current) => {
      const next = new Set(current);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
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
    postComposerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const triggerImageUpload = () => {
    scrollToPostComposer();
    window.setTimeout(() => postFileInputRef.current?.click(), 300);
  };

  const focusChat = () => {
    chatInputRef.current?.focus();
    chatInputRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
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
              LF Hub
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
          <LeftSidebar
            displayedOnlineCount={displayedOnlineCount}
            visibleOnlineMembers={visibleOnlineMembers}
            isOnline={isOnline}
            connectionStatus={connectionStatus}
            scrollToPostComposer={scrollToPostComposer}
            triggerImageUpload={triggerImageUpload}
            focusChat={focusChat}
            notificationRef={notificationRef}
            unreadCount={unreadCount}
          />

          <main className="space-y-5">
            <section id="announcement">
              <AnnouncementBar
                announcement={announcements[0]}
                isAdmin={isAdmin}
                announcementDraft={announcementDraft}
                setAnnouncementDraft={setAnnouncementDraft}
                createAnnouncement={createAnnouncement}
              />
            </section>

            <RealtimeChat
              chatLoading={chatLoading}
              chatMessages={chatMessages}
              chatNotice={chatNotice}
              chatDraft={chatDraft}
              setChatDraft={setChatDraft}
              sendChatMessage={sendChatMessage}
              sendingChat={sendingChat}
              displayedOnlineCount={displayedOnlineCount}
              username={username}
              currentUserId={user?.id}
              chatInputRef={chatInputRef}
              chatEndRef={chatEndRef}
              chatContainerRef={chatContainerRef}
              isOnline={isOnline}
            />

            <section className="space-y-4">
              <PostComposer
                postComposerRef={postComposerRef}
                createPost={createPost}
                username={username}
                avatarUrl={avatarUrl}
                userId={user?.id}
                content={content}
                setContent={setContent}
                previewUrl={previewUrl}
                setSelectedImage={setSelectedImage}
                postFileInputRef={postFileInputRef}
                handleImageChange={handleImageChange}
                submitting={submitting}
                selectedImage={selectedImage}
              />

              <CommunityFeed
                posts={posts}
                loading={loading}
                visiblePosts={visiblePosts}
                visiblePostCount={visiblePostCount}
                loadMoreRef={loadMoreRef}
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
            </section>
          </main>

          <RightSidebar
            notificationRef={notificationRef}
            unreadCount={unreadCount}
            notifications={visibleNotifications}
            dismissNotification={dismissNotification}
            markAllAsSeen={markAllAsSeen}
            trendingTopics={trendingTopics}
            activeMembers={activeMembers}
            isOnline={isOnline}
          />
        </div>
      </div>
    </div>
  );
}
