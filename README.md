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
Apply
[`supabase/migrations/20261104160000_admin_dashboard_audit_history.sql`](./supabase/migrations/20261104160000_admin_dashboard_audit_history.sql)
to enable admin change history for student profile and monthly fee updates. Then apply
[`supabase/migrations/20261104170000_mutable_records_immutable_history.sql`](./supabase/migrations/20261104170000_mutable_records_immutable_history.sql)
to audit trial-request changes and deletions, allow admins to delete trial, enrollment, and fee
records, and keep the change history read-only. Deleting an enrolled trial request also deletes its
linked enrollment and fee records; each deletion remains in Change history.
Apply
[`supabase/migrations/20261104180000_allow_reapproving_declined_trials.sql`](./supabase/migrations/20261104180000_allow_reapproving_declined_trials.sql)
to let admins accept a previously declined trial request.

## Academy assistant

The floating assistant answers academy questions using only facts published on the website. It
does not save chat messages in this application, does not ask for personal information, and sends
questions to Google Gemini through the server-side `/api/chat` endpoint. It refuses unrelated
questions and directs visitors to the academy phone number when details are not published.

Set `ACADEMY_AI_API_KEY` to a Google AI Studio API key in the local server environment and as a
server-only environment variable in Vercel. Do not use a `VITE_` prefix or put the key in client
code. Restart/redeploy the server after setting it. The Vercel function is in `api/chat.ts`; use
the Vercel CLI (`vercel dev`) for local end-to-end testing because Vite's `npm run dev` does not
run Vercel functions. The assistant uses `gemini-2.5-flash`; update the model constant in
`api/chat.ts` if your Google project does not have access to it.
The application has basic per-instance request limiting; configure additional rate limiting at the
hosting layer if public traffic requires stronger abuse protection.

## Admin approval SMS

When an admin approves a trial on an iPhone, the dashboard opens Messages with the
guardian's number and a prefilled approval text. The admin reviews it and taps Send.
This uses the phone's built-in SMS app and requires no SMS provider, server credentials,
or Supabase changes. If the browser blocks the handoff, use the approval-text link shown on
the approved request.

To grant admin access:

1. Create an admin user in Supabase Authentication.
2. Add that user's Auth UUID and email to `public.academy_staff` using the
   Supabase SQL editor or dashboard. This is the existing database table used for admin
   access; do not expose it to public signup.
3. Admins sign in at `/admin`. Public trial requests are submitted at `/contact`;
   only approved requests can be converted into player enrollments.
