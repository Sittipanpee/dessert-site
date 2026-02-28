-- Queue Config
create table if not exists queue_config (
  id int primary key default 1 check (id = 1), -- singleton row
  prompt_pay_number text not null default '0812345678',
  minutes_per_queue int not null default 5,
  auto_reset_time text not null default '06:00',
  current_day_key text not null default '',
  next_queue_number int not null default 1,
  updated_at timestamptz default now()
);

-- Insert default config
insert into queue_config (id) values (1) on conflict do nothing;

-- Orders
create table if not exists orders (
  id text primary key,
  queue_number int not null,
  customer_name text not null,
  customer_phone text,
  items jsonb not null default '[]',
  total_price numeric not null default 0,
  payment_method text not null default 'cash',
  payment_proof_url text,
  status text not null default 'preparing',
  day_key text not null,
  created_at timestamptz default now()
);

-- Index for fast daily queries
create index if not exists idx_orders_day_key on orders (day_key);
create index if not exists idx_orders_status on orders (status);

-- Enable RLS but allow all (public anon access for simplicity)
alter table queue_config enable row level security;
alter table orders enable row level security;

create policy "Allow all on queue_config" on queue_config for all using (true) with check (true);
create policy "Allow all on orders" on orders for all using (true) with check (true);

-- Storage bucket for payment proofs
insert into storage.buckets (id, name, public) values ('payment-proofs', 'payment-proofs', true) on conflict do nothing;

create policy "Allow public upload to payment-proofs" on storage.objects for insert with check (bucket_id = 'payment-proofs');
create policy "Allow public read from payment-proofs" on storage.objects for select using (bucket_id = 'payment-proofs');
