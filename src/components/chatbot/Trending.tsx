"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import {
  Search,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import { getAiTrendingAction } from "@/actions/ai.actions";
import { IBaseEvent, TResponseEvent } from "@/types/event.types";

export type TrendingItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  users?: string;
  price?: string;
};

const Trending = ({events}:{events:IBaseEvent[]}) => {
  const [data, setData] = useState<
  IBaseEvent[]
  >(events);

  const [loading, setLoading] =
    useState(true);

  const [prompt, setPrompt] =
    useState("");

  useEffect(() => {
    const controller =
      new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);

        const res =
          await getAiTrendingAction(
            prompt,
            controller.signal
          );

        setData(res?.data as any || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [prompt,]);
  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
      {/* ========================================================================= */}
      {/* Header */}
      {/* ========================================================================= */}

      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5">
            <Sparkles className="h-4 w-4 text-indigo-400" />

            <span className="text-xs font-medium tracking-wide text-indigo-300">
              AI POWERED TRENDING
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Discover Trending Projects
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            Explore the most popular AI-powered
            collections, trending assets, and
            community-driven discoveries.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* Search */}
        {/* ========================================================================= */}

        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

          <Input
            value={prompt}
            onChange={(e) =>
              setPrompt(e.target.value)
            }
            placeholder="Search trending..."
            className="h-12 rounded-2xl border border-white/10 bg-zinc-900 pl-11 text-sm text-white placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-indigo-500/30"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Grid */}
      {/* ========================================================================= */}
      {data.map((item) => {
                return <div>
                  <h1>{item.category_name}</h1>
                </div>
})}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence>
          {loading
            ? Array.from({ length: 8 }).map(
                (_, index) => (
                  <SkeletonCard
                    key={index}
                  />
                )
              )
            : data.map((item) => (
                <TrendingCard
                  key={item.id}
                  item={item as IBaseEvent}
                />
              ))}
        </AnimatePresence>
      </div>

      {/* ========================================================================= */}
      {/* Empty State */}
      {/* ========================================================================= */}

      {data.length=== 0 && (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-zinc-900/40 p-10 text-center">
          <TrendingUp className="mb-4 h-12 w-12 text-zinc-600" />

          <h3 className="text-lg font-semibold text-white">
            No Trending Results
          </h3>

          <p className="mt-2 max-w-md text-sm text-zinc-400">
            Try searching with different keywords
            or explore trending collections later.
          </p>
        </div>
      )}
    </section>
  );
};

export default Trending;

// ============================================================================
// Trending Card
// ============================================================================

function TrendingCard({
  item,
}: {
  item: TResponseEvent;
}) {
  console.log(item,'item')
  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        y: -5,
      }}
      transition={{
        duration: 0.25,
      }}
      className="group overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/90 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10"
    >
      {/* ========================================================================= */}
      {/* Image */}
      {/* ========================================================================= */}

      <div className="relative aspect-[16/10] overflow-hidden">
        {/* <Image
          src={
            item.images[0] ||
            "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop"
          }
          alt={item.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        /> */}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        {/* Category */}
        <div className="absolute left-4 top-4">
          <div className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs font-medium text-zinc-200 backdrop-blur-md">
            {/* {item.category} */}
          </div>
        </div>

        {/* Trending */}
        <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md">
          <TrendingUp className="h-4 w-4 text-emerald-400" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Content */}
      {/* ========================================================================= */}

      <div className="space-y-5 p-5">
        <div className="space-y-2">
          <h3 className="line-clamp-1 text-base font-semibold tracking-tight text-white">
            {/* {item.title} */}
          </h3>

          <p className="line-clamp-2 text-sm leading-relaxed text-zinc-400">
            {/* {item.description} */}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
  
          <button className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/20">
            Explore

            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Skeleton Card
// ============================================================================

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/90">
      <Skeleton className="aspect-[16/10] w-full rounded-none bg-zinc-800" />

      <div className="space-y-4 p-5">
        <Skeleton className="h-5 w-24 rounded-full bg-zinc-800" />

        <div className="space-y-2">
          <Skeleton className="h-5 w-[90%] rounded-full bg-zinc-800" />

          <Skeleton className="h-4 w-full rounded-full bg-zinc-800" />

          <Skeleton className="h-4 w-[70%] rounded-full bg-zinc-800" />
        </div>

        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16 rounded-full bg-zinc-800" />

          <Skeleton className="h-10 w-24 rounded-2xl bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}