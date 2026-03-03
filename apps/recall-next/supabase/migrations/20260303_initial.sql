-- Enable extensions
create extension if not exists vector;
create extension if not exists pg_trgm;
create extension if not exists pgcrypto;

-- Tables
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete cascade,
  x_user_id text,
  created_at timestamptz not null default now()
);

create table if not exists saved_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source text not null,
  original_url text,
  title text,
  text_content text,
  media_urls jsonb,
  raw_json jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists item_embeddings (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references saved_items(id) on delete cascade,
  embedding vector(1536) not null,
  created_at timestamptz not null default now()
);

create table if not exists tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text,
  icon text,
  unique(user_id, name)
);

create table if not exists item_tags (
  item_id uuid not null references saved_items(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,
  primary key(item_id, tag_id)
);

create table if not exists reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id uuid references saved_items(id) on delete set null,
  title text not null,
  description text,
  due_date timestamptz not null,
  recurring text,
  notified boolean not null default false
);

create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  birthday_date date,
  contact_data jsonb
);

create table if not exists user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  preferences jsonb not null default '{}'::jsonb
);

-- Full text search
alter table saved_items add column if not exists tsv tsvector generated always as (
  setweight(to_tsvector('simple', coalesce(title,'')), 'A') ||
  setweight(to_tsvector('simple', coalesce(text_content,'')), 'B')
) stored;
create index if not exists saved_items_tsv_idx on saved_items using gin (tsv);

-- Vector index
create index if not exists item_embeddings_embedding_hnsw on item_embeddings using hnsw (embedding vector_cosine_ops);

-- RLS
alter table profiles enable row level security;
alter table saved_items enable row level security;
alter table item_embeddings enable row level security;
alter table tags enable row level security;
alter table item_tags enable row level security;
alter table reminders enable row level security;
alter table contacts enable row level security;
alter table user_settings enable row level security;

create policy "profiles are viewable by owner" on profiles
  for select using (auth.uid() = user_id);
create policy "profiles are upsertable by owner" on profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "items are viewable by owner" on saved_items
  for select using (auth.uid() = user_id);
create policy "items are modifiable by owner" on saved_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "embeddings are viewable by owner" on item_embeddings
  for select using (exists (select 1 from saved_items si where si.id = item_embeddings.item_id and si.user_id = auth.uid()));
create policy "embeddings are modifiable by owner" on item_embeddings
  for all using (exists (select 1 from saved_items si where si.id = item_embeddings.item_id and si.user_id = auth.uid()))
  with check (exists (select 1 from saved_items si where si.id = item_embeddings.item_id and si.user_id = auth.uid()));

create policy "tags are viewable by owner" on tags
  for select using (auth.uid() = user_id);
create policy "tags are modifiable by owner" on tags
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "item_tags are viewable by owner" on item_tags
  for select using (exists (
    select 1 from saved_items si
    join tags t on t.id = item_tags.tag_id
    where si.id = item_tags.item_id and si.user_id = auth.uid() and t.user_id = auth.uid()
  ));
create policy "item_tags are modifiable by owner" on item_tags
  for all using (exists (
    select 1 from saved_items si
    join tags t on t.id = item_tags.tag_id
    where si.id = item_tags.item_id and si.user_id = auth.uid() and t.user_id = auth.uid()
  )) with check (exists (
    select 1 from saved_items si
    join tags t on t.id = item_tags.tag_id
    where si.id = item_tags.item_id and si.user_id = auth.uid() and t.user_id = auth.uid()
  ));

create policy "reminders are viewable by owner" on reminders
  for select using (auth.uid() = user_id);
create policy "reminders are modifiable by owner" on reminders
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "contacts are viewable by owner" on contacts
  for select using (auth.uid() = user_id);
create policy "contacts are modifiable by owner" on contacts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "settings are viewable by owner" on user_settings
  for select using (auth.uid() = user_id);
create policy "settings are modifiable by owner" on user_settings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Helper function for hybrid search
create or replace function hybrid_search(user_uuid uuid, query_embedding vector(1536), query_text text, match_count int default 20)
returns table (
  id uuid,
  title text,
  original_url text,
  source text,
  score double precision,
  created_at timestamptz
) language sql stable as $$
  with vec as (
    select si.id, si.title, si.original_url, si.source, si.created_at,
      1 - (ie.embedding <=> query_embedding) as vsim
    from saved_items si
    join item_embeddings ie on ie.item_id = si.id
    where si.user_id = user_uuid
  ),
  txt as (
    select id, ts_rank_cd(tsv, plainto_tsquery(coalesce(query_text,''))) as tsrank
    from saved_items
    where user_id = user_uuid
  )
  select v.id, v.title, v.original_url, v.source,
    (0.6 * v.vsim + 0.4 * coalesce(t.tsrank,0)) as score,
    v.created_at
  from vec v
  left join txt t on t.id = v.id
  order by score desc
  limit match_count;
$$;

