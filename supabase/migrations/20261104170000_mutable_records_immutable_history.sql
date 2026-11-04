alter table public.academy_change_log
  alter column enrollment_id drop not null;

alter table public.academy_change_log
  drop constraint academy_change_log_entity_type_check,
  add constraint academy_change_log_entity_type_check
    check (entity_type in ('student', 'monthly_fee', 'trial_request'));

alter table public.academy_change_log
  drop constraint academy_change_log_action_check,
  add constraint academy_change_log_action_check
    check (action in ('updated', 'created', 'deleted'));

alter table public.player_enrollments
  drop constraint if exists player_enrollments_trial_request_id_fkey,
  add constraint player_enrollments_trial_request_id_fkey
    foreign key (trial_request_id)
    references public.trial_requests (id)
    on delete cascade;

create policy "Staff can delete trial requests"
  on public.trial_requests for delete to authenticated
  using ((select public.is_academy_staff()));

grant update, delete on public.trial_requests to authenticated;
grant delete on public.player_enrollments to authenticated;
grant delete on public.player_monthly_fees to authenticated;

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
  if tg_op = 'DELETE' then
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

    insert into public.academy_change_log (
      enrollment_id, player_name, entity_type, action, old_values, new_values,
      changed_by, changed_by_email
    )
    values (
      old.id, old.player_name, 'student', 'deleted', old_values, '{}'::jsonb,
      auth.uid(), auth.jwt() ->> 'email'
    );
    return old;
  end if;

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
    enrollment_id, player_name, entity_type, action, old_values, new_values,
    changed_by, changed_by_email
  )
  values (
    new.id, new.player_name, 'student',
    case when tg_op = 'INSERT' then 'created' else 'updated' end,
    changed_old_values, changed_new_values, auth.uid(), auth.jwt() ->> 'email'
  );
  return new;
end;
$$;

drop trigger if exists player_enrollments_audit_update on public.player_enrollments;
create trigger player_enrollments_audit_change
  after insert or update or delete on public.player_enrollments
  for each row execute function public.log_student_enrollment_changes();

create or replace function public.remember_deleted_student_name()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  perform set_config('academy.deleted_enrollment_id', old.id::text, true);
  perform set_config('academy.deleted_enrollment_name', old.player_name, true);
  return old;
end;
$$;

create trigger player_enrollments_remember_delete
  before delete on public.player_enrollments
  for each row execute function public.remember_deleted_student_name();

create or replace function public.log_monthly_fee_changes()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  fee_enrollment_id uuid;
  student_name text;
  old_values jsonb := '{}'::jsonb;
  new_values jsonb := '{}'::jsonb;
begin
  fee_enrollment_id := case when tg_op = 'DELETE' then old.enrollment_id else new.enrollment_id end;

  if tg_op = 'DELETE'
    and current_setting('academy.deleted_enrollment_id', true) = fee_enrollment_id::text
  then
    student_name := current_setting('academy.deleted_enrollment_name', true);
  else
    select player_name
    into student_name
    from public.player_enrollments
    where id = fee_enrollment_id;
  end if;

  if student_name is null then
    select player_name
    into student_name
    from public.academy_change_log
    where enrollment_id = fee_enrollment_id
      and entity_type = 'student'
    order by changed_at desc
    limit 1;
  end if;

  if tg_op = 'DELETE' then
    old_values := jsonb_build_object(
      'billing_month', old.billing_month,
      'status', old.status,
      'paid_at', old.paid_at
    );
  else
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
  end if;

  insert into public.academy_change_log (
    enrollment_id, player_name, entity_type, action, old_values, new_values,
    changed_by, changed_by_email
  )
  values (
    fee_enrollment_id, coalesce(student_name, 'Unknown student'), 'monthly_fee',
    case when tg_op = 'INSERT' then 'created' when tg_op = 'DELETE' then 'deleted' else 'updated' end,
    old_values, new_values, auth.uid(), auth.jwt() ->> 'email'
  );

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

drop trigger if exists player_monthly_fees_audit_change on public.player_monthly_fees;
create trigger player_monthly_fees_audit_change
  after insert or update or delete on public.player_monthly_fees
  for each row execute function public.log_monthly_fee_changes();

create or replace function public.log_trial_request_changes()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  request_id uuid;
  linked_enrollment_id uuid;
  request_player_name text;
  old_values jsonb := '{}'::jsonb;
  new_values jsonb := '{}'::jsonb;
begin
  request_id := case when tg_op = 'DELETE' then old.id else new.id end;
  request_player_name := case when tg_op = 'DELETE' then old.player_name else new.player_name end;

  select id
  into linked_enrollment_id
  from public.player_enrollments
  where trial_request_id = request_id;

  if tg_op = 'DELETE' then
    old_values := jsonb_build_object(
      'player_name', old.player_name,
      'date_of_birth', old.date_of_birth,
      'age_group', old.age_group,
      'guardian_name', old.guardian_name,
      'guardian_email', old.guardian_email,
      'guardian_phone', old.guardian_phone,
      'preferred_trial_date', old.preferred_trial_date,
      'notes', old.notes,
      'guardian_consent', old.guardian_consent,
      'status', old.status,
      'staff_notes', old.staff_notes,
      'submitted_at', old.submitted_at,
      'reviewed_at', old.reviewed_at
    );
  else
    new_values := jsonb_build_object(
      'player_name', new.player_name,
      'date_of_birth', new.date_of_birth,
      'age_group', new.age_group,
      'guardian_name', new.guardian_name,
      'guardian_email', new.guardian_email,
      'guardian_phone', new.guardian_phone,
      'preferred_trial_date', new.preferred_trial_date,
      'notes', new.notes,
      'guardian_consent', new.guardian_consent,
      'status', new.status,
      'staff_notes', new.staff_notes,
      'submitted_at', new.submitted_at,
      'reviewed_at', new.reviewed_at
    );

    if tg_op = 'UPDATE' then
      old_values := jsonb_build_object(
        'player_name', old.player_name,
        'date_of_birth', old.date_of_birth,
        'age_group', old.age_group,
        'guardian_name', old.guardian_name,
        'guardian_email', old.guardian_email,
        'guardian_phone', old.guardian_phone,
        'preferred_trial_date', old.preferred_trial_date,
        'notes', old.notes,
        'guardian_consent', old.guardian_consent,
        'status', old.status,
        'staff_notes', old.staff_notes,
        'submitted_at', old.submitted_at,
        'reviewed_at', old.reviewed_at
      );

      select
        coalesce(jsonb_object_agg(old_entry.key, old_entry.value), '{}'::jsonb),
        coalesce(jsonb_object_agg(new_entry.key, new_entry.value), '{}'::jsonb)
      into old_values, new_values
      from jsonb_each(old_values) as old_entry
      join jsonb_each(new_values) as new_entry using (key)
      where old_entry.value is distinct from new_entry.value;

      if old_values = '{}'::jsonb then
        return new;
      end if;
    end if;
  end if;

  insert into public.academy_change_log (
    enrollment_id, player_name, entity_type, action, old_values, new_values,
    changed_by, changed_by_email
  )
  values (
    linked_enrollment_id, request_player_name, 'trial_request',
    case when tg_op = 'INSERT' then 'created' when tg_op = 'DELETE' then 'deleted' else 'updated' end,
    old_values, new_values, auth.uid(), auth.jwt() ->> 'email'
  );

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

create trigger trial_requests_audit_change
  after insert or update or delete on public.trial_requests
  for each row execute function public.log_trial_request_changes();

revoke all on function public.log_student_enrollment_changes()
  from public, anon, authenticated;
revoke all on function public.log_monthly_fee_changes()
  from public, anon, authenticated;
revoke all on function public.log_trial_request_changes()
  from public, anon, authenticated;
revoke all on function public.remember_deleted_student_name()
  from public, anon, authenticated;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
    and not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'academy_change_log'
    )
  then
    alter publication supabase_realtime add table public.academy_change_log;
  end if;
end;
$$;
