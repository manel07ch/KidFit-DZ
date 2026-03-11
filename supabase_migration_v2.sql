-- ── Run this in the Supabase SQL Editor ────────────────────────
-- Adds an optional price field and a display_order field
ALTER TABLE public.clothing_items
  ADD COLUMN IF NOT EXISTS price        DECIMAL(10,2) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS category     TEXT          DEFAULT 'tops',
  ADD COLUMN IF NOT EXISTS is_featured  BOOLEAN       DEFAULT FALSE;

-- ✅ FIX RLS for profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- ✅ FIX RLS for clothing_items table
ALTER TABLE clothing_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view clothing items"
ON clothing_items FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert clothing"
ON clothing_items FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update clothing"
ON clothing_items FOR UPDATE
USING (auth.role() = 'authenticated');
