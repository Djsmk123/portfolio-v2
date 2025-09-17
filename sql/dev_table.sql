-- Enable UUID extension if not already
create extension if not exists "pgcrypto";

-- Projects table
create table if not exists public.dev_projects (
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

-- Indexes
create index if not exists projects_updated_at_idx on public.dev_projects (updated_at desc);

-- Explicit index on id (not strictly necessary since it's PRIMARY KEY, 
-- but included if you want a named index)
create index if not exists projects_id_idx on public.dev_projects (id);

-- Optional: add GIN index on tags for fast tag searching
create index if not exists projects_tags_idx on public.dev_projects using gin (tags);





-- Experiences table dev_experiences

-- Create experience table
CREATE TABLE IF NOT EXISTS public.dev_experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL UNIQUE,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  date DATERANGE NOT NULL, -- use daterange instead of plain string for querying by periods
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Full-time', 'Internship', 'Contract')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Indexes for optimization
-- Index for sorting/filtering by updated_at
CREATE INDEX IF NOT EXISTS dev_experiences_updated_at_idx
  ON public.experiences (updated_at DESC);

-- Index for quick filtering by type
CREATE INDEX IF NOT EXISTS dev_experiences_type_idx
  ON public.experiences (type);

-- Index for text search (title + company + location + description)
CREATE INDEX IF NOT EXISTS dev_experiences_search_idx
  ON public.experiences
  USING GIN (to_tsvector('english', title || ' ' || company || ' ' || location || ' ' || description));

-- Skills table
CREATE TABLE IF NOT EXISTS public.dev_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('Beginner','Intermediate','Advanced','Expert')),
  years_of_experience INT NOT NULL DEFAULT 0,
  icon TEXT,
  color TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS dev_skills_updated_at_idx ON public.dev_skills (updated_at DESC);
CREATE INDEX IF NOT EXISTS dev_skills_category_idx ON public.dev_skills (category);

-- Resumes table
CREATE TABLE IF NOT EXISTS public.dev_resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_default BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS dev_resumes_updated_at_idx ON public.dev_resumes (updated_at DESC);



