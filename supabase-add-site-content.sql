-- Site Content (singleton, stores entire SiteContent JSON + theme)
create table if not exists site_content (
  id int primary key default 1 check (id = 1),
  content jsonb not null default '{}',
  theme_id text not null default 'pandan',
  updated_at timestamptz default now()
);

-- Insert default empty row
insert into site_content (id, content, theme_id) values (1, '{}', 'pandan') on conflict do nothing;

-- RLS: allow all (same as queue_config)
alter table site_content enable row level security;
create policy "Allow all on site_content" on site_content for all using (true) with check (true);
