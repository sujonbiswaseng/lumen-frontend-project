"use client";

import { motion } from "framer-motion";

interface BlogCardSkeletonProps {
  className?: string;
  imageRatio?: string;
  showAvatar?: boolean;
  contentLines?: number;
  showActions?: boolean;
  minHeight?: string;
}

const BlogCardSkeleton: React.FC<BlogCardSkeletonProps> = ({
  className = "",
  imageRatio = "aspect-[3/2]",
  showAvatar = true,
  contentLines = 2,
  showActions = true,
  minHeight = "min-h-[120px]",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.99 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      aria-hidden="true"
      className={`
        max-w-[500px]
        w-full
        bg-card
        text-card-foreground
        mx-auto
        rounded-2xl
        border
        border-border
        shadow-sm
        overflow-hidden
        flex
        flex-col
        group
        animate-pulse
        ${minHeight}
        ${className}
      `}
      style={{
        boxShadow:
          "0 4px 24px 0 var(--shadow-color,rgba(0,0,0,0.10))",
      }}
    >
      {/* Image */}
      <div
        className={`relative w-full ${imageRatio} bg-muted overflow-hidden`}
      >
        <div className="w-full h-full bg-muted" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[var(--muted)] to-transparent" />
      </div>

      <div className="flex flex-col gap-4 p-6 flex-1">
        {/* Author */}
        {showAvatar && (
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-muted border border-border" />

            <div className="flex-1">
              <div className="h-5 w-2/3 bg-muted rounded mb-2" />

              <div className="flex gap-2">
                <div className="h-3 w-16 bg-muted rounded" />
                <div className="h-3 w-10 bg-muted rounded" />
              </div>
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="flex gap-2">
          <div className="h-4 w-20 bg-muted rounded" />
          <div className="h-4 w-16 bg-muted rounded" />
        </div>

        {/* Dynamic Content Lines */}
        <div className="space-y-2">
          {Array.from({ length: contentLines }).map((_, index) => (
            <div
              key={index}
              className={`h-4 bg-muted rounded ${
                index === contentLines - 1
                  ? "w-4/5"
                  : "w-full"
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center justify-between mt-auto">
            <div className="h-3 w-14 bg-muted rounded" />

            <div className="h-8 w-20 rounded-lg bg-muted" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BlogCardSkeleton;