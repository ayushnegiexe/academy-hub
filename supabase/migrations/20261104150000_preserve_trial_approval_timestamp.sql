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
  set status = 'enrolled'
  where id = trial.id;

  return enrollment_id;
end;
$$;

revoke all on function public.enroll_approved_trial(uuid, date) from public;
grant execute on function public.enroll_approved_trial(uuid, date) to authenticated;
