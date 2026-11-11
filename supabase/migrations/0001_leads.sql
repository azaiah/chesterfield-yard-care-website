-- Phase 2: website leads + private photo bucket. Phase 3 adds the rest of the portal schema.
create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new','contacted','quote_sent','won','lost')),
  lost_reason text,
  source text not null default 'quick_quote',
  name text not null,
  phone text not null,
  address text not null,
  email text,
  services text[] not null default '{}',
  plan text,
  estimate jsonb,
  timing text,
  notes text,
  contact_pref text,
  photos text[] not null default '{}',
  utm jsonb,
  page text,
  value_estimate numeric,
  first_contacted_at timestamptz
);
create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);

-- RLS on. No anon/authenticated policies yet: the website writes with the service role from the server only.
-- Phase 3 adds owner/crew policies for the portal.
alter table public.leads enable row level security;

-- Private bucket for customer yard photos (viewed in the portal through signed URLs).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('quote-uploads', 'quote-uploads', false, 10485760, array['image/jpeg','image/png','image/webp','image/heic','image/heif'])
on conflict (id) do nothing;
