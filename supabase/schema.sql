-- OpenLearn / Universal LMS schema
-- Run in Supabase Dashboard -> SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text default '',
  category text default 'General',
  cover_url text,
  published boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text default '',
  video_url text,
  position integer not null default 1,
  created_at timestamptz not null default now()
);
create table if not exists public.materials (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  title text not null,
  url text not null,
  storage_path text,
  file_name text,
  created_at timestamptz not null default now()
);
create index if not exists lessons_course_position_idx on public.lessons(course_id, position);
create index if not exists materials_lesson_idx on public.materials(lesson_id);

alter table public.admin_users enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.materials enable row level security;

-- Add your admin's auth user id to public.admin_users from the SQL editor after creating the user.
-- Example: insert into public.admin_users(user_id) values ('YOUR-AUTH-USER-UUID');
-- Anyone can browse only published courses and their lessons/materials.
drop policy if exists "Public can read published courses" on public.courses;
create policy "Public can read published courses" on public.courses for select using (published = true);
drop policy if exists "Admins can manage own courses" on public.courses;
create policy "Admins can manage own courses" on public.courses for all to authenticated using (created_by = auth.uid() and exists(select 1 from public.admin_users a where a.user_id = auth.uid())) with check (created_by = auth.uid() and exists(select 1 from public.admin_users a where a.user_id = auth.uid()));
drop policy if exists "Public can read lessons in published courses" on public.lessons;
create policy "Public can read lessons in published courses" on public.lessons for select using (exists(select 1 from public.courses c where c.id = course_id and c.published = true));
drop policy if exists "Course owners can manage lessons" on public.lessons;
create policy "Course owners can manage lessons" on public.lessons for all to authenticated using (exists(select 1 from public.courses c join public.admin_users a on a.user_id = c.created_by where c.id = course_id and c.created_by = auth.uid())) with check (exists(select 1 from public.courses c join public.admin_users a on a.user_id = c.created_by where c.id = course_id and c.created_by = auth.uid()));
drop policy if exists "Public can read materials in published courses" on public.materials;
create policy "Public can read materials in published courses" on public.materials for select using (exists(select 1 from public.lessons l join public.courses c on c.id = l.course_id where l.id = lesson_id and c.published = true));
drop policy if exists "Course owners can manage materials" on public.materials;
create policy "Course owners can manage materials" on public.materials for all to authenticated using (exists(select 1 from public.lessons l join public.courses c on c.id = l.course_id join public.admin_users a on a.user_id = c.created_by where l.id = lesson_id and c.created_by = auth.uid())) with check (exists(select 1 from public.lessons l join public.courses c on c.id = l.course_id join public.admin_users a on a.user_id = c.created_by where l.id = lesson_id and c.created_by = auth.uid()));

-- Public bucket for course materials. Only upload content you intend to make public.
insert into storage.buckets (id, name, public, file_size_limit)
values ('materials', 'materials', true, 52428800)
on conflict (id) do update set public = true, file_size_limit = 52428800;
drop policy if exists "Public can read course materials" on storage.objects;
create policy "Public can read course materials" on storage.objects for select using (bucket_id = 'materials');
drop policy if exists "Signed-in users can upload course materials" on storage.objects;
create policy "Admins can upload course materials" on storage.objects for insert to authenticated with check (bucket_id = 'materials' and exists(select 1 from public.admin_users a where a.user_id = auth.uid()));
drop policy if exists "Uploader can delete own course materials" on storage.objects;
create policy "Admins can delete course materials" on storage.objects for delete to authenticated using (bucket_id = 'materials' and exists(select 1 from public.admin_users a where a.user_id = auth.uid()));
