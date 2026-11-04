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
  where id = p_trial_request_id and status in ('pending', 'rejected');

  if not found then
    raise exception 'Only pending or declined trial requests can be reviewed';
  end if;
end;
$$;

revoke all on function public.review_trial_request(uuid, text, text) from public;
grant execute on function public.review_trial_request(uuid, text, text) to authenticated;
