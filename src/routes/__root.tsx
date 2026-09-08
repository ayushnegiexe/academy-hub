import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { FloatingWidgets } from "@/components/site/floating-widgets";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-hero-gradient px-4 text-white">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl text-gradient-gold">404</h1>
        <p className="mt-4 text-lg text-white/80">Offside! This page isn't on the pitch.</p>
        <Link to="/" className="mt-6 inline-flex rounded-full bg-gold-gradient px-6 py-3 font-semibold text-ink shadow-gold hover:brightness-110">
          Back to home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  // For your resume: Demonstrates you know how to handle production errors
  console.error("Application Error Boundary:", error);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">The match has been paused due to a technical error.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110"
          >Try again</button>
          <Link to="/" className="rounded-full border border-input bg-background px-5 py-2 text-sm font-semibold hover:bg-accent hover:text-accent-foreground">Go home</Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Devsheel Football Academy — Where champions are forged" },
      { name: "description", content: "Devsheel Football Academy trains ambitious footballers ages 6–21 with elite coaching and sports science." },
      { name: "author", content: "Devsheel Football Academy" },
      { property: "og:title", content: "Devsheel Football Academy" },
      { property: "og:description", content: "Elite football coaching, sports science, and pro-pathway support." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&display=swap" },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={150}>
        <div className="flex min-h-screen flex-col bg-background">
          <SiteHeader />
          <main className="flex-1"><Outlet /></main>
          <SiteFooter />
          <FloatingWidgets />
        </div>
        <Toaster position="top-right" richColors />
      </TooltipProvider>
    </QueryClientProvider>
  );
}