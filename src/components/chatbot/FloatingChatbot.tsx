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
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { getSessionAction } from "@/actions/auth.actions";
import { IngestEvent, QueryEvent } from "@/actions/rag.actions";
import Link from "next/link";
import { getAiSuggestAction } from "@/actions/ai.actions";
import { AiSuggestion } from "@/types/ai.types";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import { AnimatePresence, motion } from "framer-motion";

// ================= TYPES =================

type MessageSource = {
  id: string;
  content: string;
  similarity: number;
  metadata?: { name?: string; [key: string]: unknown };
  sourceType?: string;
};

type EventItem = {
  id: string;
  title: string;
  description: string;
};

type Message = {
  id: string;
  role: "user" | "bot";
  content: string | EventItem[];
  sources?: MessageSource[];
  isError?: boolean;
  queryToRetry?: string;
};

// ================= INITIAL =================

const INITIAL_MESSAGES: Message[] = [
  {
    id: "welcome",
    role: "bot",
    content:
      "Hello! I'm your AI event assistant 👋\n\nAsk me anything about upcoming events — schedules, speakers, ticket prices, or how to register.",
  },
];

const SUGGESTED_QUERIES = [
  "What are the upcoming tech events?",
  "Are there any workshops this weekend?",
  "How do I register for the conference?",
];

// ================= TYPING =================

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 max-w-[85%]">
      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary shadow-md shrink-0">
        <Bot size={16} className="text-primary-foreground" />
      </div>

      <div className="bg-card border border-border rounded-[20px_20px_5px_20px] shadow-sm">
        <div className="flex items-center gap-1 px-4 py-3">
          <span
            className="w-2 h-2 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="w-2 h-2 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="w-2 h-2 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}

// ================= MESSAGE =================

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
      className={`flex items-end gap-2 ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-md"
        style={{
          background: isUser ? "var(--muted)" : "var(--primary)",
        }}
      >
        {isUser ? (
          <User size={16} className="text-primary-foreground" />
        ) : (
          <Bot size={16} className="text-primary-foreground" />
        )}
      </div>

      <div
        className={`flex flex-col gap-2 max-w-[80%] ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        {/* TEXT MESSAGE */}
        {typeof message.content === "string" && (
          <div
            className={cn(
              "rounded-2xl shadow-sm px-4 py-3 text-sm whitespace-pre-line break-words"
            )}
            style={{
              background: isUser ? "var(--primary)" : "var(--card)",
              color: isUser
                ? "var(--primary-foreground)"
                : "var(--card-foreground)",
              border: isUser ? "none" : "1px solid var(--border)",
              borderTopRightRadius: isUser ? 8 : 20,
              borderTopLeftRadius: isUser ? 20 : 8,
            }}
          >
            {message.content}
          </div>
        )}

        {/* ARRAY MESSAGE */}
        {Array.isArray(message.content) && (
          <div className="flex flex-col gap-3 w-full">
            {message.content.map((evt) => (
              <div
                key={evt.id}
                className="rounded-xl shadow-sm border border-border bg-card px-4 py-3"
              >
                <h4 className="font-semibold text-primary">
                  {evt.title}
                </h4>

                <p className="text-sm mt-1 text-muted-foreground">
                  {evt.description}
                </p>

                <div className="mt-3">
                  <Link
                    href={`/events/${evt.id}`}
                    target="_blank"
                    className="text-sm underline text-primary"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* RETRY */}
        {message.isError && message.queryToRetry && onRetry && (
          <button
            onClick={() => onRetry(message.queryToRetry!)}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded-md border"
          >
            <RefreshCw size={12} />
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

// ================= SUGGESTION ITEM =================

function SuggestionItem({
  title,
  selected,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: {
  title: string;
  selected: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: (title: string) => void;
}) {
  return (
    <li
      className={cn(
        "px-4 py-3 flex items-center gap-3 cursor-pointer transition",
        "hover:bg-zinc-100 dark:hover:bg-zinc-800",
        selected && "bg-zinc-100 dark:bg-zinc-800"
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={() => onClick(title)}
    >
      <span>🎯</span>

      <span className="truncate text-sm">{title}</span>
    </li>
  );
}

// ================= MAIN =================

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] =
    useState<Message[]>(INITIAL_MESSAGES);

  const [query, setQuery] = useState("");

  const [isQuerying, startQueryTransition] =
    useTransition();

  const [isSyncing, startSyncTransition] =
    useTransition();

  const [userRole, setUserRole] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const [suggestions, setSuggestions] = useState<
    AiSuggestion[]
  >([]);

  const [focusedIdx, setFocusedIdx] =
    useState<number>(-1);

  const scrollRef = useRef<HTMLDivElement>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // ================= FETCH ROLE =================

  useEffect(() => {
    const fetchRole = async () => {
      const user = await getSessionAction();
      setUserRole(user.data?.role as string);
    };

    fetchRole();
  }, []);

  // ================= AUTO SCROLL =================

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop =
        scrollRef.current.scrollHeight;
    }
  }, [messages, isQuerying]);

  // ================= FOCUS =================

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen]);

  // ================= AI SUGGEST =================

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);

        const res = await getAiSuggestAction(query);

        if (res.success) {
          setSuggestions(res.data || []);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  // ================= KEYBOARD =================

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!suggestions.length) return;

      if (e.key === "ArrowDown") {
        setFocusedIdx((prev) =>
          Math.min(prev + 1, suggestions.length - 1)
        );
      }

      if (e.key === "ArrowUp") {
        setFocusedIdx((prev) => Math.max(prev - 1, 0));
      }

      if (e.key === "Enter" && focusedIdx >= 0) {
        handleSuggestionClick(
          suggestions[focusedIdx].title
        );
      }
    };

    window.addEventListener("keydown", handleKey);

    return () =>
      window.removeEventListener("keydown", handleKey);
  }, [suggestions, focusedIdx]);

  // ================= SEND =================

  const handleSend = (customQuery?: string) => {
    const text = (customQuery || query).trim();

    if (!text || isQuerying) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);

    setQuery("");

    setSuggestions([]);

    startQueryTransition(async () => {
      try {
        const result = await QueryEvent(text);

        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          role: "bot",
          content: result.success
            ? result.data!
            : result.message ||
              "Something went wrong",
          isError: !result.success,
          queryToRetry: !result.success
            ? text
            : undefined,
        };

        setMessages((prev) => [...prev, botMsg]);

        if (!result.success) {
          toast.error(result.message || "Error");
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    });
  };

  // ================= SUGGESTION CLICK =================

  const handleSuggestionClick = (title: string) => {
    setSuggestions([]);
    setFocusedIdx(-1);

    handleSend(title);
  };

  // ================= SYNC =================

  const handleSync = () => {
    startSyncTransition(async () => {
      const result = await IngestEvent();

      if (result.success) {
        toast.success("Data synced successfully");
      } else {
        toast.error("Sync failed");
      }
    });
  };

  // ================= UI =================

  return (
    <>
      {/* CHAT WINDOW */}

      <div
        className={cn(
          "fixed bottom-5 right-5 z-[60]",
          "w-[95vw] sm:w-[400px]",
          "rounded-2xl border shadow-2xl bg-card",
          "transition-all duration-300",
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6 pointer-events-none"
        )}
        style={{
          maxHeight: "80vh",
        }}
      >
        {/* HEADER */}

        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Bot
                size={18}
                className="text-primary-foreground"
              />
            </div>

            <div>
              <h3 className="font-semibold">
                AI Event Assistant
              </h3>

              <p className="text-xs text-muted-foreground">
                Powered by AI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(userRole === "ADMIN" ||
              userRole === "MANAGER") && (
              <button
                onClick={handleSync}
                disabled={isSyncing}
                className="w-9 h-9 rounded-full border flex items-center justify-center"
              >
                <RefreshCw
                  size={16}
                  className={
                    isSyncing ? "animate-spin" : ""
                  }
                />
              </button>
            )}

            <button
              onClick={() => setIsOpen(false)}
              className="w-9 h-9 rounded-full hover:bg-muted flex items-center justify-center"
            >
              <ChevronDown size={18} />
            </button>
          </div>
        </div>

        {/* MESSAGES */}

        <div
          ref={scrollRef}
          className="overflow-y-auto p-4 space-y-4"
          style={{
            maxHeight: "55vh",
          }}
        >
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              onRetry={handleSend}
            />
          ))}

          {isQuerying && <TypingIndicator />}

          {messages.length === 1 && !isQuerying && (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground">
                Suggested Questions
              </p>

              {SUGGESTED_QUERIES.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="text-left border rounded-xl px-3 py-2 text-sm hover:bg-muted"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* INPUT */}

        <div className="border-t p-3">
          <div className="relative">
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
                value={query}
                disabled={isQuerying}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setFocusedIdx(-1);
                }}
                placeholder="Ask something..."
                className="flex-1 rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />

              <button
                type="submit"
                disabled={isQuerying}
                className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center"
              >
                <Send size={16} />
              </button>
            </form>

            {/* SUGGESTIONS */}

            <AnimatePresence>
              {((suggestions.length > 0 && query) ||
                loading) && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: 10,
                  }}
                  className="absolute bottom-16 left-0 right-0 bg-card border rounded-2xl shadow-xl overflow-hidden z-50"
                >
                  {loading &&
                  suggestions.length === 0 ? (
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-2/3" />
                      <Skeleton className="h-5 w-1/2" />
                    </div>
                  ) : (
                    <ul className="max-h-64 overflow-y-auto">
                      {suggestions.map((item, i) => (
                        <SuggestionItem
                          key={item.title + i}
                          title={item.title}
                          selected={focusedIdx === i}
                          onMouseEnter={() =>
                            setFocusedIdx(i)
                          }
                          onMouseLeave={() =>
                            setFocusedIdx(-1)
                          }
                          onClick={
                            handleSuggestionClick
                          }
                        />
                      ))}
                    </ul>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* FLOAT BUTTON */}

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-2xl flex items-center justify-center"
        >
          <MessageSquare size={24} />
        </button>
      )}
    </>
  );
}