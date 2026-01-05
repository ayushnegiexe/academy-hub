import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import logo from "@/assets/devsheel-logo-light.png";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

const NAV = [
  { to: "/", label: "Home", blurb: "Overview of the academy and how we train." },
  { to: "/about", label: "Academy", blurb: "Our story, approach, and what we stand for." },
  { to: "/programs", label: "Programs", blurb: "Age groups: U10, U12, U15 and U18." },
  { to: "/contact", label: "Contact", blurb: "Visit us or send a quick message." },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const routerState = useRouterState() as any;
  const currentPath = routerState.location.pathname;

  useEffect(() => setOpen(false), [currentPath]);

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-white/10 bg-crimson-deep/95 py-3 shadow-lg backdrop-blur-xl">
      <div className="absolute inset-0 -z-10 bg-hero-gradient opacity-95" aria-hidden />

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-6">
        <Link
          to={"/" as any}
          className="flex items-center gap-3 transition-transform hover:scale-105 active:scale-95"
        >
          <img src={logo} alt="Devsheel Football Academy" className="h-14 w-auto md:h-20 drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)]" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const active = currentPath === item.to;
            return (
              <HoverCard key={item.to} openDelay={50} closeDelay={100}>
                <HoverCardTrigger asChild>
                  <Link
                    to={item.to as any}
                    className={`relative rounded-full px-5 py-2 text-[11px] font-bold uppercase tracking-[0.15em] transition-all ${
                      active ? "text-gold" : "text-white/70 hover:text-white"
                    }`}
                  >
                    {item.label}
                    {active && (
                      <span className="absolute inset-x-5 -bottom-1 h-0.5 rounded-full bg-gold-gradient shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
                    )}
                  </Link>
                </HoverCardTrigger>
                <HoverCardContent className="w-64 border-white/10 bg-crimson-deep/95 text-white backdrop-blur-2xl">
                  <p className="text-sm font-bold uppercase tracking-widest text-gold">
                    {item.label}
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-white/60">{item.blurb}</p>
                </HoverCardContent>
              </HoverCard>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Button
            asChild
            className="group bg-gold-gradient font-bold text-ink hover:brightness-110"
          >
            <Link to={"/contact" as any} className="flex items-center gap-2">
              Contact Academy{" "}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="rounded-full bg-white/10 p-2.5 text-white lg:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="absolute top-full left-0 w-full animate-in fade-in slide-in-from-top-2 border-t border-white/10 bg-crimson-deep/95 backdrop-blur-2xl lg:hidden">
          <div className="flex flex-col gap-1 p-4">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to as any}
                className={`rounded-xl px-4 py-4 text-xs font-bold uppercase tracking-widest transition-colors ${
                  currentPath === item.to ? "bg-white/10 text-gold" : "text-white/70"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Button
              asChild
              className="mt-4 bg-gold-gradient py-7 text-ink font-bold uppercase tracking-widest"
            >
              <Link to={"/contact" as any}>Contact Us</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
