# football academy website

## Trial booking and enrollment

The trial workflow uses Supabase Auth and the `trial_requests`, `academy_staff`,
and `player_enrollments` tables. Apply
[`supabase/migrations/20261104110000_trial_booking_enrollment.sql`](./supabase/migrations/20261104110000_trial_booking_enrollment.sql)
to the configured Supabase project before using the workflow.
Apply
[`supabase/migrations/20261104140000_add_monthly_student_fees.sql`](./supabase/migrations/20261104140000_add_monthly_student_fees.sql)
to enable monthly fee tracking in the staff dashboard.

To grant staff access:

1. Create a staff user in Supabase Authentication.
2. Add that user's Auth UUID and email to `public.academy_staff` using the
   Supabase SQL editor or dashboard. Do not expose this table to public signup.
3. Staff sign in at `/staff`. Public trial requests are submitted at `/contact`;
   only approved requests can be converted into player enrollments.
