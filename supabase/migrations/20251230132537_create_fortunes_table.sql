create table fortunes (
  id uuid primary key default gen_random_uuid(),
  genre text not null,
  worries text,
  fortune text not null,
  voice_of_heaven text not null,
  overall_message text not null,
  lucky_item text not null,
  analysis jsonb not null,
  drawn_at timestamptz default now() not null
);

alter table fortunes enable row level security;

create policy "Anyone can read fortunes"
  on fortunes for select using (true);

create policy "Anyone can insert fortunes"
  on fortunes for insert with check (true);