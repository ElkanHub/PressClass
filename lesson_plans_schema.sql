create table lesson_plans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  subject text not null,
  class_level text not null,
  topic text,
  sub_topic text,
  duration text,
  week_term text,
  date text,
  content jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table lesson_plans enable row level security;

-- Policies
create policy "Users can view their own lesson plans"
  on lesson_plans for select
  using (auth.uid() = user_id);

create policy "Users can insert their own lesson plans"
  on lesson_plans for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own lesson plans"
  on lesson_plans for update
  using (auth.uid() = user_id);

create policy "Users can delete their own lesson plans"
  on lesson_plans for delete
  using (auth.uid() = user_id);
