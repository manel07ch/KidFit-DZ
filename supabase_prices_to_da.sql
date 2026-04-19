-- ============================================================
-- KidFit DZ — Price Migration: USD → Algerian Dinar (DA)
-- Run this in the Supabase SQL Editor to update existing items
-- ============================================================

-- Update by MATCHING item names precisely (safe, idempotent)

-- Amazon Affiliate Sweatsuits / Sets (3000–4000 DA range)
UPDATE public.clothing_items SET price = 3200
  WHERE name ILIKE '%Color Block Sweatsuit Outfit Set 3T%';

UPDATE public.clothing_items SET price = 3500
  WHERE name ILIKE '%Arshiner Boys Fall Winter Color Block%';

UPDATE public.clothing_items SET price = 2800
  WHERE name ILIKE '%FUNNIDEA%Color Block Sweatshirt%';

UPDATE public.clothing_items SET price = 2500
  WHERE name ILIKE '%KAFIREN%Toddler Boys%Long Sleeve%';

UPDATE public.clothing_items SET price = 3800
  WHERE name ILIKE '%HINTINA%Plaid Sweatsuit Hoodie%';

UPDATE public.clothing_items SET price = 3000
  WHERE name ILIKE '%Hevemexy%Hoodie Sweatsuit%';

-- Amazon Tops
UPDATE public.clothing_items SET price = 2800
  WHERE name = 'Amazon Top 1';

UPDATE public.clothing_items SET price = 3500
  WHERE name = 'Amazon Top 2';

UPDATE public.clothing_items SET price = 4200
  WHERE name ILIKE '%SWISSWELL%Button-up Shirt%';

-- Kids Fashion local items
UPDATE public.clothing_items SET price = 1800  WHERE name = 'Kids Fashion 1';
UPDATE public.clothing_items SET price = 2200  WHERE name = 'Kids Fashion 2';
UPDATE public.clothing_items SET price = 3200  WHERE name = 'Kids Fashion 3';
UPDATE public.clothing_items SET price = 3500  WHERE name = 'Kids Fashion 4';
UPDATE public.clothing_items SET price = 2800  WHERE name = 'Kids Fashion 5';
UPDATE public.clothing_items SET price = 4000  WHERE name = 'Kids Fashion 6';
UPDATE public.clothing_items SET price = 1500  WHERE name = 'Kids Fashion 7';
UPDATE public.clothing_items SET price = 2000  WHERE name = 'Kids Fashion 8';
UPDATE public.clothing_items SET price = 5500  WHERE name = 'Kids Fashion 9';

-- ── Fallback: update ALL remaining items that still have small decimal-style
--    USD prices (< 200) by converting with a market multiplier (~140x)
--    Only update items that haven't been set yet (price < 200)
UPDATE public.clothing_items
  SET price = ROUND(price * 140)
  WHERE price IS NOT NULL AND price < 200;

-- Verify
SELECT id, name, price FROM public.clothing_items ORDER BY created_at DESC;
