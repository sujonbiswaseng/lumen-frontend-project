'use client';

import { TGetCategory } from "@/types/category.type";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import * as React from "react";

/**
 * Framer Motion: Clean, subtle motion for scale/fade-in
 */
const CARD_ANIMATION = {
  initial: { opacity: 0, y: 32, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 24, scale: 0.97 },
  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
};

const STAGGER = {
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

/**
 * CategoryCard - A reusable production-grade card for categories
 */
function CategoryCard({
  category,
  onClick,
  tabIndex,
  isPriority,
}: {
  category: TGetCategory;
  onClick: () => void;
  tabIndex: number;
  isPriority: boolean;
}) {
  return (
    <motion.div
      variants={CARD_ANIMATION}
      onClick={onClick}
      role="button"
      tabIndex={tabIndex}
      aria-label={`View category: ${category.name}`}
      className="
        group
        bg-card
        border border-border
        rounded-xl
        shadow-sm
        transition
        duration-300
        overflow-hidden
        cursor-pointer
        flex flex-col
        min-h-0
        focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-primary
        hover:shadow-md
        hover:-translate-y-1
        active:scale-95
      "
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
    >
      {/* Image Block */}
      <div className="relative w-full h-[104px] xs:h-[118px] sm:h-[142px] md:h-[156px] lg:h-[184px] xl:h-[208px] 2xl:h-[232px] bg-muted">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          sizes="
            (max-width: 375px) 100vw,
            (max-width: 640px) 45vw,
            (max-width: 768px) 32vw,
            (max-width: 1024px) 22vw,
            (max-width: 1440px) 15vw,
            240px
          "
          priority={isPriority}
        />
      </div>
      {/* Content */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-4 md:py-5 gap-1 text-center">
        <h3 className="
          font-semibold
          text-[15px]
          xs:text-base
          md:text-lg
          text-card-foreground
          group-hover:text-accent
          transition-colors
          duration-300
          leading-snug
        ">
          {category.name}
        </h3>
      </div>
    </motion.div>
  );
}

/**
 * EventCategories - Responsive, premium card grid with enterprise layout/tokens
 */
export default function EventCategories({ categories }: { categories: TGetCategory[] }) {
  const router = useRouter();

  return (
    <section
      className="w-full bg-background py-10 md:py-14 lg:py-16 px-4"
      aria-label="Category selection"
    >
      <div className="w-full max-w-[1440px] mx-auto flex flex-col items-center px-2 sm:px-6 md:px-8 2xl:px-0">
        {/* Header */}
        <header className="w-full text-center mb-8 md:mb-12 flex flex-col items-center">
          <h2 className="
            font-bold
            leading-tight
            tracking-tight
            text-2xl xs:text-3xl sm:text-4xl md:text-[2.5rem] xl:text-5xl
            text-foreground
            mb-2
          ">
            Explore Our Categories
          </h2>
          <p className="
            text-muted-foreground
            max-w-xl
            mx-auto
            text-base md:text-lg
            font-normal
            ">
            Discover the best restaurants and dishes carefully selected to satisfy your cravings.
          </p>
        </header>
        {/* Responsive Categories Grid */}
        <motion.div
          className="
            w-full
            grid
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-6
            gap-4 md:gap-6 xl:gap-8
          "
          variants={STAGGER}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <AnimatePresence initial={false}>
            {categories.map((category, idx) => (
              <CategoryCard
                key={category.id || idx}
                category={category}
                tabIndex={0}
                isPriority={idx < 6}
                onClick={() => router.push(`/category/${category.id}`)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}