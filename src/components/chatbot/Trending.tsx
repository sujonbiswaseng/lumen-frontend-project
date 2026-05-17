"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  Calendar,
  MapPin,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getAiTrendingAction } from "@/actions/ai.actions";
import { IBaseEvent, TResponseEvent } from "@/types/event.types";
import Link from "next/link";

// =========================================================================
// 🔥 Trending · Enterprise-Grade AI Event Listing
// =========================================================================

const Trending = ({
  events,
}: {
  events: IBaseEvent[];
}) => {
  const [data, setData] = useState<IBaseEvent[]>(events);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");

  // Debounced Live Search
  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getAiTrendingAction(prompt, controller.signal);
        if (res?.success) {
          setData((res.data as IBaseEvent[]) || []);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    const timeout = setTimeout(() => {
      fetchData();
    }, 400);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [prompt]);

  return (
    <section className="w-full py-12 md:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}
          <div>
            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-6 py-3 shadow-sm">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400 dark:text-indigo-300 font-geist">
                AI Powered Trending
              </span>
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-zinc-900 dark:text-zinc-100 font-geist">
              Discover Trending Events
            </h1>
            <p className="max-w-2xl text-sm md:text-base leading-6 text-zinc-600 dark:text-zinc-400 font-inter">
              Explore the hottest upcoming conferences, hackathons, and workshops—AI-recommended, handpicked, and always up to date.
            </p>
          </div>
          {/* Right - Search */}
          <div className="relative w-full max-w-md mt-8 lg:mt-0">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 dark:text-zinc-500" />
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              aria-label="Search trending events"
              placeholder="Search trending events..."
              className="h-12 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 pl-12 pr-4 text-sm md:text-base font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-500 font-inter transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
            />
          </div>
        </header>
       
        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {loading
              ? Array.from({ length: 8 }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))
              : data.map((item) => (
                  <TrendingCard
                    key={item.id}
                    item={item as TResponseEvent}
                  />
                ))}
          </AnimatePresence>
        </div>
        {/* Empty State */}
        {!loading && data.length === 0 && (
          <div className="mt-16 flex min-h-[320px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 px-8 py-16 text-center shadow-sm">
            <TrendingUp className="mb-7 h-12 w-12 text-zinc-300 dark:text-zinc-700" aria-hidden />
            <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-geist">
              No Trending Results
            </h3>
            <p className="mt-3 max-w-md text-sm md:text-base text-zinc-600 dark:text-zinc-400 font-inter">
              Try a different search keyword or check back soon for new AI-powered event recommendations.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Trending;

// ============================================================================
// CARD COMPONENT · Enterprise, Accessible, Consistent
// ============================================================================

function TrendingCard({
  item,
}: {
  item: TResponseEvent;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.18, ease: "easeInOut" }}
      className="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900 focus-within:ring-2 focus-within:ring-indigo-500 outline-none"
      tabIndex={0}
      aria-labelledby={`event-title-${item.id}`}
      aria-describedby={`event-desc-${item.id}`}
    >
      {/* IMAGE */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl mb-5">
        <Image
          src={
            item.images?.[0] ||
            "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop"
          }
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          draggable={false}
          sizes="(max-width: 768px) 100vw, 400px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-90 pointer-events-none z-10" />
        {/* CATEGORY */}
        {item.category_name && (
          <div className="absolute left-4 top-4 z-20">
            <div className="rounded-full border border-zinc-200 dark:border-zinc-700 bg-white/30 dark:bg-zinc-900/60 px-3 py-1 text-xs font-medium text-zinc-900 dark:text-zinc-100 font-inter backdrop-blur shadow-sm">
              {item.category_name}
            </div>
          </div>
        )}
        {/* TRENDING ICON */}
        <div className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white/40 dark:bg-zinc-900/60 backdrop-blur shadow">
          <TrendingUp className="h-4 w-4 text-emerald-500" />
        </div>
      </div>
      {/* CONTENT */}
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <h3
            id={`event-title-${item.id}`}
            className="line-clamp-1 text-lg md:text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 font-geist transition-colors"
          >
            <Link
              href={`/events/${item.id}`}
              className="inline-flex items-center gap-2 hover:text-indigo-600 focus:text-indigo-700 dark:hover:text-indigo-400 dark:focus:text-indigo-500 focus:outline-none transition-colors"
            >
              <span>{item.title}</span>
              <ArrowUpRight className="h-4 w-4 opacity-80 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
            </Link>
          </h3>
          <p
            id={`event-desc-${item.id}`}
            className="line-clamp-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400 font-inter"
          >
            {item.description}
          </p>
        </div>
        {/* META */}
        <div className="flex flex-col gap-2 md:flex-row md:gap-6">
          {item.date && (
            <div className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-400 font-inter">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(item.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
          {item.location && (
            <div className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-400 font-inter">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{item.location}</span>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

// ============================================================================
// SKELETON CARD · Enterprise, Premium, Consistent
// ============================================================================

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm animate-pulse">
      <Skeleton className="aspect-[16/10] w-full rounded-xl bg-zinc-100 dark:bg-zinc-900 mb-5" />
      <div className="space-y-6">
        <Skeleton className="h-5 w-28 rounded-full bg-zinc-100 dark:bg-zinc-800" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-4/5 rounded-full bg-zinc-100 dark:bg-zinc-800" />
          <Skeleton className="h-4 w-full rounded-full bg-zinc-100 dark:bg-zinc-800" />
          <Skeleton className="h-4 w-2/3 rounded-full bg-zinc-100 dark:bg-zinc-800" />
        </div>
        <div className="flex items-center gap-6">
          <Skeleton className="h-4 w-16 rounded-full bg-zinc-100 dark:bg-zinc-800" />
          <Skeleton className="h-8 w-20 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}