import { useEffect, useRef, useState } from "react";
import { ArrowUp, MessageSquare, Send, Sparkles } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type ChatMessage = {
  role: "assistant" | "user";
  text: string;
};

const initialMessage: ChatMessage = {
  role: "assistant",
  text: "Welcome! I can help with age groups, trial requests, our training approach, and finding the academy. What can I help you with?",
};

const suggestedQuestions = [
  "Which age groups do you train?",
  "How do I book a trial?",
  "Where is the academy?",
];

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

  async function sendQuestion(question: string) {
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

  function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendQuestion(message.trim());
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
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-ink" />
                    <p className="text-[11px] font-semibold opacity-75">
                      {ACADEMY_CONFIG.chat.status}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              ref={messageListRef}
              aria-live="polite"
              aria-label="Chat messages"
              className="flex min-h-40 flex-1 flex-col gap-3 overflow-y-auto bg-gradient-to-b from-white/[0.03] to-transparent p-4"
            >
              {messages.map((chatMessage, index) => (
                <p
                  key={`${index}-${chatMessage.role}`}
                  className={`max-w-[90%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    chatMessage.role === "user"
                      ? "self-end rounded-br-md bg-gold-gradient font-medium text-ink"
                      : "self-start rounded-bl-md border border-white/10 bg-white/[0.08] text-white"
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
              {messages.length === 1 && !isSending && (
                <div className="mt-1 grid gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">
                    Quick questions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.map((question) => (
                      <button
                        key={question}
                        type="button"
                        disabled={isSending}
                        onClick={() => void sendQuestion(question)}
                        className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-2 text-left text-xs font-medium text-white/85 transition-colors hover:border-gold/60 hover:bg-gold/10 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={sendMessage} className="border-t border-white/10 bg-black/10 p-4">
              <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-2 transition-colors focus-within:border-gold/60 focus-within:ring-2 focus-within:ring-gold/20">
                <Textarea
                  aria-label="Your academy question"
                  className="min-h-16 resize-none border-0 bg-transparent px-2 py-2 text-sm text-white shadow-none placeholder:text-white/45 focus-visible:ring-0"
                  placeholder="Ask us about the academy..."
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  maxLength={600}
                  rows={2}
                  required
                  disabled={isSending}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      void sendQuestion(message.trim());
                    }
                  }}
                />
                <div className="flex items-center justify-between border-t border-white/10 px-1 pt-2">
                  <span className="text-[10px] text-white/45">
                    {message.length}/600 · Enter to send
                  </span>
                  <Button
                    type="submit"
                    size="sm"
                    className="h-9 rounded-xl bg-gold-gradient px-4 font-bold text-ink shadow-md transition-transform hover:scale-[1.02] hover:brightness-110"
                    disabled={isSending || !message.trim()}
                  >
                    {isSending ? "Sending..." : "Send"}
                    <Send className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <p className="mt-3 text-[10px] leading-relaxed text-white/55">
                Academy questions only. Don’t include children’s names, contact details, birthdates,
                or health information.{" "}
                <a
                  className="font-semibold text-gold underline underline-offset-2"
                  href="tel:+918218245579"
                >
                  Contact the academy
                </a>
                .
              </p>
            </form>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
