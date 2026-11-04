create table public.academy_staff (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

create table public.trial_requests (
  id uuid primary key default gen_random_uuid(),
  player_name text not null check (char_length(trim(player_name)) between 2 and 100),
  date_of_birth date not null check (date_of_birth < current_date),
  age_group text not null check (age_group in ('U10', 'U12', 'U15', 'U18')),
  guardian_name text not null check (char_length(trim(guardian_name)) between 2 and 100),
  guardian_email text not null
    check (
      char_length(guardian_email) <= 255
      and guardian_email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    ),
  guardian_phone text not null
    check (
      char_length(guardian_phone) between 7 and 30
      and guardian_phone ~ '^[+0-9() -]+$'
    ),
  preferred_trial_date date,
  notes text not null default '' check (char_length(notes) <= 1000),
  guardian_consent boolean not null default false check (guardian_consent),
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'enrolled')),
  staff_notes text check (staff_notes is null or char_length(staff_notes) <= 1000),
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table public.player_enrollments (
  id uuid primary key default gen_random_uuid(),
  trial_request_id uuid not null unique references public.trial_requests (id),
  player_name text not null,
  date_of_birth date not null,
  age_group text not null check (age_group in ('U10', 'U12', 'U15', 'U18')),
  guardian_name text not null,
  guardian_email text not null,
  guardian_phone text not null,
  start_date date not null,
  status text not null default 'active' check (status in ('active', 'inactive')),
  enrolled_at timestamptz not null default now()
);

create index trial_requests_status_submitted_at_idx
  on public.trial_requests (status, submitted_at desc);

create or replace function public.is_academy_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.academy_staff
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_academy_staff() from public;
grant execute on function public.is_academy_staff() to authenticated;

alter table public.academy_staff enable row level security;
alter table public.trial_requests enable row level security;
alter table public.player_enrollments enable row level security;

revoke all on public.academy_staff from public, anon, authenticated;
revoke all on public.trial_requests from public, anon, authenticated;
revoke all on public.player_enrollments from public, anon, authenticated;

create policy "Staff can view their own membership"
  on public.academy_staff for select to authenticated
  using (user_id = (select auth.uid()));

create policy "Anyone can request a trial"
  on public.trial_requests for insert to anon, authenticated
  with check (
    status = 'pending'
    and staff_notes is null
    and reviewed_at is null
    and guardian_consent
  );

create policy "Staff can view trial requests"
  on public.trial_requests for select to authenticated
  using ((select public.is_academy_staff()));

create policy "Staff can review trial requests"
  on public.trial_requests for update to authenticated
  using ((select public.is_academy_staff()))
  with check ((select public.is_academy_staff()));

create policy "Staff can manage enrollments"
  on public.player_enrollments for all to authenticated
  using ((select public.is_academy_staff()))
  with check ((select public.is_academy_staff()));

grant select on public.academy_staff to authenticated;
grant insert (
  player_name,
  date_of_birth,
  age_group,
  guardian_name,
  guardian_email,
  guardian_phone,
  preferred_trial_date,
  notes,
  guardian_consent
) on public.trial_requests to anon, authenticated;
grant select on public.trial_requests to authenticated;
grant select, insert, update on public.player_enrollments to authenticated;

create or replace function public.review_trial_request(
  p_trial_request_id uuid,
  p_status text,
  p_staff_notes text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_academy_staff() then
    raise exception 'Staff access required';
  end if;

  if p_status is null or p_status not in ('approved', 'rejected') then
    raise exception 'Invalid review status';
  end if;

  if p_staff_notes is not null and char_length(p_staff_notes) > 1000 then
    raise exception 'Staff notes are too long';
  end if;

  update public.trial_requests
  set status = p_status, staff_notes = p_staff_notes, reviewed_at = now()
  where id = p_trial_request_id and status = 'pending';

  if not found then
    raise exception 'Only pending trial requests can be reviewed';
  end if;
end;
$$;

revoke all on function public.review_trial_request(uuid, text, text) from public;
grant execute on function public.review_trial_request(uuid, text, text) to authenticated;

create or replace function public.enroll_approved_trial(
  p_trial_request_id uuid,
  p_start_date date
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  trial public.trial_requests%rowtype;
  enrollment_id uuid;
begin
  if not public.is_academy_staff() then
    raise exception 'Staff access required';
  end if;

  select *
  into trial
  from public.trial_requests
  where id = p_trial_request_id
  for update;

  if not found or trial.status <> 'approved' then
    raise exception 'Only approved trial requests can be enrolled';
  end if;

  if p_start_date is null then
    raise exception 'A start date is required';
  end if;

  insert into public.player_enrollments (
    trial_request_id,
    player_name,
    date_of_birth,
    age_group,
    guardian_name,
    guardian_email,
    guardian_phone,
    start_date
  )
  values (
    trial.id,
    trial.player_name,
    trial.date_of_birth,
    trial.age_group,
    trial.guardian_name,
    trial.guardian_email,
    trial.guardian_phone,
    p_start_date
  )
  returning id into enrollment_id;

  update public.trial_requests
  set status = 'enrolled', reviewed_at = now()
  where id = trial.id;

  return enrollment_id;
end;
$$;

revoke all on function public.enroll_approved_trial(uuid, date) from public;
grant execute on function public.enroll_approved_trial(uuid, date) to authenticated;
