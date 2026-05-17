"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type TrendingCardItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  image?: string;
  price?: string;
  users?: string;
  buttonText?: string;
};

type TrendingCardProps = {
  item: TrendingCardItem;
  href?: string;
  className?: string;
};

/**
 * TrendingCard
 * Premium SaaS Trending Card component using strict, centered RootLayout container design.
 * - Consistent max-w-[1440px] containment for enterprise-grade visual system.
 * - WCAG-compliant color palette and spacing scale.
 * - Smooth, minimal Framer Motion animation.
 * - Card width adapts to grid but card content respects root-wide visual rhythm.
 */

export function TrendingCard({
  item,
  href = `/project/${item.id}`,
  className,
}: TrendingCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, boxShadow: "0 12px 48px 0 rgba(80,0,200,0.05)" }}
      transition={{
        duration: 0.22,
        ease: "easeOut",
      }}
      className={cn(
        // Card container: readable, soft shadow, consistent border and radius
        "group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/92",
        "shadow-[0_2px_32px_0_rgba(48,24,120,0.06)]",
        "transition-all duration-300 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10",
        className
      )}
      tabIndex={0}
      role="article"
      aria-label={item.title}
    >
      {/* Glow Accent */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/15 via-transparent to-violet-500/15 opacity-0 transition-opacity duration-500 group-hover:opacity-70" />
      </div>

      {/* Card Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {item.image && (
          <Image
            src={item.image}
            alt={item.title}
            fill
            priority={false}
            draggable={false}
            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            sizes="(min-width: 1024px) 600px, (min-width: 768px) 50vw, 100vw"
          />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        {/* Category */}
        <div className="absolute left-4 top-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-200 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" aria-hidden="true" />
            {item.category}
          </span>
        </div>
        {/* Trending badge */}
        <div className="absolute right-4 top-4">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-black/50 backdrop-blur-lg">
            <TrendingUp className="h-4 w-4 text-emerald-400" aria-label="Trending" />
          </span>
        </div>
        {/* Bottom Stats */}
        {(item.price || item.users) && (
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2">
            {item.price && (
              <div className="rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1 text-xs font-bold text-yellow-300 backdrop-blur">
                {item.price}
              </div>
            )}
            {item.users && (
              <div className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs font-medium text-zinc-200 backdrop-blur">
                {item.users} users
              </div>
            )}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-col justify-between space-y-6 px-6 py-5 md:px-7">
        <div className="space-y-1.5">
          <h3 className="line-clamp-1 text-lg font-medium tracking-tight text-white">
            {item.title}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-zinc-400">
            {item.description}
          </p>
        </div>
        {/* Footer: status + CTA */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-400/80 inline-block animate-pulse" />
            <span className="sr-only">Currently trending</span>
            <span className="text-zinc-400 font-medium">Live Trending</span>
          </div>

          <Link
            href={href}
            tabIndex={0}
            aria-label={`Explore ${item.title}`}
            className={cn(
              "inline-flex items-center gap-2 rounded-2xl px-4 py-2",
              "text-sm font-semibold",
              "bg-gradient-to-r from-indigo-500 to-violet-600",
              "shadow-indigo-900/10 text-white",
              "transition-all duration-200 ease-out",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2",
              "hover:scale-[1.035] hover:shadow-xl hover:shadow-indigo-500/20"
            )}
          >
            {item.buttonText || "Explore"}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}