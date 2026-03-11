-- ============================================================
-- Virtual Try-On App — Supabase Database Setup
-- Run this entire script in the Supabase SQL Editor
-- ============================================================


-- ============================================================
-- 1. PROFILES TABLE
--    Automatically populated on new user sign-up via trigger
-- ============================================================

CREATE TABLE public.profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role       TEXT NOT NULL DEFAULT 'b2c' CHECK (role IN ('b2b', 'b2c')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger function: auto-insert a profile row when a new auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

-- Attach the trigger to auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- 2. CLOTHING ITEMS TABLE
-- ============================================================

CREATE TABLE public.clothing_items (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  image_url      TEXT,
  affiliate_link TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- --- profiles ---
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "profiles: select own"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "profiles: update own"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);


-- --- clothing_items ---
ALTER TABLE public.clothing_items ENABLE ROW LEVEL SECURITY;

-- Anyone (authenticated or anonymous) can read all items
CREATE POLICY "clothing_items: public select"
  ON public.clothing_items
  FOR SELECT
  USING (true);

-- Only b2b users can insert their own items
CREATE POLICY "clothing_items: b2b insert"
  ON public.clothing_items
  FOR INSERT
  WITH CHECK (
    auth.uid() = owner_id
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'b2b'
    )
  );

-- Only b2b users can update their own items
CREATE POLICY "clothing_items: b2b update"
  ON public.clothing_items
  FOR UPDATE
  USING (
    auth.uid() = owner_id
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'b2b'
    )
  )
  WITH CHECK (
    auth.uid() = owner_id
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'b2b'
    )
  );

-- Only b2b users can delete their own items
CREATE POLICY "clothing_items: b2b delete"
  ON public.clothing_items
  FOR DELETE
  USING (
    auth.uid() = owner_id
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'b2b'
    )
  );
