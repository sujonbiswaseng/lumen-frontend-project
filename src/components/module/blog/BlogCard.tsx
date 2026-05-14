"use client";
import { TResponseBlog } from "@/types/blog.type";
import { IBaseEvent, TPagination } from "@/types/event.types";
import { IBaseUser } from "@/types/user.types";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ImageSkeleton from "@/components/ImageSkeleton";
import BlogCardSkeleton from "@/components/Skeleton/BlogCardSkeleton";
import Image from "next/image";
import PaginationPage from "../event/Pagination";
import { useFilter } from "@/components/ReusableFilter";
import { TFilterField } from "@/types/filter.types";
import { FilterPanel } from "@/components/Filter";
import Link from "next/link";
import NotFoundItem from "@/components/NotFoundItem";

const DEFAULT_AUTHOR_AVATAR = "/logo.png";
const DEFAULT_BLOG_IMAGE = "/logo.png";

interface BlogCardProps {
  blogs: TResponseBlog<{ author: IBaseUser; event: IBaseEvent }>[];
  pagination: TPagination;
}

// Framer motion variants
const cardVariants = {
  initial: { opacity: 0, y: 36, scale: 0.975 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 16, scale: 0.98 },
};

const imageVariants = {
  initial: { opacity: 0, scale: 1.025 },
  animate: { opacity: 1, scale: 1 },
};

const BlogCard: React.FC<BlogCardProps> = ({ blogs, pagination }) => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();


  const [BlogsData, setBlogsData] = useState<
    TResponseBlog<{ author: IBaseUser; event: IBaseEvent }>[]
  >();

  useEffect(() => {
    if(blogs.length>0){
      setBlogsData(blogs || []);
      setIsLoading(false)
    }else{
      setIsLoading(true)
    }
    
  }, [blogs]);

  // Filters logic
  const { updateFilters, reset, isPending } = useFilter();
  const [form, setForm] = useState({
    search: ""
  });

  const handleChange = useCallback(
    (key: keyof typeof form, value: string ) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleApply = () => updateFilters(form);
  const handleReset = () => {
    setForm({ search: ""});
    reset();
  };

  const fields: TFilterField[] = [
    {
      type: "text",
      name: "search",
      value: form.search,
      placeholder: "Search...",
      onChange: (val) => handleChange("search", val),
    },
  ];

  // Handle view navigation
  const handleView = (id: string) => {
    router.push(`/blogs/${id}`);
  };

  if(!blogs.length){
    <NotFoundItem content="No blogs found." emoji="📝" /> 
  }
  return (
    <section
      className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 md:px-8 py-6"
    >
      {/* Filter Panel */}
      <section className="mb-8 w-full">
        <FilterPanel
          fields={fields}
          onApply={handleApply}
          onReset={handleReset}
          isPending={isPending}
        />
      </section>

      {/* Blog list content */}
      <div className="w-full flex flex-wrap justify-center gap-6">
        {isLoading && blogs.length!==0 ? (
          <div className="w-full flex justify-center gap-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <BlogCardSkeleton
                key={idx}
                className="max-w-[400px] min-w-[320px] w-full"
                contentLines={4}
                minHeight="min-h-[370px]"
                showActions
                showAvatar
              />
            ))}
          </div>
        ) : (
          <AnimatePresence>

{BlogsData && BlogsData.length > 0 ? (
            <motion.div
              className="w-full max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
               gap-8"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.10,
                  },
                },
              }}
            >
              {BlogsData.map((blog) => (
                <motion.article
                  key={blog.id}
                  className="
                    group relative flex flex-col bg-card border border-border rounded-2xl shadow transition-shadow
                    hover:shadow-lg focus-within:ring-2 focus-within:ring-primary/25
                    overflow-hidden max-w-[420px] min-w-[320px] w-full mx-auto
                  "
                  initial={{ opacity: 0, y: 36, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 24, scale: 0.97 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  whileHover={{ scale: 1.018 }}
                  tabIndex={0}
                  aria-label={`${blog.title} - View blog`}
                >
                  {/* Blog image as a decorative top section */}
                  <div className="aspect-[16/9] w-full bg-muted border-b border-border overflow-hidden">
                    <motion.div
                      initial={{ opacity: 0, scale: 1.03 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                      className="w-full h-full"
                    >
                      {blog.images && blog.images.length > 0 ? (
                        <ImageSkeleton
                          src={blog.images[0]}
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03] bg-muted"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full bg-muted text-muted-foreground font-semibold text-lg select-none">
                          No Image
                        </div>
                      )}
                    </motion.div>
                    {/* Accent shadow/top underline effect */}
                    <span className="absolute top-0 left-0 w-full h-[3px] bg-accent block z-10 opacity-80" aria-hidden="true" />
                  </div>
                  {/* Card Content */}
                  <div className="flex flex-col flex-1 px-6 py-6 gap-4 bg-card">
                    {/* Title */}
                    <h3 className="font-bold text-lg md:text-xl text-card-foreground tracking-tight leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-300">
                      {blog.title}
                    </h3>
                    {/* Excerpt */}
                    <p className="text-muted-foreground text-sm md:text-base line-clamp-3 min-h-[54px]">
                      {blog.content}
                    </p>
                    {/* Author, Meta, Event */}
                    <div className="flex items-center justify-between gap-2 mt-2">
                      {/* Author */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center overflow-hidden shadow-sm">
                          {blog.author?.image ? (
                           <Link href={`/profile/${blog.author.id}`}>
                            <img
                              src={blog.author.image}
                              alt={blog.author.name}
                              className="w-full h-full object-cover"
                              width={40}
                              height={40}
                              loading="lazy"
                            />
                           </Link>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-base font-semibold text-muted-foreground select-none">
                              {blog.author?.name?.[0] || "U"}
                            </div>
                          )}
                        </div>
                        <span className="truncate text-sm font-medium text-card-foreground">
                          {blog.author?.name || "Unknown"}
                        </span>
                      </div>
                      {/* Meta -> date + event tag */}
                      <div className="flex flex-col items-end gap-1">
                        {/* Created At */}
                        {blog.createdAt ? (
                          <span className="text-xs text-muted-foreground">
                            {new Date(blog.createdAt).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        ) : null}
                        {blog.event?.title && (
                          <span className="mt-1 inline-block bg-secondary text-secondary-foreground px-2 py-0.5 rounded font-semibold text-xs shadow-sm">
                            {blog.event.title}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* CTA Button */}
                    <div className="mt-6 flex">
                      <motion.button
                        className="
                          inline-flex items-center justify-center gap-1 px-5 py-2.5 rounded-lg
                          text-sm font-semibold
                          bg-primary text-primary-foreground ring-0 outline-none transition
                          shadow-sm hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary/50
                        "
                        onClick={() => { window.location.href = `/blogs/${blog.id}`; }}
                        whileTap={{ scale: 0.97 }}
                        whileHover={{ scale: 1.04 }}
                        transition={{ type: "spring", stiffness: 280, damping: 22 }}
                        aria-label={`Read more about ${blog.title}`}
                      >
                        Read More
                        <svg
                          className="ml-1 w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7l7 7-7 7" />
                        </svg>
                      </motion.button>
                    </div>
                  </div>
                  {/* Card outline/focus effect for accessibility */}
                  <span className="pointer-events-none absolute inset-0 ring-0 group-focus-visible:ring-2 group-focus-visible:ring-primary/40 rounded-2xl" />
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <div className="w-full max-w-[1440px] mx-auto flex items-center justify-center py-16 bg-background">
              <span className="text-muted-foreground text-lg">No blogs found.</span>
            </div>
          )}
            
           
          </AnimatePresence>
        )}
      </div>

      {/* Pagination */}
      <div className="max-w-[1440px] mx-auto w-full mt-8 flex justify-center">
        <PaginationPage pagination={pagination} />
      </div>
    </section>
  );
};

export default BlogCard;
