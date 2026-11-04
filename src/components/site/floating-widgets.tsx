import { useEffect, useRef, useState } from "react";
import { ArrowUp, MessageSquare, Send, Sparkles } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ChatMessage = {
  role: "assistant" | "user";
  text: string;
};

const initialMessage: ChatMessage = {
  role: "assistant",
  text: "Hi! I can help with academy age groups, trial requests, training approach, and location. What would you like to know?",
};

const ACADEMY_CONFIG = {
  announcement: {
    title: "Now Training",
    description: "U10 • U12 • U15 • U18 trial spots available.",
    buttonText: "Join a Session",
    link: "/contact",
  },
  chat: {
    title: "Academy Assistant",
    status: "Ask about Devsheel Academy",
  },
};

export function FloatingWidgets() {
  const [showTop, setShowTop] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    messageListRef.current?.scrollTo({
      top: messageListRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isSending]);

  async function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = message.trim();
    if (!question || isSending) return;

    setMessages((current) => [...current, { role: "user", text: question }]);
    setMessage("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: question }),
      });
      const result: unknown = await response.json();
      const reply =
        result &&
        typeof result === "object" &&
        "reply" in result &&
        typeof result.reply === "string"
          ? result.reply
          : result &&
              typeof result === "object" &&
              "error" in result &&
              typeof result.error === "string"
            ? result.error
            : "I couldn't get an answer just now. Please call +91 821 824 5579.";

      setMessages((current) => [...current, { role: "assistant", text: reply }]);
    } catch (error) {
      console.error("Academy assistant request failed:", error);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: "I couldn't connect just now. Please call +91 821 824 5579.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-4">
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
            <TooltipContent side="left" className="border-white/10 bg-black text-white">
              Scroll up
            </TooltipContent>
          </Tooltip>
        )}

        <Popover>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  aria-label="Ask the academy assistant"
                  className="group relative flex h-16 w-16 items-center justify-center rounded-full bg-gold-gradient text-ink shadow-[0_10px_30px_rgba(212,175,55,0.4)] transition-transform hover:scale-105 active:scale-95"
                >
                  <MessageSquare className="h-7 w-7" />
                  <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-crimson-deep bg-white text-black">
                    <Sparkles className="h-3 w-3" />
                  </span>
                </button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="left" className="border-white/10 bg-black text-white">
              Ask the academy assistant
            </TooltipContent>
          </Tooltip>

          <PopoverContent
            side="top"
            align="end"
            className="flex max-h-[min(34rem,calc(100dvh-7rem))] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-[1.5rem] border-white/10 bg-crimson-deep p-0 text-white shadow-2xl backdrop-blur-2xl"
          >
            <div className="bg-gold-gradient p-5 text-ink">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-widest">
                    {ACADEMY_CONFIG.chat.title}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold opacity-75">
                    {ACADEMY_CONFIG.chat.status}
                  </p>
                </div>
              </div>
            </div>

            <div
              ref={messageListRef}
              aria-live="polite"
              aria-label="Chat messages"
              className="flex min-h-40 flex-1 flex-col gap-3 overflow-y-auto p-4"
            >
              {messages.map((chatMessage, index) => (
                <p
                  key={`${index}-${chatMessage.role}`}
                  className={`max-w-[90%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    chatMessage.role === "user"
                      ? "self-end rounded-br-md bg-gold-gradient text-ink"
                      : "self-start rounded-bl-md bg-white/10 text-white"
                  }`}
                >
                  {chatMessage.text}
                </p>
              ))}
              {isSending && (
                <p className="self-start rounded-2xl rounded-bl-md bg-white/10 px-3 py-2 text-sm text-white/70">
                  Thinking...
                </p>
              )}
            </div>

            <form onSubmit={sendMessage} className="space-y-3 border-t border-white/10 p-4">
              <div className="flex gap-2">
                <Input
                  aria-label="Your academy question"
                  className="min-w-0 border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-gold/50"
                  placeholder="Ask an academy question..."
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  maxLength={600}
                  required
                  disabled={isSending}
                />
                <Button
                  type="submit"
                  size="icon"
                  aria-label="Send question"
                  className="shrink-0 bg-gold-gradient text-ink hover:brightness-110"
                  disabled={isSending || !message.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-[11px] leading-relaxed text-white/60">
                Academy questions only. Messages are processed by Google Gemini and aren’t saved by
                this website. Don’t include children’s names, contact details, birthdates, or health
                information.{" "}
                <a className="font-semibold text-gold underline" href="tel:+918218245579">
                  Call us
                </a>{" "}
                if you need help.
              </p>
            </form>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
