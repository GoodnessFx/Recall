create table if not exists bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  url text not null,
  title text,
  description text,
  thumbnail_url text,
  platform text, -- 'twitter', 'instagram', 'tiktok', 'youtube', 'linkedin', 'reddit', 'other'
  category text check (category in ('Education', 'Inspiration', 'Archive', 'Reference', 'Fun')),
  summary text, 
   keywords text[], -- array of strings 
   notes text, -- user's personal notes
   collection text default 'Uncategorized', -- manual grouping
   raw_og jsonb, -- store full OG data as backup
  created_at timestamptz default now(),
  search_vector tsvector generated always as (
    to_tsvector('english',
      coalesce(title, '') || ' ' ||
      coalesce(description, '') || ' ' ||
      coalesce(summary, '') || ' ' ||
      coalesce(array_to_string(keywords, ' '), '')
    )
  ) stored
);

-- Full text search index
create index if not exists bookmarks_search_idx on bookmarks using gin(search_vector);

-- User index for fast fetches
create index if not exists bookmarks_user_idx on bookmarks(user_id, created_at desc);

-- Ensure no bookmark is readable, writable, or deletable by anyone except its owner.
-- These policies are not optional — they are the entire security model.

alter table bookmarks enable row level security;

-- Read
create policy "own_read" on bookmarks for select using (auth.uid() = user_id);
-- Insert
create policy "own_insert" on bookmarks for insert with check (auth.uid() = user_id);
-- Update (only allow updating specific columns, not user_id)
create policy "own_update" on bookmarks for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- Delete
create policy "own_delete" on bookmarks for delete using (auth.uid() = user_id);

-- Conversational AI table
create table recall_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  messages jsonb not null default '[]',
  bookmark_results jsonb,
  created_at timestamptz default now()
);

alter table recall_conversations enable row level security;
create policy "own_conv" on recall_conversations for all using (auth.uid() = user_id);
