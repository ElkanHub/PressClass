-- Study Time Feature Schema
-- This schema creates tables for tracking study sessions and pauses

-- Create study_sessions table
create table if not exists study_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  session_type text not null check (session_type in ('pomodoro', 'countdown', 'stopwatch')),
  start_time timestamp with time zone not null,
  end_time timestamp with time zone,
  total_minutes integer default 0,
  pause_count integer default 0,
  subject_tag text,
  notes text,
  quality_rating text check (quality_rating in ('productive', 'needs_improvement', null)),
  settings jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create study_pauses table
create table if not exists study_pauses (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references study_sessions(id) on delete cascade not null,
  pause_start timestamp with time zone not null,
  pause_end timestamp with time zone,
  duration_seconds integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better query performance
create index if not exists idx_study_sessions_user_id on study_sessions(user_id);
create index if not exists idx_study_sessions_start_time on study_sessions(start_time);
create index if not exists idx_study_sessions_user_start on study_sessions(user_id, start_time desc);
create index if not exists idx_study_pauses_session_id on study_pauses(session_id);

-- Enable RLS on study_sessions
alter table study_sessions enable row level security;

-- Create policies for study_sessions
create policy "Users can view their own study sessions"
  on study_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own study sessions"
  on study_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own study sessions"
  on study_sessions for update
  using (auth.uid() = user_id);

create policy "Users can delete their own study sessions"
  on study_sessions for delete
  using (auth.uid() = user_id);

-- Enable RLS on study_pauses
alter table study_pauses enable row level security;

-- Create policies for study_pauses
create policy "Users can view pauses for their sessions"
  on study_pauses for select
  using (
    exists (
      select 1 from study_sessions
      where study_sessions.id = study_pauses.session_id
      and study_sessions.user_id = auth.uid()
    )
  );

create policy "Users can insert pauses for their sessions"
  on study_pauses for insert
  with check (
    exists (
      select 1 from study_sessions
      where study_sessions.id = study_pauses.session_id
      and study_sessions.user_id = auth.uid()
    )
  );

create policy "Users can update pauses for their sessions"
  on study_pauses for update
  using (
    exists (
      select 1 from study_sessions
      where study_sessions.id = study_pauses.session_id
      and study_sessions.user_id = auth.uid()
    )
  );

create policy "Users can delete pauses for their sessions"
  on study_pauses for delete
  using (
    exists (
      select 1 from study_sessions
      where study_sessions.id = study_pauses.session_id
      and study_sessions.user_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
create or replace function update_study_sessions_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create trigger to automatically update updated_at
create trigger update_study_sessions_updated_at_trigger
  before update on study_sessions
  for each row
  execute function update_study_sessions_updated_at();
