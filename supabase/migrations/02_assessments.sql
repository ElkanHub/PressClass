create table assessments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  class_level text,
  topic text,
  questions jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table assessments enable row level security;

-- Policies
create policy "Users can view their own assessments"
  on assessments for select
  using (auth.uid() = user_id);

create policy "Users can insert their own assessments"
  on assessments for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own assessments"
  on assessments for update
  using (auth.uid() = user_id);

create policy "Users can delete their own assessments"
  on assessments for delete
  using (auth.uid() = user_id);
