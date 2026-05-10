export type PostRow = {
  id: string;
  user_id?: string | null;
  username?: string | null;
  avatar_url?: string | null;
  content?: string | null;
  image_url?: string | null;
  created_at?: string | null;
};

export type CommentRow = {
  id: string;
  post_id: string;
  user_id?: string | null;
  username?: string | null;
  content?: string | null;
  created_at?: string | null;
};

export type LikeRow = {
  id?: string;
  post_id: string;
  user_id?: string | null;
  created_at?: string | null;
};

export type ChatMessageRow = {
  id: string;
  user_id?: string | null;
  username?: string | null;
  avatar_url?: string | null;
  content?: string | null;
  created_at?: string | null;
};

export type AnnouncementRow = {
  id: string;
  title?: string | null;
  content?: string | null;
  author_name?: string | null;
  created_at?: string | null;
};

export type FeedPost = PostRow & {
  comments: CommentRow[];
  likeCount: number;
  likedByMe: boolean;
};

export type ActiveMember = {
  key: string;
  userId?: string | null;
  name: string;
  avatar?: string | null;
  score: number;
  badge: string;
};
