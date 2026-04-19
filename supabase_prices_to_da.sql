-- ============================================================
-- KidFit DZ — Price Migration: USD × 280 = Algerian Dinar (DA)
-- Run this in the Supabase SQL Editor to update existing items
-- ============================================================

-- Amazon Affiliate Products (× 280, rounded to nearest 100)
-- $22.99 × 280 = 6437 → 6400 DA
UPDATE public.clothing_items SET price = 6400
  WHERE name ILIKE '%Color Block Sweatsuit Outfit Set 3T%';

-- $25.99 × 280 = 7277 → 7300 DA
UPDATE public.clothing_items SET price = 7300
  WHERE name ILIKE '%Arshiner Boys Fall Winter Color Block%';

-- $19.99 × 280 = 5597 → 5600 DA
UPDATE public.clothing_items SET price = 5600
  WHERE name ILIKE '%FUNNIDEA%Color Block Sweatshirt%';

-- $18.99 × 280 = 5317 → 5300 DA
UPDATE public.clothing_items SET price = 5300
  WHERE name ILIKE '%KAFIREN%Toddler Boys%Long Sleeve%';

-- $26.99 × 280 = 7557 → 7600 DA
UPDATE public.clothing_items SET price = 7600
  WHERE name ILIKE '%HINTINA%Plaid Sweatsuit Hoodie%';

-- $21.99 × 280 = 6157 → 6200 DA
UPDATE public.clothing_items SET price = 6200
  WHERE name ILIKE '%Hevemexy%Hoodie Sweatsuit%';

-- $19.99 × 280 = 5597 → 5600 DA
UPDATE public.clothing_items SET price = 5600
  WHERE name = 'Amazon Top 1';

-- $24.99 × 280 = 6997 → 7000 DA
UPDATE public.clothing_items SET price = 7000
  WHERE name = 'Amazon Top 2';

-- $29.99 × 280 = 8397 → 8400 DA
UPDATE public.clothing_items SET price = 8400
  WHERE name ILIKE '%SWISSWELL%Button-up Shirt%';

-- Local Demo Items (× 280, rounded to nearest 100)
-- $15.99 × 280 = 4477 → 4500 DA
UPDATE public.clothing_items SET price = 4500  WHERE name = 'Kids Fashion 1';
-- $18.99 × 280 = 5317 → 5300 DA
UPDATE public.clothing_items SET price = 5300  WHERE name = 'Kids Fashion 2';
-- $22.99 × 280 = 6437 → 6400 DA
UPDATE public.clothing_items SET price = 6400  WHERE name = 'Kids Fashion 3';
-- $25.99 × 280 = 7277 → 7300 DA
UPDATE public.clothing_items SET price = 7300  WHERE name = 'Kids Fashion 4';
-- $19.99 × 280 = 5597 → 5600 DA
UPDATE public.clothing_items SET price = 5600  WHERE name = 'Kids Fashion 5';
-- $28.99 × 280 = 8117 → 8100 DA
UPDATE public.clothing_items SET price = 8100  WHERE name = 'Kids Fashion 6';
-- $14.99 × 280 = 4197 → 4200 DA
UPDATE public.clothing_items SET price = 4200  WHERE name = 'Kids Fashion 7';
-- $16.99 × 280 = 4757 → 4800 DA
UPDATE public.clothing_items SET price = 4800  WHERE name = 'Kids Fashion 8';
-- $21.99 × 280 = 6157 → 6200 DA
UPDATE public.clothing_items SET price = 6200  WHERE name = 'Kids Fashion 9';

-- Fallback: any remaining small prices (< 200) → multiply by 280
UPDATE public.clothing_items
  SET price = ROUND(price * 280)
  WHERE price IS NOT NULL AND price < 200;

-- Verify all prices
SELECT name, price FROM public.clothing_items ORDER BY price DESC;
