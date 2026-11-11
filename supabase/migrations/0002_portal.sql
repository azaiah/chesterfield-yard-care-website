-- Phase 3: owner portal (quotes, jobs, settings) + extra lead fields.
-- All tables are RLS-locked with no policies: only the server (service role) reads/writes them.

alter table public.leads add column if not exists owner_notes text;

create table if not exists public.quotes (
  id uuid primary key,
  lead_id uuid not null references public.leads (id) on delete cascade,
  created_at timestamptz not null default now(),
  status text not null default 'draft' check (status in ('draft','sent','accepted','declined')),
  items jsonb not null default '[]',
  note text,
  sent_at timestamptz
);
create index if not exists quotes_lead_idx on public.quotes (lead_id);
alter table public.quotes enable row level security;

create table if not exists public.jobs (
  id uuid primary key,
  lead_id uuid references public.leads (id) on delete set null,
  quote_id uuid references public.quotes (id) on delete set null,
  created_at timestamptz not null default now(),
  title text not null,
  customer text not null,
  phone text,
  address text not null,
  date date not null,
  time text,
  status text not null default 'scheduled' check (status in ('scheduled','done','canceled')),
  notes text,
  photos jsonb not null default '[]', -- [{key, kind: before|after|other, public, width, height, caption}]
  completed_at timestamptz
);
create index if not exists jobs_date_idx on public.jobs (date);
alter table public.jobs enable row level security;

-- Key/value settings (price_book).
create table if not exists public.settings (
  id text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.settings enable row level security;
