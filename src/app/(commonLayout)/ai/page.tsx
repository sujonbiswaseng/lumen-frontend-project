"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { SearchIcon, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { getAiSuggestAction } from "@/actions/ai.actions";

type Suggestion = {
  title: string;
};

export default function SearchSession() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [focusedIdx, setFocusedIdx] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced AI Suggest API call
  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    const delay = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await getAiSuggestAction(query);
        if (!res.success) {
          toast.error(res.message || "suggestion failded");
        }
        setSuggestions(res.data || []);
      } catch (err) {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      clearTimeout(delay);
      controller.abort();
    };
  }, [query]);

  // Keyboard navigation for suggestions
  useEffect(() => {
    if (!suggestions.length) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        setFocusedIdx((v) => Math.min(v + 1, suggestions.length - 1));
      } else if (e.key === "ArrowUp") {
        setFocusedIdx((v) => Math.max(v - 1, 0));
      } else if (e.key === "Enter" && focusedIdx >= 0) {
        setQuery(suggestions[focusedIdx].title);
        setSuggestions([]);
        setFocusedIdx(-1);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [suggestions, focusedIdx]);

  const handleSuggestionClick = (title: string) => {
    setQuery(title);
    setSuggestions([]);
    setFocusedIdx(-1);
  };

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 min-h-[60vh] flex items-center justify-center">
      <main className="w-full flex flex-col items-center py-12 md:py-24">
        <motion.section
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-full max-w-2xl flex flex-col gap-12"
          ref={containerRef}
        >
          {/* HERO */}
          <header className="w-full flex flex-col gap-6 items-center text-center">
            <h1 className="text-4xl sm:text-5xl font-bold font-geist tracking-tight text-zinc-900 dark:text-zinc-100">
              <span>AI Search</span>
              <span className="bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-500 bg-clip-text text-transparent ml-2">
                Suggestions
              </span>
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-prose leading-relaxed">
              Discover relevant events and topics powered by intelligent AI suggestions in real time.
            </p>
          </header>
          {/* SEARCH BAR & SUGGEST PANEL */}
          <div className={cn("relative w-full max-w-xl mx-auto")}>
            <Input
              value={query}
              spellCheck={false}
              autoCorrect="off"
              placeholder="Search for events, topics, or actions…"
              className={cn(
                "bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-12 pr-4 py-4 text-lg font-medium focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-300 dark:focus:border-indigo-700 transition-shadow duration-200 shadow-sm",
                loading && "pr-12"
              )}
              aria-label="Search events"
              onChange={e => {
                setQuery(e.target.value);
                setFocusedIdx(-1);
              }}
              autoFocus
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-600">
              <SearchIcon className="w-6 h-6" />
            </span>
            {loading && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2">
                <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
              </span>
            )}
            <AnimatePresence>
              {((suggestions.length > 0 && query) || loading) && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className={cn(
                    "absolute z-20 mt-2 left-0 right-0 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl overflow-hidden",
                    loading && suggestions.length === 0 && "py-6"
                  )}
                >
                  {loading && suggestions.length === 0 ? (
                    <div className="flex flex-col gap-3 px-6">
                      <Skeleton className="h-6 w-1/2 rounded-xl my-2" />
                      <Skeleton className="h-6 w-5/6 rounded-xl my-2" />
                      <Skeleton className="h-6 w-2/3 rounded-xl my-2" />
                    </div>
                  ) : (
                    <ul>
                      {suggestions.map((item, i) => (
                        <SuggestionItem
                          key={item.title + i}
                          title={item.title}
                          selected={i === focusedIdx}
                          onMouseEnter={() => setFocusedIdx(i)}
                          onMouseLeave={() => setFocusedIdx(-1)}
                          onClick={handleSuggestionClick}
                        />
                      ))}
                    </ul>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>
      </main>
    </div>
  );
}

// Deduplicated SuggestionItem component, reused for all suggestions
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
        "px-6 py-4 flex items-center gap-3 text-base border-b last:border-none border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/70 cursor-pointer select-none transition-colors duration-150 focus:outline-none group rounded-none",
        selected && "bg-indigo-50 dark:bg-indigo-900/30"
      )}
      tabIndex={0}
      aria-selected={selected}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={() => onClick(title)}
    >
      <span className="text-indigo-500 dark:text-indigo-300 text-xl group-hover:scale-110 transition-transform">🎯</span>
      <span className="font-medium truncate">{title}</span>
    </li>
  );
}