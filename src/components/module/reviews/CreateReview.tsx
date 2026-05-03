"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createReview } from "@/actions/review.actions";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send } from "lucide-react";
import { toast } from "react-toastify";

/**
 * ReviewForm component for submitting reviews or replies.
 * Premium, scalable, and clean design with only global CSS variables for colors and a max-width centered layout.
 */

interface Props {
  eventId: string;
  parentId?: string;
  onSuccess?: (review: any) => void;
  defaultRating?: number;
  defaultComment?: string;
}

const stars = [1, 2, 3, 4, 5];

export default function ReviewForm({
  eventId,
  parentId,
  onSuccess,
  defaultRating = 0,
  defaultComment = "",
}: Props) {
  const router = useRouter();
  const [rating, setRating] = useState(defaultRating);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState(defaultComment);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setRating(0);
    setComment("");
    setHover(0);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast.warning("Comment is required");
      return;
    }

    if (rating < 1) {
      toast.warning("Please select at least 1 star");
      return;
    }

    try {
      setLoading(true);

      // Omit parentId if it's undefined
      const reviewData: { rating: number; comment: string; parentId?: string } = {
        rating,
        comment,
      };
      if (parentId !== undefined) {
        reviewData.parentId = parentId;
      }

      const res = await createReview(eventId, reviewData);

      if (!res.success) {
        toast.error(res.message || "Failed to add review");
        return;
      }

      toast.success(res.message || "Review added successfully");

      if ("data" in res && res.data !== undefined) {
        onSuccess?.(res.data);
      } else {
        onSuccess?.(undefined);
      }
      resetForm();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="
          max-w-[1440px]
          mx-auto
          w-full
          bg-card
          border border-border
          rounded-2xl
          shadow
          p-4 md:p-6
          space-y-4
        "
        aria-label={parentId ? "Reply form" : "Review form"}
      >
        {/* Star Rating */}
        <div className="flex items-center gap-3 md:gap-4">
          {stars.map((star) => {
            const active = (hover || rating) >= star;
            return (
              <motion.button
                tabIndex={0}
                type="button"
                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                key={star}
                className={`
                  p-1 rounded-full
                  focus-visible:outline-none 
                  focus-visible:ring-2 focus-visible:ring-primary/60
                  bg-transparent border-0 transition
                  `}
                style={{lineHeight:0}}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                initial={false}
                animate={{ scale: active ? 1.15 : 1, opacity: active ? 1 : 0.6 }}
                transition={{ type: "spring", stiffness: 320, damping: 19 }}
              >
                <Star
                  size={28}
                  strokeWidth={1.7}
                  className={
                    active
                      ? "text-primary fill-primary drop-shadow-sm"
                      : "text-muted-foreground"
                  }
                  aria-hidden="true"
                />
              </motion.button>
            );
          })}
        </div>

        {/* Comment Box */}
        <div className="relative">
          <textarea
            id={parentId ? "reply-textarea" : "review-textarea"}
            placeholder={parentId ? "Write a reply..." : "Write your review..."}
            className="
              w-full
              bg-input
              border border-input
              text-card-foreground
              placeholder:text-muted-foreground
              rounded-xl
              p-4 pr-12
              resize-none
              focus-visible:ring-2 focus-visible:ring-primary
              focus-visible:border-primary
              outline-none
              transition
              text-base
              min-h-[88px]
              disabled:opacity-60
            "
            rows={3}
            autoComplete="off"
            spellCheck
            maxLength={1000}
            value={comment}
            disabled={loading}
            onChange={(e) => setComment(e.target.value)}
            aria-required="true"
            aria-label={parentId ? "Reply" : "Review"}
          />
          <motion.button
            type="submit"
            className="
              absolute right-3 bottom-3
              flex items-center justify-center
              bg-primary text-primary-foreground
              rounded-full shadow-sm
              p-2
              transition
              hover:bg-primary/90
              focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-primary/70
              disabled:bg-muted disabled:text-muted-foreground
              disabled:cursor-not-allowed
            "
            disabled={loading}
            aria-label="Submit"
            initial={false}
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.04 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            {loading ? (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs font-medium"
              >
                ...
              </motion.span>
            ) : (
              <Send size={17} strokeWidth={2} />
            )}
          </motion.button>
        </div>
      </form>
    </section>
  );
}