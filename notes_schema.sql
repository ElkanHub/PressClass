create table if not exists notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  school text,
  class_level text not null,
  subject text not null,
  strand text not null,
  sub_strand text,
  date date,
  duration text,
  week_term text,
  content jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table notes enable row level security;

-- Create policies
create policy "Users can view their own notes"
  on notes for select
  using (auth.uid() = user_id);

create policy "Users can insert their own notes"
  on notes for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own notes"
  on notes for update
  using (auth.uid() = user_id);

create policy "Users can delete their own notes"
  on notes for delete
  using (auth.uid() = user_id);
