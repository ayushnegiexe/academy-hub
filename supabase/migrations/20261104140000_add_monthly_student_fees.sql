create table public.player_monthly_fees (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null
    references public.player_enrollments (id) on delete cascade,
  billing_month date not null check (extract(day from billing_month) = 1),
  status text not null check (status in ('paid', 'unpaid')),
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  unique (enrollment_id, billing_month),
  check (
    (status = 'paid' and paid_at is not null)
    or (status = 'unpaid' and paid_at is null)
  )
);

alter table public.player_monthly_fees enable row level security;

revoke all on public.player_monthly_fees from public, anon, authenticated;

create policy "Staff can manage monthly student fees"
  on public.player_monthly_fees for all to authenticated
  using ((select public.is_academy_staff()))
  with check ((select public.is_academy_staff()));

grant select, insert, update on public.player_monthly_fees to authenticated;
