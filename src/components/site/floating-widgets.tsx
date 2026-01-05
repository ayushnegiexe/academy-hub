import { useEffect, useState } from "react";
import { MessageSquare, X, Send, ArrowUp, Calendar, Trophy, Sparkles } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Easy configuration for your academy alerts
const ACADEMY_CONFIG = {
  announcement: {
    title: "Now Training",
    description: "U10 • U12 • U15 • U18 trial spots available.",
    buttonText: "Join a Session",
    link: "/contact",
  },
  chat: {
    title: "Talk to a Coach",
    status: "Coach online now",
    online: true,
  },
};

export function FloatingWidgets() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>


      {/* 2. ACTION BUTTONS (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-4">
        {/* Back to Top Button */}
        {showTop && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-crimson-deep/80 text-white backdrop-blur-md transition-all hover:scale-110 hover:bg-gold hover:text-ink"
                aria-label="Back to top"
              >
                <ArrowUp className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-black text-white border-white/10">
              Scroll up
            </TooltipContent>
          </Tooltip>
        )}

        {/* Coach Chat Popover */}
        <Popover>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <button className="group relative flex h-16 w-16 items-center justify-center rounded-full bg-gold-gradient text-ink shadow-[0_10px_30px_rgba(212,175,55,0.4)] transition-transform hover:scale-105 active:scale-95">
                  <MessageSquare className="h-7 w-7" />
                  <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-crimson-deep bg-white text-[10px] font-black text-black">
                    1
                  </span>
                </button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-black text-white border-white/10">
              Ask a Question
            </TooltipContent>
          </Tooltip>

          <PopoverContent
            side="top"
            align="end"
            className="w-80 overflow-hidden rounded-[2rem] border-white/10 bg-crimson-deep p-0 shadow-2xl backdrop-blur-2xl"
          >
            {/* Popover Header */}
            <div className="bg-gold-gradient p-6 text-ink">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-widest leading-none">
                    {ACADEMY_CONFIG.chat.title}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink" />
                    <p className="text-[10px] font-bold opacity-70 italic">
                      {ACADEMY_CONFIG.chat.status}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Message sent! A coach will be in touch shortly.");
                (e.target as any).reset();
              }}
              className="space-y-3 p-6"
            >
              <Input
                className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-gold/50"
                placeholder="Name"
                required
              />
              <Input
                className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-gold/50"
                type="email"
                placeholder="Email Address"
                required
              />
              <Textarea
                className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-gold/50"
                placeholder="How can we help?"
                rows={3}
                required
              />
              <Button
                type="submit"
                className="w-full bg-gold-gradient py-6 text-sm font-black uppercase tracking-widest text-ink hover:brightness-110"
              >
                Send Message <Send className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
