-- ============================================
-- DATABASE SETUP FOR USER MANAGEMENT
-- ============================================

-- 1. Tạo bảng roles
CREATE TABLE IF NOT EXISTS public.roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default roles
INSERT INTO public.roles (id, name, description) VALUES
    (1, 'admin', 'Administrator with full access'),
    (2, 'user', 'Regular user with standard access')
ON CONFLICT (id) DO NOTHING;

-- 2. Tạo bảng users
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    role_id INTEGER DEFAULT 2 REFERENCES public.roles(id),
    date_of_birth DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tạo index cho performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role_id ON public.users(role_id);

-- 4. Tạo trigger tự động tạo user khi đăng ký
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, role_id)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        2  -- Default role: user
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and create new
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 5. Tạo trigger tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_user_updated ON public.users;
CREATE TRIGGER on_user_updated
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Service role can insert users" ON public.users;
DROP POLICY IF EXISTS "Anyone can view roles" ON public.roles;

-- USERS TABLE POLICIES

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
    ON public.users
    FOR SELECT
    USING (auth.uid() = id);

-- Policy: Users can update their own profile (only allowed fields)
CREATE POLICY "Users can update own profile"
    ON public.users
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id
        AND email = (SELECT email FROM public.users WHERE id = auth.uid())
        AND role_id = (SELECT role_id FROM public.users WHERE id = auth.uid())
    );

-- Policy: Service role can insert users (for trigger)
CREATE POLICY "Service role can insert users"
    ON public.users
    FOR INSERT
    WITH CHECK (true);

-- ROLES TABLE POLICIES

-- Policy: Anyone can view roles (for displaying role names)
CREATE POLICY "Anyone can view roles"
    ON public.roles
    FOR SELECT
    TO authenticated
    USING (true);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function: Get user role name
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT AS $$
    SELECT r.name
    FROM public.users u
    JOIN public.roles r ON u.role_id = r.id
    WHERE u.id = user_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Function: Check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.users u
        JOIN public.roles r ON u.role_id = r.id
        WHERE u.id = user_id AND r.name = 'admin'
    );
$$ LANGUAGE sql SECURITY DEFINER;

-- ============================================
-- GRANTS
-- ============================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- Grant permissions on tables
GRANT SELECT, UPDATE ON public.users TO authenticated;
GRANT SELECT ON public.roles TO authenticated;

-- Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Run these to verify setup:
-- SELECT * FROM public.roles;
-- SELECT * FROM public.users;
-- SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';
