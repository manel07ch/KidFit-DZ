-- =====================================
-- إصلاح مشكلة رفع الصور في Supabase
-- =====================================
-- 1. التأكد من وجود مساحة التخزين (Bucket) وجعلها عامة
insert into storage.buckets (id, name, public)
values ('clothes', 'clothes', true)
on conflict (id) do update set public = true;

-- 2. إعطاء الصلاحية للأشخاص المسجلين لرفع الصور (Upload)
create policy "Allow authenticated uploads" 
on storage.objects for insert 
to authenticated 
with check (bucket_id = 'clothes');

-- 3. السماح للجميع برؤية الصور (Read/Select)
create policy "Allow public read" 
on storage.objects for select 
using (bucket_id = 'clothes');

-- 4. السماح للأشخاص المسجلين بتعديل/حذف صورهم إن أردت
create policy "Allow authenticated update" 
on storage.objects for update 
to authenticated 
using (bucket_id = 'clothes');

create policy "Allow authenticated delete" 
on storage.objects for delete 
to authenticated 
using (bucket_id = 'clothes');
-- =====================================
