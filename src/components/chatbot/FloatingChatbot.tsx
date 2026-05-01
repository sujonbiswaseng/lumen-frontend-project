"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import {
  MessageSquare,
  X,
  Send,
  RefreshCw,
  Bot,
  User,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { getSessionAction } from "@/actions/auth.actions";
import { IngestEvent, QueryEvent } from "@/actions/rag.actions";
import Link from "next/link";

// Types
type MessageSource = {
  id: string;
  content: string;
  similarity: number;
  metadata?: { name?: string; [key: string]: unknown };
  sourceType?: string;
};

type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
  sources?: MessageSource[];
  isError?: boolean;
  queryToRetry?: string;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: "welcome",
    role: "bot",
    content:
      "Hello! I'm your AI healthcare assistant 👋\n\nAsk me anything about our doctors — their specialties, experience, fees, or patient reviews. I'll find the best match for you.",
  },
];
const SUGGESTED_QUERIES = [
  "Best cardiologists available?",
  "Neurologist in Dhaka?",
  "Affordable pediatricians?",
];

// Typing indicator
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 max-w-[85%]">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center bg-primary shadow-md shrink-0"
        aria-hidden
      >
        <Bot size={16} className="text-primary-foreground" />
      </div>
      <div className="bg-card border border-border rounded-[20px_20px_5px_20px] shadow-sm">
        <div className="flex items-center gap-1 px-4 py-3">
          <span
            className="w-2 h-2 rounded-full inline-block animate-bounce"
            style={{
              background: "var(--secondary)",
              animationDelay: "0ms",
            }}
          />
          <span
            className="w-2 h-2 rounded-full inline-block animate-bounce"
            style={{
              background: "var(--secondary)",
              animationDelay: "150ms",
            }}
          />
          <span
            className="w-2 h-2 rounded-full inline-block animate-bounce"
            style={{
              background: "var(--secondary)",
              animationDelay: "300ms",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Message Bubble
function MessageBubble({
  message,
  onRetry,
}: {
  message: Message;
  onRetry?: (query: string) => void;
}) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
      data-user={isUser}
    >
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-md"
        style={{
          background: isUser
            ? "var(--muted)"
            : "var(--primary)",
        }}
        aria-hidden
      >
        {isUser ? (
          <User size={16} className="text-primary-foreground" />
        ) : (
          <Bot size={16} className="text-primary-foreground" />
        )}
      </div>
      <div className={`flex flex-col gap-1.5 max-w-[78%] ${isUser ? "items-end" : "items-start"}`}>
        {/* Message Content (single line/text, or content array for special events) */}
        {typeof message.content === "string" && (
          <div
            className={`rounded-2xl shadow-sm px-4 py-3 text-[15px] whitespace-pre-line`}
            style={{
              background: isUser ? "var(--primary)" : "var(--card)",
              color: isUser ? "var(--primary-foreground)" : "var(--card-foreground)",
              border: isUser ? "none" : "1px solid var(--border)",
              borderTopRightRadius: isUser ? 8 : 20,
              borderTopLeftRadius: isUser ? 20 : 8,
            }}
          >
            {message.content}
          </div>
        )}
        {Array.isArray(message.content) && message.content.length > 0 && (
          <div className="flex flex-col gap-3 w-full">
            {message.content.map((evt: any) => (
              <div
                key={evt.id}
                className="rounded-xl shadow-sm border border-border bg-card px-4 py-3 w-full max-w-full"
              >
                <h4 className="font-semibold text-[15px] mb-1 text-primary">{evt.title}</h4>
                <p className="text-sm mb-1 text-muted-foreground">{evt.description}</p>
                <div className="flex gap-2 items-center mt-2">
                  {evt.id && (
                    <Link
                      href={`/events/${evt.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-xs font-medium transition text-primary hover:text-accent"
                    >
                      View Details
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Error Retry Button */}
        {message.isError && onRetry && message.queryToRetry && (
          <button
            onClick={() => onRetry(message.queryToRetry!)}
            className="flex items-center gap-1 text-xs font-medium mt-1 px-2 py-1 rounded-md border border-secondary bg-secondary/10 text-secondary hover:bg-secondary/20 transition"
          >
            <RefreshCw size={12} />
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

// Main Component
export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isQuerying, startQueryTransition] = useTransition();
  const [isSyncing, startSyncTransition] = useTransition();
  const [userRole, setUserRole] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchRole = async () => {
      const user = await getSessionAction();
      setUserRole(user.data?.role as string);
    };
    fetchRole();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isQuerying]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSync = () => {
    startSyncTransition(async () => {
      const result = await IngestEvent();
      if (result.success) {
        toast.success(`Doctor data synced!`, {
          description:
            result.message ?? `${result.data.count ?? 0} doctors indexed.`,
        });
      } else {
        toast.error("Sync failed");
      }
    });
  };

  const handleSend = (query?: string) => {
    const text = (query ?? inputValue).trim();
    if (!text || isQuerying) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    startQueryTransition(async () => {
      const result = await QueryEvent(text);

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: "bot",
        content: result.success
          ? result.data!
          : (result.message ?? "Something went wrong. Please try again."),
        sources: result.success ? result.data : undefined,
        isError: !result.success,
        queryToRetry: !result.success ? text : undefined,
      };

      setMessages((prev) => [...prev, botMsg]);
    });
  };

  // Responsive layout width
  // On mobile width: 100vw - horizontal padding (px-2), else width ranges from 360px to 420px (sm: 410, md: 380, lg: 420)
  // Fixed position, responsive, z-indexed, proper shadow, color tokens only
  return (
    <>
      {/* Chat Window */}
      <div
        className={`
          fixed bottom-5 right-5 z-[60] 
          w-full max-w-[95vw] xs:max-w-[380px] sm:max-w-[410px] md:max-w-[400px] lg:max-w-[420px]
          flex flex-col rounded-2xl border shadow-2xl bg-card transition-all duration-300 ease-in-out
          ${isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-6 pointer-events-none"}
        `}
        style={{
          maxHeight: "78vh",
          borderColor: "var(--border)",
        }}
        aria-hidden={!isOpen}
        tabIndex={-1}
      >
        {/* Header */}
        <div
          className="px-4 py-3 flex items-center justify-between shrink-0 border-b bg-card"
          style={{
            borderColor: "var(--border)",
          }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center bg-primary/90"
              aria-hidden
            >
              <Bot size={20} className="text-primary-foreground" />
            </div>
            <div>
              <span className="block font-semibold text-base leading-none text-foreground">
                AI Health Assistant
              </span>
              <span className="block text-xs mt-0.5 text-muted-foreground font-medium tracking-wide">
                Powered by RAG · Always online
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {(userRole === "ADMIN" || userRole === "MANAGER") && (
              <button
                onClick={handleSync}
                disabled={isSyncing}
                title="Sync Doctor Data"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors border border-input bg-card hover:bg-secondary hover:text-secondary-foreground text-foreground disabled:opacity-50"
                aria-label="Sync data"
                type="button"
              >
                <RefreshCw
                  size={16}
                  className={isSyncing ? "animate-spin" : ""}
                />
              </button>
            )}
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors cursor-pointer text-foreground"
              aria-label="Close chat"
              type="button"
            >
              <ChevronDown size={18} />
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-3 py-4 space-y-4 min-h-[160px] max-h-[55vh] bg-background"
        >
          {/* Chat stream */}
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} onRetry={handleSend} />
          ))}

          {isQuerying && <TypingIndicator />}

          {/* Suggested queries - welcome state only */}
          {messages.length === 1 && !isQuerying && (
            <div className="flex flex-col gap-2 mt-1">
              <p className="text-xs font-medium text-muted-foreground px-2">
                Try asking:
              </p>
              {SUGGESTED_QUERIES.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  type="button"
                  className="text-left text-sm px-3 py-2 border border-input rounded-xl bg-card hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                  style={{
                    color: "var(--primary)",
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input area */}
        <div
          className="shrink-0 px-3 py-3 border-t bg-card"
          style={{
            borderColor: "var(--border)",
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask about doctors, specialties..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isQuerying}
              className="flex-1 text-sm rounded-xl px-3 py-2.5 bg-input text-foreground placeholder:text-muted-foreground border border-input focus:border-primary focus:ring-2 focus:ring-primary outline-none transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isQuerying || !inputValue.trim()}
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-all disabled:opacity-50 shadow-md active:scale-95"
              aria-label="Send"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"}
        className={`fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer bg-primary text-primary-foreground border-2 border-accent ${isOpen ? "rotate-90" : "rotate-0"} focus:outline-none focus:ring-4 focus:ring-primary`}
        type="button"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && (
          <span
            className="absolute inset-0 rounded-full animate-ping pointer-events-none"
            style={{
              background: "var(--accent)",
              opacity: 0.16,
            }}
          />
        )}
      </button>
    </>
  );
}