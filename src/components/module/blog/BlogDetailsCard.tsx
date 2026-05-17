"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { TResponseBlog } from "@/types/blog.type";
import { IBaseUser } from "@/types/user.types";

// --- Motion Variants ---
const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    transition: { duration: 0.18, ease: "easeOut" },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const stagger: Variants = {
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.04,
    },
  },
};

// --- Card Component ---
export function BlogDetailsCard({
  blog,
}: {
  blog:TResponseBlog<{author:IBaseUser}>;
}) {
  const images = blog.images?.length ? blog.images : ["/placeholder.png"];
  const [activeImage, setActiveImage] = useState(images[0]);
  const formattedDate = useMemo(() => {
    return new Date(blog.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [blog.createdAt]);
  return (
    <section
      className="w-full bg-background min-h-[calc(100dvh-5rem)] pt-16 sm:pt-20 pb-8 sm:pb-12 lg:pb-14"
      aria-labelledby="blog-title"
    >
      <div className="mx-auto flex w-full max-w-[1480px] justify-center px-6">
        <motion.article
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="
            flex w-full min-h-[calc(100dvh-9rem)] max-w-none flex-col
            overflow-hidden rounded-2xl border border-border
            bg-card shadow-sm lg:rounded-[2rem]
          "
        >
          <div className="grid h-auto min-h-0 w-full flex-1 grid-cols-1 lg:grid-cols-[1.08fr_0.92fr] lg:min-h-[calc(100dvh-11rem)]">
            {/* === Left: Image Gallery === */}
            <div className="flex min-h-[18rem] flex-col gap-6 border-b border-border bg-card p-4 sm:p-6 lg:min-h-0 lg:flex-1 lg:border-r lg:border-b-0 lg:p-8">
              {/* --- Main Image --- */}
              <div className="relative flex min-h-[16rem] flex-1 items-center overflow-hidden rounded-3xl border border-border bg-muted aspect-[4/4.6] lg:min-h-[22rem] lg:aspect-auto lg:max-h-none">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImage}
                    className="w-full h-full relative"
                    variants={imageVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <Image
                      src={activeImage}
                      alt={blog.title}
                      fill
                      priority
                      className="object-cover select-none transition-transform duration-300"
                      sizes="(max-width:1024px) 100vw, 50vw"
                    />
                  </motion.div>
                </AnimatePresence>
                {/* --- Badge --- */}
                <div className="absolute left-4 top-4 px-4 py-2 rounded-full border border-border bg-background/90 backdrop-blur-sm">
                  <span className="text-xs font-semibold uppercase tracking-wide text-foreground">
                    Featured Article
                  </span>
                </div>
              </div>
              {/* --- Thumbnails --- */}
              <div className="flex flex-wrap gap-4 mt-2 w-full">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    aria-label={`Show image ${idx + 1}`}
                    className={[
                      "group relative h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border overflow-hidden flex items-center justify-center transition-all duration-300",
                      img === activeImage
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-border hover:border-primary hover:ring-primary/10",
                    ].join(" ")}
                    tabIndex={0}
                  >
                    <Image
                      src={img}
                      alt={`Preview ${idx + 1}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex h-full min-h-[18rem] w-full flex-col justify-between bg-card p-5 sm:p-7 lg:min-h-0 lg:flex-1 lg:p-10">
              <motion.div
                variants={stagger}
                initial="visible"
                animate="visible"
                className="w-full h-full flex flex-col"
              >
                {/* --- Badge --- */}
                <motion.div
                  variants={fadeUp}
                  className="inline-flex items-center rounded-full bg-secondary px-4 py-2 mb-2"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-secondary-foreground">
                    Modern SaaS Blog
                  </span>
                </motion.div>
                {/* --- Title --- */}
                <motion.h1
                  id="blog-title"
                  variants={fadeUp}
                  className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-card-foreground"
                >
                  {blog.title}
                </motion.h1>
                {/* --- Meta Row --- */}
                <motion.div
                  variants={fadeUp}
                  className="mt-6 flex flex-wrap items-center gap-6 text-sm text-muted-foreground"
                >
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>{formattedDate}</span>
                  </div>
                </motion.div>
                {/* --- Author Card --- */}
                <motion.div
                  variants={fadeUp}
                  className="mt-8 flex items-center bg-background border border-border rounded-2xl p-4 gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative h-14 w-14 rounded-full overflow-hidden border border-border">
                      <Link href={blog.author.id}>
                      <Image
                        src={blog.author.image || "/placeholder.png"}
                        alt={blog.author.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                      </Link>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="font-semibold text-card-foreground text-base leading-tight truncate" title={blog.author.name}>
                        {blog.author.name}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate" title={blog.author.email}>
                        {blog.author.email}
                      </p>
                      {blog.author.phone && (
                        <p className="text-sm text-muted-foreground truncate" title={blog.author.phone}>
                          {blog.author.phone}
                        </p>
                      )}
                      <span
                        className={`inline-flex items-center px-3 py-1 mt-1 rounded-full text-xs font-medium ${
                          blog.author.isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground border border-border"
                        }`}
                        aria-label={blog.author.isActive ? "Active user" : "Inactive user"}
                      >
                        {blog.author.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
               
                  </div>
                </motion.div>
                {/* --- Overview --- */}
                <motion.div
                  variants={fadeUp}
                  className="mt-10"
                >
                  <h2 className="text-xl font-semibold text-foreground">Overview</h2>
                  <p className="mt-4 text-base leading-8 text-muted-foreground">{blog.content}</p>
                </motion.div>
              </motion.div>
              {/* --- Footer CTA --- */}
              <motion.div
                variants={fadeUp}
                className="mt-12 flex flex-col gap-6 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Continue Reading</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Explore the complete story and full details.
                  </p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{
                    type: "spring",
                    duration: 0.3,
                    stiffness: 350,
                    damping: 22,
                  }}
                  className="inline-flex"
                >
                  <Link
                    href={`/blogs/${blog.id}`}
                    className="
                      inline-flex items-center justify-center gap-2
                      rounded-full 
                      bg-primary px-7 py-3
                      text-sm font-semibold text-primary-foreground
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
                      transition-opacity hover:opacity-90
                    "
                  >
                    Explore Now
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
