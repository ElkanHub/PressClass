-- Create calendar_events table
create table if not exists public.calendar_events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  type text check (type in ('lesson', 'task', 'event', 'assessment')) not null,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  all_day boolean default false,
  related_id uuid, -- Can link to lesson_plans, notes, or assessments
  related_type text check (related_type in ('lesson_plan', 'note', 'assessment')),
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create tasks table
create table if not exists public.tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  status text check (status in ('not_started', 'in_progress', 'completed')) default 'not_started',
  priority text check (priority in ('low', 'medium', 'high')) default 'medium',
  due_date timestamp with time zone,
  category text check (category in ('prep', 'marking', 'planning', 'admin', 'personal', 'other')) default 'other',
  related_id uuid, -- Can link to lesson_plans, notes, or assessments
  related_type text check (related_type in ('lesson_plan', 'note', 'assessment')),
  position integer default 0, -- For ordering
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.calendar_events enable row level security;
alter table public.tasks enable row level security;

-- Create policies for calendar_events
create policy "Users can view their own calendar events"
  on public.calendar_events for select
  using (auth.uid() = user_id);

create policy "Users can insert their own calendar events"
  on public.calendar_events for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own calendar events"
  on public.calendar_events for update
  using (auth.uid() = user_id);

create policy "Users can delete their own calendar events"
  on public.calendar_events for delete
  using (auth.uid() = user_id);

-- Create policies for tasks
create policy "Users can view their own tasks"
  on public.tasks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own tasks"
  on public.tasks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own tasks"
  on public.tasks for update
  using (auth.uid() = user_id);

create policy "Users can delete their own tasks"
  on public.tasks for delete
  using (auth.uid() = user_id);

-- Create indexes for performance
create index if not exists calendar_events_user_id_idx on public.calendar_events(user_id);
create index if not exists calendar_events_start_time_idx on public.calendar_events(start_time);
create index if not exists tasks_user_id_idx on public.tasks(user_id);
create index if not exists tasks_status_idx on public.tasks(status);
