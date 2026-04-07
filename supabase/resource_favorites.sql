-- Resource favorites table for user "Star" feature

CREATE TABLE IF NOT EXISTS public.resource_favorites (
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  resource_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, resource_id)
);

CREATE INDEX IF NOT EXISTS idx_resource_favorites_user_id
  ON public.resource_favorites(user_id);

CREATE INDEX IF NOT EXISTS idx_resource_favorites_created_at
  ON public.resource_favorites(created_at DESC);

ALTER TABLE public.resource_favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own resource favorites" ON public.resource_favorites;
CREATE POLICY "Users can view own resource favorites"
  ON public.resource_favorites
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own resource favorites" ON public.resource_favorites;
CREATE POLICY "Users can insert own resource favorites"
  ON public.resource_favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own resource favorites" ON public.resource_favorites;
CREATE POLICY "Users can delete own resource favorites"
  ON public.resource_favorites
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

GRANT SELECT, INSERT, DELETE ON public.resource_favorites TO authenticated;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'resource_favorites'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.resource_favorites;
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.get_resource_favorite_counts(resource_ids TEXT[])
RETURNS TABLE (
  resource_id TEXT,
  favorite_count BIGINT
)
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    rf.resource_id,
    COUNT(*)::BIGINT AS favorite_count
  FROM public.resource_favorites rf
  WHERE rf.resource_id = ANY(resource_ids)
  GROUP BY rf.resource_id;
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION public.get_resource_favorite_counts(TEXT[]) TO anon, authenticated;
