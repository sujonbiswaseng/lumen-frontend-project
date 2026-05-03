'use client';

import { TGetCategory } from "@/types/category.type";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import * as React from "react";

const CARD_ANIMATION = {
  initial: { opacity: 0, y: 32, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 24, scale: 0.97 },
  transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
};

const STAGGER = {
  animate: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.10,
    },
  },
};

export default function EventCategories({ categories }: { categories: TGetCategory[] }) {
  const router = useRouter();

  return (
    <section
      className="w-full bg-background py-10 md:py-14 lg:py-16 px-4"
      aria-label="Category selection"
    >
      <div className="w-full mx-auto max-w-[1440px] flex flex-col items-center px-2 sm:px-6 md:px-8 2xl:px-0">
        {/* Header */}
        <header className="w-full text-center mb-8 md:mb-12 flex flex-col items-center">
          <h2 className="font-bold leading-tight tracking-tight text-2xl xs:text-3xl sm:text-4xl md:text-[2.5rem] xl:text-5xl text-foreground mb-2">
            Explore Our Categories
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg font-normal">
            Discover the best restaurants and dishes carefully selected to satisfy your cravings.
          </p>
        </header>

        {/* Categories Grid */}
        <motion.div
          className="
            grid 
            grid-cols-2 
            sm:grid-cols-3 
            md:grid-cols-4 
            lg:grid-cols-6 
            gap-4 md:gap-6 xl:gap-8 w-full
            "
          variants={STAGGER}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <AnimatePresence initial={false}>
            {categories.map((category, index: number) => (
              <motion.div
                key={category.id || index}
                variants={CARD_ANIMATION}
                onClick={() => router.push(`/category/${category.id}`)}
                role="button"
                tabIndex={0}
                aria-label={`View category: ${category.name}`}
                className={`
                  group
                  bg-card border border-border
                  rounded-2xl
                  shadow-sm
                  hover:shadow-md
                  focus:shadow-ring focus-visible:outline-none
                  transition duration-300
                  overflow-hidden
                  cursor-pointer
                  flex flex-col
                  hover:-translate-y-1
                  focus-visible:ring-2 focus-visible:ring-primary
                  active:scale-98
                  min-h-0
                `}
                whileHover={{ scale: 1.025 }}
                whileTap={{ scale: 0.98 }}
                onKeyPress={e => {
                  if (e.key === "Enter" || e.key === " ") router.push(`/category/${category.id}`);
                }}
              >
                {/* Image */}
                <div className="relative w-full h-[96px] xs:h-[110px] sm:h-[136px] md:h-[145px] lg:h-[172px] xl:h-[184px] 2xl:h-[200px] bg-muted">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    sizes="
                      (max-width: 375px) 100vw,
                      (max-width: 640px) 43vw,
                      (max-width: 768px) 30vw,
                      (max-width: 1024px) 22vw,
                      (max-width: 1440px) 15vw,
                      240px
                    "
                    priority={index < 6}
                  />
                </div>
                {/* Content */}
                <div className="flex-1 flex flex-col justify-center items-center px-4 py-3 sm:py-4 gap-1 text-center">
                  <h3 className="font-semibold text-[14px] xs:text-base md:text-lg text-card-foreground group-hover:text-accent transition-colors duration-300">
                    {category.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}