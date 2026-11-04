create table public.academy_change_log (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null,
  player_name text not null,
  entity_type text not null check (entity_type in ('student', 'monthly_fee')),
  action text not null check (action in ('updated', 'created')),
  old_values jsonb not null default '{}'::jsonb,
  new_values jsonb not null default '{}'::jsonb,
  changed_by uuid,
  changed_by_email text,
  changed_at timestamptz not null default now()
);

create index academy_change_log_changed_at_idx
  on public.academy_change_log (changed_at desc);

create index academy_change_log_enrollment_id_changed_at_idx
  on public.academy_change_log (enrollment_id, changed_at desc);

alter table public.academy_change_log enable row level security;

revoke all on public.academy_change_log from public, anon, authenticated;

create policy "Admins can view academy change history"
  on public.academy_change_log for select to authenticated
  using ((select public.is_academy_staff()));

grant select on public.academy_change_log to authenticated;

create or replace function public.log_student_enrollment_changes()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  old_values jsonb;
  new_values jsonb;
  changed_old_values jsonb;
  changed_new_values jsonb;
begin
  new_values := jsonb_build_object(
    'player_name', new.player_name,
    'date_of_birth', new.date_of_birth,
    'age_group', new.age_group,
    'guardian_name', new.guardian_name,
    'guardian_email', new.guardian_email,
    'guardian_phone', new.guardian_phone,
    'start_date', new.start_date,
    'status', new.status
  );

  if tg_op = 'UPDATE' then
    old_values := jsonb_build_object(
      'player_name', old.player_name,
      'date_of_birth', old.date_of_birth,
      'age_group', old.age_group,
      'guardian_name', old.guardian_name,
      'guardian_email', old.guardian_email,
      'guardian_phone', old.guardian_phone,
      'start_date', old.start_date,
      'status', old.status
    );

    select
      coalesce(jsonb_object_agg(old_entry.key, old_entry.value), '{}'::jsonb),
      coalesce(jsonb_object_agg(new_entry.key, new_entry.value), '{}'::jsonb)
    into changed_old_values, changed_new_values
    from jsonb_each(old_values) as old_entry
    join jsonb_each(new_values) as new_entry using (key)
    where old_entry.value is distinct from new_entry.value;

    if changed_old_values = '{}'::jsonb then
      return new;
    end if;
  else
    changed_old_values := '{}'::jsonb;
    changed_new_values := new_values;
  end if;

  insert into public.academy_change_log (
    enrollment_id,
    player_name,
    entity_type,
    action,
    old_values,
    new_values,
    changed_by,
    changed_by_email
  )
  values (
    new.id,
    new.player_name,
    'student',
    case when tg_op = 'INSERT' then 'created' else 'updated' end,
    changed_old_values,
    changed_new_values,
    auth.uid(),
    auth.jwt() ->> 'email'
  );

  return new;
end;
$$;

create trigger player_enrollments_audit_update
  after insert or update on public.player_enrollments
  for each row execute function public.log_student_enrollment_changes();

revoke all on function public.log_student_enrollment_changes()
  from public, anon, authenticated;

create or replace function public.log_monthly_fee_changes()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  student_name text;
  old_values jsonb := '{}'::jsonb;
  new_values jsonb;
begin
  select player_name
  into student_name
  from public.player_enrollments
  where id = new.enrollment_id;

  new_values := jsonb_build_object(
    'billing_month', new.billing_month,
    'status', new.status,
    'paid_at', new.paid_at
  );

  if tg_op = 'UPDATE' then
    old_values := jsonb_build_object(
      'billing_month', old.billing_month,
      'status', old.status,
      'paid_at', old.paid_at
    );
    if old_values = new_values then
      return new;
    end if;
  end if;

  insert into public.academy_change_log (
    enrollment_id,
    player_name,
    entity_type,
    action,
    old_values,
    new_values,
    changed_by,
    changed_by_email
  )
  values (
    new.enrollment_id,
    coalesce(student_name, 'Unknown student'),
    'monthly_fee',
    case when tg_op = 'INSERT' then 'created' else 'updated' end,
    old_values,
    new_values,
    auth.uid(),
    auth.jwt() ->> 'email'
  );

  return new;
end;
$$;

create trigger player_monthly_fees_audit_change
  after insert or update on public.player_monthly_fees
  for each row execute function public.log_monthly_fee_changes();

revoke all on function public.log_monthly_fee_changes()
  from public, anon, authenticated;
