-- ============================================
-- ADMIN DASHBOARD FEATURES - DATABASE SETUP
-- ============================================
-- Features: User Management, Feedback System, Real-time Chat
-- Created: 2026-04-07

-- ============================================
-- 1. FEEDBACK SYSTEM
-- ============================================

-- Add ban flag for user moderation
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS is_banned BOOLEAN NOT NULL DEFAULT FALSE;

-- Tạo bảng feedback
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL CHECK (char_length(subject) >= 3 AND char_length(subject) <= 200),
    message TEXT NOT NULL CHECK (char_length(message) >= 10 AND char_length(message) <= 5000),
    category TEXT DEFAULT 'general' CHECK (category IN ('bug', 'feature', 'improvement', 'general', 'other')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed')),
    admin_reply TEXT,
    admin_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes cho performance
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON public.feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON public.feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_category ON public.feedback(category);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON public.feedback(created_at DESC);

-- Comment
COMMENT ON TABLE public.feedback IS 'User feedback and suggestions for admin';
COMMENT ON COLUMN public.feedback.category IS 'bug, feature, improvement, general, other';
COMMENT ON COLUMN public.feedback.status IS 'pending, in_progress, resolved, closed';

-- ============================================
-- 2. REAL-TIME CHAT SYSTEM
-- ============================================

-- Tạo bảng conversations
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'closed')),
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Tạo bảng messages
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL CHECK (char_length(message) >= 1 AND char_length(message) <= 2000),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes cho performance
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_admin_id ON public.conversations(admin_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON public.conversations(last_message_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON public.messages(is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

-- Comment
COMMENT ON TABLE public.conversations IS 'Chat conversations between users and admin';
COMMENT ON TABLE public.messages IS 'Chat messages in conversations';

-- ============================================
-- 3. TRIGGERS
-- ============================================

-- Trigger: Auto-update feedback updated_at
CREATE OR REPLACE FUNCTION public.update_feedback_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_feedback_updated ON public.feedback;
CREATE TRIGGER on_feedback_updated
    BEFORE UPDATE ON public.feedback
    FOR EACH ROW
    EXECUTE FUNCTION public.update_feedback_timestamp();

-- Trigger: Auto-update conversation last_message_at when new message
CREATE OR REPLACE FUNCTION public.update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.conversations
    SET last_message_at = NOW()
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_message_created ON public.messages;
CREATE TRIGGER on_message_created
    AFTER INSERT ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_conversation_timestamp();

-- ============================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create their own feedback" ON public.feedback;
DROP POLICY IF EXISTS "Users can view their own feedback" ON public.feedback;
DROP POLICY IF EXISTS "Admins can view all feedback" ON public.feedback;
DROP POLICY IF EXISTS "Admins can update feedback" ON public.feedback;

DROP POLICY IF EXISTS "Users can view their own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Admins can view all conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can create conversation" ON public.conversations;

DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Admins can view all messages" ON public.messages;

-- ============================================
-- FEEDBACK POLICIES
-- ============================================

-- Users can create their own feedback
CREATE POLICY "Users can create their own feedback"
    ON public.feedback
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Users can view their own feedback
CREATE POLICY "Users can view their own feedback"
    ON public.feedback
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Admins can view all feedback
CREATE POLICY "Admins can view all feedback"
    ON public.feedback
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users u
            JOIN public.roles r ON u.role_id = r.id
            WHERE u.id = auth.uid() AND r.name = 'admin'
        )
    );

-- Admins can update feedback (status, reply)
CREATE POLICY "Admins can update feedback"
    ON public.feedback
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users u
            JOIN public.roles r ON u.role_id = r.id
            WHERE u.id = auth.uid() AND r.name = 'admin'
        )
    );

-- ============================================
-- CONVERSATION POLICIES
-- ============================================

-- Users can view their own conversations
CREATE POLICY "Users can view their own conversations"
    ON public.conversations
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Admins can view all conversations
CREATE POLICY "Admins can view all conversations"
    ON public.conversations
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users u
            JOIN public.roles r ON u.role_id = r.id
            WHERE u.id = auth.uid() AND r.name = 'admin'
        )
    );

-- Users can create conversation (auto-create on first message)
CREATE POLICY "Users can create conversation"
    ON public.conversations
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Admins can update conversations
CREATE POLICY "Admins can update conversations"
    ON public.conversations
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users u
            JOIN public.roles r ON u.role_id = r.id
            WHERE u.id = auth.uid() AND r.name = 'admin'
        )
    );

-- ============================================
-- MESSAGE POLICIES
-- ============================================

-- Users can view messages in their conversations
CREATE POLICY "Users can view messages in their conversations"
    ON public.messages
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.conversations c
            WHERE c.id = conversation_id AND c.user_id = auth.uid()
        )
    );

-- Users can send messages (only in their own conversation)
CREATE POLICY "Users can send messages"
    ON public.messages
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = sender_id
        AND EXISTS (
            SELECT 1 FROM public.conversations c
            WHERE c.id = conversation_id AND c.user_id = auth.uid()
        )
    );

-- Admins can view all messages
CREATE POLICY "Admins can view all messages"
    ON public.messages
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users u
            JOIN public.roles r ON u.role_id = r.id
            WHERE u.id = auth.uid() AND r.name = 'admin'
        )
    );

-- Admins can send messages
CREATE POLICY "Admins can send messages"
    ON public.messages
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users u
            JOIN public.roles r ON u.role_id = r.id
            WHERE u.id = auth.uid() AND r.name = 'admin'
        )
        AND auth.uid() = sender_id
    );

-- Admins can update messages (mark as read)
CREATE POLICY "Admins can update messages"
    ON public.messages
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users u
            JOIN public.roles r ON u.role_id = r.id
            WHERE u.id = auth.uid() AND r.name = 'admin'
        )
    );

-- Users can update messages they received (mark as read)
CREATE POLICY "Users can update received messages"
    ON public.messages
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = receiver_id)
    WITH CHECK (auth.uid() = receiver_id);

-- ============================================
-- 5. ADMIN HELPER FUNCTIONS
-- ============================================

-- Function: Get all users (admin only)
CREATE OR REPLACE FUNCTION public.get_all_users()
RETURNS TABLE (
    id UUID,
    email TEXT,
    full_name TEXT,
    role_id INTEGER,
    role_name TEXT,
    is_banned BOOLEAN,
    date_of_birth DATE,
    created_at TIMESTAMPTZ
) 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if caller is admin
    IF NOT EXISTS (
        SELECT 1 FROM public.users u
        JOIN public.roles r ON u.role_id = r.id
        WHERE u.id = auth.uid() AND r.name = 'admin'
    ) THEN
        RAISE EXCEPTION 'Access denied: Admin only';
    END IF;

    RETURN QUERY
    SELECT 
        u.id,
        u.email::TEXT,
        u.full_name::TEXT,
        u.role_id,
        r.name::TEXT as role_name,
        u.is_banned,
        u.date_of_birth,
        u.created_at
    FROM public.users u
    JOIN public.roles r ON u.role_id = r.id
    ORDER BY u.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Function: Update user profile (admin only)
CREATE OR REPLACE FUNCTION public.admin_update_user_profile(
    target_user_id UUID,
    new_full_name TEXT,
    new_date_of_birth DATE
)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM public.users u
        JOIN public.roles r ON u.role_id = r.id
        WHERE u.id = auth.uid() AND r.name = 'admin'
    ) THEN
        RAISE EXCEPTION 'Access denied: Admin only';
    END IF;

    UPDATE public.users
    SET
        full_name = COALESCE(NULLIF(TRIM(new_full_name), ''), full_name),
        date_of_birth = COALESCE(new_date_of_birth, date_of_birth)
    WHERE id = target_user_id;

    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Function: Update user role (admin only)
CREATE OR REPLACE FUNCTION public.admin_update_user_role(
    target_user_id UUID,
    new_role_id INTEGER
)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if caller is admin
    IF NOT EXISTS (
        SELECT 1 FROM public.users u
        JOIN public.roles r ON u.role_id = r.id
        WHERE u.id = auth.uid() AND r.name = 'admin'
    ) THEN
        RAISE EXCEPTION 'Access denied: Admin only';
    END IF;

    -- Prevent admin from changing their own role
    IF target_user_id = auth.uid() THEN
        RAISE EXCEPTION 'Cannot change your own role';
    END IF;

    -- Update role
    UPDATE public.users
    SET role_id = new_role_id
    WHERE id = target_user_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function: Delete user (admin only)
CREATE OR REPLACE FUNCTION public.admin_delete_user(target_user_id UUID)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if caller is admin
    IF NOT EXISTS (
        SELECT 1 FROM public.users u
        JOIN public.roles r ON u.role_id = r.id
        WHERE u.id = auth.uid() AND r.name = 'admin'
    ) THEN
        RAISE EXCEPTION 'Access denied: Admin only';
    END IF;

    -- Prevent admin from deleting themselves
    IF target_user_id = auth.uid() THEN
        RAISE EXCEPTION 'Cannot delete your own account';
    END IF;

    -- Delete from auth.users (will cascade to public.users)
    DELETE FROM auth.users WHERE id = target_user_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function: Ban/Unban user (admin only)
CREATE OR REPLACE FUNCTION public.admin_set_user_ban_status(
    target_user_id UUID,
    ban_status BOOLEAN
)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM public.users u
        JOIN public.roles r ON u.role_id = r.id
        WHERE u.id = auth.uid() AND r.name = 'admin'
    ) THEN
        RAISE EXCEPTION 'Access denied: Admin only';
    END IF;

    IF target_user_id = auth.uid() AND ban_status = TRUE THEN
        RAISE EXCEPTION 'Cannot ban your own account';
    END IF;

    UPDATE public.users
    SET is_banned = ban_status
    WHERE id = target_user_id;

    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Function: Get unread message count for user
CREATE OR REPLACE FUNCTION public.get_unread_message_count()
RETURNS INTEGER
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    unread_count INTEGER;
BEGIN
    SELECT COUNT(*)::INTEGER INTO unread_count
    FROM public.messages
    WHERE receiver_id = auth.uid() AND is_read = FALSE;

    RETURN unread_count;
END;
$$ LANGUAGE plpgsql;

-- Function: Get pending feedback count (admin only)
CREATE OR REPLACE FUNCTION public.get_pending_feedback_count()
RETURNS INTEGER
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    pending_count INTEGER;
BEGIN
    -- Check if caller is admin
    IF NOT EXISTS (
        SELECT 1 FROM public.users u
        JOIN public.roles r ON u.role_id = r.id
        WHERE u.id = auth.uid() AND r.name = 'admin'
    ) THEN
        RETURN 0;
    END IF;

    SELECT COUNT(*)::INTEGER INTO pending_count
    FROM public.feedback
    WHERE status = 'pending';

    RETURN pending_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 6. GRANTS
-- ============================================

-- Grant permissions on tables
GRANT SELECT, INSERT ON public.feedback TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.conversations TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.messages TO authenticated;

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION public.get_all_users() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_user_role(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_user_profile(UUID, TEXT, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_user(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_set_user_ban_status(UUID, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_unread_message_count() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_pending_feedback_count() TO authenticated;

-- ============================================
-- 7. ENABLE REALTIME
-- ============================================

-- Enable realtime for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.feedback;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Run these to verify setup:
-- SELECT * FROM public.feedback;
-- SELECT * FROM public.conversations;
-- SELECT * FROM public.messages;
-- SELECT * FROM public.get_all_users();
-- SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public' AND tablename IN ('feedback', 'conversations', 'messages');
