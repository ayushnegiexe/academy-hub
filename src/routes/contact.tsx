import { createFileRoute } from "@tanstack/react-router";
import { TrialBookingPage } from "@/components/site/trial-booking-page";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Book a Trial — Devsheel Football Academy" },
      {
        name: "description",
        content: "Request a trial session at Devsheel Football Academy.",
      },
    ],
  }),
  component: TrialBookingPage,
});
