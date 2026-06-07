create extension if not exists "pgcrypto";

create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  tags text[] not null default '{}',
  images text[] not null default '{}',
  github text,
  website text,
  playstore text,
  appstore text,
  org_name text,
  org_logo text,
  org_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  level text not null check (level in ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
  years_of_experience integer not null default 0,
  icon text,
  color text,
  "order" integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text not null,
  location text not null,
  date daterange not null,
  description text not null,
  type text not null check (type in ('Full-time', 'Internship', 'Contract')),
  "order" integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null,
  size integer not null default 0,
  is_active boolean not null default true,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.thought_of_the_day (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  author text not null,
  is_active boolean not null default true,
  url text,
  "authorImageUrl" text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  date text not null,
  slug text unique not null,
  tags text[] not null default '{}',
  link text not null,
  image text,
  featured_article boolean not null default false,
  likes integer not null default 0,
  featured_on_google_dev_library boolean not null default false,
  source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  url text not null,
  label text not null,
  icon text not null,
  is_visible boolean not null default true,
  "order" integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.dev_projects (like public.projects including all);
create table if not exists public.dev_skills (like public.skills including all);
create table if not exists public.dev_experiences (like public.experiences including all);
create table if not exists public.dev_resumes (like public.resumes including all);
create table if not exists public.dev_thought_of_the_day (like public.thought_of_the_day including all);
create table if not exists public.dev_blogs (like public.blogs including all);
create table if not exists public.dev_social_links (like public.social_links including all);

create index if not exists projects_updated_at_idx on public.projects (updated_at desc);
create index if not exists projects_tags_idx on public.projects using gin (tags);
create index if not exists skills_updated_at_idx on public.skills (updated_at desc);
create index if not exists skills_category_idx on public.skills (category);
create index if not exists experiences_updated_at_idx on public.experiences (updated_at desc);
create index if not exists experiences_type_idx on public.experiences (type);
create index if not exists experiences_search_idx on public.experiences using gin (to_tsvector('english', title || ' ' || company || ' ' || location || ' ' || description));
create index if not exists resumes_updated_at_idx on public.resumes (updated_at desc);
create index if not exists thought_of_the_day_updated_at_idx on public.thought_of_the_day (updated_at desc);
create index if not exists blogs_updated_at_idx on public.blogs (updated_at desc);
create index if not exists blogs_slug_idx on public.blogs (slug);
create index if not exists social_links_order_idx on public.social_links ("order");

create index if not exists dev_projects_updated_at_idx on public.dev_projects (updated_at desc);
create index if not exists dev_projects_tags_idx on public.dev_projects using gin (tags);
create index if not exists dev_skills_updated_at_idx on public.dev_skills (updated_at desc);
create index if not exists dev_skills_category_idx on public.dev_skills (category);
create index if not exists dev_experiences_updated_at_idx on public.dev_experiences (updated_at desc);
create index if not exists dev_experiences_type_idx on public.dev_experiences (type);
create index if not exists dev_experiences_search_idx on public.dev_experiences using gin (to_tsvector('english', title || ' ' || company || ' ' || location || ' ' || description));
create index if not exists dev_resumes_updated_at_idx on public.dev_resumes (updated_at desc);
create index if not exists dev_thought_of_the_day_updated_at_idx on public.dev_thought_of_the_day (updated_at desc);
create index if not exists dev_blogs_updated_at_idx on public.dev_blogs (updated_at desc);
create index if not exists dev_blogs_slug_idx on public.dev_blogs (slug);
create index if not exists dev_social_links_order_idx on public.dev_social_links ("order");

drop trigger if exists update_projects_updated_at on public.projects;
create trigger update_projects_updated_at before update on public.projects for each row execute function public.update_updated_at_column();
drop trigger if exists update_skills_updated_at on public.skills;
create trigger update_skills_updated_at before update on public.skills for each row execute function public.update_updated_at_column();
drop trigger if exists update_experiences_updated_at on public.experiences;
create trigger update_experiences_updated_at before update on public.experiences for each row execute function public.update_updated_at_column();
drop trigger if exists update_resumes_updated_at on public.resumes;
create trigger update_resumes_updated_at before update on public.resumes for each row execute function public.update_updated_at_column();
drop trigger if exists update_thought_of_the_day_updated_at on public.thought_of_the_day;
create trigger update_thought_of_the_day_updated_at before update on public.thought_of_the_day for each row execute function public.update_updated_at_column();
drop trigger if exists update_blogs_updated_at on public.blogs;
create trigger update_blogs_updated_at before update on public.blogs for each row execute function public.update_updated_at_column();
drop trigger if exists update_social_links_updated_at on public.social_links;
create trigger update_social_links_updated_at before update on public.social_links for each row execute function public.update_updated_at_column();

drop trigger if exists update_dev_projects_updated_at on public.dev_projects;
create trigger update_dev_projects_updated_at before update on public.dev_projects for each row execute function public.update_updated_at_column();
drop trigger if exists update_dev_skills_updated_at on public.dev_skills;
create trigger update_dev_skills_updated_at before update on public.dev_skills for each row execute function public.update_updated_at_column();
drop trigger if exists update_dev_experiences_updated_at on public.dev_experiences;
create trigger update_dev_experiences_updated_at before update on public.dev_experiences for each row execute function public.update_updated_at_column();
drop trigger if exists update_dev_resumes_updated_at on public.dev_resumes;
create trigger update_dev_resumes_updated_at before update on public.dev_resumes for each row execute function public.update_updated_at_column();
drop trigger if exists update_dev_thought_of_the_day_updated_at on public.dev_thought_of_the_day;
create trigger update_dev_thought_of_the_day_updated_at before update on public.dev_thought_of_the_day for each row execute function public.update_updated_at_column();
drop trigger if exists update_dev_blogs_updated_at on public.dev_blogs;
create trigger update_dev_blogs_updated_at before update on public.dev_blogs for each row execute function public.update_updated_at_column();
drop trigger if exists update_dev_social_links_updated_at on public.dev_social_links;
create trigger update_dev_social_links_updated_at before update on public.dev_social_links for each row execute function public.update_updated_at_column();

insert into storage.buckets (id, name, public, file_size_limit)
values ('portfolio', 'portfolio', true, 52428800)
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit;
