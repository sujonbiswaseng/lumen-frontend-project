"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CopyIdProps {
  id: string;
  href?: string;
  showShort?: boolean;
  className?: string;
  label?: string;
}

export const CopyId: React.FC<CopyIdProps> = ({
  id,
  href,
  showShort = true,
  className = "",
  label = "",
}) => {
  const router = useRouter();

  const handleClick = React.useCallback(
    async (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      event.stopPropagation();

      // ALT + Click = Only copy the ID
      if (event.altKey) {
        try {
          await navigator.clipboard.writeText(id);
          toast.success("Copied ID!");
        } catch {
          toast.error("Copy failed!");
        }
        return;
      }
      // Normal click = Navigate (if href)
      if (href) {
        router.push(href);
      }
    },
    [id, href, router]
  );

  return (
    <motion.span
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      title={label || "Click to view · Alt+Click to copy"}
      className={cn(
        // Root design system container
        "group inline-flex items-center gap-1 cursor-pointer",
        // Production color + transition, never hardcoded
        "text-primary hover:text-accent",
        // Subtle underline on inner span
        "transition-all duration-300 ease-out",
        // Consistent vertical alignment
        "leading-tight select-none",
        // Allow dynamic user classes (for size/layout override)
        className
      )}
      // Accessibility
      tabIndex={0}
      role="button"
      aria-label={label || "Copy ID"}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick(e as any);
        }
      }}
      data-testid="copy-id"
    >
      <span className="hover:underline text-inherit font-mono text-[.96em]">
        {showShort ? `${id.slice(0, 6)}...` : id}
      </span>
      <motion.span
        // Fade-in copy hint, subtle size
        initial={{ opacity: 0, x: 4 }}
        animate={{ opacity: 1, x: 0, transition: { duration: 0.23, ease: "easeOut" } }}
        exit={{ opacity: 0, x: 4, transition: { duration: 0.17 } }}
        className={cn(
          "text-[11px] opacity-0 group-hover:opacity-100 ml-1",
          // Modern muted/foreground hint, accessible
          "text-muted-foreground",
          "transition duration-300"
        )}
        aria-hidden="true"
      >
        📋
      </motion.span>
    </motion.span>
  );
};

export default CopyId;