-- 🚨 WARNING: This SQL code will DELETE ALL YOUR PHOTOS AND CLOTHING ITEMS 🚨

-- 1. Delete all images from the "clothes" storage bucket
DELETE FROM storage.objects WHERE bucket_id = 'clothes';

-- 2. Delete all records from the 'clothing_items' table
DELETE FROM public.clothing_items;

-- If you have a separate bucket for try-ons or user photos, you can also uncomment the following line:
-- DELETE FROM storage.objects WHERE bucket_id = 'try-ons';
