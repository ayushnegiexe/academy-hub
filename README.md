# football academy website

## Trial booking and enrollment

The trial workflow uses Supabase Auth and the `trial_requests`, `academy_staff`,
and `player_enrollments` tables. Apply
[`supabase/migrations/20261104110000_trial_booking_enrollment.sql`](./supabase/migrations/20261104110000_trial_booking_enrollment.sql)
to the configured Supabase project before using the workflow.
Apply
[`supabase/migrations/20261104140000_add_monthly_student_fees.sql`](./supabase/migrations/20261104140000_add_monthly_student_fees.sql)
to enable monthly fee tracking in the admin dashboard.
Apply
[`supabase/migrations/20261104150000_preserve_trial_approval_timestamp.sql`](./supabase/migrations/20261104150000_preserve_trial_approval_timestamp.sql)
to keep the original approval timestamp when an approved trial is enrolled.

To grant admin access:

1. Create an admin user in Supabase Authentication.
2. Add that user's Auth UUID and email to `public.academy_staff` using the
   Supabase SQL editor or dashboard. This is the existing database table used for admin
   access; do not expose it to public signup.
3. Admins sign in at `/staff`. Public trial requests are submitted at `/contact`;
   only approved requests can be converted into player enrollments.
