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
import { getAiRecommendAction } from "@/actions/ai.actions";
import {
  IBaseEvent,
  TResponseEvent,
} from "@/types/event.types";
import Link from "next/link";

// ============================================================================
// MAIN
// ============================================================================

const Recomandation = () => {
  const [data, setData] = useState<IBaseEvent[]>();
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");

  // ============================================================================
  // SEARCH
  // ============================================================================

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await getAiRecommendAction(prompt, controller.signal);

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
    <section className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 py-12">
      {/* ========================================================================= */}
      {/* HEADER */}
      {/* ========================================================================= */}
      <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-indigo-500/20 bg-indigo-600/10 px-5 py-2.5">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            <span className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">
              AI Powered Recommendation
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-950 dark:text-zinc-100 font-geist mb-4">
            Discover Recommended Events
          </h1>
          <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-zinc-700 dark:text-zinc-400 font-inter">
            Explore the hottest upcoming conferences, workshops, hackathons, and community events powered by AI recommendations.
          </p>
        </div>
        {/* SEARCH */}
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 dark:text-zinc-500" />
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Search recommended events..."
            className="h-12 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 pl-12 text-base font-medium text-zinc-950 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-indigo-500/20 dark:focus-visible:ring-indigo-500/30 transition-all"
          />
        </div>
      </div>
      {/* ========================================================================= */}
      {/* CATEGORY PREVIEW */}
      {/* ========================================================================= */}
      <div className="mb-10 flex flex-wrap gap-4">
        {[...new Set(data?.map((item) => item.category_name))]
          .slice(0, 6)
          .map((category, i) => (
            <div
              key={i}
              className="rounded-full border border-zinc-300 dark:border-zinc-700 bg-zinc-100/75 dark:bg-zinc-800/80 px-5 py-2 text-sm font-medium text-zinc-900/90 dark:text-zinc-100/90 backdrop-blur-xl"
            >
              {category}
            </div>
          ))}
      </div>
      {/* ========================================================================= */}
      {/* GRID */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            : data?.map((item) => (
                <RecomandationCard key={item.id} item={item as TResponseEvent} />
              ))}
        </AnimatePresence>
      </div>
      {/* ========================================================================= */}
      {/* EMPTY */}
      {/* ========================================================================= */}
      {!loading && (!data || data.length === 0) && (
        <div className="mt-14 flex min-h-[320px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900/60 p-12 text-center">
          <TrendingUp className="mb-6 h-12 w-12 text-zinc-400 dark:text-zinc-700" />
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            No Recommendation Results
          </h3>
          <p className="mt-2 max-w-md text-base text-zinc-700 dark:text-zinc-400">
            Try searching with different keywords or check back later for recommendation updates.
          </p>
        </div>
      )}
    </section>
  );
};

export default Recomandation;

function RecomandationCard({
  item,
}: {
  item: TResponseEvent;
}) {
  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        scale: 0.95,
      }}
      whileHover={{
        y: -8,
      }}
      transition={{
        duration: 0.22,
      }}
      className="group overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white/95 dark:bg-zinc-950/95 shadow-[0_2px_24px_0_rgba(18,20,35,0.07)] backdrop-blur-lg transition-all duration-200 hover:border-indigo-500/30 dark:hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/10"
    >
      {/* IMAGE */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={
            item.images?.[0] ||
            "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop"
          }
          alt={item.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 dark:from-black via-zinc-900/35 dark:via-zinc-900/45 to-transparent" />
        {/* CATEGORY */}
        <div className="absolute left-4 top-4">
          <div className="rounded-full border border-zinc-200 dark:border-zinc-600 bg-white/70 dark:bg-black/70 px-3 py-1 text-xs font-medium text-zinc-900/90 dark:text-zinc-100/90 backdrop-blur-md shadow-md">
            {item.category_name || "Recommendation"}
          </div>
        </div>
        {/* TRENDING ICON */}
        <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-600 bg-white/90 dark:bg-black/70 backdrop-blur-md shadow">
          <TrendingUp className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
        </div>
      </div>
      {/* CONTENT */}
      <div className="space-y-4 px-5 py-6">
        <div className="space-y-2">
          <h3 className="line-clamp-1 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 font-geist transition-colors duration-200">
            <Link
              href={`/events/${item.id}`}
              className="inline-flex items-center gap-2 hover:text-indigo-500 focus:text-indigo-600 dark:hover:text-indigo-400 dark:focus:text-indigo-500 focus:outline-none"
            >
              <span>{item.title}</span>
              <ArrowUpRight className="h-4 w-4 opacity-80 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
            </Link>
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-400 font-inter">
            {item.description}
          </p>
        </div>
        {/* META */}
        <div className="space-y-2">
          {item.date && (
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-300">
              <Calendar className="h-4 w-4" />
              <span>{new Date(item.date).toLocaleDateString()}</span>
            </div>
          )}
          {item.location && (
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-300">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{item.location}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// SKELETON
// ============================================================================

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white/90 dark:bg-zinc-950/90 shadow-lg">
      <Skeleton className="aspect-[16/10] w-full rounded-none bg-zinc-100/80 dark:bg-zinc-900/80" />
      <div className="space-y-5 px-5 py-6">
        <Skeleton className="h-5 w-28 rounded-full bg-zinc-200/70 dark:bg-zinc-800/80" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-[90%] rounded-full bg-zinc-200/70 dark:bg-zinc-800/80" />
          <Skeleton className="h-4 w-full rounded-full bg-zinc-200/70 dark:bg-zinc-800/80" />
          <Skeleton className="h-4 w-2/3 rounded-full bg-zinc-200/70 dark:bg-zinc-800/80" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16 rounded-full bg-zinc-200/70 dark:bg-zinc-800/80" />
          <Skeleton className="h-9 w-24 rounded-xl bg-zinc-200/70 dark:bg-zinc-800/80" />
        </div>
      </div>
    </div>
  );
}