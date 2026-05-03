"use client";

import { Variants, motion } from "framer-motion";
import ImageSkeleton from "@/components/ImageSkeleton";
import { IBaseUser } from "@/types/user.types";
import { TResponseHighlight } from "@/types/highlight.types";

/**
 * Animation variants for staggered grid and cards.
 */
const cardVariants: Variants = {
  initial: { opacity: 0, y: 28 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const listStagger: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.15,
    },
  },
};

type HighLightContentProps = {
  highlight: TResponseHighlight<{ user: IBaseUser }>[];
};

const HighLightContent = ({ highlight }: HighLightContentProps) => (
  <section
    id="highlights"
    aria-labelledby="highlights-heading"
    className="relative w-full bg-card"
  >
    <div className="w-full max-w-[1440px] mx-auto flex flex-col items-center px-4 py-8 md:px-8 md:py-10">
      {/* Header */}
      <div className="w-full max-w-3xl text-center mb-8">
        <h2
          id="highlights-heading"
          className="text-[1.5rem] md:text-[2rem] font-semibold leading-tight tracking-tight text-card-foreground"
        >
          Latest Highlights
        </h2>
        <p className="mt-2 text-sm md:text-base text-muted-foreground">
          Featured stories and updates from recent activities.
        </p>
      </div>

      {/* Highlights Grid */}
      <motion.div
        variants={listStagger}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.15 }}
        className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-4"
        role="list"
      >
        {highlight && highlight.length > 0 ? (
          highlight.map((item) => {
            const hasValidImage =
              Boolean(item.image && !item.image.startsWith("blob:"));
            const createdDate = item.createdAt
              ? new Date(item.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Recently updated";

            return (
              <motion.article
                key={item.id}
                variants={cardVariants}
                tabIndex={0}
                aria-label={item.title || "Highlight"}
                className="group flex flex-col h-full transition border border-border rounded-xl bg-card shadow-sm focus-within:ring-2 focus-within:ring-primary/70 hover:ring-2 hover:ring-accent/60 outline-none overflow-hidden"
                role="listitem"
              >
                {/* Image or Placeholder */}
                {hasValidImage ? (
                  <div className="h-44 w-full bg-input flex items-center justify-center overflow-hidden">
                    <ImageSkeleton
                      src={item.image!}
                      alt={item.title || "Highlight image"}
                    />
                  </div>
                ) : (
                  <div className="flex h-44 w-full items-center justify-center bg-muted text-muted-foreground text-base font-medium">
                    No Preview
                  </div>
                )}

                {/* Card Content */}
                <div className="flex flex-col flex-1 px-5 py-4">
                  <h3 className="line-clamp-1 text-base font-semibold text-card-foreground mb-2">
                    {item.title || "Untitled Highlight"}
                  </h3>
                  <p className="line-clamp-2 text-sm text-muted-foreground mb-4">
                    {item.description || "No description available."}
                  </p>
                  <div className="mt-auto pt-2 flex items-center justify-between text-xs text-muted-foreground gap-2">
                    <span className="truncate max-w-[60%]">{item.user?.name || "lumen Team"}</span>
                    <span className="font-normal">{createdDate}</span>
                  </div>
                </div>
              </motion.article>
            );
          })
        ) : (
          <motion.div
            variants={cardVariants}
            className="col-span-full flex flex-col items-center justify-center rounded-xl bg-muted border border-border py-12"
          >
            <span className="text-muted-foreground text-base font-medium">
              No highlights found.
            </span>
          </motion.div>
        )}
      </motion.div>
    </div>
  </section>
);

export default HighLightContent;