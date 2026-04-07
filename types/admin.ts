// Feedback System Types
export interface Feedback {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  category: FeedbackCategory;
  status: FeedbackStatus;
  admin_reply: string | null;
  admin_id: string | null;
  created_at: string;
  updated_at: string;
}

export type FeedbackCategory =
  | "bug"
  | "feature"
  | "improvement"
  | "general"
  | "other";
export type FeedbackStatus = "pending" | "in_progress" | "resolved" | "closed";

export interface CreateFeedbackData {
  subject: string;
  message: string;
  category?: FeedbackCategory;
}

export interface UpdateFeedbackData {
  status?: FeedbackStatus;
  admin_reply?: string;
  admin_id?: string;
}

// Chat System Types
export interface Conversation {
  id: string;
  user_id: string;
  admin_id: string | null;
  status: ConversationStatus;
  last_message_at: string;
  created_at: string;
}

export type ConversationStatus = "active" | "archived" | "closed";

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface SendMessageData {
  conversation_id: string;
  receiver_id: string;
  message: string;
}

// Extended User type with role info
export interface UserWithRole {
  id: string;
  email: string;
  full_name: string;
  role_id: number;
  role_name: string;
  date_of_birth: string | null;
  created_at: string;
}

// Admin Dashboard Stats
export interface AdminStats {
  totalUsers: number;
  totalFeedback: number;
  pendingFeedback: number;
  activeConversations: number;
  unreadMessages: number;
}

// Conversation with latest message and user info
export interface ConversationWithDetails extends Conversation {
  user: {
    id: string;
    full_name: string;
    email: string;
  };
  latest_message?: Message;
  unread_count: number;
}

// Feedback with user info
export interface FeedbackWithUser extends Feedback {
  user: {
    id: string;
    full_name: string;
    email: string;
  };
  admin?: {
    id: string;
    full_name: string;
  };
}
